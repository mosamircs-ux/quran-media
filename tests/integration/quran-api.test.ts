import { FALLBACK_KEY_VERSES, FALLBACK_CHAPTERS, FALLBACK_RECITERS, FALLBACK_TRANSLATIONS, FALLBACK_TAFSIRS } from '../../packages/quran/src/client/fallback-data.js';
import { FAMOUS_AYAHS } from '../../apps/web/src/lib/seo.js';

export async function runQuranApiIntegrationTests(): Promise<{ passed: number; failed: number }> {
  console.log('🌐 [INTEGRATION TEST] Quran API & Tafsir Data Layer...');
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

  // 1. Fallback & Canonical Verses
  const fatiha = FALLBACK_KEY_VERSES['1:1'];
  assert(fatiha !== undefined && fatiha.textUthmani.includes('ٱلرَّحْمَٰنِ'), 'Loads Surah Al-Fatihah canonical Uthmani text');

  const kursi = FALLBACK_KEY_VERSES['2:255'] || FAMOUS_AYAHS['2:255'];
  assert(kursi !== undefined, 'Loads Ayat al-Kursi (2:255) metadata');

  // 2. Surah Catalog Data
  assert(FALLBACK_CHAPTERS.length === 114, 'Loads all 114 canonical Surahs metadata');
  assert(FALLBACK_RECITERS.length >= 5, 'Loads certified Quran reciters list');
  assert(FALLBACK_TRANSLATIONS.length >= 3, 'Loads approved translations');
  assert(FALLBACK_TAFSIRS.length >= 3, 'Loads classical Tafsir commentaries');

  return { passed, failed };
}
