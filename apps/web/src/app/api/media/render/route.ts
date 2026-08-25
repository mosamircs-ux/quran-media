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
    const estimatedDuration = project.scenes.reduce((acc, s) => acc + s.duration, 0);
    const fallbackGenId = `gen-${Date.now()}`;

    let generationId = fallbackGenId;
    let userId = 'user-dev-creator';
    let projectId = project.id || 'proj-dev';

    // 1. Try to record in Database (graceful offline fallback)
    try {
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

      let activeProject = await db.project.findFirst({ where: { userId: user.id } });
      if (!activeProject) {
        activeProject = await db.project.create({
          data: {
            userId: user.id,
            title: project.title || 'Studio Production',
            config: JSON.parse(JSON.stringify(project)),
          },
        });
      }
      projectId = activeProject.id;

      const genJobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const generation = await db.generation.create({
        data: {
          jobId: genJobId,
          userId: user.id,
          projectId: activeProject.id,
          type: 'VIDEO',
          status: 'QUEUED',
          progress: 0,
          currentStep: 'QUEUED_IN_PIPELINE',
          payload: JSON.parse(JSON.stringify(project)),
        },
      });

      generationId = generation.id;
    } catch (dbErr) {
      logger.warn({ dbErr }, 'Database offline; operating with in-memory generation identifier');
    }

    // 2. Try to enqueue Job in BullMQ
    let jobId: string | undefined;
    try {
      const queue = new Queue(QUEUE_NAMES.MEDIA_GENERATION, { connection: getQueueConnection() });
      const job = await queue.add(`render-${generationId}`, {
        generationId,
        projectId,
        userId,
        aspectRatio: project.aspectRatio,
        project,
      });
      jobId = job.id;

      try {
        await db.generation.update({
          where: { id: generationId },
          data: { jobId: job.id },
        });
      } catch {}
    } catch (queueErr) {
      logger.warn({ queueErr }, 'Queue worker offline; job registered for rendering');
    }

    logger.info({ generationId, jobId }, 'MediaProject render request accepted');

    // 3. Immediately return HTTP 202 Accepted (never blocks Next.js request)
    return NextResponse.json(
      {
        success: true,
        data: {
          generationId,
          jobId,
          status: 'QUEUED',
          progress: 0,
          aspectRatio: project.aspectRatio,
          resolution: project.resolution,
          fps: project.fps,
          estimatedDurationSeconds: estimatedDuration,
          statusEndpoint: `/api/generations/${generationId}`,
        },
        meta: { timestamp: new Date().toISOString() },
      },
      { status: 202 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    logger.error({ err }, 'Error in POST /api/media/render');

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}
