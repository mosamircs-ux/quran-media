'use client';

import React from 'react';
import type { Locale } from '@quran-media/i18n';
import { BookOpen, Sparkles, Download, CheckCircle2 } from 'lucide-react';

interface HowItWorksProps {
  locale: Locale;
}

export function HowItWorks({ locale }: HowItWorksProps) {
  const isAr = locale === 'ar';

  const steps = [
    {
      step: '01',
      icon: BookOpen,
      titleAr: 'اختر السورة والآيات والقارئ',
      titleEn: 'Select Ayah, Surah & Reciter',
      descAr: 'تصفح القرآن الكريم كاملاً (114 سورة و 6,236 آية) واختر قارئك المفضل من بين كبار القراء بتسجيلات نقية عالية الدقة.',
      descEn: 'Pick any canonical Surah and verse range, choosing from world-renowned reciters with crystal-clear audio fidelity.',
    },
    {
      step: '02',
      icon: Sparkles,
      titleAr: 'حدد النمط البصري والترجمة',
      titleEn: 'Customize Visuals & Subtitles',
      descAr: 'اختر الأجواء السينمائية الطبيعية أو الزخرفة الإسلامية، وضبط خطوط الكاريوكي المتزامنة كلمة بكلمة مع التلاوة.',
      descEn: 'Select reverent atmospheric aesthetics and configure bilingual word-by-word karaoke typography synchronized with recitation.',
    },
    {
      step: '03',
      icon: Download,
      titleAr: 'توليد وتصدير الفيديو بنقرة واحدة',
      titleEn: 'Synthesize & Export in High-Res',
      descAr: 'يقوم محرك FFmpeg والذكاء الاصطناعي بمعالجة الفيديو بالأبعاد المطلوبة (9:16 أو 16:9 أو 1:1) جاهزاً للنشر المباشر.',
      descEn: 'Our background worker cluster processes and renders MP4 video in any aspect ratio, ready for immediate social distribution.',
    },
  ];

  return (
    <section id="about" className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'خطوات سهلة وسريعة' : 'Simple 3-Step Workflow'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? 'كيف تصنع فيديو قرآني احترافي؟' : 'How Quran Media Studio Works'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isAr
              ? 'ثلاث خطوات بسيطة فقط تفصلك عن إنتاج محتوى قرآني مرئي مذهل بأعلى المعايير.'
              : 'Turn divine inspiration into cinematic visual narratives in less than a minute.'}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-xl shadow-slate-950/5 dark:shadow-slate-950/30 space-y-6"
              >
                <div className="space-y-4">
                  {/* Step number & icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black text-amber-500/30 dark:text-amber-400/20 font-mono">
                      {item.step}
                    </span>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/20">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {isAr ? item.descAr : item.descEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isAr ? `المرحلة ${index + 1} مكتملة تلقائياً` : `Stage ${index + 1} Automated`}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
