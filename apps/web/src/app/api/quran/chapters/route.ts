import { NextResponse, type NextRequest } from 'next/server';
import { quranChapterService } from '@quran-media/quran';
import { logger } from '@quran-media/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = (searchParams.get('locale') as 'ar' | 'en') || 'ar';

  try {
    const chapters = await quranChapterService.getAllChapters(locale);

    return NextResponse.json(
      {
        success: true,
        data: { chapters, total: chapters.length },
        meta: { timestamp: new Date().toISOString() },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch chapters';
    logger.error({ err }, 'Error in /api/quran/chapters');

    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
