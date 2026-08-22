import { NextResponse, type NextRequest } from 'next/server';
import { quranTranslationService } from '@quran-media/quran';
import { logger } from '@quran-media/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const language = searchParams.get('language') || undefined;

  try {
    const translations = await quranTranslationService.getAvailableTranslations(language);

    return NextResponse.json(
      {
        success: true,
        data: { translations, total: translations.length },
        meta: { timestamp: new Date().toISOString() },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch translations';
    logger.error({ err }, 'Error in /api/quran/translations');

    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
