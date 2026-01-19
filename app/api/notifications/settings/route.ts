import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/teams/permissions';

const updateSettingsSchema = z.object({
  teamId: z.string().uuid(),
  emailEnabled: z.boolean().optional(),
  slackWebhookUrl: z.string().url().nullable().optional(),
  discordWebhookUrl: z.string().url().nullable().optional(),
  notifyOnNewViolations: z.boolean().optional(),
  notifyOnScoreChange: z.boolean().optional(),
  notifyOnScanFailure: z.boolean().optional(),
  violationSeverityThreshold: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

// GET /api/notifications/settings
// Get notification settings for current user across all teams
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get('teamId');

    const where: any = {
      userId: session.user.id,
    };

    if (teamId) {
      where.teamId = teamId;
    }

    const settings = await prisma.notificationSetting.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/notifications/settings]', error);
    return NextResponse.json(
      { error: 'Failed to load notification settings' },
      { status: 500 },
    );
  }
}

// POST /api/notifications/settings
// Create or update notification settings
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const data = updateSettingsSchema.parse(json);

    // Check if user is a member of the team
    await requirePermission(session.user.id, data.teamId, 'team:read');

    // Upsert notification settings
    const settings = await prisma.notificationSetting.upsert({
      where: {
        teamId_userId: {
          teamId: data.teamId,
          userId: session.user.id,
        },
      },
      update: {
        emailEnabled: data.emailEnabled,
        slackWebhookUrl: data.slackWebhookUrl ?? undefined,
        discordWebhookUrl: data.discordWebhookUrl ?? undefined,
        notifyOnNewViolations: data.notifyOnNewViolations,
        notifyOnScoreChange: data.notifyOnScoreChange,
        notifyOnScanFailure: data.notifyOnScanFailure,
        violationSeverityThreshold: data.violationSeverityThreshold,
      },
      create: {
        teamId: data.teamId,
        userId: session.user.id,
        emailEnabled: data.emailEnabled ?? true,
        slackWebhookUrl: data.slackWebhookUrl ?? null,
        discordWebhookUrl: data.discordWebhookUrl ?? null,
        notifyOnNewViolations: data.notifyOnNewViolations ?? true,
        notifyOnScoreChange: data.notifyOnScoreChange ?? true,
        notifyOnScanFailure: data.notifyOnScanFailure ?? true,
        violationSeverityThreshold: data.violationSeverityThreshold ?? 'medium',
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('[POST /api/notifications/settings]', error);

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
      { error: 'Failed to update notification settings' },
      { status: 500 },
    );
  }
}
