import type { Job } from 'bullmq';
import type { StoryGenerationJobData } from '../queues/definitions.js';
import { db } from '@quran-media/database';
import { quranChapterService, quranVerseService } from '@quran-media/quran';
import { aiRegistry } from '@quran-media/ai';
import { logger } from '@quran-media/config';

export async function processStoryGeneration(job: Job<StoryGenerationJobData>): Promise<void> {
  const { generationId, surahNumber, ayahStart, ayahEnd, locale = 'ar', aiProvider } = job.data;

  try {
    await db.generation.update({
      where: { id: generationId },
      data: { status: 'PROCESSING', progress: 30, startedAt: new Date() },
    });

    const chapter = await quranChapterService.getChapterById(surahNumber, locale);
    const verses = await quranVerseService.getVersesByChapter({
      surahId: surahNumber,
      fromVerse: ayahStart,
      toVerse: ayahEnd,
      locale,
    });

    const arabicText = verses.map((v) => v.textUthmani || v.textSimple).join(' ');
    const translationText = verses.map((v) => v.translations?.[0]?.text || '').join(' ');

    const storyProvider = aiRegistry.getPreferredProvider('story', aiProvider);
    if (!storyProvider.generateQuranStory) {
      throw new Error('Selected provider does not support Quran story generation');
    }

    const story = await storyProvider.generateQuranStory({
      surahNameAr: chapter.nameArabic,
      surahNameEn: chapter.nameSimple,
      surahNumber,
      ayahStart,
      ayahEnd,
      arabicText,
      translationText,
      locale,
    });

    await db.generation.update({
      where: { id: generationId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
        result: JSON.parse(JSON.stringify(story)),
      },
    });

    logger.info({ generationId }, 'Story generation completed successfully');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await db.generation.update({
      where: { id: generationId },
      data: { status: 'FAILED', error: errorMsg },
    });
    throw err;
  }
}
