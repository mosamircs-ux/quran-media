import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { MEDIA_SHOWCASE_ITEMS } from '@/lib/media-catalog';
import { MediaGalleryClient } from '@/components/media-gallery/media-gallery-client';

export const metadata: Metadata = {
  title: 'Quran Video Showcase — 4K Clips & Social Reels (9:16, 16:9, 1:1)',
  description:
    'Browse and download public high-resolution Quran videos formatted for TikTok, Instagram Reels, and YouTube with verified subtitles and crystal-clear recitations.',
  openGraph: {
    title: 'Quran Video Showcase — 4K Clips & Social Reels',
    description:
      'Explore 4K Quran videos formatted for social platforms with verified subtitles and reciter audio.',
    type: 'website',
  },
};

export default async function VideosPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
      <MediaGalleryClient mediaItems={MEDIA_SHOWCASE_ITEMS} locale={locale} />
    </div>
  );
}
