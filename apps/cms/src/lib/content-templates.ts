/**
 * Content Templates System
 * Predefined templates for different content types
 */

export type ContentType = 'PAGE' | 'BLOG' | 'PROJECT' | 'SERVICE' | 'LANDING';

export interface TemplateSectionConfig {
  blueprintName: string;
  order: number;
  defaultData: {
    en: Record<string, any>;
    ar: Record<string, any>;
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: ContentType;
  icon: string; // Lucide icon name
  thumbnail?: string;
  defaultSections: TemplateSectionConfig[];
  seoDefaults?: {
    metaTitleEn?: string;
    metaTitleAr?: string;
    metaDescEn?: string;
    metaDescAr?: string;
  };
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  // ========================================
  // PAGE TEMPLATES
  // ========================================
  {
    id: 'page-blank',
    name: 'Blank Page',
    description: 'Start from scratch with an empty page',
    type: 'PAGE',
    icon: 'FileText',
    defaultSections: [],
  },
  {
    id: 'page-about',
    name: 'About Us',
    description: 'Company introduction with mission and team',
    type: 'PAGE',
    icon: 'Users',
    defaultSections: [
      {
        blueprintName: 'hero-simple',
        order: 0,
        defaultData: {
          en: {
            title: 'About Us',
            subtitle: 'Learn more about our company',
            image: '',
          },
          ar: {
            title: 'من نحن',
            subtitle: 'تعرف على شركتنا',
            image: '',
          },
        },
      },
      {
        blueprintName: 'text-content',
        order: 1,
        defaultData: {
          en: {
            content: '<h2>Our Story</h2><p>Company story goes here...</p>',
          },
          ar: {
            content: '<h2>قصتنا</h2><p>قصة الشركة هنا...</p>',
          },
        },
      },
      {
        blueprintName: 'team-grid',
        order: 2,
        defaultData: {
          en: {
            title: 'Our Team',
            members: [],
          },
          ar: {
            title: 'فريقنا',
            members: [],
          },
        },
      },
    ],
    seoDefaults: {
      metaTitleEn: 'About Us - Company Name',
      metaTitleAr: 'من نحن - اسم الشركة',
    },
  },
  {
    id: 'page-contact',
    name: 'Contact Page',
    description: 'Contact form and company information',
    type: 'PAGE',
    icon: 'Mail',
    defaultSections: [
      {
        blueprintName: 'hero-simple',
        order: 0,
        defaultData: {
          en: { title: 'Contact Us', subtitle: 'Get in touch with our team' },
          ar: { title: 'اتصل بنا', subtitle: 'تواصل مع فريقنا' },
        },
      },
      {
        blueprintName: 'contact-form',
        order: 1,
        defaultData: {
          en: { showMap: true, showPhone: true, showEmail: true },
          ar: { showMap: true, showPhone: true, showEmail: true },
        },
      },
    ],
  },

  // ========================================
  // BLOG TEMPLATES
  // ========================================
  {
    id: 'blog-standard',
    name: 'Standard Blog Post',
    description: 'Classic blog article with header and content',
    type: 'BLOG',
    icon: 'BookOpen',
    defaultSections: [
      {
        blueprintName: 'blog-header',
        order: 0,
        defaultData: {
          en: {
            showAuthor: true,
            showDate: true,
            showCategory: true,
            showReadTime: true,
          },
          ar: {
            showAuthor: true,
            showDate: true,
            showCategory: true,
            showReadTime: true,
          },
        },
      },
      {
        blueprintName: 'featured-image',
        order: 1,
        defaultData: {
          en: { image: '', caption: '' },
          ar: { image: '', caption: '' },
        },
      },
      {
        blueprintName: 'rich-text-content',
        order: 2,
        defaultData: {
          en: { content: '<p>Write your article here...</p>' },
          ar: { content: '<p>اكتب مقالك هنا...</p>' },
        },
      },
      {
        blueprintName: 'blog-footer',
        order: 3,
        defaultData: {
          en: { showTags: true, showShare: true, showAuthorBio: true },
          ar: { showTags: true, showShare: true, showAuthorBio: true },
        },
      },
    ],
  },
  {
    id: 'blog-longform',
    name: 'Long-form Article',
    description: 'In-depth article with table of contents',
    type: 'BLOG',
    icon: 'Newspaper',
    defaultSections: [
      {
        blueprintName: 'blog-header',
        order: 0,
        defaultData: {
          en: { showAuthor: true, showDate: true },
          ar: { showAuthor: true, showDate: true },
        },
      },
      {
        blueprintName: 'table-of-contents',
        order: 1,
        defaultData: {
          en: { title: 'Table of Contents', sticky: true },
          ar: { title: 'جدول المحتويات', sticky: true },
        },
      },
      {
        blueprintName: 'rich-text-content',
        order: 2,
        defaultData: {
          en: { content: '<h2>Introduction</h2><p>...</p>' },
          ar: { content: '<h2>المقدمة</h2><p>...</p>' },
        },
      },
    ],
  },

  // ========================================
  // PROJECT TEMPLATES
  // ========================================
  {
    id: 'project-showcase',
    name: 'Project Showcase',
    description: 'Portfolio project with image gallery',
    type: 'PROJECT',
    icon: 'Briefcase',
    defaultSections: [
      {
        blueprintName: 'project-hero',
        order: 0,
        defaultData: {
          en: {
            title: '',
            client: '',
            category: '',
            year: new Date().getFullYear(),
            location: '',
          },
          ar: {
            title: '',
            client: '',
            category: '',
            year: new Date().getFullYear(),
            location: '',
          },
        },
      },
      {
        blueprintName: 'gallery-masonry',
        order: 1,
        defaultData: {
          en: { columns: 3, gap: 16, images: [] },
          ar: { columns: 3, gap: 16, images: [] },
        },
      },
      {
        blueprintName: 'project-details',
        order: 2,
        defaultData: {
          en: {
            overview: '',
            challenge: '',
            solution: '',
            results: '',
          },
          ar: {
            overview: '',
            challenge: '',
            solution: '',
            results: '',
          },
        },
      },
      {
        blueprintName: 'project-specs',
        order: 3,
        defaultData: {
          en: { specs: [] },
          ar: { specs: [] },
        },
      },
    ],
  },
  {
    id: 'project-case-study',
    name: 'Case Study',
    description: 'Detailed project case study with metrics',
    type: 'PROJECT',
    icon: 'TrendingUp',
    defaultSections: [
      {
        blueprintName: 'project-hero',
        order: 0,
        defaultData: {
          en: { title: '', subtitle: '' },
          ar: { title: '', subtitle: '' },
        },
      },
      {
        blueprintName: 'case-study-overview',
        order: 1,
        defaultData: {
          en: { client: '', industry: '', duration: '', team: '' },
          ar: { client: '', industry: '', duration: '', team: '' },
        },
      },
      {
        blueprintName: 'metrics-grid',
        order: 2,
        defaultData: {
          en: { metrics: [] },
          ar: { metrics: [] },
        },
      },
      {
        blueprintName: 'rich-text-content',
        order: 3,
        defaultData: {
          en: { content: '<h2>The Challenge</h2><p>...</p>' },
          ar: { content: '<h2>التحدي</h2><p>...</p>' },
        },
      },
    ],
  },

  // ========================================
  // SERVICE TEMPLATES
  // ========================================
  {
    id: 'service-standard',
    name: 'Standard Service',
    description: 'Service page with features and pricing',
    type: 'SERVICE',
    icon: 'Package',
    defaultSections: [
      {
        blueprintName: 'hero-service',
        order: 0,
        defaultData: {
          en: { title: '', subtitle: '', icon: '' },
          ar: { title: '', subtitle: '', icon: '' },
        },
      },
      {
        blueprintName: 'features-list',
        order: 1,
        defaultData: {
          en: { title: 'What We Offer', features: [] },
          ar: { title: 'ما نقدمه', features: [] },
        },
      },
      {
        blueprintName: 'pricing-card',
        order: 2,
        defaultData: {
          en: { price: '', duration: 'month', features: [] },
          ar: { price: '', duration: 'month', features: [] },
        },
      },
      {
        blueprintName: 'cta-centered',
        order: 3,
        defaultData: {
          en: { title: 'Ready to get started?', buttonText: 'Contact Us' },
          ar: { title: 'هل أنت مستعد للبدء؟', buttonText: 'اتصل بنا' },
        },
      },
    ],
  },

  // ========================================
  // LANDING PAGE TEMPLATES
  // ========================================
  {
    id: 'landing-hero-cta',
    name: 'Hero + CTA',
    description: 'Conversion-focused landing page',
    type: 'LANDING',
    icon: 'Zap',
    defaultSections: [
      {
        blueprintName: 'hero-full',
        order: 0,
        defaultData: {
          en: {
            title: 'Transform Your Space',
            subtitle: 'Professional interior design services',
            buttonText: 'Get Started',
            image: '',
          },
          ar: {
            title: 'حوّل مساحتك',
            subtitle: 'خدمات تصميم داخلي احترافية',
            buttonText: 'ابدأ الآن',
            image: '',
          },
        },
      },
      {
        blueprintName: 'features-grid',
        order: 1,
        defaultData: {
          en: { title: 'Why Choose Us', features: [] },
          ar: { title: 'لماذا نحن', features: [] },
        },
      },
      {
        blueprintName: 'testimonials',
        order: 2,
        defaultData: {
          en: { title: 'What Clients Say', testimonials: [] },
          ar: { title: 'آراء العملاء', testimonials: [] },
        },
      },
      {
        blueprintName: 'cta-centered',
        order: 3,
        defaultData: {
          en: { title: 'Ready to start your project?', buttonText: 'Contact Us' },
          ar: { title: 'هل أنت مستعد لبدء مشروعك؟', buttonText: 'اتصل بنا' },
        },
      },
    ],
  },
  {
    id: 'landing-product',
    name: 'Product Landing',
    description: 'Product-focused landing with features',
    type: 'LANDING',
    icon: 'ShoppingCart',
    defaultSections: [
      {
        blueprintName: 'hero-product',
        order: 0,
        defaultData: {
          en: { title: '', subtitle: '', productImage: '', price: '' },
          ar: { title: '', subtitle: '', productImage: '', price: '' },
        },
      },
      {
        blueprintName: 'feature-highlights',
        order: 1,
        defaultData: {
          en: { features: [] },
          ar: { features: [] },
        },
      },
      {
        blueprintName: 'before-after',
        order: 2,
        defaultData: {
          en: { beforeImage: '', afterImage: '', title: 'See the Difference' },
          ar: { beforeImage: '', afterImage: '', title: 'شاهد الفرق' },
        },
      },
      {
        blueprintName: 'faq-accordion',
        order: 3,
        defaultData: {
          en: { title: 'Frequently Asked Questions', faqs: [] },
          ar: { title: 'الأسئلة الشائعة', faqs: [] },
        },
      },
    ],
  },
];

// Helper functions
export function getTemplatesByType(type: ContentType): ContentTemplate[] {
  return CONTENT_TEMPLATES.filter((t) => t.type === type);
}

export function getTemplateById(id: string): ContentTemplate | undefined {
  return CONTENT_TEMPLATES.find((t) => t.id === id);
}

export const CONTENT_TYPE_LABELS: Record<ContentType, { en: string; ar: string }> = {
  PAGE: { en: 'Page', ar: 'صفحة' },
  BLOG: { en: 'Blog Post', ar: 'مقال' },
  PROJECT: { en: 'Project', ar: 'مشروع' },
  SERVICE: { en: 'Service', ar: 'خدمة' },
  LANDING: { en: 'Landing Page', ar: 'صفحة هبوط' },
};
