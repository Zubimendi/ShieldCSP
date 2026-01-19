/**
 * Caching Layer
 * Provides caching utilities for scan results, violation patterns, and dashboard aggregations
 */

import { getRedisClient, isRedisAvailable } from './redis';

const DEFAULT_TTL = 3600; // 1 hour in seconds
const CACHE_PREFIX = 'shieldcsp:';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key: string;
}

/**
 * Get cached value
 */
export async function getCache<T>(key: string): Promise<T | null> {
  if (!isRedisAvailable()) {
    return null;
  }

  const client = getRedisClient();
  if (!client) return null;

  try {
    const value = await client.get(`${CACHE_PREFIX}${key}`);
    if (!value) return null;
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`[Cache] Error getting key ${key}:`, error);
    return null;
  }
}

/**
 * Set cached value
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = DEFAULT_TTL,
): Promise<boolean> {
  if (!isRedisAvailable()) {
    return false;
  }

  const client = getRedisClient();
  if (!client) return false;

  try {
    const serialized = JSON.stringify(value);
    await client.setex(`${CACHE_PREFIX}${key}`, ttl, serialized);
    return true;
  } catch (error) {
    console.error(`[Cache] Error setting key ${key}:`, error);
    return false;
  }
}

/**
 * Delete cached value
 */
export async function deleteCache(key: string): Promise<boolean> {
  if (!isRedisAvailable()) {
    return false;
  }

  const client = getRedisClient();
  if (!client) return false;

  try {
    await client.del(`${CACHE_PREFIX}${key}`);
    return true;
  } catch (error) {
    console.error(`[Cache] Error deleting key ${key}:`, error);
    return false;
  }
}

/**
 * Delete multiple cache keys by pattern
 */
export async function deleteCachePattern(pattern: string): Promise<number> {
  if (!isRedisAvailable()) {
    return 0;
  }

  const client = getRedisClient();
  if (!client) return 0;

  try {
    const keys = await client.keys(`${CACHE_PREFIX}${pattern}`);
    if (keys.length === 0) return 0;

    return await client.del(...keys);
  } catch (error) {
    console.error(`[Cache] Error deleting pattern ${pattern}:`, error);
    return 0;
  }
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  // Scan results
  scanResult: (scanId: string) => `scan:result:${scanId}`,
  scanResultsByDomain: (domainId: string) => `scan:domain:${domainId}`,
  
  // Violation patterns
  violationPatterns: (domainId: string) => `violations:patterns:${domainId}`,
  violationCount: (domainId: string, hours: number = 24) => 
    `violations:count:${domainId}:${hours}h`,
  
  // Dashboard aggregations
  dashboardSummary: (teamId?: string) => 
    teamId ? `dashboard:summary:${teamId}` : 'dashboard:summary:global',
  gradeDistribution: (teamId?: string) => 
    teamId ? `dashboard:grades:${teamId}` : 'dashboard:grades:global',
  scoreTrend: (teamId?: string) => 
    teamId ? `dashboard:trend:${teamId}` : 'dashboard:trend:global',
  
  // Domain data
  domainDetails: (domainId: string) => `domain:${domainId}`,
  domainScans: (domainId: string) => `domain:scans:${domainId}`,
};

/**
 * Invalidate cache for a domain (when scans or violations change)
 */
export async function invalidateDomainCache(domainId: string): Promise<void> {
  await Promise.all([
    deleteCachePattern(`scan:domain:${domainId}*`),
    deleteCachePattern(`violations:*:${domainId}*`),
    deleteCachePattern(`domain:${domainId}*`),
  ]);
}

/**
 * Invalidate dashboard cache for a team
 */
export async function invalidateDashboardCache(teamId?: string): Promise<void> {
  if (teamId) {
    await deleteCachePattern(`dashboard:*:${teamId}*`);
  } else {
    await deleteCachePattern('dashboard:*:global*');
  }
}

/**
 * Cache wrapper for async functions
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
): Promise<T> {
  // Try to get from cache
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function and cache result
  const result = await fn();
  await setCache(key, result, ttl);
  return result;
}
