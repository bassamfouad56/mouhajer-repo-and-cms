# Guide to Adding Content to Mouhajer CMS

Last Updated: 2025-10-08

## Current CMS Status

 **Services**: 4 services created
 **Projects**: 5 projects created
 **Blog Posts**: 2 blog posts created
 **Pages**: 3 pages (Home, About, Services)
  **Media**: Need more tagged images

---

## Priority Content Needed

### HIGH PRIORITY

#### 1. Media with Tags (for homepage)

**Awards** (tag: `awards`)
- Upload award certificates
- Trophy images
- Recognition badges
- Minimum: 6-8 images

**Clients** (tag: `clients`)
- Client company logos
- Partner logos
- Minimum: 8-10 logos

**Instagram** (tag: `instagram`)
- Recent project photos
- Design inspiration
- Behind-the-scenes
- Minimum: 12-15 images

#### 2. Additional Services (Target: 10 total)

Current: 4 services
Need: 6 more services

**Suggested Services:**
1. Residential Interior Design
2. Commercial Interior Design
3. Turnkey Projects
4. Bespoke Furniture & Joinery
5. Lighting Design
6. Kitchen & Bathroom Design

#### 3. Additional Projects (Target: 15-20 total)

Current: 5 projects
Need: 10-15 more projects

**Mix needed:**
- 60% Residential (villas, penthouses, apartments)
- 40% Commercial (offices, retail, hospitality)

**Each project needs:**
- Bilingual title
- Bilingual description (100-150 words)
- 3-5 high-quality images
- Location
- Category

#### 4. Additional Blog Posts (Target: 10-15 total)

Current: 2 blog posts
Need: 8-13 more blog posts

**Suggested Topics:**
1. How to Choose an Interior Designer in Dubai
2. Villa Design Ideas for Dubai Homes
3. Office Design Trends for UAE Businesses
4. Sustainable Interior Design Practices
5. Choosing the Right Color Palette
6. Maximizing Small Spaces in Dubai Apartments
7. Luxury Bathroom Design Ideas
8. Smart Home Integration in Interior Design

---

## Content Templates

### Service Template

```json
{
  "title": {
    "en": "Service Name",
    "ar": "'3E 'D./E)"
  },
  "description": {
    "en": "Full description 150-250 words...",
    "ar": "'DH5A 'DC'ED..."
  },
  "shortDescription": {
    "en": "Brief one-liner",
    "ar": "371 H'-/ EH,2"
  },
  "features": {
    "en": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    "ar": ["EJ2) 1", "EJ2) 2", "EJ2) 3", "EJ2) 4"]
  },
  "price": "Starting from AED X",
  "duration": "X-Y weeks",
  "featured": true,
  "status": "published"
}
```

### Project Template

```json
{
  "title": {
    "en": "Project Name",
    "ar": "'3E 'DE41H9"
  },
  "description": {
    "en": "Project description 100-150 words...",
    "ar": "H5A 'DE41H9..."
  },
  "images": [
    "/images/projects/project-name-1.jpg",
    "/images/projects/project-name-2.jpg",
    "/images/projects/project-name-3.jpg"
  ],
  "category": "Residential or Commercial",
  "location": "Area, Dubai",
  "featured": true,
  "status": "published"
}
```

### Blog Post Template

```json
{
  "title": {
    "en": "Blog Post Title",
    "ar": "9FH'F 'DEB'D)"
  },
  "slug": {
    "en": "blog-post-title",
    "ar": "9FH'F-'DEB'D)"
  },
  "excerpt": {
    "en": "Brief summary 150-200 characters...",
    "ar": "ED.5 EH,2..."
  },
  "content": {
    "en": "<h2>Section 1</h2><p>Content...</p>",
    "ar": "<h2>'DB3E 1</h2><p>'DE-*HI...</p>"
  },
  "featuredImage": "/images/blog/post-image.jpg",
  "category": "Category Name",
  "tags": ["tag1", "tag2", "tag3"],
  "author": "Author Name",
  "featured": true,
  "status": "published"
}
```

---

## How to Add Content

### Via CMS Admin Panel

1. Navigate to your CMS: `https://your-cms-url/admin`
2. Login with credentials
3. Go to Services/Projects/Blog section
4. Click "Add New"
5. Fill all bilingual fields
6. Upload images
7. Set featured: true for homepage items
8. Save and Publish

### Via API (Bulk Upload)

Access the CMS API routes at:
- POST `/api/services` - Create service
- POST `/api/projects` - Create project
- POST `/api/blog` - Create blog post
- POST `/api/media` - Upload media

---

## Image Requirements

### Project Images
- Size: 1920x1080px minimum
- Format: JPG or PNG
- Quality: High resolution
- 3-5 images per project

### Service Icons
- Size: 512x512px or SVG
- Format: PNG with transparency
- Style: Consistent design

### Blog Featured Images
- Size: 1200x630px
- Format: JPG
- Aspect ratio: 16:9

### Media Library Tags
- awards
- clients
- featured-in
- instagram

---

## Content Writing Guidelines

### Services
- Length: 150-250 words
- Focus: Benefits, process, deliverables
- Tone: Professional, confident
- Include: Features list (4-6 items)

### Projects
- Length: 100-150 words
- Focus: Key features, unique aspects
- Include: Location, category, size
- Highlight: Special features or challenges

### Blog Posts
- Length: 800-1500 words
- Structure: Intro, H2 sections, conclusion
- Include: Actionable tips, examples
- SEO: Natural keyword usage

### Bilingual Content
- English: Professional business English
- Arabic: Modern Standard Arabic
- Both: Clear, concise, value-focused

---

## Next Steps

1.  Upload media files with proper tags (awards, clients, instagram)
2.  Create 6 additional services
3.  Create 10-15 additional projects
4.  Create 8-10 additional blog posts
5.  Test frontend to ensure all components display correctly

---

## Current Homepage Requirements

**What's Working:**
-  Hero banner (from home page blocks)
-  About section (from home page blocks)
-  Services showcase (needs more services)
-  Featured projects (needs more projects)
-  Featured blogs (needs more blog posts)
-  Featured In logos (configured)

**What Needs Content:**
-   Awards section (needs media with `awards` tag)
-   Clients section (needs media with `clients` tag)
-   Instagram section (needs media with `instagram` tag)

---

For questions or assistance, refer to the CMS documentation or contact the development team.
