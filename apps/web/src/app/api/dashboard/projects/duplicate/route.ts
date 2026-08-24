import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = await request.json();
    if (!projectId) {
      return NextResponse.json({ success: false, error: 'projectId is required' }, { status: 400 });
    }

    const store = global.__STUDIO_MEMORY_PROJECTS;
    if (!store || !store.has(projectId)) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const original = store.get(projectId);
    const newProjectId = `proj-${Date.now()}`;
    const isAr = user.locale === 'ar';

    const duplicatedProject = {
      ...original,
      id: newProjectId,
      userId: user.id,
      title: `${original.title} ${isAr ? '(نسخة)' : '(Copy)'}`,
      status: 'DRAFT',
      progress: 0,
      currentStep: 'DRAFT_CREATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: original.config ? { ...original.config, id: newProjectId, title: `${original.title} ${isAr ? '(نسخة)' : '(Copy)'}` } : null,
    };

    store.set(newProjectId, duplicatedProject);

    return NextResponse.json({
      success: true,
      data: {
        project: duplicatedProject,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to duplicate project' },
      { status: 500 }
    );
  }
}
