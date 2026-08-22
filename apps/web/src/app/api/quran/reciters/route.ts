import { NextResponse, type NextRequest } from 'next/server';
import { quranRecitationService } from '@quran-media/quran';
import { logger } from '@quran-media/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const locale = (searchParams.get('locale') as 'ar' | 'en') || 'en';

  try {
    const reciters = await quranRecitationService.getAvailableReciters(locale);

    return NextResponse.json(
      {
        success: true,
        data: { reciters, total: reciters.length },
        meta: { timestamp: new Date().toISOString() },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch reciters';
    logger.error({ err }, 'Error in /api/quran/reciters');

    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
