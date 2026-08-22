import { getCanonicalSurah, isValidSurahId, TOTAL_SURAHS } from './canonical-bounds.js';
import { ValidationError } from '@quran-media/config';

export interface ParsedVerseKey {
  surahId: number;
  verseNumber: number;
  canonicalKey: string;
}

export interface ParsedVerseRange {
  surahId: number;
  fromVerseNumber: number;
  toVerseNumber: number;
  count: number;
}

/**
 * Validates and parses a verse key string (e.g. "2:255" or "1:1").
 * Throws a ValidationError if the key is structurally or canonically invalid.
 */
export function validateAndParseVerseKey(rawKey: string): ParsedVerseKey {
  if (!rawKey || typeof rawKey !== 'string') {
    throw new ValidationError('Verse key must be a non-empty string');
  }

  const trimmed = rawKey.trim();
  const match = /^(\d+):(\d+)$/.exec(trimmed);

  if (!match) {
    throw new ValidationError(`Invalid verse key format "${rawKey}". Expected "surah:verse" (e.g. "2:255")`);
  }

  const surahId = Number(match[1]);
  const verseNumber = Number(match[2]);

  if (!isValidSurahId(surahId)) {
    throw new ValidationError(`Surah ID ${surahId} is out of bounds (must be 1 to ${TOTAL_SURAHS})`);
  }

  const surahMeta = getCanonicalSurah(surahId)!;
  if (!Number.isInteger(verseNumber) || verseNumber < 1 || verseNumber > surahMeta.versesCount) {
    throw new ValidationError(
      `Verse ${verseNumber} is out of bounds for Surah ${surahMeta.nameEn} (${surahMeta.id}). Surah has ${surahMeta.versesCount} verses.`
    );
  }

  return {
    surahId,
    verseNumber,
    canonicalKey: `${surahId}:${verseNumber}`,
  };
}

/**
 * Validates a range of verses within a Surah (e.g. Surah 2, from 255 to 257).
 */
export function validateAndParseVerseRange(
  surahId: number,
  fromVerse: number,
  toVerse?: number
): ParsedVerseRange {
  if (!isValidSurahId(surahId)) {
    throw new ValidationError(`Surah ID ${surahId} is out of bounds (must be 1 to ${TOTAL_SURAHS})`);
  }

  const surahMeta = getCanonicalSurah(surahId)!;

  if (!Number.isInteger(fromVerse) || fromVerse < 1 || fromVerse > surahMeta.versesCount) {
    throw new ValidationError(
      `Start verse ${fromVerse} is out of bounds for Surah ${surahMeta.nameEn}. Must be between 1 and ${surahMeta.versesCount}.`
    );
  }

  const resolvedTo = toVerse !== undefined ? toVerse : surahMeta.versesCount;

  if (!Number.isInteger(resolvedTo) || resolvedTo < fromVerse || resolvedTo > surahMeta.versesCount) {
    throw new ValidationError(
      `End verse ${resolvedTo} is invalid for Surah ${surahMeta.nameEn}. Must be >= ${fromVerse} and <= ${surahMeta.versesCount}.`
    );
  }

  const count = resolvedTo - fromVerse + 1;
  const MAX_RANGE_SIZE = 50; // Guardrail to prevent resource exhaustion

  if (count > MAX_RANGE_SIZE) {
    throw new ValidationError(
      `Requested verse range (${count} verses) exceeds maximum permitted batch size of ${MAX_RANGE_SIZE} verses.`
    );
  }

  return {
    surahId,
    fromVerseNumber: fromVerse,
    toVerseNumber: resolvedTo,
    count,
  };
}
