import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type Locale } from '@quran-media/i18n';
import { MEDIA_SHOWCASE_ITEMS } from '@/lib/media-catalog';
import { MediaDetailClient } from '@/components/media-gallery/media-detail-client';

interface MediaPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export async function generateMetadata({ params }: MediaPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const item = MEDIA_SHOWCASE_ITEMS.find((m) => m.id === id);

  if (!item) {
    return { title: 'Media Not Found — Quran Media' };
  }

  const title = `${locale === 'ar' ? item.titleAr : item.titleEn} — Quran Media Studio`;
  const description =
    locale === 'ar'
      ? `شاهد وحمّل مقطع فيديو ${item.titleAr} بدقة ${item.resolution} وتنسيق ${item.aspectRatio} بصوت القارئ ${item.reciterName}.`
      : `Watch and download ${item.titleEn} in ${item.resolution} (${item.aspectRatio}) recited by ${item.reciterName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'video.other',
      url: `https://quranmedia.studio/${locale}/media/${id}`,
    },
    twitter: {
      card: 'player',
      title,
      description,
    },
  };
}

export default async function MediaDetailPage({ params }: MediaPageProps) {
  const { locale, id } = await params;
  const item = MEDIA_SHOWCASE_ITEMS.find((m) => m.id === id);

  if (!item) {
    notFound();
  }

  // JSON-LD Schema for Video Object
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: locale === 'ar' ? item.titleAr : item.titleEn,
    description: item.translation,
    thumbnailUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1080',
    uploadDate: new Date().toISOString(),
    contentUrl: item.videoPreviewUrl,
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-5xl py-10 space-y-8">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <MediaDetailClient mediaItem={item} locale={locale} />
    </div>
  );
}
