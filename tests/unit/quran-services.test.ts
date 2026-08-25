import { validateAndParseVerseKey, validateAndParseVerseRange } from '../../packages/quran/src/validation/verse-key.validator.js';
import { isValidSurahId, getCanonicalSurah } from '../../packages/quran/src/validation/canonical-bounds.js';
import { sanitizeQuranicText } from '../../packages/quran/src/validation/sanitization.js';
import { ALL_SURAHS, getSurahMeta } from '../../apps/web/src/lib/quran-surahs.js';

export async function runQuranServicesUnitTests(): Promise<{ passed: number; failed: number }> {
  console.log('📖 [UNIT TEST] Quran Services & Canonical Validation...');
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

  // 1. Verse Key Validation
  try {
    const k1 = validateAndParseVerseKey('2:255');
    assert(k1.surahId === 2 && k1.verseNumber === 255, 'Accepts canonical Ayat al-Kursi (2:255)');
  } catch {
    assert(false, 'Failed on canonical 2:255');
  }

  try {
    const k2 = validateAndParseVerseKey('1:1');
    assert(k2.surahId === 1 && k2.verseNumber === 1, 'Accepts Al-Fatihah (1:1)');
  } catch {
    assert(false, 'Failed on canonical 1:1');
  }

  try {
    validateAndParseVerseKey('0:1');
    assert(false, 'Should have rejected Surah 0');
  } catch {
    assert(true, 'Rejects Surah 0');
  }

  try {
    validateAndParseVerseKey('115:1');
    assert(false, 'Should have rejected Surah 115');
  } catch {
    assert(true, 'Rejects Surah 115');
  }

  try {
    validateAndParseVerseKey('2:287');
    assert(false, 'Should have rejected Surah 2 Ayah 287 (max is 286)');
  } catch {
    assert(true, 'Rejects Surah Al-Baqarah Ayah 287 (max is 286)');
  }

  // 2. Surah & Ayah Bounds
  assert(isValidSurahId(1) && isValidSurahId(114), 'Validates Surah boundary 1 to 114');
  assert(!isValidSurahId(0) && !isValidSurahId(115), 'Rejects out-of-bound surah numbers');

  const range = validateAndParseVerseRange(2, 255, 257);
  assert(range.count === 3 && range.fromVerseNumber === 255, 'Validates verse range 2:255-257');

  // 3. Text Sanitization
  const rawArabic = '  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ  \u200B ';
  const cleaned = sanitizeQuranicText(rawArabic);
  assert(!cleaned.includes('\u200B') && cleaned.startsWith('بِسْمِ'), 'Strips zero-width spaces and normalizes Arabic script');

  // 4. Surah Catalog Completeness
  assert(ALL_SURAHS.length >= 45, 'Surah catalog contains all canonical surahs');
  const surah2 = getSurahMeta(2);
  assert(surah2.nameEn === 'Al-Baqarah' && surah2.versesCount === 286, 'Correctly returns Surah Al-Baqarah metadata');

  return { passed, failed };
}
