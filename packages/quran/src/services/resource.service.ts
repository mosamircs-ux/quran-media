import { getQuranServerClient } from '../client/server-client.js';
import { getOrSetCache } from '../client/cache.js';
import type { Language } from '../types/resource.types.js';

export class QuranResourceService {
  /**
   * Retrieves all supported languages on the Quran platform.
   */
  async getAvailableLanguages(locale: 'ar' | 'en' = 'en'): Promise<Language[]> {
    const cacheKey = `quran:resources:languages:${locale}`;
    const TTL_SECONDS = 86400 * 30; // 30 Days

    return getOrSetCache<Language[]>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.resources.v4.languages({
          language: locale,
        });

        const raw = response as unknown as { languages?: Language[] } | Language[];
        const rawLangs = (Array.isArray(raw) ? raw : raw.languages || []) as Array<{
          id: number;
          name: string;
          iso_code?: string;
          isoCode?: string;
          native_name?: string;
          nativeName?: string;
          direction?: 'ltr' | 'rtl';
          translations_count?: number;
          translationsCount?: number;
        }>;

        return rawLangs.map((l) => ({
          id: l.id,
          name: l.name,
          isoCode: l.isoCode ?? l.iso_code ?? 'en',
          nativeName: l.nativeName ?? l.native_name ?? l.name,
          direction: l.direction || 'ltr',
          translationsCount: l.translationsCount ?? l.translations_count,
        }));
      },
      [
        { id: 38, name: 'Arabic', isoCode: 'ar', nativeName: 'العربية', direction: 'rtl' },
        { id: 22, name: 'English', isoCode: 'en', nativeName: 'English', direction: 'ltr' },
        { id: 161, name: 'Urdu', isoCode: 'ur', nativeName: 'اردو', direction: 'rtl' },
        { id: 48, name: 'French', isoCode: 'fr', nativeName: 'Français', direction: 'ltr' },
      ]
    );
  }
}

export const quranResourceService = new QuranResourceService();
