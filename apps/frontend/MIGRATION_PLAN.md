# MOUHAJER SANITY MIGRATION PLAN

## 1. MIGRATION PLAN TO SANITY MODELS (VISUAL PARITY)

### Current Architecture Analysis
- ✅ Next.js 14 with App Router
- ✅ Next-intl for i18n (en/ar)
- ✅ Basic Sanity setup (blog/page schemas)
- ✅ Tailwind CSS v3 + styled-components
- ❌ Missing comprehensive content models
- ❌ No SEO/structured data integration
- ❌ No performance optimizations

### Content Model Migration Strategy

#### Phase 1: Core Content Models
```typescript
// New Sanity Schema Types Required:
1. seoSettings - Global SEO configuration
2. service - Interior design services
3. project - Portfolio projects
4. faq - Frequently asked questions
5. navigation - Header/footer navigation
6. landingPage - Programmatic SEO pages
7. ctaBlock - Call-to-action components
8. teamMember - Team/founder information
9. testimonial - Client testimonials
10. award - Company awards/recognition
```

#### Phase 2: Enhanced Existing Models
```typescript
// Extend existing schemas:
- pageType → Enhanced with SEO fields
- blockContentType → Add structured data support
- authorType → Extend for team members
```

#### Phase 3: i18n Content Structure
```typescript
// Internationalized field structure:
interface LocalizedField {
  en: string;
  ar: string;
}

// Example: service.title will become:
service.title: {
  en: "Interior Design",
  ar: "التصميم الداخلي"
}
```

## 2. PR PLAN WITH ATOMIC COMMITS

### Branch Strategy
```bash
main
├── feature/sanity-content-models
├── feature/performance-optimization
├── feature/seo-infrastructure
├── feature/documentation-ci
├── feature/security-hardening
└── feature/testing-framework
```

### Commit Scopes & Sequence

#### Sprint 1: Foundation (Week 1)
```bash
feat(sanity): add comprehensive content models
feat(sanity): implement i18n field structure
feat(env): add environment validation with Zod
refactor(types): centralize TypeScript definitions
```

#### Sprint 2: Performance (Week 2)
```bash
perf(r3f): implement lazy loading for 3D components
perf(images): optimize Sanity image pipeline
perf(fonts): implement preloading strategy
perf(bundle): dynamic imports for heavy libraries
```

#### Sprint 3: SEO & Metadata (Week 3)
```bash
feat(seo): implement metadata generation system
feat(jsonld): add structured data helpers
feat(sitemap): configure next-sitemap with Sanity
feat(canonical): implement canonical URL system
```

#### Sprint 4: Infrastructure (Week 4)
```bash
feat(docs): add ARCHITECTURE.md and CONTRIBUTING.md
feat(ci): implement GitHub Actions workflow
feat(security): harden environment configuration
feat(tests): add SEO and performance tests
```

## 3. TASK CHECKLIST

### Architecture Tasks
- [ ] **Content Models**: Design and implement comprehensive Sanity schemas
- [ ] **i18n Integration**: Implement localized content structure
- [ ] **Type Safety**: Generate TypeScript types from Sanity schemas
- [ ] **Client Configuration**: Set up production/preview Sanity clients
- [ ] **Cache Strategy**: Implement tag-based revalidation

### Performance Tasks
- [ ] **Core Web Vitals**: Optimize for LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] **3D Optimization**: Lazy load R3F components with Intersection Observer
- [ ] **Image Pipeline**: Implement responsive Sanity images with blur placeholders
- [ ] **Font Strategy**: Preload critical fonts, prevent FOIT/FOUT
- [ ] **Bundle Optimization**: Dynamic imports for swiper/gsap libraries

### SEO Tasks
- [ ] **Metadata System**: Central SEO helpers for all routes
- [ ] **Structured Data**: JSON-LD generators for all content types
- [ ] **Programmatic SEO**: Service × City landing pages
- [ ] **Sitemap Generation**: Dynamic sitemap from Sanity content
- [ ] **Internal Linking**: Automated internal link suggestions

### Documentation Tasks
- [ ] **Architecture Docs**: RSC vs client patterns, caching strategies
- [ ] **Contributing Guide**: Branching, commits, scripts, CI procedures
- [ ] **Environment Setup**: .env.example with Zod validation
- [ ] **API Documentation**: Sanity queries and data flow
- [ ] **Performance Guide**: Optimization checklist and monitoring

### Security Tasks
- [ ] **Environment Hardening**: Secure secret management
- [ ] **Sanity Security**: Separate preview/production tokens
- [ ] **Form Security**: Anti-spam measures for lead generation
- [ ] **CORS Configuration**: Proper domain restrictions
- [ ] **Content Validation**: Input sanitization and validation

### Testing Tasks
- [ ] **Unit Tests**: Component and utility function coverage
- [ ] **SEO Tests**: Metadata and structured data validation
- [ ] **Performance Tests**: Lighthouse CI with thresholds
- [ ] **Accessibility Tests**: WCAG compliance verification
- [ ] **Integration Tests**: Sanity data flow validation

## 4. CRITICAL CODE IMPLEMENTATIONS

### Sanity Clients & Queries
```typescript
// lib/sanity/clients.ts
import { createClient } from 'next-sanity'
import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
  NEXT_PUBLIC_SANITY_DATASET: z.string(),
  SANITY_API_READ_TOKEN: z.string(),
  SANITY_API_WRITE_TOKEN: z.string().optional(),
  SANITY_WEBHOOK_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)

export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-01-01',
  useCdn: false, // Ensure fresh data for ISR
})

export const previewClient = client.withConfig({
  token: env.SANITY_API_READ_TOKEN,
  useCdn: false,
  perspective: 'previewDrafts',
})
```

### SEO Helpers & JSON-LD
```typescript
// lib/seo/metadata.ts
import { Metadata } from 'next'
import { urlFor } from '@/lib/sanity/image'

interface SEOData {
  title: string
  description: string
  canonical?: string
  ogImage?: any
  locale: 'en' | 'ar'
}

export function generateMetadata(data: SEOData): Metadata {
  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: data.canonical,
      languages: {
        en: `/en${data.canonical}`,
        ar: `/ar${data.canonical}`,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      images: data.ogImage ? [urlFor(data.ogImage).width(1200).height(630).url()] : [],
      locale: data.locale,
    },
  }
}

// lib/seo/jsonld.ts
export function generateOrganizationLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mouhajer International Design and Contracting',
    url: 'https://mouhajer.com',
    logo: 'https://mouhajer.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      addressLocality: 'Dubai',
    },
    areaServed: 'AE',
  }
}
```

### R3F Lazy Loader
```typescript
// components/3d/LazyR3F.tsx
import { lazy, Suspense } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const Scene3D = lazy(() => import('./Scene3D'))

export function LazyR3F({ children }: { children: React.ReactNode }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '100px' })

  return (
    <div ref={ref}>
      {isInView ? (
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
          <Scene3D>{children}</Scene3D>
        </Suspense>
      ) : (
        <div className="h-64 bg-gray-100" />
      )}
    </div>
  )
}
```

### Sitemap Configuration
```typescript
// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://mouhajer.com',
  generateRobotsTxt: true,
  exclude: ['/api/*', '/admin/*'],
  alternateRefs: [
    {
      href: 'https://mouhajer.com/en',
      hreflang: 'en',
    },
    {
      href: 'https://mouhajer.com/ar',
      hreflang: 'ar',
    },
  ],
  additionalPaths: async (config) => {
    // Fetch dynamic routes from Sanity
    const { client } = await import('./lib/sanity/client')
    const services = await client.fetch('*[_type == "service"]{ slug }')
    const projects = await client.fetch('*[_type == "project"]{ slug }')

    return [
      ...services.map(service => ({
        loc: `/services/${service.slug.current}`,
        alternateRefs: config.alternateRefs,
      })),
      ...projects.map(project => ({
        loc: `/projects/${project.slug.current}`,
        alternateRefs: config.alternateRefs,
      })),
    ]
  },
}
```

### TypeScript Strict Configuration
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "paths": {
      "@/*": ["./"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/sanity/*": ["./sanity/*"]
    }
  }
}
```

### ESLint Strict Configuration
```javascript
// eslint.config.mjs
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

export default [
  ...compat.extends(['next/core-web-vitals', 'next/typescript']),
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@next/next/no-img-element': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'jsx-a11y/alt-text': 'error',
    },
  },
]
```

## 5. RISKS & ROLLBACK STRATEGY

### High-Risk Areas
1. **Content Migration**: Risk of data loss during schema changes
2. **Performance Regression**: 3D components affecting Core Web Vitals
3. **SEO Impact**: URL structure changes affecting search rankings
4. **i18n Complexity**: Content translation and URL routing

### Rollback Strategy
```bash
# Emergency rollback procedure
1. Revert to previous deployment: `vercel rollback`
2. Database rollback: Sanity dataset restoration
3. DNS rollback: CloudFlare configuration reset
4. Monitor: Core Web Vitals and search console alerts
```

### Validation Steps
1. **Pre-deployment**: Lighthouse CI passes, TypeScript compiles, tests pass
2. **Staging validation**: Content audit, SEO meta verification, performance benchmarks
3. **Production validation**: Core Web Vitals monitoring, search console tracking
4. **Post-deployment**: 24h monitoring, gradual traffic rollout

## 6. SUCCESS METRICS

### Performance Targets
- LCP: < 2.5s (currently ~4s)
- CLS: < 0.1 (currently ~0.3)
- INP: < 200ms (currently ~400ms)
- First Contentful Paint: < 1.8s

### SEO Targets
- Core Web Vitals: 100% good URLs
- Structured data coverage: 100% of content
- Internal linking: 95% content interconnected
- Page speed score: 90+ (mobile/desktop)

### Content Management Targets
- Editor experience: < 2s content loading
- Preview mode: Real-time content updates
- Media optimization: 80% size reduction
- Content delivery: Global CDN coverage

---

**Implementation Timeline**: 4 weeks
**Team Required**: 1 Senior Full-stack Developer
**Dependencies**: Sanity Studio access, Vercel deployment pipeline
**Budget Impact**: $0 additional infrastructure costs