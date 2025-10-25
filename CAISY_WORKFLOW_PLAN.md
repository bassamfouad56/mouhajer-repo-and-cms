# Caisy.io-Like Dynamic CMS Workflow - Implementation Plan

## Overview
Transform the CMS into a fully dynamic, blueprint-based content management system similar to caisy.io.

## Current State Analysis

### ✅ What You Already Have:
1. **Page Builder** (`/page-builder`) - Basic page creation with SEO
2. **Block Editor** - Dynamic block editing with field types
3. **Media Library** - Full media management
4. **GraphQL API** - Backend data layer
5. **Prisma Schema** - Flexible data models

### ❌ What's Missing for Caisy.io-like Experience:
1. **Unified Content Type System** - All content as "pages"
2. **Blueprint System** - Custom content type definitions
3. **Drag-and-Drop Block Builder** - Visual element composer
4. **Dynamic Routing** - Auto-generated routes for all content types
5. **Centralized Content Hub** - Single location to view all content

---

## New Workflow Architecture

### Phase 1: Unified Content Model

#### 1.1 Page Type System
Instead of separate models (Project, Service, Blog), everything becomes a **Page** with a `type` field:

```typescript
enum PageType {
  NORMAL = 'normal',      // Standard pages
  BLOG = 'blog',          // Blog posts
  PROJECT = 'project',    // Portfolio projects
  SERVICE = 'service',    // Service pages
  CUSTOM = 'custom'       // User-defined types
}
```

#### 1.2 Update Database Schema
```prisma
model Page {
  id             String      @id @default(uuid())
  titleEn        String
  titleAr        String
  slugEn         String      @unique
  slugAr         String      @unique
  descriptionEn  String
  descriptionAr  String

  // NEW: Page Type & Category
  type           String      @default("normal")  // blog, project, service, custom
  category       String?     // Optional categorization
  template       String?     // Optional template override

  // SEO fields (existing)
  seoMetaTitleEn String?
  seoMetaTitleAr String?
  seoMetaDescEn  String?
  seoMetaDescAr  String?
  seoKeywords    String[]

  // Status & Publishing
  status         String      @default("draft")
  featured       Boolean     @default(false)
  publishedAt    DateTime?

  // Relationships
  blocks         PageBlock[]
  parentId       String?
  parent         Page?       @relation("PageChildren", fields: [parentId], references: [id])
  children       Page[]      @relation("PageChildren")

  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
}
```

---

### Phase 2: Enhanced Page Builder

#### 2.1 Page Creation Flow (`/page-builder`)

**New Features:**
1. **Quick Create Modal** - Streamlined page creation
2. **Type Selection** - Choose page type (normal, blog, project, etc.)
3. **Template Gallery** - Pre-configured block layouts
4. **Bulk Actions** - Duplicate, archive, export

**UI Layout:**
```
┌─────────────────────────────────────────────────────────┐
│  Page Builder                            [+ New Page]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Filter: [All Types ▼] [All Status ▼] [Search...]     │
│                                                         │
│  ┌─────────┬─────────┬──────────┬─────────┬──────────┐│
│  │ Type    │ Title   │ Status   │ Updated │ Actions  ││
│  ├─────────┼─────────┼──────────┼─────────┼──────────┤│
│  │ 📄 Blog │ Post 1  │ Published│ 2h ago  │ ⚙️ Edit  ││
│  │ 🎨 Proj │ Villa A │ Draft    │ 1d ago  │ ⚙️ Edit  ││
│  │ 🔧 Serv │ Design  │ Published│ 3d ago  │ ⚙️ Edit  ││
│  └─────────┴─────────┴──────────┴─────────┴──────────┘│
└─────────────────────────────────────────────────────────┘
```

#### 2.2 Page Edit Screen

**Tabs:**
1. **Content** - Add/edit blocks
2. **Settings** - Page type, category, template
3. **SEO** - Meta tags, OG, Twitter cards
4. **Publishing** - Status, scheduling, visibility

---

### Phase 3: Blueprint System (Block Composer)

#### 3.1 Block Blueprint Definition

Create custom block types via UI at `/blocks/blueprints`:

```typescript
interface BlockBlueprint {
  id: string;
  name: string;              // "Hero Banner", "Testimonial Carousel"
  category: string;          // "Hero", "Content", "Gallery", etc.
  icon: string;              // Icon identifier
  description: string;

  // Field Definitions
  fields: FieldDefinition[];

  // Preview Template
  previewTemplate: string;   // React component name

  // Meta
  createdAt: Date;
  isCustom: boolean;         // User-created vs system
}

interface FieldDefinition {
  name: string;              // "title", "backgroundImage"
  label: string;             // "Title"
  type: FieldType;           // "text", "image", "gallery", etc.
  bilingual: boolean;        // Support en/ar
  required: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];

  // UI Hints
  placeholder?: string;
  helpText?: string;
  group?: string;            // Group related fields
}

enum FieldType {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RICH_TEXT = 'rich_text',
  IMAGE = 'image',
  GALLERY = 'gallery',
  VIDEO = 'video',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  COLOR = 'color',
  DATE = 'date',
  RELATION = 'relation',     // Link to other pages
  JSON = 'json'
}
```

#### 3.2 Drag-and-Drop Block Builder

**UI at `/blocks/builder`:**

```
┌──────────────────────────────────────────────────────────┐
│  Create Block Blueprint                    [Save Draft]  │
├──────────────────────────────────────────────────────────┤
│  Block Name: [ Hero Banner with CTA                 ]   │
│  Category:   [ Hero Sections        ▼]                  │
│  Icon:       [ 🎯                    ▼]                  │
│                                                          │
│  ┌────────────────┬──────────────────────────────────┐  │
│  │ Field Elements │  Canvas (Drag fields here)       │  │
│  ├────────────────┤                                  │  │
│  │                │  ┌──────────────────────────┐    │  │
│  │ 📝 Text        │  │  Title (Text, Bilingual) │    │  │
│  │ 📄 Textarea    │  └──────────────────────────┘    │  │
│  │ 🖼️ Image       │                                  │  │
│  │ 🎨 Color       │  ┌──────────────────────────┐    │  │
│  │ 🔢 Number      │  │  Background (Image)      │    │  │
│  │ ☑️ Boolean     │  └──────────────────────────┘    │  │
│  │ 📅 Date        │                                  │  │
│  │ 🔗 Relation    │  ┌──────────────────────────┐    │  │
│  │ 📦 Gallery     │  │  CTA Text (Text)         │    │  │
│  │                │  └──────────────────────────┘    │  │
│  └────────────────┴──────────────────────────────────┘  │
│                                                          │
│  [Preview]  [Save as Template]  [Cancel]  [Create]     │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Drag field types from left panel
- Configure field properties (name, validation, bilingual)
- Organize fields into groups
- Live preview of how the block will appear in editor
- Save as blueprint for reuse

---

### Phase 4: Content Hub (`/projects` renamed to `/content`)

**Unified content view showing ALL pages regardless of type:**

```
┌─────────────────────────────────────────────────────────┐
│  Content Hub                             [+ New Page]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  View: [Grid] [List]  Type: [All ▼]  Status: [All ▼]  │
│                                                         │
│  ┌──────────┬──────────┬──────────┬──────────┐         │
│  │  📄 Blog │  🎨 Proj │  🔧 Serv │  📑 Page │         │
│  │          │          │          │          │         │
│  │  Post    │  Villa   │  Design  │  About   │         │
│  │  Title   │  Dubai   │  Service │  Us      │         │
│  │          │          │          │          │         │
│  │  Draft   │  Publish │  Publish │  Publish │         │
│  │  Edit    │  Edit    │  Edit    │  Edit    │         │
│  └──────────┴──────────┴──────────┴──────────┘         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### Phase 5: Dynamic Routing & Frontend Integration

#### 5.1 Smart Route Handler

The frontend automatically handles all page types:

```typescript
// apps/frontend/app/[locale]/[[...slug]]/page.tsx
export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = params;

  // Fetch page by slug
  const page = await fetchPageBySlug(locale, slug);

  if (!page) notFound();

  // Determine component based on page type
  const PageComponent = getPageComponent(page.type);

  return (
    <PageComponent page={page}>
      <BlockRenderer
        blocks={page.blocks}
        locale={locale}
      />
    </PageComponent>
  );
}

function getPageComponent(type: string) {
  switch(type) {
    case 'blog': return BlogLayout;
    case 'project': return ProjectLayout;
    case 'service': return ServiceLayout;
    default: return DefaultLayout;
  }
}
```

---

## Implementation Checklist

### Week 1: Data Model Updates
- [ ] Update Prisma schema with `type` field
- [ ] Create migration for existing data
- [ ] Update GraphQL schema
- [ ] Update API endpoints

### Week 2: Enhanced Page Builder
- [ ] Add page type selection
- [ ] Improve page listing UI
- [ ] Add filters and search
- [ ] Implement bulk actions

### Week 3: Block Blueprint System
- [ ] Create BlockBlueprint model
- [ ] Build blueprint creation UI
- [ ] Implement drag-and-drop builder
- [ ] Add blueprint library/gallery

### Week 4: Content Hub
- [ ] Rename/redirect `/projects` → `/content`
- [ ] Build unified content view
- [ ] Add type-based filtering
- [ ] Integrate with page builder

### Week 5: Frontend Integration
- [ ] Update dynamic routing
- [ ] Create layout components per type
- [ ] Test all content types
- [ ] Polish and bug fixes

---

## Benefits of This Approach

1. **Flexibility** - Create any content type without code changes
2. **Consistency** - All content managed the same way
3. **Scalability** - Easy to add new content types
4. **Developer-Friendly** - Clean data model, predictable structure
5. **User-Friendly** - Single workflow for all content

---

## Next Steps

1. **Approve this plan** - Confirm the approach
2. **Prioritize phases** - Which to implement first?
3. **Start implementation** - Begin with data model updates

Would you like me to start implementing Phase 1 (Unified Content Model)?
