# Quran Media Platform — Background Job & Worker Architecture

## 1. Decoupled Processing Engine

Heavy media synthesis (audio slicing, image rendering, ASS subtitle burning, and FFmpeg video transcoding) is decoupled from the web application and executed by dedicated worker nodes running **BullMQ** over Redis.

```
+-------------------------------------------------------------+
|                         Next.js App                         |
|  1. Validate generation parameters                          |
|  2. Insert DB record: Generation(status: 'PENDING')         |
|  3. Enqueue job to 'media-generation' BullMQ queue          |
|  4. Return HTTP 202 with generationId & jobId               |
+-------------------------------------------------------------+
                              |
                              | LPUSH / XADD to Redis
                              v
+-------------------------------------------------------------+
|                        Redis Broker                         |
|  - Queues: media-generation, image-generation, audio-sync   |
|  - Event pub/sub for real-time progress broadcast           |
+-------------------------------------------------------------+
                              |
                              | BRPOPLPUSH / Consumer Group
                              v
+-------------------------------------------------------------+
|                    Dedicated Worker Pool                    |
|  1. Fetch job payload & acquire lock                        |
|  2. Update DB status -> 'PROCESSING' (progress: 10%)        |
|  3. Fetch Quran verse text & reciter audio segments         |
|  4. AI Visual Generation (OpenAI DALL-E / Flux / SDXL)       |
|  5. Compose ASS/SRT subtitles with Arabic typography        |
|  6. Run FFmpeg complex filtergraph                          |
|  7. Upload final .mp4 / .png to S3 object store             |
|  8. Create MediaAsset record & update status -> 'COMPLETED' |
+-------------------------------------------------------------+
```

## 2. Queue Topology & Priority Levels

| Queue Name | Responsibilities | Concurrency | Retry Policy | Timeout |
|---|---|---|---|---|
| `media-generation` | End-to-end video synthesis | 3 per worker node | 3 attempts, exponential backoff | 300s |
| `image-generation` | Sharp & AI image composition | 5 per worker node | 3 attempts, exponential backoff | 120s |
| `story-generation` | Quran reflection & story text | 10 per worker node | 2 attempts | 60s |
| `audio-sync` | Audio slicing & word-level timing | 5 per worker node | 3 attempts | 90s |

## 3. Resilience & Graceful Shutdown
1. **Stalled Job Recovery**: Workers send heartbeats to Redis every 15 seconds. If a node crashes, BullMQ detects the stalled lock and migrates the job to an available healthy worker.
2. **Signal Handling**: Workers register listeners on `SIGTERM` and `SIGINT`:
   - Cease picking up new jobs.
   - Wait up to 30 seconds for active FFmpeg jobs to finish encoding.
   - Clean up temporary local files in `tmp/media/`.
   - Close Redis and Prisma database connection pools.
