/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@quran-media/config',
    '@quran-media/database',
    '@quran-media/quran',
    '@quran-media/ai',
    '@quran-media/media',
    '@quran-media/ui',
    '@quran-media/i18n',
  ],
  serverExternalPackages: ['sharp', 'fluent-ffmpeg', 'ioredis', 'bullmq', '@prisma/client', 'prisma'],
  images: {
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
      ],
    },
  ],
};

export default nextConfig;
