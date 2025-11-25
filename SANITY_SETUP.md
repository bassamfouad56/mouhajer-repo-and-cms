# Sanity CMS Setup Guide - Advanced Features

This guide explains the advanced Sanity.io features that have been implemented in your project.

## 🎉 New Features Added

✅ **Internationalization (i18n)** - Arabic & English content support
✅ **Portable Text Rendering** - Rich content with custom styling
✅ **Preview Mode** - Live draft content preview
✅ **Webhooks** - Automatic revalidation on content changes

---

# Original Setup Guide

This guide will help you set up Sanity CMS for the Mouhajer International Design website.

## Prerequisites

- Node.js 18+ installed
- A Sanity account (create one at https://www.sanity.io)

## Step 1: Create a Sanity Project

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Click "Create project"
3. Choose a project name (e.g., "mouhajer-design")
4. Select a dataset name (use "production")
5. Copy your **Project ID** - you'll need this later

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the Sanity variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-11-21
   SANITY_API_TOKEN=your-api-token-here
   ```

## Step 3: Generate API Token

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Tokens**
4. Click "Add API token"
5. Name it "Production Token"
6. Set permissions to **Editor**
7. Copy the token and add it to `.env.local` as `SANITY_API_TOKEN`

## Step 4: Initialize Sanity Studio

Run the following command to start Sanity Studio locally:

```bash
npx sanity dev
```

This will:
- Start Sanity Studio at http://localhost:3333
- Allow you to create and manage content

## Step 5: Deploy Sanity Studio (Optional)

To deploy Sanity Studio for team access:

```bash
npx sanity deploy
```

Choose a studio hostname (e.g., `mouhajer-design`), and your studio will be available at:
```
https://mouhajer-design.sanity.studio
```

## Content Structure

The project includes the following content types:

### 1. Projects
- **Title**: Project name
- **Slug**: URL-friendly identifier
- **Excerpt**: Short description
- **Main Image**: Featured image
- **Gallery**: Multiple project images
- **Category**: residential, commercial, hospitality, institutional, retail
- **Location**: Project location
- **Year**: Completion year
- **Area**: Square meters
- **Client**: Client name (optional)
- **Services**: Related services
- **Industries**: Related industries
- **Content**: Rich text content
- **Featured**: Mark as featured project
- **SEO**: Meta title, description, keywords

### 2. Services
- **Title**: Service name
- **Slug**: URL-friendly identifier
- **Excerpt**: Short description
- **Main Image**: Featured image
- **Icon**: Lucide icon name
- **Features**: List of service features
- **Process**: Step-by-step process
- **Content**: Rich text content
- **Related Projects**: Link to relevant projects
- **Featured**: Mark as featured service
- **Order**: Display order
- **SEO**: Meta title, description, keywords

### 3. Industries
- **Title**: Industry name
- **Slug**: URL-friendly identifier
- **Excerpt**: Short description
- **Main Image**: Featured image
- **Icon**: Lucide icon name
- **Challenges**: Industry-specific challenges
- **Solutions**: Our solutions
- **Content**: Rich text content
- **Related Projects**: Link to relevant projects
- **Related Services**: Link to relevant services
- **Featured**: Mark as featured industry
- **Order**: Display order
- **SEO**: Meta title, description, keywords

### 4. Blog Posts
- **Title**: Post title
- **Slug**: URL-friendly identifier
- **Excerpt**: Short description
- **Main Image**: Featured image
- **Category**: trends, tips, case-studies, news
- **Author**: Name, role, image
- **Content**: Rich text content
- **Read Time**: Estimated read time in minutes
- **Tags**: Post tags
- **Related Projects**: Link to relevant projects
- **Featured**: Mark as featured post
- **Published At**: Publication date
- **SEO**: Meta title, description, keywords

## Using Sanity Data in Next.js

The project is already configured to use Sanity. Here's how data flows:

### Mock Data (Current)
Currently using mock data from `lib/mock-data.ts`

### Switch to Sanity (When Ready)

1. Update `lib/wordpress.ts` to import from Sanity instead:

```typescript
// Replace mock data imports with Sanity
export {
  getSanityProjects as getProjects,
  getSanityProjectBySlug as getProjectBySlug,
  getSanityServices as getServices,
  getSanityServiceBySlug as getServiceBySlug,
  getSanityIndustries as getIndustries,
  getSanityIndustryBySlug as getIndustryBySlug,
  getSanityPosts as getPosts,
  getSanityPostBySlug as getPostBySlug,
} from '@/sanity/lib/fetch'
```

2. Update types to match Sanity schemas (in `lib/wordpress.ts` or create `lib/types.ts`)

3. Test locally:
```bash
npm run dev
```

## Adding Sample Content

Once Sanity Studio is running:

1. Go to http://localhost:3333 (or your deployed studio URL)
2. Click on **Projects**, **Services**, **Industries**, or **Blog Posts**
3. Click "Create new" to add content
4. Fill in the fields and click "Publish"

## Image Handling

Sanity automatically handles image optimization. To use images in your components:

```typescript
import { urlForImage } from '@/sanity/lib/image'

// In your component
const imageUrl = urlForImage(project.mainImage).width(800).height(600).url()
```

## CORS Configuration

If you encounter CORS errors:

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **CORS Origins**
4. Add your development URL: `http://localhost:4050`
5. Add your production URL: `https://www.mouhajerdesign.com`

## Querying Data

All queries are pre-configured in `sanity/lib/queries.ts` and `sanity/lib/fetch.ts`.

Example usage:
```typescript
import { getSanityProjects } from '@/sanity/lib/fetch'

const projects = await getSanityProjects()
```

## Troubleshooting

### "Project ID not found"
- Make sure `NEXT_PUBLIC_SANITY_PROJECT_ID` is set in `.env.local`
- Restart your dev server after changing environment variables

### "Unauthorized"
- Check that `SANITY_API_TOKEN` is correctly set in `.env.local`
- Verify the token has Editor permissions

### "Schema type not found"
- Run `npx sanity schema extract` to update schema
- Restart Sanity Studio

## Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "sanity:dev": "npx sanity dev",
    "sanity:deploy": "npx sanity deploy",
    "sanity:manage": "npx sanity manage"
  }
}
```

## Next Steps

1. Create sample content in Sanity Studio
2. Test that data appears on your website
3. Customize schemas as needed for your specific requirements
4. Set up webhooks for instant revalidation (optional)

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js + Sanity Guide](https://www.sanity.io/docs/nextjs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)

---

For questions or issues, refer to the main README.md or contact the development team.

---

# 🆕 Advanced Features Documentation

## 1. Internationalization (i18n)

### What it does:
- Allows you to create separate English and Arabic versions of each document
- Documents are linked as translations
- Editors can manage translations independently

### How to use in Sanity Studio:
1. Create a document (e.g., a new Project)
2. You'll see a language selector in the top bar
3. After publishing the English version, click "Create translation"
4. Select Arabic and create the Arabic version
5. Both versions are now linked

### Querying translated content:
```typescript
// Automatically filters by language
const projects = await client.fetch(
  `*[_type == "project" && __i18n_lang == $lang]`,
  { lang: 'en' }
);
```

## 2. Portable Text Rendering

### What it does:
- Renders rich text content from Sanity's block editor
- Custom styled components matching your design
- Supports images, links, lists, headings, etc.

### Usage in your code:
```typescript
import { PortableTextRenderer } from '@/components/portable-text';

// In any component
<PortableTextRenderer value={project.content} />
```

### Supported features:
- **Headings:** H1-H4 with custom styling
- **Paragraphs:** Standard body text
- **Lists:** Bulleted and numbered
- **Links:** Internal and external with proper targeting
- **Images:** Embedded with captions
- **Blockquotes:** Styled quotes
- **Bold, Italic, Code:** Inline formatting

## 3. Preview Mode

### What it does:
- View draft/unpublished content on your actual website
- Perfect for reviewing changes before publishing
- Shows a yellow banner when in preview mode

### Setup:
1. Add to `.env.local`:
```env
SANITY_PREVIEW_SECRET=generate-a-random-secret-string-here
```

2. In Vercel, add the same environment variable

### How to use:
**Option A: Direct URL**
```
https://your-site.com/api/preview?secret=YOUR_SECRET&slug=/projects/project-slug
```

**Option B: From Sanity Studio (Future)**
You can add a custom action button that opens preview directly.

**Exit Preview:**
- Click "Exit Preview" in the yellow banner
- Or visit: `https://your-site.com/api/preview/disable`

## 4. Webhooks for Auto-Revalidation

### What it does:
- Automatically updates your website when you publish content in Sanity
- No need to manually redeploy
- Uses Next.js On-Demand ISR (Incremental Static Regeneration)

### Setup in Sanity:
1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click **Create webhook**

5. **Configure webhook:**
   ```
   Name: Production Revalidation
   URL: https://your-production-domain.com/api/revalidate
   Dataset: production
   Trigger on: Create, Update, Delete
   HTTP method: POST
   ```

6. **Add HTTP Headers:**
   ```
   x-sanity-webhook-secret: your-random-secret
   ```

7. **Optional Filter (recommended):**
   ```groq
   _type in ["project", "service", "industry", "post"]
   ```

8. **Save and copy the secret**

### Setup in your app:
Add to `.env.local`:
```env
SANITY_REVALIDATE_SECRET=the-secret-you-just-created
```

Add to Vercel environment variables (same secret).

### Testing webhook:
**Test with curl:**
```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "x-sanity-webhook-secret: your-secret" \
  -H "Content-Type: application/json" \
  -d '{"_type":"project","slug":{"current":"test-project"}}'
```

**Or test via GET (easier for testing):**
```
https://your-domain.com/api/revalidate?secret=your-secret&path=/en/projects
```

### What gets revalidated:
- **Project changes:** Projects page + specific project + homepage
- **Service changes:** Services page + specific service + homepage
- **Industry changes:** Industries page + specific industry + homepage
- **Blog post changes:** Blog page + specific post

## 5. Custom Input Components (Optional - Not Yet Implemented)

### Location Picker with Google Maps:
```bash
npm install @sanity/google-maps-input
```

Update `sanity.config.ts`:
```typescript
import { googleMapsInput } from '@sanity/google-maps-input';

plugins: [
  googleMapsInput({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  })
]
```

Then in your schema:
```typescript
defineField({
  name: 'location',
  title: 'Location',
  type: 'geopoint',
})
```

### Color Picker:
```bash
npm install sanity-plugin-color-picker
```

### Custom Area Input (Square Meters/Feet):
Create a custom input component for area with unit selector.

---

## 🔄 Switching from WordPress to Sanity

Your project currently uses WordPress but has full Sanity support ready. To switch:

### Step 1: Update lib/wordpress.ts

Find functions like `getProjects()` and change:

**Before:**
```typescript
import { getWordPressProjects } from './wordpress-adapter';

export async function getProjects(locale: string = 'en') {
  return getWordPressProjects(locale);
}
```

**After:**
```typescript
import { getSanityProjects } from './sanity-adapter';

export async function getProjects(locale: string = 'en') {
  return getSanityProjects(locale);
}
```

### Step 2: Update queries for i18n

Edit `sanity/lib/queries.ts`:

```typescript
// Add language filtering
export const projectsQuery = groq`
  *[_type == "project" && __i18n_lang == $locale] | order(publishedAt desc) {
    // ... fields
  }
`
```

### Step 3: Use Portable Text renderer

In project detail pages:

```tsx
import { PortableTextRenderer } from '@/components/portable-text';

// Replace HTML rendering with:
<PortableTextRenderer value={project.content} />
```

### Step 4: Test locally

```bash
npm run dev
```

### Step 5: Migrate content

Use the migration script or manually recreate content in Sanity Studio.

---

## 📋 Deployment Checklist

### Before Deploying:

- [ ] Added `SANITY_PREVIEW_SECRET` to Vercel environment variables
- [ ] Added `SANITY_REVALIDATE_SECRET` to Vercel environment variables
- [ ] Created webhook in Sanity Manage
- [ ] Webhook URL points to production domain
- [ ] Webhook secret matches `SANITY_REVALIDATE_SECRET`
- [ ] Tested preview mode locally
- [ ] Created sample content in Sanity Studio
- [ ] Tested that content appears on site

### After Deploying:

- [ ] Test webhook by publishing content
- [ ] Verify automatic revalidation works
- [ ] Test preview mode in production
- [ ] Deploy Sanity Studio (optional): `npx sanity deploy`

---

## 🐛 Troubleshooting

### Webhook not triggering revalidation:
1. Check Sanity webhook logs (in Sanity Manage → Webhooks)
2. Verify webhook URL is correct and accessible
3. Check that `SANITY_REVALIDATE_SECRET` matches
4. Test with the GET endpoint first: `/api/revalidate?secret=YOUR_SECRET&path=/en`

### Preview mode not working:
1. Verify `SANITY_PREVIEW_SECRET` is set in environment variables
2. Check that the secret in URL matches environment variable
3. Try clearing cookies and cache

### i18n not showing in Studio:
1. Restart Sanity Studio: `npx sanity dev`
2. Check that `@sanity/document-internationalization` is installed
3. Verify document types are listed in `sanity.config.ts`

### Content not updating immediately:
1. This is normal - ISR revalidation takes a few seconds
2. Check webhook logs to confirm it fired
3. Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
4. Clear Vercel cache if needed

---

## 📚 Additional Resources

- [Sanity Internationalization Guide](https://www.sanity.io/plugins/sanity-plugin-internationalized-array)
- [Portable Text Specification](https://portabletext.org/)
- [Next.js On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)

---

## 🎯 What's Next?

1. **Add more content in Sanity Studio**
2. **Test all features in development**
3. **Deploy to production with environment variables**
4. **Set up webhook for auto-updates**
5. **Optionally add custom input components**
6. **Complete migration from WordPress**

---

**Need help?** Check the troubleshooting section or refer to Sanity's official documentation.

