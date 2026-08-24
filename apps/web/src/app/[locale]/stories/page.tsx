import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { QURAN_STORIES, STORY_CATEGORIES } from '@/lib/stories-catalog';
import { StoriesListClient } from '@/components/stories/stories-list-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';

  const title = isAr
    ? 'قصص القرآن والتأملات الإيمانية — استكشف العبر والتفاسير المعتمدة'
    : 'Quran Stories & Reflections — Explore Thematic Wisdom & Tafsir';

  const description = isAr
    ? 'مكتبة تفاعلية لقصص القرآن الكريم وتأملاته عبر 14 تصنيفاً: الأنبياء، الإيمان، الصبر، الرحمة، المغفرة، الجنة، وغيرها، مع تلاوات خاشعة وتفاسير معتمدة.'
    : 'Interactive library of authentic Quranic stories and reflections across 14 categories: Prophets, Faith, Patience, Mercy, Forgiveness, Paradise, and more.';

  return {
    title,
    description,
    keywords: [
      'Quran stories',
      'Islamic reflections',
      'Tafsir Ibn Kathir',
      'Tafsir As-Sadi',
      'Surah Yusuf',
      'Companions of the cave',
      'Prophets in Quran',
      'قصص القرآن',
      'تفسير القرآن',
      'تدبر',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&auto=format&fit=crop&q=80',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&auto=format&fit=crop&q=80'],
    },
    alternates: {
      canonical: `/${locale}/stories`,
      languages: {
        ar: '/ar/stories',
        en: '/en/stories',
      },
    },
  };
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
