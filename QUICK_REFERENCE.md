# Quick Reference: Caisy.io-Style CMS Implementation

## 📁 Key Documents

| Document | Purpose | Lines |
|----------|---------|-------|
| **[PHASE_1_COMPLETE_SUMMARY.md](PHASE_1_COMPLETE_SUMMARY.md)** | Progress tracker, what's done, next steps | 400+ |
| **[CAISY_IO_COMPLETE_IMPLEMENTATION.md](CAISY_IO_COMPLETE_IMPLEMENTATION.md)** | Full 6-phase implementation plan | 600+ |
| **[CAISY_ARCHITECTURE_ALIGNMENT.md](CAISY_ARCHITECTURE_ALIGNMENT.md)** | Caisy.io architecture patterns & code | 500+ |

---

## ✅ Phase 1: COMPLETE

### What We Did

1. **Updated Database Schema**
   - Added `type`, `category`, `template`, `publishedAt` to Page model
   - [apps/cms/prisma/schema.prisma](apps/cms/prisma/schema.prisma) lines 147-151

2. **Updated GraphQL Schema**
   - Added `PageType` enum and new fields
   - [apps/cms/src/graphql/schema/pages.ts](apps/cms/src/graphql/schema/pages.ts) lines 4-11, 29-33

3. **Created Documentation**
   - 3 comprehensive implementation guides
   - Total: 1500+ lines of technical specifications

4. **Researched Caisy.io**
   - Analyzed their Next.js blog template
   - Studied blueprint architecture
   - Learned GraphQL auto-generation patterns

### Page Types Now Supported

```typescript
type: 'normal'   // Standard pages (About, Contact)
type: 'blog'     // Blog posts with article schema
type: 'project'  // Portfolio case studies
type: 'service'  // Service detail pages
type: 'custom'   // User-defined via blueprints
```

---

## 🔄 Next: Phase 2 (Blueprint System)

### Quick Start

1. **Run Migration** (when DB is available):
   ```bash
   cd apps/cms
   npx prisma migrate dev --name add_unified_content_model
   npx prisma generate
   ```

2. **Add Blueprint Models**:
   - Copy schema from [CAISY_ARCHITECTURE_ALIGNMENT.md](CAISY_ARCHITECTURE_ALIGNMENT.md#updated-database-schema)
   - Models: `ContentBlueprint` and `BlueprintInstance`

3. **Create System Blueprints**:
   ```bash
   npm run seed:blueprints
   ```

4. **Build Blueprint Builder UI**:
   - Location: `apps/cms/src/app/blueprints/page.tsx`
   - See design in [CAISY_IO_COMPLETE_IMPLEMENTATION.md](CAISY_IO_COMPLETE_IMPLEMENTATION.md#blueprint-builder-ui)

---

## 🏗️ Architecture Overview

### Caisy.io Pattern We're Implementing

```
┌─────────────────────────────────────────────────────────┐
│                    Content Blueprint                     │
│  (Schema Definition - "What fields exist?")             │
│                                                          │
│  name: "BlogPost"                                        │
│  fields: [                                               │
│    { name: "title", type: "text", bilingual: true }     │
│    { name: "content", type: "rich_text" }               │
│    { name: "author", type: "reference" }                │
│  ]                                                       │
└─────────────────────────────────────────────────────────┘
                            │
                            │ Creates instances
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Blueprint Instance                       │
│  (Actual Content - "The data itself")                   │
│                                                          │
│  dataEn: {                                               │
│    title: "Best Interior Design Trends 2025"            │
│    content: {...rich text JSON...}                      │
│    author: "author-id-123"                               │
│  }                                                       │
│  dataAr: {                                               │
│    title: "أفضل اتجاهات التصميم الداخلي 2025"          │
│    content: {...rich text JSON...}                      │
│    author: "author-id-123"                               │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
```

### Document vs Component

**Documents:**
- Top-level queryable content
- Examples: Blog Post, Project, Page, Navigation
- Can exist independently
- Have their own URL/route

**Components:**
- Reusable content blocks
- Examples: Hero Banner, Gallery, Testimonials, CTA
- Must attach to a Document (page)
- Don't have independent routes

### GraphQL Auto-Generation

```typescript
// Blueprint created in UI:
{
  name: "BlogPost",
  fields: [
    { name: "title", type: "text" },
    { name: "content", type: "rich_text" }
  ]
}

// Automatically generates:
type BlogPost {
  id: ID!
  title: String!
  content: String!
  publishedAt: DateTime
}

query {
  allBlogPost(limit: 10, locale: EN): [BlogPost!]!
  blogPost(id: ID!): BlogPost
}

mutation {
  createBlogPost(input: CreateBlogPostInput!): BlogPost!
  updateBlogPost(id: ID!, input: UpdateBlogPostInput!): BlogPost!
}
```

---

## 📊 Field Types Available

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single line text | Title, Name, URL |
| `textarea` | Multi-line text | Description, Excerpt |
| `rich_text` | WYSIWYG editor | Blog content |
| `markdown` | Markdown editor | Technical docs |
| `image` | Single image | Featured image |
| `gallery` | Multiple images | Project photos |
| `video` | Video URL/embed | YouTube link |
| `file` | File upload | PDF download |
| `number` | Numeric input | Price, Quantity |
| `boolean` | Toggle switch | Featured? Published? |
| `date` | Date picker | Event date |
| `datetime` | Date + time | Published at |
| `select` | Dropdown | Category, Status |
| `radio` | Radio buttons | Alignment, Style |
| `checkbox` | Multiple selection | Tags, Features |
| `color` | Color picker | Brand color |
| `reference` | Link to content | Author, Related post |
| `relation` | Multiple links | Tags, Categories |
| `repeater` | Nested fields | FAQ items, Team |
| `group` | Field grouping | CTA (text + link) |
| `location` | Map picker | Address, Coords |
| `json` | Raw JSON | Custom data |

---

## 🎯 Example Blueprints

### Hero Banner (Component)

```json
{
  "name": "HeroBanner",
  "displayName": "Hero Banner",
  "blueprintType": "COMPONENT",
  "category": "layout",
  "fields": [
    {
      "name": "heading",
      "type": "text",
      "bilingual": true,
      "required": true,
      "maxLength": 60
    },
    {
      "name": "backgroundImage",
      "type": "image",
      "required": true
    },
    {
      "name": "ctaButton",
      "type": "group",
      "fields": [
        { "name": "text", "type": "text", "bilingual": true },
        { "name": "link", "type": "text" },
        { "name": "style", "type": "select", "options": ["primary", "secondary"] }
      ]
    }
  ]
}
```

### Blog Post (Document)

```json
{
  "name": "BlogPost",
  "displayName": "Blog Post",
  "blueprintType": "DOCUMENT",
  "allowMultiple": true,
  "fields": [
    { "name": "title", "type": "text", "bilingual": true, "required": true },
    { "name": "slug", "type": "text", "bilingual": true, "required": true },
    { "name": "excerpt", "type": "textarea", "bilingual": true },
    { "name": "featuredImage", "type": "reference", "referenceType": "Asset" },
    {
      "name": "content",
      "type": "repeater",
      "allowedComponents": ["RichText", "ImageGallery", "VideoEmbed", "Quote"]
    },
    { "name": "author", "type": "reference", "referenceType": "Author" },
    { "name": "tags", "type": "relation", "referenceType": "Tag" },
    { "name": "publishedDate", "type": "datetime", "required": true }
  ]
}
```

---

## 🔧 Development Workflow

### Creating New Content Type (Old Way ❌)

```typescript
// 1. Update Prisma schema
model NewContentType {
  id: String
  title: String
  // ...
}

// 2. Create migration
npx prisma migrate dev

// 3. Update GraphQL schema
type NewContentType { ... }

// 4. Create resolvers
export const newContentTypeResolvers = { ... }

// 5. Create API routes
POST /api/new-content-type

// 6. Build UI form
<NewContentTypeForm />

// Total time: 4-6 hours
```

### Creating New Content Type (New Way ✅)

```typescript
// 1. Go to /blueprints
// 2. Click "+ New Blueprint"
// 3. Drag fields from palette
// 4. Click "Save"
// 5. GraphQL auto-generated
// 6. UI form auto-generated

// Total time: 5 minutes
```

---

## 📱 Frontend Integration

### Fetching Content (Caisy Pattern)

```typescript
// lib/cms-client.ts
import { GraphQLClient } from 'graphql-request';

const client = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`,
  {
    headers: {
      'x-caisy-apikey': process.env.CAISY_API_KEY,
    },
  }
);

export async function getAllBlogPosts(locale: 'en' | 'ar' = 'en') {
  const query = `
    query allBlogPost($locale: Locale!) {
      allBlogPost(locale: $locale, limit: 100) {
        id
        title
        slug
        excerpt
        featuredImage { url, alt }
        publishedDate
      }
    }
  `;

  return client.request(query, { locale: locale.toUpperCase() });
}
```

### Dynamic Pages (Next.js App Router)

```typescript
// app/[locale]/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const { allBlogPost } = await getAllBlogPosts('en');
  return allBlogPost.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getBlogPostBySlug(params.slug, params.locale);

  return (
    <article>
      <h1>{post.title}</h1>
      <BlueprintRenderer blocks={post.content} locale={params.locale} />
    </article>
  );
}
```

---

## 🎨 UI Components to Build

### Phase 2: Blueprint Builder

```
apps/cms/src/app/blueprints/
├── page.tsx                    # Blueprint listing
├── new/page.tsx                # Create new blueprint
├── [id]/edit/page.tsx          # Edit blueprint
└── components/
    ├── FieldTypePalette.tsx    # Drag source
    ├── BlueprintCanvas.tsx     # Drop target
    ├── FieldEditor.tsx         # Field config
    └── PreviewGenerator.tsx    # Preview template
```

### Phase 3: Visual Block Composer

```
apps/cms/src/components/
├── VisualBlockComposer.tsx     # Main composer
├── BlueprintLibrary.tsx        # Component sidebar
├── BlockCanvas.tsx             # Drag-drop area
├── DynamicFieldRenderer.tsx    # Auto-generate forms
└── BlockRenderer.tsx           # Preview blocks
```

---

## 📈 Migration Roadmap

### Current State → Target State

```
BEFORE:
└── Page
    └── PageBlock[]
        ├── type: "hero_banner"
        ├── type: "gallery"
        └── data: {...}

AFTER:
└── Page (type: PageType)
    └── BlueprintInstance[]
        ├── blueprint: ContentBlueprint
        ├── dataEn: {...}
        └── dataAr: {...}
```

### Migration Steps

1. ✅ Add `type` field to Page
2. 🔄 Add ContentBlueprint model
3. 🔄 Add BlueprintInstance model
4. 🔄 Create blueprints for existing PageBlock types
5. 🔄 Copy PageBlock data to BlueprintInstance
6. 🔄 Update frontend to use new system
7. 🔄 Deprecate PageBlock model

---

## 💡 Key Benefits

### For Editors
- ✅ No coding required for new content types
- ✅ Visual drag-and-drop interface
- ✅ Reusable components across pages
- ✅ Live preview while editing
- ✅ Bilingual content management

### For Developers
- ✅ No schema changes for new content
- ✅ GraphQL auto-generated
- ✅ TypeScript types auto-generated
- ✅ Consistent API patterns
- ✅ Scalable architecture

### For Business
- ✅ Faster time to market
- ✅ Lower development costs
- ✅ No vendor lock-in (self-hosted)
- ✅ Flexible content modeling
- ✅ Future-proof architecture

---

## 🚦 Status Summary

| Phase | Status | Timeline | Priority |
|-------|--------|----------|----------|
| Phase 1: Unified Content Model | ✅ COMPLETE | Week 1 | HIGH |
| Phase 2: Blueprint System | 🔄 READY TO START | Weeks 2-3 | HIGH |
| Phase 3: Visual Composer | ⏳ PENDING | Week 4 | HIGH |
| Phase 4: Content Hub | ⏳ PENDING | Week 5 | MEDIUM |
| Phase 5: Dynamic Frontend | ⏳ PENDING | Week 6 | HIGH |
| Phase 6: Advanced Features | ⏳ OPTIONAL | Weeks 7-8 | LOW |

---

## 📞 Next Action Items

### Immediate (This Week)

1. **Run Database Migration**
   ```bash
   cd apps/cms
   npx prisma migrate dev --name add_unified_content_model
   ```

2. **Add Blueprint Models**
   - Copy schema from [CAISY_ARCHITECTURE_ALIGNMENT.md](CAISY_ARCHITECTURE_ALIGNMENT.md)
   - Run migration

3. **Create System Blueprints Seeder**
   - File: `apps/cms/scripts/seed-system-blueprints.ts`
   - Seed 10+ core blueprints

### This Month (Weeks 2-3)

4. **Build Blueprint Builder UI**
   - Drag-and-drop field editor
   - Field configuration panel
   - Preview generator

5. **Implement GraphQL Auto-Generation**
   - Script: `scripts/generate-graphql-from-blueprints.ts`
   - Run on blueprint save

6. **Build Visual Block Composer**
   - Component library sidebar
   - Drag-drop canvas
   - Dynamic form renderer

---

## 📚 Learning Resources

### Caisy.io Documentation
- [Content Model Guide](https://caisy.io/developer/docs/dev-general/blueprints/content-model)
- [Next.js Integration](https://caisy.io/developer/docs/examples/nextjs-example)
- [GraphQL API](https://caisy.io/developer/docs)

### Code Examples
- [Next.js Blog Starter](https://github.com/caisy-io/starter-template-next-simple-blog)
- [Marketing Site Template](https://github.com/caisy-io/starter-template-nextjs-marketing-site)

### Our Documentation
- [Implementation Plan](CAISY_IO_COMPLETE_IMPLEMENTATION.md)
- [Architecture Guide](CAISY_ARCHITECTURE_ALIGNMENT.md)
- [Progress Summary](PHASE_1_COMPLETE_SUMMARY.md)

---

**Last Updated:** 2025-10-25
**Current Phase:** Phase 2 (Blueprint System)
**Est. Completion:** 5-6 weeks from start
