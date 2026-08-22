import 'server-only';
import { getQuranServerClient } from '../client/server-client.js';
import { getOrSetCache } from '../client/cache.js';
import type { SearchResult } from '../types/search.types.js';
import { ValidationError, QuranApiError } from '@quran-media/config';

export interface SearchOptions {
  query: string;
  locale?: 'ar' | 'en';
  page?: number;
  size?: number;
}

export class QuranSearchService {
  /**
   * Performs full-text search across Quranic text and translations.
   */
  async search(options: SearchOptions): Promise<SearchResult> {
    const { query, locale = 'ar', page = 1, size = 20 } = options;

    if (!query || query.trim().length < 2) {
      throw new ValidationError('Search query must contain at least 2 characters');
    }

    const sanitizedQuery = query.trim();
    const cacheKey = `quran:search:${encodeURIComponent(sanitizedQuery)}:${locale}:${page}:${size}`;
    const TTL_SECONDS = 21600; // 6 Hours

    return getOrSetCache<SearchResult>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.search.v1.query({
          query: sanitizedQuery,
          language: locale,
          page,
          size,
        });

        const raw = response as unknown as {
          search: {
            query: string;
            totalResults: number;
            currentPage: number;
            totalPages: number;
            results: Array<{
              verseKey?: string;
              verse_key?: string;
              verseId?: number;
              verse_id?: number;
              text: string;
              translations?: Array<{ name: string; text: string }>;
            }>;
          };
        };

        const searchData = raw?.search;
        if (!searchData) {
          return {
            query: sanitizedQuery,
            totalResults: 0,
            currentPage: page,
            totalPages: 1,
            results: [],
          };
        }

        return {
          query: searchData.query || sanitizedQuery,
          totalResults: searchData.totalResults || 0,
          currentPage: searchData.currentPage || page,
          totalPages: searchData.totalPages || 1,
          results: (searchData.results || []).map((r) => ({
            verseKey: r.verseKey ?? r.verse_key ?? '1:1',
            verseId: r.verseId ?? r.verse_id ?? 1,
            text: r.text,
            translations: r.translations,
          })),
        };
      },
      {
        query: sanitizedQuery,
        totalResults: 0,
        currentPage: page,
        totalPages: 1,
        results: [],
      }
    );
  }
}

export const quranSearchService = new QuranSearchService();
