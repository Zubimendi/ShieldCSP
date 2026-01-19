import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateApiKey } from "@/lib/api-keys"
import { requirePermission } from "@/lib/teams/permissions"
import { createAuditLogFromNextRequest } from "@/lib/audit"

const createApiKeySchema = z.object({
  teamId: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  scopes: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional(),
})

// GET /api/api-keys
// List API keys for teams the user can manage
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get("teamId") || undefined

    // Fetch teams where user is a member
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
        ...(teamId ? { id: teamId } : {}),
      },
      select: {
        id: true,
      },
    })

    const teamIds = teams.map((t) => t.id)

    if (teamIds.length === 0) {
      return NextResponse.json({ apiKeys: [] }, { status: 200 })
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        teamId: {
          in: teamIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        teamId: true,
        keyPrefix: true,
        name: true,
        scopes: true,
        lastUsedAt: true,
        expiresAt: true,
        createdBy: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ apiKeys }, { status: 200 })
  } catch (error) {
    console.error("[GET /api/api-keys]", error)
    return NextResponse.json(
      { error: "Failed to load API keys" },
      { status: 500 },
    )
  }
}

// POST /api/api-keys
// Create a new API key for a team
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const data = createApiKeySchema.parse(json)

    // Permission check
    await requirePermission(session.user.id, data.teamId, "api-key:create")

    const expiresAt = data.expiresAt ? new Date(data.expiresAt) : null

    const generated = await generateApiKey({
      teamId: data.teamId,
      userId: session.user.id,
      name: data.name,
      scopes: data.scopes,
      expiresAt,
    })

    // Audit log
    await createAuditLogFromNextRequest(req, {
      teamId: data.teamId,
      userId: session.user.id,
      action: 'api-key:create',
      resourceType: 'api-key',
      resourceId: generated.id,
      metadata: {
        keyPrefix: generated.keyPrefix,
        name: generated.name,
        scopes: generated.scopes,
        hasExpiry: !!expiresAt,
      },
    })

    // Return plaintext key only once
    return NextResponse.json(
      {
        apiKey: {
          id: generated.id,
          teamId: generated.teamId,
          key: generated.key,
          keyPrefix: generated.keyPrefix,
          name: generated.name,
          scopes: generated.scopes,
          expiresAt: generated.expiresAt,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[POST /api/api-keys]", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 400 },
      )
    }

    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 },
    )
  }
}

