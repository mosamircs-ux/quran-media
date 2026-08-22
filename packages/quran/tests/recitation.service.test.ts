import { describe, it, expect } from 'vitest';
import { quranRecitationService } from '../src/services/recitation.service.js';

describe('QuranRecitationService', () => {
  it('should retrieve available reciters list', async () => {
    const reciters = await quranRecitationService.getAvailableReciters();
    expect(reciters.length).toBeGreaterThan(0);
    expect(reciters.some((r) => r.id === 7 || r.name.includes('Afasy'))).toBe(true);
  });

  it('should retrieve chapter recitation audio for Surah 1', async () => {
    const audio = await quranRecitationService.getChapterRecitationAudio(1, 7);
    expect(audio.chapterId).toBe(1);
    expect(audio.audioUrl).toBeDefined();
    expect(audio.audioUrl.endsWith('.mp3')).toBe(true);
  });
});
