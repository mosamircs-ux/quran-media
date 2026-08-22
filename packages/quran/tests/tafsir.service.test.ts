import { describe, it, expect } from 'vitest';
import { quranTafsirService } from '../src/services/tafsir.service.js';

describe('QuranTafsirService', () => {
  it('should retrieve available tafsirs list', async () => {
    const tafsirs = await quranTafsirService.getAvailableTafsirs();
    expect(tafsirs.length).toBeGreaterThan(0);
    expect(tafsirs.some((t) => t.id === 16 || t.name.includes('Ibn Kathir'))).toBe(true);
  });

  it('should retrieve sanitized tafsir for verse 1:1', async () => {
    const tafsir = await quranTafsirService.getVerseTafsir('1:1', 16);
    expect(tafsir.resourceId).toBe(16);
    expect(tafsir.text).toBeDefined();
    expect(tafsir.text).not.toContain('<script>');
  });
});
