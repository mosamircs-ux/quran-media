import { NextResponse, type NextRequest } from 'next/server';
import { quranVerseService } from '@quran-media/quran';
import { logger } from '@quran-media/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surah = Number(searchParams.get('surah') || searchParams.get('surahId'));
  const fromAyah = searchParams.get('from') || searchParams.get('fromVerse') ? Number(searchParams.get('from') || searchParams.get('fromVerse')) : 1;
  const toAyah = searchParams.get('to') || searchParams.get('toVerse') ? Number(searchParams.get('to') || searchParams.get('toVerse')) : undefined;
  const locale = (searchParams.get('locale') as 'ar' | 'en') || 'ar';
  const translationId = searchParams.get('translationId') || searchParams.get('translationIds')
    ? Number(searchParams.get('translationId') || searchParams.get('translationIds'))
    : 131;

  if (!surah || surah < 1 || surah > 114) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'VALIDATION_FAILED', message: 'Surah parameter must be between 1 and 114' },
      },
      { status: 400 }
    );
  }

  try {
    const verses = await quranVerseService.getVersesByChapter({
      surahId: surah,
      fromVerse: fromAyah,
      toVerse: toAyah,
      locale,
      translationIds: [translationId],
    });

    return NextResponse.json(
      {
        success: true,
        data: { surah, verses },
        meta: { timestamp: new Date().toISOString() },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch verses';
    logger.error({ err, surah }, 'Error in /api/quran/verses');

    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
