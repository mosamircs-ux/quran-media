import 'server-only';
import { getQuranServerClient } from '../client/server-client.js';
import { getOrSetCache } from '../client/cache.js';
import { FALLBACK_TAFSIRS } from '../client/fallback-data.js';
import { validateAndParseVerseKey } from '../validation/verse-key.validator.js';
import { sanitizeHtml } from '../validation/sanitization.js';
import type { TafsirResource, VerseTafsir } from '../types/tafsir.types.js';
import { QuranApiError } from '@quran-media/config';

export class QuranTafsirService {
  /**
   * Retrieves all available Tafsir books with optional language filter.
   */
  async getAvailableTafsirs(language?: string): Promise<TafsirResource[]> {
    const cacheKey = `quran:tafsirs:resources:${language || 'all'}`;
    const TTL_SECONDS = 86400 * 7; // 7 Days

    return getOrSetCache<TafsirResource[]>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.resources.v4.tafsirs({
          language,
        });

        const raw = response as unknown as { tafsirs?: TafsirResource[] } | TafsirResource[];
        const rawTafsirs = (Array.isArray(raw) ? raw : raw.tafsirs || []) as Array<{
          id: number;
          name: string;
          author_name?: string;
          authorName?: string;
          language_name?: string;
          languageName?: string;
          slug?: string;
        }>;

        return rawTafsirs.map((t) => ({
          id: t.id,
          name: t.name,
          authorName: t.authorName ?? t.author_name ?? 'Unknown',
          languageName: t.languageName ?? t.language_name ?? 'arabic',
          slug: t.slug || `tafsir-${t.id}`,
        }));
      },
      FALLBACK_TAFSIRS
    );
  }

  /**
   * Retrieves scholarly Tafsir for a specific verse key and sanitizes all HTML.
   */
  async getVerseTafsir(
    verseKey: string,
    tafsirId: number = 16 // 16 = Tafsir Ibn Kathir (en), 169 = Tafsir As-Saadi (ar)
  ): Promise<VerseTafsir> {
    const parsed = validateAndParseVerseKey(verseKey);
    const cacheKey = `quran:tafsir:verse:${parsed.canonicalKey}:${tafsirId}`;
    const TTL_SECONDS = 86400 * 7; // 7 Days

    return getOrSetCache<VerseTafsir>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.content.v4.tafsirs.filter({
          tafsirId,
          chapterNumber: parsed.surahId,
        });

        const raw = response as unknown as {
          tafsirs?: Array<{
            id: number;
            verseId: number;
            verseKey: string;
            text: string;
            resourceId?: number;
            resourceName?: string;
            languageName?: string;
          }>;
        };

        const tafsir = raw.tafsirs?.find(
          (t) => t.verseKey === parsed.canonicalKey || t.verseId === parsed.verseNumber
        ) ?? raw.tafsirs?.[0];

        if (!tafsir?.text) {
          throw new QuranApiError(`Tafsir ${tafsirId} not found for verse ${parsed.canonicalKey}`);
        }

        const rawText = tafsir.text;
        const sanitized = sanitizeHtml(rawText);

        return {
          id: tafsir.id || tafsirId,
          resourceId: tafsirId,
          resourceName: tafsir.resourceName,
          languageName: tafsir.languageName,
          text: sanitized,
          rawText,
        };
      },
      {
        id: tafsirId,
        resourceId: tafsirId,
        text: `<p>Tafsir for verse ${parsed.canonicalKey} is available in offline mode.</p>`,
        rawText: `Tafsir for verse ${parsed.canonicalKey}`,
      }
    );
  }
}

export const quranTafsirService = new QuranTafsirService();
