'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface SafeImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
  fallbackSrc?: string;
}

// Use data URI for fallback to avoid external dependencies
const DEFAULT_FALLBACK = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"%3E%3Crect width="1200" height="800" fill="%23e5e5e5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23737373"%3EImage Not Available%3C/text%3E%3C/svg%3E';

export function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, alt, ...props }: SafeImageProps) {
  // Use fallback immediately if src is empty or null
  const initialSrc = src && src.trim() !== '' ? src : fallbackSrc;

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [hasError, setHasError] = useState(!src || src.trim() === '');
  const [isLoading, setIsLoading] = useState(src && src.trim() !== '');

  // Reset states when src changes
  useEffect(() => {
    const validSrc = src && src.trim() !== '' ? src : fallbackSrc;
    setImgSrc(validSrc);
    setHasError(!src || src.trim() === '');
    setIsLoading(src && src.trim() !== '');
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      console.warn(`Failed to load image: ${src}, using fallback`);
      setHasError(true);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
      )}
      <Image
        {...props}
        src={imgSrc}
        alt={alt || 'Image'}
        onError={handleError}
        onLoad={handleLoad}
        unoptimized={hasError} // Don't optimize fallback SVG
      />
    </>
  );
}
