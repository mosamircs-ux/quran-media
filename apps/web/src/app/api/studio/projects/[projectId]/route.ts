import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@quran-media/database';
import { logger } from '@quran-media/config';

// In-memory fallback store
declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

if (!global.__STUDIO_MEMORY_PROJECTS) {
  global.__STUDIO_MEMORY_PROJECTS = new Map<string, any>();
}

const memoryStore = global.__STUDIO_MEMORY_PROJECTS;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    let project: any = null;
    let latestGeneration: any = null;
    let latestAsset: any = null;

    try {
      const dbProject = await db.project.findUnique({
        where: { id: projectId },
        include: {
          jobs: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          assets: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (dbProject) {
        project = dbProject;
        latestGeneration = (dbProject as any).jobs?.[0];
        latestAsset = (dbProject as any).assets?.[0];
      }
    } catch {}

    // If not found in DB, check memory store
    if (!project && memoryStore.has(projectId)) {
      const mem = memoryStore.get(projectId);
      return NextResponse.json({
        success: true,
        data: {
          project: {
            id: mem.id,
            title: mem.title,
            description: mem.description,
            locale: 'ar',
            status: mem.status,
            progress: mem.progress,
            currentStep: mem.currentStep,
            createdAt: mem.createdAt,
            updatedAt: mem.updatedAt,
            config: mem.config,
          },
          assets: {
            videoUrl: mem.videoUrl || null,
            thumbnailUrl: mem.thumbnailUrl || null,
            duration: mem.durationSeconds || 15,
          },
          history: [],
        },
      });
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } },
        { status: 404 }
      );
    }

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
        history: (project.jobs || []).map((g: any) => ({
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

    if (memoryStore.has(projectId)) {
      const mem = memoryStore.get(projectId);
      if (body.title) mem.title = body.title;
      if (body.config) mem.config = body.config;
      mem.updatedAt = new Date().toISOString();
      memoryStore.set(projectId, mem);
    }

    try {
      await db.project.update({
        where: { id: projectId },
        data: {
          ...(body.title ? { title: body.title } : {}),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        projectId,
        title: body.title || 'Studio Project',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error updating project';
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
    memoryStore.delete(projectId);

    try {
      await db.project.delete({ where: { id: projectId } });
    } catch {}

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
