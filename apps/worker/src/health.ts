import http from 'http';
import { env, logger } from '@quran-media/config';
import { getRedisConnection } from './queues/queue-factory.js';

export function startHealthServer(port: number = env.WORKER_HEALTH_PORT) {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/health' || req.url === '/healthz') {
      try {
        const redis = getRedisConnection();
        const redisPing = await redis.ping();

        if (redisPing === 'PONG') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'healthy', redis: 'connected', timestamp: new Date().toISOString() }));
          return;
        }
      } catch (err) {
        logger.error({ err }, 'Worker health check failed');
      }

      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'unhealthy' }));
      return;
    }

    res.writeHead(404);
    res.end();
  });

  server.listen(port, () => {
    logger.info({ port }, 'Worker health check server listening');
  });

  return server;
}
