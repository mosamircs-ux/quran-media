import 'server-only';
import { getQuranServerClient } from '../client/server-client.js';
import { getOrSetCache } from '../client/cache.js';
import { FALLBACK_CHAPTERS } from '../client/fallback-data.js';
import { isValidSurahId, TOTAL_SURAHS } from '../validation/canonical-bounds.js';
import type { Chapter, ChapterInfo } from '../types/chapter.types.js';
import { QuranApiError, ValidationError } from '@quran-media/config';

export class QuranChapterService {
  /**
   * Retrieves all 114 Surahs with metadata and translated titles.
   */
  async getAllChapters(locale: 'ar' | 'en' = 'ar'): Promise<Chapter[]> {
    const cacheKey = `quran:chapters:all:${locale}`;
    const TTL_SECONDS = 86400; // 24 Hours

    return getOrSetCache<Chapter[]>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.content.v4.chapters.list({
          language: locale,
        });

        const raw = response as unknown as { chapters?: Chapter[] } | Chapter[];
        const chapters = Array.isArray(raw) ? raw : raw.chapters || [];

        return chapters.map((c) => ({
          id: c.id,
          revelationPlace: c.revelationPlace,
          revelationOrder: c.revelationOrder,
          bismillahPre: c.bismillahPre,
          nameSimple: c.nameSimple,
          nameComplex: c.nameComplex,
          nameArabic: c.nameArabic,
          versesCount: c.versesCount,
          pages: c.pages,
          translatedName: c.translatedName,
        }));
      },
      FALLBACK_CHAPTERS
    );
  }

  /**
   * Retrieves a single Surah by its canonical ID (1-114).
   */
  async getChapterById(chapterId: number, locale: 'ar' | 'en' = 'ar'): Promise<Chapter> {
    if (!isValidSurahId(chapterId)) {
      throw new ValidationError(`Chapter ID ${chapterId} is invalid (must be between 1 and ${TOTAL_SURAHS})`);
    }

    const chapters = await this.getAllChapters(locale);
    const chapter = chapters.find((c) => c.id === chapterId);

    if (!chapter) {
      throw new QuranApiError(`Surah ${chapterId} not found`);
    }

    return chapter;
  }

  /**
   * Retrieves scholarly chapter information and historical context.
   */
  async getChapterInfo(chapterId: number, locale: 'ar' | 'en' = 'en'): Promise<ChapterInfo> {
    if (!isValidSurahId(chapterId)) {
      throw new ValidationError(`Chapter ID ${chapterId} is invalid (must be between 1 and ${TOTAL_SURAHS})`);
    }

    const cacheKey = `quran:chapters:info:${chapterId}:${locale}`;
    const TTL_SECONDS = 86400 * 7; // 7 Days

    return getOrSetCache<ChapterInfo>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.content.v4.chapters.info({
          chapterNumber: chapterId,
          language: locale,
        });

        const raw = response as unknown as { chapterInfo?: ChapterInfo } | ChapterInfo;
        const info = ('chapterInfo' in raw ? raw.chapterInfo : raw) as ChapterInfo;

        return {
          id: info?.id || chapterId,
          chapterId,
          languageName: info?.languageName || locale,
          shortText: info?.shortText || '',
          source: info?.source || '',
          text: info?.text || '',
        };
      },
      {
        id: chapterId,
        chapterId,
        languageName: locale,
        shortText: `Surah ${chapterId}`,
        source: 'Quran Foundation',
        text: `Information and historical context for Surah ${chapterId}.`,
      }
    );
  }
}

export const quranChapterService = new QuranChapterService();
