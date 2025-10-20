/**
 * @mouhajer/types
 * Shared TypeScript types for Mouhajer monorepo
 *
 * This package contains all shared types between CMS and Frontend
 * to ensure type safety and prevent type drift.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type Locale = 'en' | 'ar';

export interface BilingualContent {
  en: string;
  ar: string;
}

export type ContentStatus = 'draft' | 'published';

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export type UserRole = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  active: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MEDIA
// ============================================================================

export type MediaType = 'image' | 'video' | 'document';

export interface MediaFile {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  type: MediaType;
  alt: string | null;
  thumbnail: string | null;
  uploadedAt: Date;
}

// ============================================================================
// PROJECT
// ============================================================================

export interface Project {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  slugEn: string;
  slugAr: string;
  images: string[];
  category: string | null;
  featured: boolean;
  status: ContentStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // SEO
  metaTitleEn: string | null;
  metaTitleAr: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionAr: string | null;
  metaKeywords: string[];
}

// ============================================================================
// SERVICE
// ============================================================================

export interface Service {
  id: string;
  titleEn: string;
  titleAr: string;
  slugEn: string;
  slugAr: string;
  descriptionEn: string;
  descriptionAr: string;
  shortDescriptionEn: string | null;
  shortDescriptionAr: string | null;
  features: string[];
  icon: string | null;
  price: number | null;
  duration: string | null;
  featured: boolean;
  status: ContentStatus;
  relatedServices: string[];
  createdAt: Date;
  updatedAt: Date;
  // SEO
  metaTitleEn: string | null;
  metaTitleAr: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionAr: string | null;
}

// ============================================================================
// BLOG POST
// ============================================================================

export interface BlogPost {
  id: string;
  titleEn: string;
  titleAr: string;
  slugEn: string;
  slugAr: string;
  excerptEn: string | null;
  excerptAr: string | null;
  contentEn: string;
  contentAr: string;
  featuredImage: string | null;
  authorId: string;
  category: string | null;
  tags: string[];
  featured: boolean;
  status: ContentStatus;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // SEO
  metaTitleEn: string | null;
  metaTitleAr: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionAr: string | null;
}

// ============================================================================
// PAGE & PAGE BLOCKS
// ============================================================================

export type PageBlockType =
  | 'hero_banner'
  | 'about_section'
  | 'services_section'
  | 'projects_section'
  | 'testimonials_section'
  | 'cta_section'
  | 'content_section'
  | 'image_gallery'
  | 'video_section'
  | 'faq_section'
  | 'contact_form';

export interface PageBlock {
  id: string;
  pageId: string;
  type: PageBlockType;
  data: Record<string, any>; // Flexible JSON data
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  titleEn: string;
  titleAr: string;
  slugEn: string;
  slugAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  blocks: PageBlock[];
  status: ContentStatus;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  // SEO
  metaTitleEn: string | null;
  metaTitleAr: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionAr: string | null;
  metaKeywords: string[];
}

// ============================================================================
// ADVERTISEMENT
// ============================================================================

export type AdType = 'image' | 'video' | 'html';
export type AdZone = 'header' | 'sidebar' | 'footer' | 'inline' | 'popup' | 'banner';

export interface Advertisement {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string | null;
  descriptionAr: string | null;
  type: AdType;
  zone: AdZone;
  content: string; // URL for image/video, HTML code for html type
  linkUrl: string | null;
  startDate: Date | null;
  endDate: Date | null;
  alwaysActive: boolean;
  targetPages: string[]; // Empty array = all pages
  priority: number;
  impressions: number;
  clicks: number;
  maxImpressions: number | null;
  maxClicks: number | null;
  active: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// SETTINGS
// ============================================================================

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  pinterest?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
}

export interface Settings {
  id: string;
  siteNameEn: string;
  siteNameAr: string;
  siteDescriptionEn: string;
  siteDescriptionAr: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: SocialLinks;
  metaTitleEn: string | null;
  metaTitleAr: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionAr: string | null;
  metaKeywords: string[];
  logo: string | null;
  favicon: string | null;
  primaryColor: string | null;
  updatedAt: Date;
}

// ============================================================================
// ACTIVITY LOG
// ============================================================================

export type ActivityAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'publish'
  | 'unpublish';

export type ActivityResource =
  | 'user'
  | 'project'
  | 'service'
  | 'blog'
  | 'page'
  | 'media'
  | 'settings'
  | 'advertisement';

export interface ActivityLog {
  id: string;
  userId: string;
  action: ActivityAction;
  resource: ActivityResource;
  resourceId: string | null;
  description: string;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

// ============================================================================
// QUERY FILTERS
// ============================================================================

export interface ProjectFilters {
  category?: string;
  featured?: boolean;
  status?: ContentStatus;
  limit?: number;
  offset?: number;
}

export interface BlogFilters {
  category?: string;
  tags?: string[];
  featured?: boolean;
  status?: ContentStatus;
  authorId?: string;
  limit?: number;
  offset?: number;
}

export interface ServiceFilters {
  featured?: boolean;
  status?: ContentStatus;
  limit?: number;
  offset?: number;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  interestedIn?: string;
}

export interface SubscribeFormData {
  email: string;
}

// ============================================================================
// SEO TYPES
// ============================================================================

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

// ============================================================================
// NAVIGATION TYPES
// ============================================================================

export interface NavigationItem {
  id: string;
  labelEn: string;
  labelAr: string;
  href: string;
  order: number;
  parentId: string | null;
  children?: NavigationItem[];
}
