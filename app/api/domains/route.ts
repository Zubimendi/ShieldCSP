import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/domains
// Returns list of domains for the first team (for now)
export async function GET() {
  try {
    const team = await prisma.team.findFirst({
      orderBy: { createdAt: "asc" },
    })

    if (!team) {
      return NextResponse.json({ domains: [] })
    }

    const domains = await prisma.domain.findMany({
      where: { teamId: team.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ domains })
  } catch (error) {
    console.error("[GET /api/domains]", error)
    return NextResponse.json(
      { error: "Failed to load domains" },
      { status: 500 },
    )
  }
}

