import { cache } from 'react';

export interface GlobalComponent {
  id: string;
  type: string;
  displayName: string;
  data: any;
  enabled: boolean;
}

/**
 * Fetch all enabled global components
 */
export const fetchGlobalComponents = cache(async (lang: string = 'en'): Promise<GlobalComponent[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/global-components?lang=${lang}`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!response.ok) {
      throw new Error('Failed to fetch global components');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching global components:', error);
    return [];
  }
});

/**
 * Fetch a specific global component by type
 */
export const fetchGlobalComponentByType = cache(async (
  type: string,
  lang: string = 'en'
): Promise<GlobalComponent | null> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/global-components?type=${type}&lang=${lang}`,
      {
        next: { revalidate: 60 }, // Revalidate every minute
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch global component: ${type}`);
    }

    const components = await response.json();
    return components[0] || null;
  } catch (error) {
    console.error(`Error fetching global component ${type}:`, error);
    return null;
  }
});