import arMessages from '../messages/ar.json' with { type: 'json' };
import enMessages from '../messages/en.json' with { type: 'json' };
import type { Locale } from './config.js';

export * from './config.js';

export const messages: Record<Locale, typeof arMessages> = {
  ar: arMessages,
  en: enMessages as typeof arMessages,
};

export function getDictionary(locale: Locale) {
  return messages[locale] ?? messages.ar;
}
