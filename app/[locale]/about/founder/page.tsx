import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FounderHero } from '@/components/founder/founder-hero';
import { DualitiesSection } from '@/components/founder/dualities-section';
import { UnitySection } from '@/components/founder/unity-section';
import { StandardsSection } from '@/components/founder/standards-section';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'The Founder | Eng. Maher Mouhajer | MIDC',
  description: 'Discover the visionary behind MIDC - Eng. Maher Mouhajer. A design philosophy defined by dualities: European precision and Arabian warmth. Curating visual splendor for the Middle East\'s most discerning clientele.',
  openGraph: {
    title: 'The Founder | Eng. Maher Mouhajer | MIDC',
    description: 'The Mind Behind the Masterpiece - Eng. Maher Mouhajer\'s philosophy of blending European precision with Arabian warmth.',
    images: [
      {
        url: '/founder/CID_2106_00_COVER.jpg',
        width: 1200,
        height: 630,
        alt: 'Eng. Maher Mouhajer - CEO & Founder of MIDC',
      },
    ],
  },
};

async function getFounderData() {
  try {
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        founderName,
        founderTitle,
        founderImage,
        founderQuote,
        aboutImage
      }
    `);

    const getImageUrl = (image: any, width = 1920, height = 1080): string => {
      if (!image?.asset) return '';
      try {
        return urlForImage(image)
          .width(width)
          .height(height)
          .auto('format')
          .url();
      } catch {
        return '';
      }
    };

    return {
      founderName: settings?.founderName || 'Eng. Maher Mouhajer',
      founderTitle: settings?.founderTitle || 'CEO & Founder',
      founderImage: getImageUrl(settings?.founderImage, 1600, 2000),
      founderQuote: settings?.founderQuote || '',
      aboutImage: getImageUrl(settings?.aboutImage, 1920, 1080),
    };
  } catch (error) {
    console.error('Error fetching founder data from Sanity:', error);
    return {
      founderName: 'Eng. Maher Mouhajer',
      founderTitle: 'CEO & Founder',
      founderImage: '',
      founderQuote: '',
      aboutImage: '',
    };
  }
}

export default async function FounderPage() {
  const founderData = await getFounderData();

  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section - Eng. Maher on site with team, drone shot */}
        <FounderHero
          heroImage={founderData.founderImage || undefined}
          founderName={founderData.founderName}
          founderTitle={founderData.founderTitle}
        />

        {/* Section 1: Defined by Dualities - Design Philosophy */}
        <DualitiesSection />

        {/* Section 2: Unity is Strength - Leadership & In-house Teams */}
        <UnitySection />

        {/* Section 3: Allergic to Average - The MIDC Standard */}
        <StandardsSection />
      </main>
      <Footer />
    </>
  );
}
