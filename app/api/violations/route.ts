import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { handleApiError } from "@/lib/errors"

// GET /api/violations
// Returns recent violations with optional filters: ?domainId=&severity=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const domainId = searchParams.get("domainId") || undefined
    const severity = searchParams.get("severity") || undefined

    const violations = await prisma.violation.findMany({
      where: {
        ...(domainId ? { domainId } : {}),
        ...(severity ? { severity } : {}),
      },
      orderBy: { lastSeenAt: "desc" },
      take: 50,
      include: {
        domain: {
          select: {
            id: true,
            url: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({ violations })
  } catch (error) {
    return handleApiError(error, {
      endpoint: '/api/violations',
      method: 'GET',
      req,
    })
  }
}

