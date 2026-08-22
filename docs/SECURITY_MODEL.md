# Quran Media Platform — Security Model & Threat Mitigations

## 1. Secrets Isolation & Zero Browser Leakage
- **Quran Foundation Credentials**: The client secret is accessed exclusively inside `packages/quran` behind the `import 'server-only'` boundary.
- **AI Keys & S3 Secrets**: Injected via runtime environment variables and validated at boot using Zod (`packages/config/src/env.ts`).
- **No Client Bundling**: Next.js bundle analyzer checks run during CI to verify no secret variables prefixed without `NEXT_PUBLIC_` exist in client chunks.

## 2. API Security & Input Sanitization
- **Strict Zod Payload Validation**: All incoming requests to Route Handlers and Server Actions pass through typed Zod schemas. Extraneous parameters are stripped.
- **Quran Surah & Ayah Bounds Enforcement**: Ayah numbers are checked against known canonical verse counts per Surah (e.g. Surah 1 has 7 Ayahs, Surah 2 has 286). Range requests with invalid indexes are rejected before invoking external APIs.
- **Prompt Injection & Islamic Reverence Guardrails**: Custom prompts sent to AI generators pass through safety checks to prevent generation of disrespectful or sacrilegious depictions of sacred texts.

## 3. Storage & Media Asset Protection
- **Private S3 Buckets**: Media buckets are strictly private. No public bucket listing is permitted.
- **Time-Limited Pre-signed URLs**: All asset streams and downloads use AWS S3 Signature Version 4 (SigV4) pre-signed URLs with an expiration TTL of 60 minutes.
- **Filename Randomization**: Object storage keys use collision-resistant UUIDv4 / CUID identifiers (`media/videos/{userId}/{assetId}.mp4`) to prevent asset enumeration.

## 4. Rate Limiting & Resource Exhaustion Protection
- **Sliding Window Counter**: Redis-backed sliding window rate limiter prevents API abuse.
- **Concurrency Caps**: A user can run at most 3 concurrent heavy media generation jobs at any given time. Additional requests are queued or rejected with HTTP 429.
- **Worker Memory & CPU Sandbox**: FFmpeg processes run with memory caps, max execution timeouts (300 seconds), and restricted CPU priority to prevent host starvation.

## 5. Security Headers & CORS Policy
- Next.js middleware injects standard security headers:
  - `Content-Security-Policy (CSP)`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `Referrer-Policy: strict-origin-when-cross-origin`
