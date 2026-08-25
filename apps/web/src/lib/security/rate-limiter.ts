import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit?: number;
  windowSeconds?: number;
}

export const RATE_LIMIT_TIERS = {
  auth: { limit: 10, windowSeconds: 60 },
  generations: { limit: 6, windowSeconds: 60 },
  upload: { limit: 15, windowSeconds: 60 },
  api: { limit: 120, windowSeconds: 60 },
};

/**
 * High-performance Sliding Window Rate Limiter
 */
export function checkRateLimit(
  identifier: string,
  tier: keyof typeof RATE_LIMIT_TIERS = 'api'
): { allowed: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMIT_TIERS[tier] || RATE_LIMIT_TIERS.api;
  const now = Date.now();
  const key = `${tier}:${identifier}`;

  const record = memoryStore.get(key);

  // Clean expired record or initialize new
  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowSeconds * 1000,
    };
    memoryStore.set(key, newRecord);
    return {
      allowed: true,
      remaining: config.limit - 1,
      resetTime: newRecord.resetTime,
    };
  }

  // Increment existing counter
  if (record.count < config.limit) {
    record.count += 1;
    return {
      allowed: true,
      remaining: config.limit - record.count,
      resetTime: record.resetTime,
    };
  }

  // Exceeded rate limit
  return {
    allowed: false,
    remaining: 0,
    resetTime: record.resetTime,
  };
}

/**
 * Middleware helper for rate limiting Next.js API route handlers
 */
export function enforceRateLimit(
  request: NextRequest,
  tier: keyof typeof RATE_LIMIT_TIERS = 'api'
): NextResponse | null {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1';

  const result = checkRateLimit(ip, tier);

  if (!result.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too Many Requests — Rate limit exceeded. Please retry shortly.',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetTime - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(RATE_LIMIT_TIERS[tier].limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetTime / 1000)),
        },
      }
    );
  }

  return null;
}
