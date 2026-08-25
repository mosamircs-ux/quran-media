import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_TAFSIRS_STORE: any[] | undefined;
}

if (!global.__ADMIN_TAFSIRS_STORE) {
  global.__ADMIN_TAFSIRS_STORE = [
    { slug: 'ibn-kathir', nameAr: 'تفسير ابن كثير (تفسير القرآن العظيم)', author: 'الإمام الحافظ ابن كثير', language: 'ar', status: 'VERIFIED', isDefault: true },
    { slug: 'as-sadi', nameAr: 'تيسير الكريم الرحمن في تفسير كلام المنان', author: 'الشيخ عبد الرحمن السعدي', language: 'ar', status: 'VERIFIED', isDefault: false },
    { slug: 'al-baghawi', nameAr: 'معالم التنزيل (تفسير البغوي)', author: 'الإمام البغوي', language: 'ar', status: 'VERIFIED', isDefault: false },
    { slug: 'al-muyassar', nameAr: 'التفسير الميسر', author: 'مجمع الملك فهد لطباعة المصحف الشريف', language: 'ar', status: 'VERIFIED', isDefault: false },
    { slug: 'al-qurtubi', nameAr: 'الجامع لأحكام القرآن (تفسير القرطبي)', author: 'الإمام القرطبي', language: 'ar', status: 'VERIFIED', isDefault: false },
  ];
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_QURAN_RESOURCES');
  if ('response' in auth) return auth.response;

  return NextResponse.json({
    success: true,
    data: {
      tafsirs: global.__ADMIN_TAFSIRS_STORE,
    },
  });
}
