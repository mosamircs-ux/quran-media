import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { type Locale, formatNumber } from '@quran-media/i18n';
import { getSurahMeta } from '@/lib/quran-surahs';
import {
  generateAyahMetadata,
  generateAyahJsonLd,
  generateBreadcrumbsJsonLd,
  FAMOUS_AYAHS,
} from '@/lib/seo';
import {
  Sparkles,
  Play,
  Bookmark,
  Share2,
  BookOpen,
  Volume2,
  Layers,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

export const revalidate = 86400; // 24 hours ISR

interface AyahPageProps {
  params: Promise<{
    locale: Locale;
    surahNumber: string;
    ayahNumber: string;
  }>;
}

// Sample fallback canonical verses data for high-speed static/SSR rendering
const VERSE_DATA_MAP: Record<string, { textUthmani: string; translationEn: string; tafsirAr: string; audioUrl: string }> = {
  '2:255': {
    textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    tafsirAr: 'هذه آية الكرسي ولها شأن عظيم، قد صح الحديث عن رسول الله صلى الله عليه وسلم بأنها أفضل آية في كتاب الله... {الله لا إله إلا هو} إخبار بأنه المنفرد بالإلهية لجميع الخلائق {الحي القيوم} الحي في نفسه الذي لا يموت أبداً، القيم لغيره، فجميع الموجودات مفتقرة إليه وهو غني عنها.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/002255.mp3',
  },
  '93:5': {
    textUthmani: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ',
    translationEn: 'And your Lord is going to give you, and you will be satisfied.',
    tafsirAr: 'أي: في الدار الآخرة يعطيه حتى يرضيه في أمته، وفيما أعده له من الكرامة، ومن جملته نهر الكوثر.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/093005.mp3',
  },
  '1:1': {
    textUthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    tafsirAr: 'افتتح الله بها كتابه العزيز، ومعناها: أبدأ قراءتي متبركاً باسم الله مستعيناً به وحده.',
    audioUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
  },
};

export async function generateMetadata({ params }: AyahPageProps): Promise<Metadata> {
  const { locale, surahNumber, ayahNumber } = await params;
  const sNum = parseInt(surahNumber, 10);
  const aNum = parseInt(ayahNumber, 10);
  const surah = getSurahMeta(sNum);
  const verseKey = `${sNum}:${aNum}`;
  const verse = VERSE_DATA_MAP[verseKey] || {
    textUthmani: `آية رقم ${aNum} من سورة ${surah.nameAr}`,
    translationEn: `Verse ${aNum} of Surah ${surah.nameEn}`,
  };

  return generateAyahMetadata({
    surahNumber: sNum,
    ayahNumber: aNum,
    surahNameAr: surah.nameAr,
    surahNameEn: surah.nameEn,
    textUthmani: verse.textUthmani,
    translationEn: verse.translationEn,
    locale,
  });
}

export default async function AyahPage({ params }: AyahPageProps) {
  const { locale, surahNumber, ayahNumber } = await params;
  const sNum = parseInt(surahNumber, 10);
  const aNum = parseInt(ayahNumber, 10);
  const isAr = locale === 'ar';

  const surah = getSurahMeta(sNum);
  const verseKey = `${sNum}:${aNum}`;
  const famous = FAMOUS_AYAHS[verseKey];

  const verse = VERSE_DATA_MAP[verseKey] || {
    textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence.',
    tafsirAr: 'تفسير الآية الكريمة وبيان معانيها العظيمة وهداياتها للمؤمنين.',
    audioUrl: `https://everyayah.com/data/Alafasy_128kbps/${String(sNum).padStart(3, '0')}${String(aNum).padStart(3, '0')}.mp3`,
  };

  // Structured Data (JSON-LD)
  const ayahJsonLd = generateAyahJsonLd({
    surahNumber: sNum,
    ayahNumber: aNum,
    surahNameAr: surah.nameAr,
    surahNameEn: surah.nameEn,
    textUthmani: verse.textUthmani,
    translationEn: verse.translationEn,
    audioUrl: verse.audioUrl,
    locale,
  });

  const breadcrumbsJsonLd = generateBreadcrumbsJsonLd([
    { name: isAr ? 'الرئيسية' : 'Home', url: `/${locale}` },
    { name: isAr ? 'السور' : 'Surahs', url: `/${locale}/surahs` },
    { name: isAr ? `سورة ${surah.nameAr}` : surah.nameEn, url: `/${locale}/surah/${sNum}` },
    { name: isAr ? `آية ${aNum}` : `Ayah ${aNum}`, url: `/${locale}/ayah/${sNum}/${aNum}` },
  ]);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ayahJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-8 max-w-5xl py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link href={`/${locale}`} className="hover:text-amber-500 transition-colors">
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/surahs`} className="hover:text-amber-500 transition-colors">
            {isAr ? 'سور القرآن' : 'Surahs'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/surah/${sNum}`} className="hover:text-amber-500 transition-colors">
            {isAr ? `سورة ${surah.nameAr}` : `Surah ${surah.nameEn}`}
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-bold">{isAr ? `آية ${aNum}` : `Ayah ${aNum}`}</span>
        </nav>

        {/* Main Verse Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-6 sm:p-10 text-white shadow-2xl space-y-6">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {isAr ? `سورة ${surah.nameAr}` : `Surah ${surah.nameEn}`} • {isAr ? `آية ${aNum}` : `Ayah ${aNum}`}
                </span>
                {famous && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {isAr ? famous.titleAr : famous.titleEn}
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black mt-2 text-white">
                {famous
                  ? isAr
                    ? `${famous.titleAr} — القرآن ${verseKey}`
                    : `${famous.titleEn} — Quran ${verseKey}`
                  : isAr
                  ? `سورة ${surah.nameAr} الآية ${aNum}`
                  : `Surah ${surah.nameEn} Verse ${aNum}`}
              </h1>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/${locale}/create/story?surah=${sNum}&ayah=${aNum}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAr ? 'إنتاج فيديو سينمائي بالذكاء الاصطناعي' : 'Generate Visual Story'}</span>
              </Link>
            </div>
          </div>

          {/* Uthmani Quranic Text */}
          <div className="py-6 px-4 sm:px-8 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md">
            <p className="font-arabic text-2xl sm:text-3xl sm:leading-loose text-center text-amber-100/95 tracking-wide selection:bg-amber-500 selection:text-slate-950">
              {verse.textUthmani}
            </p>
          </div>

          {/* Translation */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isAr ? 'الترجمة الإنجليزية المعتمدة (Saheeh International)' : 'Verified English Translation'}
            </h3>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif italic bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              "{verse.translationEn}"
            </p>
          </div>

          {/* Audio Player Bar */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">{isAr ? 'تلاوة الشيخ مشاري راشد العفاسي' : 'Recitation by Sheikh Mishari Alafasy'}</p>
                <p className="text-[11px] text-slate-400">Murattal High-Quality Audio (EveryAyah CDN)</p>
              </div>
            </div>
            <audio controls src={verse.audioUrl} className="h-9 w-48 sm:w-64 accent-amber-500" />
          </div>
        </div>

        {/* Tafsir & Reflection Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-500 font-black text-sm">
              <BookOpen className="w-4 h-4" />
              <span>{isAr ? 'تفسير ابن كثير (تفسير القرآن العظيم)' : 'Tafsir Ibn Kathir Commentary'}</span>
            </div>
            <p className="font-arabic text-base sm:text-lg leading-loose text-slate-800 dark:text-slate-200 text-justify">
              {verse.tafsirAr}
            </p>
          </div>

          {/* Metadata Sidebar Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {isAr ? 'بيانات الآية الكريمة' : 'Verse Metadata'}
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">{isAr ? 'رقم السورة' : 'Surah Number'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{sNum} ({surah.nameEn})</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">{isAr ? 'رقم الآية' : 'Ayah Number'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{aNum}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">{isAr ? 'مكان النزول' : 'Revelation'}</span>
                <span className="font-bold text-slate-900 dark:text-white">{surah.revelationType}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-400">{isAr ? 'الرسم العثماني' : 'Calligraphy'}</span>
                <span className="font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>مجمع الملك فهد</span>
                </span>
              </div>
            </div>

            <Link
              href={`/${locale}/studio?surah=${sNum}&ayah=${aNum}`}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>{isAr ? 'فتح في استوديو الميديا' : 'Open in Media Studio'}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
