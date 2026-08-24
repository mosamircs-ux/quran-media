import { NextResponse, type NextRequest } from 'next/server';
import { MediaProjectSchema } from '@quran-media/media';
import { db } from '@quran-media/database';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { env, QUEUE_NAMES, logger } from '@quran-media/config';

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
    const parsed = MediaProjectSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid MediaProject schema',
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const project = parsed.data;

    // Get or create a default user & project session
    let user = await db.user.findFirst();
    if (!user) {
      user = await db.user.create({
        data: {
          email: 'creator@quran-media.internal',
          name: 'Quran Media Studio',
          locale: 'ar',
        },
      });
    }

    let activeProject = await db.project.findFirst({ where: { userId: user.id } });
    if (!activeProject) {
      activeProject = await db.project.create({
        data: {
          userId: user.id,
          title: project.title || 'Studio Production',
          locale: 'ar',
        },
      });
    }

    const firstVerse = project.scenes[0]?.verse;

    // 1. Create DB Generation record (Status: QUEUED, Progress: 0%)
    const generation = await db.generation.create({
      data: {
        userId: user.id,
        projectId: activeProject.id,
        type: 'VIDEO',
        status: 'QUEUED',
        progress: 0,
        currentStep: 'QUEUED_IN_PIPELINE',
        surahNumber: firstVerse?.surahNumber || 1,
        ayahStart: firstVerse?.ayahNumber || 1,
        ayahEnd: project.scenes[project.scenes.length - 1]?.verse?.ayahNumber || firstVerse?.ayahNumber || 1,
        aspectRatio:
          project.aspectRatio === '9:16'
            ? 'RATIO_9_16'
            : project.aspectRatio === '16:9'
              ? 'RATIO_16_9'
              : project.aspectRatio === '1:1'
                ? 'RATIO_1_1'
                : 'RATIO_4_5',
        config: JSON.parse(JSON.stringify(project)),
      },
    });

    // 2. Enqueue Job to BullMQ asynchronously (Never blocks HTTP response)
    try {
      const queue = new Queue(QUEUE_NAMES.MEDIA_GENERATION, { connection: getQueueConnection() });
      const job = await queue.add(`render-${generation.id}`, {
        generationId: generation.id,
        projectId: activeProject.id,
        userId: user.id,
        aspectRatio: project.aspectRatio,
        project,
      });

      await db.generation.update({
        where: { id: generation.id },
        data: { jobId: job.id },
      });

      logger.info({ generationId: generation.id, jobId: job.id }, 'Enqueued MediaProject render job');

      return NextResponse.json(
        {
          success: true,
          data: {
            generationId: generation.id,
            jobId: job.id,
            status: 'QUEUED',
            progress: 0,
            aspectRatio: project.aspectRatio,
            resolution: project.resolution,
            estimatedDurationSeconds: project.scenes.reduce((acc, s) => acc + s.duration, 0),
            statusEndpoint: `/api/generations/${generation.id}`,
          },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 202 }
      );
    } catch (queueErr) {
      logger.warn({ queueErr }, 'Redis queue unavailable; generation registered in database');

      return NextResponse.json(
        {
          success: true,
          data: {
            generationId: generation.id,
            status: 'QUEUED',
            progress: 0,
            aspectRatio: project.aspectRatio,
            resolution: project.resolution,
            statusEndpoint: `/api/generations/${generation.id}`,
          },
          meta: { timestamp: new Date().toISOString() },
        },
        { status: 202 }
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    logger.error({ err }, 'Error in POST /api/media/render');

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}
