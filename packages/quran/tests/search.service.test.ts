import { describe, it, expect } from 'vitest';
import { quranSearchService } from '../src/services/search.service.js';
import { ValidationError } from '@quran-media/config';

describe('QuranSearchService', () => {
  it('should reject search query with less than 2 characters', async () => {
    await expect(quranSearchService.search({ query: 'a' })).rejects.toThrow(ValidationError);
    await expect(quranSearchService.search({ query: '' })).rejects.toThrow(ValidationError);
  });

  it('should return valid search response structure for query "mercy"', async () => {
    const result = await quranSearchService.search({ query: 'mercy', locale: 'en' });
    expect(result.query).toBe('mercy');
    expect(result.currentPage).toBe(1);
    expect(Array.isArray(result.results)).toBe(true);
  });
});
