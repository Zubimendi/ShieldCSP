import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requirePermission, isTeamOwner, getUserTeamRole } from '@/lib/teams/permissions';

const updateMemberSchema = z.object({
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
});

// PATCH /api/teams/[teamId]/members/[userId]
// Update member role
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; userId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, userId } = await params;
    const json = await req.json();
    const { role } = updateMemberSchema.parse(json);

    // Check permissions
    await requirePermission(session.user.id, teamId, 'team:manage-members');

    // Special handling for owner role transfer
    if (role === 'owner') {
      const isCurrentUserOwner = await isTeamOwner(session.user.id, teamId);
      if (!isCurrentUserOwner) {
        return NextResponse.json(
          { error: 'Only current owner can transfer ownership' },
          { status: 403 },
        );
      }

      // Transfer ownership: make current owner admin, new owner becomes owner
      await prisma.$transaction([
        // Update team owner
        prisma.team.update({
          where: { id: teamId },
          data: { ownerId: userId },
        }),
        // Update old owner's role to admin
        prisma.teamMember.update({
          where: {
            teamId_userId: {
              teamId,
              userId: session.user.id,
            },
          },
          data: { role: 'admin' },
        }),
        // Update new owner's role
        prisma.teamMember.update({
          where: {
            teamId_userId: {
              teamId,
              userId,
            },
          },
          data: { role: 'owner' },
        }),
      ]);

      const member = await prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
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
      });

      return NextResponse.json({ member }, { status: 200 });
    }

    // Regular role update
    const member = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: { role },
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
    });

    return NextResponse.json({ member }, { status: 200 });
  } catch (error) {
    console.error('[PATCH /api/teams/[teamId]/members/[userId]]', error);

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
      { error: 'Failed to update team member' },
      { status: 500 },
    );
  }
}

// DELETE /api/teams/[teamId]/members/[userId]
// Remove member from team
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ teamId: string; userId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teamId, userId } = await params;

    // Check permissions
    await requirePermission(session.user.id, teamId, 'team:manage-members');

    // Prevent removing the owner
    const targetUserRole = await getUserTeamRole(userId, teamId);
    if (targetUserRole === 'owner') {
      return NextResponse.json(
        { error: 'Cannot remove team owner. Transfer ownership first.' },
        { status: 400 },
      );
    }

    // Prevent removing yourself if you're the only admin/owner
    if (userId === session.user.id) {
      const currentUserRole = await getUserTeamRole(session.user.id, teamId);
      if (currentUserRole === 'owner' || currentUserRole === 'admin') {
        const adminCount = await prisma.teamMember.count({
          where: {
            teamId,
            role: {
              in: ['owner', 'admin'],
            },
          },
        });

        if (adminCount <= 1) {
          return NextResponse.json(
            { error: 'Cannot remove the only admin/owner. Add another admin first.' },
            { status: 400 },
          );
        }
      }
    }

    // Remove member
    await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    return NextResponse.json(
      { message: 'Member removed successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[DELETE /api/teams/[teamId]/members/[userId]]', error);

    if (error instanceof Error && error.message.includes('Permission denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 },
    );
  }
}
