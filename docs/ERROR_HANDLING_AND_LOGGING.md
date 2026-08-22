# Quran Media Platform — Error Handling & Logging Strategy

## 1. Error Classification & Hierarchy

All exceptions in the system inherit from `BaseAppError` defined in `@quran-media/config`:

```typescript
export abstract class BaseAppError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly statusCode: number;
  readonly isOperational: boolean = true;

  constructor(
    message: string,
    public readonly details?: unknown,
    public readonly cause?: Error
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
```

### Domain-Specific Error Hierarchy
- **`ValidationError`** (400): Invalid Zod request payload, surah/ayah index out of bounds.
- **`AuthenticationError`** (401): Missing or expired JWT/session token.
- **`ForbiddenError`** (403): User lacks permission to access target project or asset.
- **`NotFoundError`** (404): Resource not found.
- **`RateLimitExceededError`** (429): User exceeded rate limit.
- **`QuranApiError`** (502): Quran Foundation API outage, network error, or invalid OAuth credentials.
- **`AiProviderError`** (502): Upstream AI service error (rate limit, content filter rejection, timeout).
- **`MediaProcessingError`** (500): FFmpeg transcoding failure, missing codec, unreadable audio stream.
- **`StorageError`** (500): S3 upload failure, network disconnect, bucket permissions error.

---

## 2. Structured JSON Logging Strategy

The logging framework uses **Pino** for high-throughput, low-overhead structured logging.

### Log Schema Standard
```json
{
  "level": 30,
  "time": 1755864000000,
  "pid": 1284,
  "hostname": "worker-node-01",
  "requestId": "req_clx99238472",
  "module": "media-pipeline",
  "jobId": "bull_job_5541",
  "msg": "FFmpeg encoding stage completed successfully",
  "durationMs": 14250,
  "aspectRatio": "9:16",
  "surah": 55,
  "ayahRange": "1-5"
}
```

### Key Practices
- **Correlation IDs**: Every HTTP request receives an `X-Request-Id` (UUIDv4) that propagates through server actions, external API proxies, and queue job payloads.
- **Automatic Redaction**: Keys named `authorization`, `clientSecret`, `password`, `apiKey`, `token`, and `cookie` are automatically redacted by the logger serializer.
- **Worker Telemetry**: BullMQ event hooks emit logs at `job:progress`, `job:completed`, `job:failed`, and `job:stalled`.
