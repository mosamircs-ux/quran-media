import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type Locale } from '@quran-media/i18n';
import { QURAN_STORIES } from '@/lib/stories-catalog';
import { StoryReaderClient } from '@/components/stories/story-reader-client';

interface StoryPageProps {
  params: Promise<{
    locale: Locale;
    id: string;
  }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const story = QURAN_STORIES.find((s) => s.id === id);

  if (!story) {
    return { title: 'Story Not Found — Quran Media' };
  }

  const title = `${locale === 'ar' ? story.titleAr : story.titleEn} — Quran Media Studio`;
  const description = locale === 'ar' ? story.shortSummaryAr : story.shortSummaryEn;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://quranmedia.studio/${locale}/story/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { locale, id } = await params;
  const story = QURAN_STORIES.find((s) => s.id === id);

  if (!story) {
    notFound();
  }

  // JSON-LD Schema for Story
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: locale === 'ar' ? story.titleAr : story.titleEn,
    description: locale === 'ar' ? story.shortSummaryAr : story.shortSummaryEn,
    author: {
      '@type': 'Organization',
      name: 'Quran Media Studio',
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-4xl py-10 space-y-8">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <StoryReaderClient story={story} locale={locale} />
    </div>
  );
}
