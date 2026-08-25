import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_GENERATION_JOBS: any[] | undefined;
}

if (!global.__ADMIN_GENERATION_JOBS) {
  global.__ADMIN_GENERATION_JOBS = [
    {
      id: 'job-9801',
      jobId: 'bull_media_gen_9801',
      type: 'VIDEO',
      status: 'COMPLETED',
      progress: 100,
      currentStep: 'COMPLETED',
      userEmail: 'creator@quranmedia.studio',
      projectTitle: 'آية الكرسي — تلاوة مرئية خاشعة',
      durationSeconds: 24,
      aspectRatio: '9:16',
      resolution: '1080p',
      renderTimeMs: 4200,
      attempts: 1,
      maxAttempts: 3,
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: 'job-9802',
      jobId: 'bull_media_gen_9802',
      type: 'VIDEO',
      status: 'RENDERING',
      progress: 68,
      currentStep: 'RENDERING_FFMPEG_SUBTITLES',
      userEmail: 'ahmed.k@media.co',
      projectTitle: 'سورة الضحى — شروق الأمل',
      durationSeconds: 45,
      aspectRatio: '16:9',
      resolution: '1080p',
      renderTimeMs: 3100,
      attempts: 1,
      maxAttempts: 3,
      createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
      id: 'job-9803',
      jobId: 'bull_media_gen_9803',
      type: 'VIDEO',
      status: 'FAILED',
      progress: 42,
      currentStep: 'AUDIO_SYNTHESIS',
      userEmail: 'sarah.m@studio.tv',
      projectTitle: 'سورة مريم — تلاوة مجودة',
      durationSeconds: 90,
      aspectRatio: '9:16',
      resolution: '4K',
      renderTimeMs: 8900,
      attempts: 3,
      maxAttempts: 3,
      error: 'AudioRendererError: Reciter audio stream timeout from CDN (HTTP 504 Gateway Timeout)',
      stackTrace: 'Error: AudioRendererError at AudioRenderer.synthesize (packages/media/src/audio/index.ts:84:15) at async MediaCompositionService.renderProject (packages/media/src/engine/composition.ts:142:9)',
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'job-9804',
      jobId: 'bull_media_gen_9804',
      type: 'STORY',
      status: 'COMPLETED',
      progress: 100,
      currentStep: 'COMPLETED',
      userEmail: 'tariq@gmail.com',
      projectTitle: 'قصة أصحاب الكهف (AI Script)',
      durationSeconds: 120,
      aspectRatio: '9:16',
      resolution: '1080p',
      renderTimeMs: 1800,
      attempts: 1,
      maxAttempts: 3,
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    },
  ];
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_JOBS');
  if ('response' in auth) return auth.response;

  const jobs = global.__ADMIN_GENERATION_JOBS || [];

  return NextResponse.json({
    success: true,
    data: {
      jobs,
      total: jobs.length,
      queueStats: {
        waiting: 2,
        active: jobs.filter((j) => j.status === 'PROCESSING' || j.status === 'RENDERING').length,
        completed: jobs.filter((j) => j.status === 'COMPLETED').length,
        failed: jobs.filter((j) => j.status === 'FAILED').length,
        delayed: 0,
      },
    },
  });
}
