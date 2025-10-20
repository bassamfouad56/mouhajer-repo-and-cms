# Component Image Update Guide

## ✅ Completed Updates

### 1. WhatsappComp.tsx
- **Before**: Used static imports from `../public/images/333333.jpg`
- **After**: Uses `WHATSAPP_TEXT` from CMS
- **Image URL**: https://tupbs9ia8fmtwvjh.public.blob.vercel-storage.com/images/1760006894324-whatsapptext-BHZUJdi9GcCIxHfeUOR1lpOqmNSPHT.webp

### 2. ProjectsGaller.tsx
- **Before**: Used PLACEHOLDER_IMAGE for all 7 images
- **After**: Uses `PROJECT_GALLERY_IMAGES` array (7 real images from CMS)
- **Props**: Still accepts `galleryImages?: string[]` for dynamic content

## 🔄 Pending Updates

### 3. PortfolioCarouselHomepage.tsx
**Current**: Uses `/images/placeholder.jpg`
**Update to**: `PORTFOLIO_CAROUSEL_IMAGES` from CMS
```typescript
import { PORTFOLIO_CAROUSEL_IMAGES } from '@/lib/cms-images';
// Use PORTFOLIO_CAROUSEL_IMAGES[0] instead of '/images/placeholder.jpg'
```

### 4. PortfolioCarouselHomepageMobile.tsx
**Current**: Static imports `FirstImage`, `SecondIamge` from 333333.jpg
**Update to**: Accept props with CMS images
```typescript
import { PORTFOLIO_CAROUSEL_IMAGES } from '@/lib/cms-images';
const images = carouselImages.length >= 2
  ? carouselImages
  : [PORTFOLIO_CAROUSEL_IMAGES[0], PORTFOLIO_CAROUSEL_IMAGES[1]];
```

### 5. TwoImagesWithTextAnimation.tsx
**Current**: Static imports `ImageSmall`, `ImageBig` from 333333.jpg
**Update to**:
```typescript
import { TWO_IMAGES_SMALL, TWO_IMAGES_BIG } from '@/lib/cms-images';
```

### 6. PAgeNotFoundBAnner.tsx
**Current**: Static imports ImageOne, ImageTwo, ImageThree from 333333.jpg
**Update to**:
```typescript
import { ERROR_IMAGES } from '@/lib/cms-images';
const images = errorImages.length >= 3 ? errorImages : ERROR_IMAGES;
```

### 7. AboutHistory.tsx
**Current**: Uses `img: PLACEHOLDER_IMAGE` for all 5 timeline items
**Update to**: Add proper images from CMS or keep PLACEHOLDER_IMAGE
- Timeline items should come from CMS blocks

### 8. OurVisionandMission.tsx
**Current**: Uses `src={PLACEHOLDER_IMAGE}`
**Update to**: Accept image props from CMS

### 9. LeadGenPopup.tsx
**Current**: Uses `/images/2024/03/333333.jpg`
**Update to**: Accept image prop or use PROJECT_IMAGES

### 10. NewSnippetForDubaiBEstInterioirDesign.tsx
**Current**: Static import of engineering image
**Update to**: Accept `engineerImage` prop with CMS default

### 11. HowWeWork.tsx
**Current**: Has unused imports ImageBig, ImageSmall
**Action**: Remove unused imports (already done in previous session)

### 12. BlogCardTopAndDescription.tsx
**Current**: Static import for quote icon
**Update to**:
```typescript
import { MISC_IMAGES } from '@/lib/cms-images';
// Use MISC_IMAGES.quotes
```

### 13. AboutSectionHomePageCarousel.tsx
**Current**: Static carousel images
**Update to**: Accept carousel images from CMS blocks

### 14. HeroBanner.tsx
**Current**: May have static image imports
**Update to**: Use hero images from CMS blocks

## 📝 Update Pattern

For each component:

1. **Remove static imports**:
```typescript
// DELETE THIS:
import ImageOne from "../public/images/333333.jpg";
```

2. **Add CMS import**:
```typescript
// ADD THIS:
import { PROJECT_IMAGES, PLACEHOLDER_IMAGE } from '@/lib/cms-images';
```

3. **Update component props** (if needed):
```typescript
type Props = {
  customImage?: string; // Optional CMS override
};
```

4. **Use CMS constant with fallback**:
```typescript
const imageUrl = customImage || PROJECT_IMAGES.reception1;
```

## 🎯 Priority Order

1. ✅ WhatsappComp - DONE
2. ✅ ProjectsGaller - DONE
3. TwoImagesWithTextAnimation - HIGH (used on homepage)
4. PortfolioCarouselHomepage - HIGH (homepage)
5. PortfolioCarouselHomepageMobile - HIGH (homepage mobile)
6. PAgeNotFoundBAnner - MEDIUM (404 page)
7. AboutHistory - MEDIUM (about page)
8. Others - LOW (less visible or already have props)

## 🧪 Testing

After each update:
```bash
npm run build
# Check for errors like "The requested resource isn't a valid image"
```

## 📌 Notes

- All CMS image URLs are from Vercel Blob Storage
- Images are optimized WebP format
- Always provide width/height props to Next.js Image component
- Keep PLACEHOLDER_IMAGE as final fallback
