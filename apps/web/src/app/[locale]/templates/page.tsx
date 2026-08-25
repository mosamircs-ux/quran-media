import React from 'react';
import type { Metadata } from 'next';
import { type Locale } from '@quran-media/i18n';
import { generateLocalizedMetadata, generateBreadcrumbsJsonLd } from '@/lib/seo';
import { TemplateCard } from '@/components/templates/template-card';
import { QURAN_MEDIA_TEMPLATES } from '@quran-media/media/templates';
import { Sparkles, Layers } from 'lucide-react';

export const revalidate = 86400; // 24 hours ISR

interface TemplatesPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: TemplatesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  return generateLocalizedMetadata({
    locale,
    path: '/templates',
    title: isAr ? 'قوالب ونماذج إنتاج فيديو القرآن (١٨ قالباً سينمائياً)' : '18 Quran Video Templates — Reels, TikTok & 4K Landscape',
    description: isAr
      ? 'استعرض جميع قوالب الهوية البصرية لإنتاج فيديوهات القرآن: المصحف البسيط، الطبيعة السينمائية، الزخارف الإسلامية، تيك توك، وإنستغرام ريلز'
      : 'Explore 18 production-ready visual templates for Quran videos: Minimalist, Cinematic Nature, Islamic Geometry, Calligraphy, Reels & YouTube Shorts',
    keywords: ['Quran Video Templates', 'Islamic Templates', 'قوالب فيديو القرآن', 'نماذج ريلز إسلامية'],
  });
}

export default async function TemplatesPage({ params }: TemplatesPageProps) {
  const { locale } = await params;
  const isAr = locale === 'ar';

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-10 space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? '١٨ قالباً مصمماً باحترافية' : '18 Certified Presets'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isAr ? 'قوالب الهوية البصرية لإنتاج ميديا القرآن' : 'Quran Visual Production Templates'}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {isAr
            ? 'اختر القالب المناسب لمنصتك: ريلز 9:16، يوتيوب 16:9، أو منشورات مربعة 1:1 مع تناسق كامل للألوان والخطوط'
            : 'Pre-configured typography, animations, motion dynamics and color palettes optimized for every social platform'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QURAN_MEDIA_TEMPLATES.map((template) => (
          <div key={template.template_id} id={template.template_id}>
            <TemplateCard template={template} locale={locale} />
          </div>
        ))}
      </div>
    </div>
  );
}
