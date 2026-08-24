import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@quran-media/database';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { env, QUEUE_NAMES, logger } from '@quran-media/config';

const createGenerationSchema = z.object({
  projectId: z.string().optional(),
  type: z.enum(['VIDEO', 'IMAGE', 'STORY', 'TEXT']).default('VIDEO'),
  surahNumber: z.number().int().min(1).max(114).optional().default(1),
  ayahStart: z.number().int().min(1).optional().default(1),
  ayahEnd: z.number().int().min(1).optional().default(1),
  aspectRatio: z.enum(['9:16', '16:9', '1:1', '4:5']).default('9:16'),
  reciterId: z.number().int().default(7),
  stylePreset: z.string().default('cinematic_nature'),
  customPrompt: z.string().optional(),
  aiProvider: z.string().optional(),
  locale: z.enum(['ar', 'en']).default('ar'),
  project: z.record(z.unknown()).optional(),
});

let queueConnection: Redis | null = null;
function getQueueConnection() {
  if (!queueConnection) {
    queueConnection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null, lazyConnect: true });
  }
  return queueConnection;
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = createGenerationSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid generation parameters',
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const {
      projectId,
      type,
      surahNumber,
      ayahStart,
      ayahEnd,
      aspectRatio,
      reciterId,
      stylePreset,
      customPrompt,
      aiProvider,
      locale,
    } = parsed.data;

    // Get or create a default user & project for current session
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: {
          email: 'demo@quran-media.internal',
          name: 'Demo Creator',
          locale,
        },
      });
    }

    let activeProject = projectId ? await db.project.findUnique({ where: { id: projectId } }) : null;
    if (!activeProject) {
      activeProject = await db.project.create({
        data: {
          userId: user.id,
          title: `Surah ${surahNumber} Studio Project`,
          locale,
        },
      });
    }

    // 1. Create Generation record in DB
    const generation = await db.generation.create({
      data: {
        userId: user.id,
        projectId: activeProject.id,
        type,
        status: 'PENDING',
        surahNumber,
        ayahStart,
        ayahEnd,
        reciterId,
        stylePreset,
        customPrompt,
        aiProvider,
        aspectRatio:
          aspectRatio === '9:16'
            ? 'RATIO_9_16'
            : aspectRatio === '16:9'
              ? 'RATIO_16_9'
              : aspectRatio === '1:1'
                ? 'RATIO_1_1'
                : 'RATIO_4_5',
        config: JSON.parse(JSON.stringify(parsed.data)),
      },
    });

    // 2. Enqueue Job to BullMQ
    const queueName =
      type === 'VIDEO'
        ? QUEUE_NAMES.MEDIA_GENERATION
        : type === 'IMAGE'
          ? QUEUE_NAMES.IMAGE_GENERATION
          : QUEUE_NAMES.STORY_GENERATION;

    const queue = new Queue(queueName, { connection: getQueueConnection() });

    const job = await queue.add(`gen-${generation.id}`, {
      generationId: generation.id,
      projectId: activeProject.id,
      userId: user.id,
      surahNumber,
      ayahStart,
      ayahEnd,
      aspectRatio,
      reciterId,
      stylePreset,
      customPrompt,
      aiProvider,
      locale,
    });

    await db.generation.update({
      where: { id: generation.id },
      data: { jobId: job.id, status: 'QUEUED' },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          generationId: generation.id,
          jobId: job.id,
          status: 'QUEUED',
        },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    logger.error({ err }, 'Error in POST /api/generations');

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}
