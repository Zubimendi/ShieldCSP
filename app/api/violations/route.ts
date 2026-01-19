import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

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
    })

    return NextResponse.json({ violations })
  } catch (error) {
    console.error("[GET /api/violations]", error)
    return NextResponse.json(
      { error: "Failed to load violations" },
      { status: 500 },
    )
  }
}

