import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type Locale } from '@quran-media/i18n';
import { ALL_114_SURAHS } from '@/lib/surahs-catalog';
import { SurahDetailClient } from '@/components/surah-detail/surah-detail-client';
import type { AyahCardData } from '@/components/ayah-explorer/ayah-card';
import { quranVerseService, isValidSurahId } from '@quran-media/quran';

interface SurahPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

// Generate Dynamic SEO Metadata for Each Unique Surah Page (/surah/[id])
export async function generateMetadata({ params }: SurahPageProps): Promise<Metadata> {
  const { locale, id: idParam } = await params;
  const surahId = Number(idParam);

  if (!isValidSurahId(surahId)) {
    return { title: 'Surah Not Found — Quran Media' };
  }

  const surah = ALL_114_SURAHS.find((s) => s.id === surahId);
  if (!surah) {
    return { title: 'Surah Not Found — Quran Media' };
  }

  const title =
    locale === 'ar'
      ? `سورة ${surah.nameAr} (${surah.versesCount} آية) — منصة ميديا القرآن`
      : `Surah ${surah.nameEn} (${surah.meaningEn}) — Quran Media Studio`;

  const description =
    locale === 'ar'
      ? `استمع لتلاوة سورة ${surah.nameAr} كاملة، وتصفح آياتها بالرسم العثماني مع التفسير والترجمة، وأنشئ مقاطع وقصصاً سينمائية ملهمة.`
      : `Listen to full chapter recitation of Surah ${surah.nameEn} (${surah.versesCount} verses), explore scholarly tafsir, and generate cinematic visual stories & videos.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://quranmedia.studio/${locale}/surah/${surahId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/surah/${surahId}`,
      languages: {
        ar: `/ar/surah/${surahId}`,
        en: `/en/surah/${surahId}`,
      },
    },
  };
}

export default async function SurahDetailPage({ params }: SurahPageProps) {
  const { locale, id: idParam } = await params;
  const isAr = locale === 'ar';
  const surahId = Number(idParam);

  if (!isValidSurahId(surahId)) {
    notFound();
  }

  const surah = ALL_114_SURAHS.find((s) => s.id === surahId);
  if (!surah) {
    notFound();
  }

  // Retrieve verses for this Surah (from service or canonical seed fallback)
  let versesList: AyahCardData[] = [];

  try {
    const apiResult = await quranVerseService.getVersesByChapter({
      surahId,
      translationIds: [131],
      locale,
      fromVerse: 1,
      toVerse: surah.versesCount,
    });

    versesList = apiResult.map((v) => ({
      verseKey: v.verseKey,
      surahNumber: surahId,
      ayahNumber: v.verseNumber,
      surahNameAr: surah.nameAr,
      surahNameEn: surah.nameEn,
      juzNumber: 1,
      hizbNumber: v.hizbNumber,
      pageNumber: 1,
      arabicText: v.textUthmani || v.textSimple,
      translation: v.translations?.[0]?.text || 'Translation in progress...',
      transliteration: v.transliteration,
      audioUrl: v.audio?.url || `https://audio.qurancdn.com/Alafasy/mp3/${String(surahId).padStart(3, '0')}${String(v.verseNumber).padStart(3, '0')}.mp3`,
      reciterName: 'Mishari Rashid Al-Afasy',
      tafsirSnippet: `${isAr ? 'تفسير الآية' : 'Tafsir for verse'} [${v.verseKey}] ${isAr ? 'من سورة' : 'of Surah'} ${surah.nameEn}`,
    }));
  } catch {
    // Graceful fallback for offline / seed generation
    versesList = Array.from({ length: Math.min(surah.versesCount, 50) }, (_, i) => {
      const ayahNum = i + 1;
      const key = `${surahId}:${ayahNum}`;
      return {
        verseKey: key,
        surahNumber: surahId,
        ayahNumber: ayahNum,
        surahNameAr: surah.nameAr,
        surahNameEn: surah.nameEn,
        arabicText: ayahNum === 1 ? 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ' : `آية كريمة رقم ${ayahNum} من سورة ${surah.nameAr}`,
        translation: ayahNum === 1 ? 'In the Name of Allah—the Most Compassionate, Most Merciful.' : `Verse ${ayahNum} of Surah ${surah.nameEn}.`,
        audioUrl: `https://audio.qurancdn.com/Alafasy/mp3/${String(surahId).padStart(3, '0')}${String(ayahNum).padStart(3, '0')}.mp3`,
        reciterName: 'Mishari Rashid Al-Afasy',
        tafsirSnippet: `Tafsir insight for verse [${key}]`,
      };
    });
  }

  // JSON-LD Schema for Surah Page
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
        name: isAr ? 'السور' : 'Surahs',
        item: `https://quranmedia.studio/${locale}/surahs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${surah.nameEn} (${surah.id})`,
        item: `https://quranmedia.studio/${locale}/surah/${surah.id}`,
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

      <SurahDetailClient surah={surah} verses={versesList} locale={locale} />
    </div>
  );
}
