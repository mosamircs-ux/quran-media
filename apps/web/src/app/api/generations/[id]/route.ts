import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@quran-media/database';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const generation = await db.generation.findUnique({
    where: { id },
  });

  if (!generation) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: `Generation with ID ${id} not found` } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: generation.id,
      status: generation.status,
      progress: generation.progress,
      currentStep: generation.currentStep,
      result: generation.result,
      error: generation.error,
      createdAt: generation.createdAt,
      completedAt: generation.completedAt,
    },
    meta: { timestamp: new Date().toISOString() },
  });
}
