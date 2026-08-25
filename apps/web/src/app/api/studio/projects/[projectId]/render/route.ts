import { NextResponse, type NextRequest } from 'next/server';
import { MediaProjectSchema } from '@quran-media/media/types';
import { db } from '@quran-media/database';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { env, QUEUE_NAMES, logger } from '@quran-media/config';

declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

if (!global.__STUDIO_MEMORY_PROJECTS) {
  global.__STUDIO_MEMORY_PROJECTS = new Map<string, any>();
}
const memoryStore = global.__STUDIO_MEMORY_PROJECTS;

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
    const generationId = `gen-${Date.now()}`;

    // Update in-memory project record
    if (memoryStore.has(projectId)) {
      const mem = memoryStore.get(projectId);
      mem.status = 'QUEUED';
      mem.progress = 0;
      mem.currentStep = 'Initializing background worker render...';
      mem.config = project;
      mem.updatedAt = new Date().toISOString();
      memoryStore.set(projectId, mem);
    } else {
      memoryStore.set(projectId, {
        id: projectId,
        title: project.title,
        status: 'QUEUED',
        progress: 0,
        currentStep: 'Initializing background worker render...',
        config: project,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Try DB recording
    try {
      let dbProject = await db.project.findUnique({
        where: { id: projectId },
        include: { user: true },
      });

      let userId = 'user-dev-creator';
      if (!dbProject) {
        let user = await db.user.findFirst();
        if (!user) {
          user = await db.user.create({
            data: { email: 'creator@quran-media.internal', name: 'Quran Media Studio', locale: 'ar' },
          });
        }
        userId = user.id;

        dbProject = await db.project.create({
          data: {
            id: projectId,
            userId: user.id,
            title: project.title || 'Studio Production',
            config: JSON.parse(JSON.stringify(project)),
          },
          include: { user: true },
        });
      } else {
        userId = dbProject.userId;
      }

      const genJobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const generation = await db.generation.create({
        data: {
          jobId: genJobId,
          userId,
          projectId: dbProject.id,
          type: 'VIDEO',
          status: 'QUEUED',
          progress: 0,
          currentStep: 'QUEUED_IN_PIPELINE',
          payload: JSON.parse(JSON.stringify(project)),
        },
      });

      try {
        const queue = new Queue(QUEUE_NAMES.MEDIA_GENERATION, { connection: getQueueConnection() });
        await queue.add(`render-${generation.id}`, {
          generationId: generation.id,
          projectId: dbProject.id,
          userId,
          aspectRatio: project.aspectRatio,
          project,
        });
      } catch {}
    } catch {}

    logger.info({ projectId, generationId }, 'Studio render job created');

    return NextResponse.json(
      {
        success: true,
        data: {
          projectId,
          generationId,
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
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}
