/**
 * Zod Validation Schemas for API Routes
 * Ensures all inputs are validated before processing
 */

import { z } from 'zod';

// User Schemas
export const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'editor', 'viewer']).default('editor'),
  active: z.boolean().default(true),
});

export const userUpdateSchema = userSchema.partial().omit({ password: true });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Project Schemas
export const projectSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    ar: z.string().min(1, 'Arabic title is required'),
  }),
  description: z.object({
    en: z.string().min(1, 'English description is required'),
    ar: z.string().min(1, 'Arabic description is required'),
  }),
  images: z.array(z.string().url()).default([]),
  category: z.string().min(1, 'Category is required'),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
});

export const projectUpdateSchema = projectSchema.partial();

// Service Schemas
export const serviceSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    ar: z.string().min(1, 'Arabic title is required'),
  }),
  description: z.object({
    en: z.string().min(1, 'English description is required'),
    ar: z.string().min(1, 'Arabic description is required'),
  }),
  shortDescription: z.object({
    en: z.string().min(1, 'English short description is required'),
    ar: z.string().min(1, 'Arabic short description is required'),
  }),
  icon: z.string().optional(),
  features: z.object({
    en: z.array(z.string()),
    ar: z.array(z.string()),
  }).default({ en: [], ar: [] }),
  price: z.string().optional(),
  duration: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('published'),
});

export const serviceUpdateSchema = serviceSchema.partial();

// Blog Post Schemas
export const blogPostSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    ar: z.string().min(1, 'Arabic title is required'),
  }),
  slug: z.object({
    en: z.string().min(1, 'English slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
    ar: z.string().min(1, 'Arabic slug is required'),
  }),
  excerpt: z.object({
    en: z.string().min(1, 'English excerpt is required'),
    ar: z.string().min(1, 'Arabic excerpt is required'),
  }),
  content: z.object({
    en: z.string().min(1, 'English content is required'),
    ar: z.string().min(1, 'Arabic content is required'),
  }),
  featuredImage: z.string().url().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  author: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const blogPostUpdateSchema = blogPostSchema.partial();

// Page Schemas
export const pageSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    ar: z.string().min(1, 'Arabic title is required'),
  }),
  slug: z.object({
    en: z.string().min(1, 'English slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
    ar: z.string().min(1, 'Arabic slug is required'),
  }),
  description: z.object({
    en: z.string().min(1, 'English description is required'),
    ar: z.string().min(1, 'Arabic description is required'),
  }),
  seoMetaTitle: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  seoMetaDescription: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  seoKeywords: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
  featured: z.boolean().default(false),
});

export const pageUpdateSchema = pageSchema.partial();

// Page Block Schema
export const pageBlockSchema = z.object({
  type: z.string().min(1, 'Block type is required'),
  data: z.record(z.any()),
  order: z.number().int().min(0).default(0),
});

// Media File Schema
export const mediaFileSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  originalName: z.string().min(1, 'Original name is required'),
  url: z.string().url('Invalid URL'),
  thumbnailUrl: z.string().url().optional(),
  mimeType: z.string().min(1, 'MIME type is required'),
  size: z.number().int().positive('Size must be positive'),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  alt: z.string().optional(),
  type: z.enum(['image', 'video', 'document']),
});

// Settings Schema
export const settingsSchema = z.object({
  siteName: z.object({
    en: z.string().min(1, 'English site name is required'),
    ar: z.string().min(1, 'Arabic site name is required'),
  }),
  siteDescription: z.object({
    en: z.string().min(1, 'English site description is required'),
    ar: z.string().min(1, 'Arabic site description is required'),
  }),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }).optional(),
  seo: z.object({
    metaTitle: z.object({
      en: z.string().optional(),
      ar: z.string().optional(),
    }).optional(),
    metaDescription: z.object({
      en: z.string().optional(),
      ar: z.string().optional(),
    }).optional(),
    keywords: z.array(z.string()).default([]),
  }).optional(),
  appearance: z.object({
    primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i, 'Invalid hex color').optional(),
    logoUrl: z.string().url().optional(),
    faviconUrl: z.string().url().optional(),
  }).optional(),
});

// Advertisement Schema
export const advertisementSchema = z.object({
  title: z.object({
    en: z.string().min(1, 'English title is required'),
    ar: z.string().min(1, 'Arabic title is required'),
  }),
  description: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  image: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  linkUrl: z.string().url('Link URL is required'),
  ctaText: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  zone: z.enum(['header', 'sidebar', 'footer', 'inline', 'popup', 'banner']),
  type: z.enum(['image', 'video', 'html']),
  htmlContent: z.object({
    en: z.string().optional(),
    ar: z.string().optional(),
  }).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  alwaysActive: z.boolean().default(false),
  pages: z.array(z.string()).default([]),
  showOnAllPages: z.boolean().default(false),
  priority: z.number().int().min(0).default(0),
  maxImpressions: z.number().int().positive().optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const advertisementUpdateSchema = advertisementSchema.partial();

// Helper function to validate request body
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
      return { success: false, error: errors };
    }
    return { success: false, error: 'Validation failed' };
  }
}
