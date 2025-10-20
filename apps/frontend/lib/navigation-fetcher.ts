const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3010';

export interface NavItem {
  id: string;
  label: {
    en: string;
    ar: string;
  };
  url: string | null;
  type: 'link' | 'dropdown' | 'mega_menu';
  icon?: string;
  target: string;
  parentId: string | null;
  order: number;
  isActive: boolean;
  openInNewTab: boolean;
  cssClass?: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
  megaMenuColumns?: number;
  megaMenuImage?: string;
  requiresAuth: boolean;
  requiredRoles: string[];
  children: NavItem[];
  createdAt: string;
  updatedAt: string;
}

export interface NavigationData {
  items: NavItem[];
  timestamp: number;
}

let navigationCache: NavigationData | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchNavigation(force: boolean = false): Promise<NavItem[]> {
  // Return cached data if still valid
  if (!force && navigationCache && Date.now() - navigationCache.timestamp < CACHE_DURATION) {
    return navigationCache.items;
  }

  try {
    const response = await fetch(`${CMS_API_URL}/api/navigation/public`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Navigation API failed: ${response.statusText}`);
    }

    const items: NavItem[] = await response.json();

    // Cache the result
    navigationCache = {
      items,
      timestamp: Date.now(),
    };

    return items;
  } catch (error) {
    console.error('Error fetching navigation:', error);

    // Return cached data if available, even if expired
    if (navigationCache) {
      return navigationCache.items;
    }

    // Return empty array as fallback
    return [];
  }
}

export function clearNavigationCache() {
  navigationCache = null;
}

// Helper to get navigation items for a specific locale
export function getLocalizedNavItems(items: NavItem[], locale: 'en' | 'ar') {
  return items.map(item => ({
    ...item,
    localizedLabel: item.label[locale],
    children: item.children ? getLocalizedNavItems(item.children, locale) : [],
  }));
}

// Helper to find nav item by URL
export function findNavItemByUrl(items: NavItem[], url: string): NavItem | null {
  for (const item of items) {
    if (item.url === url) {
      return item;
    }
    if (item.children && item.children.length > 0) {
      const found = findNavItemByUrl(item.children, url);
      if (found) return found;
    }
  }
  return null;
}

// Helper to build breadcrumbs from navigation
export function buildBreadcrumbs(items: NavItem[], currentUrl: string, locale: 'en' | 'ar'): Array<{ label: string; url: string }> {
  const breadcrumbs: Array<{ label: string; url: string }> = [];

  function traverse(navItems: NavItem[], path: Array<{ label: string; url: string }> = []) {
    for (const item of navItems) {
      const currentPath = [...path, { label: item.label[locale], url: item.url || '#' }];

      if (item.url === currentUrl) {
        breadcrumbs.push(...currentPath);
        return true;
      }

      if (item.children && item.children.length > 0) {
        if (traverse(item.children, currentPath)) {
          return true;
        }
      }
    }
    return false;
  }

  traverse(items);
  return breadcrumbs;
}
