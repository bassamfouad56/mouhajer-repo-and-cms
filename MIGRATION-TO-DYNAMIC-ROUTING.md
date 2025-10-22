# Migration to Dynamic CMS-Driven Routing

## Overview
This migration consolidates all static route folders into a single dynamic `[...slug]` catch-all route, giving you full control over pages through the CMS.

## Benefits
✅ **Single Source of Truth**: All pages managed from CMS
✅ **Dynamic URLs**: Change URLs without code changes
✅ **Consistent Handling**: All pages use the same rendering logic
✅ **Better SEO Control**: Manage meta tags from CMS
✅ **Faster Development**: Add new pages without deploying code

## Migration Steps

### Step 1: Run Migration Script
```bash
cd apps/cms
DATABASE_URL="your-database-url" node scripts/migrate-static-routes.js
```

This creates CMS pages for all existing static routes.

### Step 2: Update [...slug] Route
Replace `apps/frontend/app/[locale]/[...slug]/page.tsx` with the enhanced version that handles:
- Home page (empty slug)
- All CMS pages
- 404 handling

### Step 3: Update BlockRenderer
Replace the BlockRenderer with the enhanced version that includes components for:
- Contact forms
- Service listings
- Team grids
- FAQ sections
- Testimonials
- Pricing tables
- Blog lists
- And more...

### Step 4: Remove Static Routes
Delete these folders from `apps/frontend/app/[locale]/`:
- services/
- contact-us/
- our-projects/
- blogs/
- who-we-are/
- team/
- faq/
- testimonials/
- pricing/
- case-studies/
- privacy-policy/
- careers/
- design-services/
- room-redesign/
- suppliers/
- search/ (keep if needed for special search functionality)

### Step 5: Update Home Page Route
Move the home page logic into [...slug] by making it optional:
1. Change `[...slug]` to handle optional parameters
2. When slug is empty, render the home page

## File Structure After Migration

```
app/[locale]/
├── [...slug]/
│   └── page.tsx         # Handles ALL pages from CMS
├── api/                 # Keep API routes
└── layout.tsx          # Keep layout
```

## CMS Page Structure

Each page in CMS can have:
- **Multi-language support** (titleEn, titleAr)
- **SEO metadata**
- **Blocks** (ordered components)
- **Status** (published, draft)
- **Custom slugs** per language

## Testing Checklist

- [ ] Home page loads correctly
- [ ] Services page loads from CMS
- [ ] Contact form works
- [ ] Blog listing works
- [ ] Project galleries display
- [ ] Team page renders
- [ ] FAQ accordion functions
- [ ] SEO meta tags are correct
- [ ] Language switching works
- [ ] 404 pages work

## Rollback Plan

If you need to rollback:
1. Keep backup of static route folders
2. Restore the folders
3. Remove CMS pages
4. Revert [...slug]/page.tsx

## Notes

- The enhanced BlockRenderer includes placeholder components that may need implementation
- Some components (BlogList, TeamGrid, etc.) need to be created or imported
- Ensure all necessary data fetchers are available
- Test thoroughly before removing static routes