import { client } from '@/sanity/lib/client';
import { megaMenuImagesQuery } from '@/sanity/lib/queries';
import { MegaMenuImagesProvider } from './mega-menu-images-provider';
import type { MegaMenuImages } from '../server-header';

async function getMegaMenuImages(): Promise<MegaMenuImages | null> {
  try {
    const images = await client.fetch(megaMenuImagesQuery, {}, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    return images;
  } catch (error) {
    console.error('Error fetching mega menu images:', error);
    return null;
  }
}

interface MegaMenuImagesServerProviderProps {
  children: React.ReactNode;
}

export async function MegaMenuImagesServerProvider({ children }: MegaMenuImagesServerProviderProps) {
  const images = await getMegaMenuImages();

  return (
    <MegaMenuImagesProvider images={images}>
      {children}
    </MegaMenuImagesProvider>
  );
}
