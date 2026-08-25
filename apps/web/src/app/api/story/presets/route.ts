import { NextResponse } from 'next/server';
import { STORY_PRESETS } from '@/lib/story-presets';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: STORY_PRESETS,
  });
}
