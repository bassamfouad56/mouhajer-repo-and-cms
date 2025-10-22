import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'localhost',
      'mahermouhajer.com',
      'images.unsplash.com',
      'tupbs9ia8fmtwvjh.public.blob.vercel-storage.com',
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3010/api/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);