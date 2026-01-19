import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { executeScan } from "@/lib/scanner/scan-executor"
import { withCache, cacheKeys, invalidateDomainCache, invalidateDashboardCache } from "@/lib/cache"
import { enqueueScanJob } from "@/lib/queue/job-queue"
import { isRedisAvailable } from "@/lib/redis"
import { handleApiError } from "@/lib/errors"

const startScanSchema = z.object({
  domainId: z.string().uuid(),
  scanType: z.enum(["full", "quick", "headers-only"]).default("full"),
  async: z.boolean().optional().default(false), // If true, queue the scan instead of executing immediately
})

// GET /api/scans
// Basic listing of recent scans across all domains (limited for dashboard)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const domainId = searchParams.get("domainId")
    const limit = parseInt(searchParams.get("limit") || "20", 10)

    const cacheKey = domainId 
      ? `${cacheKeys.scanResultsByDomain(domainId)}:limit:${limit}`
      : `scans:recent:limit:${limit}`

    const scans = await withCache(
      cacheKey,
      async () => {
        const where = domainId ? { domainId } : {}

        return await prisma.scan.findMany({
          where,
          orderBy: { scannedAt: "desc" },
          take: limit,
          include: {
            domain: {
              select: {
                id: true,
                url: true,
                name: true,
              },
            },
            securityScores: {
              take: 15, // Limit security scores per scan
            },
          },
        })
      },
      600, // 10 minutes TTL
    )

    return NextResponse.json({ scans })
  } catch (error) {
    return handleApiError(error, {
      endpoint: '/api/scans',
      method: 'GET',
      req,
    })
  }
}

// POST /api/scans
// Creates a new scan record and executes the actual security scan
// Supports both synchronous (default) and asynchronous (queued) execution
export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const { domainId, scanType, async } = startScanSchema.parse(json)

    // If async and Redis is available, queue the job
    if (async && isRedisAvailable()) {
      try {
        const jobId = await enqueueScanJob(domainId, scanType, {
          priority: 5, // Higher priority for manual scans
          maxRetries: 3,
        });

        // Create pending scan record
        const pendingScan = await prisma.scan.create({
          data: {
            domainId,
            scanType,
            status: "pending",
          },
        });

        return NextResponse.json(
          {
            scan: pendingScan,
            jobId,
            message: "Scan queued for background processing",
          },
          { status: 202 }, // 202 Accepted
        );
      } catch (queueError: any) {
        console.error("[POST /api/scans] Failed to queue job:", queueError);
        // Fall through to synchronous execution
      }
    }

    // Synchronous execution (default or fallback)
    // Create pending scan record first
    const pendingScan = await prisma.scan.create({
      data: {
        domainId,
        scanType,
        status: "running",
      },
    })

    // Execute the scan (this will update the scan record)
    const result = await executeScan(domainId, scanType)

    if (!result.success) {
      // Update scan to failed status
      await prisma.scan.update({
        where: { id: pendingScan.id },
        data: {
          status: "failed",
          errorMessage: result.error,
        },
      })

      return NextResponse.json(
        { error: result.error, scanId: pendingScan.id },
        { status: 500 },
      )
    }

    // Fetch the completed scan with all relations
    const completedScan = await prisma.scan.findUnique({
      where: { id: result.scanId },
      include: {
        domain: true,
        securityScores: true,
      },
    })

    // Invalidate caches after new scan
    if (completedScan?.domain) {
      await Promise.all([
        invalidateDomainCache(completedScan.domain.id),
        invalidateDashboardCache(completedScan.domain.teamId),
      ]);
    }

    return NextResponse.json({ scan: completedScan }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request. Please check your input.", details: error.flatten() },
        { status: 400 },
      )
    }

    return handleApiError(error, {
      endpoint: '/api/scans',
      method: 'POST',
      req,
    })
  }
}

