import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Filter user's private projects
    const store = global.__STUDIO_MEMORY_PROJECTS || new Map<string, any>();
    const allProjects: any[] = Array.from(store.values());
    const userProjects = allProjects.filter((p: any) => p.userId === user.id || !p.userId);

    const completedProjects = userProjects.filter((p: any) => p.status === 'COMPLETED');
    const processingProjects = userProjects.filter((p: any) => p.status === 'PROCESSING' || p.status === 'RENDERING');
    const draftsProjects = userProjects.filter((p: any) => p.status === 'DRAFT' || p.status === 'QUEUED');

    // Aggregate statistics
    const stats = {
      totalProjects: userProjects.length,
      completedVideos: completedProjects.length,
      processingJobs: processingProjects.length,
      drafts: draftsProjects.length,
      savedAyahsCount: 14,
      savedStoriesCount: 6,
      storageUsedMb: Math.round(userProjects.length * 128.5),
      storageLimitMb: 10240, // 10 GB
      renderedMinutesThisMonth: Math.round(userProjects.length * 2.4),
      renderedMinutesLimit: 120,
    };

    return NextResponse.json({
      success: true,
      user,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch overview' },
      { status: 500 }
    );
  }
}
