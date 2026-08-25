import type { Metadata } from 'next';
import type { Locale } from '@quran-media/i18n';
import { getDictionary, formatNumber } from '@quran-media/i18n';

export const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://quranmedia.studio';

export interface LocalizedMetadataOptions {
  locale: Locale;
  path?: string; // e.g. "/stories" or "/ayah/2/255"
  title?: string;
  description?: string;
  pageKey?: 'stories' | 'studio' | 'generator' | 'home' | 'ayah' | 'surah' | 'videos' | 'templates';
  ogImage?: string;
  ogVideo?: string;
  ogType?: 'website' | 'article' | 'video.other';
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function generateLocalizedMetadata({
  locale,
  path = '',
  title,
  description,
  pageKey = 'home',
  ogImage,
  ogVideo,
  ogType = 'website',
  keywords = [],
  publishedTime,
  modifiedTime,
  authors,
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
  const canonicalUrl = `${SITE_BASE_URL}/${locale}${cleanPath === '/' ? '' : cleanPath}`;

  const alternateLanguages: Record<string, string> = {
    ar: `${SITE_BASE_URL}/ar${cleanPath === '/' ? '' : cleanPath}`,
    en: `${SITE_BASE_URL}/en${cleanPath === '/' ? '' : cleanPath}`,
    'x-default': `${SITE_BASE_URL}/ar${cleanPath === '/' ? '' : cleanPath}`,
  };

  const defaultOgImage =
    ogImage ||
    `${SITE_BASE_URL}/images/og-default.jpg` ||
    'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&h=630&auto=format&fit=crop&q=80';

  const defaultKeywords = isAr
    ? [
        'ميديا القرآن',
        'قصص القرآن',
        'تلاوة مرئية',
        'الرسم العثماني',
        'استوديو القرآن',
        'تفسير القرآن',
        'إنتاج فيديو إسلامي',
        'تلاوة خاشعة',
        'آيات قرآنية',
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
        'Quran Verses',
        ...keywords,
      ];

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords: defaultKeywords,
    metadataBase: new URL(SITE_BASE_URL),
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
      type: ogVideo ? 'video.other' : ogType,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
          type: 'image/jpeg',
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
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@QuranMediaStore',
      creator: '@QuranMediaStore',
      title: resolvedTitle,
      description: resolvedDescription,
      images: [defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Famous special Ayah naming map for rich organic search intent
 */
export const FAMOUS_AYAHS: Record<string, { titleEn: string; titleAr: string }> = {
  '2:255': { titleEn: 'Ayat al-Kursi (The Throne Verse)', titleAr: 'آية الكرسي' },
  '2:285': { titleEn: 'Amanar-Rasul (The Messenger Believed)', titleAr: 'خواتيم سورة البقرة (آمن الرسول)' },
  '2:286': { titleEn: 'La Yukallifullahu Nafsan (Allah Does Not Burden a Soul)', titleAr: 'لا يكلف الله نفسا إلا وسعها' },
  '9:128': { titleEn: 'Laqad Ja\'akum Rasul (A Messenger Has Come)', titleAr: 'لقد جاءكم رسول من أنفسكم' },
  '24:35': { titleEn: 'Ayat an-Nur (The Verse of Light)', titleAr: 'آية النور (الله نور السماوات والأرض)' },
  '36:58': { titleEn: 'Salamun Qawlan Min Rabbin Rahim (Peace from a Merciful Lord)', titleAr: 'سلام قولا من رب رحيم' },
  '59:22': { titleEn: 'Huwallahul-Ladhee (He is Allah, Other than Whom There is No Deity)', titleAr: 'هو الله الذي لا إله إلا هو' },
  '93:5': { titleEn: 'Wa La Sawfa Yu\'teeka Rabbuka (Your Lord Will Give You)', titleAr: 'ولسوف يعطيك ربك فترضى' },
  '94:5': { titleEn: 'Fa Inna Ma\'al Usri Yusra (With Hardship Comes Ease)', titleAr: 'فإن مع العسر يسرا' },
  '97:1': { titleEn: 'Inna Anzalnahu Fee Laylatil-Qadr (We Sent It Down on the Night of Decree)', titleAr: 'إنا أنزلناه في ليلة القدر' },
  '112:1': { titleEn: 'Qul Huwallahu Ahad (Say, He is Allah, [Who is] One)', titleAr: 'قل هو الله أحد' },
};

/**
 * Specialized Dynamic SEO Generator for any Quranic Ayah (/ayah/[surah]/[ayah])
 */
export function generateAyahMetadata({
  surahNumber,
  ayahNumber,
  surahNameAr,
  surahNameEn,
  textUthmani,
  translationEn,
  locale,
}: {
  surahNumber: number;
  ayahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  textUthmani: string;
  translationEn: string;
  locale: Locale;
}): Metadata {
  const isAr = locale === 'ar';
  const verseKey = `${surahNumber}:${ayahNumber}`;
  const famous = FAMOUS_AYAHS[verseKey];

  const titleEn = famous
    ? `${famous.titleEn} — Quran ${verseKey}`
    : `Surah ${surahNameEn} Ayah ${ayahNumber} (Quran ${verseKey})`;

  const titleAr = famous
    ? `${famous.titleAr} — سورة ${surahNameAr} (${verseKey})`
    : `سورة ${surahNameAr} الآية ${ayahNumber} (${verseKey})`;

  const title = isAr ? titleAr : titleEn;

  const descriptionAr = `تلاوة مرئية وتفسير الآية ${ayahNumber} من سورة ${surahNameAr}: «${textUthmani.substring(0, 120)}...». ترجمة بالإنجليزية وتدبر معانيها.`;
  const descriptionEn = `Read, listen and watch visual recitation of Quran ${verseKey} (Surah ${surahNameEn} : ${ayahNumber}). Arabic Uthmani text: "${textUthmani.substring(0, 80)}..." | Translation: "${translationEn.substring(0, 140)}..."`;

  const description = isAr ? descriptionAr : descriptionEn;

  return generateLocalizedMetadata({
    locale,
    path: `/ayah/${surahNumber}/${ayahNumber}`,
    title,
    description,
    pageKey: 'ayah',
    keywords: [
      `Quran ${verseKey}`,
      `Surah ${surahNameEn}`,
      `سورة ${surahNameAr}`,
      `آية ${ayahNumber}`,
      `Ayah ${ayahNumber}`,
      famous ? famous.titleEn : '',
      famous ? famous.titleAr : '',
      'Uthmani Quran',
      'Quran recitation video',
      'Tafsir',
    ].filter(Boolean),
  });
}

// ==========================================
// STRUCTURED DATA (JSON-LD SCHEMA.ORG)
// ==========================================

export function generateWebsiteJsonLd(locale: Locale) {
  const isAr = locale === 'ar';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: isAr ? 'ميديا القرآن — استوديو الإنتاج المرئي' : 'Quran Media Studio',
    url: `${SITE_BASE_URL}/${locale}`,
    description: isAr
      ? 'منصة الذكاء الاصطناعي الأولى لإنتاج القصص والفيديوهات القرآنية بالرسم العثماني'
      : 'The leading AI platform for producing cinematic Quranic stories & visual recitations in Uthmani calligraphy',
    inLanguage: isAr ? 'ar' : 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_BASE_URL}/${locale}/stories?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationJsonLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Quran Media Studio',
    url: SITE_BASE_URL,
    logo: `${SITE_BASE_URL}/logo.png`,
    sameAs: [
      'https://twitter.com/QuranMediaStore',
      'https://youtube.com/@QuranMediaStore',
      'https://instagram.com/QuranMediaStore',
      'https://github.com/mosamircs-ux/quran-media',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@quranmedia.studio',
      contactType: 'Customer Support',
    },
  };
}

export function generateAyahJsonLd({
  surahNumber,
  ayahNumber,
  surahNameAr,
  surahNameEn,
  textUthmani,
  translationEn,
  audioUrl,
  locale,
}: {
  surahNumber: number;
  ayahNumber: number;
  surahNameAr: string;
  surahNameEn: string;
  textUthmani: string;
  translationEn: string;
  audioUrl?: string;
  locale: Locale;
}) {
  const verseKey = `${surahNumber}:${ayahNumber}`;
  const isAr = locale === 'ar';

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: isAr
      ? `سورة ${surahNameAr} الآية ${ayahNumber} (القرآن ${verseKey})`
      : `Surah ${surahNameEn} Verse ${ayahNumber} (Quran ${verseKey})`,
    name: `Quran ${verseKey}`,
    isPartOf: {
      '@type': 'Book',
      name: 'The Holy Quran (القرآن الكريم)',
      author: 'Words of Allah Almighty (كلام الله عز وجل)',
    },
    inLanguage: ['ar', 'en'],
    text: textUthmani,
    description: isAr ? textUthmani : translationEn,
    url: `${SITE_BASE_URL}/${locale}/ayah/${surahNumber}/${ayahNumber}`,
    ...(audioUrl
      ? {
          audio: {
            '@type': 'AudioObject',
            contentUrl: audioUrl,
            encodingFormat: 'audio/mp3',
          },
        }
      : {}),
  };
}

export function generateStoryJsonLd({
  title,
  description,
  slug,
  thumbnailUrl,
  videoUrl,
  publishedDate,
  locale,
}: {
  title: string;
  description: string;
  slug: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  publishedDate?: string;
  locale: Locale;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: thumbnailUrl || `${SITE_BASE_URL}/images/og-default.jpg`,
    url: `${SITE_BASE_URL}/${locale}/stories/${slug}`,
    datePublished: publishedDate || '2026-01-01T00:00:00Z',
    publisher: {
      '@type': 'Organization',
      name: 'Quran Media Studio',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_BASE_URL}/logo.png`,
      },
    },
    ...(videoUrl
      ? {
          video: {
            '@type': 'VideoObject',
            name: title,
            description,
            thumbnailUrl: thumbnailUrl || `${SITE_BASE_URL}/images/og-default.jpg`,
            contentUrl: videoUrl,
            uploadDate: publishedDate || '2026-01-01T00:00:00Z',
          },
        }
      : {}),
  };
}

export function generateBreadcrumbsJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_BASE_URL}${item.url}`,
    })),
  };
}
