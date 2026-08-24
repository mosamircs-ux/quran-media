import { type NextRequest } from 'next/server';
import { db } from '@quran-media/database';

export const dynamic = 'force-dynamic';

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
      const maxPolls = 180; // ~6 minutes timeout

      const sendEvent = (data: Record<string, unknown>) => {
        if (!isAlive) return;
        const msg = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(msg));
      };

      // Heartbeat comment
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
          // Fetch latest generation for this project
          const project = await db.project.findUnique({
            where: { id: projectId },
            include: {
              generations: {
                orderBy: { createdAt: 'desc' },
                take: 1,
                include: { mediaAssets: true },
              },
            },
          });

          const latestGen = project?.generations[0];
          const latestAsset = latestGen?.mediaAssets[0];

          if (latestGen) {
            const currentStatus = latestGen.status;
            const currentProgress = latestGen.progress;

            // If state or progress changed, or if it's the first ping:
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
                webmUrl: (latestAsset?.metadata as any)?.webmUrl || (latestGen.result as any)?.webmUrl || null,
                thumbnailUrl: latestAsset?.thumbnailUrl || (latestGen.result as any)?.thumbnailUrl || null,
                previewUrl: (latestAsset?.metadata as any)?.previewUrl || (latestGen.result as any)?.previewUrl || null,
                duration: latestAsset?.duration || 15,
                timestamp: new Date().toISOString(),
              });
            }

            // If terminal state reached (COMPLETED or FAILED), close stream after final delivery
            if (currentStatus === 'COMPLETED' || currentStatus === 'FAILED') {
              clearInterval(interval);
              setTimeout(() => {
                try { controller.close(); } catch {}
              }, 1000);
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
