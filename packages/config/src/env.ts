import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env if present
dotenv.config();

const envSchema = z.object({
  // Node Runtime
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/quran_media?schema=public'),
  DIRECT_URL: z.string().optional(),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_TLS_ENABLED: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),

  // Quran Foundation API
  QURAN_API_BASE_URL: z.string().url().default('https://api.quran.com/api/v4'),
  QURAN_OAUTH_TOKEN_URL: z
    .string()
    .url()
    .default('https://auth.quran.foundation/oauth2/token'),
  QURAN_CLIENT_ID: z.string().default('offline_quran_client'),
  QURAN_CLIENT_SECRET: z.string().default('offline_quran_secret'),
  QURAN_API_SCOPE: z.string().default('content'),

  // S3 Object Storage
  S3_ENDPOINT: z.string().url().default('http://localhost:9000'),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY: z.string().default('minioadmin'),
  S3_SECRET_KEY: z.string().default('minioadmin'),
  S3_BUCKET: z.string().default('quran-media'),
  S3_PUBLIC_DOMAIN: z.string().optional(),
  S3_FORCE_PATH_STYLE: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),

  // AI Providers
  DEFAULT_TEXT_AI_PROVIDER: z.enum(['openai', 'gemini', 'anthropic']).default('gemini'),
  DEFAULT_IMAGE_AI_PROVIDER: z
    .enum(['openai', 'replicate', 'stability', 'gemini'])
    .default('openai'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_ORG_ID: z.string().optional(),
  GOOGLE_AI_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  REPLICATE_API_TOKEN: z.string().optional(),
  STABILITY_API_KEY: z.string().optional(),

  // Auth & Security
  NEXTAUTH_SECRET: z.string().min(16).default('development-default-secret-key-32chars!'),
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),

  // Rate Limiting
  RATE_LIMIT_PUBLIC_RPM: z.coerce.number().default(60),
  RATE_LIMIT_AUTH_RPM: z.coerce.number().default(120),
  RATE_LIMIT_GEN_RPM: z.coerce.number().default(10),

  // Worker Settings
  WORKER_CONCURRENCY: z.coerce.number().default(5),
  WORKER_MAX_STALLED_COUNT: z.coerce.number().default(2),
  WORKER_HEALTH_PORT: z.coerce.number().default(3001),
  FFMPEG_PATH: z.string().optional(),
  FFPROBE_PATH: z.string().optional(),
  MEDIA_TEMP_DIR: z.string().default('./tmp/media'),

  // Logging
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  LOG_PRETTY: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.warn('⚠️ Warning: Some environment variables are using resilient defaults.');
    return envSchema.parse({});
  }

  return result.data;
}

export const env = validateEnv();

