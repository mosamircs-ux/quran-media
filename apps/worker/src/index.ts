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

  healthServer.close();

  await Promise.all([
    videoWorker.close(),
    imageWorker.close(),
    storyWorker.close(),
  ]);

  await db.$disconnect();
  logger.info('Worker shut down cleanly. Exiting.');
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
