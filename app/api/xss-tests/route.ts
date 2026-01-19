import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const createTestSchema = z.object({
  teamId: z.string().uuid(),
  payload: z.string().min(1),
  cspPolicy: z.string().optional(),
  sanitizer: z.string().optional(),
  context: z.string().optional(),
  testName: z.string().optional(),
})

// GET /api/xss-tests
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId") || undefined

    const tests = await prisma.xssTest.findMany({
      where: {
        ...(teamId ? { teamId } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ tests })
  } catch (error) {
    console.error("[GET /api/xss-tests]", error)
    return NextResponse.json(
      { error: "Failed to load XSS tests" },
      { status: 500 },
    )
  }
}

// POST /api/xss-tests
export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const data = createTestSchema.parse(json)

    const test = await prisma.xssTest.create({
      data: {
        teamId: data.teamId,
        payload: data.payload,
        cspPolicy: data.cspPolicy,
        sanitizer: data.sanitizer,
        context: data.context,
        testName: data.testName,
      },
    })

    return NextResponse.json({ test }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/xss-tests]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: "Failed to create XSS test" },
      { status: 500 },
    )
  }
}

