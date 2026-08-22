# Quran Media Platform — Rate Limiting & Caching Strategy

## 1. Multi-Tiered Rate Limiting

The rate limiting engine uses a Redis sliding window algorithm to ensure smooth traffic distribution without boundary spikes.

| Tier | Endpoints | Limit | Key Identifier |
|---|---|---|---|
| **Tier 1: Public Quran Data** | `/api/quran/chapters`, `/api/quran/verses`, `/api/quran/search` | 60 req / min | Client IP |
| **Tier 2: Authenticated Reads** | `/api/projects`, `/api/media`, `/api/generations/[id]` | 120 req / min | User ID / Session Token |
| **Tier 3: Generation Triggers** | `POST /api/generations` | 10 req / min (Max 3 concurrent) | User ID |

### Rate Limit Response Headers
When rate limits are evaluated, the following standard response headers are emitted:
- `X-RateLimit-Limit`: Maximum requests permitted within the window.
- `X-RateLimit-Remaining`: Number of requests remaining in current window.
- `X-RateLimit-Reset`: Unix timestamp when quota resets.
- `Retry-After`: Seconds to wait before retrying (sent on HTTP 429).

---

## 2. Multi-Layer Caching Architecture

```
Client Browser / CDN (Edge Cache)
       | (Cache-Control: s-maxage, stale-while-revalidate)
       v
Next.js Server-Side In-Memory Cache (L1)
       | (LRU cache for instant hits)
       v
Redis Shared Cluster (L2)
       | (Surah data, OAuth tokens, Audio timestamps)
       v
PostgreSQL / External Quran Foundation API (Source of Truth)
```

### Cache Key Conventions & Invalidation Rules

| Entity | Redis Cache Key | TTL | Invalidation Trigger |
|---|---|---|---|
| **Quran Chapters List** | `quran:chapters:{locale}` | 24 Hours | Static / Manual Purge |
| **Quran Verses Range** | `quran:verses:{surah}:{from}:{to}:{transId}` | 24 Hours | Static / Manual Purge |
| **Quran Search Queries** | `quran:search:{hash(query)}:{locale}` | 6 Hours | LRU Eviction |
| **Reciter Audio Segments** | `quran:audio:{surah}:{reciterId}` | 48 Hours | Static |
| **Quran OAuth Access Token** | `quran:auth:token` | 55 Minutes | Auto-refresh 5 mins prior to expiry |
| **Generation Status** | `gen:status:{generationId}` | 10 Minutes | Status update event |
| **Pre-signed S3 URLs** | `s3:url:{assetId}:{operation}` | 50 Minutes | Re-generated on expiration |
