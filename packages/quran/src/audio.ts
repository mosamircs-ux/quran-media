import 'server-only';
import { getQuranServerClient, fetchWithCache } from './client.js';
import type { ReciterAudioData } from './types.js';
import { QuranApiError } from '@quran-media/config';

export async function getRecitationAudio(
  surahNumber: number,
  reciterId: number = 7
): Promise<ReciterAudioData> {
  const cacheKey = `quran:audio:${surahNumber}:${reciterId}`;
  const CACHE_TTL_SECONDS = 172800; // 48 Hours

  return fetchWithCache<ReciterAudioData>(cacheKey, CACHE_TTL_SECONDS, async () => {
    const client = getQuranServerClient();
    try {
      // Audio file and verse timestamp segment fetching
      const response = await client.content.v4.recitations.filter({
        reciterId,
        chapterNumber: surahNumber,
        segments: true,
      });

      const data = response as unknown as {
        audioFiles?: Array<{
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

      const file = data.audioFiles?.[0];
      if (!file) {
        // Construct standard fallback CDN audio URL for reciter 7 (Mishari)
        const paddedSurah = String(surahNumber).padStart(3, '0');
        return {
          surahNumber,
          reciterId,
          audioUrl: `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${paddedSurah}.mp3`,
          format: 'mp3',
          verseTimestamps: [],
        };
      }

      return {
        surahNumber,
        reciterId,
        audioUrl: file.audioUrl.startsWith('http') ? file.audioUrl : `https://audio.qurancdn.com/${file.audioUrl}`,
        format: file.format || 'mp3',
        durationSeconds: file.duration,
        verseTimestamps: file.verseTimestamps.map((vt) => ({
          verseKey: vt.verseKey,
          timestampFromMs: vt.timestampFrom,
          timestampToMs: vt.timestampTo,
          durationMs: vt.duration,
          segments: vt.segments.map(([wordIndex, startMs, endMs]) => ({
            wordIndex: wordIndex ?? 0,
            startMs: startMs ?? 0,
            endMs: endMs ?? 0,
            durationMs: (endMs ?? 0) - (startMs ?? 0),
          })),
        })),
      };
    } catch (err) {
      throw new QuranApiError(
        `Failed to fetch audio recitation for Surah ${surahNumber}, reciter ${reciterId}`,
        err
      );
    }
  });
}
