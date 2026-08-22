# Quran Media Platform

A production-grade, distributed AI-powered platform for generating and delivering Quranic media (synced recitation video, Arabic RTL karaoke subtitles, AI-generated atmospheric visual scenes, and Quranic reflections/stories) with support for all social media aspect ratios (**9:16, 16:9, 1:1, 4:5**).

---

## Architecture Overview

```
quran-media/
├── apps/
│   ├── web/               # Next.js 15 App Router frontend & authenticated API proxy
│   └── worker/            # BullMQ worker daemon for heavy FFmpeg & AI synthesis
│
├── packages/
│   ├── config/            # Zod-validated environment, logger, errors, rate limits
│   ├── database/          # Prisma PostgreSQL client, schema, migrations
│   ├── quran/             # Server-only Quran Foundation Content API v4 client
│   ├── ai/                # Multi-provider abstraction (OpenAI, Gemini, Anthropic, Replicate)
│   ├── media/             # FFmpeg engine, Sharp composer, ASS/SRT karaoke subtitles, S3
│   ├── ui/                # Shared Tailwind / shadcn/ui components & typography tokens
│   └── i18n/              # Arabic (RTL) & English (LTR) dictionaries and locale routing
│
├── docs/                  # In-depth architectural & operational documentation
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACTS.md
│   ├── DATABASE_SCHEMA.md
│   ├── SECURITY_MODEL.md
│   ├── RATE_LIMITING_AND_CACHING.md
│   ├── BACKGROUND_JOB_ARCHITECTURE.md
│   ├── ERROR_HANDLING_AND_LOGGING.md
│   ├── AI_ABSTRACTION.md
│   └── MEDIA_PIPELINE.md
│
└── docker/                # Local dev PostgreSQL, Redis, MinIO, Dockerfiles
```

---

## Key Features

1. **Official Quran Foundation Integration**:
   - Uses the official `@quranjs/api` server SDK.
   - All OAuth credentials strictly kept server-side behind `import 'server-only'`.
   - Redis caching for Surah metadata, verses, and word-by-word timestamp segments.

2. **Pluggable AI Abstraction Matrix**:
   - Provider-agnostic interfaces for `TextGenerator`, `StoryGenerator`, `ImageGenerator`, `VideoGenerator`.
   - Support for OpenAI (GPT-4o / DALL-E 3), Google Gemini (2.5 Flash / Imagen 3), Anthropic Claude, Replicate (Flux/SDXL), and offline Mock providers.
   - Islamic reverence guardrails to ensure sacred aesthetic standards.

3. **FFmpeg Media Engine**:
   - Single-pass complex filtergraphs for seamless performance.
   - Dynamic right-to-left (RTL) `.ass` subtitle generator with word-by-word active karaoke highlighting.
   - Cinematic slow-zoom effects and customizable aspect ratios (9:16, 16:9, 1:1, 4:5).

4. **Production Background Processing**:
   - Decoupled BullMQ worker pool over Redis.
   - Stalled job recovery, progress reporting, and graceful shutdown handlers (`SIGINT`/`SIGTERM`).

---

## Quickstart & Local Setup

### 1. Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Docker & Docker Compose (for PostgreSQL, Redis, MinIO)
- FFmpeg (for local worker execution outside Docker)

### 2. Clone & Install Dependencies
```bash
cp .env.example .env
pnpm install
```

### 3. Start Local Infrastructure
```bash
docker compose -f docker/docker-compose.yml up -d
```

### 4. Initialize Database
```bash
pnpm --filter @quran-media/database run db:push
```

### 5. Run Development Servers
```bash
# Start both Web App (:3000) and Background Worker (:3001) in parallel
pnpm dev
```

---

## Detailed Documentation
- [System Architecture](docs/ARCHITECTURE.md)
- [API Contracts](docs/API_CONTRACTS.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Security Model](docs/SECURITY_MODEL.md)
- [Rate Limiting & Caching](docs/RATE_LIMITING_AND_CACHING.md)
- [Background Job Architecture](docs/BACKGROUND_JOB_ARCHITECTURE.md)
- [Error Handling & Logging Strategy](docs/ERROR_HANDLING_AND_LOGGING.md)
- [AI Abstraction Layer](docs/AI_ABSTRACTION.md)
- [FFmpeg Media Pipeline](docs/MEDIA_PIPELINE.md)
