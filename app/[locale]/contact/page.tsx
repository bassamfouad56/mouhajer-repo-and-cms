import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import ContactPageContent from './contact-page-content';

export const metadata: Metadata = {
  title: 'Contact Us | MIDC - Start Your Project Journey',
  description: 'Connect with MIDC for luxury interior design and construction services. Visit our Downtown Dubai headquarters or schedule a consultation with our team.',
  openGraph: {
    title: 'Contact Us | MIDC - Start Your Project Journey',
    description: 'Connect with MIDC for luxury interior design and construction services. Visit our Downtown Dubai headquarters or schedule a consultation with our team.',
  },
};

export const revalidate = 3600;

async function getContactImages() {
  try {
    // First try to get images from site settings
    const settings = await client.fetch(`
      *[_type == "siteSettings"][0] {
        contactBackgroundImage
      }
    `);

    // Helper to get image URL from Sanity
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

    // If we have a contact background image from settings, use it
    if (settings?.contactBackgroundImage?.asset) {
      return {
        bannerImage: getImageUrl(settings.contactBackgroundImage),
        ctaImage: getImageUrl(settings.contactBackgroundImage), // Can use same or different
      };
    }

    // Fallback: fetch a random project image from Sanity
    const projects = await client.fetch(`
      *[_type == "project" && defined(mainImage)] | order(publishedAt desc)[0...5] {
        "imageUrl": mainImage.asset->url,
        mainImage
      }
    `);

    if (projects && projects.length > 0) {
      const randomProject = projects[Math.floor(Math.random() * projects.length)];
      const projectImageUrl = randomProject.mainImage
        ? getImageUrl(randomProject.mainImage)
        : randomProject.imageUrl || '';

      return {
        bannerImage: projectImageUrl,
        ctaImage: projects.length > 1
          ? (projects[1].mainImage ? getImageUrl(projects[1].mainImage) : projects[1].imageUrl || '')
          : projectImageUrl,
      };
    }

    // Ultimate fallback - return empty strings (component will use defaults)
    return {
      bannerImage: '',
      ctaImage: '',
    };
  } catch (error) {
    console.error('Error fetching contact images from Sanity:', error);
    return {
      bannerImage: '',
      ctaImage: '',
    };
  }
}

export default async function ContactPage() {
  const { bannerImage, ctaImage } = await getContactImages();

  return (
    <>
      <Header />
      <ContactPageContent
        bannerImage={bannerImage || undefined}
        ctaImage={ctaImage || undefined}
      />
      <Footer />
    </>
  );
}
