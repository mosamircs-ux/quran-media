import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { QuranStoryGeneratorClient } from '@/components/stories/quran-story-generator-client';

interface StoryPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ surah?: string; ayah?: string; mode?: string }>;
}

import { generateLocalizedMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { locale } = await params;
  return generateLocalizedMetadata({
    locale,
    path: '/create/story',
    pageKey: 'generator',
  });
}

export default async function CreateStoryPage({ params, searchParams }: StoryPageProps) {
  const { locale } = await params;
  const { surah, ayah } = await searchParams;

  const initialSurahId = surah ? Number(surah) : 2;
  const initialAyah = ayah ? Number(ayah) : 255;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: locale === 'ar' ? 'مولد القصص والمشاهد القرآنية' : 'AI Quran Story Generator',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-10">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <QuranStoryGeneratorClient
        locale={locale}
        initialSurahId={initialSurahId}
        initialAyah={initialAyah}
      />
    </div>
  );
}
