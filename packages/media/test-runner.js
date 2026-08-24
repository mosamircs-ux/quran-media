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
} from './dist/index.js';

async function runAllTests() {
  console.log('🚀 Starting Production-Grade Video Rendering Engine Test Suite...\n');
  const tempDir = path.join(os.tmpdir(), `quran-media-engine-test-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // ------------------------------------------------------------------------
    // Test 1: Aspect Ratios & Dimension Mapping
    // ------------------------------------------------------------------------
    console.log('📐 [1/5] Testing Aspect Ratios & Resolutions...');
    const d916 = getResolutionDimensions('9:16', '1080p');
    const d169 = getResolutionDimensions('16:9', '1080p');
    const d11 = getResolutionDimensions('1:1', '1080p');
    const d45 = getResolutionDimensions('4:5', '1080p');
    const d4k = getResolutionDimensions('9:16', '4k');

    assert(d916.width === 1080 && d916.height === 1920, '9:16 maps to 1080x1920');
    assert(d169.width === 1920 && d169.height === 1080, '16:9 maps to 1920x1080');
    assert(d11.width === 1080 && d11.height === 1080, '1:1 maps to 1080x1080');
    assert(d45.width === 1080 && d45.height === 1350, '4:5 maps to 1080x1350');
    assert(d4k.width === 2160 && d4k.height === 3840, '4k 9:16 maps to 2160x3840');

    // ------------------------------------------------------------------------
    // Test 2: ImageRenderer
    // ------------------------------------------------------------------------
    console.log('\n🎨 [2/5] Testing ImageRenderer...');
    const bgBuffer = await imageRenderer.renderBackground(
      { type: 'animated_gradient', color: '#020617', gradientColors: ['#064e3b', '#0f172a', '#020617'] },
      540,
      960
    );
    assert(Buffer.isBuffer(bgBuffer) && bgBuffer.length > 2000, 'Rendered animated gradient background PNG');

    const plateBuffer = await imageRenderer.renderQuranTextPlate(
      {
        surahNumber: 2,
        ayahNumber: 255,
        textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
        translationText: 'Allah! There is no god except Him, the Ever-Living, All-Sustaining.',
      },
      { calligraphySurah: 'سورة البقرة', themeColor: '#f59e0b' },
      540,
      960,
      '9:16'
    );
    assert(Buffer.isBuffer(plateBuffer) && plateBuffer.length > 3000, 'Rendered Quran calligraphic plate PNG');

    const introBuffer = await imageRenderer.renderIntroCard(
      { enabled: true, duration: 3, titleAr: 'سورة البقرة', titleEn: 'Surah Al-Baqarah', badge: 'آية الكرسي' },
      540,
      960
    );
    assert(Buffer.isBuffer(introBuffer) && introBuffer.length > 2000, 'Rendered Intro Slate PNG');

    const outroBuffer = await imageRenderer.renderOutroCard(
      { enabled: true, duration: 4, reflectionAr: 'سبحان الله وبحمده', callToAction: 'اشترك للمزيد', socialHandle: '@QuranMedia' },
      540,
      960
    );
    assert(Buffer.isBuffer(outroBuffer) && outroBuffer.length > 2000, 'Rendered Outro Slate PNG');

    // ------------------------------------------------------------------------
    // Test 3: AudioRenderer
    // ------------------------------------------------------------------------
    console.log('\n🔊 [3/5] Testing AudioRenderer...');
    const ambientPath = path.join(tempDir, 'ambient.mp3');
    await audioRenderer.generatePresetAmbient('deep_serenity', ambientPath, 2);
    assert(fs.existsSync(ambientPath) && fs.statSync(ambientPath).size > 1000, 'Generated soothing ambient soundscape MP3');

    // ------------------------------------------------------------------------
    // Test 4: SubtitleRenderer
    // ------------------------------------------------------------------------
    console.log('\n📝 [4/5] Testing SubtitleRenderer...');
    const ass = subtitleRenderer.generateAssSubtitles(
      {
        enabled: true,
        cues: [
          {
            index: 1,
            startMs: 0,
            endMs: 3000,
            arabicText: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
            translationText: 'Allah! There is no god except Him',
            words: [
              { text: 'ٱللَّهُ', startMs: 0, endMs: 600 },
              { text: 'لَآ', startMs: 600, endMs: 1100 },
              { text: 'إِلَٰهَ', startMs: 1100, endMs: 1800 },
              { text: 'إِلَّا', startMs: 1800, endMs: 2300 },
              { text: 'هُوَ', startMs: 2300, endMs: 3000 },
            ],
          },
        ],
        style: { fontArabic: 'Amiri Quran', fontTranslation: 'Inter', highlightColorHex: '&H0000D7FF', dualLanguage: true, wordHighlight: true },
      },
      1080,
      1920
    );
    assert(ass.includes('[Script Info]') && ass.includes('{\\k60}ٱللَّهُ'), 'Compiled ASS with Arabic RTL & word-by-word karaoke timing');

    const vtt = subtitleRenderer.generateVttSubtitles([
      { index: 1, startMs: 0, endMs: 3000, arabicText: 'بِسْمِ ٱللَّهِ', translationText: 'In the Name of Allah' },
    ]);
    assert(vtt.includes('WEBVTT') && vtt.includes('00:00:00.000 --> 00:00:03.000'), 'Compiled WebVTT subtitles');

    // ------------------------------------------------------------------------
    // Test 5: MediaCompositionService End-to-End Rendering
    // ------------------------------------------------------------------------
    console.log('\n🎬 [5/5] Testing MediaCompositionService End-to-End Video Synthesis...');
    const projectPayload = {
      id: `prod-run-${Date.now()}`,
      title: 'Surah Al-Ikhlas Masterclip',
      aspectRatio: '9:16',
      resolution: '720p',
      fps: 24,
      scenes: [
        {
          id: 'scene-1',
          duration: 2,
          background: { type: 'animated_gradient', color: '#020617', gradientColors: ['#064e3b', '#0f172a', '#020617'] },
          camera: { effect: 'zoom_in', intensity: 0.1, startScale: 1.0, endScale: 1.1 },
          transition: { type: 'crossfade', duration: 0.8 },
          verse: { surahNumber: 112, ayahNumber: 1, textUthmani: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translationText: 'Say, He is Allah, [who is] One' },
          overlay: { title: 'سورة الإخلاص', themeColor: '#f59e0b' },
        },
        {
          id: 'scene-2',
          duration: 2,
          background: { type: 'animated_gradient', color: '#020617', gradientColors: ['#1e1b4b', '#0f172a', '#020617'] },
          camera: { effect: 'pan_left', intensity: 0.1, startScale: 1.0, endScale: 1.1 },
          transition: { type: 'crossfade', duration: 0.8 },
          verse: { surahNumber: 112, ayahNumber: 2, textUthmani: 'ٱللَّهُ ٱلصَّمَدُ', translationText: 'Allah, the Eternal Refuge' },
          overlay: { title: 'سورة الإخلاص', themeColor: '#f59e0b' },
        },
      ],
      audio: {
        ambient: { preset: 'deep_serenity', volume: 0.15 },
        audioWaveform: { enabled: false },
      },
      subtitles: {
        enabled: true,
        cues: [
          { index: 1, startMs: 0, endMs: 2000, arabicText: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ', translationText: 'Say, He is Allah, One' },
          { index: 2, startMs: 2000, endMs: 4000, arabicText: 'ٱللَّهُ ٱلصَّمَدُ', translationText: 'Allah, the Eternal Refuge' },
        ],
      },
      intro: { enabled: true, duration: 2, titleAr: 'سورة الإخلاص', titleEn: 'Surah Al-Ikhlas', badge: 'تلاوة مرئية' },
      outro: { enabled: true, duration: 2, reflectionAr: 'سبحان الله العظيم', callToAction: 'اشترك للمزيد' },
      outputFormats: ['mp4', 'webm', 'thumbnail', 'preview'],
    };

    const parsedProject = MediaProjectSchema.parse(projectPayload);
    assert(parsedProject.scenes.length === 2, 'Parsed and validated MediaProject schema');

    const progressLogs = [];
    const renderOutput = await mediaCompositionService.compose(parsedProject, {
      tempDir: path.join(tempDir, 'e2e-output'),
      onProgress: (p) => {
        progressLogs.push(p);
      },
    });

    assert(renderOutput.durationSeconds === 8, 'Total duration matches scenes + intro + outro (8 seconds)');
    assert(renderOutput.width === 720 && renderOutput.height === 1280, 'Resolution matches 720p 9:16 (720x1280)');
    assert(renderOutput.mp4Path && fs.existsSync(renderOutput.mp4Path), `Generated MP4 file: ${renderOutput.mp4Path}`);
    assert((renderOutput.fileSizeMp4Bytes || 0) > 15000, `MP4 file size valid: ${(renderOutput.fileSizeMp4Bytes || 0) / 1024} KB`);
    assert(renderOutput.thumbnailPath && fs.existsSync(renderOutput.thumbnailPath), `Generated JPEG thumbnail: ${renderOutput.thumbnailPath}`);
    assert(renderOutput.previewPath && fs.existsSync(renderOutput.previewPath), `Generated Preview clip: ${renderOutput.previewPath}`);
    assert(progressLogs.length >= 5, `Live progress reporting verified (${progressLogs.length} updates logged)`);

    console.log(`\n======================================================`);
    console.log(`✨ TEST SUITE SUMMARY: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Test suite encountered fatal error:', error);
    process.exit(1);
  } finally {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  }
}

runAllTests();
