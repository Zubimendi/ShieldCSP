import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/policies
// For now this surfaces GeneratedConfig records as "policies" for the Policies page
export async function GET() {
  try {
    const configs = await prisma.generatedConfig.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        domain: true,
        team: true,
      },
    })

    return NextResponse.json({ policies: configs })
  } catch (error) {
    console.error("[GET /api/policies]", error)
    return NextResponse.json(
      { error: "Failed to load policies" },
      { status: 500 },
    )
  }
}

