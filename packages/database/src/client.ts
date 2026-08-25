import { PrismaClient } from '@prisma/client';
import { env, logger } from '@quran-media/config';

export type EnhancedPrismaClient = PrismaClient & {
  project: PrismaClient['mediaProject'];
  generation: PrismaClient['mediaGenerationJob'];
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: EnhancedPrismaClient | undefined;
}

export function createPrismaClient(): EnhancedPrismaClient {
  const baseClient =
    (globalThis.prismaGlobal as unknown as PrismaClient) ??
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
    baseClient.$on('query', (e: { query: string; duration: number }) => {
      if (e.duration > 200) {
        logger.warn({ query: e.query, durationMs: e.duration }, 'Slow database query detected');
      }
    });
  }

  const client = new Proxy(baseClient, {
    get(target, prop, receiver) {
      if (prop === 'project') return (target as any).mediaProject;
      if (prop === 'generation') return (target as any).mediaGenerationJob;
      return Reflect.get(target, prop, receiver);
    },
  }) as EnhancedPrismaClient;

  if (env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = client;
  }

  return client;
}

export const db = createPrismaClient();
export { PrismaClient };

