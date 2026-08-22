import { NextResponse, type NextRequest } from 'next/server';
import { quranVerseService } from '@quran-media/quran';
import { ValidationError } from '@quran-media/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surahId = Number(searchParams.get('surah'));
  const fromVerse = Number(searchParams.get('from'));
  const toVerse = Number(searchParams.get('to'));
  const locale = (searchParams.get('locale') as 'ar' | 'en') || 'ar';
  const includeWords = searchParams.get('words') !== 'false';
  const translationId = searchParams.get('translationId')
    ? Number(searchParams.get('translationId'))
    : 131;

  if (!surahId || !fromVerse || !toVerse) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Parameters "surah", "from", and "to" are required (e.g. ?surah=2&from=255&to=257)',
        },
      },
      { status: 400 }
    );
  }

  try {
    const range = await quranVerseService.getVerseRange(surahId, fromVerse, toVerse, {
      translationIds: [translationId],
      includeWords,
      locale,
    });

    return NextResponse.json(
      {
        success: true,
        data: range,
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

    const message = err instanceof Error ? err.message : 'Failed to fetch verse range';
    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
