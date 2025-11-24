# 🚀 Migration Guide: WordPress to Sanity CMS

This guide walks you through migrating your 13 WordPress projects to Sanity CMS and switching your data source.

---

## 📋 Prerequisites

✅ **Already Complete:**
- Sanity Studio running at http://localhost:3333
- Environment variables configured
- 13 WordPress projects in `projectResData.ts`
- Migration script ready

---

## 🎯 Step 1: Run the Migration

The migration script will:
- Upload all images to Sanity CDN
- Create project documents in Sanity
- Preserve all metadata (title, description, location, etc.)
- Handle bilingual content (English + Arabic)

### Run Migration:

```bash
npm run migrate:sanity
```

**What to Expect:**
- Script will process each of the 13 projects
- Images will upload to Sanity CDN (may take a few minutes)
- Console will show progress for each project
- Final summary will show success/failure counts

**Example Output:**
```
🚀 Starting migration from WordPress to Sanity...

📊 Found 13 projects to migrate

Processing project: CLUB LOUNGE ADDRESS BOULEVARD...
  Uploading featured image...
  Uploading 7 gallery images...
✅ Migrated: CLUB LOUNGE ADDRESS BOULEVARD

...

📈 Migration Summary:
  ✅ Successful: 13
  ❌ Failed: 0
  📊 Total: 13

🎉 Migration complete!

📍 View your projects in Sanity Studio: http://localhost:3333
```

---

## 🎨 Step 2: Verify in Sanity Studio

1. **Open Sanity Studio:**
   ```
   http://localhost:3333
   ```

2. **Check Projects:**
   - Click "Project" in the sidebar
   - You should see all 13 projects
   - Open a few to verify:
     - ✅ Title (English & Arabic)
     - ✅ Featured image
     - ✅ Gallery images
     - ✅ Description
     - ✅ Location, Year, Client
     - ✅ Project Type

3. **Edit if Needed:**
   - Add missing information
   - Update descriptions
   - Adjust images
   - Click "Publish" to save changes

---

## 🔄 Step 3: Switch to Sanity Data Source

Once you've verified the data in Sanity, switch your app to use Sanity instead of WordPress:

### Update `lib/wordpress.ts`:

**Current (WordPress):**
```typescript
import {
  getWordPressProjects,
  getWordPressProjectBySlug,
  // ...
} from './wordpress-adapter';

export async function getProjects(locale: string = 'en') {
  return getWordPressProjects(locale);
}
```

**Change to (Sanity):**
```typescript
import {
  getSanityProjects,
  getSanityProjectBySlug,
  getSanityProjectsByType,
  getSanityFeaturedProjects,
} from './sanity-adapter';

export async function getProjects(locale: string = 'en') {
  return getSanityProjects(locale);
}

export async function getProjectBySlug(slug: string, locale: string = 'en') {
  const project = await getSanityProjectBySlug(slug, locale);

  if (!project) {
    throw new Error(`Project not found: ${slug}`);
  }

  return project;
}

export async function getProjectsByType(type: string, locale: string = 'en') {
  return getSanityProjectsByType(type, locale);
}

export async function getFeaturedProjects(limit: number = 6, locale: string = 'en') {
  return getSanityFeaturedProjects(limit, locale);
}
```

---

## ✅ Step 4: Test the Switch

1. **Build the site:**
   ```bash
   npm run build
   ```

2. **Verify all pages generate:**
   - Should still generate 90 pages
   - Projects should now come from Sanity
   - Images should load from Sanity CDN

3. **Test locally:**
   ```bash
   npm run dev
   ```

   Visit:
   - `/projects` - Should show all 13 projects
   - `/projects/[slug]` - Should show project details
   - Check images are loading

4. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## 🎉 Benefits of Sanity CMS

Now that you're on Sanity, you can:

### **Real-time Editing:**
- Edit content in Sanity Studio
- Changes appear immediately (with revalidation)
- No need to redeploy

### **Better Image Handling:**
- Automatic CDN distribution
- Image optimization
- Multiple formats (WebP, AVIF)
- On-demand resizing

### **Rich Content:**
- Block content for rich text
- Embedded media
- Custom content blocks

### **Webhooks (Optional):**
Set up webhooks for instant updates:
```
https://www.sanity.io/manage/personal/project/b6q28exv/api/webhooks
```

---

## 📊 Current vs. Sanity Comparison

| Feature | WordPress (Current) | Sanity CMS |
|---------|-------------------|------------|
| **Data Source** | Static `projectResData.ts` | Live Sanity API |
| **Image CDN** | WordPress uploads | Sanity CDN |
| **Updates** | Code changes + redeploy | Studio edits only |
| **Bilingual** | Manual in code | Built-in localization |
| **Performance** | Static (fast) | Static + ISR (faster) |
| **Editing** | Developer only | Client-friendly |

---

## 🔧 Troubleshooting

### Migration fails:
```bash
# Check environment variables
echo $SANITY_API_TOKEN

# If empty, add to .env.local:
SANITY_API_TOKEN=your-token-here
```

### Images not loading:
```typescript
// In next.config.ts, verify cdn.sanity.io is included:
{
  protocol: 'https',
  hostname: 'cdn.sanity.io',
}
```

### Project not found:
- Check the slug in Sanity Studio matches the URL
- Slugs are auto-generated from WordPress slugs
- Edit slug in Studio if needed

---

## 🎯 Quick Commands

```bash
# Migrate WordPress to Sanity
npm run migrate:sanity

# Start Sanity Studio
npx sanity dev --port 3333

# Deploy Studio to cloud
npx sanity deploy

# Build site
npm run build

# Deploy to production
vercel --prod
```

---

## 📝 Next Steps (Optional)

1. **Add More Content:**
   - Services
   - Industries
   - Blog posts

2. **Customize Schemas:**
   - Edit `sanity/schemas/project.ts`
   - Add new fields
   - Redeploy Studio

3. **Set Up Webhooks:**
   - Auto-revalidate on content changes
   - Instant updates without redeploy

---

## ✅ Migration Checklist

- [ ] Run migration script
- [ ] Verify all 13 projects in Sanity Studio
- [ ] Check images are uploaded correctly
- [ ] Update `lib/wordpress.ts` to use Sanity adapter
- [ ] Test build locally
- [ ] Deploy to production
- [ ] Verify production site
- [ ] Update content in Sanity Studio to test real-time updates

---

**Questions?** Check the [Sanity Documentation](https://www.sanity.io/docs) or the `SANITY_INTEGRATION_COMPLETE.md` file.
