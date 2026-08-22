import { describe, it, expect } from 'vitest';
import {
  CANONICAL_SURAHS,
  TOTAL_SURAHS,
  TOTAL_AYAHS,
  getCanonicalSurah,
  isValidSurahId,
} from '../src/validation/canonical-bounds.js';
import {
  validateAndParseVerseKey,
  validateAndParseVerseRange,
} from '../src/validation/verse-key.validator.js';
import { ValidationError } from '@quran-media/config';

describe('Canonical Quran Bounds & Validator', () => {
  it('should verify exact canonical numbers: 114 Surahs and 6,236 Ayahs', () => {
    expect(CANONICAL_SURAHS.length).toBe(114);
    expect(TOTAL_SURAHS).toBe(114);

    const calculatedTotalAyahs = CANONICAL_SURAHS.reduce((acc, s) => acc + s.versesCount, 0);
    expect(calculatedTotalAyahs).toBe(6236);
    expect(TOTAL_AYAHS).toBe(6236);
  });

  it('should correctly validate Surah 1 (Al-Fatihah, 7 verses) and Surah 2 (Al-Baqarah, 286 verses)', () => {
    const fatihah = getCanonicalSurah(1);
    expect(fatihah?.nameEn).toBe('Al-Fatihah');
    expect(fatihah?.versesCount).toBe(7);

    const baqarah = getCanonicalSurah(2);
    expect(baqarah?.nameEn).toBe('Al-Baqarah');
    expect(baqarah?.versesCount).toBe(286);
  });

  it('should validate canonical verse keys (1:1, 2:255, 36:1, 114:6)', () => {
    expect(validateAndParseVerseKey('1:1')).toEqual({
      surahId: 1,
      verseNumber: 1,
      canonicalKey: '1:1',
    });

    expect(validateAndParseVerseKey('2:255')).toEqual({
      surahId: 2,
      verseNumber: 255,
      canonicalKey: '2:255',
    });

    expect(validateAndParseVerseKey('36:1')).toEqual({
      surahId: 36,
      verseNumber: 1,
      canonicalKey: '36:1',
    });

    expect(validateAndParseVerseKey('114:6')).toEqual({
      surahId: 114,
      verseNumber: 6,
      canonicalKey: '114:6',
    });
  });

  it('should reject out-of-bounds or malformed verse keys', () => {
    expect(() => validateAndParseVerseKey('1:8')).toThrow(ValidationError); // Al-Fatihah only has 7 verses
    expect(() => validateAndParseVerseKey('2:287')).toThrow(ValidationError); // Al-Baqarah only has 286 verses
    expect(() => validateAndParseVerseKey('115:1')).toThrow(ValidationError); // Only 114 surahs
    expect(() => validateAndParseVerseKey('0:1')).toThrow(ValidationError);
    expect(() => validateAndParseVerseKey('invalid')).toThrow(ValidationError);
    expect(() => validateAndParseVerseKey('')).toThrow(ValidationError);
  });

  it('should validate and parse valid verse ranges (e.g. 2:255 -> 2:257)', () => {
    const range = validateAndParseVerseRange(2, 255, 257);
    expect(range).toEqual({
      surahId: 2,
      fromVerseNumber: 255,
      toVerseNumber: 257,
      count: 3,
    });
  });

  it('should reject invalid verse ranges', () => {
    expect(() => validateAndParseVerseRange(2, 257, 255)).toThrow(ValidationError); // inverted range
    expect(() => validateAndParseVerseRange(2, 280, 290)).toThrow(ValidationError); // out of range
    expect(() => validateAndParseVerseRange(2, 1, 100)).toThrow(ValidationError); // exceeds max batch limit (50)
  });
});
