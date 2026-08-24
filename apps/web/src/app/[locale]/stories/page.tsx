import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { QURAN_STORIES, STORY_CATEGORIES } from '@/lib/stories-catalog';
import { StoriesListClient } from '@/components/stories/stories-list-client';

import { generateLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generateLocalizedMetadata({
    locale,
    path: '/stories',
    pageKey: 'stories',
  });
}

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  // Schema.org ItemList for Stories Catalog
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isAr ? 'قصص القرآن الكريم' : 'Quran Stories Collection',
    itemListElement: QURAN_STORIES.map((story, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: isAr ? story.titleAr : story.titleEn,
      url: `https://quranmedia.app/${locale}/stories/${story.slug}`,
      image: story.thumbnailUrl,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
        <StoriesListClient stories={QURAN_STORIES} locale={locale} />
      </div>
    </>
  );
}
