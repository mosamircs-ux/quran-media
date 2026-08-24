import { type NextRequest } from 'next/server';
import { db } from '@quran-media/database';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: generationId } = await params;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let isAlive = true;
      let lastProgress = -1;
      let lastStatus = '';
      let pollCount = 0;
      const maxPolls = 180;

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
          const gen = await db.generation.findUnique({
            where: { id: generationId },
            include: { mediaAssets: true },
          });

          if (gen) {
            const currentStatus = gen.status;
            const currentProgress = gen.progress;
            const latestAsset = gen.mediaAssets[0];

            if (currentProgress !== lastProgress || currentStatus !== lastStatus || pollCount % 4 === 0) {
              lastProgress = currentProgress;
              lastStatus = currentStatus;

              sendEvent({
                generationId: gen.id,
                projectId: gen.projectId,
                status: currentStatus,
                progress: currentProgress,
                currentStep: gen.currentStep || '',
                error: gen.error || null,
                videoUrl: latestAsset?.storageUrl || (gen.result as any)?.storageUrl || null,
                thumbnailUrl: latestAsset?.thumbnailUrl || (gen.result as any)?.thumbnailUrl || null,
                timestamp: new Date().toISOString(),
              });
            }

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
