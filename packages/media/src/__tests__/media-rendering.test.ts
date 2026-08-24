import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {
  imageRenderer,
  audioRenderer,
  subtitleRenderer,
  thumbnailGenerator,
  mediaCompositionService,
  MediaProjectSchema,
  getResolutionDimensions,
  type MediaProject,
} from '../index.js';

describe('Production-Grade Video Rendering Engine', () => {
  let testTempDir: string;

  beforeAll(() => {
    testTempDir = path.join(os.tmpdir(), `quran-media-test-${Date.now()}`);
    fs.mkdirSync(testTempDir, { recursive: true });
  });

  afterAll(() => {
    try {
      if (fs.existsSync(testTempDir)) {
        fs.rmSync(testTempDir, { recursive: true, force: true });
      }
    } catch {}
  });

  describe('Aspect Ratios & Dimension Configurations', () => {
    it('correctly maps 9:16, 16:9, 1:1, and 4:5 dimensions at 720p, 1080p, and 4k', () => {
      const d916_1080 = getResolutionDimensions('9:16', '1080p');
      expect(d916_1080.width).toBe(1080);
      expect(d916_1080.height).toBe(1920);

      const d169_1080 = getResolutionDimensions('16:9', '1080p');
      expect(d169_1080.width).toBe(1920);
      expect(d169_1080.height).toBe(1080);

      const d11_1080 = getResolutionDimensions('1:1', '1080p');
      expect(d11_1080.width).toBe(1080);
      expect(d11_1080.height).toBe(1080);

      const d45_1080 = getResolutionDimensions('4:5', '1080p');
      expect(d45_1080.width).toBe(1080);
      expect(d45_1080.height).toBe(1350);

      const d916_4k = getResolutionDimensions('9:16', '4k');
      expect(d916_4k.width).toBe(2160);
      expect(d916_4k.height).toBe(3840);
    });
  });

  describe('ImageRenderer', () => {
    it('renders procedural gradient & particle backgrounds to valid PNG buffers', async () => {
      const buffer = await imageRenderer.renderBackground(
        {
          type: 'animated_gradient',
          color: '#020617',
          gradientColors: ['#064e3b', '#0f172a', '#020617'],
        },
        540,
        960
      );

      expect(Buffer.isBuffer(buffer)).toBe(true);
      expect(buffer.length).toBeGreaterThan(1000);
      // Check PNG magic bytes (0x89 0x50 0x4E 0x47)
      expect(buffer[0]).toBe(0x89);
      expect(buffer[1]).toBe(0x50);
      expect(buffer[2]).toBe(0x4e);
      expect(buffer[3]).toBe(0x47);
    });

    it('renders high-DPI Quran calligraphic text plates with ornate framing', async () => {
      const plateBuffer = await imageRenderer.renderQuranTextPlate(
        {
          surahNumber: 2,
          ayahNumber: 255,
          textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
          translationText: 'Allah! There is no god except Him, the Ever-Living, All-Sustaining.',
        },
        {
          calligraphySurah: 'سورة البقرة',
          themeColor: '#f59e0b',
        },
        540,
        960,
        '9:16'
      );

      expect(Buffer.isBuffer(plateBuffer)).toBe(true);
      expect(plateBuffer.length).toBeGreaterThan(2000);
    });

    it('renders Intro and Outro cards with luxury Islamic motifs', async () => {
      const introBuffer = await imageRenderer.renderIntroCard(
        {
          enabled: true,
          duration: 3,
          titleAr: 'سورة البقرة',
          titleEn: 'Surah Al-Baqarah',
          badge: 'آية الكرسي',
          animation: 'fade',
        },
        540,
        960
      );
      expect(introBuffer.length).toBeGreaterThan(1500);

      const outroBuffer = await imageRenderer.renderOutroCard(
        {
          enabled: true,
          duration: 4,
          reflectionAr: 'سبحان الله وبحمده',
          callToAction: 'اشترك للمزيد',
          socialHandle: '@QuranMedia',
          animation: 'fade',
        },
        540,
        960
      );
      expect(outroBuffer.length).toBeGreaterThan(1500);
    });
  });

  describe('AudioRenderer', () => {
    it('generates soothing ambient soundscapes and silent beds', async () => {
      const ambientPath = path.join(testTempDir, 'ambient-test.mp3');
      await audioRenderer.generatePresetAmbient('deep_serenity', ambientPath, 2);

      expect(fs.existsSync(ambientPath)).toBe(true);
      expect(fs.statSync(ambientPath).size).toBeGreaterThan(500);
    });
  });

  describe('SubtitleRenderer', () => {
    it('compiles Advanced SubStation Alpha (.ass) with Arabic RTL styles and karaoke timing', () => {
      const ass = subtitleRenderer.generateAssSubtitles(
        {
          enabled: true,
          cues: [
            {
              index: 1,
              startMs: 0,
              endMs: 3500,
              arabicText: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ',
              translationText: 'Allah! There is no god except Him',
              words: [
                { text: 'ٱللَّهُ', startMs: 0, endMs: 800 },
                { text: 'لَآ', startMs: 800, endMs: 1400 },
                { text: 'إِلَٰهَ', startMs: 1400, endMs: 2300 },
                { text: 'إِلَّا', startMs: 2300, endMs: 2900 },
                { text: 'هُوَ', startMs: 2900, endMs: 3500 },
              ],
            },
          ],
          style: {
            fontArabic: 'Amiri Quran',
            fontTranslation: 'Inter',
            highlightColorHex: '&H0000D7FF',
            dualLanguage: true,
            wordHighlight: true,
          },
        },
        1080,
        1920
      );

      expect(ass).toContain('[Script Info]');
      expect(ass).toContain('Style: QuranArabic,Amiri Quran');
      expect(ass).toContain('Style: TranslationText,Inter');
      expect(ass).toContain('{\\k80}ٱللَّهُ');
      expect(ass).toContain('Dialogue: 0,0:00:00.00,0:00:03.50,QuranArabic');
      expect(ass).toContain('Dialogue: 0,0:00:00.00,0:00:03.50,TranslationText');
    });

    it('generates WebVTT and SRT formats', () => {
      const cues = [
        {
          index: 1,
          startMs: 1000,
          endMs: 4000,
          arabicText: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
          translationText: 'In the Name of Allah, Most Compassionate, Most Merciful',
        },
      ];

      const vtt = subtitleRenderer.generateVttSubtitles(cues);
      expect(vtt).toContain('WEBVTT');
      expect(vtt).toContain('00:00:01.000 --> 00:00:04.000');
      expect(vtt).toContain('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');

      const srt = subtitleRenderer.generateSrtSubtitles(cues);
      expect(srt).toContain('1\n00:00:01,000 --> 00:00:04,000');
    });
  });

  describe('MediaCompositionService End-to-End', () => {
    it('validates MediaProject schema and computes render deliverables', () => {
      const validProjectPayload: MediaProject = {
        id: 'test-project-1',
        title: 'Ayat al-Kursi Visual Production',
        aspectRatio: '9:16',
        resolution: '1080p',
        fps: 30,
        scenes: [
          {
            id: 'scene-1',
            duration: 3,
            background: {
              type: 'animated_gradient',
              color: '#020617',
              gradientColors: ['#064e3b', '#0f172a', '#020617'],
            },
            camera: {
              effect: 'zoom_in',
              intensity: 0.15,
              startScale: 1.0,
              endScale: 1.15,
            },
            transition: {
              type: 'crossfade',
              duration: 1.0,
            },
            verse: {
              verseKey: '2:255',
              surahNumber: 2,
              ayahNumber: 255,
              textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
              translationText: 'Allah! There is no god except Him, the Ever-Living, All-Sustaining.',
            },
          },
        ],
        audio: {
          ambient: {
            preset: 'deep_serenity',
            volume: 0.15,
          },
          audioWaveform: {
            enabled: false,
            style: 'bars',
            color: '#f59e0b',
            backgroundColor: '#00000000',
            height: 80,
            position: 'bottom',
            opacity: 0.85,
            scale: 'sqrt',
          },
        },
        subtitles: {
          enabled: true,
          cues: [
            {
              index: 1,
              startMs: 0,
              endMs: 3000,
              arabicText: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
              translationText: 'Allah! There is no god except Him, the Ever-Living, All-Sustaining.',
            },
          ],
        },
        outputFormats: ['mp4', 'thumbnail'],
      };

      const parsed = MediaProjectSchema.parse(validProjectPayload);
      expect(parsed.id).toBe('test-project-1');
      expect(parsed.aspectRatio).toBe('9:16');
      expect(parsed.scenes.length).toBe(1);
    });

    it('renders a fast 2-scene production clip with Ken Burns, subtitles, and thumbnail', async () => {
      const renderProject: MediaProject = {
        id: `render-test-${Date.now()}`,
        title: 'Surah Al-Ikhlas Short',
        aspectRatio: '1:1',
        resolution: '720p',
        fps: 24,
        scenes: [
          {
            id: 'scene-1',
            duration: 2,
            background: {
              type: 'animated_gradient',
              color: '#020617',
              gradientColors: ['#064e3b', '#0f172a', '#020617'],
            },
            camera: {
              effect: 'zoom_in',
              intensity: 0.1,
              startScale: 1.0,
              endScale: 1.1,
            },
            transition: {
              type: 'crossfade',
              duration: 0.8,
            },
            verse: {
              verseKey: '112:1',
              surahNumber: 112,
              ayahNumber: 1,
              textUthmani: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
              translationText: 'Say, He is Allah, the One',
            },
          },
          {
            id: 'scene-2',
            duration: 2,
            background: {
              type: 'animated_gradient',
              color: '#020617',
              gradientColors: ['#1e1b4b', '#0f172a', '#020617'],
            },
            camera: {
              effect: 'pan_left',
              intensity: 0.1,
              startScale: 1.0,
              endScale: 1.1,
            },
            transition: {
              type: 'crossfade',
              duration: 0.8,
            },
            verse: {
              verseKey: '112:2',
              surahNumber: 112,
              ayahNumber: 2,
              textUthmani: 'ٱللَّهُ ٱلصَّمَدُ',
              translationText: 'Allah, the Eternal Refuge',
            },
          },
        ],
        audio: {
          ambient: {
            preset: 'night_desert',
            volume: 0.15,
          },
          audioWaveform: {
            enabled: false,
            style: 'bars',
            color: '#f59e0b',
            backgroundColor: '#00000000',
            height: 60,
            position: 'bottom',
            opacity: 0.8,
            scale: 'sqrt',
          },
        },
        subtitles: {
          enabled: true,
          cues: [
            {
              index: 1,
              startMs: 0,
              endMs: 2000,
              arabicText: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
              translationText: 'Say, He is Allah, the One',
            },
            {
              index: 2,
              startMs: 2000,
              endMs: 4000,
              arabicText: 'ٱللَّهُ ٱلصَّمَدُ',
              translationText: 'Allah, the Eternal Refuge',
            },
          ],
        },
        outputFormats: ['mp4', 'thumbnail'],
      };

      const progressSteps: string[] = [];
      const result = await mediaCompositionService.compose(renderProject, {
        tempDir: path.join(testTempDir, 'composition-run'),
        onProgress: (p) => {
          progressSteps.push(`${p.stage}: ${p.percent}%`);
        },
      });

      expect(result.durationSeconds).toBe(4);
      expect(result.width).toBe(720);
      expect(result.height).toBe(720);
      expect(result.mp4Path).toBeDefined();
      expect(fs.existsSync(result.mp4Path!)).toBe(true);
      expect(result.fileSizeMp4Bytes).toBeGreaterThan(10000);
      expect(result.thumbnailPath).toBeDefined();
      expect(fs.existsSync(result.thumbnailPath!)).toBe(true);
      expect(progressSteps.length).toBeGreaterThan(3);
    }, 45000);
  });
});
