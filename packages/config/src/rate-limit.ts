export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

// In-memory sliding window rate limiter fallback (used during development / testing without active Redis)
export class MemoryRateLimiter implements RateLimiter {
  private readonly windows = new Map<string, number[]>();

  constructor(
    private readonly maxRequests: number,
    private readonly windowMs: number = 60_000
  ) {}

  async limit(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    const timestamps = this.windows.get(key)?.filter((t) => t > windowStart) ?? [];

    if (timestamps.length >= this.maxRequests) {
      const oldest = timestamps[0] ?? now;
      const reset = Math.ceil((oldest + this.windowMs) / 1000);
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset,
      };
    }

    timestamps.push(now);
    this.windows.set(key, timestamps);

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - timestamps.length,
      reset: Math.ceil((now + this.windowMs) / 1000),
    };
  }
}
