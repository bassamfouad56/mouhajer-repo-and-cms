# Real Projects Import to Sanity CMS

## Overview

This document explains how we imported your real project data from the 46GB `projects` folder into Sanity CMS without bloating your repository or deployment.

## What Was Done

### 1. Projects Folder Protection
- **Added to `.gitignore`**: The `/projects` folder is excluded from Git version control
- **Added to `.vercelignore`**: The `/projects` folder won't be deployed to Vercel
- **Result**: Your 46GB projects folder stays local, not in Git or on Vercel servers

### 2. Smart Import Script

Created `scripts/import-real-projects.ts` that:

#### Scans Your Projects
- Reads all project folders from `projects/our projects page/`
- Found **20 real projects**
- Extracts metadata from `keyfact.txt` files

#### Optimized Image Upload
- **Limit**: Maximum 8 images per project (configurable)
- **Total**: ~160 images instead of thousands
- **Quality**: Full resolution preserved
- **Storage**: Hosted on Sanity CDN (fast, globally distributed)

#### Intelligent Data Extraction
- **Title**: Auto-generated from folder names (e.g., "1 hotel sofitel JBR" → "Hotel Sofitel Jbr")
- **Slug**: URL-friendly (e.g., "hotel-sofitel-jbr")
- **Category**: Auto-detected from folder name and metadata:
  - Hotels/Restaurants/Lounges → "Hospitality"
  - Villas/Penthouses → "Residential"
  - Offices → "Commercial"
- **Location**: From keyfact.txt or defaults to "Dubai, UAE"
- **Year**: Extracted from folder name or defaulted to 2023/2024
- **Client**: From keyfact.txt when available

#### Professional Content
- **Excerpts**: AI-generated professional descriptions based on project type
- **Gallery**: 7 additional images per project for project detail pages
- **Featured**: First 6 projects marked as featured for homepage

## Projects Imported

1. Hotel Sofitel JBR
2. Sheraton Hotel And Resort Abudhabi
3. The Restaurant Hotel Address Marina Mall
4. Penthouse Address Boulevard
5. District One Meydan Villa 79x
6. Jumeirah Bay Villa
7. Hotel Park Hyatt Villa
8. Club Lounge Address Boulevard
9. Hotel Address Boulevard Vip Suite
10. Palm Jumeirah Villa
11. Grand Hyatt Prince Suite
12. Askim Restaurant
13. Hotel Grand Hyatt Prince Suite
14. Terraza Restaurant Radisson Blu Abudhabi
15. Villa District 1 Meydan 11x
16. Villa District 1 Meydan 12x
17. Jumeirah Island Villa
18. Park Hyatt Vip Room
19. Ritz Carlton Villas
20. Offices C1 Abudhabi

## How to Run the Import

```bash
npm run import:projects
```

This will:
1. Scan the projects folder
2. Upload images to Sanity (progress shown in console)
3. Create project documents with full metadata
4. Mark first 6 as featured

**Note**: The script is idempotent - you can run it multiple times safely. It will update existing projects.

## Sanity Studio

View and manage your projects:
**https://r97logzc.sanity.studio**

## Image Management

### Where Images Are Stored
- **Sanity CDN**: All uploaded images
- **Not in Git**: Local projects folder excluded
- **Not in Vercel**: Projects folder not deployed

### Image Optimization
Sanity automatically provides:
- **Responsive Images**: Different sizes for different devices
- **WebP Format**: Modern format for faster loading
- **CDN Delivery**: Fast global distribution
- **On-Demand Transforms**: Resize/crop/format on-the-fly

### Using Images in Your Website

Images are fetched via the `urlForImage()` helper:

```typescript
import { urlForImage } from '@/sanity/lib/image';

// Main image
const imageUrl = urlForImage(project.mainImage)
  .width(1200)
  .height(800)
  .url();

// Gallery images
project.gallery.map(image => (
  <img src={urlForImage(image).width(800).url()} />
))
```

## Configuration

### Adjust Images Per Project

Edit `scripts/import-real-projects.ts`:

```typescript
const MAX_IMAGES_PER_PROJECT = 8; // Change this number
```

### Re-import Specific Projects

The script uses project slugs as IDs, so running it again will update existing projects without creating duplicates.

### Add More Metadata

Edit the `keyfact.txt` parser in `scripts/import-real-projects.ts` to extract additional fields.

## Benefits

### ✅ Performance
- No 46GB folder in Git or Vercel
- Fast image delivery via Sanity CDN
- Optimized responsive images

### ✅ Manageability
- Edit project data in Sanity Studio
- Upload new images via Sanity
- No code changes needed for content updates

### ✅ Scalability
- Add unlimited projects via Sanity
- Images hosted separately from code
- Easy to add new fields/metadata

### ✅ Developer Experience
- Clean Git history (no large files)
- Fast deployments (no projects folder)
- Easy content updates (via Sanity Studio)

## Next Steps

1. **View Projects**: Visit https://r97logzc.sanity.studio
2. **Edit Content**: Update titles, descriptions, categories
3. **Add More Images**: Upload additional images via Sanity Studio
4. **Add Arabic Translations**: Use Sanity's i18n features
5. **Feature Projects**: Toggle featured status in Sanity

## Technical Details

### Sanity Schema

Projects have these fields:
- `title` (string)
- `slug` (slug)
- `excerpt` (text)
- `mainImage` (image)
- `gallery` (array of images)
- `category` (string)
- `location` (string)
- `year` (string)
- `client` (string, optional)
- `featured` (boolean)
- `publishedAt` (datetime)
- `__i18n_lang` (string)

### Image Upload Process

1. Read image file from local projects folder
2. Upload to Sanity via Assets API
3. Get asset reference ID
4. Store reference in project document
5. Sanity handles hosting, CDN, optimization

### Cost Considerations

Sanity Free Tier:
- **Included**: 10GB assets storage
- **Estimated Usage**: ~2-3GB for 160 high-res images
- **Well within limits**: No cost for your current setup

## Troubleshooting

### Import Failed
- Check Sanity credentials in `.env.local`
- Ensure `SANITY_API_TOKEN` has write permissions
- Run `npm run import:projects` again (it's safe to re-run)

### Images Not Showing
- Clear Next.js cache: `rm -rf .next`
- Restart dev server
- Check Sanity Studio to verify images uploaded

### Want to Import More Images
- Increase `MAX_IMAGES_PER_PROJECT` in script
- Delete existing projects in Sanity Studio
- Run import script again

## Summary

Your website is now **fully powered by Sanity CMS** with:
- ✅ 20 real projects with real images
- ✅ Optimized image delivery via CDN
- ✅ Clean codebase (no 46GB folder in Git)
- ✅ Fast deployments (no large files)
- ✅ Easy content management (Sanity Studio)

All your project data is professionally structured and ready for production!
