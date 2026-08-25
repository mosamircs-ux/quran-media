import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_GENERATION_JOBS: any[] | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminAuth(request, 'RETRY_JOBS');
    if ('response' in auth) return auth.response;

    const body = await request.json();
    const jobId = body?.jobId;

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'jobId is required' }, { status: 400 });
    }

    if (!global.__ADMIN_GENERATION_JOBS) {
      global.__ADMIN_GENERATION_JOBS = [
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
          createdAt: new Date().toISOString(),
        },
      ];
    }

    const jobs = global.__ADMIN_GENERATION_JOBS;
    const job = jobs.find((j) => j.id === jobId || j.jobId === jobId);

    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    // Reset job to QUEUED
    job.status = 'QUEUED';
    job.progress = 0;
    job.currentStep = 'RETRY_QUEUED_BY_ADMIN';
    job.error = undefined;
    job.stackTrace = undefined;
    job.attempts += 1;

    return NextResponse.json({
      success: true,
      data: {
        message: `Job ${job.jobId} successfully re-queued for background worker processing`,
        job,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to retry job' },
      { status: 500 }
    );
  }
}
