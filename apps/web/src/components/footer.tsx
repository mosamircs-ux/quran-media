'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';
import type { Locale } from '@quran-media/i18n';
import { Globe, Sun, Moon, Sparkles, Heart, BookOpen, ExternalLink } from 'lucide-react';

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  const isAr = locale === 'ar';
  const { isDark, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-16 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand & Ethos (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-amber-500 text-white font-bold shadow-md">
                📖
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {isAr ? 'منصة ميديا القرآن' : 'Quran Media Studio'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
              {isAr
                ? 'منصة متقدمة مخصصة لإنتاج وسائط وبصريات القرآن الكريم بجودة سينمائية فائقة، مستندة إلى بيانات مؤسسة القرآن ومحركات الذكاء الاصطناعي المسؤولة.'
                : 'A specialized platform dedicated to creating high-fidelity visual Quranic stories, synchronized recitations, and bilingual social media video assets.'}
            </p>

            <div className="pt-2 flex items-center gap-3">
              {/* Language Switch */}
              <button
                onClick={() => switchLocale(isAr ? 'en' : 'ar')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAr ? 'English' : 'العربية'}</span>
              </button>

              {/* Theme Switch */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {isAr ? 'الاستكشاف والتصفح' : 'Exploration'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}#explore`} className="hover:text-emerald-500 transition-colors">
                  {isAr ? 'المقاطع المميزة' : 'Featured Media'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/ayahs`} className="hover:text-emerald-500 transition-colors">
                  {isAr ? 'مستكشف الآيات' : 'Ayah Explorer'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/surahs`} className="hover:text-emerald-500 transition-colors">
                  {isAr ? 'فهرس السور (114 سورة)' : 'Surahs Directory (114)'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/stories`} className="hover:text-emerald-500 transition-colors">
                  {isAr ? 'قصص وتأملات قرآنية' : 'Quran Stories & Reflections'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Media Creation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {isAr ? 'أدوات الاستوديو' : 'Studio Tools'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/create`} className="hover:text-amber-500 transition-colors">
                  {isAr ? 'استوديو الإنتاج المرئي' : 'Quran Media Studio'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/create`} className="hover:text-amber-500 transition-colors">
                  {isAr ? 'قوالب 9:16 ريلز وتيك توك' : '9:16 Reels & Shorts'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/create`} className="hover:text-amber-500 transition-colors">
                  {isAr ? 'قوالب 16:9 يوتيوب سينمائي' : '16:9 Cinematic YouTube'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/create`} className="hover:text-amber-500 transition-colors">
                  {isAr ? 'كاريوكي ترجمة متزامن' : 'Bilingual Subtitle Engine'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {isAr ? 'المصادر والاعتماد' : 'Verification & API'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://quran.foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                >
                  <span>Quran Foundation API</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://quran.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-500 transition-colors"
                >
                  <span>Quran.com Content v4</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-slate-400">
                  {isAr ? 'المصحف العثماني المعتمد' : 'Verified Uthmani Text'}
                </span>
              </li>
              <li>
                <span className="text-slate-400">
                  {isAr ? 'تفسير ابن كثير والسعدي' : 'Tafsir Ibn Kathir & As-Sa\'di'}
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {isAr
              ? '© 2026 منصة ميديا القرآن. جميع الحقوق محفوظة لخدمة كتاب الله.'
              : '© 2026 Quran Media Studio. Built with devotion to serve the Holy Quran.'}
          </p>
          <div className="flex items-center gap-1">
            <span>{isAr ? 'مدعوم رسمياً ببيانات' : 'Powered by official'}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Quran Foundation Content API</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
