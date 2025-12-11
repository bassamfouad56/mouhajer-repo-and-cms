/**
 * Project Images Utility
 *
 * NOTE: All images are now served from Sanity CMS.
 * This file provides placeholder utilities for when Sanity images are not yet configured.
 */

// Placeholder image (for development when Sanity images are not yet uploaded)
export const placeholderImage = '/placeholder.jpg';

// Helper function to safely get an image URL with fallback to placeholder
export function getSafeImageUrl(url: string | null | undefined): string {
  return url || placeholderImage;
}

// Helper function to check if an image URL is valid
export function isValidImageUrl(url: string | null | undefined): boolean {
  return Boolean(url && url.length > 0 && url !== placeholderImage);
}

// Type for Sanity image reference
export interface SanityImageRef {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Helper to check if a value is a Sanity image reference
export function isSanityImage(value: unknown): value is SanityImageRef {
  return (
    typeof value === 'object' &&
    value !== null &&
    '_type' in value &&
    (value as SanityImageRef)._type === 'image' &&
    'asset' in value
  );
}
