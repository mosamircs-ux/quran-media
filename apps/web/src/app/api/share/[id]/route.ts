import { NextResponse, type NextRequest } from 'next/server';
import { SAMPLE_SHARES, generateSocialCopy, type SocialShareData } from '@/lib/social-share';

declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';

    // 1. Check in static/pre-seeded sample shares
    let shareData: SocialShareData | undefined = SAMPLE_SHARES[id];

    // 2. If not found in samples, check dynamic user projects store
    if (!shareData && global.__STUDIO_MEMORY_PROJECTS && global.__STUDIO_MEMORY_PROJECTS.has(id)) {
      const p = global.__STUDIO_MEMORY_PROJECTS.get(id);
      shareData = {
        id: p.id,
        title: p.title,
        surahNumber: p.surahNumber || 1,
        ayahStart: p.ayahStart || 1,
        ayahEnd: p.ayahEnd,
        surahNameAr: p.surahNameAr || 'الفاتحة',
        surahNameEn: p.surahNameEn || 'Al-Fatihah',
        verseKey: `${p.surahNumber || 1}:${p.ayahStart || 1}`,
        textUthmani: p.textUthmani || 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        translationEn: p.translationEn || 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
        reciterName: p.reciterName || 'مشاري راشد العفاسي',
        durationSeconds: p.durationSeconds || 30,
        aspectRatio: p.aspectRatio || '9:16',
        resolution: '1080x1920',
        videoUrl: p.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: p.thumbnailUrl || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1080&h=1920&auto=format&fit=crop&q=80',
        hashtags: ['#Quran', '#QuranMedia', '#Islam', '#تلاوة_خاشعة', '#قرآن'],
      };
    }

    // Default fallback to Ayat al-Kursi if not found
    if (!shareData) {
      shareData = SAMPLE_SHARES['proj-ayat-alkursi']!;
    }

    const socialCopy = generateSocialCopy(shareData, locale);

    return NextResponse.json({
      success: true,
      data: {
        share: shareData,
        socialCopy,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch share data' },
      { status: 500 }
    );
  }
}
