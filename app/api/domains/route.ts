import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/errors"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const createDomainSchema = z.object({
  url: z.string().url().or(z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)),
  name: z.string().optional(),
  scanFrequency: z.enum(['hourly', 'daily', 'weekly', 'manual']).default('daily'),
  notifyOnViolations: z.boolean().default(true),
})

// GET /api/domains
// Returns list of domains (for now: all domains in the system, for demo/testing)
export async function GET(req: NextRequest) {
  try {
    const domains = await prisma.domain.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        scans: {
          orderBy: { scannedAt: "desc" },
          take: 1,
          select: {
            id: true,
            overallGrade: true,
            overallScore: true,
            scannedAt: true,
            status: true,
          },
        },
      },
    })

    // Transform to include latestScan
    const domainsWithScans = domains.map((domain) => ({
      ...domain,
      latestScan: domain.scans[0] || null,
      scans: undefined, // Remove scans array
    }))

    return NextResponse.json({ domains: domainsWithScans })
  } catch (error) {
    return handleApiError(error, {
      endpoint: '/api/domains',
      method: 'GET',
      req,
    })
  }
}

// POST /api/domains
// Create a new domain
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const data = createDomainSchema.parse(json)

    // Get user's first team (or create one)
    let team = await prisma.team.findFirst({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    })

    if (!team) {
      // Create a default team for the user
      team = await prisma.team.create({
        data: {
          name: `${session.user.name || 'My'} Team`,
          slug: `${session.user.email?.split('@')[0] || 'team'}-${Date.now()}`,
          ownerId: session.user.id,
          members: {
            create: {
              userId: session.user.id,
              role: 'owner',
            },
          },
        },
      })
    }

    // Normalize URL
    let normalizedUrl = data.url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = `https://${normalizedUrl}`
    }

    // Check if domain already exists for this team
    const existing = await prisma.domain.findUnique({
      where: {
        teamId_url: {
          teamId: team.id,
          url: normalizedUrl,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Domain already exists in this team" },
        { status: 400 }
      )
    }

    // Create domain
    const domain = await prisma.domain.create({
      data: {
        teamId: team.id,
        url: normalizedUrl,
        name: data.name || new URL(normalizedUrl).hostname,
        scanFrequency: data.scanFrequency,
        notifyOnViolations: data.notifyOnViolations,
        createdBy: session.user.id,
      },
      include: {
        scans: {
          orderBy: { scannedAt: "desc" },
          take: 1,
        },
      },
    })

    return NextResponse.json(
      {
        domain: {
          ...domain,
          latestScan: domain.scans[0] || null,
          scans: undefined,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request. Please check your input.", details: error.flatten() },
        { status: 400 }
      )
    }

    return handleApiError(error, {
      endpoint: '/api/domains',
      method: 'POST',
      req,
    })
  }
}
