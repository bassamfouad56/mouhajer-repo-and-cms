# Sanity CMS Setup Guide

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
