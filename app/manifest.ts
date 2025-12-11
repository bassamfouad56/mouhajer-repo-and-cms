import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mouhajer International Design & Contracting',
    short_name: 'MIDC',
    description: 'Award-winning luxury interior design and construction company in Dubai, UAE. Creating timeless spaces since 2009.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#d4af37',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['business', 'lifestyle', 'design'],
    lang: 'en',
    dir: 'ltr',
    prefer_related_applications: false,
  };
}
