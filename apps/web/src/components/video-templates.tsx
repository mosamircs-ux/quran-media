'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Locale } from '@quran-media/i18n';
import { Film, Layout, Sparkles, Smartphone, Monitor, Square, Check } from 'lucide-react';

interface VideoTemplatesProps {
  locale: Locale;
}

interface TemplatePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  descAr: string;
  descEn: string;
  aspectRatios: Array<'9:16' | '16:9' | '1:1' | '4:5'>;
  gradient: string;
  accentColor: string;
  calligraphyStyle: string;
}

const TEMPLATES: TemplatePreset[] = [
  {
    id: 'tpl-nature',
    nameAr: 'فجر الطبيعة والسكينة',
    nameEn: 'Cinematic Mountain Dawn',
    categoryAr: 'مناظر طبيعية',
    categoryEn: 'Cinematic Nature',
    descAr: 'جبال شاهقة مع ضباب الصباح وأشعة شمس ذهبية دافئة تعكس جلال الخلق وعظمته.',
    descEn: 'Majestic mountain ranges shrouded in morning mist with warm radiant sunbeams.',
    aspectRatios: ['9:16', '16:9', '1:1', '4:5'],
    gradient: 'from-amber-900/60 via-slate-900 to-slate-950',
    accentColor: 'text-amber-400',
    calligraphyStyle: 'Amiri Gold Shadow',
  },
  {
    id: 'tpl-geometry',
    nameAr: 'الزخرفة الإسلامية والمحراب',
    nameEn: 'Sacred Arabesque Geometry',
    categoryAr: 'فن إسلامي',
    categoryEn: 'Islamic Geometry',
    descAr: 'نقوش هندسية إسلامية مذهبة مع إضاءة المحاريب وألوان الزمرد والذهب المعتق.',
    descEn: 'Illuminated golden arabesque mosaics and emerald mosque arch ambient lights.',
    aspectRatios: ['9:16', '16:9', '1:1', '4:5'],
    gradient: 'from-emerald-950/80 via-slate-900 to-slate-950',
    accentColor: 'text-emerald-400',
    calligraphyStyle: 'Noto Naskh Glow',
  },
  {
    id: 'tpl-cosmos',
    nameAr: 'الكون الفسيح والمجرات',
    nameEn: 'Celestial Cosmic Horizon',
    categoryAr: 'آيات كونية',
    categoryEn: 'Cosmic Wonders',
    descAr: 'سدم كونية ونجوم لامعة تعبر عن عظمة الخالق في تسيير الأفلاك والنجوم.',
    descEn: 'Expansive glowing nebulae and celestial star constellations in deep night sky.',
    aspectRatios: ['9:16', '16:9', '1:1'],
    gradient: 'from-cyan-950/80 via-slate-900 to-blue-950',
    accentColor: 'text-cyan-400',
    calligraphyStyle: 'Clean Minimal White',
  },
  {
    id: 'tpl-desert',
    nameAr: 'رمال الصحراء وسكينة الغروب',
    nameEn: 'Tranquil Desert Dunes',
    categoryAr: 'تأمل هادئ',
    categoryEn: 'Serene Contemplation',
    descAr: 'كثبان رملية متموجة مع أفق الغروب الساحر وألوان الباستيل الدافئة.',
    descEn: 'Silky golden sand dunes at tranquil sunset with soft ambient twilight hues.',
    aspectRatios: ['9:16', '1:1', '4:5'],
    gradient: 'from-yellow-950/60 via-slate-900 to-slate-950',
    accentColor: 'text-yellow-400',
    calligraphyStyle: 'Thuluth Classic',
  },
];

export function VideoTemplates({ locale }: VideoTemplatesProps) {
  const isAr = locale === 'ar';
  const [activeRatio, setActiveRatio] = useState<'9:16' | '16:9' | '1:1' | '4:5'>('9:16');

  return (
    <section className="py-20 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <Layout className="w-3.5 h-3.5" />
              <span>{isAr ? 'قوالب وأنماط الإنتاج' : 'Video Aesthetic Templates'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {isAr ? 'أنماط بصرية وتنسيقات متعددة' : 'Ready-to-Use Video Presets'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl">
              {isAr
                ? 'اختر النمط البصري ونوع الخط والنسب المناسبة لمنصتك المفضلة (تيك توك، ريلز، يوتيوب).'
                : 'Select tailored visual moods and typography styles pre-calibrated for every social platform.'}
            </p>
          </div>

          {/* Aspect Ratio Filter Switch */}
          <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-900/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-800">
            {[
              { id: '9:16', label: '9:16 (Shorts)', icon: Smartphone },
              { id: '16:9', label: '16:9 (YouTube)', icon: Monitor },
              { id: '1:1', label: '1:1 (Post)', icon: Square },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveRatio(item.id as '9:16' | '16:9' | '1:1' | '4:5')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRatio === item.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-amber-500/50 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              {/* Template Graphic Box */}
              <div
                className={`relative overflow-hidden bg-gradient-to-br ${tpl.gradient} p-5 flex flex-col justify-between text-white ${
                  activeRatio === '9:16' ? 'h-64' : activeRatio === '16:9' ? 'h-44' : 'h-52'
                }`}
              >
                <div className="flex items-center justify-between z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[10px] font-bold text-amber-300">
                    {isAr ? tpl.categoryAr : tpl.categoryEn}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{activeRatio}</span>
                </div>

                <div className="text-center my-auto z-10">
                  <p dir="rtl" className="font-quran text-xl text-amber-100 drop-shadow">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                  <p className="text-[10px] text-slate-300 font-mono mt-1">{tpl.calligraphyStyle}</p>
                </div>
              </div>

              {/* Template Body */}
              <div className="p-5 space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAr ? tpl.nameAr : tpl.nameEn}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {isAr ? tpl.descAr : tpl.descEn}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {isAr ? 'جاهز للاستخدام' : 'Pre-calibrated'}
                  </span>
                  <Link
                    href={`/${locale}#create`}
                    className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500"
                  >
                    <span>{isAr ? 'اختيار النمط' : 'Apply'}</span>
                    <Sparkles className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
