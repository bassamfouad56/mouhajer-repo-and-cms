# How to Use Optimized Images

## Quick Start Guide

Your images have been optimized and are ready to use! Here's how to implement them in your project.

## 📁 File Locations

```
public/images/
├── optimized/          ← USE THESE (70 MB)
│   ├── banner2.webp
│   ├── banner2.jpg
│   ├── _MID0003-HDR.webp
│   ├── _MID0003-HDR.jpg
│   └── ...
├── originals/          ← BACKUP (1.3 GB)
└── [original files]    ← CAN BE REMOVED (1.3 GB)
```

## 🔄 Update Your Code

### Method 1: Next.js Image Component (Recommended)

Next.js automatically optimizes images, but starting with optimized sources is better.

**Before**:
```tsx
import Image from 'next/image';

<Image
  src="/images/banner2.png"  // 7.31 MB ❌
  alt="Banner"
  width={1920}
  height={1080}
/>
```

**After**:
```tsx
import Image from 'next/image';

<Image
  src="/images/optimized/banner2.webp"  // 280 KB ✅
  alt="Banner"
  width={1920}
  height={1080}
/>
```

### Method 2: Picture Element (Best Browser Support)

For maximum compatibility across all browsers:

```tsx
<picture>
  <source
    srcSet="/images/optimized/banner2.webp"
    type="image/webp"
  />
  <source
    srcSet="/images/optimized/banner2.jpg"
    type="image/jpeg"
  />
  <img
    src="/images/optimized/banner2.jpg"
    alt="Banner"
    loading="lazy"
  />
</picture>
```

### Method 3: Update Static Imports

**Before**:
```tsx
import BannerImage from "../public/images/banner2.png";

<img src={BannerImage.src} alt="Banner" />
```

**After**:
```tsx
import BannerImage from "../public/images/optimized/banner2.webp";

<img src={BannerImage.src} alt="Banner" />
```

## 🔍 Find Images to Update

### Step 1: Find all image imports
```bash
grep -r "public/images" app/ components/ --include="*.tsx" --include="*.ts" | grep -v "optimized"
```

### Step 2: Find specific large images
```bash
# Check for specific large images
grep -r "_MID.*HDR" app/ components/
grep -r "Enscape_" app/ components/
grep -r "banner2" app/ components/
```

## 📝 Example Updates

### Example 1: Hero Banner

**File**: `components/HeroBanner.tsx`

**Before**:
```tsx
import BannerImg from "../public/images/newbanner.jpg"; // 19.29 MB
```

**After**:
```tsx
import BannerImg from "../public/images/optimized/newbanner.webp"; // 600 KB
```

### Example 2: Project Gallery

**File**: `components/ProjectGallery.tsx`

**Before**:
```tsx
const images = [
  "/images/_MID6228-HDR.jpg",  // 35.64 MB
  "/images/_MID6238-HDR.jpg",  // 35.56 MB
];
```

**After**:
```tsx
const images = [
  "/images/optimized/_MID6228-HDR.webp",  // 610 KB
  "/images/optimized/_MID6238-HDR.webp",  // 600 KB
];
```

### Example 3: Background Image (CSS)

**Before**:
```css
.hero {
  background-image: url('/images/banner2.png'); /* 7.31 MB */
}
```

**After**:
```css
.hero {
  background-image: url('/images/optimized/banner2.webp'); /* 280 KB */
}
```

## 🎯 Priority Files to Update

Based on the analysis, these files need updating:

1. **app/[locale]/blogs/[slug]/page.tsx**
   - Change: `public/images/2024/03/333333.jpg`

2. **components/AboutFounder.tsx**
   - Change: `public/images/2024/03/333333.jpg`

3. **components/AboutHistory.tsx**
   - Change: 9 imports of `public/images/2024/03/333333.jpg`

4. **components/AboutPageGAllery.tsx**
   - Change: `public/images/2024/03/333333.jpg`

5. **components/AboutSectionHomePageCarousel.tsx**
   - Change: 3 imports of `public/images/2024/03/333333.jpg`

## 🚀 Testing

After updating, verify images load correctly:

### 1. Visual Check
```bash
npm run dev
```
Visit pages and check images display properly

### 2. Check Network Tab
- Open DevTools → Network
- Filter by "Img"
- Verify optimized images are loading
- Check file sizes are small (KB, not MB)

### 3. Run Lighthouse
```bash
npm run build
npm run start
```
- Open Chrome DevTools
- Run Lighthouse audit
- Check Performance score improvement

## 📊 Expected Results

### Before Optimization
- Image file size: 15-35 MB per image
- Page load time: 5-10 seconds on slow connections
- Lighthouse Performance: 50-70

### After Optimization
- Image file size: 0.2-0.6 MB per image
- Page load time: 1-2 seconds on slow connections
- Lighthouse Performance: 85-95+

## 🗑️ Cleanup (Optional)

After verifying optimized images work:

### Option 1: Remove Original Large Files
```bash
# Keep backups in originals/, remove from root
rm public/images/_MID*.jpg
rm public/images/Enscape_*.jpg
rm public/images/banner2.png
# etc.
```

### Option 2: Add to .gitignore
```
# .gitignore
public/images/originals/
```

### Option 3: Move to External Storage
- Upload originals to cloud storage
- Remove from repo
- Keep originals/ as backup

## 🎨 Image Naming Convention

All optimized images maintain original names:

| Original | WebP | JPG |
|----------|------|-----|
| banner2.png | banner2.webp | banner2.jpg |
| _MID0003-HDR.jpg | _MID0003-HDR.webp | _MID0003-HDR.jpg |
| Enscape_2024-03-13-14-56-49.jpg | Enscape_2024-03-13-14-56-49.webp | Enscape_2024-03-13-14-56-49.jpg |

## 💡 Pro Tips

1. **Always use WebP first** - Better compression, supported by 95%+ browsers
2. **Keep JPG fallback** - For older browsers (IE11, old Safari)
3. **Use lazy loading** - Add `loading="lazy"` to images below fold
4. **Responsive images** - Use `srcset` for different screen sizes
5. **Alt text** - Always include descriptive alt text for accessibility

## 🔗 Useful Commands

```bash
# Find all image references
grep -r "public/images" . --include="*.tsx" --include="*.css"

# Count optimized vs original usage
grep -r "/images/optimized/" . | wc -l
grep -r "public/images" . --include="*.tsx" | grep -v "optimized" | wc -l

# Check optimized folder size
du -sh public/images/optimized

# List all WebP files
ls public/images/optimized/*.webp
```

## ✅ Checklist

- [ ] Update image imports in components
- [ ] Update CSS background images
- [ ] Update dynamic image paths
- [ ] Test all pages visually
- [ ] Check network tab for correct file sizes
- [ ] Run Lighthouse audit
- [ ] Verify mobile performance
- [ ] Update CMS to use optimized images
- [ ] Remove or archive original large files
- [ ] Document image usage for team

## 🆘 Troubleshooting

### Images not loading?
- Check path: `/images/optimized/` not `public/images/optimized/`
- Verify file exists: `ls public/images/optimized/filename.webp`

### Images still large?
- Clear browser cache
- Check you're using `/optimized/` path
- Verify in Network tab

### WebP not supported?
- Provide JPG fallback using `<picture>` element
- Or use Next.js Image component (handles automatically)

## 📚 Additional Resources

- [Next.js Image Optimization Docs](https://nextjs.org/docs/app/api-reference/components/image)
- [WebP Browser Support](https://caniuse.com/webp)
- [IMAGE_OPTIMIZATION_SUMMARY.md](IMAGE_OPTIMIZATION_SUMMARY.md) - Full optimization report
- [optimize-images.js](optimize-images.js) - Rerun optimization if needed

---

**Need to optimize more images?**
```bash
node optimize-images.js
```

The script will automatically:
- Find images >2MB
- Optimize to WebP + JPG
- Back up originals
- Generate report
