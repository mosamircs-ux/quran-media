import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_AI_PROVIDERS: any[] | undefined;
}

if (!global.__ADMIN_AI_PROVIDERS) {
  global.__ADMIN_AI_PROVIDERS = [
    {
      id: 'openai',
      name: 'OpenAI',
      models: ['gpt-4o', 'gpt-4o-mini', 'dall-e-3'],
      status: 'OPERATIONAL',
      isEnabled: true,
      latencyMs: 340,
      uptimePercent: 99.98,
      requests24h: 18450,
      cost24hUsd: 14.8,
      costPer1MInput: 2.5,
      costPer1MOutput: 10.0,
      guardrailAccuracy: '99.9%',
    },
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku'],
      status: 'OPERATIONAL',
      isEnabled: true,
      latencyMs: 410,
      uptimePercent: 99.95,
      requests24h: 12200,
      cost24hUsd: 11.2,
      costPer1MInput: 3.0,
      costPer1MOutput: 15.0,
      guardrailAccuracy: '100%',
    },
    {
      id: 'google',
      name: 'Google Gemini',
      models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'imagen-3'],
      status: 'OPERATIONAL',
      isEnabled: true,
      latencyMs: 290,
      uptimePercent: 99.99,
      requests24h: 24500,
      cost24hUsd: 8.5,
      costPer1MInput: 1.25,
      costPer1MOutput: 5.0,
      guardrailAccuracy: '99.8%',
    },
    {
      id: 'groq',
      name: 'Groq Cloud (Fast Inference)',
      models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768'],
      status: 'OPERATIONAL',
      isEnabled: true,
      latencyMs: 95,
      uptimePercent: 99.92,
      requests24h: 8900,
      cost24hUsd: 2.1,
      costPer1MInput: 0.59,
      costPer1MOutput: 0.79,
      guardrailAccuracy: '99.4%',
    },
    {
      id: 'ollama',
      name: 'Ollama (Local Private Cluster)',
      models: ['llama3.2', 'qwen2.5-coder'],
      status: 'STANDBY',
      isEnabled: false,
      latencyMs: 650,
      uptimePercent: 100.0,
      requests24h: 0,
      cost24hUsd: 0.0,
      costPer1MInput: 0.0,
      costPer1MOutput: 0.0,
      guardrailAccuracy: '99.0%',
    },
  ];
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_AI_PROVIDERS');
  if ('response' in auth) return auth.response;

  return NextResponse.json({
    success: true,
    data: {
      providers: global.__ADMIN_AI_PROVIDERS,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_AI_PROVIDERS');
  if ('response' in auth) return auth.response;

  const { providerId, isEnabled } = await request.json();
  const providers = global.__ADMIN_AI_PROVIDERS || [];
  const p = providers.find((item) => item.id === providerId);

  if (p && typeof isEnabled === 'boolean') {
    p.isEnabled = isEnabled;
  }

  return NextResponse.json({ success: true, data: { provider: p } });
}
