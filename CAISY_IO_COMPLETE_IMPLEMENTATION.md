# Caisy.io Complete CMS Implementation Plan

## Executive Summary

This document outlines the complete implementation plan to transform your current CMS into a **caisy.io-like headless CMS** with blueprint-based content modeling, visual drag-and-drop block composition, and unified content management.

**Target Features:**
- 🎨 Visual drag-and-drop block builder
- 📋 Blueprint system for custom content types
- 🔄 Unified content hub replacing separate sections
- 🚀 Type-based dynamic routing
- 📦 Reusable component library
- 🎯 Field-level content modeling
- 🌐 Full bilingual support (EN/AR)

---

## Phase 1: Unified Content Model ✅ COMPLETED

**Timeline:** Week 1 (DONE)
**Status:** Schema updated, migration pending database availability

### Implemented Changes

#### Database Schema
```prisma
model Page {
  // ... existing fields ...

  // NEW FIELDS
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
- `normal` - Standard pages (About, Contact, Services landing)
- `blog` - Blog posts with article schema
- `project` - Portfolio/case studies
- `service` - Service detail pages
- `custom` - User-defined types via blueprints

### Next Steps for Phase 1

1. **Run Migration** (when database is available):
   ```bash
   cd apps/cms && npx prisma migrate deploy
   npx prisma generate
   ```

2. **Update GraphQL Schema** ([apps/cms/src/graphql/schema/pages.ts](apps/cms/src/graphql/schema/pages.ts)):
   ```typescript
   export const pageTypeDefs = gql`
     enum PageType {
       NORMAL
       BLOG
       PROJECT
       SERVICE
       CUSTOM
     }

     type Page {
       id: ID!
       type: PageType!
       category: String
       template: String
       publishedAt: DateTime
       # ... existing fields
     }

     input CreatePageInput {
       type: PageType!
       category: String
       template: String
       # ... existing fields
     }
   `;
   ```

3. **Update Page Creation API** ([apps/cms/src/app/api/pages/route.ts](apps/cms/src/app/api/pages/route.ts)):
   - Add type selection dropdown
   - Category autocomplete field
   - Template selection (optional)
   - Publish date picker

---

## Phase 2: Blueprint System

**Timeline:** Weeks 2-3
**Priority:** HIGH

### Architecture

#### Database Schema
```prisma
model ContentBlueprint {
  id              String   @id @default(uuid())
  name            String   @unique
  displayName     String   @map("display_name")
  description     String?
  icon            String?  // Icon name (e.g., "layout", "image", "text")
  category        String   @default("general") // "layout", "media", "content", "custom"

  // Field Definitions
  fields          Json     // Array of FieldDefinition objects

  // Preview
  previewTemplate String?  @map("preview_template") // Handlebars template for preview
  thumbnailUrl    String?  @map("thumbnail_url")

  // System blueprints cannot be deleted
  isSystem        Boolean  @default(false) @map("is_system")

  // Metadata
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  createdBy       String?  @map("created_by")

  @@index([category])
  @@index([isSystem])
  @@map("content_blueprints")
}

model BlueprintInstance {
  id              String   @id @default(uuid())
  blueprintId     String   @map("blueprint_id")
  pageId          String?  @map("page_id") // If attached to a page

  // Content data (matches blueprint field definitions)
  data            Json

  // Positioning
  order           Int      @default(0)

  // Metadata
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@index([blueprintId])
  @@index([pageId])
  @@index([order])
  @@map("blueprint_instances")
}
```

#### Field Type System
```typescript
// apps/cms/src/types/blueprint.ts

export enum FieldType {
  // Text
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RICH_TEXT = 'rich_text',
  MARKDOWN = 'markdown',

  // Media
  IMAGE = 'image',
  GALLERY = 'gallery',
  VIDEO = 'video',
  FILE = 'file',

  // Data
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',

  // Selection
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  COLOR = 'color',

  // Relations
  RELATION = 'relation', // Link to other content
  REFERENCE = 'reference', // Reference to pages/media

  // Structured
  JSON = 'json',
  REPEATER = 'repeater', // Nested fields
  GROUP = 'group', // Field grouping

  // Location
  LOCATION = 'location', // Lat/lng picker
  ADDRESS = 'address',
}

export interface FieldDefinition {
  id: string;
  name: string;
  label: {
    en: string;
    ar: string;
  };
  type: FieldType;

  // Validation
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string; // Regex pattern

  // Options (for select/radio/checkbox)
  options?: Array<{
    value: string;
    label: { en: string; ar: string };
  }>;

  // Media constraints
  accept?: string[]; // File types (for image/file/video)
  maxSize?: number; // In bytes

  // Repeater/Group fields
  fields?: FieldDefinition[]; // Nested fields

  // UI hints
  placeholder?: { en: string; ar: string };
  helpText?: { en: string; ar: string };
  defaultValue?: any;

  // Bilingual
  bilingual?: boolean; // If true, creates separate EN/AR fields
}

export interface ContentBlueprint {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  category: 'layout' | 'media' | 'content' | 'custom';
  fields: FieldDefinition[];
  previewTemplate?: string;
  thumbnailUrl?: string;
  isSystem: boolean;
}
```

### System Blueprints (Pre-built)

**1. Hero Banner**
```typescript
{
  name: 'hero_banner',
  displayName: 'Hero Banner',
  icon: 'image-plus',
  category: 'layout',
  fields: [
    {
      name: 'heading',
      label: { en: 'Heading', ar: 'العنوان' },
      type: 'text',
      bilingual: true,
      required: true
    },
    {
      name: 'subheading',
      label: { en: 'Subheading', ar: 'العنوان الفرعي' },
      type: 'textarea',
      bilingual: true
    },
    {
      name: 'backgroundImage',
      label: { en: 'Background Image', ar: 'صورة الخلفية' },
      type: 'image',
      required: true,
      accept: ['image/jpeg', 'image/png', 'image/webp'],
      maxSize: 5 * 1024 * 1024 // 5MB
    },
    {
      name: 'ctaButton',
      label: { en: 'Call to Action', ar: 'زر الدعوة للعمل' },
      type: 'group',
      fields: [
        { name: 'text', label: { en: 'Button Text', ar: 'نص الزر' }, type: 'text', bilingual: true },
        { name: 'link', label: { en: 'Link', ar: 'الرابط' }, type: 'text' },
        { name: 'style', label: { en: 'Style', ar: 'النمط' }, type: 'select', options: [
          { value: 'primary', label: { en: 'Primary', ar: 'أساسي' } },
          { value: 'secondary', label: { en: 'Secondary', ar: 'ثانوي' } },
          { value: 'outline', label: { en: 'Outline', ar: 'محدد' } }
        ]}
      ]
    }
  ]
}
```

**2. Image Gallery**
```typescript
{
  name: 'image_gallery',
  displayName: 'Image Gallery',
  icon: 'gallery',
  category: 'media',
  fields: [
    {
      name: 'title',
      label: { en: 'Gallery Title', ar: 'عنوان المعرض' },
      type: 'text',
      bilingual: true
    },
    {
      name: 'images',
      label: { en: 'Images', ar: 'الصور' },
      type: 'gallery',
      required: true,
      min: 1,
      max: 50
    },
    {
      name: 'layout',
      label: { en: 'Layout', ar: 'التخطيط' },
      type: 'select',
      options: [
        { value: 'grid', label: { en: 'Grid', ar: 'شبكة' } },
        { value: 'masonry', label: { en: 'Masonry', ar: 'بناء' } },
        { value: 'carousel', label: { en: 'Carousel', ar: 'دوار' } }
      ],
      defaultValue: 'grid'
    },
    {
      name: 'columns',
      label: { en: 'Columns', ar: 'الأعمدة' },
      type: 'number',
      min: 1,
      max: 6,
      defaultValue: 3
    }
  ]
}
```

**3. Text Block (Rich Content)**
```typescript
{
  name: 'text_block',
  displayName: 'Text Block',
  icon: 'text',
  category: 'content',
  fields: [
    {
      name: 'content',
      label: { en: 'Content', ar: 'المحتوى' },
      type: 'rich_text',
      bilingual: true,
      required: true
    },
    {
      name: 'alignment',
      label: { en: 'Alignment', ar: 'المحاذاة' },
      type: 'radio',
      options: [
        { value: 'left', label: { en: 'Left', ar: 'يسار' } },
        { value: 'center', label: { en: 'Center', ar: 'وسط' } },
        { value: 'right', label: { en: 'Right', ar: 'يمين' } }
      ],
      defaultValue: 'left'
    }
  ]
}
```

**4. Testimonials Slider**
```typescript
{
  name: 'testimonials',
  displayName: 'Testimonials',
  icon: 'quote',
  category: 'content',
  fields: [
    {
      name: 'items',
      label: { en: 'Testimonials', ar: 'الشهادات' },
      type: 'repeater',
      fields: [
        { name: 'name', label: { en: 'Name', ar: 'الاسم' }, type: 'text', required: true },
        { name: 'role', label: { en: 'Role', ar: 'الدور' }, type: 'text', bilingual: true },
        { name: 'comment', label: { en: 'Comment', ar: 'التعليق' }, type: 'textarea', bilingual: true, required: true },
        { name: 'rating', label: { en: 'Rating', ar: 'التقييم' }, type: 'number', min: 1, max: 5 },
        { name: 'image', label: { en: 'Photo', ar: 'الصورة' }, type: 'image' }
      ],
      min: 1,
      max: 20
    }
  ]
}
```

### Blueprint Builder UI

**File:** `apps/cms/src/app/blueprints/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function BlueprintBuilder() {
  const [blueprint, setBlueprint] = useState<ContentBlueprint>({
    name: '',
    displayName: '',
    description: '',
    category: 'custom',
    fields: []
  });

  // Field type palette
  const fieldTypes: { type: FieldType; label: string; icon: string }[] = [
    { type: 'text', label: 'Text', icon: 'type' },
    { type: 'textarea', label: 'Textarea', icon: 'align-left' },
    { type: 'rich_text', label: 'Rich Text', icon: 'file-text' },
    { type: 'image', label: 'Image', icon: 'image' },
    { type: 'gallery', label: 'Gallery', icon: 'images' },
    { type: 'number', label: 'Number', icon: 'hash' },
    { type: 'boolean', label: 'Toggle', icon: 'toggle-left' },
    { type: 'select', label: 'Select', icon: 'chevron-down' },
    { type: 'date', label: 'Date', icon: 'calendar' },
    { type: 'repeater', label: 'Repeater', icon: 'repeat' },
    { type: 'group', label: 'Group', icon: 'folder' }
  ];

  return (
    <div className="blueprint-builder">
      {/* Left sidebar - Field palette */}
      <aside className="field-palette">
        <h3>Field Types</h3>
        {fieldTypes.map(ft => (
          <div key={ft.type} draggable className="field-type-item">
            <Icon name={ft.icon} />
            <span>{ft.label}</span>
          </div>
        ))}
      </aside>

      {/* Center - Blueprint canvas */}
      <main className="blueprint-canvas">
        <header>
          <input
            type="text"
            placeholder="Blueprint Name"
            value={blueprint.displayName}
            onChange={e => setBlueprint({ ...blueprint, displayName: e.target.value })}
          />
        </header>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="fields">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {blueprint.fields.map((field, index) => (
                  <Draggable key={field.id} draggableId={field.id} index={index}>
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="field-item"
                      >
                        <FieldEditor field={field} onChange={updateField} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Right sidebar - Field properties */}
      <aside className="field-properties">
        <h3>Field Properties</h3>
        {/* Field configuration panel */}
      </aside>
    </div>
  );
}
```

---

## Phase 3: Visual Block Composer

**Timeline:** Week 4
**Priority:** HIGH

### Drag-and-Drop Block Editor

**File:** `apps/cms/src/components/VisualBlockComposer.tsx`

```typescript
'use client';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useState } from 'react';

interface Block {
  id: string;
  blueprintId: string;
  data: any;
}

export default function VisualBlockComposer({ pageId }: { pageId: string }) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [blueprints, setBlueprints] = useState<ContentBlueprint[]>([]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    setBlocks(items);
    saveBlockOrder(items);
  };

  const addBlock = (blueprint: ContentBlueprint) => {
    const newBlock: Block = {
      id: generateId(),
      blueprintId: blueprint.id,
      data: getDefaultData(blueprint.fields)
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <div className="visual-block-composer">
      {/* Left: Blueprint library */}
      <aside className="blueprint-library">
        <h3>Components</h3>

        <div className="blueprint-categories">
          {['layout', 'media', 'content', 'custom'].map(category => (
            <div key={category} className="blueprint-category">
              <h4>{category}</h4>
              {blueprints
                .filter(bp => bp.category === category)
                .map(bp => (
                  <div
                    key={bp.id}
                    className="blueprint-card"
                    onClick={() => addBlock(bp)}
                  >
                    {bp.thumbnailUrl && <img src={bp.thumbnailUrl} alt={bp.displayName} />}
                    <Icon name={bp.icon || 'square'} />
                    <span>{bp.displayName}</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </aside>

      {/* Center: Block canvas */}
      <main className="block-canvas">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`block-drop-zone ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              >
                {blocks.length === 0 && (
                  <div className="empty-state">
                    <Icon name="plus-circle" size={48} />
                    <p>Drag components here to start building</p>
                  </div>
                )}

                {blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`block-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      >
                        {/* Drag handle */}
                        <div {...provided.dragHandleProps} className="drag-handle">
                          <Icon name="grip-vertical" />
                        </div>

                        {/* Block content */}
                        <BlockRenderer
                          block={block}
                          blueprint={blueprints.find(bp => bp.id === block.blueprintId)!}
                          onUpdate={data => updateBlock(block.id, data)}
                        />

                        {/* Block actions */}
                        <div className="block-actions">
                          <button onClick={() => duplicateBlock(block)}>
                            <Icon name="copy" />
                          </button>
                          <button onClick={() => deleteBlock(block.id)}>
                            <Icon name="trash" />
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      {/* Right: Block settings */}
      <aside className="block-settings">
        <h3>Block Settings</h3>
        {/* Selected block configuration */}
      </aside>
    </div>
  );
}
```

### Dynamic Form Renderer

**File:** `apps/cms/src/components/DynamicFieldRenderer.tsx`

```typescript
export function DynamicFieldRenderer({
  field,
  value,
  onChange,
  locale
}: {
  field: FieldDefinition;
  value: any;
  onChange: (value: any) => void;
  locale: 'en' | 'ar';
}) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder?.[locale]}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder?.[locale]}
            required={field.required}
            rows={5}
          />
        );

      case 'rich_text':
        return (
          <RichTextEditor
            value={value || ''}
            onChange={onChange}
            locale={locale}
          />
        );

      case 'image':
        return (
          <MediaPicker
            type="image"
            value={value}
            onChange={onChange}
            accept={field.accept}
            maxSize={field.maxSize}
          />
        );

      case 'gallery':
        return (
          <MediaPicker
            type="gallery"
            value={value || []}
            onChange={onChange}
            multiple
            min={field.min}
            max={field.max}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={e => onChange(Number(e.target.value))}
            min={field.min}
            max={field.max}
            required={field.required}
          />
        );

      case 'boolean':
        return (
          <label className="toggle">
            <input
              type="checkbox"
              checked={value || false}
              onChange={e => onChange(e.target.checked)}
            />
            <span className="slider" />
          </label>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label[locale]}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            required={field.required}
          />
        );

      case 'repeater':
        return (
          <RepeaterField
            field={field}
            value={value || []}
            onChange={onChange}
            locale={locale}
          />
        );

      case 'group':
        return (
          <div className="field-group">
            {field.fields?.map(subField => (
              <DynamicFieldRenderer
                key={subField.id}
                field={subField}
                value={value?.[subField.name]}
                onChange={v => onChange({ ...value, [subField.name]: v })}
                locale={locale}
              />
            ))}
          </div>
        );

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className={`field-wrapper field-${field.type}`}>
      <label>
        {field.label[locale]}
        {field.required && <span className="required">*</span>}
      </label>
      {renderField()}
      {field.helpText?.[locale] && (
        <p className="help-text">{field.helpText[locale]}</p>
      )}
    </div>
  );
}
```

---

## Phase 4: Content Hub

**Timeline:** Week 5
**Priority:** MEDIUM

### Unified Content Management

**File:** `apps/cms/src/app/content/page.tsx`

```typescript
'use client';

import { useState, useMemo } from 'react';

export default function ContentHub() {
  const [pages, setPages] = useState<Page[]>([]);
  const [filter, setFilter] = useState<{
    type?: string;
    category?: string;
    status?: string;
    search?: string;
  }>({});

  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      if (filter.type && page.type !== filter.type) return false;
      if (filter.category && page.category !== filter.category) return false;
      if (filter.status && page.status !== filter.status) return false;
      if (filter.search) {
        const search = filter.search.toLowerCase();
        return (
          page.titleEn.toLowerCase().includes(search) ||
          page.titleAr.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [pages, filter]);

  return (
    <div className="content-hub">
      <header>
        <h1>All Content</h1>
        <button onClick={() => createNewPage()}>
          <Icon name="plus" /> New Page
        </button>
      </header>

      {/* Filters */}
      <div className="filters">
        <select
          value={filter.type || ''}
          onChange={e => setFilter({ ...filter, type: e.target.value || undefined })}
        >
          <option value="">All Types</option>
          <option value="normal">Normal Pages</option>
          <option value="blog">Blog Posts</option>
          <option value="project">Projects</option>
          <option value="service">Services</option>
          <option value="custom">Custom</option>
        </select>

        <input
          type="text"
          placeholder="Search..."
          value={filter.search || ''}
          onChange={e => setFilter({ ...filter, search: e.target.value })}
        />

        <select
          value={filter.status || ''}
          onChange={e => setFilter({ ...filter, status: e.target.value || undefined })}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {filteredPages.map(page => (
          <ContentCard key={page.id} page={page} />
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <button>Publish Selected</button>
        <button>Delete Selected</button>
        <button>Export</button>
      </div>
    </div>
  );
}

function ContentCard({ page }: { page: Page }) {
  return (
    <div className="content-card">
      <div className="card-header">
        <span className={`badge badge-${page.type}`}>{page.type}</span>
        <span className={`status status-${page.status}`}>{page.status}</span>
      </div>

      <h3>{page.titleEn}</h3>
      <p className="meta">
        {page.category && <span className="category">{page.category}</span>}
        <span className="date">{formatDate(page.updatedAt)}</span>
      </p>

      <div className="card-actions">
        <a href={`/content/${page.id}/edit`}>Edit</a>
        <a href={`/preview/${page.slugEn}`} target="_blank">Preview</a>
        <button onClick={() => duplicatePage(page.id)}>Duplicate</button>
      </div>
    </div>
  );
}
```

---

## Phase 5: Dynamic Frontend Routing

**Timeline:** Week 6
**Priority:** HIGH

### Type-Based Page Rendering

**File:** `apps/frontend/app/[locale]/[[...slug]]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/lib/cms';

// Template components
import NormalPageTemplate from '@/templates/NormalPageTemplate';
import BlogPostTemplate from '@/templates/BlogPostTemplate';
import ProjectTemplate from '@/templates/ProjectTemplate';
import ServiceTemplate from '@/templates/ServiceTemplate';

export default async function DynamicPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';
  const slug = params.slug?.join('/') || '';

  const page = await getPageBySlug(locale, slug);
  if (!page) notFound();

  // Route to appropriate template based on page type
  switch (page.type) {
    case 'blog':
      return <BlogPostTemplate page={page} locale={locale} />;

    case 'project':
      return <ProjectTemplate page={page} locale={locale} />;

    case 'service':
      return <ServiceTemplate page={page} locale={locale} />;

    case 'normal':
    default:
      return <NormalPageTemplate page={page} locale={locale} />;
  }
}
```

### Template System

**Blog Template:** `apps/frontend/templates/BlogPostTemplate.tsx`
```typescript
export default function BlogPostTemplate({ page, locale }: TemplateProps) {
  return (
    <article className="blog-post">
      <header>
        <h1>{page.title[locale]}</h1>
        {page.publishedAt && (
          <time dateTime={page.publishedAt}>
            {formatDate(page.publishedAt, locale)}
          </time>
        )}
      </header>

      <BlockRenderer blocks={page.blocks} locale={locale} />

      {/* Blog-specific features */}
      <AuthorBio author={page.author} />
      <RelatedPosts category={page.category} />
      <Comments pageId={page.id} />
    </article>
  );
}
```

**Project Template:** `apps/frontend/templates/ProjectTemplate.tsx`
```typescript
export default function ProjectTemplate({ page, locale }: TemplateProps) {
  return (
    <div className="project-showcase">
      <ProjectHero page={page} locale={locale} />

      <div className="project-content">
        <aside className="project-info">
          <ProjectMeta page={page} locale={locale} />
          <ProjectTags tags={page.category?.split(',')} />
        </aside>

        <main className="project-details">
          <BlockRenderer blocks={page.blocks} locale={locale} />
        </main>
      </div>

      <RelatedProjects category={page.category} currentId={page.id} />
    </div>
  );
}
```

---

## Phase 6: Advanced Features

**Timeline:** Weeks 7-8
**Priority:** LOW (Post-MVP)

### Features

1. **Version History**
   - Track all changes to pages and blocks
   - Restore previous versions
   - Compare versions side-by-side

2. **Content Localization Workflows**
   - Translation status tracking
   - Highlight untranslated fields
   - Bulk translation helpers

3. **Content Scheduling**
   - Schedule publish/unpublish dates
   - Preview scheduled changes
   - Content calendar view

4. **Collaboration**
   - Multi-user editing
   - Comments on blocks
   - Approval workflows

5. **Blueprint Marketplace**
   - Import/export blueprints
   - Community blueprint library
   - Blueprint templates

---

## Technical Stack

### Frontend (CMS)
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Drag & Drop:** @hello-pangea/dnd
- **Forms:** React Hook Form
- **Rich Text:** TipTap or Lexical
- **State:** Zustand / React Query

### Backend
- **API:** Next.js API Routes
- **Database:** PostgreSQL (via Prisma)
- **File Storage:** Vercel Blob
- **GraphQL:** Apollo Server

### Frontend (Public Site)
- **Framework:** Next.js 15 (App Router)
- **Rendering:** SSR + ISR
- **Caching:** Redis (optional)

---

## Migration Strategy

### Data Migration Path

1. **Phase 1:** Add new fields to Page model ✅
2. **Phase 2:** Migrate existing PageBlocks to Blueprint system
   ```typescript
   // Migration script
   async function migrateBlocksToBlueprints() {
     const blocks = await prisma.pageBlock.findMany();

     for (const block of blocks) {
       // Find or create blueprint for this block type
       const blueprint = await findOrCreateBlueprint(block.type);

       // Create blueprint instance
       await prisma.blueprintInstance.create({
         data: {
           blueprintId: blueprint.id,
           pageId: block.pageId,
           data: block.data,
           order: block.order
         }
       });
     }
   }
   ```

3. **Phase 3:** Update frontend to use new blueprint rendering
4. **Phase 4:** Deprecate old PageBlock system

---

## Success Metrics

### Performance
- [ ] Page builder loads in < 2s
- [ ] Block drag-and-drop has < 100ms latency
- [ ] Frontend pages load in < 1s (SSR)

### Usability
- [ ] Create new page in < 30 seconds
- [ ] Add/configure block in < 15 seconds
- [ ] No training required for basic usage

### Features
- [ ] 20+ system blueprints available
- [ ] Support for custom blueprints
- [ ] Full bilingual support (EN/AR)
- [ ] Mobile-responsive editor

---

## Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Unified Content Model | Week 1 | ✅ COMPLETED |
| Phase 2: Blueprint System | Weeks 2-3 | 🔄 PENDING |
| Phase 3: Visual Block Composer | Week 4 | 🔄 PENDING |
| Phase 4: Content Hub | Week 5 | 🔄 PENDING |
| Phase 5: Dynamic Frontend | Week 6 | 🔄 PENDING |
| Phase 6: Advanced Features | Weeks 7-8 | 🔄 OPTIONAL |

**Total Timeline:** 6-8 weeks
**MVP Timeline:** 5 weeks (excludes Phase 6)

---

## Next Actions

1. ✅ Update Prisma schema with unified content model
2. 🔄 Run database migration when DB is available
3. 🔄 Create Blueprint models in schema
4. 🔄 Build Blueprint Builder UI
5. 🔄 Implement Visual Block Composer
6. 🔄 Create system blueprints library
7. 🔄 Update frontend routing for page types

---

## Questions & Decisions

### Open Questions
1. **Blueprint Storage:** Should blueprint definitions be in database or configuration files?
   - **Recommendation:** Database for user-created, config files for system blueprints

2. **Block Nesting:** Should blocks support nested blueprints (blocks within blocks)?
   - **Recommendation:** Yes, via `repeater` and `group` field types

3. **Preview Mode:** Real-time preview or separate preview page?
   - **Recommendation:** Both - inline preview + full-page preview

4. **Versioning:** Full version history or just recent changes?
   - **Recommendation:** Start with last 10 versions, expand later

### Technical Decisions
- ✅ Use Prisma for database ORM
- ✅ Use @hello-pangea/dnd for drag-and-drop
- ✅ Store block data as JSON in database
- ✅ Support bilingual content at field level
- 🔄 Choose rich text editor (TipTap vs Lexical)
- 🔄 Decide on real-time collaboration approach

---

## Resources

### Caisy.io Feature Analysis
- [Caisy Documentation](https://caisy.io/developer/docs)
- [Content Modeling Guide](https://caisy.io/developer/docs/external-api/content-modeling)
- [Blueprint System](https://caisy.io/developer/docs/external-api/blueprints)

### Technical References
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [DnD Kit Documentation](https://docs.dndkit.com/)

---

**Document Version:** 1.0
**Last Updated:** 2025-10-25
**Author:** Claude (AI Assistant)
**Status:** ACTIVE IMPLEMENTATION
