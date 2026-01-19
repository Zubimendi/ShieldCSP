import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requirePermission, isTeamOwner } from '@/lib/teams/permissions';
import { slugify } from '@/lib/utils';
import { createAuditLogFromNextRequest } from '@/lib/audit';

const updateTeamSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  plan: z.enum(['free', 'pro', 'enterprise']).optional(),
});

// GET /api/teams/[teamId]
// Get team details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;

    // Check if user is a member
    await requirePermission(session.user.id, teamId, 'team:read');

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
        _count: {
          select: {
            domains: true,
            members: true,
            generatedConfigs: true,
            xssTests: true,
            apiKeys: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Get user's role
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: session.user.id,
        },
      },
      select: {
        role: true,
      },
    });

    return NextResponse.json(
      { team: { ...team, userRole: membership?.role || null } },
      { status: 200 },
    );
  } catch (error) {
    console.error('[GET /api/teams/[teamId]]', error);

    if (error instanceof Error && error.message.includes('Permission denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to load team' },
      { status: 500 },
    );
  }
}

// PATCH /api/teams/[teamId]
// Update team (name, plan)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;
    const json = await req.json();
    const updates = updateTeamSchema.parse(json);

    // Check permissions
    await requirePermission(session.user.id, teamId, 'team:update');

    // If updating name, generate new slug
    let slugUpdate = {};
    if (updates.name) {
      const baseSlug = slugify(updates.name);
      let slug = baseSlug;
      let counter = 1;

      while (
        await prisma.team.findFirst({
          where: {
            slug,
            NOT: { id: teamId },
          },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      slugUpdate = { slug };
    }

    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        ...updates,
        ...slugUpdate,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            domains: true,
            members: true,
          },
        },
      },
    });

    // Get user's role
    const membership = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: session.user.id,
        },
      },
      select: {
        role: true,
      },
    });

    return NextResponse.json(
      { team: { ...team, userRole: membership?.role || null } },
      { status: 200 },
    );
  } catch (error) {
    console.error('[PATCH /api/teams/[teamId]]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.flatten() },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message.includes('Permission denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to update team' },
      { status: 500 },
    );
  }
}

// DELETE /api/teams/[teamId]
// Delete team (owner only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId } = await params;

    // Only owner can delete team
    const isOwner = await isTeamOwner(session.user.id, teamId);
    if (!isOwner) {
      return NextResponse.json(
        { error: 'Only team owner can delete the team' },
        { status: 403 },
      );
    }

    // Get team name before deletion for audit log
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { name: true },
    });

    // Delete team (cascade will handle related records)
    await prisma.team.delete({
      where: { id: teamId },
    });

    // Audit log (before deletion, teamId still exists in context)
    await createAuditLogFromNextRequest(req, {
      teamId,
      userId: session.user.id,
      action: 'team:delete',
      resourceType: 'team',
      resourceId: teamId,
      metadata: {
        teamName: team?.name,
      },
    });

    return NextResponse.json(
      { message: 'Team deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[DELETE /api/teams/[teamId]]', error);
    return NextResponse.json(
      { error: 'Failed to delete team' },
      { status: 500 },
    );
  }
}
