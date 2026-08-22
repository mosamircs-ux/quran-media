import { Queue, Worker, type Processor, type WorkerOptions } from 'bullmq';
import { Redis } from 'ioredis';
import { env, logger } from '@quran-media/config';

let redisConnection: Redis | null = null;

export function getRedisConnection(): Redis {
  if (!redisConnection) {
    redisConnection = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      tls: env.REDIS_TLS_ENABLED ? {} : undefined,
    });

    redisConnection.on('error', (err) => {
      logger.error({ err }, 'Redis connection error');
    });

    redisConnection.on('connect', () => {
      logger.info('Connected to Redis server');
    });
  }
  return redisConnection;
}

export function createWorker<T>(
  queueName: string,
  processor: Processor<T>,
  opts?: Partial<WorkerOptions>
): Worker<T> {
  const connection = getRedisConnection();
  const worker = new Worker<T>(queueName, processor, {
    connection,
    concurrency: env.WORKER_CONCURRENCY,
    ...opts,
  });

  worker.on('completed', (job) => {
    logger.info({ queueName, jobId: job.id }, 'Job completed successfully');
  });

  worker.on('failed', (job, err) => {
    logger.error({ queueName, jobId: job?.id, err: err.message }, 'Job failed');
  });

  return worker;
}

export function createQueue<T>(queueName: string): Queue<T> {
  const connection = getRedisConnection();
  return new Queue<T>(queueName, { connection });
}
