import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { AboutHero } from '@/components/about/about-hero';
import { AboutIntroServer } from '@/components/about/about-intro-server';
import { AboutEcosystem } from '@/components/about/about-ecosystem';
import { TrustedRecognized } from '@/components/about/trusted-recognized';
import { client } from '@/sanity/lib/client';
import { featuredProjectsQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'About Us | Mouhajer International Design & Contracting',
  description: 'Discover MIDC - A premier turnkey construction solution provider in the UAE. Redefining the art of turnkey construction with 20+ years of excellence in luxury hospitality, residential, and commercial projects.',
  openGraph: {
    title: 'About Us | Mouhajer International Design & Contracting',
    description: 'Discover MIDC - A premier turnkey construction solution provider in the UAE. Redefining the art of turnkey construction.',
    images: [
      {
        url: '',
        width: 1200,
        height: 630,
        alt: 'Mouhajer International Design & Contracting',
      },
    ],
  },
};

async function getFeaturedProjectImages(locale: string) {
  try {
    const projects = await client.fetch(featuredProjectsQuery, { locale });

    // Get 3 featured project images
    const images = (projects || []).slice(0, 3).map((project: any) => {
      if (project.mainImage?.asset) {
        return {
          url: urlForImage(project.mainImage)
            .width(1200)
            .height(800)
            .auto('format')
            .url(),
          alt: project.title || 'MIDC Project',
        };
      }
      return null;
    }).filter(Boolean);

    return images;
  } catch (error) {
    console.error('Error fetching featured project images:', error);
    return [];
  }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const projectImages = await getFeaturedProjectImages(locale);

  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section - Cinematic Video with Main Headline */}
        <AboutHero />

        {/* Main About Us Content - Cinematic with Project Images */}
        <AboutIntroServer projectImages={projectImages} />

        {/* Explore the MIDC Ecosystem - 4 pillars linking to sub-pages */}
        <AboutEcosystem />

        {/* Trusted & Recognized - Press Logos */}
        <TrustedRecognized />
      </main>
      <Footer />
    </>
  );
}
