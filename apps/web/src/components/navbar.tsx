'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './theme-provider';
import type { Locale } from '@quran-media/i18n';
import {
  Sun,
  Moon,
  Globe,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Film,
  Compass,
  Bookmark,
  Layers,
  Info,
} from 'lucide-react';

interface NavbarProps {
  locale: Locale;
}

export function Navbar({ locale }: NavbarProps) {
  const { isDark, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAr = locale === 'ar';

  const navLinks = [
    { href: `/${locale}`, label: isAr ? 'الرئيسية' : 'Home', icon: Compass },
    { href: `/${locale}/create/story`, label: isAr ? 'صانع القصص' : 'AI Story Studio', icon: Feather },
    { href: `/${locale}/create`, label: isAr ? 'استوديو الفيديو' : 'Video Studio', icon: Sparkles },
    { href: `/${locale}/stories`, label: isAr ? 'المكتبة' : 'Stories', icon: Layers },
    { href: `/${locale}/ayahs`, label: isAr ? 'الآيات' : 'Ayahs', icon: Bookmark },
    { href: `/${locale}/surahs`, label: isAr ? 'السور' : 'Surahs', icon: BookOpen },
    { href: `/${locale}/videos`, label: isAr ? 'المقاطع' : 'Videos', icon: Film },
    { href: `/${locale}/dashboard`, label: isAr ? 'لوحة التحكم' : 'Dashboard', icon: Compass },
  ];

  const switchLocale = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/') || `/${newLocale}`;
    router.push(newPath);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-slate-950/5 dark:shadow-slate-950/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-8 max-w-7xl">
        {/* Brand Logo */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl p-1"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-500 text-white font-bold shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform duration-300">
            <span className="text-xl">📖</span>
            <div className="absolute inset-0 rounded-2xl border border-amber-300/30 pointer-events-none" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              {isAr ? 'ميديا القرآن' : 'Quran Media'}
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Studio
              </span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {isAr ? 'منصة القصص المرئية والتلاوات' : 'Visual Stories & Recitations'}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/70 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions & Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={() => switchLocale(isAr ? 'en' : 'ar')}
            aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Create CTA Button */}
          <Link
            href={`/${locale}/create`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'استوديو الإنتاج' : 'Create Media'}</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => switchLocale(isAr ? 'en' : 'ar')}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            {isAr ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 text-xs font-semibold rounded-xl bg-slate-100/70 dark:bg-slate-900/70 text-slate-800 dark:text-slate-200 hover:bg-emerald-500/10 hover:text-emerald-500"
                >
                  <Icon className="w-4 h-4 text-amber-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              href={`/${locale}#create`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'ابدأ صناعة المحتوى الآن' : 'Create Media Now'}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
