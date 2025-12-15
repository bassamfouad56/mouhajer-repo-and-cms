import { client } from '@/sanity/lib/client';
import { VideoBannerWithCarousel } from '../projects/video-banner-with-carousel';

async function getBlogImages() {
  try {
    // Fetch blog post images from Sanity
    const images = await client.fetch(`
      *[_type == "post" && defined(mainImage)] | order(publishedAt desc)[0...20] {
        "url": mainImage.asset->url,
        "alt": title,
        "title": title
      }
    `);

    // If no blog images, fetch any images from Sanity
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
    console.error('Error fetching blog images:', error);
    return [];
  }
}

export async function BlogHeroBanner() {
  const images = await getBlogImages();

  // YouTube video ID from the provided URL
  // https://www.youtube.com/watch?v=pXuTzGer_9U
  const videoId = 'pXuTzGer_9U';

  return (
    <VideoBannerWithCarousel
      videoId={videoId}
      images={images}
      title="Insights & Stories"
      subtitle="Behind-the-scenes insights from 400+ luxury projects across hospitality, residential, and commercial sectors"
    />
  );
}
