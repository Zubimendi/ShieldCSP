/**
 * Redis Client
 * Singleton Redis client for caching and job queues
 */

import Redis from 'ioredis';

// Create Redis client singleton
let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  // Return null if Redis URL is not configured (graceful degradation)
  if (!process.env.REDIS_URL) {
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        lazyConnect: true,
      });

      redis.on('error', (error) => {
        console.error('[Redis] Connection error:', error);
      });

      redis.on('connect', () => {
        console.log('[Redis] Connected successfully');
      });
    } catch (error) {
      console.error('[Redis] Failed to create client:', error);
      return null;
    }
  }

  return redis;
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return !!process.env.REDIS_URL && getRedisClient() !== null;
}

/**
 * Gracefully close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
