import { getQuranServerClient } from '../client/server-client.js';
import { getOrSetCache } from '../client/cache.js';
import { FALLBACK_KEY_VERSES } from '../client/fallback-data.js';
import {
  validateAndParseVerseKey,
  validateAndParseVerseRange,
} from '../validation/verse-key.validator.js';
import { CANONICAL_SURAHS } from '../validation/canonical-bounds.js';
import type { Verse, VerseRange, VerseWord } from '../types/verse.types.js';
import { QuranApiError } from '@quran-media/config';

export interface GetVersesOptions {
  surahId: number;
  fromVerse?: number;
  toVerse?: number;
  translationIds?: number[];
  includeWords?: boolean;
  locale?: 'ar' | 'en';
}

export interface GetVerseByKeyOptions {
  verseKey: string; // e.g. "2:255"
  translationIds?: number[];
  includeWords?: boolean;
  locale?: 'ar' | 'en';
}

export class QuranVerseService {
  /**
   * Retrieves verses for a Surah with optional range and translation parameters.
   */
  async getVersesByChapter(options: GetVersesOptions): Promise<Verse[]> {
    const {
      surahId,
      fromVerse = 1,
      toVerse,
      translationIds = [131], // 131 = The Clear Quran
      includeWords = true,
      locale = 'ar',
    } = options;

    const validatedRange = validateAndParseVerseRange(surahId, fromVerse, toVerse);
    const transKey = translationIds.sort().join(',');
    const cacheKey = `quran:verses:${surahId}:${validatedRange.fromVerseNumber}:${validatedRange.toVerseNumber}:${transKey}:${includeWords}:${locale}`;
    const TTL_SECONDS = 86400; // 24 Hours

    return getOrSetCache<Verse[]>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await (client as any).content?.v4?.verses?.filter?.({
          chapterNumber: surahId,
          language: locale,
          translations: translationIds,
          words: includeWords,
          wordFields: ['text_uthmani', 'text_imlaei', 'location', 'audio_url', 'translation', 'transliteration'],
          fields: [
            'text_uthmani',
            'text_imlaei',
            'verse_key',
            'verse_number',
            'hizb_number',
            'rub_el_hizb_number',
            'ruku_number',
            'manzil_number',
            'sajdah_number',
          ],
        }) || { verses: [] };

        const raw = response as unknown as { verses?: any[] } | any[];
        const rawVerses = (Array.isArray(raw) ? raw : (raw as any).verses || []) as any[];

        const verses: Verse[] = rawVerses.map((v: any) => {
          const verseNumber = v.verseNumber ?? v.verse_number ?? 1;
          const verseKey = v.verseKey ?? v.verse_key ?? `${surahId}:${verseNumber}`;

          const mappedWords: VerseWord[] | undefined = v.words?.map((w: any) => ({
            id: w.id,
            position: w.position,
            audioUrl: w.audioUrl ?? w.audio_url,
            charTypeName: w.charTypeName ?? w.char_type_name,
            textUthmani: w.textUthmani ?? w.text_uthmani,
            textIndopak: w.textIndopak ?? w.text_indopak,
            textImlaei: w.textImlaei ?? w.text_imlaei,
            pageNumber: w.pageNumber ?? w.page_number,
            lineNumber: w.lineNumber ?? w.line_number,
            translation: w.translation
              ? { text: w.translation.text, languageName: w.translation.languageName ?? w.translation.language_name }
              : undefined,
            transliteration: w.transliteration
              ? { text: w.transliteration.text, languageName: w.transliteration.languageName ?? w.transliteration.language_name }
              : undefined,
          }));

          const mappedTranslations = v.translations?.map((t: any) => ({
            id: t.id,
            resourceId: t.resourceId ?? t.resource_id ?? t.id,
            text: t.text,
          }));

          return {
            id: v.id ?? verseNumber,
            verseNumber,
            verseKey,
            chapterId: surahId,
            hizbNumber: v.hizbNumber ?? v.hizb_number ?? 1,
            rubElHizbNumber: v.rubElHizbNumber ?? v.rub_el_hizb_number ?? 1,
            rukuNumber: v.rukuNumber ?? v.ruku_number ?? 1,
            manzilNumber: v.manzilNumber ?? v.manzil_number ?? 1,
            sajdahNumber: v.sajdahNumber ?? v.sajdah_number ?? null,
            textUthmani: v.textUthmani ?? v.text_uthmani ?? '',
            textSimple: v.textImlaei ?? v.text_imlaei ?? v.textUthmani ?? '',
            textImlaei: v.textImlaei ?? v.text_imlaei,
            words: mappedWords,
            translations: mappedTranslations,
          };
        });

        // Filter exact range
        return verses.filter(
          (v) =>
            v.verseNumber >= validatedRange.fromVerseNumber &&
            v.verseNumber <= validatedRange.toVerseNumber
        );
      },
      // Fallback matching
      FALLBACK_KEY_VERSES[`${surahId}:${fromVerse}`]
        ? [FALLBACK_KEY_VERSES[`${surahId}:${fromVerse}`]!]
        : []
    );
  }

  /**
   * Retrieves a single verse by its canonical key (e.g. "2:255" or "1:1").
   * Never trusts client input without validation.
   */
  async getVerseByKey(options: GetVerseByKeyOptions): Promise<Verse> {
    const { verseKey, translationIds, includeWords, locale } = options;
    const parsed = validateAndParseVerseKey(verseKey);

    const verses = await this.getVersesByChapter({
      surahId: parsed.surahId,
      fromVerse: parsed.verseNumber,
      toVerse: parsed.verseNumber,
      translationIds,
      includeWords,
      locale,
    });

    const verse = verses[0] ?? FALLBACK_KEY_VERSES[parsed.canonicalKey];
    if (!verse) {
      throw new QuranApiError(`Verse ${parsed.canonicalKey} could not be retrieved`);
    }

    return verse;
  }

  /**
   * Retrieves a range of verses across a Surah (e.g. 2:255 -> 2:257).
   */
  async getVerseRange(
    surahId: number,
    fromVerse: number,
    toVerse: number,
    options?: Omit<GetVersesOptions, 'surahId' | 'fromVerse' | 'toVerse'>
  ): Promise<VerseRange> {
    const parsedRange = validateAndParseVerseRange(surahId, fromVerse, toVerse);

    const verses = await this.getVersesByChapter({
      surahId,
      fromVerse: parsedRange.fromVerseNumber,
      toVerse: parsedRange.toVerseNumber,
      ...options,
    });

    return {
      chapterId: surahId,
      fromVerseNumber: parsedRange.fromVerseNumber,
      toVerseNumber: parsedRange.toVerseNumber,
      totalVerses: verses.length,
      verses,
    };
  }

  /**
   * Returns a random canonical verse from the entire Quran (1 of 6,236 verses).
   */
  async getRandomVerse(options?: Omit<GetVerseByKeyOptions, 'verseKey'>): Promise<Verse> {
    const randomSurah = CANONICAL_SURAHS[Math.floor(Math.random() * CANONICAL_SURAHS.length)]!;
    const randomVerseNumber = Math.floor(Math.random() * randomSurah.versesCount) + 1;
    const verseKey = `${randomSurah.id}:${randomVerseNumber}`;

    return this.getVerseByKey({
      verseKey,
      ...options,
    });
  }
}

export const quranVerseService = new QuranVerseService();
