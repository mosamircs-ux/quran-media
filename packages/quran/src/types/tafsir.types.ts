export interface TafsirResource {
  id: number;
  name: string;
  authorName: string;
  languageName: string;
  slug: string;
}

export interface VerseTafsir {
  id: number;
  resourceId: number;
  resourceName?: string;
  languageName?: string;
  text: string; // Sanitized HTML/Markdown
  rawText?: string;
}
