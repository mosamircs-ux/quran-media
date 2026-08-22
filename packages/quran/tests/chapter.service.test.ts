import { describe, it, expect } from 'vitest';
import { quranChapterService } from '../src/services/chapter.service.js';

describe('QuranChapterService', () => {
  it('should retrieve all 114 chapters with complete metadata', async () => {
    const chapters = await quranChapterService.getAllChapters('ar');
    expect(chapters.length).toBe(114);

    const fatihah = chapters[0]!;
    expect(fatihah.id).toBe(1);
    expect(fatihah.nameArabic).toBe('الفاتحة');
    expect(fatihah.versesCount).toBe(7);

    const baqarah = chapters[1]!;
    expect(baqarah.id).toBe(2);
    expect(baqarah.nameArabic).toBe('البقرة');
    expect(baqarah.versesCount).toBe(286);
  });

  it('should retrieve chapter by ID (1 and 114)', async () => {
    const chapter1 = await quranChapterService.getChapterById(1, 'ar');
    expect(chapter1.id).toBe(1);
    expect(chapter1.nameSimple).toBe('Al-Fatihah');

    const chapter114 = await quranChapterService.getChapterById(114, 'ar');
    expect(chapter114.id).toBe(114);
    expect(chapter114.nameSimple).toBe('An-Nas');
  });

  it('should reject invalid chapter IDs', async () => {
    await expect(quranChapterService.getChapterById(0)).rejects.toThrow();
    await expect(quranChapterService.getChapterById(115)).rejects.toThrow();
  });

  it('should retrieve chapter info for Surah 1', async () => {
    const info = await quranChapterService.getChapterInfo(1, 'en');
    expect(info.chapterId).toBe(1);
    expect(info.text).toBeDefined();
  });
});
