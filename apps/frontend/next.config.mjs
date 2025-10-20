// import createNextIntlPlugin from 'next-intl/plugin';

// const withNextIntl = createNextIntlPlugin();

// /** @type {import('next').NextConfig} */
// const nextConfig = {

//   images: {
//     domains: ['mouhajer-dashboard.local'],
//   },

// };

// export default withNextIntl(nextConfig);

import createNextIntlPlugin from 'next-intl/plugin';
import dns from 'dns';

const withNextIntl = createNextIntlPlugin();

dns.setDefaultResultOrder('ipv4first');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'mouhajer-dashboard.local',
      'mahermouhajer.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'tupbs9ia8fmtwvjh.public.blob.vercel-storage.com', // Vercel Blob Storage for CMS images
      'mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app', // CMS domain
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=15552000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
