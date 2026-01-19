import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { executeXssTest } from "@/lib/xss/engine"

const createTestSchema = z.object({
  teamId: z.string().uuid(),
  payload: z.string().min(1),
  cspPolicy: z.string().optional().nullable(),
  sanitizer: z.string().optional().nullable(),
  context: z.string().optional().nullable(),
  testName: z.string().optional().nullable(),
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

    // Execute the XSS test via engine (modeled, no real execution)
    const result = executeXssTest({
      payload: data.payload,
      cspPolicy: data.cspPolicy,
      sanitizer: (data.sanitizer as any) || "none",
      context: data.context,
    })

    const test = await prisma.xssTest.create({
      data: {
        teamId: data.teamId,
        payload: data.payload,
        cspPolicy: data.cspPolicy ?? undefined,
        sanitizer: data.sanitizer ?? undefined,
        context: data.context ?? undefined,
        testName: data.testName ?? undefined,
        wasBlocked: result.wasBlocked,
        executedSuccessfully: result.executedSuccessfully,
        sanitizedOutput: result.sanitizedOutput ?? undefined,
        violationTriggered: result.violationTriggered,
      },
    })

    return NextResponse.json({ test, result }, { status: 201 })
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

