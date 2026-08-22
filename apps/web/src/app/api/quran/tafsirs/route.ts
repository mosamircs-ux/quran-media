import { NextResponse, type NextRequest } from 'next/server';
import { quranTafsirService } from '@quran-media/quran';
import { logger } from '@quran-media/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get('language') || undefined;

  try {
    const tafsirs = await quranTafsirService.getAvailableTafsirs(language);

    return NextResponse.json(
      {
        success: true,
        data: { tafsirs, total: tafsirs.length },
        meta: { timestamp: new Date().toISOString() },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch tafsirs';
    logger.error({ err }, 'Error in /api/quran/tafsirs');

    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
