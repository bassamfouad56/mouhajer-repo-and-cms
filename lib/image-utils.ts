/**
 * Image utility functions for generating placeholders and handling image URLs
 */

/**
 * Generate a consistent placeholder image for a project
 * Uses data URI to avoid external dependencies
 */
export function getProjectPlaceholder(title: string, category?: string): string {
  const encodedTitle = encodeURIComponent(title);
  const encodedCategory = category ? encodeURIComponent(category.toUpperCase()) : '';

  // Color schemes based on category
  const colorSchemes: Record<string, { bg: string; text: string; accent: string }> = {
    residential: { bg: '#1a1a1a', text: '#ffffff', accent: '#d4af37' },
    commercial: { bg: '#0f172a', text: '#e2e8f0', accent: '#3b82f6' },
    hospitality: { bg: '#18181b', text: '#fafafa', accent: '#d4af37' },
    institutional: { bg: '#27272a', text: '#e4e4e7', accent: '#a855f7' },
    retail: { bg: '#1e1b4b', text: '#e0e7ff', accent: '#8b5cf6' },
  };

  const scheme = colorSchemes[category?.toLowerCase() || 'residential'] || colorSchemes.residential;

  // Create SVG with gradient background and text
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${scheme.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${scheme.bg}ee;stop-opacity:1" />
        </linearGradient>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${scheme.text}08" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="1200" height="800" fill="url(#grad)"/>
      <rect width="1200" height="800" fill="url(#grid)"/>
      ${encodedCategory ? `
        <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle"
              font-family="sans-serif" font-size="16" font-weight="300"
              letter-spacing="4" fill="${scheme.accent}80">${decodeURIComponent(encodedCategory)}</text>
      ` : ''}
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            font-family="sans-serif" font-size="32" font-weight="200"
            fill="${scheme.text}">${decodeURIComponent(encodedTitle)}</text>
      <text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle"
            font-family="sans-serif" font-size="14" font-weight="300"
            fill="${scheme.text}60">Project Placeholder</text>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Get a safe image URL with fallback
 */
export function getSafeImageUrl(imageUrl: string | null | undefined, fallbackTitle?: string, category?: string): string {
  if (!imageUrl) {
    return fallbackTitle
      ? getProjectPlaceholder(fallbackTitle, category)
      : getProjectPlaceholder('MIDC Project', category);
  }

  return imageUrl;
}

/**
 * Check if URL is a valid image URL
 */
export function isValidImageUrl(url: string | null | undefined): boolean {
  if (!url) return false;

  try {
    // Check if it's a data URI
    if (url.startsWith('data:image/')) return true;

    // Check if it's a valid URL
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a loading placeholder (shimmer effect)
 */
export function getLoadingPlaceholder(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#e5e5e5;stop-opacity:1">
            <animate attributeName="stop-color" values="#e5e5e5;#f5f5f5;#e5e5e5" dur="1.5s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" style="stop-color:#f5f5f5;stop-opacity:1">
            <animate attributeName="stop-color" values="#f5f5f5;#e5e5e5;#f5f5f5" dur="1.5s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:#e5e5e5;stop-opacity:1">
            <animate attributeName="stop-color" values="#e5e5e5;#f5f5f5;#e5e5e5" dur="1.5s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#shimmer)"/>
    </svg>
  `.trim();

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
