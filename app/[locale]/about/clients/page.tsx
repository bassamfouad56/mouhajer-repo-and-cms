import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ClientsHero } from '@/components/clients/clients-hero';
import { PartnerLogoMarquee } from '@/components/clients/partner-logo-marquee';
import { FeaturedPartnerships } from '@/components/clients/featured-partnerships';
import { TestimonialSpotlight } from '@/components/clients/testimonial-spotlight';
import { getFeaturedTestimonials } from '@/sanity/lib/fetch';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: 'Our Clients & Partners | MIDC',
  description:
    'Trusted by the Visionaries. We do not just have customers. We have enduring partnerships with the leaders shaping the UAE skyline.',
  openGraph: {
    title: 'Our Clients & Partners | MIDC',
    description:
      "Enduring partnerships with Abu Dhabi National Hotels, Wasl Asset Management, Emaar Hospitality, and the UAE's most prestigious brands.",
    images: [
      {
        url: '/founder/CID_2106_00_COVER.jpg',
        width: 1200,
        height: 630,
        alt: 'MIDC Clients & Partners',
      },
    ],
  },
};

async function getSiteSettings() {
  try {
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
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
      heroImage: getImageUrl(settings?.aboutImage, 2560, 1440),
    };
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', error);
    return { heroImage: '' };
  }
}

export default async function ClientsPage() {
  // Fetch all data in parallel
  const [testimonials, siteSettings] = await Promise.all([
    getFeaturedTestimonials(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Header />
      <main className="relative bg-neutral-950">
        {/* Section 1: Hero with Logo Wall Animation */}
        <ClientsHero heroImage={siteSettings.heroImage || undefined} />

        {/* Section 2: Partner Logo Marquee */}
        <PartnerLogoMarquee />

        {/* Section 3: Featured Partnerships */}
        <FeaturedPartnerships />

        {/* Section 4: Testimonials + CTA */}
        <TestimonialSpotlight testimonials={testimonials} />
      </main>
      <Footer />
    </>
  );
}
