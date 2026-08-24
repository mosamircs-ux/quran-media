import { logger } from '@quran-media/config';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

/**
 * Executes a fetcher function with caching and resilient fallback.
 * If the fetcher fails but stale cached data or a static fallback is available,
 * it returns the stale/fallback data without crashing.
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
  fallbackValue?: T
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key) as CacheEntry<T> | undefined;

  // 1. Return fresh cached data if valid
  if (cached && cached.expiresAt > now) {
    return cached.data;
  }

  // 2. Fetch fresh data
  try {
    const fresh = await fetcher();
    memoryCache.set(key, {
      data: fresh,
      expiresAt: now + ttlSeconds * 1000,
    });
    return fresh;
  } catch (error) {
    // 3. Resilient fallback: return stale cached data if available
    if (cached) {
      logger.warn({ key, error }, 'Upstream Quran API call failed; returning stale cached data');
      return cached.data;
    }

    // 4. Return static fallback value if provided
    if (fallbackValue !== undefined) {
      logger.warn({ key, error }, 'Upstream Quran API call failed; returning static fallback data');
      return fallbackValue;
    }

    logger.error({ key, error }, 'Upstream Quran API call failed with no fallback available');
    throw error;
  }
}

export function clearCache(pattern?: string) {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
}
