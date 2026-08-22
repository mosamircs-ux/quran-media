import 'server-only';
import { getQuranServerClient, fetchWithCache } from './client.js';
import type { SearchResponse } from './types.js';
import { QuranApiError } from '@quran-media/config';

export interface SearchQuranOptions {
  query: string;
  locale?: 'ar' | 'en';
  page?: number;
  size?: number;
}

export async function searchQuran(opts: SearchQuranOptions): Promise<SearchResponse> {
  const { query, locale = 'ar', page = 1, size = 20 } = opts;
  const cacheKey = `quran:search:${encodeURIComponent(query)}:${locale}:${page}:${size}`;
  const CACHE_TTL_SECONDS = 21600; // 6 Hours

  return fetchWithCache<SearchResponse>(cacheKey, CACHE_TTL_SECONDS, async () => {
    const client = getQuranServerClient();
    try {
      const response = await client.search.v1.query({
        query,
        language: locale,
        page,
        size,
      });

      const res = response as unknown as {
        search: {
          query: string;
          totalResults: number;
          currentPage: number;
          totalPages: number;
          results: Array<{
            verseKey: string;
            verseId: number;
            text: string;
            translations?: Array<{ name: string; text: string }>;
          }>;
        };
      };

      return {
        query: res.search.query || query,
        totalResults: res.search.totalResults || 0,
        currentPage: res.search.currentPage || page,
        totalPages: res.search.totalPages || 1,
        results: (res.search.results || []).map((item) => ({
          verseKey: item.verseKey,
          verseId: item.verseId,
          text: item.text,
          translations: item.translations,
        })),
      };
    } catch (err) {
      throw new QuranApiError(`Search failed for query "${query}"`, err);
    }
  });
}
