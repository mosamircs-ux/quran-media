import { NextResponse } from 'next/server';

/**
 * Sets public edge & browser caching headers for canonical immutable Quran resources
 * s-maxage: Edge CDN cache
 * stale-while-revalidate: Instant background refresh
 */
export function setPublicCacheHeaders(
  response: NextResponse,
  sMaxAge = 86400 * 7, // 7 days edge CDN
  staleWhileRevalidate = 86400 * 30 // 30 days SWR
): NextResponse {
  response.headers.set(
    'Cache-Control',
    `public, max-age=3600, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
  );
  return response;
}

/**
 * Sets strict private no-store headers for user account, drafts, and billing data
 */
export function setPrivateNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}
