import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { requirePermission } from "@/lib/teams/permissions"
import { createAuditLogFromNextRequest } from "@/lib/audit"

const updateApiKeySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  scopes: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
})

// PATCH /api/api-keys/[id]
// Update API key metadata (name, scopes, expiry)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const json = await req.json()
    const data = updateApiKeySchema.parse(json)

    const existing = await prisma.apiKey.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    // Permission check on owning team
    await requirePermission(
      session.user.id,
      existing.teamId,
      "api-key:create",
    )

    // Build update data conditionally
    const updateData: {
      name?: string | null;
      scopes?: Prisma.InputJsonValue;
      expiresAt?: Date | null;
    } = {};

    if (data.name !== undefined) {
      updateData.name = data.name ?? existing.name;
    }
    if (data.scopes !== undefined) {
      updateData.scopes = data.scopes as Prisma.InputJsonValue;
    }
    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt
        ? new Date(data.expiresAt)
        : null;
    }

    const updated = await prisma.apiKey.update({
      where: { id },
      data: updateData,
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

    // Audit log
    await createAuditLogFromNextRequest(req, {
      teamId: existing.teamId,
      userId: session.user.id,
      action: 'api-key:update',
      resourceType: 'api-key',
      resourceId: id,
      metadata: {
        keyPrefix: existing.keyPrefix,
        changes: data,
      },
    })

    return NextResponse.json({ apiKey: updated }, { status: 200 })
  } catch (error) {
    console.error("[PATCH /api/api-keys/[id]]", error)

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
      { error: "Failed to update API key" },
      { status: 500 },
    )
  }
}

// DELETE /api/api-keys/[id]
// Delete an API key
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const existing = await prisma.apiKey.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    await requirePermission(
      session.user.id,
      existing.teamId,
      "api-key:delete",
    )

    // Audit log before deletion
    await createAuditLogFromNextRequest(req, {
      teamId: existing.teamId,
      userId: session.user.id,
      action: 'api-key:delete',
      resourceType: 'api-key',
      resourceId: id,
      metadata: {
        keyPrefix: existing.keyPrefix,
        name: existing.name,
      },
    })

    await prisma.apiKey.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "API key deleted successfully" },
      { status: 200 },
    )
  } catch (error) {
    console.error("[DELETE /api/api-keys/[id]]", error)

    if (error instanceof Error && error.message.includes("Permission denied")) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 },
    )
  }
}

