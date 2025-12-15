'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { MegaMenuImages } from '../server-header';

const MegaMenuImagesContext = createContext<MegaMenuImages | null>(null);

export function useMegaMenuImages() {
  return useContext(MegaMenuImagesContext);
}

interface MegaMenuImagesProviderProps {
  children: ReactNode;
  images: MegaMenuImages | null;
}

export function MegaMenuImagesProvider({ children, images }: MegaMenuImagesProviderProps) {
  return (
    <MegaMenuImagesContext.Provider value={images}>
      {children}
    </MegaMenuImagesContext.Provider>
  );
}
