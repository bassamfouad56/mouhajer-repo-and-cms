import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProcessPageCinematic } from '@/components/process/process-page-cinematic';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Process | MIDC - From First Sketch to Final Polish',
  description: 'Discover the MIDC Protocol - A methodology built on 25 years of refining the art of delivery. Six phases of integrated precision from discovery to white-glove handover.',
};

async function getProcessImages() {
  try {
    // Fetch project images to use as backgrounds for each process phase
    const projects = await client.fetch(`
      *[_type == "project"] | order(yearCompleted desc) {
        _id,
        title,
        mainImage,
        "galleryImages": gallery[0...10] {
          asset,
          alt
        }
      }
    `);

    // Create an array of background images from projects
    const images: string[] = [];

    for (const project of projects) {
      if (project.mainImage?.asset) {
        const url = urlForImage(project.mainImage)?.width(1920).height(1080).url();
        if (url) images.push(url);
      }

      // Also get some gallery images
      if (project.galleryImages) {
        for (const img of project.galleryImages.slice(0, 3)) {
          if (img?.asset) {
            const url = urlForImage(img)?.width(1920).height(1080).url();
            if (url) images.push(url);
          }
        }
      }
    }

    return images.slice(0, 12); // Return up to 12 images for the 6 phases (2 each)
  } catch (error) {
    console.error('Error fetching process images:', error);
    return [];
  }
}

export default async function ProcessPage() {
  const images = await getProcessImages();

  return (
    <>
      <Header />
      <ProcessPageCinematic images={images} />
      <Footer />
    </>
  );
}
