import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

declare global {
  // eslint-disable-next-line no-var
  var __SAVED_AYAHS_STORE: Map<string, any[]> | undefined;
}

if (!global.__SAVED_AYAHS_STORE) {
  global.__SAVED_AYAHS_STORE = new Map<string, any[]>();
  // Pre-seed sample saved ayahs for demo user
  global.__SAVED_AYAHS_STORE.set('usr_demo_creator_01', [
    {
      id: 'ayah-bookmark-1',
      surahNumber: 2,
      surahNameAr: 'البقرة',
      surahNameEn: 'Al-Baqarah',
      ayahNumber: 255,
      verseKey: '2:255',
      textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ',
      translationText: 'Allah! There is no deity except Him, the Ever-Living, the Sustainer of all existence.',
      notes: 'آية الكرسي — أعظم آية في كتاب الله',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'ayah-bookmark-2',
      surahNumber: 93,
      surahNameAr: 'الضحى',
      surahNameEn: 'Ad-Duha',
      ayahNumber: 5,
      verseKey: '93:5',
      textUthmani: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ',
      translationText: 'And your Lord is going to give you, and you will be satisfied.',
      notes: 'آية تبث الأمل والسكينة في القلب',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'ayah-bookmark-3',
      surahNumber: 65,
      surahNameAr: 'الطلاق',
      surahNameEn: 'At-Talaq',
      ayahNumber: 3,
      verseKey: '65:3',
      textUthmani: 'وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ',
      translationText: 'And will provide for him from where he does not expect. And whoever relies upon Allah - then He is sufficient for him.',
      notes: 'آية التوكل واليقين بالله سبحانه',
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ]);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const store = global.__SAVED_AYAHS_STORE;
    const userAyahs = store?.get(user.id) || [];

    return NextResponse.json({
      success: true,
      data: {
        ayahs: userAyahs,
        total: userAyahs.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch saved ayahs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { surahNumber, surahNameAr, surahNameEn, ayahNumber, textUthmani, translationText, notes } = body;

    const store = global.__SAVED_AYAHS_STORE!;
    const list = store.get(user.id) || [];

    const newBookmark = {
      id: `ayah-bm-${Date.now()}`,
      surahNumber: Number(surahNumber),
      surahNameAr: surahNameAr || `سورة رقم ${surahNumber}`,
      surahNameEn: surahNameEn || `Surah ${surahNumber}`,
      ayahNumber: Number(ayahNumber),
      verseKey: `${surahNumber}:${ayahNumber}`,
      textUthmani,
      translationText,
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };

    list.unshift(newBookmark);
    store.set(user.id, list);

    return NextResponse.json({ success: true, data: { bookmark: newBookmark } }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save ayah' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const store = global.__SAVED_AYAHS_STORE!;
    let list = store.get(user.id) || [];
    list = list.filter((item) => item.id !== id);
    store.set(user.id, list);

    return NextResponse.json({ success: true, data: { message: 'Bookmark removed' } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete saved ayah' },
      { status: 500 }
    );
  }
}
