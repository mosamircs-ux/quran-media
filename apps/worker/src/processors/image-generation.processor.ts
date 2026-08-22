import type { Job } from 'bullmq';
import type { ImageGenerationJobData } from '../queues/definitions.js';
import { db } from '@quran-media/database';
import { getChapterById, getVersesBySurah } from '@quran-media/quran';
import { aiRegistry, buildReverentVisualPrompt } from '@quran-media/ai';
import {
  composeQuranImage,
  uploadFileToS3,
  getDimensionsForAspectRatio,
} from '@quran-media/media';
import { logger } from '@quran-media/config';

export async function processImageGeneration(job: Job<ImageGenerationJobData>): Promise<void> {
  const {
    generationId,
    projectId,
    userId,
    surahNumber,
    ayahStart,
    ayahEnd,
    aspectRatio,
    stylePreset = 'cinematic_nature',
    customPrompt,
    aiProvider,
  } = job.data;

  try {
    await db.generation.update({
      where: { id: generationId },
      data: { status: 'PROCESSING', progress: 20, startedAt: new Date() },
    });

    const chapter = await getChapterById(surahNumber, 'ar');
    const verses = await getVersesBySurah({ surah: surahNumber, fromAyah: ayahStart, toAyah: ayahEnd });
    const fullArabicText = verses.map((v) => v.textUthmani).join(' ');

    const imageProvider = aiRegistry.getPreferredProvider('image', aiProvider);
    const visualPrompt = buildReverentVisualPrompt({
      surahName: chapter.nameSimple,
      themeDescription: customPrompt || `Artistic background for Surah ${chapter.nameSimple}`,
      stylePreset,
    });

    let rawBuffer: Buffer | undefined;
    if (imageProvider.generateImage) {
      const res = await imageProvider.generateImage(visualPrompt, { aspectRatio, style: stylePreset });
      if (res.url.startsWith('data:')) {
        rawBuffer = Buffer.from(res.url.split(',')[1] || '', 'base64');
      } else {
        rawBuffer = Buffer.from(await (await fetch(res.url)).arrayBuffer());
      }
    }

    const dims = getDimensionsForAspectRatio(aspectRatio);
    const finalBuffer = await composeQuranImage({
      width: dims.width,
      height: dims.height,
      backgroundBuffer: rawBuffer,
      aspectRatio,
      surahTitle: `سورة ${chapter.nameArabic}`,
      arabicText: fullArabicText,
    });

    const s3Key = `media/images/${userId}/${generationId}.png`;
    const upload = await uploadFileToS3({
      key: s3Key,
      buffer: finalBuffer,
      contentType: 'image/png',
    });

    const asset = await db.mediaAsset.create({
      data: {
        userId,
        projectId,
        generationId,
        type: 'IMAGE',
        aspectRatio:
          aspectRatio === '9:16'
            ? 'RATIO_9_16'
            : aspectRatio === '16:9'
              ? 'RATIO_16_9'
              : aspectRatio === '1:1'
                ? 'RATIO_1_1'
                : 'RATIO_4_5',
        mimeType: 'image/png',
        fileSize: BigInt(finalBuffer.length),
        width: dims.width,
        height: dims.height,
        storageKey: upload.key,
        storageUrl: upload.location,
      },
    });

    await db.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
        result: { assetId: asset.id, storageUrl: upload.location },
      },
    });

    logger.info({ generationId, assetId: asset.id }, 'Image generation completed');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await db.generation.update({
      where: { id: generationId },
      data: { status: 'FAILED', error: errorMsg },
    });
    throw err;
  }
}
