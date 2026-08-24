export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ar';

export interface LocaleMeta {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  fontFamily: string;
  flag: string;
  numerals: 'arabic' | 'latin';
}

export const LOCALES_META: Record<Locale, LocaleMeta> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    fontFamily: 'var(--font-arabic)',
    flag: '🇸🇦',
    numerals: 'arabic',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    fontFamily: 'var(--font-sans)',
    flag: '🇬🇧',
    numerals: 'latin',
  },
};

export function isRTL(locale: Locale): boolean {
  return (LOCALES_META[locale]?.dir || 'rtl') === 'rtl';
}

export function getLocaleDirection(locale: Locale): 'rtl' | 'ltr' {
  return LOCALES_META[locale]?.dir || (locale === 'ar' ? 'rtl' : 'ltr');
}

/**
 * Converts Western digits (0-9) to Eastern Arabic-Indic numerals (٠-٩)
 */
export function toArabicNumerals(input: number | string): string {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(input).replace(/[0-9]/g, (w) => arabicDigits[+w] || w);
}

/**
 * Formats a number according to the active locale
 */
export function formatNumber(
  value: number,
  locale: Locale,
  options?: { useEasternArabicNumerals?: boolean; compact?: boolean }
): string {
  if (locale === 'ar' && options?.useEasternArabicNumerals) {
    return toArabicNumerals(value);
  }

  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    notation: options?.compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  });

  return formatter.format(value);
}

/**
 * Formats a timestamp duration in MM:SS or HH:MM:SS
 */
export function formatDuration(totalSeconds: number, locale: Locale = 'ar'): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  let formatted = '';
  if (hours > 0) {
    formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  if (locale === 'ar') {
    return toArabicNumerals(formatted);
  }

  return formatted;
}

/**
 * Formats an ISO date string or Date object localized
 */
export function formatDate(date: string | Date, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}
