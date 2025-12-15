import { client } from '@/sanity/lib/client';
import { megaMenuImagesQuery } from '@/sanity/lib/queries';
import { Header } from './header';

export interface MegaMenuImages {
  projects: {
    residential: { mainImage: any } | null;
    commercial: { mainImage: any } | null;
    hospitality: { mainImage: any } | null;
    ongoing: { mainImage: any } | null;
    featured: { mainImage: any } | null;
  };
  services: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    mainImage: any;
  }>;
  industries: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    mainImage: any;
  }>;
  posts: {
    designTrends: { mainImage: any } | null;
    projectStories: { mainImage: any } | null;
    materialsCraft: { mainImage: any } | null;
    engineering: { mainImage: any } | null;
    featured: { mainImage: any } | null;
  };
  about: {
    process: { mainImage: any } | null;
    awards: { mainImage: any } | null;
  };
}

async function getMegaMenuImages(): Promise<MegaMenuImages | null> {
  try {
    const images = await client.fetch(megaMenuImagesQuery);
    return images;
  } catch (error) {
    console.error('Error fetching mega menu images:', error);
    return null;
  }
}

export async function ServerHeader() {
  const megaMenuImages = await getMegaMenuImages();

  return <Header megaMenuImages={megaMenuImages} />;
}
