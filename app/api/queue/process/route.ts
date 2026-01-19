import { NextRequest, NextResponse } from 'next/server';
import { processScanQueue, getQueueStats } from '@/lib/queue/job-queue';

// POST /api/queue/process
// Process scan jobs from the queue (called by worker/cron)
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const batchSize = parseInt(searchParams.get('batchSize') || '1', 10);
    const timeout = parseInt(searchParams.get('timeout') || '30000', 10);

    // Optional: Add authentication/authorization for worker endpoints
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.WORKER_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const processed = await processScanQueue({ batchSize, timeout });
    const stats = await getQueueStats();

    return NextResponse.json({
      processed,
      stats,
    }, { status: 200 });
  } catch (error) {
    console.error('[POST /api/queue/process]', error);
    return NextResponse.json(
      { error: 'Failed to process queue' },
      { status: 500 },
    );
  }
}

// GET /api/queue/process
// Get queue statistics
export async function GET(req: NextRequest) {
  try {
    const stats = await getQueueStats();
    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('[GET /api/queue/process]', error);
    return NextResponse.json(
      { error: 'Failed to get queue stats' },
      { status: 500 },
    );
  }
}
