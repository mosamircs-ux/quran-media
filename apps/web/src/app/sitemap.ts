import { MetadataRoute } from 'next';
import { SITE_BASE_URL, FAMOUS_AYAHS } from '@/lib/seo';
import { QURAN_STORIES } from '@/lib/stories-catalog';
import { QURAN_MEDIA_TEMPLATES } from '@quran-media/media/templates';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const locales = ['ar', 'en'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Core Static Pages
  const staticRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/stories', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/studio', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/surahs', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/ayahs', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/templates', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/videos', priority: 0.8, changeFrequency: 'daily' as const },
  ];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      sitemapEntries.push({
        url: `${SITE_BASE_URL}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  // 2. All 114 Surahs
  for (let surahNum = 1; surahNum <= 114; surahNum++) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${SITE_BASE_URL}/${locale}/surah/${surahNum}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: surahNum <= 20 || surahNum >= 90 ? 0.85 : 0.7,
      });
    }
  }

  // 3. Famous & Canonical Ayahs
  const famousKeys = Object.keys(FAMOUS_AYAHS);
  for (const key of famousKeys) {
    const [s, a] = key.split(':');
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${SITE_BASE_URL}/${locale}/ayah/${s}/${a}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: key === '2:255' ? 0.95 : 0.85,
      });
    }
  }

  // 4. All Quran Stories
  for (const story of QURAN_STORIES) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${SITE_BASE_URL}/${locale}/stories/${story.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.85,
      });
    }
  }

  // 5. All 18 Templates
  for (const tpl of QURAN_MEDIA_TEMPLATES) {
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${SITE_BASE_URL}/${locale}/templates#${tpl.template_id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.75,
      });
    }
  }

  return sitemapEntries;
}
