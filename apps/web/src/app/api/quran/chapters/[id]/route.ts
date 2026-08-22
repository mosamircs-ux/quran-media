import { NextResponse, type NextRequest } from 'next/server';
import { quranChapterService } from '@quran-media/quran';
import { ValidationError } from '@quran-media/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chapterId = Number(id);
  const searchParams = request.nextUrl.searchParams;
  const locale = (searchParams.get('locale') as 'ar' | 'en') || 'ar';
  const includeInfo = searchParams.get('info') === 'true';

  try {
    const chapter = await quranChapterService.getChapterById(chapterId, locale);
    let info = undefined;

    if (includeInfo) {
      info = await quranChapterService.getChapterInfo(chapterId, locale);
    }

    return NextResponse.json(
      {
        success: true,
        data: { chapter, info },
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

    const message = err instanceof Error ? err.message : `Failed to fetch chapter ${id}`;
    return NextResponse.json(
      { success: false, error: { code: 'QURAN_API_ERROR', message } },
      { status: 502 }
    );
  }
}
