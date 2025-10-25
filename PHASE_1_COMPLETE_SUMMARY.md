# Phase 1 Complete: Unified Content Model

## ✅ What We've Accomplished

### 1. Database Schema Updated

**File:** [apps/cms/prisma/schema.prisma](apps/cms/prisma/schema.prisma)

Added unified content model fields to the Page model:

```prisma
model Page {
  // ... existing fields ...

  // UNIFIED CONTENT MODEL - Phase 1
  type           String      @default("normal") @map("type")
  category       String?     @map("category")
  template       String?     @map("template")
  publishedAt    DateTime?   @map("published_at")

  @@index([type])
  @@index([category])
  @@index([publishedAt])
}
```

**Page Types:**
- `normal` - Standard pages (About, Contact)
- `blog` - Blog posts
- `project` - Portfolio projects
- `service` - Service pages
- `custom` - Custom content types

### 2. GraphQL Schema Updated

**File:** [apps/cms/src/graphql/schema/pages.ts](apps/cms/src/graphql/schema/pages.ts)

Added GraphQL support for new fields:

```graphql
enum PageType {
  NORMAL
  BLOG
  PROJECT
  SERVICE
  CUSTOM
}

type Page {
  # ... existing fields
  type: PageType!
  category: String
  template: String
  publishedAt: DateTime
}

input CreatePageInput {
  # ... existing fields
  type: PageType!
  category: String
  template: String
  publishedAt: DateTime
}

input PageFilterInput {
  # ... existing fields
  type: PageType
  category: String
}
```

### 3. Comprehensive Documentation Created

**Implementation Plans:**

1. **[CAISY_IO_COMPLETE_IMPLEMENTATION.md](CAISY_IO_COMPLETE_IMPLEMENTATION.md)** (200+ lines)
   - Complete 6-phase implementation roadmap
   - Blueprint system design with TypeScript interfaces
   - 20+ system blueprints (Hero Banner, Gallery, Testimonials, etc.)
   - Visual drag-and-drop block composer specification
   - Content hub UI design
   - Dynamic frontend routing patterns
   - 6-8 week timeline with MVP in 5 weeks

2. **[CAISY_ARCHITECTURE_ALIGNMENT.md](CAISY_ARCHITECTURE_ALIGNMENT.md)** (400+ lines)
   - Deep analysis of caisy.io's actual architecture
   - Document vs Component blueprint pattern
   - Single vs Multiple instance blueprints
   - System blueprints (Asset, Navigation, Footer, SEO)
   - GraphQL auto-generation script
   - Blueprint database schema (ContentBlueprint + BlueprintInstance)
   - Next.js integration patterns matching caisy.io
   - Migration strategy from current PageBlock system

### 4. Research Completed

**Caisy.io Analysis:**
- ✅ Studied official Next.js blog starter template
- ✅ Analyzed content modeling documentation
- ✅ Reviewed GraphQL API structure
- ✅ Examined blueprint system architecture
- ✅ Learned ISR/SSR patterns with graphql-request
- ✅ Understood Document vs Component distinction
- ✅ Identified field type system
- ✅ Analyzed rich text rendering approach

---

## 🎯 Caisy.io Key Learnings Applied

### 1. **Blueprint Architecture**

**Caisy Pattern:**
```
Blueprints → Define schema
Documents → Top-level content (queryable)
Components → Reusable blocks (nested in documents)
```

**Our Implementation:**
```prisma
model ContentBlueprint {
  name: String              // "BlogPost", "HeroBanner"
  blueprintType: String     // "DOCUMENT" or "COMPONENT"
  allowMultiple: Boolean    // Single instance or multiple
  isSystem: Boolean         // Protected system blueprints
  fields: Json              // Field definitions
}

model BlueprintInstance {
  blueprintId: String
  pageId: String?           // null for documents, set for components
  dataEn: Json              // EN content
  dataAr: Json              // AR content
}
```

### 2. **GraphQL Auto-Generation**

**Caisy Approach:**
1. Create blueprint in UI
2. GraphQL schema auto-generated
3. TypeScript types auto-generated via `@graphql-codegen`
4. Queries immediately available

**Our Script:** [scripts/generate-graphql-from-blueprints.ts](CAISY_ARCHITECTURE_ALIGNMENT.md#graphql-auto-generation)

Generates queries like:
```graphql
# For multiple-instance blueprints
allBlogPost(limit: Int, offset: Int, locale: Locale): [BlogPost!]!

# For single-instance blueprints
navigation(locale: Locale): Navigation
```

### 3. **Next.js Integration Pattern**

**Caisy Pattern (ISR):**
```typescript
// apps/frontend/lib/caisy-client.ts
const client = new GraphQLClient(
  `${process.env.CMS_URL}/api/graphql`,
  {
    headers: {
      "x-caisy-apikey": process.env.CAISY_API_KEY,
    },
  }
);

export async function getAllBlogPosts(locale: 'en' | 'ar') {
  const query = `
    query allBlogArticle {
      allBlogArticle(locale: ${locale}) {
        edges {
          node { slug, title, text { json } }
        }
      }
    }
  `;
  return client.request(query);
}

// apps/frontend/app/[locale]/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const { allBlogArticle } = await getAllBlogPosts('en');
  return allBlogArticle.edges.map(edge => ({ slug: edge.node.slug }));
}

export default async function BlogPost({ params }) {
  const post = await getBlogPostBySlug(params.slug, params.locale);
  return <RichTextRenderer node={post.text.json} />;
}
```

### 4. **Rich Text Handling**

**Caisy Solution:** `@caisy/rich-text-react-renderer`

**Our Equivalent:** Store as JSON, render with custom component
```typescript
import { RichTextRenderer } from '@/components/RichTextRenderer';

<RichTextRenderer
  content={block.data.content}
  locale={locale}
/>
```

---

## 📋 Next Steps (Phase 2: Blueprint System)

### Week 2-3 Tasks

#### 1. **Database Migration** (Priority: CRITICAL)

When database is available:
```bash
cd apps/cms
npx prisma migrate deploy
npx prisma generate
```

#### 2. **Add Blueprint Models to Schema**

**File:** `apps/cms/prisma/schema.prisma`

Add the models from [CAISY_ARCHITECTURE_ALIGNMENT.md#updated-database-schema](CAISY_ARCHITECTURE_ALIGNMENT.md):

```prisma
enum BlueprintType {
  DOCUMENT
  COMPONENT
}

model ContentBlueprint { ... }
model BlueprintInstance { ... }
```

#### 3. **Update Page Model Relations**

```prisma
model Page {
  // ... existing fields
  components BlueprintInstance[]
}
```

#### 4. **Create System Blueprints Seeder**

**File:** `apps/cms/scripts/seed-system-blueprints.ts`

Seed blueprints:
- ✅ Asset (media files)
- ✅ Navigation (site navigation)
- ✅ Footer (site footer)
- ✅ SEO Meta (SEO metadata)
- ✅ Hero Banner
- ✅ Image Gallery
- ✅ Testimonials
- ✅ Rich Text Block
- ✅ CTA Section
- ✅ Video Embed

#### 5. **Build Blueprint Builder UI**

**File:** `apps/cms/src/app/blueprints/page.tsx`

Features:
- Blueprint creation form
- Field type palette (drag-and-drop)
- Field configuration panel
- Preview template editor
- Save/publish workflow

**UI Layout:**
```
┌─────────────┬──────────────────┬──────────────┐
│ Field Types │  Blueprint Canvas│   Properties │
│             │                  │              │
│ ○ Text      │  ┌─────────────┐ │ Field Name:  │
│ ○ Image     │  │ Field: title│ │ [          ] │
│ ○ Gallery   │  │ Type: text  │ │              │
│ ○ Rich Text │  └─────────────┘ │ Required: ☑  │
│ ○ Number    │  ┌─────────────┐ │              │
│ ○ Select    │  │Field: image │ │ Bilingual: ☑ │
│ ...         │  │ Type: image │ │              │
└─────────────┴──────────────────┴──────────────┘
```

#### 6. **Implement GraphQL Auto-Generation**

**File:** `apps/cms/scripts/generate-graphql-from-blueprints.ts`

Run after blueprint changes:
```bash
npm run generate:graphql
```

Generates:
- GraphQL type definitions
- Query definitions
- Mutation definitions
- TypeScript types (via `@graphql-codegen`)

#### 7. **Update GraphQL Resolvers**

**File:** `apps/cms/src/graphql/resolvers/blueprints.ts`

```typescript
export const blueprintResolvers = {
  Query: {
    allBlogPost: async (_, args, context) => {
      const blueprint = await context.prisma.contentBlueprint.findUnique({
        where: { name: 'BlogPost' }
      });

      return context.prisma.blueprintInstance.findMany({
        where: {
          blueprintId: blueprint.id,
          status: 'published'
        },
        take: args.limit,
        skip: args.offset
      });
    }
  },

  Mutation: {
    createBlogPost: async (_, { input }, context) => {
      // Create blueprint instance
    }
  }
};
```

---

## 🔄 Migration Strategy

### From Old System → New System

#### Current State:
```
Page → PageBlock (type: string, data: JSON)
Project (separate model)
Service (separate model)
BlogPost (separate model)
```

#### Target State:
```
Page (type: PageType) → BlueprintInstance
ContentBlueprint → defines all content types
BlueprintInstance → stores actual content
```

#### Migration Script:

**File:** `apps/cms/scripts/migrate-to-blueprints.ts`

```typescript
async function migrateToBlueprints() {
  console.log('🔄 Migrating content to blueprint system...\n');

  // 1. Create blueprints for existing PageBlock types
  const blockTypes = await prisma.pageBlock.groupBy({
    by: ['type']
  });

  for (const { type } of blockTypes) {
    await createBlueprintFromBlockType(type);
  }

  // 2. Migrate PageBlocks to BlueprintInstances
  const blocks = await prisma.pageBlock.findMany({
    include: { page: true }
  });

  for (const block of blocks) {
    const blueprint = await prisma.contentBlueprint.findUnique({
      where: { name: block.type }
    });

    await prisma.blueprintInstance.create({
      data: {
        blueprintId: blueprint.id,
        pageId: block.pageId,
        dataEn: block.data,
        dataAr: block.data, // Copy for now, manual translation later
        order: block.order,
        status: 'published'
      }
    });
  }

  console.log('✅ Migration complete!');
}
```

---

## 📊 Progress Tracker

### Phase 1: Unified Content Model ✅ COMPLETE
- [x] Update Page model with type/category/template/publishedAt
- [x] Add GraphQL enum PageType
- [x] Update CreatePageInput and UpdatePageInput
- [x] Add filtering by type and category
- [x] Create comprehensive implementation plan
- [x] Research caisy.io architecture
- [x] Align with caisy.io best practices

### Phase 2: Blueprint System 🔄 IN PROGRESS
- [ ] Add ContentBlueprint model to schema
- [ ] Add BlueprintInstance model to schema
- [ ] Run database migration
- [ ] Create system blueprints seeder
- [ ] Build blueprint builder UI
- [ ] Implement GraphQL auto-generation
- [ ] Create blueprint resolvers

### Phase 3: Visual Block Composer ⏳ PENDING
- [ ] Build component library sidebar
- [ ] Implement drag-and-drop canvas
- [ ] Create field renderer for all types
- [ ] Add live preview mode
- [ ] Add responsive preview
- [ ] Implement block duplication
- [ ] Add keyboard shortcuts

### Phase 4: Content Hub ⏳ PENDING
- [ ] Build unified content listing page
- [ ] Add multi-filter sidebar
- [ ] Implement bulk actions
- [ ] Add content type tabs
- [ ] Create content cards
- [ ] Add quick edit modal

### Phase 5: Dynamic Frontend ⏳ PENDING
- [ ] Update homepage data fetcher
- [ ] Create template system
- [ ] Build type-based router
- [ ] Implement ISR for content
- [ ] Add preview mode
- [ ] Create BlueprintRenderer component

### Phase 6: Advanced Features ⏳ OPTIONAL
- [ ] Version history
- [ ] Translation workflows
- [ ] Content scheduling
- [ ] Collaboration features
- [ ] Blueprint marketplace

---

## 🎨 UI Mockups Reference

### Blueprint Builder
```
┌────────────────────────────────────────────────────────────┐
│  Blueprints                                    + New       │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ BlogPost │  │   Hero   │  │ Gallery  │  │   CTA    │  │
│  │ Document │  │Component │  │Component │  │Component │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                            │
│  System Blueprints                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Asset   │  │Navigation│  │  Footer  │  │ SEO Meta │  │
│  │  System  │  │  System  │  │  System  │  │  System  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Content Hub
```
┌────────────────────────────────────────────────────────────┐
│  All Content                              + New Page       │
├────────────────────────────────────────────────────────────┤
│  [Search...] [Type ▾] [Category ▾] [Status ▾]             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Blog Post        │  │ Hero Section      │               │
│  │ "New Blog..."    │  │ "Homepage Hero"   │               │
│  │ ──────────────── │  │ ──────────────── │               │
│  │ villa • draft    │  │ homepage • live   │               │
│  │ Updated 2h ago   │  │ Updated 1d ago    │               │
│  └──────────────────┘  └──────────────────┘               │
└────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Commands

### Development
```bash
# Start CMS
cd apps/cms
npm run dev

# Start Frontend
cd apps/frontend
npm run dev

# Run migrations
cd apps/cms
npx prisma migrate dev

# Generate GraphQL types
npm run generate:graphql

# Seed system blueprints
npm run seed:blueprints
```

### Production
```bash
# Build CMS
cd apps/cms
npm run build

# Build Frontend
cd apps/frontend
npm run build

# Deploy migrations
cd apps/cms
npx prisma migrate deploy
```

---

## 📚 Resources

### Documentation
- [Caisy.io Content Modeling](https://caisy.io/developer/docs/dev-general/blueprints/content-model)
- [Next.js Integration Example](https://caisy.io/developer/docs/examples/nextjs-example)
- [GraphQL Auto-Generation Script](CAISY_ARCHITECTURE_ALIGNMENT.md#graphql-auto-generation)
- [System Blueprints](CAISY_ARCHITECTURE_ALIGNMENT.md#system-blueprints-library)

### Code References
- [Complete Implementation Plan](CAISY_IO_COMPLETE_IMPLEMENTATION.md)
- [Architecture Alignment](CAISY_ARCHITECTURE_ALIGNMENT.md)
- [Prisma Schema](apps/cms/prisma/schema.prisma)
- [GraphQL Schema](apps/cms/src/graphql/schema/pages.ts)

---

## 📝 Notes

### Why Blueprints Instead of Hard-Coded Models?

**Before (Hard-Coded):**
```prisma
model BlogPost { title, content, author... }
model Project { name, description, images... }
model Service { name, features, price... }
// New content type? Add new model, migrate, rebuild
```

**After (Blueprint System):**
```prisma
model ContentBlueprint { name, fields... }
model BlueprintInstance { data... }
// New content type? Just create blueprint in UI, no code changes
```

**Benefits:**
1. ✅ No code changes for new content types
2. ✅ No database migrations for schema changes
3. ✅ Editors can create custom content types
4. ✅ Reusable components across content
5. ✅ GraphQL auto-generated from blueprints
6. ✅ TypeScript types auto-generated
7. ✅ Matches industry standard (Contentful, Sanity, Caisy)

---

**Document Created:** 2025-10-25
**Phase Status:** Phase 1 ✅ COMPLETE
**Next Phase:** Phase 2 (Blueprint System) - Starting Now
**Estimated Completion:** 2-3 weeks
