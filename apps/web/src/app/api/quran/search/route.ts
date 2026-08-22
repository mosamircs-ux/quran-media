import { NextResponse, type NextRequest } from 'next/server';
import { searchQuran } from '@quran-media/quran';
import { logger } from '@quran-media/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q');
  const locale = (searchParams.get('locale') as 'ar' | 'en') || 'ar';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;
  const size = searchParams.get('size') ? Number(searchParams.get('size')) : 20;

  if (!q || q.trim().length < 2) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'VALIDATION_FAILED', message: 'Search query must be at least 2 characters' },
      },
      { status: 400 }
    );
  }

  try {
    const results = await searchQuran({ query: q, locale, page, size });

    return NextResponse.json({
      success: true,
      data: results,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Search failed';
    logger.error({ err, q }, 'Error in /api/quran/search');

    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
