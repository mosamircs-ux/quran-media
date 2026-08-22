# Quran Media Platform — System Architecture Documentation

## 1. System Overview

The **Quran Media Platform** is a distributed, production-grade platform designed for generating, customizing, and serving Quranic media (videos with recitation audio, synced subtitles, AI visual scenes, and Quranic reflections/stories).

The platform enforces strict separation between client-facing interfaces, server orchestration, background execution workers, and external AI/Quran data providers.

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|  - Next.js 15 App Router (React 19 Server & Client Components)                    |
|  - Arabic (RTL, Amiri/Noto Fonts) & English (LTR, Inter) Localization            |
|  - Tailwind CSS + shadcn/ui Design Tokens + Framer Motion Micro-interactions      |
+-----------------------------------------------------------------------------------+
                                         |
                                         | HTTPS (JSON / SSE / Presigned URLs)
                                         v
+-----------------------------------------------------------------------------------+
|                             NEXT.JS API & GATEWAY                                 |
|  - Next.js Route Handlers & Server Actions                                        |
|  - Security Middleware: CSRF, Helmet CSP, Sliding Window Rate Limiting            |
|  - Authenticated Quran Proxy (wraps @quranjs/api server client)                   |
|  - Job Producer (Enqueues generation tasks to BullMQ)                             |
+-----------------------------------------------------------------------------------+
        |                                      |                             |
        v                                      v                             v
+---------------+                      +---------------+             +---------------+
|  PostgreSQL   |                      | Redis Cluster |             | Quran Content |
|  (Prisma ORM) |                      | (Cache + Qs)  |             | Foundation API|
+---------------+                      +---------------+             +---------------+
                                               |
                                               | BullMQ Queue Streams
                                               v
+-----------------------------------------------------------------------------------+
|                           BACKGROUND WORKER CLUSTER                               |
|  - Standalone Node.js processes with graceful shutdown (SIGINT/SIGTERM)          |
|  - AI Abstraction Driver (OpenAI, Gemini, Anthropic, Replicate, Stability)        |
|  - FFmpeg Media Synthesizer (9:16, 16:9, 1:1, 4:5 Aspect Ratios)                  |
|  - Word-by-Word Quran Audio & ASS/SRT Subtitle Aligner                            |
|  - S3 Presigned Upload Engine                                                     |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        S3-COMPATIBLE OBJECT STORAGE                               |
|  - Scalable Asset Storage (AWS S3 / Cloudflare R2 / MinIO)                        |
|  - Immutable Key Generation & Pre-signed Direct Streaming URLs                    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Monorepo Structure & Package Boundaries

The project is structured as a **Turborepo** monorepo using **pnpm workspaces**:

```
quran-media/
├── apps/
│   ├── web/               # Next.js 15 frontend application & serverless API routes
│   └── worker/            # Dedicated BullMQ long-running worker daemon with FFmpeg
│
├── packages/
│   ├── config/            # Zod-validated environment, logger, errors, rate limits
│   ├── database/          # Prisma schema, client singleton, migrations, seeds
│   ├── quran/             # Server-only Quran Foundation API client & caching layer
│   ├── ai/                # Multi-provider AI abstraction layer (Text, Story, Image, Video)
│   ├── media/             # FFmpeg wrapper, Sharp image composer, ASS/SRT subtitle engine
│   ├── ui/                # Shared shadcn/ui components & Tailwind styling
│   └── i18n/              # Bi-directional (RTL/LTR) internationalization dictionaries
```

### Dependency Rules:
1. `apps/web` depends on `@quran-media/config`, `@quran-media/database`, `@quran-media/quran`, `@quran-media/ai`, `@quran-media/media`, `@quran-media/ui`, `@quran-media/i18n`.
2. `apps/worker` depends on `@quran-media/config`, `@quran-media/database`, `@quran-media/quran`, `@quran-media/ai`, `@quran-media/media`.
3. Packages in `packages/*` NEVER depend on `apps/*`.
4. `packages/quran` enforces server-side execution (`server-only`) to guarantee client credentials are never bundled into the browser.

---

## 3. Core Architectural Principles

1. **Zero Secret Leakage**: All Quran Foundation API tokens, AI API keys, and S3 credentials live strictly within backend environments and worker runtimes.
2. **Asynchronous Heavy Computations**: Video generation, AI image synthesis, and FFmpeg filter chaining are strictly executed inside dedicated worker processes managed by BullMQ.
3. **Decoupled AI Providers**: The system interacts with an abstract capability matrix (`TextGenerator`, `StoryGenerator`, `ImageGenerator`, `VideoGenerator`). Switching or chaining providers requires zero application-level refactoring.
4. **Resilient Failover & Caching**: Static Quranic text and chapter metadata are cached in Redis with a 24-hour TTL. Quran Foundation OAuth tokens are refreshed proactively using distributed locks.
5. **Localization-First Design**: The interface and media rendering engine natively support Arabic RTL calligraphy typography and English LTR layouts.
