import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/errors"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// GET /api/domains/[id]
// Returns a single domain with its latest scan and security scores
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const domain = await prisma.domain.findUnique({
      where: { id },
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
            securityScores: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }

    // Check if user has access to this domain's team
    const hasAccess = await prisma.teamMember.findFirst({
      where: {
        teamId: domain.teamId,
        userId: session.user.id,
      },
    })

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({
      domain: {
        ...domain,
        latestScan: domain.scans[0] || null,
        scans: undefined, // Remove scans array
      },
    })
  } catch (error) {
    return handleApiError(error, {
      endpoint: `/api/domains/${id}`,
      method: 'GET',
      req,
    })
  }
}
