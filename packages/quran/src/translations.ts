import 'server-only';
import { getQuranServerClient, fetchWithCache } from './client.js';
import { QuranApiError } from '@quran-media/config';

export interface TranslationResource {
  id: number;
  name: string;
  authorName: string;
  languageName: string;
}

export async function getAvailableTranslations(locale: 'ar' | 'en' = 'en'): Promise<TranslationResource[]> {
  const cacheKey = `quran:translations:list:${locale}`;
  const CACHE_TTL_SECONDS = 86400 * 7; // 7 days

  return fetchWithCache<TranslationResource[]>(cacheKey, CACHE_TTL_SECONDS, async () => {
    const client = getQuranServerClient();
    try {
      const response = await client.resources.v4.translations({
        language: locale,
      });

      const data = response as unknown as {
        translations: Array<{
          id: number;
          name: string;
          authorName: string;
          languageName: string;
        }>;
      };

      return data.translations || [];
    } catch (err) {
      throw new QuranApiError('Failed to fetch available translations', err);
    }
  });
}
