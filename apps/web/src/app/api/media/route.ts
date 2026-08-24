import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@quran-media/database';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get('projectId');
  const type = searchParams.get('type') as 'IMAGE' | 'VIDEO' | 'AUDIO' | null;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Math.min(50, Number(searchParams.get('limit')) || 20);

  const where = {
    ...(projectId ? { projectId } : {}),
    ...(type ? { type } : {}),
  };

  const [total, assets] = await Promise.all([
    db.mediaAsset.count({ where }),
    db.mediaAsset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      assets: (assets as any[])?.map((a: any) => ({
        id: a.id,
        type: a.type,
        aspectRatio: a.aspectRatio,
        storageUrl: a.storageUrl,
        fileSize: a.fileSize.toString(),
        width: a.width,
        height: a.height,
        duration: a.duration,
        createdAt: a.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
