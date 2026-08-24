import type { Metadata } from 'next';
import type { Locale } from '@quran-media/i18n';
import { getDictionary, LOCALES } from '@quran-media/i18n';

export interface LocalizedMetadataOptions {
  locale: Locale;
  path?: string; // e.g. "/stories" or "/stories/yusuf-from-well-to-elevation"
  title?: string;
  description?: string;
  pageKey?: 'stories' | 'studio' | 'generator' | 'home';
  ogImage?: string;
  ogVideo?: string;
  keywords?: string[];
}

export function generateLocalizedMetadata({
  locale,
  path = '',
  title,
  description,
  pageKey = 'home',
  ogImage,
  ogVideo,
  keywords = [],
}: LocalizedMetadataOptions): Metadata {
  const dict = getDictionary(locale);
  const isAr = locale === 'ar';

  const defaultTitle =
    pageKey === 'stories'
      ? dict.seo.storiesTitle
      : pageKey === 'studio'
      ? dict.seo.studioTitle
      : pageKey === 'generator'
      ? dict.seo.generatorTitle
      : dict.seo.defaultTitle;

  const defaultDescription =
    pageKey === 'stories'
      ? dict.seo.storiesDescription
      : pageKey === 'studio'
      ? dict.seo.studioDescription
      : pageKey === 'generator'
      ? dict.seo.generatorDescription
      : dict.seo.defaultDescription;

  const resolvedTitle = title ? `${title} | ${dict.app.title}` : defaultTitle;
  const resolvedDescription = description || defaultDescription;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `/${locale}${cleanPath}`;

  const alternateLanguages: Record<string, string> = {
    ar: `/ar${cleanPath}`,
    en: `/en${cleanPath}`,
    'x-default': `/ar${cleanPath}`,
  };

  const defaultOgImage =
    ogImage || 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&h=630&auto=format&fit=crop&q=80';

  const defaultKeywords = isAr
    ? [
        'ميديا القرآن',
        'قصص القرآن',
        'تلاوة مرئية',
        'الرسم العثماني',
        'استوديو القرآن',
        'تفسير القرآن',
        'إنتاج فيديو إسلامي',
        ...keywords,
      ]
    : [
        'Quran Media',
        'Quran Stories',
        'Visual Quran Recitation',
        'Uthmani Calligraphy',
        'Quran Studio',
        'Classical Tafsir',
        'Islamic Video Production',
        ...keywords,
      ];

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: defaultKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonicalUrl,
      siteName: dict.seo.siteName,
      locale: isAr ? 'ar_AR' : 'en_US',
      alternateLocale: isAr ? ['en_US'] : ['ar_AR'],
      type: ogVideo ? 'video.other' : 'website',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
      ...(ogVideo
        ? {
            videos: [
              {
                url: ogVideo,
                width: 1920,
                height: 1080,
                type: 'video/mp4',
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [defaultOgImage],
    },
  };
}
