import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { db } from '@quran-media/database';
import { logger } from '@quran-media/config';
import { applyTemplateToProject, getTemplateById } from '@quran-media/media/templates';

// In-memory fallback store for offline/development environments
declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

if (!global.__STUDIO_MEMORY_PROJECTS) {
  global.__STUDIO_MEMORY_PROJECTS = new Map<string, any>();

  // Seed default sample showcase project
  global.__STUDIO_MEMORY_PROJECTS.set('proj-ayat-alkursi', {
    id: 'proj-ayat-alkursi',
    title: 'آية الكرسي — تلاوة مرئية خاشعة',
    description: 'إنتاج مرئي سينمائي لآية الكرسي مع تمييز الكلمات بالذهب والترجمة الإنجليزية',
    status: 'COMPLETED',
    progress: 100,
    currentStep: 'COMPLETED',
    surahNumber: 2,
    ayahStart: 255,
    ayahEnd: 255,
    ayahReferenceAr: 'سورة البقرة • الآية 255',
    ayahReferenceEn: 'Surah Al-Baqarah 2:255',
    aspectRatio: '9:16',
    durationSeconds: 24,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
    config: {
      id: 'proj-ayat-alkursi',
      title: 'آية الكرسي — تلاوة مرئية خاشعة',
      aspectRatio: '9:16',
      resolution: '1080p',
      fps: 30,
      scenes: [
        {
          id: 'scene-1',
          duration: 12,
          background: { type: 'animated_gradient', color: '#020617', gradientColors: ['#064e3b', '#0f172a', '#020617'] },
          camera: { effect: 'zoom_in', intensity: 0.12, startScale: 1.0, endScale: 1.12 },
          transition: { type: 'crossfade', duration: 1.0 },
          verse: {
            surahNumber: 2,
            ayahNumber: 255,
            textUthmani: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
            translationText: 'Allah! There is no god except Him, the Ever-Living, All-Sustaining.',
          },
        },
      ],
      audio: {
        recitation: { reciterId: 7, volume: 1.0, normalize: true },
        ambient: { preset: 'deep_serenity', volume: 0.16, loop: true },
        audioWaveform: { enabled: true, style: 'bars', color: '#f59e0b', height: 80, opacity: 0.85 },
      },
      subtitles: {
        enabled: true,
        style: { fontArabic: 'Amiri Quran', fontTranslation: 'Inter', highlightColorHex: '&H0000D7FF', dualLanguage: true, wordHighlight: true },
      },
    },
  });
}

const memoryStore = global.__STUDIO_MEMORY_PROJECTS;

const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  surahNumber: z.number().int().min(1).max(114).optional().default(1),
  ayahStart: z.number().int().min(1).optional().default(1),
  ayahEnd: z.number().int().min(1).optional().default(7),
  aspectRatio: z.enum(['9:16', '16:9', '1:1', '4:5']).optional().default('9:16'),
  locale: z.enum(['ar', 'en']).optional().default('ar'),
  templatePreset: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const search = searchParams.get('q')?.toLowerCase() || '';

    let studioProjects: any[] = [];

    try {
      let user = await db.user.findFirst();
      if (!user) {
        user = await db.user.create({
          data: {
            email: 'creator@quran-media.internal',
            name: 'Quran Media Creator',
            locale: 'ar',
          },
        });
      }

      const projects = await db.project.findMany({
        where: {
          userId: user.id,
          ...(search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        },
        include: {
          generations: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { mediaAssets: true },
          },
          mediaAssets: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      studioProjects = projects.map((p) => {
        const latestGen = p.generations[0];
        const latestAsset = latestGen?.mediaAssets[0] || p.mediaAssets[0];

        let computedStatus: 'DRAFT' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' = 'DRAFT';
        if (latestGen) {
          if (latestGen.status === 'COMPLETED') computedStatus = 'COMPLETED';
          else if (latestGen.status === 'FAILED') computedStatus = 'FAILED';
          else if (latestGen.status === 'PROCESSING') computedStatus = 'PROCESSING';
          else if (latestGen.status === 'QUEUED') computedStatus = 'QUEUED';
        }

        const surahNum = latestGen?.surahNumber || 1;
        const ayahStart = latestGen?.ayahStart || 1;
        const ayahEnd = latestGen?.ayahEnd || 7;

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          status: computedStatus,
          progress: latestGen?.progress ?? (computedStatus === 'COMPLETED' ? 100 : 0),
          currentStep: latestGen?.currentStep || undefined,
          surahNumber: surahNum,
          ayahStart,
          ayahEnd,
          ayahReferenceAr: `سورة رقم ${surahNum} • الآيات ${ayahStart}:${ayahEnd}`,
          ayahReferenceEn: `Surah ${surahNum}:${ayahStart}-${ayahEnd}`,
          aspectRatio: latestGen?.aspectRatio ? latestGen.aspectRatio.replace('RATIO_', '').replace('_', ':') : '9:16',
          durationSeconds: latestAsset?.duration || 15,
          thumbnailUrl: latestAsset?.thumbnailUrl || undefined,
          videoUrl: latestAsset?.storageUrl || undefined,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
          generationId: latestGen?.id,
        };
      });
    } catch {
      // Memory store fallback
      studioProjects = Array.from(memoryStore.values());
      if (search) {
        studioProjects = studioProjects.filter(
          (p) => p.title.toLowerCase().includes(search) || p.description?.toLowerCase().includes(search)
        );
      }
    }

    // Apply Tab filtering
    const filtered = studioProjects.filter((p) => {
      if (filter === 'drafts') return p.status === 'DRAFT';
      if (filter === 'processing') return p.status === 'PROCESSING' || p.status === 'QUEUED';
      if (filter === 'completed') return p.status === 'COMPLETED';
      if (filter === 'failed') return p.status === 'FAILED';
      return true;
    });

    return NextResponse.json({
      success: true,
      data: {
        projects: filtered,
        counts: {
          all: studioProjects.length,
          drafts: studioProjects.filter((p) => p.status === 'DRAFT').length,
          processing: studioProjects.filter((p) => p.status === 'PROCESSING' || p.status === 'QUEUED').length,
          completed: studioProjects.filter((p) => p.status === 'COMPLETED').length,
          failed: studioProjects.filter((p) => p.status === 'FAILED').length,
        },
      },
    });
  } catch (err: unknown) {
    logger.warn({ err }, 'Error in GET /api/studio/projects');
    return NextResponse.json({
      success: true,
      data: {
        projects: Array.from(memoryStore.values()),
        counts: { all: memoryStore.size, drafts: 0, processing: 0, completed: memoryStore.size, failed: 0 },
      },
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = createProjectSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid project parameters',
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { title, description, surahNumber, ayahStart, ayahEnd, aspectRatio, locale, templatePreset } = parsed.data;
    const newProjectId = `proj-${Date.now()}`;

    const selectedTemplate = getTemplateById(templatePreset || 'cinematic_nature');

    const projectConfig = applyTemplateToProject(
      {
        id: newProjectId,
        title,
        aspectRatio,
        resolution: '1080p',
        fps: 30,
        scenes: [
          {
            id: 'scene-1',
            duration: selectedTemplate.scene_structure.defaultSceneDuration,
            verse: {
              surahNumber,
              ayahNumber: ayahStart,
              textUthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
              translationText: 'In the Name of Allah, Most Compassionate, Most Merciful',
            },
          },
        ],
      },
      selectedTemplate.template_id,
      { overrideAspectRatio: aspectRatio }
    );

    const newProjectRecord = {
      id: newProjectId,
      title,
      description: description || `إنتاج مرئي لسورة رقم ${surahNumber} (الآيات ${ayahStart}-${ayahEnd})`,
      status: 'DRAFT',
      progress: 0,
      currentStep: 'DRAFT_CREATED',
      surahNumber,
      ayahStart,
      ayahEnd,
      ayahReferenceAr: `سورة رقم ${surahNumber} • الآيات ${ayahStart}:${ayahEnd}`,
      ayahReferenceEn: `Surah ${surahNumber}:${ayahStart}-${ayahEnd}`,
      aspectRatio,
      durationSeconds: selectedTemplate.scene_structure.defaultSceneDuration,
      thumbnailUrl: selectedTemplate.preview.previewImageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config: projectConfig,
    };

    // Store in memory store
    memoryStore.set(newProjectId, newProjectRecord);

    // Also attempt DB write
    try {
      let user = await db.user.findFirst();
      if (!user) {
        user = await db.user.create({
          data: { email: 'creator@quran-media.internal', name: 'Quran Media Creator', locale: 'ar' },
        });
      }

      await db.project.create({
        data: {
          id: newProjectId,
          userId: user.id,
          title,
          description: description || `إنتاج مرئي لسورة رقم ${surahNumber}`,
          locale,
          status: 'DRAFT',
        },
      });
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: {
          projectId: newProjectId,
          title,
          status: 'DRAFT',
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create studio project';
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message } },
      { status: 500 }
    );
  }
}
