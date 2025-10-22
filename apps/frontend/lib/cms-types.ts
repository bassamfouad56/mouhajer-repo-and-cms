// TypeScript interfaces for Mouhajer CMS
// Generated from Prisma schema and API transformations
// Last updated: 2025-10-08

export interface BilingualContent {
  en: string;
  ar: string;
}

export interface SEO {
  en: {
    defaultTitle?: string;
    defaultDescription?: string;
    title?: string;
    description?: string;
    keywords?: string[];
  };
  ar: {
    defaultTitle?: string;
    defaultDescription?: string;
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  active: boolean;
  avatar?: string;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Project - matches API response from /api/projects
export interface Project {
  id: string;
  title: BilingualContent;
  slug: BilingualContent;
  description: BilingualContent;
  content?: BilingualContent;
  images: string[]; // Array of image URLs
  category: string;
  location?: string; // Optional location field
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  featuredImage?: {
    id: string;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  gallery?: Array<{
    id: string;
    url: string;
    alt?: BilingualContent;
    caption?: BilingualContent;
  }>;
  acf?: {
    key_facts_title?: BilingualContent;
    key_facts?: Array<{
      id?: string | number;
      subtitle: BilingualContent;
      title: BilingualContent;
    }>;
    [key: string]: any;
  };
  seo?: {
    metaTitle?: BilingualContent;
    metaDescription?: BilingualContent;
    keywords?: string[];
    ogImage?: string;
  };
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  publishedAt?: string; // ISO string
}

// Service - matches API response from /api/services
export interface Service {
  id: string;
  title: BilingualContent;
  slug: BilingualContent;
  description: BilingualContent;
  shortDescription: BilingualContent;
  icon?: string | null;
  images: string[];
  features: {
    en: string[];
    ar: string[];
  };
  price?: string | null;
  duration?: string | null;
  featured: boolean;
  status: 'published' | 'draft';
  seo?: {
    metaTitleEn?: string;
    metaTitleAr?: string;
    metaDescEn?: string;
    metaDescAr?: string;
    keywordsEn: string[];
    keywordsAr: string[];
  };
  targetLocations?: string[];
  serviceArea?: string[];
  faqs?: any;
  relatedServiceIds?: string[];
  viewCount?: number;
  averageRating?: number | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// BlogPost - matches API response from /api/blog
export interface BlogPost {
  id: string;
  title: BilingualContent;
  slug: BilingualContent;
  excerpt: BilingualContent;
  content: BilingualContent;
  featuredImage: string | null;
  category: string | null;
  tags: string[];
  author?: {
    id: string;
    name: string;
    avatar?: string;
    bio?: BilingualContent;
  } | string | null;
  readTime?: number;
  views?: number;
  publishedAt: string | null; // ISO string
  featured: boolean;
  status: 'draft' | 'published';
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface PageBlock {
  id: string;
  type: CMSBlockType;
  order: number;
  data: CMSBlockData;
}

export type CMSBlockType =
  | 'hero_banner'
  | 'about_section'
  | 'projects_section'
  | 'services_section'
  | 'team_section'
  | 'testimonials_section'
  | 'contact_section'
  | 'cta_section'
  | 'text_content'
  | 'image_gallery'
  | 'gallery_section'
  | 'video_section'
  | 'stats_section'
  | 'faq_section'
  | 'blog_section'
  | 'partners_section'
  | 'press_articles'
  | 'key_facts_section'
  | 'vision_mission_section'
  | 'timeline_section';

export type CMSBlockData =
  | HeroBannerData
  | AboutSectionData
  | ProjectsSectionData
  | ServicesSectionData
  | TestimonialsSectionData
  | ContactSectionData
  | CTASectionData
  | TextContentData
  | ImageGalleryData
  | GallerySectionData
  | VideoSectionData
  | StatsSectionData
  | FAQSectionData
  | BlogSectionData
  | PartnersSectionData
  | PressArticlesData
  | KeyFactsSectionData
  | VisionMissionSectionData
  | TimelineSectionData;

// ==================== Block-specific Data Types ====================

export interface HeroBannerData {
  title: BilingualContent;
  subtitle?: BilingualContent;
  backgroundImage?: string;
  ctaText?: BilingualContent;
  ctaLink?: string;
  showScrollIndicator?: boolean;
}

export interface AboutSectionData {
  title: BilingualContent;
  content: BilingualContent;
  image?: string;
  features?: BilingualContent[];
  layout?: 'left' | 'right' | 'center';
}

export interface ProjectsSectionData {
  title: BilingualContent;
  subtitle?: BilingualContent;
  showFeatured?: boolean;
  limit?: number;
  category?: string;
  layout?: 'grid' | 'masonry' | 'carousel';
}

export interface ServicesSectionData {
  title: BilingualContent;
  subtitle?: BilingualContent;
  showFeatured?: boolean;
  limit?: number;
  layout?: 'grid' | 'list' | 'cards';
}

export interface TestimonialsSectionData {
  title: BilingualContent;
  testimonials?: Array<{
    id?: string;
    name: string;
    role?: BilingualContent;
    company?: string;
    content: BilingualContent;
    image?: string;
    rating?: number;
  }>;
  layout?: 'carousel' | 'grid';
}

export interface ContactSectionData {
  title: BilingualContent;
  subtitle?: BilingualContent;
  showForm?: boolean;
  showMap?: boolean;
  showContactInfo?: boolean;
}

export interface CTASectionData {
  title: BilingualContent;
  description?: BilingualContent;
  primaryCta?: {
    text: BilingualContent;
    link: string;
  };
  secondaryCta?: {
    text: BilingualContent;
    link: string;
  };
  backgroundImage?: string;
  backgroundColor?: string;
}

export interface TextContentData {
  content: BilingualContent;
  layout?: 'single-column' | 'two-columns' | 'centered';
  backgroundColor?: string;
}

export interface ImageGalleryData {
  title?: BilingualContent;
  images: Array<{
    url: string;
    alt?: BilingualContent;
    caption?: BilingualContent;
  }>;
  layout?: 'grid' | 'masonry' | 'carousel';
  columns?: number;
}

export interface GallerySectionData {
  title?: BilingualContent;
  images: Array<{
    id: string;
    url: string;
    alt?: BilingualContent;
    caption?: BilingualContent;
  }>;
  layout?: 'grid' | 'masonry';
  columns?: number;
}

export interface VideoSectionData {
  title?: BilingualContent;
  videoUrl: string;
  thumbnail?: string;
  autoplay?: boolean;
  loop?: boolean;
}

export interface StatsSectionData {
  title?: BilingualContent;
  stats: Array<{
    label: BilingualContent;
    value: string | number;
    suffix?: string;
    icon?: string;
  }>;
  layout?: 'horizontal' | 'grid';
}

export interface FAQSectionData {
  title: BilingualContent;
  faqs: Array<{
    question: BilingualContent;
    answer: BilingualContent;
  }>;
}

export interface BlogSectionData {
  title: BilingualContent;
  subtitle?: BilingualContent;
  showFeatured?: boolean;
  limit?: number;
  category?: string;
  layout?: 'grid' | 'list' | 'masonry';
}

export interface PartnersSectionData {
  title?: BilingualContent;
  partners: Array<{
    name: string;
    logo: string;
    website?: string;
  }>;
  layout?: 'grid' | 'carousel';
}

export interface PressArticlesData {
  title?: BilingualContent;
  articles: Array<{
    id: string;
    title: BilingualContent;
    source: string;
    url: string;
    date: string;
    image?: string;
  }>;
}

export interface KeyFactsSectionData {
  title?: BilingualContent;
  facts: Array<{
    id?: string | number;
    subtitle: BilingualContent;
    title: BilingualContent;
  }>;
}

export interface VisionMissionSectionData {
  vision: {
    title: BilingualContent;
    subtitle: BilingualContent;
    description: BilingualContent;
    highlights: Array<{
      icon: string;
      title: BilingualContent;
      text: BilingualContent;
    }>;
  };
  mission: {
    title: BilingualContent;
    subtitle: BilingualContent;
    description: BilingualContent;
    highlights: Array<{
      icon: string;
      title: BilingualContent;
      text: BilingualContent;
    }>;
  };
}

export interface TimelineSectionData {
  title?: BilingualContent;
  items: Array<{
    id: string | number;
    year: string;
    title: BilingualContent;
    desc: BilingualContent;
    img: string;
    dateLeft: string;
    dateRight: string;
  }>;
}

export interface Page {
  id: string;
  title: BilingualContent;
  slug: BilingualContent;
  description?: BilingualContent;
  blocks: PageBlock[];
  status: 'draft' | 'published' | 'archived';
  template?: string;
  featured: boolean;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Media - matches API response from /api/media
export interface Media {
  id: string;
  filename: string;
  originalName: string;
  url: string; // Vercel Blob URL
  thumbnailUrl?: string | null;
  mimeType: string;
  size: number; // Bytes
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  type: 'image' | 'video' | 'document';
  tags?: string[]; // For filtering by category
  uploadedAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Advertisement - matches API response from /api/ads
export interface Ad {
  id: string;
  title: BilingualContent;
  description?: BilingualContent | null;
  image?: string | null;
  videoUrl?: string | null;
  linkUrl: string;
  ctaText?: BilingualContent | null;
  zone: 'header' | 'sidebar' | 'footer' | 'inline' | 'popup' | 'banner';
  type: 'image' | 'video' | 'html';
  htmlContent?: BilingualContent | null;
  startDate: string; // ISO string
  endDate: string; // ISO string
  alwaysActive: boolean;
  pages: string[];
  showOnAllPages: boolean;
  priority: number;
  clickCount: number;
  impressionCount: number;
  maxImpressions?: number | null;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Settings - matches API response from /api/settings
export interface Settings {
  id: string;
  siteName: BilingualContent;
  siteDescription: BilingualContent;
  contactEmail?: string | null;
  contactPhone?: string | null;
  contactMobile?: string | null;
  contactAddress?: BilingualContent | null;
  contactImages?: string[];
  addresses?: {
    headquarters?: string;
    businessBay?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: BilingualContent;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  appearance?: {
    logo?: string;
    favicon?: string;
    primaryColor?: string;
  };
  logo?: string;
  logoUrl?: string;
  favicon?: string;
  faviconUrl?: string;
  primaryColor?: string;
  seo: SEO;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  resource: 'project' | 'service' | 'blog' | 'page' | 'media' | 'settings' | 'user';
  resourceId?: string | null;
  details?: Record<string, any> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

// Navigation Menu Item
export interface NavItem {
  id: string;
  label: BilingualContent;
  url?: string | null;
  type: 'link' | 'dropdown' | 'mega_menu';
  icon?: string | null;
  target: '_self' | '_blank';
  parentId?: string | null;
  order: number;
  isActive: boolean;
  openInNewTab: boolean;
  cssClass?: string | null;
  badge?: string | null;
  badgeColor?: string | null;
  description?: string | null;
  megaMenuColumns?: number | null;
  megaMenuImage?: string | null;
  requiresAuth: boolean;
  requiredRoles: string[];
  children?: NavItem[];
  parent?: NavItem | null;
  createdAt: string;
  updatedAt: string;
}

// Helper type for API responses
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  status?: number;
};

// Helper type for paginated responses
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
};
