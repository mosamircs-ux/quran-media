export type RevelationPlace = 'makkah' | 'madinah';

export interface ChapterTranslatedName {
  languageName: string;
  name: string;
}

export interface Chapter {
  id: number;
  revelationPlace: RevelationPlace;
  revelationOrder: number;
  bismillahPre: boolean;
  nameSimple: string;
  nameComplex: string;
  nameArabic: string;
  versesCount: number;
  pages: [number, number];
  translatedName: ChapterTranslatedName;
}

export interface ChapterInfo {
  id: number;
  chapterId: number;
  languageName: string;
  shortText: string;
  source: string;
  text: string;
}
