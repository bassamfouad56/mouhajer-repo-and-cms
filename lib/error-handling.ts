/**
 * Comprehensive Error Handling Utilities
 *
 * This file provides type-safe error handling utilities for the entire application.
 * Use these helpers to prevent runtime errors and provide graceful fallbacks.
 */

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if a value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if a value is a valid array with items
 */
export function isNonEmptyArray<T>(value: unknown): value is T[] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Check if an object has a specific property
 */
export function hasProperty<T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return obj && typeof obj === 'object' && key in obj;
}

// ============================================================================
// SAFE ACCESSORS
// ============================================================================

/**
 * Safely get a nested property value
 * @example
 * const url = safeGet(project, 'featuredImage.node.sourceUrl', 'default.jpg');
 */
export function safeGet<T, D>(
  obj: any,
  path: string,
  defaultValue: D
): T | D {
  try {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result === null || result === undefined) {
        return defaultValue;
      }
      result = result[key];
    }

    return isDefined(result) ? result : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Safely parse JSON with fallback
 */
export function safeJsonParse<T>(
  json: string,
  fallback: T
): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Safely convert value to number
 */
export function safeNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

/**
 * Safely convert value to string
 */
export function safeString(value: unknown, fallback: string = ''): string {
  if (typeof value === 'string') {
    return value;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  try {
    return String(value);
  } catch {
    return fallback;
  }
}

// ============================================================================
// IMAGE HANDLING
// ============================================================================

const DEFAULT_IMAGE_URL = 'https://placehold.co/1200x800/e5e5e5/737373?text=Image+Not+Available';

export interface ImageData {
  sourceUrl?: string | null;
  url?: string | null;
  altText?: string | null;
  alt?: string | null;
  width?: number;
  height?: number;
}

/**
 * Safely extract image URL from various data structures
 */
export function getSafeImageUrl(
  image: ImageData | string | null | undefined,
  fallback: string = DEFAULT_IMAGE_URL
): string {
  // Direct string
  if (isNonEmptyString(image)) {
    return image;
  }

  // Image object
  if (image && typeof image === 'object') {
    // Try sourceUrl first (Sanity/WordPress)
    if (isNonEmptyString(image.sourceUrl)) {
      return image.sourceUrl;
    }
    // Try url (other CMSs)
    if (isNonEmptyString(image.url)) {
      return image.url;
    }
  }

  return fallback;
}

/**
 * Safely extract alt text from image data
 */
export function getSafeAltText(
  image: ImageData | null | undefined,
  fallback: string = 'Image'
): string {
  if (!image || typeof image !== 'object') {
    return fallback;
  }

  // Try altText first (Sanity/WordPress)
  if (isNonEmptyString(image.altText)) {
    return image.altText;
  }

  // Try alt (other CMSs)
  if (isNonEmptyString(image.alt)) {
    return image.alt;
  }

  return fallback;
}

/**
 * Filter array of images to only valid ones
 */
export function filterValidImages(
  images: (ImageData | null | undefined)[]
): ImageData[] {
  if (!isNonEmptyArray(images)) {
    return [];
  }

  return images.filter((img): img is ImageData => {
    if (!img || typeof img !== 'object') return false;
    return isNonEmptyString(img.sourceUrl) || isNonEmptyString(img.url);
  });
}

// ============================================================================
// DATA VALIDATION
// ============================================================================

/**
 * Validate and sanitize project data
 */
export function validateProject(project: any): boolean {
  if (!project || typeof project !== 'object') return false;
  if (!isNonEmptyString(project.title)) return false;
  if (!isNonEmptyString(project.slug)) return false;
  return true;
}

/**
 * Validate and sanitize array data
 */
export function validateArray<T>(
  data: unknown,
  validator: (item: unknown) => item is T
): T[] {
  if (!isNonEmptyArray(data)) return [];
  return data.filter(validator);
}

// ============================================================================
// ERROR BOUNDARIES
// ============================================================================

/**
 * Wrap async function with error handling
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  onError?: (error: Error) => void
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    }
    console.error('Async operation failed:', error);
    return fallback;
  }
}

/**
 * Wrap synchronous function with error handling
 */
export function safeTry<T>(
  fn: () => T,
  fallback: T,
  onError?: (error: Error) => void
): T {
  try {
    return fn();
  } catch (error) {
    if (onError && error instanceof Error) {
      onError(error);
    }
    console.error('Operation failed:', error);
    return fallback;
  }
}

// ============================================================================
// CMS DATA HELPERS
// ============================================================================

/**
 * Safely extract featured image from CMS data
 */
export function getFeaturedImage(data: any): ImageData | null {
  // Direct image object
  if (data?.sourceUrl || data?.url) {
    return data;
  }

  // Nested in featuredImage
  if (data?.featuredImage) {
    // Sanity structure
    if (data.featuredImage.asset) {
      return {
        sourceUrl: data.featuredImage.asset.url,
        altText: data.featuredImage.alt,
      };
    }
    // WordPress structure
    if (data.featuredImage.node) {
      return {
        sourceUrl: data.featuredImage.node.sourceUrl,
        altText: data.featuredImage.node.altText,
      };
    }
    // Direct structure
    if (data.featuredImage.sourceUrl || data.featuredImage.url) {
      return data.featuredImage;
    }
  }

  return null;
}

/**
 * Safely extract gallery images from CMS data
 */
export function getGalleryImages(data: any): ImageData[] {
  const gallery = data?.gallery || data?.acfFields?.gallery || [];

  if (!isNonEmptyArray(gallery)) {
    return [];
  }

  return gallery
    .map((img: any) => {
      // Sanity structure
      if (img?.asset?.url) {
        return {
          sourceUrl: img.asset.url,
          altText: img.alt || img.caption,
        };
      }
      // WordPress structure
      if (img?.sourceUrl) {
        return {
          sourceUrl: img.sourceUrl,
          altText: img.altText,
        };
      }
      return null;
    })
    .filter((img): img is ImageData => img !== null);
}

/**
 * Safely get excerpt/description
 */
export function getSafeExcerpt(data: any, maxLength: number = 160): string {
  const sources = [
    data?.excerpt,
    data?.description,
    data?.acfFields?.projectDescription,
    data?.content,
  ];

  for (const source of sources) {
    if (isNonEmptyString(source)) {
      // Strip HTML tags
      const stripped = source.replace(/<[^>]*>/g, '');
      // Trim and limit length
      const trimmed = stripped.trim();
      if (trimmed.length > maxLength) {
        return trimmed.substring(0, maxLength) + '...';
      }
      return trimmed;
    }
  }

  return '';
}

// ============================================================================
// LOCALIZATION HELPERS
// ============================================================================

/**
 * Localized field structure from Sanity
 */
export interface LocalizedField {
  ar?: string;
  en?: string;
  [key: string]: string | undefined;
}

/**
 * Check if a value is a localized field object
 */
export function isLocalizedField(value: unknown): value is LocalizedField {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    ('ar' in value || 'en' in value)
  );
}

/**
 * Safely extract the correct locale value from a field
 * Handles both simple strings and localized objects {ar, en}
 */
export function getLocalizedValue(
  value: string | LocalizedField | null | undefined,
  locale: string = 'en',
  fallback: string = ''
): string {
  // Null or undefined
  if (value === null || value === undefined) {
    return fallback;
  }

  // Already a string
  if (typeof value === 'string') {
    return value;
  }

  // Localized object
  if (isLocalizedField(value)) {
    // Try the requested locale first
    if (isNonEmptyString(value[locale])) {
      return value[locale]!;
    }
    // Fallback to English
    if (isNonEmptyString(value.en)) {
      return value.en!;
    }
    // Fallback to Arabic
    if (isNonEmptyString(value.ar)) {
      return value.ar!;
    }
  }

  return fallback;
}

/**
 * Transform an object with potentially localized fields
 * Converts all {ar, en} fields to the correct locale value
 */
export function localizeObject<T extends Record<string, any>>(
  obj: T,
  locale: string = 'en'
): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const result = { ...obj };

  for (const key of Object.keys(result)) {
    const value = result[key];

    if (isLocalizedField(value)) {
      result[key] = getLocalizedValue(value, locale, '');
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? localizeObject(item, locale)
          : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = localizeObject(value, locale);
    }
  }

  return result;
}

// ============================================================================
// URL HANDLING
// ============================================================================

/**
 * Safely construct URL with fallback
 */
export function getSafeUrl(
  url: string | null | undefined,
  fallback: string = '/'
): string {
  if (!isNonEmptyString(url)) {
    return fallback;
  }

  try {
    // Check if it's a valid URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      new URL(url); // Throws if invalid
      return url;
    }
    // Relative URL
    return url.startsWith('/') ? url : `/${url}`;
  } catch {
    return fallback;
  }
}

/**
 * Safely construct slug URL
 */
export function getSlugUrl(
  slug: string | null | undefined,
  base: string = ''
): string {
  if (!isNonEmptyString(slug)) {
    return base || '/';
  }

  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
  const cleanBase = base.replace(/^\/+|\/+$/g, '');

  if (cleanBase) {
    return `/${cleanBase}/${cleanSlug}`;
  }

  return `/${cleanSlug}`;
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Safe console error with context
 */
export function logError(message: string, error?: unknown, context?: any): void {
  console.error(`[Error] ${message}`, {
    error,
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Safe console warning
 */
export function logWarning(message: string, context?: any): void {
  console.warn(`[Warning] ${message}`, {
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Development-only logging
 */
export function logDev(message: string, data?: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Dev] ${message}`, data);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const ErrorHandling = {
  // Type guards
  isDefined,
  isNonEmptyString,
  isNonEmptyArray,
  hasProperty,
  isLocalizedField,

  // Safe accessors
  safeGet,
  safeJsonParse,
  safeNumber,
  safeString,

  // Image handling
  getSafeImageUrl,
  getSafeAltText,
  filterValidImages,

  // Data validation
  validateProject,
  validateArray,

  // Error boundaries
  safeAsync,
  safeTry,

  // CMS helpers
  getFeaturedImage,
  getGalleryImages,
  getSafeExcerpt,

  // Localization helpers
  getLocalizedValue,
  localizeObject,

  // URL handling
  getSafeUrl,
  getSlugUrl,

  // Logging
  logError,
  logWarning,
  logDev,
};

export default ErrorHandling;
