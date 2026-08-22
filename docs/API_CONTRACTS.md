# Quran Media Platform — API Contracts & Specifications

All API endpoints follow RESTful conventions, returning consistent JSON responses and standard HTTP status codes.

## Response Envelope Structure

### Success Response
```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_01HP8XYZ...",
    "timestamp": "2026-08-22T12:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid request payload",
    "details": [
      {
        "path": "aspectRatio",
        "message": "Expected '9:16' | '16:9' | '1:1' | '4:5', received '2:3'"
      }
    ]
  },
  "meta": {
    "requestId": "req_01HP8XYZ...",
    "timestamp": "2026-08-22T12:00:00.000Z"
  }
}
```

---

## 1. Quran Proxy API (`/api/quran/*`)

All Quran Foundation API calls are routed through server-side handlers to protect OAuth client secrets.

### `GET /api/quran/chapters`
Fetch list of all 114 Surahs with metadata and Arabic/English titles.
- **Query Params**: `locale` (`ar` | `en`, default: `ar`)
- **Headers**: `Cache-Control: public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600`

### `GET /api/quran/verses`
Fetch Ayahs for a specific Surah with translations, transliterations, and audio segment timestamps.
- **Query Params**:
  - `surah` (number, required: `1-114`)
  - `from` (number, optional: default `1`)
  - `to` (number, optional: default `all`)
  - `translationId` (number, optional: default `131` for Clear Quran)
  - `locale` (`ar` | `en`)

### `GET /api/quran/audio`
Fetch recitation audio files and word-by-word timestamp segments.
- **Query Params**:
  - `surah` (number, required)
  - `reciterId` (number, optional: default `7` for Mishari Rashid al-Afasy)

### `GET /api/quran/search`
Search Quran text and translations.
- **Query Params**:
  - `q` (string, required: min 2 chars)
  - `locale` (`ar` | `en`)
  - `page` (number, optional: default `1`)
  - `limit` (number, optional: default `20`)

---

## 2. Media Generation API (`/api/generations/*`)

### `POST /api/generations`
Create a new media generation job (video, image, story, or text).
- **Rate Limit**: 10 requests / minute per user
- **Request Body**:
```json
{
  "projectId": "proj_clx1234567890",
  "type": "VIDEO",
  "surahNumber": 55,
  "ayahStart": 1,
  "ayahEnd": 5,
  "aspectRatio": "9:16",
  "reciterId": 7,
  "stylePreset": "cinematic_nature",
  "customPrompt": "Lush green peaceful mountain valleys with running streams in misty morning light",
  "aiProvider": "openai",
  "subtitleStyle": {
    "font": "Amiri",
    "fontSize": 32,
    "primaryColor": "#FFFFFF",
    "highlightColor": "#EAB308",
    "position": "bottom"
  },
  "locale": "ar"
}
```
- **Response (202 Accepted)**:
```json
{
  "success": true,
  "data": {
    "generationId": "gen_clx9876543210",
    "jobId": "bull_job_5541",
    "status": "QUEUED",
    "estimatedDurationSeconds": 45,
    "createdAt": "2026-08-22T12:00:00.000Z"
  }
}
```

### `GET /api/generations/{id}`
Poll or inspect status and progress of an active/completed generation.
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "gen_clx9876543210",
    "status": "PROCESSING",
    "progress": 65,
    "currentStep": "BURNING_SUBTITLES",
    "result": null,
    "error": null,
    "mediaAssets": []
  }
}
```

### `POST /api/generations/{id}/cancel`
Cancel an in-progress or queued job.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "id": "gen_clx9876543210",
    "status": "CANCELLED"
  }
}
```

---

## 3. Media Assets API (`/api/media/*`)

### `GET /api/media`
List generated media assets with filtering and pagination.
- **Query Params**: `projectId`, `type` (`IMAGE` | `VIDEO` | `AUDIO`), `aspectRatio`, `page`, `limit`

### `GET /api/media/{id}`
Get asset metadata and pre-signed streaming/viewing URL.

### `GET /api/media/{id}/download`
Generate high-speed pre-signed S3 download URL with `Content-Disposition: attachment`.
