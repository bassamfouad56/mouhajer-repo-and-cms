# Video Banner with Sanity Image Carousel - Integration Guide

## ✅ What Was Created

I've created an interactive video banner with image carousel that:
- ✅ Uses YouTube video as background (https://www.youtube.com/watch?v=9JeB0zJtPuM)
- ✅ Fetches images from Sanity CMS
- ✅ Shows hovered image in large overlay on the banner
- ✅ Video keeps playing (never pauses)
- ✅ Smooth transitions for image overlay
- ✅ Horizontal scrolling carousel with navigation buttons

## 📁 Files Created

### 1. **Video Banner Component** (Client Component)
**File:** `components/projects/video-banner-with-carousel.tsx`

Features:
- YouTube video background (fullscreen, auto-play, looping, muted)
- Horizontal scrolling image carousel
- Hover effect shows large image overlay (70vh × 80vw)
- Smooth transitions with Framer Motion
- Navigation buttons (left/right arrows)
- Decorative corner accents
- Video continues playing during hover

### 2. **Server Wrapper** (Fetches Sanity Images)
**File:** `components/projects/projects-hero-banner.tsx`

Features:
- Fetches up to 20 project images from Sanity
- Falls back to any Sanity images if no project images exist
- Passes images to client component
- Pre-configured with your YouTube video ID: `9JeB0zJtPuM`

## 🔧 How to Integrate

### Option 1: Replace Entire Hero Section (Recommended)

**File to edit:** `app/[locale]/projects/enhanced-projects-page-content.tsx`

**Step 1:** Add import at the top of the file:
```typescript
import { ProjectsHeroBanner } from '@/components/projects/projects-hero-banner';
```

**Step 2:** Find the hero section (around lines 245-440) and replace it with:
```typescript
return (
  <main className="relative bg-white">
    {/* Video Banner with Carousel */}
    <ProjectsHeroBanner />

    {/* Rest of the content below (search, filters, projects grid) */}
    <section className="relative z-10 bg-white px-6 py-24 lg:px-24">
      {/* Your existing search and filter components */}
      {/* ... */}
    </section>
  </main>
);
```

### Option 2: Add to Main Page (Alternative)

**File to edit:** `app/[locale]/projects/page.tsx`

**Step 1:** Add import:
```typescript
import { ProjectsHeroBanner } from '@/components/projects/projects-hero-banner';
```

**Step 2:** Replace the content:
```typescript
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [projects, industries] = await Promise.all([
    getProjects(locale),
    getIndustries(locale),
  ]);

  return (
    <>
      <Header />
      {/* New Video Banner */}
      <ProjectsHeroBanner />
      {/* Existing Content */}
      <EnhancedProjectsPageContent projects={projects} industries={industries} locale={locale} />
      <LogoMarquee />
      <Footer />
    </>
  );
}
```

## 🎨 Customization Options

### Change Video
Edit `components/projects/projects-hero-banner.tsx`:
```typescript
const videoId = 'YOUR_YOUTUBE_VIDEO_ID'; // Change this
```

### Change Text
```typescript
<ProjectsHeroBanner
  videoId={videoId}
  images={images}
  title="Custom Title"
  subtitle="Custom subtitle text"
/>
```

### Adjust Image Count
In `components/projects/projects-hero-banner.tsx`:
```typescript
// Change [0...20] to fetch more/fewer images
*[_type == "project" && defined(mainImage)] | order(_createdAt desc)[0...30] {
```

### Adjust Carousel Card Size
In `components/projects/video-banner-with-carousel.tsx`, find:
```typescript
<div className="relative h-72 w-80 overflow-hidden ...">
```

Change `h-72 w-80` to your preferred size (e.g., `h-96 w-96` for larger cards).

### Adjust Overlay Size
Find:
```typescript
<motion.div className="relative z-10 h-[70vh] w-[80vw] overflow-hidden ...">
```

Change `h-[70vh] w-[80vw]` to adjust the size of the hovered image overlay.

## 🎭 Features Explained

### 1. **Video Background**
- Embedded YouTube player with iframe API
- Auto-play, loop, muted for best UX
- Responsive scaling to always cover full viewport
- Dark gradient overlays for text readability

### 2. **Image Carousel**
- Horizontal scroll with smooth transitions
- Navigation buttons (left/right arrows)
- Keyboard navigation (arrow keys)
- Hides scrollbar for clean look
- Auto-fetches from Sanity

### 3. **Hover Effect**
- On hover: Large image overlay appears (with smooth transition)
- Backdrop blur for depth
- Image title displays at bottom
- Decorative corner accents
- Video continues playing underneath (no pause/lag)

### 4. **Transitions**
- Image overlay: 0.4s fade in/out
- Image scale: 0.5s ease
- Card hover: 0.5s scale up
- All using Framer Motion for smoothness

## 🔍 How It Works

```
User Flow:
1. Page loads → Video starts auto-playing
2. Carousel appears at bottom with Sanity images
3. User hovers over carousel image
   ↓
4. Large overlay appears on video
5. Overlay shows the hovered image (70% viewport height)
6. Video continues playing underneath
7. User moves mouse away
   ↓
8. Overlay fades out smoothly
9. Back to video background
```

## 🐛 Troubleshooting

### Video not playing
- Check YouTube video is public/embeddable
- Check video ID is correct: `9JeB0zJtPuM`
- Try different browser (some block autoplay)

### No images showing in carousel
- Run: `npx tsx scripts/audit-images.ts`
- Verify Sanity has project images with `mainImage` field
- Check console for fetch errors

### Images not fetching from Sanity
- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`
- Check Sanity API is accessible
- Clear Next.js cache: `rm -rf .next && npm run dev`

### Overlay transition laggy
- Reduce overlay size (change from 70vh/80vw to smaller)
- Check browser performance (disable extensions)
- Reduce number of carousel images

## 📊 Performance

- **Video:** Lazy-loaded from YouTube CDN
- **Images:** Optimized Sanity URLs
- **Animations:** GPU-accelerated via Framer Motion
- **Scroll:** Hardware-accelerated CSS

## 🎯 Next Steps

1. ✅ Files created
2. ⬜ Choose integration option (Option 1 or 2 above)
3. ⬜ Add import statement
4. ⬜ Replace hero section
5. ⬜ Test: `npm run dev`
6. ⬜ Visit: `http://localhost:4050/en/projects`
7. ⬜ Hover over carousel images to see the effect!

## 📝 Example Integration Code

Here's the complete code for Option 1:

```typescript
// app/[locale]/projects/enhanced-projects-page-content.tsx

import { ProjectsHeroBanner } from '@/components/projects/projects-hero-banner'; // ADD THIS

export default function EnhancedProjectsPageContent({ projects, industries, locale }: ProjectsPageContentProps) {
  // ... existing state and logic ...

  return (
    <main className="relative bg-white">
      {/* REPLACE OLD HERO WITH THIS */}
      <ProjectsHeroBanner />

      {/* KEEP ALL YOUR EXISTING CONTENT BELOW */}
      <section className="relative z-10 bg-white px-6 py-24 lg:px-24">
        {/* Search Bar */}
        {/* Filters */}
        {/* Projects Grid */}
        {/* ... all your existing content ... */}
      </section>
    </main>
  );
}
```

---

**Ready to see it in action! Just follow the integration steps above.** 🚀
