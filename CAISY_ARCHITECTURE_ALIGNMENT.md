# Caisy.io Architecture Alignment Guide

## Executive Summary

After analyzing caisy.io's actual implementation, this document aligns our CMS architecture with their proven patterns while maintaining our unique requirements (bilingual EN/AR support, existing infrastructure).

---

## Key Insights from Caisy.io

### 1. **Blueprints = Content Schema Definitions**

In caisy:
- **Blueprints** are the data models that define structure
- **Documents** are top-level queryable content (Pages, Blog Posts, Navigation)
- **Components** are reusable fragments that attach to Documents (Hero Sections, Image Galleries)

**Our Implementation:**
```prisma
// Documents (top-level content)
model Page {
  type: String // "normal", "blog", "project", "service"
  // ... existing fields
}

// Components (reusable blocks)
model ContentBlueprint {
  name: String // "hero_banner", "image_gallery", "testimonials"
  blueprintType: String // "document" or "component"
  // ... field definitions
}

model BlueprintInstance {
  blueprintId: String
  pageId: String? // null for standalone documents
  data: Json
}
```

### 2. **Single vs Multiple Instances**

Caisy blueprints can be:
- **Single:** Only one instance allowed (e.g., Footer, Navigation)
- **Multiple:** Many instances allowed (e.g., Blog Posts, Projects)

**Our Implementation:**
```prisma
model ContentBlueprint {
  // ... existing fields
  allowMultiple: Boolean @default(true)
  // If false, only one BlueprintInstance can exist
}
```

### 3. **GraphQL-First Architecture**

Caisy auto-generates:
- GraphQL schema from blueprints
- TypeScript types from schema
- Queries for each blueprint

**Our Approach:**
```typescript
// Auto-generate after blueprint creation
// apps/cms/scripts/generate-graphql-from-blueprints.ts

async function generateGraphQLSchema() {
  const blueprints = await prisma.contentBlueprint.findMany();

  const typeDefs = blueprints.map(bp => {
    const fields = bp.fields.map(field =>
      `${field.name}: ${mapFieldTypeToGraphQL(field.type)}`
    ).join('\n');

    return `
      type ${bp.name} {
        id: ID!
        ${fields}
        createdAt: DateTime!
        updatedAt: DateTime!
      }

      extend type Query {
        ${bp.allowMultiple ? `
          all${capitalize(bp.name)}(
            limit: Int = 10
            offset: Int = 0
          ): [${bp.name}!]!
        ` : ''}
        ${bp.name.toLowerCase()}: ${bp.name}
      }
    `;
  });

  await writeFile('src/graphql/generated/blueprints.ts', typeDefs.join('\n'));
}
```

### 4. **Component Preview Screenshots**

Caisy recommends adding preview images to help editors visualize components before adding them.

**Our Implementation:**
```prisma
model ContentBlueprint {
  // ... existing fields
  thumbnailUrl: String? // Screenshot of component
  previewData: Json? // Sample data for preview rendering
}
```

### 5. **System Blueprints (Protected)**

Caisy has protected system blueprints (like Assets) that cannot be deleted but can be extended.

**Our Implementation:**
```typescript
// System blueprints (cannot be deleted)
const SYSTEM_BLUEPRINTS = [
  'asset', // Media files
  'navigation', // Site navigation
  'footer', // Site footer
  'seo_meta' // SEO metadata
];

// Prevent deletion in API
async function deleteBlueprint(id: string) {
  const blueprint = await prisma.contentBlueprint.findUnique({ where: { id } });
  if (blueprint?.isSystem) {
    throw new Error('Cannot delete system blueprints');
  }
  await prisma.contentBlueprint.delete({ where: { id } });
}
```

---

## Updated Database Schema (Caisy-Aligned)

```prisma
// ========================================
// BLUEPRINTS (Content Type Definitions)
// ========================================

enum BlueprintType {
  DOCUMENT  // Top-level queryable content (Pages, Posts)
  COMPONENT // Reusable blocks (Hero, Gallery, CTA)
}

model ContentBlueprint {
  id              String        @id @default(uuid())
  name            String        @unique // "BlogPost", "HeroBanner", "ImageGallery"
  displayName     String        @map("display_name") // "Blog Post", "Hero Banner"
  description     String?

  // Blueprint configuration
  blueprintType   BlueprintType @default(COMPONENT) @map("blueprint_type")
  allowMultiple   Boolean       @default(true) @map("allow_multiple")
  isSystem        Boolean       @default(false) @map("is_system")

  // Visual
  icon            String?       // Lucide icon name
  thumbnailUrl    String?       @map("thumbnail_url")
  category        String        @default("general") // "layout", "media", "content"

  // Field definitions (JSON schema)
  fields          Json          // Array<FieldDefinition>

  // Preview
  previewData     Json?         @map("preview_data")
  previewTemplate String?       @map("preview_template")

  // Metadata
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")
  createdBy       String?       @map("created_by")

  // Relations
  instances       BlueprintInstance[]

  @@index([blueprintType])
  @@index([category])
  @@index([isSystem])
  @@map("content_blueprints")
}

// ========================================
// BLUEPRINT INSTANCES (Actual Content)
// ========================================

model BlueprintInstance {
  id              String   @id @default(uuid())
  blueprintId     String   @map("blueprint_id")

  // Document instances are standalone (pageId = null)
  // Component instances attach to pages
  pageId          String?  @map("page_id")

  // Locale-specific data
  dataEn          Json     @map("data_en")
  dataAr          Json     @map("data_ar")

  // Ordering (for components on a page)
  order           Int      @default(0)

  // Publishing
  status          String   @default("draft")
  publishedAt     DateTime? @map("published_at")

  // Metadata
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  blueprint       ContentBlueprint @relation(fields: [blueprintId], references: [id], onDelete: Cascade)
  page            Page?            @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@index([blueprintId])
  @@index([pageId])
  @@index([order])
  @@index([status])
  @@map("blueprint_instances")
}

// ========================================
// PAGES (Now simplified - uses Blueprints)
// ========================================

model Page {
  id             String      @id @default(uuid())

  // Basic info (still here for backwards compatibility)
  titleEn        String      @map("title_en")
  titleAr        String      @map("title_ar")
  slugEn         String      @unique @map("slug_en")
  slugAr         String      @unique @map("slug_ar")

  // Unified Content Model
  type           String      @default("normal") @map("type")
  category       String?     @map("category")
  template       String?     @map("template")
  publishedAt    DateTime?   @map("published_at")

  // SEO (consider moving to SEO blueprint instance)
  seoMetaTitleEn String?     @map("seo_meta_title_en")
  seoMetaTitleAr String?     @map("seo_meta_title_ar")
  seoMetaDescEn  String?     @map("seo_meta_desc_en")
  seoMetaDescAr  String?     @map("seo_meta_desc_ar")
  seoKeywords    String[]    @map("seo_keywords")

  status         String      @default("draft")
  featured       Boolean     @default(false)
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")
  parentId       String?     @map("parent_id")

  // NEW: Blueprint instances instead of PageBlock
  components     BlueprintInstance[]

  // Legacy (keep for migration)
  blocks         PageBlock[]

  parent         Page?       @relation("PageChildren", fields: [parentId], references: [id])
  children       Page[]      @relation("PageChildren")

  @@index([type])
  @@index([slugEn])
  @@index([slugAr])
  @@index([status])
  @@map("pages")
}
```

---

## System Blueprints Library

Based on caisy's approach, here are our core system blueprints:

### 1. **Asset (System Blueprint - Cannot Delete)**
```json
{
  "name": "Asset",
  "displayName": "Media Asset",
  "blueprintType": "COMPONENT",
  "allowMultiple": true,
  "isSystem": true,
  "fields": [
    {
      "name": "file",
      "label": { "en": "File", "ar": "ملف" },
      "type": "file",
      "required": true
    },
    {
      "name": "alt",
      "label": { "en": "Alt Text", "ar": "نص بديل" },
      "type": "text",
      "bilingual": true
    },
    {
      "name": "caption",
      "label": { "en": "Caption", "ar": "تعليق" },
      "type": "textarea",
      "bilingual": true
    }
  ]
}
```

### 2. **Navigation (System Blueprint - Single Instance)**
```json
{
  "name": "Navigation",
  "displayName": "Site Navigation",
  "blueprintType": "DOCUMENT",
  "allowMultiple": false,
  "isSystem": true,
  "fields": [
    {
      "name": "items",
      "label": { "en": "Navigation Items", "ar": "عناصر التنقل" },
      "type": "repeater",
      "fields": [
        {
          "name": "label",
          "label": { "en": "Label", "ar": "التسمية" },
          "type": "text",
          "bilingual": true,
          "required": true
        },
        {
          "name": "url",
          "label": { "en": "URL", "ar": "الرابط" },
          "type": "text",
          "required": true
        },
        {
          "name": "children",
          "label": { "en": "Submenu", "ar": "قائمة فرعية" },
          "type": "repeater",
          "fields": [] // Nested navigation
        }
      ]
    }
  ]
}
```

### 3. **BlogPost (Document Blueprint)**
```json
{
  "name": "BlogPost",
  "displayName": "Blog Post",
  "blueprintType": "DOCUMENT",
  "allowMultiple": true,
  "isSystem": false,
  "thumbnailUrl": "/blueprints/blog-post-preview.png",
  "fields": [
    {
      "name": "title",
      "label": { "en": "Title", "ar": "العنوان" },
      "type": "text",
      "bilingual": true,
      "required": true,
      "validation": { "maxLength": 100 }
    },
    {
      "name": "slug",
      "label": { "en": "URL Slug", "ar": "عنوان URL" },
      "type": "text",
      "bilingual": true,
      "required": true,
      "validation": { "pattern": "^[a-z0-9-]+$" }
    },
    {
      "name": "excerpt",
      "label": { "en": "Excerpt", "ar": "مقتطف" },
      "type": "textarea",
      "bilingual": true,
      "required": true,
      "validation": { "maxLength": 300 }
    },
    {
      "name": "featuredImage",
      "label": { "en": "Featured Image", "ar": "الصورة المميزة" },
      "type": "reference",
      "referenceType": "Asset",
      "required": true
    },
    {
      "name": "content",
      "label": { "en": "Content", "ar": "المحتوى" },
      "type": "repeater",
      "label": { "en": "Content Blocks", "ar": "كتل المحتوى" },
      "allowedComponents": [
        "RichText",
        "ImageGallery",
        "Quote",
        "CodeBlock",
        "VideoEmbed"
      ]
    },
    {
      "name": "author",
      "label": { "en": "Author", "ar": "الكاتب" },
      "type": "reference",
      "referenceType": "Author"
    },
    {
      "name": "publishedDate",
      "label": { "en": "Published Date", "ar": "تاريخ النشر" },
      "type": "datetime",
      "required": true
    },
    {
      "name": "tags",
      "label": { "en": "Tags", "ar": "الوسوم" },
      "type": "relation",
      "referenceType": "Tag",
      "multiple": true
    }
  ]
}
```

### 4. **HeroBanner (Component Blueprint)**
```json
{
  "name": "HeroBanner",
  "displayName": "Hero Banner",
  "blueprintType": "COMPONENT",
  "allowMultiple": true,
  "category": "layout",
  "icon": "image-plus",
  "thumbnailUrl": "/blueprints/hero-banner-preview.png",
  "fields": [
    {
      "name": "heading",
      "label": { "en": "Heading", "ar": "العنوان" },
      "type": "text",
      "bilingual": true,
      "required": true,
      "validation": { "maxLength": 60 }
    },
    {
      "name": "subheading",
      "label": { "en": "Subheading", "ar": "العنوان الفرعي" },
      "type": "textarea",
      "bilingual": true,
      "validation": { "maxLength": 200 }
    },
    {
      "name": "backgroundImage",
      "label": { "en": "Background Image", "ar": "صورة الخلفية" },
      "type": "reference",
      "referenceType": "Asset",
      "required": true
    },
    {
      "name": "ctaButton",
      "label": { "en": "Call to Action", "ar": "دعوة للعمل" },
      "type": "group",
      "fields": [
        {
          "name": "text",
          "label": { "en": "Button Text", "ar": "نص الزر" },
          "type": "text",
          "bilingual": true
        },
        {
          "name": "link",
          "label": { "en": "Link", "ar": "الرابط" },
          "type": "text"
        },
        {
          "name": "style",
          "label": { "en": "Style", "ar": "النمط" },
          "type": "select",
          "options": [
            { "value": "primary", "label": { "en": "Primary", "ar": "أساسي" } },
            { "value": "secondary", "label": { "en": "Secondary", "ar": "ثانوي" } }
          ],
          "defaultValue": "primary"
        }
      ]
    },
    {
      "name": "alignment",
      "label": { "en": "Text Alignment", "ar": "محاذاة النص" },
      "type": "radio",
      "options": [
        { "value": "left", "label": { "en": "Left", "ar": "يسار" } },
        { "value": "center", "label": { "en": "Center", "ar": "وسط" } },
        { "value": "right", "label": { "en": "Right", "ar": "يمين" } }
      ],
      "defaultValue": "center"
    }
  ]
}
```

---

## GraphQL Auto-Generation

### How Caisy Does It

1. Blueprint created in UI
2. GraphQL schema auto-generated
3. TypeScript types auto-generated via `graphql-codegen`
4. Queries immediately available

### Our Implementation

**File:** `apps/cms/scripts/generate-graphql-from-blueprints.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'fs/promises';

const prisma = new PrismaClient();

async function generateGraphQLSchema() {
  const blueprints = await prisma.contentBlueprint.findMany();

  const typeDefs: string[] = [];
  const queries: string[] = [];
  const mutations: string[] = [];

  for (const blueprint of blueprints) {
    const fields = JSON.parse(blueprint.fields as string);

    // Generate type definition
    const fieldDefs = fields.map((field: any) => {
      const graphqlType = mapFieldTypeToGraphQL(field.type);
      const nullable = field.required ? '!' : '';
      return `    ${field.name}: ${graphqlType}${nullable}`;
    }).join('\n');

    typeDefs.push(`
  type ${blueprint.name} {
    id: ID!
    ${fieldDefs}
    createdAt: DateTime!
    updatedAt: DateTime!
    publishedAt: DateTime
    status: String!
  }`);

    // Generate queries
    if (blueprint.allowMultiple) {
      queries.push(`
    all${capitalize(blueprint.name)}(
      limit: Int = 10
      offset: Int = 0
      locale: Locale = EN
      filter: ${blueprint.name}FilterInput
    ): [${blueprint.name}!]!`);
    }

    queries.push(`
    ${blueprint.name.toLowerCase()}(
      id: ID
      locale: Locale = EN
    ): ${blueprint.name}`);

    // Generate mutations
    mutations.push(`
    create${blueprint.name}(
      input: Create${blueprint.name}Input!
      locale: Locale = EN
    ): ${blueprint.name}!

    update${blueprint.name}(
      id: ID!
      input: Update${blueprint.name}Input!
      locale: Locale = EN
    ): ${blueprint.name}!

    delete${blueprint.name}(id: ID!): Boolean!`);
  }

  const schema = `
# Auto-generated from ContentBlueprints
# DO NOT EDIT MANUALLY - Run 'npm run generate:graphql' to regenerate

scalar DateTime
scalar JSON

enum Locale {
  EN
  AR
}

${typeDefs.join('\n')}

extend type Query {${queries.join('\n')}}

extend type Mutation {${mutations.join('\n')}}
`;

  await writeFile('src/graphql/generated/blueprints.graphql', schema);
  console.log('✅ GraphQL schema generated successfully');
}

function mapFieldTypeToGraphQL(fieldType: string): string {
  const typeMap: Record<string, string> = {
    text: 'String',
    textarea: 'String',
    rich_text: 'String',
    markdown: 'String',
    number: 'Int',
    float: 'Float',
    boolean: 'Boolean',
    date: 'DateTime',
    datetime: 'DateTime',
    image: 'Asset',
    gallery: '[Asset!]',
    file: 'Asset',
    video: 'String',
    select: 'String',
    radio: 'String',
    checkbox: '[String!]',
    color: 'String',
    json: 'JSON',
    reference: 'ID',
    relation: '[ID!]',
    repeater: 'JSON',
    group: 'JSON',
  };

  return typeMap[fieldType] || 'String';
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

generateGraphQLSchema()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Frontend Integration (Caisy Pattern)

### Fetching Content

**File:** `apps/frontend/lib/caisy-client.ts`

```typescript
import { GraphQLClient } from 'graphql-request';

const endpoint = `${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`;

export const caisyClient = new GraphQLClient(endpoint, {
  headers: {
    'x-caisy-apikey': process.env.CAISY_API_KEY || '',
  },
});

// Type-safe query
export async function getAllBlogPosts(locale: 'en' | 'ar' = 'en') {
  const query = `
    query AllBlogPosts($locale: Locale!) {
      allBlogPost(locale: $locale, limit: 100) {
        id
        title
        slug
        excerpt
        featuredImage {
          url
          alt
        }
        publishedDate
        author {
          name
          avatar {
            url
          }
        }
      }
    }
  `;

  return caisyClient.request(query, { locale: locale.toUpperCase() });
}
```

### Dynamic Pages

**File:** `apps/frontend/app/[locale]/blog/[slug]/page.tsx`

```typescript
import { getAllBlogPosts, getBlogPostBySlug } from '@/lib/caisy-client';
import { BlueprintRenderer } from '@/components/BlueprintRenderer';

export async function generateStaticParams() {
  const { allBlogPost } = await getAllBlogPosts('en');
  return allBlogPost.map((post: any) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = params;
  const { blogPost } = await getBlogPostBySlug(slug, locale);

  if (!blogPost) notFound();

  return (
    <article className="blog-post">
      <header>
        <h1>{blogPost.title}</h1>
        <time>{blogPost.publishedDate}</time>
      </header>

      {/* Render content blocks */}
      <BlueprintRenderer
        blocks={blogPost.content}
        locale={locale}
      />
    </article>
  );
}
```

---

## Key Differences from Caisy

While we're aligning with caisy's architecture, we maintain these differences:

| Feature | Caisy | Our Implementation |
|---------|-------|-------------------|
| **Localization** | Multiple languages via locales | Bilingual (EN/AR) at field level |
| **Hosting** | Caisy cloud | Self-hosted (Vercel + PostgreSQL) |
| **Storage** | Caisy assets | Vercel Blob |
| **Preview** | Built-in preview | Custom preview implementation |
| **Pricing** | SaaS subscription | Free (self-hosted) |
| **Customization** | Limited to UI | Full control over backend |

---

## Migration Path

### Phase 1: Add Blueprint Models ✅
- [x] Update Prisma schema
- [ ] Run migration
- [ ] Update GraphQL types

### Phase 2: Create System Blueprints
- [ ] Asset blueprint
- [ ] Navigation blueprint
- [ ] Footer blueprint
- [ ] SEO Meta blueprint

### Phase 3: Migrate Existing Content
- [ ] Convert PageBlocks to BlueprintInstances
- [ ] Migrate Projects to ProjectBlueprint instances
- [ ] Migrate Services to ServiceBlueprint instances

### Phase 4: Build Blueprint Builder UI
- [ ] Blueprint creation form
- [ ] Field type palette
- [ ] Drag-and-drop field ordering
- [ ] Preview configuration

### Phase 5: Build Visual Composer
- [ ] Component library sidebar
- [ ] Drag-and-drop canvas
- [ ] Live preview
- [ ] Responsive preview modes

---

## Next Steps

1. Update Prisma schema with Blueprint models
2. Create migration
3. Build system blueprints seeder
4. Implement GraphQL auto-generation script
5. Build Blueprint Builder UI
6. Build Visual Block Composer

---

**Document Version:** 1.0
**Last Updated:** 2025-10-25
**Status:** ARCHITECTURE PLANNING
