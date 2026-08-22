export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'ar';

export interface LocaleMeta {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  fontFamily: string;
}

export const LOCALES_META: Record<Locale, LocaleMeta> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    fontFamily: 'var(--font-arabic)',
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    fontFamily: 'var(--font-sans)',
  },
};

export function isRTL(locale: Locale): boolean {
  return LOCALES_META[locale].dir === 'rtl';
}
