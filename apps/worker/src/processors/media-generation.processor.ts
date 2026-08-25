import type { Job } from 'bullmq';
import type { VideoGenerationJobData } from '../queues/definitions.js';
import { db } from '@quran-media/database';
import { quranVerseService, quranRecitationService, quranChapterService } from '@quran-media/quran';
import { aiRegistry, buildReverentVisualPrompt } from '@quran-media/ai';
import {
  mediaCompositionService,
  uploadFileToS3,
  MediaProjectSchema,
  type MediaProject,
  type AspectRatio,
} from '@quran-media/media';
import { env, logger } from '@quran-media/config';
import fs from 'fs';
import path from 'path';

export async function processVideoGeneration(job: Job<VideoGenerationJobData>): Promise<void> {
  const {
    generationId,
    projectId,
    userId,
    surahNumber,
    ayahStart = 1,
    ayahEnd = 1,
    aspectRatio = '9:16',
    reciterId = 7,
    stylePreset = 'cinematic_nature',
    customPrompt,
    aiProvider,
    locale = 'ar',
    project: customProject,
  } = job.data;

  const tempDir = path.resolve(env.MEDIA_TEMP_DIR, generationId);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    logger.info({ generationId, surahNumber, ayahStart, ayahEnd }, 'Starting video generation job');

    // 1. Initial State: PROCESSING (5%)
    await db.generation.update({
      where: { id: generationId },
      data: {
        status: 'PROCESSING',
        progress: 5,
        currentStep: 'INITIALIZING',
        startedAt: new Date(),
      },
    });
    await job.updateProgress(5);

    let projectToRender: MediaProject;

    if (customProject) {
      projectToRender = customProject;
    } else {
      // 2. Fetch Quranic Passages & Recitation Audio
      const targetSurah = surahNumber || 1;
      const chapter = await quranChapterService.getChapterById(targetSurah, locale);
      const verses = await quranVerseService.getVersesByChapter({
        surahId: targetSurah,
        fromVerse: ayahStart,
        toVerse: ayahEnd,
        locale,
        translationIds: [131],
      });
      const audioFile = await quranRecitationService.getChapterRecitationAudio(targetSurah, reciterId);

      // AI visual image background URL or prompt
      const imageProvider = aiRegistry.getPreferredProvider('image', aiProvider);
      const visualPrompt = buildReverentVisualPrompt({
        surahName: chapter.nameSimple || chapter.nameArabic,
        themeDescription: customPrompt || `Majestic reflection on divine verses of Surah ${chapter.nameSimple}`,
        stylePreset,
      });

      let bgImageUrl: string | undefined;
      try {
        if (imageProvider.generateImage) {
          const imgRes = await imageProvider.generateImage(visualPrompt, {
            aspectRatio,
            style: stylePreset,
          });
          bgImageUrl = imgRes.url;
        }
      } catch (imgErr) {
        logger.warn({ imgErr }, 'AI background image generation warning; falling back to procedural gradient');
      }

      // Build scenes array
      const scenes = verses.map((v, i) => ({
        id: `scene-${v.verseKey}`,
        duration: Math.max(4, Math.round(25 / verses.length)),
        background: {
          type: bgImageUrl ? ('image' as const) : ('animated_gradient' as const),
          src: bgImageUrl,
          color: '#020617',
          gradientColors: ['#064e3b', '#0f172a', '#020617'],
        },
        camera: {
          effect: (i % 2 === 0 ? 'zoom_in' : 'pan_left') as 'zoom_in' | 'pan_left',
          intensity: 0.12,
          startScale: 1.0,
          endScale: 1.12,
        },
        transition: {
          type: 'crossfade' as const,
          duration: 1.0,
        },
        verse: {
          verseKey: v.verseKey,
          surahNumber: targetSurah,
          ayahNumber: v.verseNumber,
          textUthmani: v.textUthmani,
          textSimple: v.textSimple,
          translationText: v.translations?.[0]?.text,
        },
        overlay: {
          title: `سورة ${chapter.nameArabic}`,
          themeColor: '#f59e0b',
        },
      }));

      // Subtitle cues with word timing if available
      const cues = verses.map((v, i) => ({
        index: i + 1,
        startMs: i * 5000,
        endMs: (i + 1) * 5000,
        arabicText: v.textUthmani || v.textSimple,
        translationText: v.translations?.[0]?.text,
        verseKey: v.verseKey,
      }));

      projectToRender = MediaProjectSchema.parse({
        id: generationId,
        title: `سورة ${chapter.nameArabic} - الآيات ${ayahStart}:${ayahEnd}`,
        aspectRatio: aspectRatio as AspectRatio,
        resolution: '1080p',
        fps: 30,
        scenes,
        audio: {
          recitation: {
            src: audioFile.audioUrl,
            reciterId,
            volume: 1.0,
            normalize: true,
          },
          ambient: {
            preset: 'deep_serenity',
            volume: 0.16,
            loop: true,
          },
          audioWaveform: {
            enabled: true,
            style: 'bars',
            color: '#f59e0b',
            height: 80,
            position: 'bottom',
            opacity: 0.85,
            scale: 'sqrt',
          },
          sidechainDucking: {
            enabled: true,
            duckAmountDb: 18,
          },
        },
        subtitles: {
          enabled: true,
          cues,
          style: {
            fontArabic: 'Amiri Quran, Traditional Arabic, Arial',
            fontTranslation: 'Inter, Roboto, Arial',
            primaryColorHex: '&H00FFFFFF',
            highlightColorHex: '&H0000D7FF',
            outlineColorHex: '&H00000000',
            outlineWidth: 3,
            shadowWidth: 2,
            alignment: 2,
            marginV: 140,
            dualLanguage: true,
            wordHighlight: true,
            rtl: true,
          },
        },
        intro: {
          enabled: true,
          duration: 3,
          titleAr: `سورة ${chapter.nameArabic}`,
          titleEn: `Surah ${chapter.nameSimple}`,
          badge: 'تلاوة خاشعة مرئية',
          animation: 'fade',
        },
        outro: {
          enabled: true,
          duration: 4,
          reflectionAr: 'سبحان الله وبحمده، سبحان الله العظيم',
          callToAction: 'اشترك للمزيد من روائع التلاوات والقصص القرآنية',
          socialHandle: '@QuranMedia',
          animation: 'fade',
        },
        outputFormats: ['mp4', 'webm', 'thumbnail', 'preview'],
      });
    }

    // 3. Execute Production-Grade MediaCompositionService
    const renderResult = await mediaCompositionService.compose(projectToRender, {
      tempDir,
      onProgress: async (progress) => {
        await db.generation.update({
          where: { id: generationId },
          data: {
            progress: progress.percent,
            currentStep: progress.currentStepDescription,
          },
        });
        await job.updateProgress(progress.percent);
      },
    });

    // 4. Upload Deliverables to S3 (progress: 90% - 98%)
    await db.generation.update({
      where: { id: generationId },
      data: { progress: 90, currentStep: 'UPLOADING_DELIVERABLES' },
    });
    await job.updateProgress(90);

    let storageUrlMp4 = '';
    let storageUrlWebm = '';
    let storageUrlThumb = '';
    let storageUrlPrev = '';

    if (renderResult.mp4Path && fs.existsSync(renderResult.mp4Path)) {
      const s3KeyMp4 = `media/videos/${userId}/${generationId}.mp4`;
      const up = await uploadFileToS3({
        key: s3KeyMp4,
        filePath: renderResult.mp4Path,
        contentType: 'video/mp4',
      });
      storageUrlMp4 = up.location;
    }

    if (renderResult.webmPath && fs.existsSync(renderResult.webmPath)) {
      const s3KeyWebm = `media/videos/${userId}/${generationId}.webm`;
      const up = await uploadFileToS3({
        key: s3KeyWebm,
        filePath: renderResult.webmPath,
        contentType: 'video/webm',
      });
      storageUrlWebm = up.location;
    }

    if (renderResult.thumbnailPath && fs.existsSync(renderResult.thumbnailPath)) {
      const s3KeyThumb = `media/thumbnails/${userId}/${generationId}.jpg`;
      const up = await uploadFileToS3({
        key: s3KeyThumb,
        filePath: renderResult.thumbnailPath,
        contentType: 'image/jpeg',
      });
      storageUrlThumb = up.location;
    }

    if (renderResult.previewPath && fs.existsSync(renderResult.previewPath)) {
      const s3KeyPrev = `media/previews/${userId}/${generationId}.mp4`;
      const up = await uploadFileToS3({
        key: s3KeyPrev,
        filePath: renderResult.previewPath,
        contentType: 'video/mp4',
      });
      storageUrlPrev = up.location;
    }

    // 5. Store MediaAsset Record in DB
    const mediaAsset = await db.mediaAsset.create({
      data: {
        userId,
        projectId,
        type: 'VIDEO',
        aspectRatio:
          aspectRatio === '9:16'
            ? 'RATIO_9_16'
            : aspectRatio === '16:9'
              ? 'RATIO_16_9'
              : aspectRatio === '1:1'
                ? 'RATIO_1_1'
                : 'RATIO_4_5',
        mimeType: 'video/mp4',
        fileSize: BigInt(renderResult.fileSizeMp4Bytes || 0),
        width: renderResult.width,
        height: renderResult.height,
        duration: renderResult.durationSeconds,
        storageKey: `media/videos/${userId}/${generationId}.mp4`,
        storageUrl: storageUrlMp4,
        thumbnailKey: `media/thumbnails/${userId}/${generationId}.jpg`,
        thumbnailUrl: storageUrlThumb,
        metadata: {
          webmUrl: storageUrlWebm,
          previewUrl: storageUrlPrev,
          aspectRatio: renderResult.aspectRatio,
          resolution: renderResult.resolution,
          fps: renderResult.fps,
        },
      },
    });

    // 6. Mark Generation COMPLETED (100%)
    await db.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        currentStep: 'DONE',
        completedAt: new Date(),
        result: {
          assetId: mediaAsset.id,
          storageUrl: storageUrlMp4,
          webmUrl: storageUrlWebm,
          thumbnailUrl: storageUrlThumb,
          previewUrl: storageUrlPrev,
          duration: renderResult.durationSeconds,
          aspectRatio: renderResult.aspectRatio,
        },
      },
    });

    await job.updateProgress(100);
    logger.info({ generationId, assetId: mediaAsset.id }, 'Video generation completed successfully');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    logger.error({ generationId, errorMsg }, 'Video generation failed');

    await db.generation.update({
      where: { id: generationId },
      data: {
        status: 'FAILED',
        error: errorMsg,
        currentStep: 'FAILED',
      },
    });

    throw err;
  } finally {
    // Clean up temporary workspace
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  }
}
