import pino from 'pino';
import { env } from './env.js';

const isDev = env.NODE_ENV === 'development';

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'authorization',
      'clientSecret',
      'password',
      'apiKey',
      'token',
      '*.apiKey',
      '*.clientSecret',
      '*.password',
      '*.token',
    ],
    remove: true,
  },
  transport:
    isDev && env.LOG_PRETTY
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: {
    env: env.NODE_ENV,
  },
});

export function createChildLogger(moduleName: string, extraBindings?: Record<string, unknown>) {
  return logger.child({
    module: moduleName,
    ...extraBindings,
  });
}
