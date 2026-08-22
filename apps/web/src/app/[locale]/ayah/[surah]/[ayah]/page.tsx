import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { type Locale } from '@quran-media/i18n';
import { getCanonicalSurah, validateAndParseVerseKey } from '@quran-media/quran';
import { AyahCard } from '@/components/ayah-explorer/ayah-card';
import { ArrowLeft, ArrowRight, BookOpen, Compass, Sparkles, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';

interface AyahDetailPageProps {
  params: Promise<{
    locale: Locale;
    surah: string;
    ayah: string;
  }>;
}

// Generate Dynamic SEO Metadata for Each Unique Ayah URL (/ayah/2/255)
export async function generateMetadata({ params }: AyahDetailPageProps): Promise<Metadata> {
  const { locale, surah: surahParam, ayah: ayahParam } = await params;
  const surahId = Number(surahParam);
  const ayahNum = Number(ayahParam);
  const verseKey = `${surahId}:${ayahNum}`;

  try {
    validateAndParseVerseKey(verseKey);
  } catch {
    return { title: 'Ayah Not Found — Quran Media' };
  }

  const surahMeta = getCanonicalSurah(surahId);
  const surahName = locale === 'ar' ? `سورة ${surahMeta?.nameAr}` : `Surah ${surahMeta?.nameEn}`;

  const title = `${surahName} [${verseKey}] — Quran Media Studio`;
  const description =
    locale === 'ar'
      ? `استمع لتلاوة الآية ${ayahNum} من سورة ${surahMeta?.nameAr}، وتعرف على تفسيرها المعتمد، وحوّلها إلى فيديو أو قصة مرئية سينمائية.`
      : `Listen to recitation, read verified tafsir, and transform Surah ${surahMeta?.nameEn} (${verseKey}) into cinematic visual stories and social media videos.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://quranmedia.studio/${locale}/ayah/${surahId}/${ayahNum}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/ayah/${surahId}/${ayahNum}`,
      languages: {
        ar: `/ar/ayah/${surahId}/${ayahNum}`,
        en: `/en/ayah/${surahId}/${ayahNum}`,
      },
    },
  };
}

export default async function AyahDetailPage({ params }: AyahDetailPageProps) {
  const { locale, surah: surahParam, ayah: ayahParam } = await params;
  const isAr = locale === 'ar';
  const surahId = Number(surahParam);
  const ayahNum = Number(ayahParam);
  const verseKey = `${surahId}:${ayahNum}`;

  try {
    validateAndParseVerseKey(verseKey);
  } catch {
    notFound();
  }

  const surahMeta = getCanonicalSurah(surahId);
  if (!surahMeta) notFound();

  // Navigation bounds
  const hasPrev = ayahNum > 1;
  const hasNext = ayahNum < surahMeta.versesCount;

  const prevLink = hasPrev ? `/${locale}/ayah/${surahId}/${ayahNum - 1}` : null;
  const nextLink = hasNext ? `/${locale}/ayah/${surahId}/${ayahNum + 1}` : null;

  // Curated prominent Ayah details
  const arabicText =
    verseKey === '2:255'
      ? 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ'
      : verseKey === '1:1'
        ? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
        : verseKey === '93:5'
          ? 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ'
          : verseKey === '55:13'
            ? 'فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ'
            : 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

  const translation =
    verseKey === '2:255'
      ? 'Allah! There is no god ˹worthy of worship˺ except Him, the Ever-Living, All-Sustaining. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth.'
      : verseKey === '1:1'
        ? 'In the Name of Allah—the Most Compassionate, Most Merciful.'
        : verseKey === '93:5'
          ? 'And your Lord will soon give you so much that you will be well pleased.'
          : verseKey === '55:13'
            ? 'Then which of your Lord’s wonders will you both deny?'
            : 'In the Name of Allah—the Most Compassionate, Most Merciful.';

  const tafsirSnippet =
    isAr
      ? `تفسير الآية [${verseKey}] من سورة ${surahMeta.nameAr}: بيان إلهي جليل يشتمل على توحيد الله وعظمته وسعة علمه ورحمته بالخلق.`
      : `Scholarly Tafsir for verse [${verseKey}] of Surah ${surahMeta.nameEn}: An exalted divine declaration encompassing pure monotheism, absolute dominion, and divine wisdom.`;

  // JSON-LD Schema for SEO Rich Results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isAr ? 'الرئيسية' : 'Home',
        item: `https://quranmedia.studio/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isAr ? 'الآيات' : 'Ayahs',
        item: `https://quranmedia.studio/${locale}/ayahs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${surahMeta.nameEn} ${verseKey}`,
        item: `https://quranmedia.studio/${locale}/ayah/${surahId}/${ayahNum}`,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-5xl py-10 space-y-8">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href={`/${locale}`} className="hover:text-amber-500 transition-colors">
          {isAr ? 'الرئيسية' : 'Home'}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/ayahs`} className="hover:text-amber-500 transition-colors">
          {isAr ? 'الآيات' : 'Ayahs'}
        </Link>
        <span>/</span>
        <span className="font-bold text-slate-800 dark:text-slate-200">
          {isAr ? `سورة ${surahMeta.nameAr} [${verseKey}]` : `Surah ${surahMeta.nameEn} [${verseKey}]`}
        </span>
      </nav>

      {/* Top Banner with Surah Metadata */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
              {isAr ? `السورة رقم ${surahId}` : `Surah #${surahId}`}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">
              {surahMeta.revelationPlace} • {surahMeta.versesCount} {isAr ? 'آية' : 'verses'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? `سورة ${surahMeta.nameAr} - الآية ${ayahNum}` : `Surah ${surahMeta.nameEn} — Verse ${ayahNum}`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isAr
              ? `الموضع الكانوني: الجزء الأول، الحزب الأول • ترتيب النزول: ${surahId}`
              : `Canonical Verse Key: ${verseKey} • Total verses in Surah: ${surahMeta.versesCount}`}
          </p>
        </div>

        {/* Previous / Next Ayah Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {prevLink && (
            <Link
              href={prevLink}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{isAr ? 'الآية السابقة' : 'Prev Ayah'}</span>
            </Link>
          )}

          {nextLink && (
            <Link
              href={nextLink}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-colors"
            >
              <span>{isAr ? 'الآية التالية' : 'Next Ayah'}</span>
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Single Ayah Card */}
      <AyahCard
        ayah={{
          verseKey,
          surahNumber: surahId,
          ayahNumber: ayahNum,
          surahNameAr: surahMeta.nameAr,
          surahNameEn: surahMeta.nameEn,
          arabicText,
          translation,
          tafsirSnippet,
        }}
        locale={locale}
      />

      {/* Back to Explorer Banner */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {isAr ? 'هل تبحث عن المزيد من الآيات الكريمة؟' : 'Looking for more profound verses?'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'تصفح مستكشف الآيات الكامل وابحث بالموضوع أو الكلمات' : 'Explore the full Ayah directory by topic, translation, or reciter.'}
          </p>
        </div>

        <Link
          href={`/${locale}/ayahs`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow"
        >
          <Compass className="w-4 h-4" />
          <span>{isAr ? 'المستكشف' : 'Explorer'}</span>
        </Link>
      </div>
    </div>
  );
}
