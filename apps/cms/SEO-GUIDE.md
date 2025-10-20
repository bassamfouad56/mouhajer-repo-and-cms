# SEO Optimization Guide for Mouhajer CMS + Next.js

## Overview

This guide documents the comprehensive SEO optimizations implemented for the Mouhajer CMS powered by GraphQL and Next.js. The implementation follows 2024/2025 best practices for headless CMS SEO.

## ✅ Implemented Features

### 1. Dynamic Sitemap (`/sitemap.xml`)

**Location:** `src/app/sitemap.ts`

- Automatically generates XML sitemap from GraphQL data
- Supports bilingual URLs (EN/AR)
- Includes pages, projects, blog posts, and services
- Updates automatically when content changes
- Implements `changeFrequency` and `priority` for optimal crawling
- Adds alternate language URLs for each page

**Access:** `https://mouhajer-cms.vercel.app/sitemap.xml`

### 2. Robots.txt (`/robots.txt`)

**Location:** `src/app/robots.ts`

- Configures crawl rules for search engines
- Blocks admin/CMS routes from indexing
- References sitemap location
- Separate rules for different bots (Googlebot, Bingbot)

**Access:** `https://mouhajer-cms.vercel.app/robots.txt`

### 3. Enhanced Metadata System

**Location:** `src/app/layout.tsx` and `src/lib/seo/metadata.ts`

- **metadataBase**: Configured for absolute URLs
- **Open Graph tags**: Full OG support for social sharing
- **Twitter Cards**: Optimized for Twitter/X
- **Canonical URLs**: Prevents duplicate content issues
- **Alternate languages**: hreflang implementation
- **Dynamic metadata**: `generateMetadata()` functions

**Features:**
- Template-based title generation
- Bilingual meta tag support
- Author and publisher attribution
- Keyword management
- Google Search Console verification support

### 4. Structured Data (JSON-LD)

**Location:** `src/lib/seo/structured-data.ts` and `src/components/StructuredData.tsx`

Implemented Schema.org schemas:

- **Organization Schema**: Site-wide organization info
- **Local Business Schema**: Dubai location-based SEO
- **Website Schema**: Site search functionality
- **Article Schema**: Blog post rich snippets
- **Service Schema**: Service pages
- **Breadcrumb Schema**: Navigation trails
- **FAQ Schema**: FAQ pages
- **Creative Work Schema**: Project portfolios
- **Image Object Schema**: Gallery images

### 5. Draft Mode for Content Preview

**Location:** `src/app/api/draft/route.ts`

- Preview unpublished content before publishing
- Secure with secret token
- Supports bilingual previews

**Usage:**
```
GET /api/draft?secret=YOUR_SECRET&slug=page-slug&locale=en
DELETE /api/draft (to disable)
```

**Environment Variable:**
```bash
DRAFT_SECRET_TOKEN=your-secure-secret-here
```

### 6. Image Optimization

**Location:** `next.config.ts`

- **Automatic format conversion**: AVIF and WebP
- **Responsive sizing**: Multiple device sizes
- **Lazy loading**: Built-in with next/image
- **Blur placeholders**: Improved perceived performance
- **CDN support**: Vercel Blob Storage integration
- **Cache optimization**: 60s minimum TTL

**Supported Domains:**
- `*.vercel-storage.com`
- `*.blob.vercel-storage.com`
- `mouhajer.ae`
- `*.mouhajer.ae`

### 7. Performance Optimizations

- **Package optimization**: Auto-optimization for icons
- **Compression**: Enabled
- **Core Web Vitals**: Optimized for LCP, FID, CLS

## 📋 Usage Examples

### Using Metadata Utilities

```typescript
import { generatePageMetadata, generateBlogMetadata } from '@/lib/seo/metadata';

// In your page component
export async function generateMetadata({ params }) {
  const page = await getPage(params.slug);

  return generatePageMetadata({
    title: page.title,
    description: page.description,
    slug: page.slug,
    seo: page.seo,
    image: page.featuredImage,
    locale: params.locale,
  });
}
```

### Adding Structured Data

```typescript
import StructuredData from '@/components/StructuredData';
import { getArticleSchema, getOrganizationSchema } from '@/lib/seo/structured-data';

export default function BlogPost({ post }) {
  const schemas = [
    getArticleSchema({
      title: post.title,
      description: post.excerpt,
      slug: post.slug,
      featuredImage: post.featuredImage,
      author: post.author,
      publishedAt: post.publishedAt,
      tags: post.tags,
      locale: 'en',
    }),
    getOrganizationSchema('en'),
  ];

  return (
    <>
      <StructuredData data={schemas} />
      {/* Your page content */}
    </>
  );
}
```

### Using Next/Image for Optimization

```typescript
import Image from 'next/image';

<Image
  src="/project-image.jpg"
  alt="Interior Design Project"
  width={1200}
  height={630}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
/>
```

## 🔧 Configuration

### Environment Variables

Add these to your `.env.local` and production environment:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://mouhajer.ae

# Google Search Console
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code

# Draft Mode
DRAFT_SECRET_TOKEN=your-secure-random-secret

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🎯 SEO Checklist

### For Every Page:
- [ ] Unique title (50-60 characters)
- [ ] Meta description (150-160 characters)
- [ ] Canonical URL
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Alt text for all images
- [ ] Structured data (appropriate schema)
- [ ] hreflang tags (for bilingual pages)

### For Blog Posts:
- [ ] Article schema
- [ ] Author information
- [ ] Published/modified dates
- [ ] Tags/keywords
- [ ] Featured image (1200x630)
- [ ] Internal links

### For Images:
- [ ] Use next/image component
- [ ] Descriptive alt text
- [ ] Appropriate dimensions
- [ ] WebP/AVIF format
- [ ] Lazy loading (below fold)

## 📊 Performance Metrics

Expected Lighthouse Scores:
- **Performance**: 90-100
- **SEO**: 95-100
- **Best Practices**: 90-100
- **Accessibility**: 85-95

Core Web Vitals Targets:
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

## 🚀 Deployment

### Vercel Deployment

The SEO features work automatically on Vercel:

1. Sitemap is generated at build time
2. Robots.txt is served statically
3. Images are optimized on-demand
4. Metadata is rendered server-side

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## 📈 Monitoring & Testing

### Tools to Use:

1. **Google Search Console**
   - Submit sitemap
   - Monitor indexing status
   - Check mobile usability

2. **Google Rich Results Test**
   - Validate structured data
   - Test: https://search.google.com/test/rich-results

3. **PageSpeed Insights**
   - Monitor Core Web Vitals
   - Test: https://pagespeed.web.dev/

4. **Screaming Frog SEO Spider**
   - Crawl site locally
   - Find broken links and SEO issues

5. **Schema Markup Validator**
   - Test: https://validator.schema.org/

## 🔍 SEO Best Practices

### Content Strategy:
1. Write unique, valuable content
2. Use descriptive headings (H1, H2, H3)
3. Add internal links between related content
4. Keep URLs clean and semantic
5. Update content regularly

### Technical SEO:
1. Ensure fast page load times
2. Mobile-first responsive design
3. Use semantic HTML5 elements
4. Implement breadcrumb navigation
5. Create XML sitemap
6. Monitor broken links

### Bilingual SEO:
1. Separate URLs for each language
2. hreflang tags on all pages
3. Consistent translations
4. Language-specific content
5. Locale-specific meta tags

## 🛠️ Future Enhancements

Planned improvements:
- [ ] Add multilingual sitemaps (separate for EN/AR)
- [ ] Implement ISR (Incremental Static Regeneration)
- [ ] Add more schema types (Event, Product, etc.)
- [ ] Integrate with Google Analytics 4
- [ ] Add social media meta tags validation
- [ ] Create SEO dashboard in CMS
- [ ] Auto-generate meta descriptions using AI
- [ ] Implement A/B testing for meta tags

## 📚 Resources

- [Next.js SEO Documentation](https://nextjs.org/learn/seo)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

## 🤝 Contributing

When adding new content types or pages:
1. Update sitemap generator
2. Add appropriate metadata
3. Include structured data
4. Test with SEO tools
5. Update this documentation

---

**Last Updated:** January 2025
**Next.js Version:** 15.5.4
**CMS Version:** 0.1.0
