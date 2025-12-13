import { client } from '@/sanity/lib/client';
import { VideoBannerWithCarousel } from './video-banner-with-carousel';

async function getProjectImages() {
  try {
    // Fetch random project images from Sanity
    const images = await client.fetch(`
      *[_type == "project" && defined(mainImage)] | order(_createdAt desc)[0...20] {
        "url": mainImage.asset->url,
        "alt": title.en,
        "title": title.en
      }
    `);

    // If no project images, fetch any images from Sanity
    if (!images || images.length === 0) {
      const fallbackImages = await client.fetch(`
        *[_type == "sanity.imageAsset"] | order(_createdAt desc)[0...20] {
          "url": url,
          "alt": originalFilename,
          "title": originalFilename
        }
      `);
      return fallbackImages;
    }

    return images;
  } catch (error) {
    console.error('Error fetching project images:', error);
    return [];
  }
}

export async function ProjectsHeroBanner() {
  const images = await getProjectImages();

  // YouTube video ID from the provided URL
  // https://www.youtube.com/watch?v=9JeB0zJtPuM
  const videoId = '9JeB0zJtPuM';

  return (
    <VideoBannerWithCarousel
      videoId={videoId}
      images={images}
      title="Our Projects"
      subtitle="Explore our portfolio of exceptional designs and luxury interiors"
    />
  );
}
