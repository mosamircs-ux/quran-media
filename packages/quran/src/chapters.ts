import 'server-only';
import { getQuranServerClient, fetchWithCache } from './client.js';
import type { Chapter } from './types.js';
import { QuranApiError } from '@quran-media/config';

export async function getChapters(locale: 'ar' | 'en' = 'ar'): Promise<Chapter[]> {
  const cacheKey = `quran:chapters:${locale}`;
  const CACHE_TTL_SECONDS = 86400; // 24 Hours

  return fetchWithCache<Chapter[]>(cacheKey, CACHE_TTL_SECONDS, async () => {
    const client = getQuranServerClient();
    try {
      const response = await client.content.v4.chapters.list({
        language: locale,
      });

      // Map SDK response to domain Chapter model
      return (response as unknown as { chapters: Chapter[] }).chapters || (response as unknown as Chapter[]);
    } catch (err) {
      throw new QuranApiError(`Failed to fetch chapters for locale '${locale}'`, err);
    }
  });
}

export async function getChapterById(chapterId: number, locale: 'ar' | 'en' = 'ar'): Promise<Chapter> {
  const chapters = await getChapters(locale);
  const chapter = chapters.find((c) => c.id === chapterId);
  if (!chapter) {
    throw new QuranApiError(`Surah with ID ${chapterId} not found`);
  }
  return chapter;
}
