import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type Locale } from '@quran-media/i18n';
import { QURAN_STORIES, type QuranStory } from '@/lib/stories-catalog';
import { StoryDetailClient } from '@/components/stories/story-detail-client';

interface StoryPageProps {
  params: Promise<{ slug: string; locale: Locale }>;
}

export async function generateStaticParams() {
  return QURAN_STORIES.map((story) => ({
    slug: story.slug,
  }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const isAr = locale === 'ar';

  const story = QURAN_STORIES.find((s) => s.slug === slug || s.id === slug);
  if (!story) {
    return {
      title: 'Story Not Found — Quran Media',
      description: 'The requested Quranic story could not be found.',
    };
  }

  const title = isAr
    ? `${story.titleAr} — سورة ${story.surahNameAr} (${story.ayahRange})`
    : `${story.titleEn} — Surah ${story.surahNameEn} (${story.ayahRange})`;

  const description = isAr ? story.shortSummaryAr : story.shortSummaryEn;

  return {
    title: `${title} | Quran Media Stories`,
    description,
    keywords: [
      story.surahNameEn,
      story.surahNameAr,
      story.categoryNameEn,
      story.categoryNameAr,
      'Quran story',
      'Islamic reflection',
      'Tafsir',
      'Quran video',
    ],
    openGraph: {
      title,
      description,
      type: 'video.other',
      images: [
        {
          url: story.thumbnailUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      videos: story.videoUrl
        ? [
            {
              url: story.videoUrl,
              width: 1920,
              height: 1080,
              type: 'video/mp4',
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [story.thumbnailUrl],
    },
    alternates: {
      canonical: `/${locale}/stories/${story.slug}`,
      languages: {
        ar: `/ar/stories/${story.slug}`,
        en: `/en/stories/${story.slug}`,
      },
    },
  };
}

export default async function StoryDetailPage({ params }: StoryPageProps) {
  const { slug, locale } = await params;
  const isAr = locale === 'ar';

  const story = QURAN_STORIES.find((s) => s.slug === slug || s.id === slug);
  if (!story) {
    notFound();
  }

  // Find related stories in same category or explicit slugs
  const related = QURAN_STORIES.filter(
    (s) => s.id !== story.id && (s.category === story.category || story.relatedStorySlugs.includes(s.slug) || story.relatedStorySlugs.includes(s.id))
  ).slice(0, 3);

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: isAr ? story.titleAr : story.titleEn,
    description: isAr ? story.shortSummaryAr : story.shortSummaryEn,
    thumbnailUrl: [story.thumbnailUrl],
    uploadDate: story.createdAt,
    duration: `PT${story.durationSeconds}S`,
    contentUrl: story.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    embedUrl: `https://quranmedia.app/${locale}/stories/${story.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Quran Media',
      logo: {
        '@type': 'ImageObject',
        url: 'https://quranmedia.app/logo.png',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-8">
        <StoryDetailClient story={story} relatedStories={related} locale={locale} />
      </div>
    </>
  );
}
