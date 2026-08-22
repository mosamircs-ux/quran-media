import type { Job } from 'bullmq';
import type { VideoGenerationJobData } from '../queues/definitions.js';
import { db } from '@quran-media/database';
import { getVersesBySurah, getRecitationAudio, getChapterById } from '@quran-media/quran';
import { aiRegistry, buildReverentVisualPrompt } from '@quran-media/ai';
import {
  synthesizeQuranVideo,
  generateAssSubtitles,
  composeQuranImage,
  uploadFileToS3,
  getDimensionsForAspectRatio,
  type SubtitleCue,
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
    ayahStart,
    ayahEnd,
    aspectRatio,
    reciterId = 7,
    stylePreset = 'cinematic_nature',
    customPrompt,
    aiProvider,
    locale = 'ar',
  } = job.data;

  const tempDir = path.resolve(env.MEDIA_TEMP_DIR, generationId);
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    logger.info({ generationId, surahNumber, ayahStart, ayahEnd }, 'Processing video generation job');

    // 1. Update Database Status -> PROCESSING (10%)
    await db.generation.update({
      where: { id: generationId },
      data: {
        status: 'PROCESSING',
        progress: 10,
        currentStep: 'FETCHING_QURAN_DATA',
        startedAt: new Date(),
      },
    });
    await job.updateProgress(10);

    // 2. Fetch Verses & Chapter Metadata
    const chapter = await getChapterById(surahNumber, locale);
    const verses = await getVersesBySurah({
      surah: surahNumber,
      fromAyah: ayahStart,
      toAyah: ayahEnd,
      locale,
    });
    const audioData = await getRecitationAudio(surahNumber, reciterId);

    // 3. Generate AI Visual Background (progress: 30%)
    await db.generation.update({
      where: { id: generationId },
      data: { progress: 30, currentStep: 'GENERATING_VISUALS' },
    });
    await job.updateProgress(30);

    const imageProvider = aiRegistry.getPreferredProvider('image', aiProvider);
    const visualPrompt = buildReverentVisualPrompt({
      surahName: chapter.nameSimple,
      themeDescription: customPrompt || `Majestic reflection on divine verses of Surah ${chapter.nameSimple}`,
      stylePreset,
    });

    let backgroundBuffer: Buffer;
    if (imageProvider.generateImage) {
      const imgRes = await imageProvider.generateImage(visualPrompt, {
        aspectRatio,
        style: stylePreset,
      });

      if (imgRes.url.startsWith('data:')) {
        const base64Data = imgRes.url.split(',')[1] || '';
        backgroundBuffer = Buffer.from(base64Data, 'base64');
      } else {
        // Fetch image url
        const res = await fetch(imgRes.url);
        backgroundBuffer = Buffer.from(await res.arrayBuffer());
      }
    } else {
      const dims = getDimensionsForAspectRatio(aspectRatio);
      backgroundBuffer = await composeQuranImage({
        width: dims.width,
        height: dims.height,
        aspectRatio,
        surahTitle: `سورة ${chapter.nameArabic}`,
      });
    }

    const bgImagePath = path.join(tempDir, 'background.png');
    fs.writeFileSync(bgImagePath, backgroundBuffer);

    // 4. Download / prepare Audio file (progress: 50%)
    await db.generation.update({
      where: { id: generationId },
      data: { progress: 50, currentStep: 'PREPARING_AUDIO' },
    });
    await job.updateProgress(50);

    const audioBuffer = await (await fetch(audioData.audioUrl)).arrayBuffer();
    const audioFilePath = path.join(tempDir, 'recitation.mp3');
    fs.writeFileSync(audioFilePath, Buffer.from(audioBuffer));

    // 5. Generate Subtitles (progress: 65%)
    await db.generation.update({
      where: { id: generationId },
      data: { progress: 65, currentStep: 'COMPILING_SUBTITLES' },
    });
    await job.updateProgress(65);

    const cues: SubtitleCue[] = verses.map((v, i) => ({
      index: i + 1,
      startMs: i * 5000,
      endMs: (i + 1) * 5000,
      arabicText: v.textUthmani,
      translationText: v.translations?.[0]?.text,
    }));

    const dims = getDimensionsForAspectRatio(aspectRatio);
    const assContent = generateAssSubtitles(cues, undefined, dims.width, dims.height);
    const subtitleFilePath = path.join(tempDir, 'subtitles.ass');
    fs.writeFileSync(subtitleFilePath, assContent, 'utf8');

    // 6. FFmpeg Video Synthesis (progress: 75% -> 90%)
    await db.generation.update({
      where: { id: generationId },
      data: { progress: 75, currentStep: 'SYNTHESIZING_VIDEO' },
    });
    await job.updateProgress(75);

    const outputVideoPath = path.join(tempDir, 'output.mp4');
    await synthesizeQuranVideo({
      audioPath: audioFilePath,
      backgroundPath: bgImagePath,
      subtitlePath: subtitleFilePath,
      outputPath: outputVideoPath,
      aspectRatio,
      onProgress: async (p) => {
        const scaled = Math.round(75 + (p * 15) / 100);
        await job.updateProgress(scaled);
      },
    });

    // 7. Upload to S3 (progress: 95%)
    await db.generation.update({
      where: { id: generationId },
      data: { progress: 95, currentStep: 'UPLOADING_STORAGE' },
    });
    await job.updateProgress(95);

    const s3Key = `media/videos/${userId}/${generationId}.mp4`;
    const stats = fs.statSync(outputVideoPath);
    const uploadResult = await uploadFileToS3({
      key: s3Key,
      filePath: outputVideoPath,
      contentType: 'video/mp4',
      metadata: {
        surah: String(surahNumber),
        ayahs: `${ayahStart}-${ayahEnd}`,
        aspectRatio,
      },
    });

    // 8. Create MediaAsset in Database & Mark Generation COMPLETED (100%)
    const mediaAsset = await db.mediaAsset.create({
      data: {
        userId,
        projectId,
        generationId,
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
        fileSize: BigInt(stats.size),
        width: dims.width,
        height: dims.height,
        storageKey: uploadResult.key,
        storageUrl: uploadResult.location,
      },
    });

    await db.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        currentStep: 'DONE',
        completedAt: new Date(),
        result: {
          assetId: mediaAsset.id,
          storageUrl: uploadResult.location,
          aspectRatio,
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
    // Cleanup temporary files
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (cleanupErr) {
      logger.warn({ cleanupErr, tempDir }, 'Failed to clean up temporary generation folder');
    }
  }
}
