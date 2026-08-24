import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { type Locale } from '@quran-media/i18n';
import { db } from '@quran-media/database';
import { StudioProjectEditorClient } from '@/components/studio/studio-project-editor-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectId: string; locale: Locale }>;
}): Promise<Metadata> {
  const { projectId } = await params;
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: { title: true, description: true },
    });

    return {
      title: project ? `${project.title} — Quran Media Studio` : 'Studio Workspace — Quran Media',
      description: project?.description || 'Edit and render cinematic Quran video scenes and recitations.',
    };
  } catch {
    return {
      title: 'Studio Workspace — Quran Media',
    };
  }
}

export default async function StudioProjectPage({
  params,
}: {
  params: Promise<{ projectId: string; locale: Locale }>;
}) {
  const { projectId, locale } = await params;

  let initialProject: any = null;

  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        generations: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: { mediaAssets: true },
        },
        mediaAssets: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (project) {
      const latestGen = project.generations[0];
      const latestAsset = latestGen?.mediaAssets[0] || project.mediaAssets[0];

      initialProject = {
        id: project.id,
        title: project.title,
        description: project.description,
        status: latestGen?.status || project.status,
        progress: latestGen?.progress ?? 0,
        currentStep: latestGen?.currentStep || '',
        config: latestGen?.config || null,
        assets: {
          videoUrl: latestAsset?.storageUrl || (latestGen?.result as any)?.storageUrl || null,
          webmUrl: (latestAsset?.metadata as any)?.webmUrl || (latestGen?.result as any)?.webmUrl || null,
          thumbnailUrl: latestAsset?.thumbnailUrl || (latestGen?.result as any)?.thumbnailUrl || null,
        },
      };
    }
  } catch {}

  // If not found in database, provide standard scaffold
  if (!initialProject) {
    initialProject = {
      id: projectId,
      title: 'Studio Media Production',
      status: 'DRAFT',
      progress: 0,
      config: null,
      assets: {},
    };
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-7xl py-8">
      <StudioProjectEditorClient
        initialProject={initialProject}
        projectId={projectId}
        locale={locale}
      />
    </div>
  );
}
