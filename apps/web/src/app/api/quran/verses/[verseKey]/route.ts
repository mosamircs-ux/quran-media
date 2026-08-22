import { NextResponse, type NextRequest } from 'next/server';
import {
  quranVerseService,
  quranTafsirService,
  quranRecitationService,
} from '@quran-media/quran';
import { ValidationError } from '@quran-media/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ verseKey: string }> }
) {
  const { verseKey } = await params;
  const searchParams = request.nextUrl.searchParams;
  const locale = (searchParams.get('locale') as 'ar' | 'en') || 'ar';
  const includeWords = searchParams.get('words') !== 'false';
  const translationId = searchParams.get('translationId')
    ? Number(searchParams.get('translationId'))
    : 131;
  const tafsirId = searchParams.get('tafsirId')
    ? Number(searchParams.get('tafsirId'))
    : undefined;
  const reciterId = searchParams.get('reciterId')
    ? Number(searchParams.get('reciterId'))
    : 7;

  try {
    const verse = await quranVerseService.getVerseByKey({
      verseKey,
      translationIds: [translationId],
      includeWords,
      locale,
    });

    // Optional Tafsir bundle
    let tafsir = undefined;
    if (tafsirId) {
      tafsir = await quranTafsirService.getVerseTafsir(verseKey, tafsirId);
    }

    // Optional audio segment timestamp
    let audio = undefined;
    try {
      const audioRecitation = await quranRecitationService.getChapterRecitationAudio(
        verse.chapterId,
        reciterId
      );
      audio = {
        chapterAudioUrl: audioRecitation.audioUrl,
        verseTimestamp: audioRecitation.verseTimestamps?.find((vt) => vt.verseKey === verseKey),
      };
    } catch {
      // Audio metadata optional
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          verse: {
            ...verse,
            tafsir,
            audioRecitation: audio,
          },
        },
        meta: { timestamp: new Date().toISOString() },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (err: unknown) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_FAILED', message: err.message } },
        { status: 400 }
      );
    }

    const message = err instanceof Error ? err.message : `Failed to fetch verse ${verseKey}`;
    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
