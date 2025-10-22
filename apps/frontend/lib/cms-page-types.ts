// Dynamic Page Types from CMS

export interface PageBlock {
  id: string;
  type: string;
  data: Record<string, any>;
  order: number;
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  description: string;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  blocks: PageBlock[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

// Block Types
export type BlockType =
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
  | 'video_section'
  | 'stats_section'
  | 'faq_section'
  | 'blog_section'
  | 'partners_section';

// Block Data Interfaces
export interface HeroBannerData {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
  showScrollIndicator?: boolean;
}

export interface AboutSectionData {
  title: string;
  content: string;
  image?: string;
  features?: string[];
  layout?: 'left' | 'right' | 'center';
}

export interface ProjectsSectionData {
  title: string;
  subtitle?: string;
  showFeatured?: boolean;
  limit?: number;
  category?: string;
  layout?: 'grid' | 'masonry' | 'carousel';
}

export interface ServicesSectionData {
  title: string;
  subtitle?: string;
  showFeatured?: boolean;
  limit?: number;
  layout?: 'grid' | 'list' | 'cards';
}

export interface TestimonialsSectionData {
  title: string;
  testimonials?: Array<{
    id?: string;
    name: string;
    role?: string;
    company?: string;
    content: string;
    image?: string;
    rating?: number;
  }>;
  layout?: 'carousel' | 'grid';
}

export interface ContactSectionData {
  title: string;
  subtitle?: string;
  showForm?: boolean;
  showMap?: boolean;
  showContactInfo?: boolean;
}

export interface TextContentData {
  content: string;
  layout?: 'single-column' | 'two-columns' | 'centered';
  backgroundColor?: string;
}

export interface ImageGalleryData {
  title?: string;
  images: Array<{
    url: string;
    alt?: string;
    caption?: string;
  }>;
  layout?: 'grid' | 'masonry' | 'carousel';
  columns?: number;
}

export interface StatsSectionData {
  title?: string;
  stats: Array<{
    label: string;
    value: string | number;
    suffix?: string;
    icon?: string;
  }>;
  layout?: 'horizontal' | 'grid';
}

export interface FAQSectionData {
  title: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface BlogSectionData {
  title: string;
  subtitle?: string;
  showFeatured?: boolean;
  limit?: number;
  category?: string;
  layout?: 'grid' | 'list' | 'masonry';
}

export interface PartnersSectionData {
  title?: string;
  partners: Array<{
    name: string;
    logo: string;
    website?: string;
  }>;
  layout?: 'grid' | 'carousel';
}

export interface CTASectionData {
  title: string;
  description?: string;
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  backgroundImage?: string;
  backgroundColor?: string;
}
