'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@quran-media/i18n';
import { LOCALES, LOCALES_META } from '@quran-media/i18n';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  variant?: 'pill' | 'dropdown' | 'compact';
  className?: string;
}

export function LanguageSwitcher({
  currentLocale,
  variant = 'dropdown',
  className = '',
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAr = currentLocale === 'ar';

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Persist in cookie (1 year expiration)
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Persist in localStorage
    try {
      localStorage.setItem('NEXT_LOCALE', newLocale);
    } catch {}

    // Replace current locale segment in pathname
    const segments = pathname.split('/');
    if (LOCALES.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const targetUrl = segments.join('/') || `/${newLocale}`;

    setIsOpen(false);
    router.push(targetUrl);
  };

  if (variant === 'compact') {
    const otherLocale: Locale = currentLocale === 'ar' ? 'en' : 'ar';
    return (
      <button
        onClick={() => handleSelectLocale(otherLocale)}
        aria-label={isAr ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}
        className={`px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-all cursor-pointer ${className}`}
      >
        {isAr ? 'EN' : 'عربي'}
      </button>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl ${className}`}>
        {LOCALES.map((loc) => {
          const meta = LOCALES_META[loc];
          const isSelected = currentLocale === loc;
          return (
            <button
              key={loc}
              onClick={() => handleSelectLocale(loc)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{meta.flag}</span>
              <span>{meta.nativeName}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Dropdown Menu
  const currentMeta = LOCALES_META[currentLocale];

  return (
    <div className={`relative inline-block text-start ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
      >
        <Globe className="w-3.5 h-3.5 text-amber-500" />
        <span className="hidden sm:inline">{currentMeta.flag}</span>
        <span>{currentMeta.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 rtl:left-auto rtl:right-0 z-50 min-w-[170px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {isAr ? 'اختر لغة الواجهة' : 'Select Language'}
          </div>
          {LOCALES.map((loc) => {
            const meta = LOCALES_META[loc];
            const isSelected = currentLocale === loc;
            return (
              <button
                key={loc}
                onClick={() => handleSelectLocale(loc)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">{meta.flag}</span>
                  <div className="text-start">
                    <div className="leading-tight">{meta.nativeName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{meta.name}</div>
                  </div>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
