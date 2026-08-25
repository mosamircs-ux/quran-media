import { createWorker } from './queues/queue-factory.js';
import { QUEUE_NAMES, logger } from '@quran-media/config';
import { processVideoGeneration } from './processors/media-generation.processor.js';
import { processImageGeneration } from './processors/image-generation.processor.js';
import { processStoryGeneration } from './processors/story-generation.processor.js';
import { startHealthServer } from './health.js';
import { db } from '@quran-media/database';

logger.info('🚀 Bootstrapping Quran Media Background Worker daemon...');

const videoWorker = createWorker(QUEUE_NAMES.MEDIA_GENERATION, processVideoGeneration);
const imageWorker = createWorker(QUEUE_NAMES.IMAGE_GENERATION, processImageGeneration);
const storyWorker = createWorker(QUEUE_NAMES.STORY_GENERATION, processStoryGeneration);

const healthServer = startHealthServer();

async function shutdown(signal: string) {
  logger.info({ signal }, 'Shutting down worker process gracefully...');

  // Set 15s hard timeout safeguard
  const forceExitTimeout = setTimeout(() => {
    logger.error('Graceful shutdown timed out after 15s. Forcing exit.');
    process.exit(1);
  }, 15000);
  forceExitTimeout.unref();

  try {
    healthServer.close();

    // 1. Pause workers to stop accepting new jobs
    await Promise.allSettled([
      videoWorker.pause(true),
      imageWorker.pause(true),
      storyWorker.pause(true),
    ]);

    // 2. Close workers and wait for current in-flight renders
    await Promise.allSettled([
      videoWorker.close(),
      imageWorker.close(),
      storyWorker.close(),
    ]);

    // 3. Disconnect database client
    await db.$disconnect();
    logger.info('Worker shut down cleanly. Exiting.');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Error during worker graceful shutdown');
    process.exit(1);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
