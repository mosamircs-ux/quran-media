import 'server-only';
import { getQuranServerClient } from '../client/server-client.js';
import { getOrSetCache } from '../client/cache.js';
import { FALLBACK_TRANSLATIONS } from '../client/fallback-data.js';
import { validateAndParseVerseKey } from '../validation/verse-key.validator.js';
import type { TranslationResource, VerseTranslation } from '../types/translation.types.js';
import { QuranApiError } from '@quran-media/config';

export class QuranTranslationService {
  /**
   * Retrieves all available Quran translations with optional language filter.
   */
  async getAvailableTranslations(language?: string): Promise<TranslationResource[]> {
    const cacheKey = `quran:translations:resources:${language || 'all'}`;
    const TTL_SECONDS = 86400 * 7; // 7 Days

    return getOrSetCache<TranslationResource[]>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.resources.v4.translations({
          language,
        });

        const raw = response as unknown as { translations?: TranslationResource[] } | TranslationResource[];
        const rawTranslations = (Array.isArray(raw) ? raw : raw.translations || []) as Array<{
          id: number;
          name: string;
          author_name?: string;
          authorName?: string;
          language_name?: string;
          languageName?: string;
          direction?: 'ltr' | 'rtl';
        }>;

        return rawTranslations.map((t) => ({
          id: t.id,
          name: t.name,
          authorName: t.authorName ?? t.author_name ?? 'Unknown',
          languageName: t.languageName ?? t.language_name ?? 'english',
          direction: t.direction || 'ltr',
        }));
      },
      FALLBACK_TRANSLATIONS
    );
  }

  /**
   * Retrieves translations for a specific verse key by translation ID.
   */
  async getVerseTranslation(
    verseKey: string,
    translationId: number = 131
  ): Promise<VerseTranslation> {
    const parsed = validateAndParseVerseKey(verseKey);
    const cacheKey = `quran:translations:verse:${parsed.canonicalKey}:${translationId}`;
    const TTL_SECONDS = 86400 * 3; // 3 Days

    return getOrSetCache<VerseTranslation>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.content.v4.verses.filter({
          chapterNumber: parsed.surahId,
          translations: [translationId],
        });

        const raw = response as unknown as { verses?: Array<{ translations?: VerseTranslation[] }> };
        const verses = raw.verses || [];
        const translation = verses[0]?.translations?.[0];

        if (!translation) {
          throw new QuranApiError(`Translation ${translationId} not found for verse ${parsed.canonicalKey}`);
        }

        return {
          id: translation.id,
          resourceId: translationId,
          text: translation.text,
        };
      },
      {
        id: translationId,
        resourceId: translationId,
        text: 'Translation text unavailable offline.',
      }
    );
  }
}

export const quranTranslationService = new QuranTranslationService();
