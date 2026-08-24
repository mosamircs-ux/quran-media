import arMessages from '../messages/ar.json' with { type: 'json' };
import enMessages from '../messages/en.json' with { type: 'json' };
import type { Locale } from './config.js';

export * from './config.js';

export type TranslationDictionary = typeof arMessages;

export const messages: Record<Locale, TranslationDictionary> = {
  ar: arMessages,
  en: enMessages as TranslationDictionary,
};

export function getDictionary(locale: Locale): TranslationDictionary {
  return messages[locale] ?? messages.ar;
}

export function useTranslation(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    t: dict,
    locale,
    isAr: locale === 'ar',
    dir: (locale === 'ar' ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
  };
}
