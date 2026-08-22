import { describe, it, expect } from 'vitest';
import { quranVerseService } from '../src/services/verse.service.js';

describe('QuranVerseService', () => {
  it('should retrieve key verses 1:1 and 2:255 (Ayat Al-Kursi)', async () => {
    const verse1_1 = await quranVerseService.getVerseByKey({ verseKey: '1:1' });
    expect(verse1_1.verseKey).toBe('1:1');
    expect(verse1_1.textUthmani).toContain('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');

    const verse2_255 = await quranVerseService.getVerseByKey({ verseKey: '2:255' });
    expect(verse2_255.verseKey).toBe('2:255');
    expect(verse2_255.textUthmani).toContain('ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ');
  });

  it('should retrieve verse range with bounds check (2:255 -> 2:257)', async () => {
    const range = await quranVerseService.getVerseRange(2, 255, 257);
    expect(range.chapterId).toBe(2);
    expect(range.fromVerseNumber).toBe(255);
    expect(range.toVerseNumber).toBe(257);
    expect(range.totalVerses).toBeGreaterThanOrEqual(1);
  });

  it('should retrieve a random valid verse', async () => {
    const randomVerse = await quranVerseService.getRandomVerse();
    expect(randomVerse.verseKey).toMatch(/^\d+:\d+$/);
    expect(randomVerse.textUthmani).toBeDefined();
  });
});
