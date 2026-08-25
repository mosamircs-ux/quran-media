import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'VIEW_FINANCIAL_REPORTS');
  if ('response' in auth) return auth.response;

  return NextResponse.json({
    success: true,
    data: {
      costSummaryMonth: {
        totalCostUsd: 218.4,
        llmInferenceUsd: 48.2,
        gpuRenderUsd: 114.5,
        s3StorageUsd: 28.7,
        cdnBandwidthUsd: 27.0,
      },
      tokenUsage: {
        totalInputTokens: 24500000,
        totalOutputTokens: 8200000,
        avgPromptTokensPerScene: 420,
      },
      storageBreakdownGb: {
        renderedMp4: 86.4,
        renderedWebm: 24.2,
        aiBackgrounds: 18.9,
        audioCdnCache: 11.2,
        thumbnails: 1.9,
        totalGb: 142.6,
      },
      renderHoursTotal: 148.5,
      apiRequestsTotal: 342000,
    },
  });
}
