import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateCode } from '@/lib/codegen/generator';
import type { Framework, CspType } from '@/lib/types';

const codeGenSchema = z.object({
  framework: z.enum(['nextjs-app', 'nextjs-pages', 'express', 'generic']),
  cspType: z.enum(['nonce', 'hash', 'strict-dynamic']),
  enableHsts: z.boolean().default(true),
  hstsMaxAge: z.number().int().min(0).max(2147483647).default(31536000),
  enableFrameOptions: z.boolean().default(true),
  frameOptions: z.enum(['DENY', 'SAMEORIGIN']).default('DENY'),
  enableContentTypeOptions: z.boolean().optional().default(true),
  enableReferrerPolicy: z.boolean().optional().default(true),
  referrerPolicy: z.string().optional().default('strict-origin-when-cross-origin'),
  enablePermissionsPolicy: z.boolean().optional().default(true),
  domainId: z.string().uuid().optional(), // Optional: associate with a domain
  saveConfig: z.boolean().optional().default(false), // Whether to save to database
});

// POST /api/codegen
// Generate security header middleware code
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const options = codeGenSchema.parse(json);

    // Generate the code
    const generated = generateCode({
      framework: options.framework,
      cspType: options.cspType,
      enableHsts: options.enableHsts,
      hstsMaxAge: options.hstsMaxAge,
      enableFrameOptions: options.enableFrameOptions,
      frameOptions: options.frameOptions,
      enableContentTypeOptions: options.enableContentTypeOptions,
      enableReferrerPolicy: options.enableReferrerPolicy,
      referrerPolicy: options.referrerPolicy,
      enablePermissionsPolicy: options.enablePermissionsPolicy,
    });

    // Optionally save to database
    if (options.saveConfig) {
      // Get user's first team (or create one if none exists)
      let team = await prisma.team.findFirst({
        where: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      });

      if (!team) {
        // Create a default team for the user
        team = await prisma.team.create({
          data: {
            name: `${session.user.name || 'My'} Team`,
            slug: `${session.user.email?.split('@')[0] || 'team'}-${Date.now()}`,
            ownerId: session.user.id,
            members: {
              create: {
                userId: session.user.id,
                role: 'owner',
              },
            },
          },
        });
      }

      // Save the generated config
      await prisma.generatedConfig.create({
        data: {
          teamId: team.id,
          domainId: options.domainId || null,
          framework: options.framework,
          cspType: options.cspType,
          generatedCode: generated.code,
          configOptions: {
            enableHsts: options.enableHsts,
            hstsMaxAge: options.hstsMaxAge,
            enableFrameOptions: options.enableFrameOptions,
            frameOptions: options.frameOptions,
            enableContentTypeOptions: options.enableContentTypeOptions,
            enableReferrerPolicy: options.enableReferrerPolicy,
            referrerPolicy: options.referrerPolicy,
            enablePermissionsPolicy: options.enablePermissionsPolicy,
          },
          createdBy: session.user.id,
        },
      });
    }

    return NextResponse.json(generated, { status: 200 });
  } catch (error) {
    console.error('[POST /api/codegen]', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body', details: error.flatten() },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 },
    );
  }
}

// GET /api/codegen
// List saved generated configs for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's teams
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    const teamIds = teams.map((t) => t.id);

    // Get saved configs
    const configs = await prisma.generatedConfig.findMany({
      where: {
        teamId: {
          in: teamIds,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
      include: {
        domain: {
          select: {
            id: true,
            url: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ configs }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/codegen]', error);
    return NextResponse.json(
      { error: 'Failed to load configs' },
      { status: 500 },
    );
  }
}
