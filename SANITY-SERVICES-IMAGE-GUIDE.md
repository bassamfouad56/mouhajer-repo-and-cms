# Services Page - Sanity CMS Integration Guide

## 🎉 Sanity is NOW Connected to Your Services Page!

Your services page is now fully integrated with Sanity CMS. Images you upload to Sanity will automatically appear on the frontend.

---

## 📸 How to Add Service Images in Sanity

### Step 1: Access Sanity Studio

1. Open your terminal
2. Navigate to your project directory:
   ```bash
   cd d:\wbsite\mouhajer-new-marketing-website
   ```
3. Start Sanity Studio:
   ```bash
   npx sanity dev
   ```
4. Open your browser to: `http://localhost:3333` (or the URL shown in terminal)

### Step 2: Create or Edit Services

1. In Sanity Studio, click on **"Service"** in the left sidebar
2. Click **"Create new Service"** or select an existing service to edit

### Step 3: Add Service Details

For each service, fill in:

#### **Required Fields:**
- **Title**: Service name (e.g., "Civil Construction", "Interior Architecture")
- **Slug**: Auto-generated from title (e.g., "civil-construction")
- **Order**: Display order (1-6 for the six core pillars)

#### **Image Upload:**
- **Main Image**: Click "Upload" to add your service image
  - Recommended size: **600x450px** or larger (4:3 aspect ratio)
  - Formats: JPG, PNG, WebP
  - Images will be automatically optimized for web

#### **Content Fields:**
- **Excerpt**: Short description (used as service description on cards)
- **Icon Name**: Lucide icon name (e.g., "Building2", "PenTool", "Zap", "Hammer", "Wrench", "ShieldCheck")

#### **Features Array:**
Click "Add item" under Features to add capabilities:
- **Title**: Feature/capability name (e.g., "Structural excavation & earthwork")
- **Description**: Optional detailed description

#### **Optional:**
- **Featured Service**: Toggle to mark as featured
- **Process Steps**: Add step-by-step process information
- **Related Projects**: Link to related project documents

### Step 4: Publish Your Service

1. Review all fields
2. Click **"Publish"** button in the bottom right
3. Your service is now live!

---

## 🎨 Service Card Design

Each service card on the frontend displays:

### With Sanity Image:
```
┌─────────────────────────────┐
│                             │
│    [Service Image 4:3]      │  ← Your uploaded image
│    (with number overlay)     │
│                             │
├─────────────────────────────┤
│  [Icon Badge]               │  ← Icon from icon field
│  THE FOUNDATION              │  ← Subtitle (hardcoded)
│  Civil Construction          │  ← Title from Sanity
│                             │
│  Description from excerpt... │  ← Excerpt from Sanity
│                             │
│  ✓ Capability 1             │  ← Features from Sanity
│  ✓ Capability 2             │
│  ✓ Capability 3             │
│  ✓ Capability 4             │
│                             │
│  [Gold accent line]          │
└─────────────────────────────┘
```

### Without Image (Fallback):
- Shows icon badge and number
- Still displays all content
- No image section

---

## 📋 Recommended Service Setup

Create these 6 services in Sanity (in order):

### 1. Civil Construction
- **Order**: 1
- **Icon**: Building2
- **Image**: Construction site, structural work, foundation
- **Features**:
  - Structural excavation & earthwork
  - Foundation engineering
  - Concrete & steel erection
  - Code compliance & permitting

### 2. Interior Architecture
- **Order**: 2
- **Icon**: PenTool
- **Image**: Architectural drawings, design workspace, sketches
- **Features**:
  - Concept development & mood boards
  - Space planning & flow optimization
  - Material selection & specification
  - 3D visualization & walkthroughs

### 3. MEP Engineering
- **Order**: 3
- **Icon**: Zap
- **Image**: Electrical systems, HVAC equipment, technical drawings
- **Features**:
  - HVAC & climate control systems
  - Electrical design & power distribution
  - Plumbing & water management
  - Fire safety & compliance

### 4. Manufacturing & Joinery
- **Order**: 4
- **Icon**: Hammer
- **Image**: Workshop, custom furniture, joinery craftsmanship
- **Features**:
  - Custom millwork & cabinetry
  - Bespoke furniture design
  - Premium material sourcing
  - Quality control at every stage

### 5. Fit-Out Execution
- **Order**: 5
- **Icon**: Wrench
- **Image**: Installation work, finishing touches, detail work
- **Features**:
  - Flooring & wall finishes
  - Lighting & fixture installation
  - Furniture placement & styling
  - Final detailing & touch-ups

### 6. Handover & Maintenance
- **Order**: 6
- **Icon**: ShieldCheck
- **Image**: Final inspection, handover ceremony, maintenance
- **Features**:
  - Final inspections & snagging
  - Warranty management
  - Post-completion support
  - Optional maintenance contracts

---

## 🔄 How the Integration Works

### Data Flow:
```
Sanity CMS → GROQ Query → Next.js Server → Services Page → Service Cards with Images
```

### Files Involved:

1. **`app/[locale]/services/page.tsx`**
   - Fetches services from Sanity
   - Passes data to ServicesPageContent

2. **`app/[locale]/services/services-page-content.tsx`**
   - Receives service data
   - Merges with default content
   - Renders service cards with images

3. **`sanity/lib/queries.ts`**
   - Contains `servicesQuery` for fetching services
   - Includes i18n support

4. **`sanity/lib/image.ts`**
   - Provides `urlForImage()` helper
   - Handles image optimization and formatting

5. **`sanity/schemas/service.ts`**
   - Defines service document structure
   - Includes mainImage field

---

## 🖼️ Image Optimization

Images are automatically:
- ✅ **Resized** to optimal dimensions (600x450px for cards)
- ✅ **Formatted** to modern formats (WebP, AVIF)
- ✅ **Compressed** for fast loading
- ✅ **Responsive** with proper `sizes` attribute
- ✅ **Lazy loaded** for performance

### CDN Benefits:
- Served from Sanity's global CDN
- Cached for fast delivery
- Automatic format negotiation
- On-the-fly image transformations

---

## 🌐 Internationalization (i18n)

The services query supports multiple languages:
- English (en)
- Arabic (ar)

To add translations:
1. Install Sanity Document Internationalization plugin
2. Create language-specific versions
3. Frontend automatically fetches correct locale

---

## 🔧 Testing Your Images

After uploading images in Sanity:

1. **Save and Publish** in Sanity Studio
2. **Refresh** your frontend at `http://localhost:3000/services`
3. **Wait** ~1 minute for cache to update (or use ISR revalidation)
4. **Check** that images appear in service cards

### Troubleshooting:

**Images not showing?**
- ✓ Check image is published (not draft)
- ✓ Verify order field is set (1-6)
- ✓ Confirm image uploaded successfully
- ✓ Check browser console for errors
- ✓ Clear Next.js cache: `npm run dev` (restart)

**Image quality issues?**
- Upload higher resolution images (min 600x450px)
- Use JPG for photos, PNG for graphics
- Sanity will handle optimization

---

## 📊 Current Implementation

### ✅ What's Working:
- [x] Sanity CMS connected to services page
- [x] Service cards display Sanity images
- [x] Image optimization via Sanity CDN
- [x] Responsive images with proper sizing
- [x] Fallback design when no image available
- [x] Hover effects and animations
- [x] Gold accent branding maintained

### 🎯 What You Can Customize:
- Service titles and descriptions
- Service images
- Features/capabilities lists
- Display order
- Icons (via icon field)

### 🔒 What Stays Hardcoded:
- Subtitles ("The Foundation", "The Soul", etc.)
- Section layouts and structure
- Animation timings
- Color scheme (#d4af37 gold)
- Font styles (SchnyderS, Satoshi)

---

## 🚀 Next Steps

1. **Upload all 6 service images** in Sanity Studio
2. **Add features** for each service
3. **Publish** all services
4. **Test** on frontend
5. **Deploy** to production when ready

Your services page will now dynamically display whatever images and content you add to Sanity! 🎉

---

## 📞 Need Help?

If you encounter issues:
1. Check Sanity Studio console for errors
2. Verify all services are published
3. Ensure `order` field is set correctly (1-6)
4. Restart development server
5. Clear browser cache

**Your services page is now fully dynamic and content-driven!**
