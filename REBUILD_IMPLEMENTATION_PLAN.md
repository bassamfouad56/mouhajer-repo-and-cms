# CMS Rebuild - Implementation Plan

## Phase 1: Foundation (Starting Now)

### Step 1: Create Unified Content System ✅ IN PROGRESS

#### 1.1 Update Database Schema
**File:** `apps/cms/prisma/schema.prisma`

```prisma
// NEW: Unified Content model (replaces Page, BlogPost, Project, Service)
model Content {
  id              String          @id @default(uuid())

  // Type & Template
  type            ContentType     // PAGE, BLOG, PROJECT, SERVICE, LANDING
  template        String?         // "blank", "blog-standard", "hero-cta", etc.

  // Bilingual Core Fields
  titleEn         String          @map("title_en")
  titleAr         String          @map("title_ar")
  slugEn          String          @unique @map("slug_en")
  slugAr          String          @unique @map("slug_ar")
  descriptionEn   String          @default("") @map("description_en")
  descriptionAr   String          @default("") @map("description_ar")

  // Publishing
  status          ContentStatus   @default(DRAFT)
  featured        Boolean         @default(false)
  publishedAt     DateTime?       @map("published_at")

  // SEO (simplified - inherit from template)
  seoMetaTitleEn  String?         @map("seo_meta_title_en")
  seoMetaTitleAr  String?         @map("seo_meta_title_ar")
  seoMetaDescEn   String?         @map("seo_meta_desc_en")
  seoMetaDescAr   String?         @map("seo_meta_desc_ar")
  seoKeywords     String[]        @map("seo_keywords")

  // Metadata
  createdAt       DateTime        @default(now()) @map("created_at")
  updatedAt       DateTime        @updatedAt @map("updated_at")
  createdBy       String?         @map("created_by")

  // Relations
  sections        ContentSection[]

  @@index([type])
  @@index([status])
  @@index([slugEn])
  @@index([slugAr])
  @@index([featured])
  @@index([publishedAt])
  @@map("contents")
}

// NEW: Unified Section model (replaces PageBlock and BlueprintInstance)
model ContentSection {
  id              String   @id @default(uuid())
  contentId       String   @map("content_id")
  blueprintId     String   @map("blueprint_id")

  // Position
  order           Int      @default(0)

  // Bilingual Data
  dataEn          Json     @map("data_en")
  dataAr          Json     @map("data_ar")

  // Visibility
  visible         Boolean  @default(true)

  // Metadata
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  content         Content  @relation(fields: [contentId], references: [id], onDelete: Cascade)
  blueprint       ContentBlueprint @relation(fields: [blueprintId], references: [id])

  @@index([contentId])
  @@index([blueprintId])
  @@index([order])
  @@map("content_sections")
}

enum ContentType {
  PAGE
  BLOG
  PROJECT
  SERVICE
  LANDING
}

enum ContentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

#### 1.2 Create Content Templates
**File:** `apps/cms/src/lib/content-templates.ts`

```typescript
export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: ContentType;
  icon: string;
  thumbnail?: string;
  defaultSections: TemplateSectionConfig[];
}

export interface TemplateSectionConfig {
  blueprintId: string;
  blueprintName: string;
  order: number;
  defaultData: {
    en: Record<string, any>;
    ar: Record<string, any>;
  };
}

export const CONTENT_TEMPLATES: ContentTemplate[] = [
  // PAGE TEMPLATES
  {
    id: 'page-blank',
    name: 'Blank Page',
    description: 'Start from scratch',
    type: 'PAGE',
    icon: 'FileText',
    defaultSections: [],
  },
  {
    id: 'page-about',
    name: 'About Us Page',
    description: 'Company introduction with team',
    type: 'PAGE',
    icon: 'Users',
    defaultSections: [
      {
        blueprintId: 'hero-simple',
        blueprintName: 'Hero Section',
        order: 0,
        defaultData: {
          en: { title: 'About Us', subtitle: 'Learn more about our company' },
          ar: { title: 'من نحن', subtitle: 'تعرف على شركتنا' },
        },
      },
      {
        blueprintId: 'content-text',
        blueprintName: 'Text Content',
        order: 1,
        defaultData: {
          en: { content: '<p>Company story goes here...</p>' },
          ar: { content: '<p>قصة الشركة هنا...</p>' },
        },
      },
    ],
  },

  // BLOG TEMPLATES
  {
    id: 'blog-standard',
    name: 'Standard Blog Post',
    description: 'Classic blog article layout',
    type: 'BLOG',
    icon: 'BookOpen',
    defaultSections: [
      {
        blueprintId: 'blog-header',
        blueprintName: 'Blog Header',
        order: 0,
        defaultData: {
          en: { showAuthor: true, showDate: true },
          ar: { showAuthor: true, showDate: true },
        },
      },
      {
        blueprintId: 'content-rich-text',
        blueprintName: 'Article Content',
        order: 1,
        defaultData: {
          en: { content: '<p>Write your article here...</p>' },
          ar: { content: '<p>اكتب مقالك هنا...</p>' },
        },
      },
    ],
  },

  // PROJECT TEMPLATES
  {
    id: 'project-showcase',
    name: 'Project Showcase',
    description: 'Portfolio project with gallery',
    type: 'PROJECT',
    icon: 'Briefcase',
    defaultSections: [
      {
        blueprintId: 'project-hero',
        blueprintName: 'Project Hero',
        order: 0,
        defaultData: {
          en: { showCategory: true, showClient: true },
          ar: { showCategory: true, showClient: true },
        },
      },
      {
        blueprintId: 'gallery-masonry',
        blueprintName: 'Image Gallery',
        order: 1,
        defaultData: {
          en: { columns: 3, images: [] },
          ar: { columns: 3, images: [] },
        },
      },
      {
        blueprintId: 'project-details',
        blueprintName: 'Project Details',
        order: 2,
        defaultData: {
          en: { showSpecs: true, showTimeline: true },
          ar: { showSpecs: true, showTimeline: true },
        },
      },
    ],
  },

  // LANDING PAGE TEMPLATES
  {
    id: 'landing-hero-cta',
    name: 'Hero + CTA Landing',
    description: 'Conversion-focused landing page',
    type: 'LANDING',
    icon: 'Zap',
    defaultSections: [
      {
        blueprintId: 'hero-full',
        blueprintName: 'Hero Section',
        order: 0,
        defaultData: {
          en: { title: 'Transform Your Space', cta: 'Get Started' },
          ar: { title: 'حوّل مساحتك', cta: 'ابدأ الآن' },
        },
      },
      {
        blueprintId: 'features-grid',
        blueprintName: 'Features',
        order: 1,
        defaultData: {
          en: { features: [] },
          ar: { features: [] },
        },
      },
      {
        blueprintId: 'cta-centered',
        blueprintName: 'Call to Action',
        order: 2,
        defaultData: {
          en: { title: 'Ready to start?', buttonText: 'Contact Us' },
          ar: { title: 'هل أنت مستعد للبدء؟', buttonText: 'اتصل بنا' },
        },
      },
    ],
  },
];
```

#### 1.3 Create Unified Content UI
**File:** `apps/cms/src/app/content/page.tsx`

New page that replaces Page Builder, Blog, Projects, Services sections.

#### 1.4 Create API Endpoints
**File:** `apps/cms/src/app/api/content/route.ts`

Unified API for all content types with server-side auto-translation.

---

## Phase 2: Migration (After Phase 1)

### Step 2: Data Migration Scripts

#### 2.1 Migrate Pages
```typescript
// Migrate Page + PageBlocks → Content + ContentSections
```

#### 2.2 Migrate Blog Posts
```typescript
// Migrate BlogPost → Content (type: BLOG)
```

#### 2.3 Migrate Projects
```typescript
// Migrate Project → Content (type: PROJECT)
```

#### 2.4 Migrate Services
```typescript
// Migrate Service → Content (type: SERVICE)
```

---

## Phase 3: Cleanup (After Migration)

### Step 3: Remove Old Code

- Remove old Page Builder
- Remove Blog, Projects, Services pages
- Remove old models (after data migration)
- Update all references

---

## Implementation Order (Today)

### ✅ NOW: Building Phase 1

1. ✅ Create implementation plan (this file)
2. ⏳ Create content templates file
3. ⏳ Update Prisma schema (add Content & ContentSection models)
4. ⏳ Create migration
5. ⏳ Build new Content UI page
6. ⏳ Create API endpoint with server-side translation
7. ⏳ Test complete workflow

### Later: Phase 2 & 3
- Data migration
- Remove old code
- Full testing

---

## Success Criteria

### User can:
1. ✅ Click "Content" in sidebar
2. ✅ Click "New Content"
3. ✅ Choose type (Page, Blog, Project, etc.)
4. ✅ Pick template (gets pre-built sections)
5. ✅ Fill ONLY English fields
6. ✅ See visual preview
7. ✅ Publish → Arabic auto-translates server-side
8. ✅ Edit content → modify sections visually

### Developer benefits:
- ✅ Single data model
- ✅ Unified API
- ✅ Less code duplication
- ✅ Easier to maintain
- ✅ Better performance

---

## Files Being Created

1. `/apps/cms/src/lib/content-templates.ts` - Template definitions
2. `/apps/cms/src/app/content/page.tsx` - New unified UI
3. `/apps/cms/src/app/api/content/route.ts` - Unified API
4. `/apps/cms/src/components/ContentEditor.tsx` - Visual editor
5. `/apps/cms/src/components/TemplateSelector.tsx` - Template picker
6. `/apps/cms/prisma/schema.prisma` - Updated schema

---

**Status: Phase 1 - IN PROGRESS**
**Started: 2025-10-25**
**Expected completion: 2-3 hours**
