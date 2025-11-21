'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string | null | undefined;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  fallbackSrc = 'https://placehold.co/1200x800/e5e5e5/737373?text=Image+Not+Available',
  alt,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.warn(`Failed to load image: ${imgSrc}`);
    setImgSrc(fallbackSrc);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${props.className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
}
