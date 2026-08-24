import { redirect, notFound } from 'next/navigation';
import { type Locale } from '@quran-media/i18n';
import { QURAN_STORIES } from '@/lib/stories-catalog';

export default async function LegacyStoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const story = QURAN_STORIES.find((s) => s.id === id || s.slug === id);

  if (!story) {
    notFound();
  }

  redirect(`/${locale}/stories/${story.slug}`);
}
