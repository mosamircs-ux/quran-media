import { PrismaClient } from './generated/client/index.js';
import { env, logger } from '@quran-media/config';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export function createPrismaClient(): PrismaClient {
  const client =
    globalThis.prismaGlobal ??
    new PrismaClient({
      log:
        env.NODE_ENV === 'development'
          ? [
              { emit: 'event', level: 'query' },
              { emit: 'stdout', level: 'error' },
              { emit: 'stdout', level: 'warn' },
            ]
          : [{ emit: 'stdout', level: 'error' }],
    });

  if (env.NODE_ENV === 'development') {
    // @ts-expect-error Prisma event typing
    client.$on('query', (e: { query: string; duration: number }) => {
      if (e.duration > 200) {
        logger.warn({ query: e.query, durationMs: e.duration }, 'Slow database query detected');
      }
    });
  }

  if (env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = client;
  }

  return client;
}

export const db = createPrismaClient();
export { PrismaClient };
