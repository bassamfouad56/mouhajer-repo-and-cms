import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'yuz.beb.mybluehost.me',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // Build optimizations to prevent Vercel timeout
  experimental: {
    // Reduce concurrent static page generation to prevent timeout
    staticGenerationMaxConcurrency: 4,
    // Retry failed static generation
    staticGenerationRetryCount: 1,
  },
  // Reduce build output verbosity
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  // Remove standalone output to speed up build (Vercel handles this automatically)
  // output: 'standalone',
  // Redirects for blog to journal migration
  async redirects() {
    return [
      // Redirect old blog URLs to journal
      {
        source: '/:locale/blog',
        destination: '/:locale/journal',
        permanent: true,
      },
      {
        source: '/:locale/blog/:slug',
        destination: '/:locale/journal/design-trends/:slug',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
