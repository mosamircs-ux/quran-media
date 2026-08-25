import React from 'react';
import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { SocialShareClient } from '@/components/share/social-share-client';
import { SAMPLE_SHARES, generateSocialCopy, type SocialShareData } from '@/lib/social-share';
import { generateLocalizedMetadata, SITE_BASE_URL } from '@/lib/seo';

declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

interface SharePageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

function resolveShareData(id: string): SocialShareData {
  if (SAMPLE_SHARES[id]) {
    return SAMPLE_SHARES[id]!;
  }

  if (global.__STUDIO_MEMORY_PROJECTS && global.__STUDIO_MEMORY_PROJECTS.has(id)) {
    const p = global.__STUDIO_MEMORY_PROJECTS.get(id);
    return {
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

  return SAMPLE_SHARES['proj-ayat-alkursi']!;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const share = resolveShareData(id);
  const isAr = locale === 'ar';

  const title = isAr
    ? `${share.title} — سورة ${share.surahNameAr} [${share.verseKey}]`
    : `${share.title} — Surah ${share.surahNameEn} [${share.verseKey}] (9:16 Video)`;

  const description = isAr
    ? `شاهد تلاوة مرئية خاشعة لسورة ${share.surahNameAr} (${share.verseKey}) بصوت ${share.reciterName}. جودة عالية 1080x1920 جاهزة للمشاركة على ريلز وتيك توك.`
    : `Watch vertical HD 1080x1920 Quran video: Surah ${share.surahNameEn} [${share.verseKey}] recited by ${share.reciterName}. Produced with Quran Media Studio.`;

  return generateLocalizedMetadata({
    locale,
    path: `/share/${id}`,
    title,
    description,
    ogImage: share.thumbnailUrl,
    ogVideo: share.videoUrl,
    ogType: 'video.other',
    keywords: share.hashtags,
  });
}

export default async function SharePage({ params }: SharePageProps) {
  const { locale, id } = await params;
  const share = resolveShareData(id);
  const socialCopy = generateSocialCopy(share, locale);

  // Schema.org VideoObject Structured Data
  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: share.title,
    description: share.translationEn,
    thumbnailUrl: [share.thumbnailUrl],
    contentUrl: share.videoUrl,
    embedUrl: `${SITE_BASE_URL}/${locale}/share/${id}?embed=true`,
    uploadDate: '2026-01-01T00:00:00Z',
    duration: `PT${share.durationSeconds}S`,
    inLanguage: ['ar', 'en'],
    hasPart: {
      '@type': 'CreativeWork',
      name: `Quran ${share.verseKey}`,
      text: share.textUthmani,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10">
        <SocialShareClient share={share} socialCopy={socialCopy} locale={locale} />
      </div>
    </>
  );
}
