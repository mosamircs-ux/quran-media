import { Queue, Worker, type Processor, type WorkerOptions, type JobsOptions } from 'bullmq';
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
      logger.error({ err }, 'Redis connection error in worker queue');
    });

    redisConnection.on('connect', () => {
      logger.info('Connected to Redis server in worker queue');
    });
  }
  return redisConnection;
}

/**
 * Standard Production Resiliency Job Options
 */
export const DEFAULT_RESILIENT_JOB_OPTIONS: JobsOptions = {
  attempts: 3, // Retry up to 3 times
  backoff: {
    type: 'exponential',
    delay: 2000, // 2s -> 4s -> 8s
  },
  removeOnComplete: {
    count: 1000, // Keep last 1,000 completed jobs for telemetry
    age: 86400 * 7, // 7 days retention
  },
  removeOnFail: false, // Retain failed jobs for dead-letter inspection & retry
};

// Dead Letter Queue for failed unrecoverable jobs
let dlqQueue: Queue | null = null;

export function getDeadLetterQueue(): Queue {
  if (!dlqQueue) {
    const connection = getRedisConnection();
    dlqQueue = new Queue('media-generation-dlq', { connection });
  }
  return dlqQueue;
}

export function createWorker<T>(
  queueName: string,
  processor: Processor<T>,
  opts?: Partial<WorkerOptions>
): Worker<T> {
  const connection = getRedisConnection();
  const worker = new Worker<T>(queueName, processor, {
    connection,
    concurrency: env.WORKER_CONCURRENCY || 4,
    limiter: {
      max: 10,
      duration: 1000,
    },
    ...opts,
  });

  worker.on('completed', (job) => {
    logger.info({ queueName, jobId: job.id, durationMs: Date.now() - job.timestamp }, 'Job completed successfully');
  });

  worker.on('failed', async (job, err) => {
    logger.error(
      {
        queueName,
        jobId: job?.id,
        attemptsMade: job?.attemptsMade,
        err: err.message,
        stack: err.stack,
      },
      'Worker job failed'
    );

    // If max attempts exhausted, route to Dead Letter Queue
    if (job && job.attemptsMade >= (job.opts.attempts || 3)) {
      try {
        const dlq = getDeadLetterQueue();
        await dlq.add(`dlq-${job.id}`, {
          originalQueue: queueName,
          originalJobId: job.id,
          data: job.data,
          failedReason: err.message,
          stackTrace: err.stack,
          exhaustedAt: new Date().toISOString(),
        });
        logger.warn({ jobId: job.id }, 'Job routed to Dead Letter Queue (media-generation-dlq)');
      } catch (dlqErr) {
        logger.error({ dlqErr }, 'Failed to route to Dead Letter Queue');
      }
    }
  });

  return worker;
}

export function createQueue<T>(queueName: string): Queue<T> {
  const connection = getRedisConnection();
  return new Queue<T>(queueName, {
    connection,
    defaultJobOptions: DEFAULT_RESILIENT_JOB_OPTIONS,
  });
}
