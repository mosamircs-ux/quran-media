import 'server-only';
import { createServerClient } from '@quranjs/api/server';
import { env, logger, QuranApiError } from '@quran-media/config';

let serverClientInstance: any = null;

/**
 * Returns the singleton authenticated server client from @quranjs/api.
 * Protected by `import 'server-only'` to prevent bundling into client-side JS.
 */
export function getQuranServerClient(): any {
  if (!serverClientInstance) {
    try {
      serverClientInstance = createServerClient({
        clientId: env.QURAN_CLIENT_ID,
        clientSecret: env.QURAN_CLIENT_SECRET,
      });
      logger.info('Initialized official Quran Foundation server client');
    } catch (err) {
      logger.error({ err }, 'Failed to initialize Quran Foundation server client');
      throw new QuranApiError('Failed to initialize Quran API client', err);
    }
  }
  return serverClientInstance;
}

