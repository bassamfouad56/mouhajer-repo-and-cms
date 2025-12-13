# Sanity Images Migration Guide

## 🔍 Audit Summary

### Current State
- **985 images in Sanity** ✅ (Your real project images)
- **74 images in `/public` folder** ⚠️ (Stock/placeholder images)
- **88 unused Sanity images** 💡 (Can be used for placeholders)
- **53 projects without images** 📸 (Need image assignment)
- **6 awards without images** 🏆 (Need image assignment)

---

## ✅ Completed Automated Changes

### 1. Created Utility Functions
**File:** [`lib/sanity-images.ts`](lib/sanity-images.ts)

New utility functions for fetching Sanity images:
- `getSanityImages()` - Fetch random images by category
- `getRandomSanityImage()` - Get a single random image
- `getProjectImages()` - Get images for a specific project
- `getUnusedSanityImages()` - Get images not referenced anywhere
- `mapSanityImage()` - Convert Sanity image to component format

### 2. Updated Award Schema
**File:** [`sanity/schemas/award.ts`](sanity/schemas/award.ts)

Added new fields to support direct image assignment:
- `projectName` - Text field for project name
- `projectImage` - Direct image upload for project
- `level` - Award level (5-Star, Best, Winner, etc.)
- `subtitle` - Short description

### 3. Created Audit Script
**File:** [`scripts/audit-images.ts`](scripts/audit-images.ts)

Run this to audit image usage:
```bash
npx tsx scripts/audit-images.ts
```

Generates a full report saved to `IMAGE_AUDIT_REPORT.json`

### 4. Created Image Assignment Script
**File:** [`scripts/assign-images-to-content.ts`](scripts/assign-images-to-content.ts)

⚠️ **Requires write-enabled Sanity API token** (see Manual Steps below)

This script will automatically:
- Assign random Sanity images to awards without images
- Assign 3-5 random images to each project without images
- Set mainImage for each project

---

## 📋 Manual Steps Required

### Step 1: Update Sanity API Token (For Write Access)

Your current `SANITY_API_TOKEN` has **read-only** permissions. To run automated scripts, you need a token with **write** permissions.

#### Get a Write Token:
1. Go to [Sanity Manage](https://www.sanity.io/manage/personal/project/r97logzc/api)
2. Click **Tokens** in the left sidebar
3. Click **Add API token**
4. Name it: `Write Token for Local Development`
5. Permissions: Select **Editor** or **Administrator**
6. Copy the token

#### Update Environment Variable:
```bash
# In your .env.local file
SANITY_API_TOKEN=your-new-write-token-here
```

### Step 2: Assign Images via Sanity Studio

#### Option A: Automated (After getting write token)
```bash
npx tsx scripts/assign-images-to-content.ts
```

This will automatically assign Sanity images to all projects and awards.

#### Option B: Manual Assignment via Studio

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Open Sanity Studio:**
   ```
   http://localhost:4050/studio
   ```

3. **Go to Media tab** (you'll see the new Media plugin we installed)
   - Browse all 985 images
   - See which images are unused

4. **Assign images to Awards:**
   - Navigate to **Awards** in the Studio
   - Open each award
   - Click **Project Image** field
   - Select an image from Sanity or upload new
   - Save

5. **Assign images to Projects:**
   - Navigate to **Projects** in the Studio
   - Open each project
   - Click **Images** field (array field)
   - Add 3-5 images per project
   - The first image will be used as the main image
   - Save

---

## 🎨 Component Updates Needed

### Components Using Placeholder Images

Based on the audit, these components reference images in `/public`:

#### 1. Awards Components
**Files to update:**
- `components/awards/luxury-awards-showcase.tsx` ✅ (Already uses Sanity via page)
- `app/[locale]/about/awards/page.tsx` ⚠️ (Needs update - see below)

**Update Required:**
The awards page currently uses `/placeholder.jpg` fallback. Once images are assigned via Sanity Studio, this will automatically pull real images.

#### 2. Hero Sections
**Files with hard-coded images:**
- `components/header.tsx` - Uses `/logo.svg`
- `components/footer.tsx` - Uses `/logo.svg`
- Various hero components - Check for `src="/..."` patterns

#### 3. Service Pages
**Files to check:**
- `app/[locale]/services/**/*.tsx` - May have icons/images
- MEP engineering page references `/mep/Layer*.png` files

---

## 🔄 Update Awards Page (Recommended)

The awards page needs a small update to use the new Sanity utilities:

**File:** `app/[locale]/about/awards/page.tsx`

Replace the import section:
```typescript
import { getUnusedSanityImages } from '@/lib/sanity-images';
```

Update the `getAwards` function to use the priority system:
```typescript
async function getAwards() {
  // ... fetch awards ...

  // Get unused Sanity images for fallback
  const unusedImages = await getUnusedSanityImages(awards.length);
  let fallbackImageIndex = 0;

  // Transform awards with proper image handling
  const transformedAwards = awards.map((award: any) => {
    let projectImage = null;

    // Priority 1: Use award's direct projectImage field
    if (award.projectImage) {
      projectImage = urlForImage(award.projectImage)
        .width(1200)
        .height(750)
        .auto('format')
        .url();
    }
    // Priority 2: Use linked project's mainImage
    else if (award.project?.mainImage) {
      projectImage = urlForImage(award.project.mainImage)
        .width(1200)
        .height(750)
        .auto('format')
        .url();
    }
    // Priority 3: Use unused Sanity image as fallback
    else if (unusedImages[fallbackImageIndex]) {
      projectImage = unusedImages[fallbackImageIndex].url;
      fallbackImageIndex++;
    }

    // ... rest of transformation ...
  });
}
```

---

## 🧹 Clean Up Public Folder (Optional)

Once all images are migrated to Sanity, you can remove stock images from `/public`:

```bash
# Keep these essential files:
/public/logo.svg
/public/awards/*.pdf (certificates)
/public/founder/*.jpg (founder images - consider moving to Sanity too)

# Consider removing:
/public/placeholder.jpg
/public/mep/Layer*.png (if MEP logos can go to Sanity)
```

---

## ✅ Testing Checklist

After completing the steps above:

1. ✅ Run the audit script again:
   ```bash
   npx tsx scripts/audit-images.ts
   ```
   - Verify: Projects with images increased
   - Verify: Awards with images increased

2. ✅ Test Awards page:
   ```bash
   npm run dev
   ```
   - Visit: `http://localhost:4050/en/about/awards`
   - Verify: All awards show real project images (no placeholders)

3. ✅ Check Sanity Studio:
   - Visit: `http://localhost:4050/studio`
   - Go to **Media** tab
   - Verify: Can see and manage all 985 images

4. ✅ Test Projects page:
   - Visit: `http://localhost:4050/en/projects`
   - Verify: All projects show images from Sanity

---

## 📊 Expected Results

### Before:
- ❌ Awards showing `/placeholder.jpg`
- ❌ 53 projects without images
- ❌ Unused Sanity images wasted
- ❌ Stock images in `/public` folder

### After:
- ✅ All awards showing real Sanity images
- ✅ All projects with 3-5 gallery images
- ✅ Unused Sanity images utilized
- ✅ Clean `/public` folder
- ✅ All images managed centrally in Sanity

---

## 🆘 Troubleshooting

### Issue: "Insufficient permissions" error
**Solution:** Update `SANITY_API_TOKEN` with a token that has Editor/Admin permissions (see Step 1 above)

### Issue: Images not showing after assignment
**Solution:**
1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check browser console for errors

### Issue: Can't see Media tab in Studio
**Solution:**
1. Verify `sanity-plugin-media` is installed: `npm list sanity-plugin-media`
2. Verify `sanity.config.ts` includes: `media()` in plugins array
3. Restart dev server

---

## 📚 Reference

### Useful Commands
```bash
# Audit images
npx tsx scripts/audit-images.ts

# Assign images (requires write token)
npx tsx scripts/assign-images-to-content.ts

# Count Sanity images
npx tsx scripts/count-sanity-images.ts

# Start dev server
npm run dev

# Open Sanity Studio
# Visit: http://localhost:4050/studio
```

### Key Files Created/Modified
- ✅ `lib/sanity-images.ts` - New utility functions
- ✅ `sanity/schemas/award.ts` - Updated schema
- ✅ `scripts/audit-images.ts` - Audit script
- ✅ `scripts/assign-images-to-content.ts` - Assignment script
- ✅ `sanity.config.ts` - Added media plugin
- ⚠️ `app/[locale]/about/awards/page.tsx` - Needs manual update (see above)

---

## 🎯 Next Steps

1. ⬜ Get write-enabled Sanity API token
2. ⬜ Run image assignment script OR manually assign via Studio
3. ⬜ Update awards page code (see section above)
4. ⬜ Test all pages
5. ⬜ Remove placeholder images from `/public`
6. ⬜ Celebrate! 🎉

---

**Need Help?** The Sanity images migration is now set up. Follow the steps above to complete the transition from placeholder images to real Sanity images.
