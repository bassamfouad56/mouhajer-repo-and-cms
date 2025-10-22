// CMS API Client for Mouhajer CMS Integration
import { cmsBaseUrl } from '@/lib/cms-config';
import type {
  Project,
  Service,
  BlogPost,
  Page,
  Media,
  Ad,
  Settings,
  NavItem,
} from './cms-types';

// Content-specific revalidation times (in seconds)
// Optimized based on content update frequency for better performance and SEO
const REVALIDATION_TIMES = {
  static: 3600,      // 1 hour - Static pages (privacy, terms)
  dynamic: 300,      // 5 min - Dynamic content (blog, projects)
  realtime: 60,      // 1 min - Frequently updated (homepage blocks, featured content)
  settings: 1800,    // 30 min - Site settings, navigation
  media: 900,        // 15 min - Media library
} as const;

// Helper function for API requests with content-aware caching
async function fetchAPI(endpoint: string, options: RequestInit = {}, revalidate?: number) {
  const url = `${cmsBaseUrl}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      next: { revalidate: revalidate || REVALIDATION_TIMES.dynamic },
    });

    if (!res.ok) {
      throw new Error(`API returned ${res.status} for ${endpoint}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// CMS Client API
export const cmsClient = {
  // ==================== Projects ====================
  async getProjects(): Promise<Project[]> {
    return fetchAPI('/api/projects', {}, REVALIDATION_TIMES.dynamic);
  },

  async getProject(id: string): Promise<Project | null> {
    return fetchAPI(`/api/projects/${id}`, {}, REVALIDATION_TIMES.dynamic);
  },

  async getFeaturedProjects(): Promise<Project[]> {
    const projects = await this.getProjects();
    return Array.isArray(projects) ? projects.filter((p) => p.featured) : [];
  },

  async getProjectsByCategory(category: string): Promise<Project[]> {
    const projects = await this.getProjects();
    return Array.isArray(projects) ? projects.filter((p) => p.category === category) : [];
  },

  async getProjectBySlug(slug: string, locale: 'en' | 'ar' = 'en'): Promise<Project | null> {
    const projects = await this.getProjects();
    return Array.isArray(projects) ? projects.find((p) => p.slug?.[locale] === slug) || null : null;
  },

  // ==================== Services ====================
  async getServices(): Promise<Service[]> {
    return fetchAPI('/api/services', {}, REVALIDATION_TIMES.dynamic);
  },

  async getService(id: string): Promise<Service | null> {
    return fetchAPI(`/api/services/${id}`, {}, REVALIDATION_TIMES.dynamic);
  },

  async getFeaturedServices(): Promise<Service[]> {
    const services = await this.getServices();
    return Array.isArray(services) ? services.filter((s) => s.featured) : [];
  },

  // ==================== Blog ====================
  async getBlogPosts(status: 'published' | 'draft' = 'published'): Promise<BlogPost[]> {
    return fetchAPI(`/api/blog?status=${status}`, {}, REVALIDATION_TIMES.dynamic);
  },

  async getBlogPost(id: string): Promise<BlogPost | null> {
    return fetchAPI(`/api/blog/${id}`, {}, REVALIDATION_TIMES.dynamic);
  },

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts('published');
    return Array.isArray(posts) ? posts.filter((p) => p.featured) : [];
  },

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    const posts = await this.getBlogPosts('published');
    return Array.isArray(posts) ? posts.filter((p) => p.category === category) : [];
  },

  async getBlogPostBySlug(slug: string, locale: 'en' | 'ar' = 'en'): Promise<BlogPost | null> {
    const posts = await this.getBlogPosts('published');
    return Array.isArray(posts) ? posts.find((p) => p.slug?.[locale] === slug) || null : null;
  },

  // ==================== Pages ====================
  async getPages(): Promise<Page[]> {
    return fetchAPI('/api/pages', {}, REVALIDATION_TIMES.static);
  },

  async getPage(id: string): Promise<Page | null> {
    return fetchAPI(`/api/pages/${id}`, {}, REVALIDATION_TIMES.static);
  },

  async getPageBySlug(slug: string, locale: 'en' | 'ar' = 'en'): Promise<Page | null> {
    try {
      const pages = await this.getPages();
      return Array.isArray(pages) ? pages.find((p) => p.slug?.[locale] === slug) || null : null;
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      return null;
    }
  },

  // ==================== Media ====================
  async getMedia(): Promise<Media[]> {
    return fetchAPI('/api/media', {}, REVALIDATION_TIMES.media);
  },

  async getMediaById(id: string): Promise<Media | null> {
    const media = await this.getMedia();
    return Array.isArray(media) ? media.find((m) => m.id === id) || null : null;
  },

  async getMediaByTag(tag: string): Promise<Media[]> {
    const media = await this.getMedia();
    return Array.isArray(media) ? media.filter((m) => m.tags?.includes(tag)) : [];
  },

  // ==================== Ads ====================
  async getAds(active = true): Promise<Ad[]> {
    return fetchAPI(`/api/ads?active=${active}`, {}, REVALIDATION_TIMES.realtime);
  },

  async getAdsByPosition(position: string): Promise<Ad[]> {
    const ads = await this.getAds(true);
    return Array.isArray(ads) ? ads.filter((ad) => ad.zone === position) : [];
  },

  async trackAdClick(id: string): Promise<{ success: boolean }> {
    return fetchAPI(`/api/ads/${id}/track`, { method: 'POST' });
  },

  // ==================== Navigation ====================
  async getNavigation(): Promise<{ header: NavItem[]; footer: any; social?: any }> {
    return fetchAPI('/api/navigation/public', {}, REVALIDATION_TIMES.settings);
  },

  // ==================== Settings ====================
  async getSettings(): Promise<Settings> {
    const data = await fetchAPI('/api/settings', {}, REVALIDATION_TIMES.settings);

    if (!data) {
      throw new Error('Settings API returned no data');
    }

    // Transform CMS response to match expected format
    if (data.seo) {
      // If CMS returns { metaTitle, metaDescription, keywords }
      if (data.seo.metaTitle && data.seo.metaDescription) {
        const allKeywords = Array.isArray(data.seo.keywords) ? data.seo.keywords : [];

        data.seo = {
          en: {
            defaultTitle: data.seo.metaTitle.en || 'Mouhajer International Design',
            defaultDescription: data.seo.metaDescription.en || 'Luxury Interior Design Dubai',
            keywords: allKeywords.filter((k: string) => /^[a-zA-Z]/.test(k))
          },
          ar: {
            defaultTitle: data.seo.metaTitle.ar || 'مهاجر الدولية للتصميم',
            defaultDescription: data.seo.metaDescription.ar || 'تصميم داخلي فاخر دبي',
            keywords: allKeywords.filter((k: string) => /[\u0600-\u06FF]/.test(k))
          }
        };
      } else {
        // SEO object exists but doesn't have metaTitle/metaDescription
        console.warn('[CMS Client] SEO data incomplete, using defaults');
        data.seo = {
          en: {
            defaultTitle: 'Mouhajer International Design',
            defaultDescription: 'Luxury Interior Design Dubai',
            keywords: []
          },
          ar: {
            defaultTitle: 'مهاجر الدولية للتصميم',
            defaultDescription: 'تصميم داخلي فاخر دبي',
            keywords: []
          }
        };
      }
    } else {
      // Provide default SEO if none exists
      console.warn('[CMS Client] No SEO data, using defaults');
      data.seo = {
        en: {
          defaultTitle: 'Mouhajer International Design',
          defaultDescription: 'Luxury Interior Design Dubai',
          keywords: []
        },
        ar: {
          defaultTitle: 'مهاجر الدولية للتصميم',
          defaultDescription: 'تصميم داخلي فاخر دبي',
          keywords: []
        }
      };
    }

    // Add contactPhone if missing (use contactInfo.phone)
    if (!data.contactPhone && data.contactInfo?.phone) {
      data.contactPhone = data.contactInfo.phone;
    }

    // Add contactEmail if missing
    if (!data.contactEmail && data.contactInfo?.email) {
      data.contactEmail = data.contactInfo.email;
    }

    // Add logo if using appearance.logo
    if (!data.logo && data.appearance?.logo) {
      data.logo = data.appearance.logo;
    }

    // Validate final structure
    if (!data.seo || !data.seo.en || !data.seo.ar) {
      console.error('[CMS Client] Settings transformation failed, SEO structure invalid');
    }

    return data;
  },

  // ==================== Content ====================
  async getHomePageContent(locale: 'en' | 'ar' = 'en'): Promise<Page | null> {
    try {
      const page = await this.getPageBySlug('home', locale);
      return page;
    } catch (error) {
      console.error('Failed to fetch homepage content:', error);
      return null;
    }
  },

  // ==================== CRM - Lead Management ====================
  /**
   * Submit a lead to the CMS for tracking and scoring
   * @param leadData Lead information from contact forms
   * @returns Lead ID, score, and status
   */
  async submitLead(leadData: {
    name: string;
    email?: string;
    phone: string;
    company?: string;
    projectType?: string;
    service?: string;
    budgetRange?: string;
    budget?: string;
    propertySize?: string;
    timeline?: string;
    startDate?: string;
    city?: string;
    area?: string;
    projectLocation?: string;
    message?: string;
    projectDescription?: string;
    source?: string;
    locale?: string;
  }): Promise<{
    success: boolean;
    message: string;
    leadId?: string;
    score?: number;
    duplicate?: boolean;
  }> {
    try {
      // For lead submission, we don't want caching - use cache: 'no-store'
      const url = `${cmsBaseUrl}/api/leads`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
        cache: 'no-store', // Don't cache lead submissions
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to submit lead');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to submit lead:', error);
      throw error;
    }
  },
};

// Export cmsBaseUrl for direct use
export { cmsBaseUrl };
