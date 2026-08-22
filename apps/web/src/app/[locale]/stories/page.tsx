import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { QURAN_STORIES } from '@/lib/stories-catalog';
import { StoriesListClient } from '@/components/stories/stories-list-client';

export const metadata: Metadata = {
  title: 'Quran Stories & Reflections — Thematic Contemplation & Media',
  description:
    'Explore authentic Quranic stories and reflections grounded in classical Tafsir (Ibn Kathir, As-Sa\'di). Read slide-by-slide contemplations and convert them into videos and posters.',
  openGraph: {
    title: 'Quran Stories & Reflections — Thematic Contemplation & Media',
    description:
      'Immerse in authentic Quranic narratives with slide-by-slide contemplation and one-click media remixing.',
    type: 'website',
  },
};

export default async function StoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
      <StoriesListClient stories={QURAN_STORIES} locale={locale} />
    </div>
  );
}
