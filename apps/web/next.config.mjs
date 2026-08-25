/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: [
    '@quran-media/config',
    '@quran-media/database',
    '@quran-media/quran',
    '@quran-media/ai',
    '@quran-media/media',
    '@quran-media/ui',
    '@quran-media/i18n',
  ],
  serverExternalPackages: [
    'sharp',
    'fluent-ffmpeg',
    'ioredis',
    'bullmq',
    '@prisma/client',
    'prisma',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000, // 30 days
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        {
          key: 'Link',
          value: '<https://fonts.googleapis.com>; rel=preconnect; crossorigin, <https://everyayah.com>; rel=preconnect; crossorigin',
        },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
};

export default nextConfig;
