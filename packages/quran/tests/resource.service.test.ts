import { describe, it, expect } from 'vitest';
import { quranResourceService } from '../src/services/resource.service.js';

describe('QuranResourceService', () => {
  it('should retrieve available languages', async () => {
    const langs = await quranResourceService.getAvailableLanguages('en');
    expect(langs.length).toBeGreaterThan(0);
    expect(langs.some((l) => l.isoCode === 'ar')).toBe(true);
    expect(langs.some((l) => l.isoCode === 'en')).toBe(true);
  });
});
