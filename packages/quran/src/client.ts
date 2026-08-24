import 'server-only';
import { createServerClient } from '@quranjs/api/server';
import { env, logger, QuranApiError } from '@quran-media/config';

let serverClientInstance: any = null;

export function getQuranServerClient(): any {
  if (!serverClientInstance) {
    try {
      serverClientInstance = createServerClient({
        clientId: env.QURAN_CLIENT_ID,
        clientSecret: env.QURAN_CLIENT_SECRET,
      });
      logger.info('Initialized official Quran Foundation server client');
    } catch (err) {
      logger.error({ err }, 'Failed to initialize Quran Foundation server client');
      throw new QuranApiError('Failed to initialize Quran API client', err);
    }
  }
  return serverClientInstance;
}

// In-memory cache layer for fallback if Redis is unavailable
const memoryCache = new Map<string, { data: unknown; expiresAt: number }>();

export async function fetchWithCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const now = Date.now();
  const cached = memoryCache.get(key);

  if (cached && cached.expiresAt > now) {
    return cached.data as T;
  }

  try {
    const data = await fetcher();
    memoryCache.set(key, {
      data,
      expiresAt: now + ttlSeconds * 1000,
    });
    return data;
  } catch (error) {
    // If we have expired cached data and fetcher fails, return stale data as resilient fallback
    if (cached) {
      logger.warn({ key, error }, 'Fetching fresh Quran data failed; serving stale cached data');
      return cached.data as T;
    }
    logger.error({ key, error }, 'Failed to fetch Quran data');
    throw new QuranApiError(`Quran API request failed for key: ${key}`, error);
  }
}
