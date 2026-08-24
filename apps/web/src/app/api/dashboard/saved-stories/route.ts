import { NextResponse, type NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { QURAN_STORIES } from '@/lib/stories-catalog';

declare global {
  // eslint-disable-next-line no-var
  var __SAVED_STORIES_STORE: Map<string, string[]> | undefined;
}

if (!global.__SAVED_STORIES_STORE) {
  global.__SAVED_STORIES_STORE = new Map<string, string[]>();
  // Pre-seed saved stories for demo user
  global.__SAVED_STORIES_STORE.set('usr_demo_creator_01', [
    'yusuf-from-well-to-elevation',
    'companions-of-the-cave',
    'moses-and-the-parting-sea',
  ]);
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const store = global.__SAVED_STORIES_STORE!;
    const savedSlugs = store.get(user.id) || [];

    const savedStories = QURAN_STORIES.filter((s) => savedSlugs.includes(s.slug));

    return NextResponse.json({
      success: true,
      data: {
        stories: savedStories,
        total: savedStories.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch saved stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }

    const store = global.__SAVED_STORIES_STORE!;
    const savedSlugs = store.get(user.id) || [];

    if (!savedSlugs.includes(slug)) {
      savedSlugs.push(slug);
      store.set(user.id, savedSlugs);
    }

    return NextResponse.json({ success: true, data: { saved: true, slug } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to save story' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const store = global.__SAVED_STORIES_STORE!;
    let savedSlugs = store.get(user.id) || [];
    savedSlugs = savedSlugs.filter((s) => s !== slug);
    store.set(user.id, savedSlugs);

    return NextResponse.json({ success: true, data: { saved: false, slug } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to unsave story' },
      { status: 500 }
    );
  }
}
