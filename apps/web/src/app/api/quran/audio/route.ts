import { NextResponse, type NextRequest } from 'next/server';
import { quranRecitationService } from '@quran-media/quran';
import { logger } from '@quran-media/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const surah = Number(searchParams.get('surah'));
  const reciterId = searchParams.get('reciterId') ? Number(searchParams.get('reciterId')) : 7;

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
    const audio = await quranRecitationService.getChapterRecitationAudio(surah, reciterId);

    return NextResponse.json(
      {
        success: true,
        data: audio,
        meta: { timestamp: new Date().toISOString() },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=172800, s-maxage=172800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch recitation audio';
    logger.error({ err, surah, reciterId }, 'Error in /api/quran/audio');

    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
