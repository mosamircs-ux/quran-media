import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@quran-media/database';
import { generatePresignedDownloadUrl } from '@quran-media/media';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const asset = await db.mediaAsset.findUnique({
    where: { id },
  });

  if (!asset) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: `Media asset with ID ${id} not found` } },
      { status: 404 }
    );
  }

  let downloadUrl = asset.storageUrl;
  try {
    downloadUrl = await generatePresignedDownloadUrl(asset.storageKey, 3600);
  } catch {
    // fallback to static storage URL if S3 presigned generation is in local dev mode
  }

  return NextResponse.json({
    success: true,
    data: {
      id: asset.id,
      type: asset.type,
      aspectRatio: asset.aspectRatio,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize.toString(),
      width: asset.width,
      height: asset.height,
      duration: asset.duration,
      storageUrl: asset.storageUrl,
      downloadUrl,
      createdAt: asset.createdAt,
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
