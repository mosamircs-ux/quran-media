import 'server-only';
import { getQuranServerClient, fetchWithCache } from './client.js';
import type { Verse } from './types.js';
import { QuranApiError } from '@quran-media/config';

export interface GetVersesOptions {
  surah: number;
  fromAyah?: number;
  toAyah?: number;
  translationId?: number;
  locale?: 'ar' | 'en';
}

export async function getVersesBySurah(opts: GetVersesOptions): Promise<Verse[]> {
  const { surah, fromAyah = 1, toAyah, translationId = 131, locale = 'ar' } = opts;
  const cacheKey = `quran:verses:${surah}:${fromAyah}:${toAyah ?? 'all'}:${translationId}:${locale}`;
  const CACHE_TTL_SECONDS = 86400; // 24 Hours

  return fetchWithCache<Verse[]>(cacheKey, CACHE_TTL_SECONDS, async () => {
    const client = getQuranServerClient();
    try {
      const response = await client.content.v4.verses.filter({
        chapterNumber: surah,
        language: locale,
        translations: [translationId],
        words: true,
        wordFields: ['text_uthmani', 'location', 'audio_url', 'translation', 'transliteration'],
        fields: ['text_uthmani', 'verse_key', 'verse_number', 'hizb_number', 'rub_el_hizb_number'],
      });

      const verses = (response as unknown as { verses: Verse[] }).verses || (response as unknown as Verse[]);

      if (!toAyah) {
        return verses.filter((v) => v.verseNumber >= fromAyah);
      }

      return verses.filter((v) => v.verseNumber >= fromAyah && v.verseNumber <= toAyah);
    } catch (err) {
      throw new QuranApiError(`Failed to fetch verses for Surah ${surah}`, err);
    }
  });
}

export async function getVerseByKey(verseKey: string, translationId: number = 131): Promise<Verse> {
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = Number(surahStr);
  const ayah = Number(ayahStr);

  const verses = await getVersesBySurah({ surah, fromAyah: ayah, toAyah: ayah, translationId });
  const verse = verses[0];
  if (!verse) {
    throw new QuranApiError(`Ayah ${verseKey} not found`);
  }
  return verse;
}
