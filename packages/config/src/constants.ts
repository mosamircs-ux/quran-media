export const ASPECT_RATIOS = {
  '9:16': {
    width: 1080,
    height: 1920,
    label: 'Portrait / Reels & Shorts',
    cssAspect: '9/16',
    defaultFontSize: 34,
    safeZone: { top: 0.15, bottom: 0.2, left: 0.08, right: 0.08 },
  },
  '16:9': {
    width: 1920,
    height: 1080,
    label: 'Landscape / YouTube',
    cssAspect: '16/9',
    defaultFontSize: 38,
    safeZone: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
  },
  '1:1': {
    width: 1080,
    height: 1080,
    label: 'Square / Feed Post',
    cssAspect: '1/1',
    defaultFontSize: 32,
    safeZone: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
  },
  '4:5': {
    width: 1080,
    height: 1350,
    label: 'Portrait / Instagram Feed',
    cssAspect: '4/5',
    defaultFontSize: 34,
    safeZone: { top: 0.12, bottom: 0.15, left: 0.08, right: 0.08 },
  },
} as const;

export type AspectRatioKey = keyof typeof ASPECT_RATIOS;

export const SUPPORTED_LOCALES = ['ar', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: SupportedLocale = 'ar';

export const QURAN_CONSTANTS = {
  TOTAL_SURAHS: 114,
  TOTAL_AYAHS: 6236,
  DEFAULT_RECITER_ID: 7, // Mishari Rashid al-Afasy
  DEFAULT_TRANSLATION_ID: 131, // Dr. Mustafa Khattab (The Clear Quran)
  MAX_AYAH_GENERATION_RANGE: 10,
};

export const QUEUE_NAMES = {
  MEDIA_GENERATION: 'media-generation',
  IMAGE_GENERATION: 'image-generation',
  STORY_GENERATION: 'story-generation',
  AUDIO_SYNC: 'audio-sync',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export const JOB_PRIORITY = {
  HIGH: 1,
  NORMAL: 5,
  LOW: 10,
} as const;
