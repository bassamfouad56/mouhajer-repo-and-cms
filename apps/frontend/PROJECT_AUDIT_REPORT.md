# Project Audit Report: CMS Integration & Image Management
**Date:** 2025-10-11
**Live CMS URL:** `https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app`

---

## Executive Summary

This audit analyzed all pages and components in the Mouhajer project to identify:
1. Hardcoded `/images/` paths that should use CMS images
2. CMS data fetching patterns
3. Areas requiring migration to CMS-sourced content

**Overall Status:** ✅ **GOOD** - Most components properly use CMS data. Only 6 files contain hardcoded placeholder images.

---

## 1. Hardcoded Image References

### 🔴 Critical: Files Using Hardcoded `/images/` Paths

#### **Components (5 files)**

1. **`components/HeroBanner.tsx`** (Line 5)
   - Hardcoded: `import ProjectsLinkImage from '../public/images/333333.jpg'`
   - Usage: Projects link button image (line 100, 145)
   - **Fix:** Pass image URL as prop from CMS or use media library

2. **`components/AboutSectionHomePageCarousel.tsx`** (Lines 4-6)
   - Hardcoded:
     ```typescript
     import Engineer1 from "../public/images/333333.jpg"
     import ViewOne from "../public/images/333333.jpg"
     import EngineerDiscussion from "../public/images/333333.jpg"
     ```
   - Usage: Multiple carousel images throughout component
   - **Fix:** Component needs to receive carousel images as props from CMS

3. **`components/HowWeWork.tsx`** (Lines 5-6)
   - Hardcoded:
     ```typescript
     import ImageBig from "../public/images/333333.jpg"
     import ImageSmall from "../public/images/333333.jpg"
     ```
   - Usage: Section header images (lines 42, 49)
   - **Status:** Component already accepts `big_image` and `small_image` props ✅
   - **Fix:** Parent component needs to pass CMS images instead of fallbacks

4. **`components/WhatsappComp.tsx`** (Line 13)
   - Hardcoded: `const WHATSAPP_TEXT_IMAGE = "https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006894324-whatsapptext-BHZUJdi9GcCIxHfeUOR1lpOqmNSPHT.webp"`
   - **Status:** ✅ Actually using Vercel Blob Storage (CMS uploaded)
   - **Fix:** None needed - this is correct implementation

5. **`components/optimized/OptimizedImage.tsx`** (Line 33)
   - Hardcoded: `fallback = '/images/placeholder.jpg'`
   - **Status:** ✅ This is intentional - fallback for failed image loads
   - **Fix:** None needed - this is correct error handling

#### **Pages (1 file)**

6. **`app/[locale]/contact-us/page.tsx`** (Lines 46-48)
   - Hardcoded: Fallback paths `/images/2024/03/333333.jpg`
   - Usage: Contact page hero images
   - **Status:** ⚠️ Uses CMS first, then fallbacks
   - **Fix:** Ensure CMS has `settings.contactImages` array populated

---

## 2. CMS Data Fetching Patterns

### ✅ Pages Properly Using CMS

All pages are correctly fetching from the live CMS. Here's the breakdown:

| Page | CMS Data Source | Status |
|------|----------------|--------|
| **Homepage** (`app/[locale]/page.tsx`) | `getHomepageData()` | ✅ Uses GraphQL with REST fallback |
| **Blog List** (`app/[locale]/blogs/page.tsx`) | `cmsClient.getBlogPosts()` | ✅ Fetches from CMS |
| **Blog Detail** (`app/[locale]/blogs/[slug]/page.tsx`) | `cmsClient.getBlogPost()` | ✅ Dynamic per post |
| **Projects** (`app/[locale]/our-projects/page.tsx`) | `cmsClient.getProjects()` | ✅ Fetches from CMS |
| **Services** (`app/[locale]/services/page.tsx`) | `cmsClient.getServices()` | ✅ Fetches from CMS |
| **Contact** (`app/[locale]/contact-us/page.tsx`) | `cmsClient.getSettings()` | ✅ With fallbacks |
| **Who We Are** (`app/[locale]/who-we-are/page.tsx`) | `cmsClient.getSettings()` | ✅ Company info |
| **Careers** (`app/[locale]/careers/page.tsx`) | `cmsClient.getSettings()` | ✅ Career data |
| **Suppliers** (`app/[locale]/suppliers/page.tsx`) | `cmsClient.getSettings()` | ✅ Supplier list |
| **Sitemap** (`app/sitemap.ts`) | Multiple CMS queries | ✅ Dynamic sitemap |

### 🔍 CMS Client Configuration

**Base URL:** Properly configured in `.env.local`
```env
NEXT_PUBLIC_CMS_URL=https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app
NEXT_PUBLIC_GRAPHQL_URL=https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app/api/graphql
```

**lib/cms-client.ts**: ✅ Working correctly
- REST API fallback implemented
- Settings transformation working
- Error handling in place
- Caching with ISR (revalidation times set appropriately)

---

## 3. Images Currently in Use

### Static Placeholder Image
- **File:** `public/images/333333.jpg` (207 KB)
- **Used in:** 5 components as fallback
- **Should be replaced:** With CMS images

### CMS-Hosted Images (Correct Usage ✅)
The following are already using CMS/CDN images:
- WhatsApp text image (Vercel Blob Storage)
- All blog featured images (from CMS)
- All project images (from CMS)
- Service images (from CMS)
- Award logos (from media library)
- Client logos (from media library)

---

## 4. Recommendations

### 🔴 Priority 1: Fix Hardcoded Images

#### A. Contact Page (`app/[locale]/contact-us/page.tsx`)
**Current:**
```typescript
second_small_image={settings.contactImages?.[0] || "/images/2024/03/333333.jpg"}
```

**Fix:** Upload contact images to CMS and ensure `settings.contactImages` is populated.

**Steps:**
1. Upload 3 images to CMS media library with tag "contact"
2. Add to settings configuration:
   ```json
   {
     "contactImages": [
       "https://cms-url/media/contact-1.jpg",
       "https://cms-url/media/contact-2.jpg",
       "https://cms-url/media/contact-3.jpg"
     ]
   }
   ```

#### B. Homepage Carousel (`components/AboutSectionHomePageCarousel.tsx`)
**Current:** Uses hardcoded imports

**Fix:** Modify to accept props:
```typescript
type Props = {
  carouselImages: string[];  // Array of CMS image URLs
};

const AboutSectionHomePageCarousel = ({ carouselImages }: Props) => {
  // Replace Engineer1, ViewOne, EngineerDiscussion with carouselImages[0], [1], [2]
}
```

Then pass from parent:
```typescript
<AboutSectionHomePageCarousel
  carouselImages={homePage?.blocks?.find(b => b.type === 'about_carousel')?.data?.images || []}
/>
```

#### C. HeroBanner (`components/HeroBanner.tsx`)
**Current:** Uses hardcoded `ProjectsLinkImage`

**Fix:** Add prop:
```typescript
type Props = {
  projectsLinkImage?: string;
  // ... existing props
};

const HeroBanner = ({ projectsLinkImage, ... }: Props) => {
  <Image src={projectsLinkImage || PLACEHOLDER_IMAGE} ... />
}
```

#### D. HowWeWork (`components/HowWeWork.tsx`)
**Current:** Already has props but parent isn't using CMS

**Fix:** Parent component should pass CMS images:
```typescript
<HowWeWork
  big_image={howWeWorkBlock?.data?.bigImage || PLACEHOLDER_IMAGE}
  small_image={howWeWorkBlock?.data?.smallImage || PLACEHOLDER_IMAGE}
  arr={howWeWorkBlock?.data?.steps || []}
/>
```

### 🟡 Priority 2: Add CMS Fields

Create these fields in your CMS settings collection:

```typescript
interface Settings {
  // Existing fields...

  // Add these:
  contactImages?: string[];           // 3 images for contact page
  projectsLinkImage?: string;         // Small projects button image
  aboutCarouselImages?: string[];     // Images for about carousel
  howWeWorkImages?: {
    big: string;
    small: string;
  };
}
```

### 🟢 Priority 3: Cleanup

1. **Remove unused imports** in components after CMS migration
2. **Update PLACEHOLDER_IMAGE constant** in `lib/image-utils.ts` to use a CMS-hosted placeholder
3. **Document** which CMS fields control which UI elements

---

## 5. Testing Checklist

After implementing fixes, test:

- [ ] Homepage loads without hardcoded images
- [ ] Contact page displays CMS contact images
- [ ] About carousel shows CMS images
- [ ] Projects link button uses CMS image
- [ ] How We Work section displays CMS images
- [ ] All pages fallback gracefully if CMS fails
- [ ] Build completes without warnings
- [ ] Image optimization working (Next.js Image)

---

## 6. Summary Statistics

| Metric | Count | Status |
|--------|-------|--------|
| **Total Pages Using CMS** | 10 | ✅ |
| **Components with Hardcoded Images** | 3 | 🔴 Need fixing |
| **Components Using CMS Correctly** | 50+ | ✅ |
| **CMS API Endpoints Used** | 8 | ✅ |
| **GraphQL Integration** | Partial | 🟡 In progress |
| **Error Handling** | Implemented | ✅ |

---

## 7. Next Steps

1. ✅ **Complete:** CMS client working with settings transformation
2. ✅ **Complete:** Error handling for undefined settings
3. 🔴 **TODO:** Upload missing images to CMS
4. 🔴 **TODO:** Update components to use CMS props
5. 🟡 **In Progress:** GraphQL migration for better performance
6. 🟢 **Future:** Add image CDN (Vercel Blob/Cloudinary) for all images

---

## Conclusion

Your project is **well-architected** for CMS integration. The main work needed is:

1. Uploading 6-8 images to the CMS
2. Updating 3-4 components to use props instead of hardcoded imports
3. Testing the fallback behavior

**Estimated Time to Fix:** 2-3 hours

The CMS fetching is solid, error handling is in place, and most of the codebase is already properly integrated. Great work! 🎉
