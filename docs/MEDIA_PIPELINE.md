# Quran Media Platform — FFmpeg & Media Synthesis Pipeline

## 1. Pipeline Overview

The media package (`@quran-media/media`) provides an end-to-end rendering engine that transforms raw Quran text, reciter audio segments, AI background imagery, and subtitle styling into production-ready social media videos and high-resolution posters.

```
1. Fetch Audio + Timestamps
   (Quran Recitation MP3 + Millisecond Word Boundaries)
               |
2. Generate AI / Template Background
   (Sharp / Canvas Composition @ Target Resolution)
               |
3. Compile ASS / SRT Subtitles
   (Arabic Calligraphy Font + Dynamic Word Highlight Karaoke)
               |
4. Single-Pass FFmpeg Filter Graph
   - Scale/Crop background to Aspect Ratio
   - Apply subtle slow-zoom (Ken Burns effect)
   - Overlay Islamic Vignette / Geometric Borders
   - Burn-in formatted ASS subtitles
   - Mix & normalize recitation audio
               |
5. Stream & Transcode to MP4 (H.264 / AAC)
               |
6. Upload to S3 Object Storage & Generate Pre-signed URL
```

---

## 2. Aspect Ratio Matrix

| Ratio | Resolution (W x H) | Target Platform | Subtitle Font Scale | Safe Zone Padding |
|---|---|---|---|---|
| **9:16** | 1080 x 1920 | TikTok, Instagram Reels, YouTube Shorts | 34pt | Top 15%, Bottom 20% |
| **16:9** | 1920 x 1080 | YouTube, Web Player, TV | 38pt | 10% all sides |
| **1:1** | 1080 x 1080 | Instagram Feed, Facebook, Twitter | 32pt | 10% all sides |
| **4:5** | 1080 x 1350 | Instagram Portrait Feed | 34pt | 12% all sides |

---

## 3. Subtitle Engine & Arabic RTL Karaoke Highlighting

Subtitles are generated dynamically in Advanced SubStation Alpha (`.ass`) format to support:
- Native right-to-left (RTL) Arabic bidirectional text layout.
- High-quality Arabic typeface embedding (`Amiri-Bold`, `NotoNaskhArabic`).
- Precise word-by-word active karaoke color transitions (`\k` timing tags) aligned with reciter timestamps.
- English translation subtitle dual-line display below the Arabic text.
