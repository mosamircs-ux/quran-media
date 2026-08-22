export interface TranslationResource {
  id: number;
  name: string;
  authorName: string;
  languageName: string;
  direction?: 'ltr' | 'rtl';
}

export interface VerseTranslation {
  id: number;
  resourceId: number;
  resourceName?: string;
  languageName?: string;
  text: string;
}
