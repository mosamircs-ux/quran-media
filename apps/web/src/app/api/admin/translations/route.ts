import { NextResponse, type NextRequest } from 'next/server';
import { requireAdminAuth } from '@/lib/auth/admin-auth';

declare global {
  // eslint-disable-next-line no-var
  var __ADMIN_TRANSLATIONS_STORE: any[] | undefined;
}

if (!global.__ADMIN_TRANSLATIONS_STORE) {
  global.__ADMIN_TRANSLATIONS_STORE = [
    { id: 'trans-en-saheeh', language: 'en', languageName: 'English', author: 'Saheeh International', isVerified: true, isDefault: true, versesCovered: 6236 },
    { id: 'trans-en-khattab', language: 'en', languageName: 'English', author: 'Dr. Mustafa Khattab (The Clear Quran)', isVerified: true, isDefault: false, versesCovered: 6236 },
    { id: 'trans-ur-jalandhry', language: 'ur', languageName: 'Urdu (اردو)', author: 'Fateh Muhammad Jalandhry', isVerified: true, isDefault: true, versesCovered: 6236 },
    { id: 'trans-fr-hamidullah', language: 'fr', languageName: 'French (Français)', author: 'Muhammad Hamidullah', isVerified: true, isDefault: true, versesCovered: 6236 },
    { id: 'trans-id-kemenag', language: 'id', languageName: 'Indonesian (Bahasa)', author: 'Kementerian Agama RI', isVerified: true, isDefault: true, versesCovered: 6236 },
  ];
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_QURAN_RESOURCES');
  if ('response' in auth) return auth.response;

  return NextResponse.json({
    success: true,
    data: {
      translations: global.__ADMIN_TRANSLATIONS_STORE,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdminAuth(request, 'MANAGE_QURAN_RESOURCES');
  if ('response' in auth) return auth.response;

  const { id, isVerified, isDefault } = await request.json();
  const list = global.__ADMIN_TRANSLATIONS_STORE || [];
  const item = list.find((t) => t.id === id);

  if (item) {
    if (typeof isVerified === 'boolean') item.isVerified = isVerified;
    if (typeof isDefault === 'boolean') item.isDefault = isDefault;
  }

  return NextResponse.json({ success: true, data: { translation: item } });
}
