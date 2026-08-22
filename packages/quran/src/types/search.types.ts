export interface SearchMatch {
  verseKey: string;
  verseId: number;
  text: string;
  highlightedText?: string;
  translations?: Array<{
    id?: number;
    name: string;
    text: string;
  }>;
}

export interface SearchResult {
  query: string;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  results: SearchMatch[];
}
