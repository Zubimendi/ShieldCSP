import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { createAuditLogFromNextRequest } from '@/lib/audit';

const createTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(100),
  plan: z.enum(['free', 'pro', 'enterprise']).optional().default('free'),
});

// GET /api/teams
// List all teams the current user is a member of
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
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
          orderBy: {
            joinedAt: 'asc',
          },
        },
        _count: {
          select: {
            domains: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Add user's role to each team
    const teamsWithRoles = await Promise.all(
      teams.map(async (team) => {
        const membership = await prisma.teamMember.findUnique({
          where: {
            teamId_userId: {
              teamId: team.id,
              userId: session.user.id,
            },
          },
          select: {
            role: true,
          },
        });

        return {
          ...team,
          userRole: membership?.role || null,
        };
      }),
    );

    return NextResponse.json({ teams: teamsWithRoles }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/teams]', error);
    return NextResponse.json(
      { error: 'Failed to load teams' },
      { status: 500 },
    );
  }
}

// POST /api/teams
// Create a new team
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const { name, plan } = createTeamSchema.parse(json);

    // Generate unique slug
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    // Ensure slug is unique
    while (await prisma.team.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create team with owner as first member
    const team = await prisma.team.create({
      data: {
        name,
        slug,
        ownerId: session.user.id,
        plan,
        members: {
          create: {
            userId: session.user.id,
            role: 'owner',
          },
        },
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

    // Audit log
    await createAuditLogFromNextRequest(req, {
      teamId: team.id,
      userId: session.user.id,
      action: 'team:create',
      resourceType: 'team',
      resourceId: team.id,
      metadata: {
        teamName: team.name,
        plan: team.plan,
      },
    });

    return NextResponse.json(
      { team: { ...team, userRole: 'owner' } },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/teams]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 },
    );
  }
}
