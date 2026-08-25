import { Redis } from 'ioredis';

// Tier-1: Ultra-fast In-Memory LRU Cache
class MemoryCache {
  private store = new Map<string, { value: any; expiresAt: number }>();
  private maxItems = 1000;

  get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value as T;
  }

  set(key: string, value: any, ttlSeconds: number): void {
    if (this.store.size >= this.maxItems) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

export const memoryCache = new MemoryCache();

// Tier-2: Redis Cache (Lazy connection)
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (typeof window !== 'undefined') return null;
  if (!redisClient && process.env.REDIS_URL) {
    try {
      redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
        lazyConnect: true,
        connectTimeout: 2000,
      });
      redisClient.on('error', () => {
        // Silently fallback to L1 MemoryCache on connection error
      });
    } catch {
      redisClient = null;
    }
  }
  return redisClient;
}

/**
 * Multi-Tiered Cache (L1 Memory -> L2 Redis -> Database/API Fetcher)
 * STRICT RULE: Only use for canonical public Quran resources, templates, and static catalog data.
 * NEVER use this for private user accounts, private drafts, or billing credentials.
 */
export async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 86400 * 7 // Default 7 days for immutable Quranic canonical data
): Promise<T> {
  // 1. Check Tier-1 Memory Cache (<0.1ms)
  const memValue = memoryCache.get<T>(key);
  if (memValue !== null) {
    return memValue;
  }

  // 2. Check Tier-2 Redis Cache (~1-2ms)
  const redis = getRedisClient();
  if (redis) {
    try {
      const redisVal = await redis.get(key);
      if (redisVal) {
        const parsed = JSON.parse(redisVal) as T;
        memoryCache.set(key, parsed, Math.min(ttlSeconds, 3600)); // Warm L1 cache
        return parsed;
      }
    } catch {
      // Fall through to fetcher on Redis timeout/error
    }
  }

  // 3. Cache Miss: Execute Fetcher
  const freshData = await fetcher();

  // 4. Populate Tier-1 Memory Cache
  memoryCache.set(key, freshData, Math.min(ttlSeconds, 3600));

  // 5. Populate Tier-2 Redis Cache asynchronously
  if (redis) {
    try {
      await redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds);
    } catch {
      // Fail silently
    }
  }

  return freshData;
}

/**
 * Standard Cache Key Generators
 */
export const CACHE_KEYS = {
  surahsAll: () => 'quran:surahs:all',
  surah: (num: number) => `quran:surah:${num}`,
  ayah: (verseKey: string) => `quran:ayah:${verseKey}`,
  translation: (verseKey: string, lang: string) => `quran:trans:${verseKey}:${lang}`,
  tafsir: (verseKey: string, slug: string) => `quran:tafsir:${verseKey}:${slug}`,
  recitersAll: () => 'quran:reciters:all',
  templatesAll: () => 'media:templates:all',
  template: (id: string) => `media:template:${id}`,
  storiesPublic: () => 'stories:catalog:public',
  story: (slug: string) => `stories:story:${slug}`,
};
