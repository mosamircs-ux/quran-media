import { NextResponse, type NextRequest } from 'next/server';
import { MediaProjectSchema } from '@quran-media/media/types';
import { db } from '@quran-media/database';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { env, QUEUE_NAMES, logger } from '@quran-media/config';

let queueConnection: Redis | null = null;
function getQueueConnection() {
  if (!queueConnection) {
    queueConnection = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 800,
      lazyConnect: true,
      enableOfflineQueue: false,
    });
  }
  return queueConnection;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const json = await request.json();

    const parsed = MediaProjectSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid MediaProject configuration',
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const project = parsed.data;

    let dbProject = await db.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    let userId = 'user-dev-creator';
    if (!dbProject) {
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
      userId = user.id;

      dbProject = await db.project.create({
        data: {
          id: projectId,
          userId: user.id,
          title: project.title || 'Studio Production',
          locale: 'ar',
        },
        include: { user: true },
      });
    } else {
      userId = dbProject.userId;
    }

    const firstVerse = project.scenes[0]?.verse;

    // Create a new active Generation record (QUEUED, 0%)
    const generation = await db.generation.create({
      data: {
        userId,
        projectId: dbProject.id,
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

    // Enqueue to BullMQ
    let jobId: string | undefined;
    try {
      const queue = new Queue(QUEUE_NAMES.MEDIA_GENERATION, { connection: getQueueConnection() });
      const job = await queue.add(`render-${generation.id}`, {
        generationId: generation.id,
        projectId: dbProject.id,
        userId,
        aspectRatio: project.aspectRatio,
        project,
      });
      jobId = job.id;

      await db.generation.update({
        where: { id: generation.id },
        data: { jobId: job.id },
      });
    } catch (qErr) {
      logger.warn({ qErr }, 'Queue worker offline; job registered for rendering');
    }

    logger.info({ projectId, generationId: generation.id }, 'Studio render job created');

    return NextResponse.json(
      {
        success: true,
        data: {
          projectId,
          generationId: generation.id,
          jobId,
          status: 'QUEUED',
          progress: 0,
          eventsEndpoint: `/api/studio/projects/${projectId}/events`,
        },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to launch render';
    logger.error({ err }, 'Error in POST /api/studio/projects/[projectId]/render');
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}
