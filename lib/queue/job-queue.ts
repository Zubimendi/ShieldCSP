/**
 * Job Queue System
 * Redis-based job queue for background scan processing
 */

import { getRedisClient, isRedisAvailable } from '../redis';
import { executeScan } from '../scanner/scan-executor';
import { prisma } from '../prisma';

export interface ScanJob {
  id: string;
  domainId: string;
  scanType: 'full' | 'quick' | 'headers-only';
  priority: number; // Higher = more priority
  retries: number;
  maxRetries: number;
  createdAt: Date;
  scheduledFor?: Date;
}

const QUEUE_NAME = 'shieldcsp:scan-queue';
const PROCESSING_QUEUE = 'shieldcsp:scan-processing';
const FAILED_QUEUE = 'shieldcsp:scan-failed';

/**
 * Add a scan job to the queue
 */
export async function enqueueScanJob(
  domainId: string,
  scanType: 'full' | 'quick' | 'headers-only' = 'full',
  options: {
    priority?: number;
    scheduledFor?: Date;
    maxRetries?: number;
  } = {},
): Promise<string> {
  if (!isRedisAvailable()) {
    throw new Error('Redis is not available. Job queue requires Redis.');
  }

  const client = getRedisClient();
  if (!client) {
    throw new Error('Failed to get Redis client');
  }

  const jobId = `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const job: ScanJob = {
    id: jobId,
    domainId,
    scanType,
    priority: options.priority || 0,
    retries: 0,
    maxRetries: options.maxRetries || 3,
    createdAt: new Date(),
    scheduledFor: options.scheduledFor,
  };

  // Serialize job
  const jobData = JSON.stringify(job);

  // If scheduled for future, use delayed queue
  if (options.scheduledFor && options.scheduledFor > new Date()) {
    const delay = options.scheduledFor.getTime() - Date.now();
    await client.zadd(`${QUEUE_NAME}:delayed`, delay, jobData);
  } else {
    // Add to priority queue (sorted set by priority)
    await client.zadd(QUEUE_NAME, job.priority, jobData);
  }

  return jobId;
}

/**
 * Process a single scan job
 */
async function processScanJob(job: ScanJob): Promise<{ success: boolean; error?: string }> {
  try {
    // Verify domain exists and is active
    const domain = await prisma.domain.findUnique({
      where: { id: job.domainId },
      include: { team: true },
    });

    if (!domain) {
      return { success: false, error: 'Domain not found' };
    }

    if (!domain.isActive) {
      return { success: false, error: 'Domain is not active' };
    }

    // Execute the scan
    const result = await executeScan(job.domainId, job.scanType);

    if (!result.success) {
      return { success: false, error: result.error || 'Scan execution failed' };
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: errorMessage };
  }
}

/**
 * Process jobs from the queue (worker function)
 */
export async function processScanQueue(options: {
  batchSize?: number;
  timeout?: number;
} = {}): Promise<number> {
  if (!isRedisAvailable()) {
    console.warn('[Job Queue] Redis not available, skipping queue processing');
    return 0;
  }

  const client = getRedisClient();
  if (!client) {
    return 0;
  }

  const batchSize = options.batchSize || 1;
  let processed = 0;

  // Move delayed jobs to main queue if ready
  await moveDelayedJobs(client);

  // Process jobs
  for (let i = 0; i < batchSize; i++) {
    try {
      // Get highest priority job (ZREVRANGE with limit 1)
      const jobs = await client.zrevrange(QUEUE_NAME, 0, 0);
      if (jobs.length === 0) {
        break; // No jobs available
      }

      const jobData = jobs[0];
      const job: ScanJob = JSON.parse(jobData);

      // Move to processing queue
      await client.zrem(QUEUE_NAME, jobData);
      await client.zadd(PROCESSING_QUEUE, Date.now(), jobData);

      // Process the job
      const result = await processScanJob(job);

      // Remove from processing queue
      await client.zrem(PROCESSING_QUEUE, jobData);

      if (result.success) {
        processed++;
        console.log(`[Job Queue] Successfully processed scan job ${job.id} for domain ${job.domainId}`);
      } else {
        // Retry logic
        if (job.retries < job.maxRetries) {
          job.retries++;
          // Exponential backoff: 2^retries minutes
          const backoffMs = Math.pow(2, job.retries) * 60 * 1000;
          const retryAt = new Date(Date.now() + backoffMs);
          job.scheduledFor = retryAt;

          const retryJobData = JSON.stringify(job);
          await client.zadd(`${QUEUE_NAME}:delayed`, retryAt.getTime(), retryJobData);
          console.log(`[Job Queue] Retrying job ${job.id} (attempt ${job.retries}/${job.maxRetries}) at ${retryAt.toISOString()}`);
        } else {
          // Max retries exceeded, move to failed queue
          await client.lpush(FAILED_QUEUE, jobData);
          console.error(`[Job Queue] Job ${job.id} failed after ${job.maxRetries} retries: ${result.error}`);
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[Job Queue] Error processing job:', errorMessage);
      // Continue processing other jobs
    }
  }

  return processed;
}

/**
 * Move delayed jobs to main queue when ready
 */
async function moveDelayedJobs(client: ReturnType<typeof getRedisClient>): Promise<void> {
  if (!client) return;
  const now = Date.now();
  const readyJobs = await client.zrangebyscore(`${QUEUE_NAME}:delayed`, 0, now);

  if (readyJobs.length > 0) {
    for (const jobData of readyJobs) {
      const job: ScanJob = JSON.parse(jobData);
      await client.zrem(`${QUEUE_NAME}:delayed`, jobData);
      await client.zadd(QUEUE_NAME, job.priority, jobData);
    }
  }
}

/**
 * Get queue statistics
 */
export async function getQueueStats(): Promise<{
  pending: number;
  processing: number;
  delayed: number;
  failed: number;
}> {
  if (!isRedisAvailable()) {
    return { pending: 0, processing: 0, delayed: 0, failed: 0 };
  }

  const client = getRedisClient();
  if (!client) {
    return { pending: 0, processing: 0, delayed: 0, failed: 0 };
  }

  const [pending, processing, delayed, failed] = await Promise.all([
    client.zcard(QUEUE_NAME),
    client.zcard(PROCESSING_QUEUE),
    client.zcard(`${QUEUE_NAME}:delayed`),
    client.llen(FAILED_QUEUE),
  ]);

  return {
    pending: pending || 0,
    processing: processing || 0,
    delayed: delayed || 0,
    failed: failed || 0,
  };
}

/**
 * Schedule automated scans for domains based on their scan frequency
 */
export async function scheduleAutomatedScans(): Promise<number> {
  const now = new Date();
  const scheduled = await prisma.domain.findMany({
    where: {
      isActive: true,
      scanFrequency: {
        in: ['hourly', 'daily', 'weekly'],
      },
      OR: [
        { lastScannedAt: null },
        {
          lastScannedAt: {
            // Calculate next scan time based on frequency
            lt: getNextScanTime(now),
          },
        },
      ],
    },
    select: {
      id: true,
      scanFrequency: true,
      lastScannedAt: true,
    },
  });

  let enqueued = 0;

  for (const domain of scheduled) {
    try {
      const frequency = domain.scanFrequency;
      if (frequency !== 'hourly' && frequency !== 'daily' && frequency !== 'weekly') {
        continue; // Skip invalid frequencies
      }
      const nextScanTime = calculateNextScanTime(frequency, domain.lastScannedAt || now);
      
      await enqueueScanJob(
        domain.id,
        'full',
        {
          priority: 1, // Lower priority for automated scans
          scheduledFor: nextScanTime,
          maxRetries: 2,
        },
      );
      enqueued++;
    } catch (error) {
      console.error(`[Job Queue] Failed to schedule scan for domain ${domain.id}:`, error);
    }
  }

  return enqueued;
}

/**
 * Calculate next scan time based on frequency
 */
function calculateNextScanTime(
  frequency: 'hourly' | 'daily' | 'weekly',
  lastScan: Date,
): Date {
  const next = new Date(lastScan);

  switch (frequency) {
    case 'hourly':
      next.setHours(next.getHours() + 1);
      break;
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
  }

  return next;
}

/**
 * Get the threshold time for next scan based on frequency
 */
function getNextScanTime(now: Date): Date {
  // For hourly scans, check if last scan was more than 1 hour ago
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  return oneHourAgo;
}
