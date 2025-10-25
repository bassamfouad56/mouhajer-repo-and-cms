# Blueprint System - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Initialize the System

```bash
# Navigate to CMS directory
cd apps/cms

# Seed system blueprints (10 production-ready blueprints)
npx tsx scripts/seed-system-blueprints.ts

# Generate GraphQL schema
npx tsx scripts/generate-graphql-from-blueprints.ts

# Test the system (optional)
npx tsx scripts/test-blueprint-resolvers.ts
```

**Expected Output:**
```
✅ Seeded 10 blueprints
✅ Generated schema (10 types, 18 queries, 37 mutations)
✅ All tests passed (11/11)
```

### Step 2: Create Your First Blueprint

**Via UI:**

1. Navigate to `http://localhost:3000/blueprints`
2. Click "New Blueprint"
3. Fill in:
   - **Display Name:** "Team Member"
   - **Name:** TeamMember (auto-generated)
   - **Type:** COMPONENT
   - **Category:** content
4. Add fields from palette:
   - Click "Text" → name: `name`, label: "Name" (required)
   - Click "Text Area" → name: `bio`, label: "Biography" (bilingual)
   - Click "Image" → name: `photo`, label: "Photo"
   - Click "Text" → name: `role`, label: "Role" (bilingual)
5. Click "Create Blueprint"

**Time:** ~3 minutes

### Step 3: Generate Schema

```bash
npx tsx scripts/generate-graphql-from-blueprints.ts
```

**Output:**
```
✅ Generated TeamMember type
✅ Generated teammembers query
✅ Generated teammember query
✅ Generated createTeamMember mutation
✅ Generated updateTeamMember mutation
✅ Generated deleteTeamMember mutation
```

### Step 4: Use in GraphQL

**Create a team member:**
```graphql
mutation {
  createTeamMember(input: {
    name: "John Doe"
    bioEn: "Senior Interior Designer with 10 years of experience"
    bioAr: "مصمم داخلي كبير يتمتع بخبرة 10 سنوات"
    roleEn: "Lead Designer"
    roleAr: "مصمم رئيسي"
  }, locale: EN) {
    id
    name
    bioEn
    roleEn
  }
}
```

**Query team members:**
```graphql
query {
  teammembers(locale: EN, limit: 10) {
    id
    name
    bioEn
    roleEn
  }
}
```

---

## 📋 Common Tasks

### Create a New Blueprint

**1. Via UI (Recommended):**
- Go to `/blueprints/new`
- Fill form
- Add fields
- Save

**2. Via Database:**
```typescript
await prisma.contentBlueprint.create({
  data: {
    name: 'ProductCard',
    displayName: 'Product Card',
    description: 'Display products with image and details',
    blueprintType: 'COMPONENT',
    category: 'content',
    fields: [
      {
        id: 'title',
        name: 'title',
        label: { en: 'Title', ar: 'العنوان' },
        type: 'text',
        bilingual: true,
        required: true,
      },
      {
        id: 'price',
        name: 'price',
        label: { en: 'Price', ar: 'السعر' },
        type: 'number',
        required: true,
        validation: { min: 0 },
      },
      {
        id: 'image',
        name: 'image',
        label: { en: 'Image', ar: 'الصورة' },
        type: 'image',
        required: true,
      },
    ],
  },
});
```

### Build a Page with Components

**1. In Page Builder:**
```tsx
import VisualBlockComposer from '@/components/VisualBlockComposer';

function PageBuilder({ pageId }) {
  return (
    <VisualBlockComposer
      pageId={pageId}
      locale="EN"
      onSave={(instances) => {
        // Handle save
        console.log('Saved instances:', instances);
      }}
    />
  );
}
```

**2. Via API:**
```typescript
// Add component to page
const response = await fetch(`/api/pages/${pageId}/components`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    blueprintId: 'hero-banner-id',
    dataEn: {
      heading: 'Welcome to Our Studio',
      subheading: 'Creating beautiful spaces',
    },
    dataAr: {
      heading: 'مرحباً بكم في استوديونا',
      subheading: 'إنشاء مساحات جميلة',
    },
    order: 0,
    status: 'published',
  }),
});
```

### Query Content

**List all instances:**
```graphql
query {
  herobanners(locale: EN, limit: 10, filter: { status: "published" }) {
    id
    headingEn
    subheadingEn
    status
  }
}
```

**Get single instance:**
```graphql
query {
  herobanner(id: "abc123", locale: EN) {
    id
    headingEn
    headingAr
    subheadingEn
    subheadingAr
    backgroundImage {
      url
      alt
    }
  }
}
```

**Create instance:**
```graphql
mutation {
  createHeroBanner(input: {
    headingEn: "Transform Your Space"
    headingAr: "حوّل مساحتك"
    subheadingEn: "Expert interior design services"
    subheadingAr: "خدمات تصميم داخلي احترافية"
    alignment: "center"
  }, locale: EN) {
    id
    headingEn
  }
}
```

**Update instance:**
```graphql
mutation {
  updateHeroBanner(id: "abc123", input: {
    headingEn: "Updated Heading"
    status: "published"
  }, locale: EN) {
    id
    headingEn
    status
  }
}
```

---

## 🔧 Field Types Reference

### Basic Fields

| Type | Use Case | Example |
|------|----------|---------|
| `text` | Short text (1 line) | Name, Title, Label |
| `textarea` | Long text (multi-line) | Description, Bio |
| `rich_text` | Formatted content | Blog content, About |
| `number` | Numeric values | Price, Quantity, Rating |
| `boolean` | Yes/No toggles | Featured, Active, Enabled |
| `select` | Dropdown options | Category, Status, Type |
| `date` | Date picker | Published Date, Event Date |
| `datetime` | Date + Time | Scheduled Time |
| `color` | Color picker | Brand Color, Background |
| `url` | Website URL | Link, Website |
| `email` | Email address | Contact Email |

### Media Fields

| Type | Use Case | Example |
|------|----------|---------|
| `image` | Single image | Hero Image, Avatar |
| `gallery` | Multiple images | Product Photos, Portfolio |
| `file` | File upload | PDF, Document |
| `video` | Video upload | Tutorial, Demo |
| `asset` | Generic asset | Any media type |

### Advanced Fields

| Type | Use Case | Example |
|------|----------|---------|
| `repeater` | Repeating groups | Testimonials, Features |
| `group` | Field grouping | Address, Contact Info |
| `relationship` | Link to content | Related Products, Author |
| `json` | Raw JSON data | Config, Metadata |

---

## 🎨 Blueprint Examples

### Blog Post Blueprint

```typescript
{
  name: 'BlogPost',
  displayName: 'Blog Post',
  blueprintType: 'DOCUMENT',
  category: 'content',
  fields: [
    {
      name: 'title',
      label: { en: 'Title', ar: 'العنوان' },
      type: 'text',
      bilingual: true,
      required: true,
      validation: { maxLength: 100 },
    },
    {
      name: 'slug',
      label: { en: 'URL Slug', ar: 'الرابط' },
      type: 'text',
      required: true,
      validation: { pattern: '^[a-z0-9-]+$' },
    },
    {
      name: 'excerpt',
      label: { en: 'Excerpt', ar: 'المقتطف' },
      type: 'textarea',
      bilingual: true,
      validation: { maxLength: 200 },
    },
    {
      name: 'content',
      label: { en: 'Content', ar: 'المحتوى' },
      type: 'rich_text',
      bilingual: true,
      required: true,
    },
    {
      name: 'featuredImage',
      label: { en: 'Featured Image', ar: 'الصورة المميزة' },
      type: 'image',
      required: true,
    },
    {
      name: 'publishedAt',
      label: { en: 'Publish Date', ar: 'تاريخ النشر' },
      type: 'datetime',
      required: true,
    },
  ],
}
```

### Product Card Blueprint

```typescript
{
  name: 'ProductCard',
  displayName: 'Product Card',
  blueprintType: 'COMPONENT',
  category: 'content',
  fields: [
    {
      name: 'name',
      label: { en: 'Product Name', ar: 'اسم المنتج' },
      type: 'text',
      bilingual: true,
      required: true,
    },
    {
      name: 'description',
      label: { en: 'Description', ar: 'الوصف' },
      type: 'textarea',
      bilingual: true,
    },
    {
      name: 'price',
      label: { en: 'Price', ar: 'السعر' },
      type: 'number',
      required: true,
      validation: { min: 0 },
    },
    {
      name: 'image',
      label: { en: 'Product Image', ar: 'صورة المنتج' },
      type: 'image',
      required: true,
    },
    {
      name: 'inStock',
      label: { en: 'In Stock', ar: 'متوفر' },
      type: 'boolean',
      defaultValue: true,
    },
  ],
}
```

### Testimonial Blueprint

```typescript
{
  name: 'Testimonial',
  displayName: 'Testimonial',
  blueprintType: 'COMPONENT',
  category: 'content',
  fields: [
    {
      name: 'author',
      label: { en: 'Author Name', ar: 'اسم المؤلف' },
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: { en: 'Role/Title', ar: 'المنصب' },
      type: 'text',
      bilingual: true,
    },
    {
      name: 'quote',
      label: { en: 'Quote', ar: 'الاقتباس' },
      type: 'textarea',
      bilingual: true,
      required: true,
      validation: { maxLength: 300 },
    },
    {
      name: 'photo',
      label: { en: 'Photo', ar: 'الصورة' },
      type: 'image',
    },
    {
      name: 'rating',
      label: { en: 'Rating', ar: 'التقييم' },
      type: 'number',
      validation: { min: 1, max: 5 },
    },
  ],
}
```

---

## 🔍 GraphQL Patterns

### Pagination

```graphql
query {
  herobanners(
    locale: EN
    limit: 10
    offset: 0
    orderBy: "createdAt:DESC"
  ) {
    id
    headingEn
    createdAt
  }
}
```

### Filtering

```graphql
query {
  herobanners(
    locale: EN
    filter: {
      status: "published"
      dateFrom: "2025-01-01"
      dateTo: "2025-12-31"
    }
  ) {
    id
    headingEn
    status
    publishedAt
  }
}
```

### Bilingual Queries

**English content:**
```graphql
query {
  herobanner(id: "abc123", locale: EN) {
    headingEn
    subheadingEn
  }
}
```

**Arabic content:**
```graphql
query {
  herobanner(id: "abc123", locale: AR) {
    headingAr
    subheadingAr
  }
}
```

---

## 🚨 Troubleshooting

### Schema Not Generated

**Problem:** GraphQL queries return errors
**Solution:**
```bash
npx tsx scripts/generate-graphql-from-blueprints.ts
# Then restart dev server
```

### Fields Not Rendering

**Problem:** DynamicFormRenderer shows "Unsupported field type"
**Check:**
1. Field type is in FIELD_TYPES array
2. Field type spelling is correct
3. Component handles that field type

### Components Not Saving

**Problem:** "Save All" doesn't persist changes
**Check:**
1. API endpoint `/api/pages/[id]/components` exists
2. Page ID is valid
3. Blueprint instances have required data
4. Check browser console for errors

### Bilingual Fields Empty

**Problem:** Arabic content not showing
**Check:**
1. Field has `bilingual: true`
2. Both `en` and `ar` labels defined
3. Correct locale passed to DynamicFormRenderer
4. Data structure: `{ en: "...", ar: "..." }`

---

## 📚 Additional Resources

### Documentation
- [PHASE_1_COMPLETE_SUMMARY.md](./PHASE_1_COMPLETE_SUMMARY.md) - Database schema
- [PHASE_2_COMPLETE.md](./PHASE_2_COMPLETE.md) - GraphQL system
- [PHASE_3_COMPLETE.md](./PHASE_3_COMPLETE.md) - UI components
- [BLUEPRINT_SYSTEM_IMPLEMENTATION_COMPLETE.md](./BLUEPRINT_SYSTEM_IMPLEMENTATION_COMPLETE.md) - Full reference

### Scripts
- `scripts/seed-system-blueprints.ts` - Seed blueprints
- `scripts/generate-graphql-from-blueprints.ts` - Generate schema
- `scripts/test-blueprint-resolvers.ts` - Run tests

### Key Components
- `components/DynamicFormRenderer.tsx` - Form renderer
- `components/VisualBlockComposer.tsx` - Page builder
- `app/blueprints/` - Blueprint management UI

### API Routes
- `/api/blueprints` - Blueprint CRUD
- `/api/pages/[id]/components` - Component management

---

## 🎯 Next Steps

1. **Explore Blueprints:** Visit `/blueprints` to see system blueprints
2. **Create Custom Blueprint:** Build your first custom content type
3. **Build a Page:** Use Visual Block Composer to compose a page
4. **Query Content:** Use GraphQL to fetch content
5. **Customize:** Extend field types, add validation, customize UI

---

**Quick Links:**
- Blueprint Management: `http://localhost:3000/blueprints`
- GraphQL Playground: `http://localhost:3000/api/graphql`
- Documentation: See files above

**Need Help?**
- Check [BLUEPRINT_SYSTEM_IMPLEMENTATION_COMPLETE.md](./BLUEPRINT_SYSTEM_IMPLEMENTATION_COMPLETE.md)
- Review test scripts for examples
- Inspect generated GraphQL schema in `src/graphql/generated/blueprints.graphql`

---

**Version:** 1.0.0
**Last Updated:** October 25, 2025
**Status:** ✅ Production Ready
