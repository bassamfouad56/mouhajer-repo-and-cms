# SEO Enhancement Deployment Instructions

## Overview
This document outlines the steps to deploy the new SEO features for the Services module.

## Database Migration

### Step 1: Backup Database
Before running any migrations, **backup your production database**:
```bash
# This will be done automatically by Prisma Accelerate
```

### Step 2: Apply Migration
The database schema has been updated with new SEO fields. To apply the migration in production:

```bash
# Option 1: Using Vercel CLI
vercel env pull
npx prisma migrate deploy

# Option 2: Through Vercel Dashboard
# The migration will be applied automatically on next deployment
```

### Step 3: Verify Schema
After deployment, verify the new fields exist:
- `slug_en` and `slug_ar` (unique slugs)
- `images[]` (array of image URLs)
- `seo_meta_title_en`, `seo_meta_title_ar`
- `seo_meta_desc_en`, `seo_meta_desc_ar`
- `seo_keywords_en[]`, `seo_keywords_ar[]`
- `target_locations[]`, `service_area[]`
- `faqs` (JSON)
- `related_service_ids[]`
- `view_count`, `average_rating`

## Required Environment Variables

No additional environment variables are required. The existing database connection will work.

## Updated Files

### Database & API:
- ✅ `prisma/schema.prisma` - Added SEO fields to Service model
- ✅ `src/graphql/schema/services.ts` - Updated GraphQL schema
- ✅ `src/graphql/resolvers/services.ts` - Updated resolvers with slug generation and view tracking
- ✅ `src/app/api/services/route.ts` - Updated REST API endpoints

### Components:
- ✅ `src/components/SEO/ServiceSEO.tsx` - Service-specific SEO component
- ✅ `src/components/SEO/MetaTags.tsx` - General meta tags component
- ✅ `src/components/SEO/SchemaOrg.tsx` - Schema.org structured data
- ✅ `src/components/SEO/index.ts` - SEO components export

### Documentation:
- ✅ `SEO_KEYWORDS_GUIDE.md` - Comprehensive keyword research and implementation guide

## Post-Deployment Tasks

### 1. Update Existing Services
After deployment, existing services will need slugs generated. Run this script via the GraphQL Playground:

```graphql
mutation UpdateExistingServices {
  # You'll need to manually update each service with slugs
  # Or run a migration script
}
```

### 2. Populate SEO Data
For each service, add:
- SEO meta titles (EN/AR)
- SEO meta descriptions (EN/AR)
- 5-10 keywords per language
- Target locations (Dubai, Abu Dhabi, etc.)
- Service areas
- FAQs (3-5 per service)

### 3. Update Frontend (mouhajer-repo)
Update your frontend repository to:
- Use the new SEO components
- Implement the ServiceSEO component on service pages
- Add Schema.org markup
- Update service queries to include new fields

Example frontend service page:
```tsx
import { ServiceSEO } from '@/components/SEO';

export default function ServicePage({ service }) {
  return (
    <>
      <ServiceSEO
        service={service}
        language="en"
        url="https://yourdomain.com"
        organizationName="Mouhajer Construction"
      />
      {/* Rest of your page */}
    </>
  );
}
```

### 4. Submit Sitemaps
Generate and submit updated sitemaps to:
- Google Search Console
- Bing Webmaster Tools

### 5. Monitor Rankings
Track keyword rankings using:
- Google Search Console
- Ahrefs/SEMrush
- Manual SERP checks for key terms

## UI Updates Required

The Services management UI (`src/app/services/page.tsx`) needs to be updated to include:

1. **SEO Tab** in the service form with:
   - Meta Title fields (EN/AR)
   - Meta Description fields (EN/AR)
   - Keywords input (tag-based, EN/AR)
   - Slug fields with auto-generation
   - Target Locations multi-select
   - Service Area multi-select

2. **FAQ Builder** section:
   - Add/remove FAQ items
   - Question/Answer fields (EN/AR)

3. **Related Services** selector:
   - Multi-select dropdown of other services

4. **Analytics Display**:
   - View count
   - Average rating (if available)

## Testing Checklist

- [ ] Create a new service with all SEO fields
- [ ] Update an existing service
- [ ] Verify slugs are unique
- [ ] Test GraphQL queries for services
- [ ] Test serviceBySlug query
- [ ] Verify view count increments
- [ ] Check SEO components render correctly
- [ ] Validate Schema.org markup with Google's Rich Results Test
- [ ] Test bilingual (EN/AR) SEO
- [ ] Verify hreflang tags
- [ ] Check mobile responsiveness

## Rollback Plan

If issues arise:

1. Revert to previous deployment:
```bash
vercel rollback
```

2. If database migration causes issues, the old schema is still compatible (new fields are optional)

## Support & Resources

- **SEO Keywords Guide**: `SEO_KEYWORDS_GUIDE.md`
- **Schema.org Documentation**: https://schema.org
- **Google Search Central**: https://developers.google.com/search
- **Arabic SEO Best Practices**: https://istizada.com/arabic-seo-guide/

## Questions?

Contact the development team for assistance with deployment or SEO implementation.
