import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const startScanSchema = z.object({
  domainId: z.string().uuid(),
  scanType: z.enum(["full", "quick", "headers-only"]).default("full"),
})

// GET /api/scans
// Basic listing of recent scans across all domains (limited for dashboard)
export async function GET() {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: { scannedAt: "desc" },
      take: 20,
      include: {
        domain: true,
      },
    })

    return NextResponse.json({ scans })
  } catch (error) {
    console.error("[GET /api/scans]", error)
    return NextResponse.json(
      { error: "Failed to load scans" },
      { status: 500 },
    )
  }
}

// POST /api/scans
// Creates a new scan record and returns it (the actual HTTP scanning job will be wired later)
export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const { domainId, scanType } = startScanSchema.parse(json)

    const domain = await prisma.domain.findUnique({
      where: { id: domainId },
    })

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 },
      )
    }

    const scan = await prisma.scan.create({
      data: {
        domainId,
        scanType,
        status: "pending",
      },
    })

    return NextResponse.json({ scan }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/scans]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: "Failed to create scan" },
      { status: 500 },
    )
  }
}

