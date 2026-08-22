export interface Language {
  id: number;
  name: string;
  isoCode: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  translationsCount?: number;
}
