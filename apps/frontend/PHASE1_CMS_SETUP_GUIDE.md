# Phase 1 - CMS Content Setup Guide

**Date:** October 9, 2025
**Status:** ✅ Components Refactored & Pages Integrated
**Next Step:** Add content to CMS

---

## Overview

This guide provides the exact data structures needed in the CMS to support the 8 refactored "Quick Win" components. All components are now ready to receive CMS data - you just need to create the content blocks in the CMS admin panel.

---

## 1. BenifitsSwiper Component

**Used on:** Careers page (`/careers`)
**CMS Block Type:** `benefits_swiper`
**Component File:** `components/BenifitsSwiper.tsx`

### Data Structure

```typescript
{
  type: "benefits_swiper",
  data: {
    title?: string,  // Optional - defaults to "our benifits"
    benefits: [
      {
        id: string,
        title: string,
        bigImage: string,        // URL to large image
        smallImage?: string,     // URL to thumbnail (optional)
        description: string[]    // Array of description paragraphs
      }
    ]
  }
}
```

### Example Content

```json
{
  "type": "benefits_swiper",
  "data": {
    "title": "Why Work With Us",
    "benefits": [
      {
        "id": "1",
        "title": "Professional Growth",
        "bigImage": "https://cms.mouhajer.com/uploads/benefit-growth.jpg",
        "smallImage": "https://cms.mouhajer.com/uploads/benefit-growth-thumb.jpg",
        "description": [
          "Work with experienced engineers with 20+ years in the field",
          "Continuous learning and skill development opportunities",
          "Collaborative environment focused on knowledge sharing"
        ]
      },
      {
        "id": "2",
        "title": "Creative Freedom",
        "bigImage": "https://cms.mouhajer.com/uploads/benefit-creative.jpg",
        "description": [
          "Unleash your unlimited imagination",
          "Environment that appreciates thinking outside the box",
          "Work on iconic, award-winning projects"
        ]
      }
    ]
  }
}
```

### How to Add in CMS

1. Go to Pages → Edit "Careers" page
2. Add new block → Select "Benefits Swiper"
3. Set title (or leave empty for default)
4. Add benefit items with images and descriptions
5. Save and publish

---

## 2. AccordionSwiper Component

**Used on:** Project detail pages (`/our-projects/[slug]`)
**CMS Block Type:** `accordion_swiper`
**Component File:** `components/AccordionSwiper.tsx`

### Data Structure

```typescript
{
  type: "accordion_swiper",
  data: {
    items: [
      {
        title: string,
        subtitle: string,
        description: string
      }
    ],
    backgroundImage?: string,    // Optional background
    sectionTitle?: string        // Optional section heading
  }
}
```

### Example Content

```json
{
  "type": "accordion_swiper",
  "data": {
    "sectionTitle": "Services Provided",
    "backgroundImage": "https://cms.mouhajer.com/uploads/services-bg.jpg",
    "items": [
      {
        "title": "Interior Design",
        "subtitle": "Concept to Completion",
        "description": "Full interior design services including space planning, furniture selection, and custom millwork design"
      },
      {
        "title": "Project Management",
        "subtitle": "End-to-End Coordination",
        "description": "Complete project oversight from initial consultation through final installation and handover"
      },
      {
        "title": "FF&E Procurement",
        "subtitle": "Furniture & Fixtures",
        "description": "Sourcing and procurement of all furniture, fixtures, and equipment from global suppliers"
      }
    ]
  }
}
```

### How to Add in CMS

1. In Project Prisma schema, add to `acf` JSON field:
   - `services_provided` array
   - `accordion_background_image` string
   - `services_section_title` string
2. Or add to project page blocks

---

## 3. PressArticles Component

**Used on:** Who We Are page (`/who-we-are`)
**CMS Block Type:** `press_articles`
**Component File:** `components/PressArticles.tsx`

### Data Structure

```typescript
{
  type: "press_articles",
  data: {
    title?: string,  // Optional - defaults to "PRESS ARTICLES ABOUT US"
    articles: [
      {
        id: string,
        publication: string,     // Publication name
        logo: string,           // URL to publication logo
        link?: string,          // Optional link to article
        alt?: string           // Alt text for logo
      }
    ]
  }
}
```

### Example Content

```json
{
  "type": "press_articles",
  "data": {
    "title": "Featured In",
    "articles": [
      {
        "id": "1",
        "publication": "Bloomberg",
        "logo": "https://cms.mouhajer.com/uploads/bloomberg-logo.png",
        "link": "https://bloomberg.com/article/mouhajer-design",
        "alt": "Bloomberg Logo"
      },
      {
        "id": "2",
        "publication": "Harper's Bazaar",
        "logo": "https://cms.mouhajer.com/uploads/bazaar-logo.png",
        "link": "https://harpersbazaar.com/mouhajer-feature",
        "alt": "Harper's Bazaar Logo"
      }
    ]
  }
}
```

### How to Add in CMS

1. Go to Pages → Edit "Who We Are" page
2. Add new block → Select "Press Articles"
3. Set title (optional)
4. Add article entries with logos and links
5. Save and publish

---

## 4. AnimatedHeadLine Component

**Used on:** Multiple pages
**CMS Block Type:** `animated_headline`
**Component File:** `components/AnimatedHeadLine.tsx`

### Data Structure

```typescript
{
  type: "animated_headline",
  data: {
    text: string,
    blackened?: boolean,  // true = dark text, false = light text
    light?: boolean      // Controls size (smaller if true)
  }
}
```

### Example Content

```json
{
  "type": "animated_headline",
  "data": {
    "text": "EXCELLENCE IN DESIGN",
    "blackened": true,
    "light": false
  }
}
```

---

## 5. Gallery Components (3 variants)

### 5a. ProjectGallery

**Used on:** Project pages (mobile view)
**Component File:** `components/ProjectGallery.tsx`

### 5b. AboutPageGAllery

**Used on:** About pages, Careers page
**Component File:** `components/AboutPageGAllery.tsx`

### 5c. ServicesTwoImageGallery

**Used on:** Service detail pages
**Component File:** `components/ServicesTwoImageGallery.tsx`

### Shared Data Structure

**CMS Block Type:** `gallery_section`

```typescript
// For ProjectGallery (array of images with metadata)
{
  type: "gallery_section",
  data: {
    images: [
      {
        id: string | number,
        title: string,
        location: string,
        projectType?: string,
        url: string,
        link?: string,
        alt?: string
      }
    ]
  }
}

// For AboutPageGAllery (exactly 3 images)
{
  type: "gallery_section",
  data: {
    images: [
      { id: "1", url: string, alt?: string },
      { id: "2", url: string, alt?: string },
      { id: "3", url: string, alt?: string }
    ]
  }
}

// For ServicesTwoImageGallery (2 specific images)
{
  type: "gallery_section",
  data: {
    bigImage: string,
    smallImage: string,
    bigImageAlt?: string,
    smallImageAlt?: string
  }
}
```

### Example Content - ProjectGallery

```json
{
  "type": "gallery_section",
  "data": {
    "images": [
      {
        "id": "1",
        "title": "The Restaurant Hotel Address Marina",
        "location": "Dubai",
        "projectType": "interior design, fitout",
        "url": "https://cms.mouhajer.com/uploads/address-marina.jpg",
        "alt": "Address Marina Restaurant Interior"
      },
      {
        "id": "2",
        "title": "Radisson Blu Terraza Restaurant",
        "location": "Abu Dhabi",
        "projectType": "interior design",
        "url": "https://cms.mouhajer.com/uploads/radisson-terraza.jpg",
        "alt": "Radisson Blu Restaurant Design"
      }
    ]
  }
}
```

### Example Content - AboutPageGAllery

```json
{
  "type": "gallery_section",
  "data": {
    "images": [
      {
        "id": "1",
        "url": "https://cms.mouhajer.com/uploads/about-image-1.jpg",
        "alt": "Mouhajer Design Studio"
      },
      {
        "id": "2",
        "url": "https://cms.mouhajer.com/uploads/about-image-2.jpg",
        "alt": "Award-Winning Projects"
      },
      {
        "id": "3",
        "url": "https://cms.mouhajer.com/uploads/about-image-3.jpg",
        "alt": "Design Excellence"
      }
    ]
  }
}
```

### Example Content - ServicesTwoImageGallery

```json
{
  "type": "gallery_section",
  "data": {
    "bigImage": "https://cms.mouhajer.com/uploads/service-main.jpg",
    "smallImage": "https://cms.mouhajer.com/uploads/service-detail.jpg",
    "bigImageAlt": "Interior Design Service",
    "smallImageAlt": "Design Detail Close-up"
  }
}
```

---

## 6. OurServicesSwiper Component

**Used on:** Service detail pages
**CMS Block Type:** `services_section`
**Component File:** `components/OurServicesSwiper.tsx`

### Data Structure

```typescript
{
  type: "services_section",
  data: {
    title?: string,  // Optional - defaults to "Services"
    services: [
      {
        id?: string | number,
        banner: string,        // Background image URL
        title: string,
        description: string
      }
    ]
  }
}
```

### Example Content

```json
{
  "type": "services_section",
  "data": {
    "title": "Our Services",
    "services": [
      {
        "id": "1",
        "banner": "https://cms.mouhajer.com/uploads/residential-banner.jpg",
        "title": "Residential Design",
        "description": "Luxury villa and apartment interior design with bespoke furniture and finishes"
      },
      {
        "id": "2",
        "banner": "https://cms.mouhajer.com/uploads/commercial-banner.jpg",
        "title": "Commercial Design",
        "description": "Restaurant, hotel, and retail interior design creating memorable brand experiences"
      },
      {
        "id": "3",
        "banner": "https://cms.mouhajer.com/uploads/contracting-banner.jpg",
        "title": "Design & Build",
        "description": "Complete turnkey solutions from concept through construction and installation"
      }
    ]
  }
}
```

### How to Add in CMS

1. In Service entity, ensure `services_array` field exists in `acf` JSON
2. Or add to service detail page blocks
3. Array should contain service objects with banner, title, description

---

## Quick Setup Checklist

### Pages to Configure

- [ ] **Careers Page** (`/careers`)
  - [ ] Add `benefits_swiper` block with 3-5 benefits
  - [ ] Add `gallery_section` block with 3 images for AboutPageGAllery

- [ ] **Who We Are Page** (`/who-we-are`)
  - [ ] Add `gallery_section` block with 3 images
  - [ ] Add `press_articles` block with 6-12 publication logos

- [ ] **Service Detail Pages** (`/services/[slug]`)
  - [ ] Add gallery images to service ACF data
  - [ ] Add services array to ACF data

- [ ] **Project Detail Pages** (`/our-projects/[slug]`)
  - [ ] Add `services_provided` array to project ACF
  - [ ] Add `accordion_background_image` to project ACF
  - [ ] Add `services_section_title` to project ACF

---

## Testing Each Component

### 1. Test BenifitsSwiper
```bash
# Visit careers page
http://localhost:3000/en/careers
# Should show benefits carousel with CMS images and text
```

### 2. Test AccordionSwiper
```bash
# Visit any project detail page
http://localhost:3000/en/our-projects/[any-slug]
# Scroll to services section - should show accordion with project services
```

### 3. Test PressArticles
```bash
# Visit who we are page
http://localhost:3000/en/who-we-are
# Should show press logos with clickable links
```

### 4. Test Gallery Components
```bash
# AboutPageGAllery - visit careers or who we are
http://localhost:3000/en/careers
# Should show 3-image gallery layout

# ServicesTwoImageGallery - visit service detail
http://localhost:3000/en/services/[any-service-slug]
# Should show 2-image parallax gallery
```

### 5. Test OurServicesSwiper
```bash
# Visit service detail page
http://localhost:3000/en/services/[any-service-slug]
# Should show services carousel
```

---

## Fallback Behavior

All components have been designed with graceful fallbacks:

- **No data provided:** Component renders empty array, doesn't crash
- **Missing optional fields:** Uses sensible defaults
- **Invalid data:** Component validates and skips invalid entries

This means pages will work even without CMS data, but will show empty sections.

---

## Next Steps After Setup

1. **Populate CMS with real content** using this guide
2. **Test each page** to verify data is displaying correctly
3. **Check bilingual support** - test both `/en/` and `/ar/` routes
4. **Verify images load** from CMS media library
5. **Move to Phase 2** - Add remaining missing block types

---

## Need Help?

- Check component files for TypeScript interfaces showing exact data structure
- Review `COMPONENT_CMS_CONNECTION_AUDIT.md` for component status
- See `PHASE1_IMPLEMENTATION_COMPLETE.md` for detailed code patterns
- Test API endpoints directly: `https://mouhajer-cms.vercel.app/api/pages`

---

**Total Components Ready:** 8/8
**Total Pages Integrated:** 4/4
**CMS Coverage:** Ready to increase from 15% → 30%+ with content addition
