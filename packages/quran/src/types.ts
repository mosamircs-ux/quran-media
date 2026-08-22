export interface Chapter {
  id: number;
  revelationPlace: 'makkah' | 'madinah';
  revelationOrder: number;
  bismillahPre: boolean;
  nameSimple: string;
  nameComplex: string;
  nameArabic: string;
  versesCount: number;
  pages: [number, number];
  translatedName: {
    languageName: string;
    name: string;
  };
}

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

export interface VerseTranslation {
  id: number;
  resourceId: number;
  text: string;
  authorName?: string;
}

export interface Verse {
  id: number;
  verseNumber: number;
  verseKey: string;
  hizbNumber: number;
  rubElHizbNumber: number;
  rukuNumber: number;
  manzilNumber: number;
  sajdahNumber: number | null;
  textUthmani: string;
  textSimple?: string;
  words?: VerseWord[];
  translations?: VerseTranslation[];
  audio?: {
    url: string;
    duration?: number;
    segments?: [number, number, number, number][]; // [wordIndex, startMs, endMs, timestamp]
  };
}

export interface AudioTimestampSegment {
  wordIndex: number;
  startMs: number;
  endMs: number;
  durationMs: number;
}

export interface ReciterAudioData {
  surahNumber: number;
  reciterId: number;
  audioUrl: string;
  format: string;
  durationSeconds?: number;
  verseTimestamps: {
    verseKey: string;
    timestampFromMs: number;
    timestampToMs: number;
    durationMs: number;
    segments: AudioTimestampSegment[];
  }[];
}

export interface SearchResultItem {
  verseKey: string;
  verseId: number;
  text: string;
  highlightedText?: string;
  translations?: {
    name: string;
    text: string;
  }[];
}

export interface SearchResponse {
  query: string;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  results: SearchResultItem[];
}
