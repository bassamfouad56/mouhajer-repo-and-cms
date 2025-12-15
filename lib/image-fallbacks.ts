/**
 * Image Fallback Utilities
 *
 * Provides fallback images and error handling for missing images
 */

export const FALLBACK_IMAGES = {
  project: '/placeholder.jpg',
  founder: '/placeholder.jpg',
  service: '/placeholder.jpg',
  partner: '/placeholder.jpg',
  award: '/placeholder.jpg',
  hero: '/placeholder.jpg',
  generic: '/placeholder.jpg',
} as const;

export type FallbackImageType = keyof typeof FALLBACK_IMAGES;

/**
 * Get fallback image URL for a specific type
 */
export function getFallbackImage(type: FallbackImageType = 'generic'): string {
  return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.generic;
}

/**
 * Get image URL with fallback
 */
export function getImageWithFallback(
  imageUrl: string | undefined | null,
  fallbackType: FallbackImageType = 'generic'
): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return getFallbackImage(fallbackType);
  }
  return imageUrl;
}

/**
 * Handle image load error
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackType: FallbackImageType = 'generic'
): void {
  const img = event.currentTarget;
  if (img.src !== getFallbackImage(fallbackType)) {
    img.src = getFallbackImage(fallbackType);
  }
}
