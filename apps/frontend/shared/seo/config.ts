import type { Metadata } from 'next';

const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] ?? 'https://www.mouhajerdesign.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Luxury Interior Design with Distinction | Mouhajer',
    template: '%s | Mouhajer',
  },
  description: 'Luxury Interior Design with Distinction | Mouhajer',
  alternates: {
    canonical: siteUrl,
    languages: {
      en: `${siteUrl}/en`,
      ar: `${siteUrl}/ar`,
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Mouhajer',
    title: 'Luxury Interior Design with Distinction | Mouhajer',
    description: 'Luxury Interior Design with Distinction | Mouhajer',
    images: [{ url: '/og/og-default.jpg', width: 1200, height: 630, alt: 'Mouhajer' }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export type RouteSEO = {
  title?: string;
  description?: string;
  path?: string;
  images?: { url: string; width?: number; height?: number; alt?: string }[];
  canonical?: string;
};

export function buildMetadata(input: RouteSEO = {}): Metadata {
  const url = input.canonical ?? (input.path ? `${siteUrl}${input.path}` : siteUrl);
  return {
    ...defaultMetadata,
    title: input.title
      ? { default: input.title, template: '%s | Mouhajer' }
      : defaultMetadata.title,
    description: input.description ?? defaultMetadata.description,
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en${input.path ?? ''}`,
        ar: `${siteUrl}/ar${input.path ?? ''}`,
      },
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      url,
      // @ts-expect-error next Metadata typing
      title: input.title ?? defaultMetadata.title,
      description: input.description ?? defaultMetadata.description ?? undefined,
      images: input.images ?? (defaultMetadata.openGraph as any)?.images,
    },
  };
}

