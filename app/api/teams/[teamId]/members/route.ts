import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requirePermission, isTeamOwner, getUserTeamRole } from '@/lib/teams/permissions';

const addMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
});

const updateMemberSchema = z.object({
  role: z.enum(['owner', 'admin', 'member', 'viewer']),
});

// GET /api/teams/[teamId]/members
// List all team members
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

    const members = await prisma.teamMember.findMany({
      where: { teamId },
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
      orderBy: [
        { role: 'asc' }, // owner first, then admin, member, viewer
        { joinedAt: 'asc' },
      ],
    });

    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/teams/[teamId]/members]', error);

    if (error instanceof Error && error.message.includes('Permission denied')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { error: 'Failed to load team members' },
      { status: 500 },
    );
  }
}

// POST /api/teams/[teamId]/members
// Add a new member to the team
export async function POST(
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
    const { email, role } = addMemberSchema.parse(json);

    // Check permissions
    await requirePermission(session.user.id, teamId, 'team:manage-members');

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User with this email not found' },
        { status: 404 },
      );
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findUnique({
      where: {
        teamId_userId: {
          teamId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member of this team' },
        { status: 409 },
      );
    }

    // Add member
    const member = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user.id,
        role,
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

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/teams/[teamId]/members]', error);

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
      { error: 'Failed to add team member' },
      { status: 500 },
    );
  }
}
