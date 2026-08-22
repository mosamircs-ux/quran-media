import { describe, it, expect } from 'vitest';
import { quranTranslationService } from '../src/services/translation.service.js';

describe('QuranTranslationService', () => {
  it('should retrieve available translations list', async () => {
    const list = await quranTranslationService.getAvailableTranslations();
    expect(list.length).toBeGreaterThan(0);
    expect(list.some((t) => t.id === 131 || t.name.includes('Clear Quran'))).toBe(true);
  });

  it('should retrieve verse translation for 1:1', async () => {
    const trans = await quranTranslationService.getVerseTranslation('1:1', 131);
    expect(trans.resourceId).toBe(131);
    expect(trans.text).toBeDefined();
  });
});
