import 'server-only';
import { getQuranServerClient } from '../client/server-client.js';
import { getOrSetCache } from '../client/cache.js';
import { FALLBACK_RECITERS } from '../client/fallback-data.js';
import { isValidSurahId, TOTAL_SURAHS } from '../validation/canonical-bounds.js';
import type { Reciter, AudioRecitationFile } from '../types/recitation.types.js';
import { ValidationError, QuranApiError } from '@quran-media/config';

export class QuranRecitationService {
  /**
   * Retrieves all available Quran reciters.
   */
  async getAvailableReciters(locale: 'ar' | 'en' = 'en'): Promise<Reciter[]> {
    const cacheKey = `quran:reciters:resources:${locale}`;
    const TTL_SECONDS = 86400 * 7; // 7 Days

    return getOrSetCache<Reciter[]>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.resources.v4.recitations({
          language: locale,
        });

        const raw = response as unknown as { recitations?: Reciter[] } | Reciter[];
        const rawReciters = (Array.isArray(raw) ? raw : raw.recitations || []) as Array<{
          id: number;
          reciter_name?: string;
          reciterName?: string;
          name?: string;
          arabic_name?: string;
          arabicName?: string;
          style?: string;
          qirat?: { name: string };
        }>;

        return rawReciters.map((r) => ({
          id: r.id,
          name: r.reciterName ?? r.reciter_name ?? r.name ?? 'Unknown Reciter',
          arabicName: r.arabicName ?? r.arabic_name,
          style: r.style,
          qirat: r.qirat?.name,
        }));
      },
      FALLBACK_RECITERS
    );
  }

  /**
   * Retrieves audio recitation file and timestamp segments for a Surah.
   */
  async getChapterRecitationAudio(
    chapterId: number,
    reciterId: number = 7 // Default Mishari Rashid al-Afasy
  ): Promise<AudioRecitationFile> {
    if (!isValidSurahId(chapterId)) {
      throw new ValidationError(`Chapter ID ${chapterId} is invalid (must be between 1 and ${TOTAL_SURAHS})`);
    }

    const cacheKey = `quran:recitation:audio:${chapterId}:${reciterId}`;
    const TTL_SECONDS = 86400 * 3; // 3 Days

    return getOrSetCache<AudioRecitationFile>(
      cacheKey,
      TTL_SECONDS,
      async () => {
        const client = getQuranServerClient();
        const response = await client.content.v4.recitations.filter({
          chapterNumber: chapterId,
          reciterId,
          segments: true,
        });

        const raw = response as unknown as {
          audioFiles?: Array<{
            id: number;
            chapterId: number;
            audioUrl: string;
            format: string;
            duration: number;
            verseTimestamps: Array<{
              verseKey: string;
              timestampFrom: number;
              timestampTo: number;
              duration: number;
              segments: Array<[number, number, number, number]>;
            }>;
          }>;
        };

        const file = raw.audioFiles?.[0];
        if (!file) {
          const padded = String(chapterId).padStart(3, '0');
          return {
            id: chapterId,
            chapterId,
            reciterId,
            audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${padded}.mp3`,
            format: 'mp3',
            verseTimestamps: [],
          };
        }

        return {
          id: file.id || chapterId,
          chapterId,
          reciterId,
          audioUrl: file.audioUrl.startsWith('http')
            ? file.audioUrl
            : `https://audio.qurancdn.com/${file.audioUrl}`,
          format: file.format || 'mp3',
          durationSeconds: file.duration,
          verseTimestamps: file.verseTimestamps?.map((vt) => ({
            verseKey: vt.verseKey,
            timestampFromMs: vt.timestampFrom,
            timestampToMs: vt.timestampTo,
            durationMs: vt.duration,
            segments: vt.segments,
          })),
        };
      },
      {
        id: chapterId,
        chapterId,
        reciterId,
        audioUrl: `https://audio.qurancdn.com/Alafasy/mp3/${String(chapterId).padStart(3, '0')}.mp3`,
        format: 'mp3',
        verseTimestamps: [],
      }
    );
  }
}

export const quranRecitationService = new QuranRecitationService();
