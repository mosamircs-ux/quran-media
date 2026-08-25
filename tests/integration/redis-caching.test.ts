import { memoryCache, getCachedOrFetch, CACHE_KEYS } from '../../apps/web/src/lib/cache/redis-cache.js';

export async function runRedisCachingIntegrationTests(): Promise<{ passed: number; failed: number }> {
  console.log('⚡ [INTEGRATION TEST] Multi-Tiered Redis & Memory Caching...');
  let passed = 0;
  let failed = 0;

  function assert(cond: boolean, name: string) {
    if (cond) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  }

  // 1. In-Memory LRU Cache Operations
  memoryCache.set('test:key:1', { surah: 'Al-Fatihah' }, 10);
  const cachedItem = memoryCache.get<{ surah: string }>('test:key:1');
  assert(cachedItem !== null && cachedItem.surah === 'Al-Fatihah', 'Stores and retrieves data in L1 memory cache');

  memoryCache.delete('test:key:1');
  assert(memoryCache.get('test:key:1') === null, 'Deletes item from memory cache');

  // 2. Multi-tier getCachedOrFetch
  let fetchCount = 0;
  const fetcher = async () => {
    fetchCount++;
    return { name: 'Ayat al-Kursi', verseKey: '2:255' };
  };

  const key = CACHE_KEYS.ayah('2:255');
  const res1 = await getCachedOrFetch(key, fetcher, 60);
  assert(res1.name === 'Ayat al-Kursi' && fetchCount === 1, 'Executes fetcher on cache miss');

  const res2 = await getCachedOrFetch(key, fetcher, 60);
  assert(res2.name === 'Ayat al-Kursi' && fetchCount === 1, 'Returns cached value without re-executing fetcher (Cache Hit)');

  // 3. Cache Key Generators
  assert(CACHE_KEYS.surahsAll() === 'quran:surahs:all', 'Formats surahsAll cache key');
  assert(CACHE_KEYS.templatesAll() === 'media:templates:all', 'Formats templatesAll cache key');

  return { passed, failed };
}
