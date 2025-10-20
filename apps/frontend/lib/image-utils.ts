// Image utility functions for CMS media management
import type { Media } from './cms-types';

/**
 * Default placeholder image URL
 * This is a data URI for a simple gray placeholder to avoid broken images
 */
export const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"%3E%3Crect fill="%23f0f0f0" width="800" height="600"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EMouhajer Design%3C/text%3E%3C/svg%3E';

/**
 * Get media items by tag from CMS media array
 * @param media - Array of media items from CMS
 * @param tag - Tag to filter by (e.g., 'awards', 'clients', 'instagram')
 * @param limit - Maximum number of items to return
 * @returns Filtered media array
 */
export function getMediaByTag(media: Media[], tag: string, limit?: number): Media[] {
  const filtered = media.filter((m) => m.tags?.includes(tag));
  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Get a single media item by tag and index
 * @param media - Array of media items from CMS
 * @param tag - Tag to filter by
 * @param index - Index of item to return (default: 0)
 * @returns Media item URL or placeholder
 */
export function getCMSImage(media: Media[], tag: string, index = 0): string {
  const items = getMediaByTag(media, tag);
  return items[index]?.url || PLACEHOLDER_IMAGE;
}

/**
 * Get media item by specific filename
 * @param media - Array of media items from CMS
 * @param filename - Filename to search for (partial match)
 * @returns Media item URL or placeholder
 */
export function getCMSImageByFilename(media: Media[], filename: string): string {
  const item = media.find((m) =>
    m.filename?.toLowerCase().includes(filename.toLowerCase()) ||
    m.alt?.toLowerCase().includes(filename.toLowerCase())
  );
  return item?.url || PLACEHOLDER_IMAGE;
}

/**
 * Get multiple images by tag as array of URLs
 * @param media - Array of media items from CMS
 * @param tag - Tag to filter by
 * @param count - Number of images to return
 * @returns Array of image URLs
 */
export function getCMSImages(media: Media[], tag: string, count?: number): string[] {
  const items = getMediaByTag(media, tag, count);
  return items.map((item) => item.url);
}

/**
 * Get image with fallback chain
 * @param primaryUrl - Primary image URL to try
 * @param fallbackUrl - Fallback URL if primary fails
 * @returns Valid URL or placeholder
 */
export function getImageWithFallback(primaryUrl?: string | null, fallbackUrl?: string): string {
  return primaryUrl || fallbackUrl || PLACEHOLDER_IMAGE;
}

/**
 * Validate if URL is a valid image URL
 * @param url - URL to validate
 * @returns boolean
 */
export function isValidImageUrl(url?: string | null): boolean {
  if (!url) return false;
  if (url.startsWith('data:image')) return true;
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  if (url.startsWith('/')) return true;
  return false;
}

/**
 * Get optimized image URL from CMS with optional transformations
 * @param media - Media item
 * @param width - Desired width
 * @param quality - Image quality (1-100)
 * @returns Optimized URL
 */
export function getOptimizedImageUrl(
  media: Media,
  width?: number,
  quality?: number
): string {
  // If CMS provides thumbnailUrl and width is small, use thumbnail
  if (width && width <= 400 && media.thumbnailUrl) {
    return media.thumbnailUrl;
  }

  // Otherwise use full URL
  // Note: Vercel Blob Storage auto-optimizes images
  return media.url;
}

/**
 * Safe image props for Next.js Image component
 * @param url - Image URL
 * @param alt - Alt text
 * @returns Object with src, alt, and onError handler
 */
export function getSafeImageProps(url?: string | null, alt = 'Mouhajer Design') {
  return {
    src: isValidImageUrl(url) ? url! : PLACEHOLDER_IMAGE,
    alt,
    onError: (e: any) => {
      // Fallback to placeholder if image fails to load
      if (e.currentTarget) {
        e.currentTarget.src = PLACEHOLDER_IMAGE;
      }
    },
  };
}

/**
 * Extract media from CMS settings by category
 * @param settings - CMS settings object
 * @param category - Category key (e.g., 'logo', 'favicon', 'ogImage')
 * @returns Image URL or placeholder
 */
export function getSettingsImage(settings: any, category: string): string {
  const url = settings?.[category];
  return isValidImageUrl(url) ? url : PLACEHOLDER_IMAGE;
}
