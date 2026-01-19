import { NextRequest, NextResponse } from 'next/server';
import { scheduleAutomatedScans } from '@/lib/queue/job-queue';

// POST /api/queue/schedule
// Schedule automated scans for domains based on their scan frequency
// This should be called by a cron job (e.g., every hour)
export async function POST(req: NextRequest) {
  try {
    // Optional: Add authentication/authorization for worker endpoints
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.WORKER_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const scheduled = await scheduleAutomatedScans();

    return NextResponse.json({
      scheduled,
      message: `Scheduled ${scheduled} automated scans`,
    }, { status: 200 });
  } catch (error) {
    console.error('[POST /api/queue/schedule]', error);
    return NextResponse.json(
      { error: 'Failed to schedule automated scans' },
      { status: 500 },
    );
  }
}
