import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@quran-media/database';
import { logger } from '@quran-media/config';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        generations: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            mediaAssets: true,
          },
        },
        mediaAssets: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

    const latestGeneration = project.generations[0];
    const latestAsset = latestGeneration?.mediaAssets[0] || project.mediaAssets[0];

    return NextResponse.json({
      success: true,
      data: {
        project: {
          id: project.id,
          title: project.title,
          description: project.description,
          locale: project.locale,
          status: latestGeneration?.status || project.status,
          progress: latestGeneration?.progress ?? 0,
          currentStep: latestGeneration?.currentStep || undefined,
          error: latestGeneration?.error || undefined,
          createdAt: project.createdAt.toISOString(),
          updatedAt: project.updatedAt.toISOString(),
          config: latestGeneration?.config || null,
          activeGenerationId: latestGeneration?.id,
        },
        assets: {
          videoUrl: latestAsset?.storageUrl || (latestGeneration?.result as any)?.storageUrl || null,
          webmUrl: (latestAsset?.metadata as any)?.webmUrl || (latestGeneration?.result as any)?.webmUrl || null,
          thumbnailUrl: latestAsset?.thumbnailUrl || (latestGeneration?.result as any)?.thumbnailUrl || null,
          previewUrl: (latestAsset?.metadata as any)?.previewUrl || (latestGeneration?.result as any)?.previewUrl || null,
          duration: latestAsset?.duration || 15,
        },
        history: project.generations.map((g) => ({
          id: g.id,
          status: g.status,
          progress: g.progress,
          createdAt: g.createdAt.toISOString(),
          completedAt: g.completedAt?.toISOString(),
          error: g.error,
        })),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error fetching project details';
    logger.error({ err }, 'Error in GET /api/studio/projects/[projectId]');
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const body = await request.json();

    const existingProject = await db.project.findUnique({
      where: { id: projectId },
      include: {
        generations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

    // Update project metadata
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        ...(body.title ? { title: body.title } : {}),
        ...(body.description !== undefined ? { description: body.description } : {}),
      },
    });

    // If config or scenes updated, update latest generation config
    const latestGen = existingProject.generations[0];
    if (latestGen && body.config) {
      await db.generation.update({
        where: { id: latestGen.id },
        data: {
          config: JSON.parse(JSON.stringify(body.config)),
          aspectRatio:
            body.config.aspectRatio === '9:16'
              ? 'RATIO_9_16'
              : body.config.aspectRatio === '16:9'
                ? 'RATIO_16_9'
                : body.config.aspectRatio === '1:1'
                  ? 'RATIO_1_1'
                  : 'RATIO_4_5',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        projectId: updatedProject.id,
        title: updatedProject.title,
        updatedAt: updatedProject.updatedAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating project';
    logger.error({ err }, 'Error in PATCH /api/studio/projects/[projectId]');
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    await db.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({
      success: true,
      data: { message: 'Project deleted successfully' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error deleting project';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}
