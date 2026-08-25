import { type NextRequest } from 'next/server';
import { db } from '@quran-media/database';

export const dynamic = 'force-dynamic';

declare global {
  // eslint-disable-next-line no-var
  var __STUDIO_MEMORY_PROJECTS: Map<string, any> | undefined;
}

if (!global.__STUDIO_MEMORY_PROJECTS) {
  global.__STUDIO_MEMORY_PROJECTS = new Map<string, any>();
}
const memoryStore = global.__STUDIO_MEMORY_PROJECTS;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isAlive = true;
      let lastProgress = -1;
      let lastStatus = '';
      let pollCount = 0;
      const maxPolls = 120; // ~3 minutes timeout

      const sendEvent = (data: Record<string, unknown>) => {
        if (!isAlive) return;
        const msg = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(msg));
      };

      const sendPing = () => {
        if (!isAlive) return;
        controller.enqueue(encoder.encode(': ping\n\n'));
      };

      request.signal.addEventListener('abort', () => {
        isAlive = false;
        try { controller.close(); } catch {}
      });

      const interval = setInterval(async () => {
        if (!isAlive) {
          clearInterval(interval);
          return;
        }

        pollCount++;
        if (pollCount > maxPolls) {
          clearInterval(interval);
          try { controller.close(); } catch {}
          return;
        }

        try {
          // 1. Try fetching from Database
          let project: any = null;
          try {
            project = await db.project.findUnique({
              where: { id: projectId },
              include: {
                jobs: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
                assets: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            });
          } catch {}

          const latestGen = (project as any)?.jobs?.[0];
          const latestAsset = (project as any)?.assets?.[0];

          if (latestGen) {
            const currentStatus = latestGen.status;
            const currentProgress = latestGen.progress;

            if (currentProgress !== lastProgress || currentStatus !== lastStatus || pollCount % 4 === 0) {
              lastProgress = currentProgress;
              lastStatus = currentStatus;

              sendEvent({
                projectId,
                generationId: latestGen.id,
                status: currentStatus,
                progress: currentProgress,
                currentStep: latestGen.currentStep || '',
                error: latestGen.error || null,
                videoUrl: latestAsset?.storageUrl || (latestGen.result as any)?.storageUrl || null,
                thumbnailUrl: latestAsset?.thumbnailUrl || (latestGen.result as any)?.thumbnailUrl || null,
                timestamp: new Date().toISOString(),
              });
            }

            if (currentStatus === 'COMPLETED' || currentStatus === 'FAILED') {
              clearInterval(interval);
              setTimeout(() => {
                try { controller.close(); } catch {}
              }, 1000);
            }
          } else if (memoryStore.has(projectId)) {
            // 2. Memory store simulation for live background job demo
            const mem = memoryStore.get(projectId);
            if (mem.status === 'QUEUED' || mem.status === 'PROCESSING' || mem.status === 'RENDERING') {
              const simProgress = Math.min(100, (mem.progress || 0) + 18);
              mem.progress = simProgress;

              if (simProgress < 25) {
                mem.status = 'PROCESSING';
                mem.currentStep = 'Setting up studio render workspace & font caches...';
              } else if (simProgress < 55) {
                mem.status = 'GENERATING_ASSETS';
                mem.currentStep = 'Synthesizing Uthmani calligraphy plate & particle gradients...';
              } else if (simProgress < 85) {
                mem.status = 'RENDERING';
                mem.currentStep = 'Compositing Ken Burns camera motion & master audio mix...';
              } else {
                mem.status = 'COMPLETED';
                mem.currentStep = 'Master HD video ready for download and playback';
                mem.videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
                mem.thumbnailUrl = 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&auto=format&fit=crop&q=80';
              }
              memoryStore.set(projectId, mem);

              sendEvent({
                projectId,
                status: mem.status,
                progress: mem.progress,
                currentStep: mem.currentStep,
                videoUrl: mem.videoUrl || null,
                thumbnailUrl: mem.thumbnailUrl || null,
                timestamp: new Date().toISOString(),
              });

              if (mem.status === 'COMPLETED') {
                clearInterval(interval);
                setTimeout(() => {
                  try { controller.close(); } catch {}
                }, 1000);
              }
            } else {
              sendPing();
            }
          } else {
            sendPing();
          }
        } catch {
          sendPing();
        }
      }, 1500);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
