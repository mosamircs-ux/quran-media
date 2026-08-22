import type { VerseTranslation } from './translation.types.js';
import type { VerseTafsir } from './tafsir.types.js';

export interface VerseWord {
  id: number;
  position: number;
  audioUrl?: string;
  charTypeName: string;
  textUthmani: string;
  textIndopak?: string;
  textImlaei?: string;
  pageNumber: number;
  lineNumber: number;
  translation?: {
    text: string;
    languageName: string;
  };
  transliteration?: {
    text: string;
    languageName: string;
  };
}

export interface VerseAudioSegment {
  wordIndex: number;
  startMs: number;
  endMs: number;
  durationMs: number;
}

export interface VerseAudio {
  url: string;
  duration?: number;
  segments?: VerseAudioSegment[];
}

export interface Verse {
  id: number;
  verseNumber: number;
  verseKey: string; // e.g. "2:255"
  chapterId: number;
  hizbNumber: number;
  rubElHizbNumber: number;
  rukuNumber: number;
  manzilNumber: number;
  sajdahNumber: number | null;
  textUthmani: string;
  textSimple: string;
  textImlaei?: string;
  transliteration?: string;
  words?: VerseWord[];
  translations?: VerseTranslation[];
  tafsirs?: VerseTafsir[];
  audio?: VerseAudio;
}

export interface VerseRange {
  chapterId: number;
  fromVerseNumber: number;
  toVerseNumber: number;
  totalVerses: number;
  verses: Verse[];
}
