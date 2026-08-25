import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_RECITERS_STORE: any[] | undefined;
}

if (!global.__ADMIN_RECITERS_STORE) {
  global.__ADMIN_RECITERS_STORE = [
    { id: 7, nameAr: 'مشاري راشد العفاسي', nameEn: 'Mishari Rashid Alafasy', style: 'Murattal', format: 'mp3', bitrate: 128, isDefault: true, isActive: true, streamHealth: '100% ONLINE' },
    { id: 2, nameAr: 'عبد الباسط عبد الصمد', nameEn: 'AbdulBaset AbdulSamad', style: 'Murattal', format: 'mp3', bitrate: 192, isDefault: false, isActive: true, streamHealth: '100% ONLINE' },
    { id: 3, nameAr: 'عبد الرحمن السديس', nameEn: 'Abdur-Rahman As-Sudais', style: 'Murattal', format: 'mp3', bitrate: 128, isDefault: false, isActive: true, streamHealth: '99.9% ONLINE' },
    { id: 4, nameAr: 'أبو بكر الشاطري', nameEn: 'Abu Bakr Al-Shatri', style: 'Murattal', format: 'mp3', bitrate: 128, isDefault: false, isActive: true, streamHealth: '100% ONLINE' },
    { id: 6, nameAr: 'محمود خليل الحصري', nameEn: 'Mahmoud Khalil Al-Husary', style: 'Murattal', format: 'mp3', bitrate: 128, isDefault: false, isActive: true, streamHealth: '100% ONLINE' },
    { id: 10, nameAr: 'سعود الشريم', nameEn: 'Saud Al-Shuraim', style: 'Murattal', format: 'mp3', bitrate: 128, isDefault: false, isActive: true, streamHealth: '100% ONLINE' },
  ];
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_QURAN_RESOURCES');
  if ('response' in auth) return auth.response;

  return NextResponse.json({
    success: true,
    data: {
      reciters: global.__ADMIN_RECITERS_STORE,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_QURAN_RESOURCES');
  if ('response' in auth) return auth.response;

  const { id, isDefault, isActive } = await request.json();
  const list = global.__ADMIN_RECITERS_STORE || [];
  const reciter = list.find((r) => r.id === id);

  if (reciter) {
    if (typeof isDefault === 'boolean') {
      list.forEach((r) => (r.isDefault = false));
      reciter.isDefault = isDefault;
    }
    if (typeof isActive === 'boolean') reciter.isActive = isActive;
  }

  return NextResponse.json({ success: true, data: { reciter } });
}
