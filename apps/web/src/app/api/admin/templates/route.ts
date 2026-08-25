import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';
import { QURAN_MEDIA_TEMPLATES } from '@quran-media/media/templates';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_TEMPLATES_STORE: any[] | undefined;
}

if (!global.__ADMIN_TEMPLATES_STORE) {
  global.__ADMIN_TEMPLATES_STORE = QURAN_MEDIA_TEMPLATES.map((t) => ({
    ...t,
    isActive: true,
    usageCount: Math.floor(Math.random() * 450) + 50,
  }));
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_TEMPLATES');
  if ('response' in auth) return auth.response;

  const templates = global.__ADMIN_TEMPLATES_STORE || [];

  return NextResponse.json({
    success: true,
    data: {
      templates,
      total: templates.length,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_TEMPLATES');
  if ('response' in auth) return auth.response;

  const { templateId, isActive, nameAr, nameEn, fonts, colors } = await request.json();
  const templates = global.__ADMIN_TEMPLATES_STORE || [];
  const tpl = templates.find((t) => t.template_id === templateId);

  if (tpl) {
    if (typeof isActive === 'boolean') tpl.isActive = isActive;
    if (nameAr) tpl.name.ar = nameAr;
    if (nameEn) tpl.name.en = nameEn;
    if (fonts) tpl.fonts = { ...tpl.fonts, ...fonts };
    if (colors) tpl.colors = { ...tpl.colors, ...colors };
  }

  return NextResponse.json({
    success: true,
    data: { template: tpl },
  });
}
