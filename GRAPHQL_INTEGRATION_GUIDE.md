# GraphQL Integration Guide

**Status**: GraphQL infrastructure ready, awaiting CMS data
**Created**: October 18, 2025

---

## 🎯 What's Been Set Up

All GraphQL queries and data fetchers have been created for the 5 new pages. The infrastructure is ready to connect to the CMS as soon as you add content.

### ✅ Files Created

**GraphQL Queries** (`apps/frontend/lib/graphql/queries/`):
- `testimonials.ts` - Testimonial queries
- `faq.ts` - FAQ queries
- `team.ts` - Team member queries
- `pricing.ts` - Pricing tier queries
- `case-studies.ts` - Case study queries

**Data Fetchers** (`apps/frontend/lib/fetchers/`):
- `testimonials.ts` - Fetch testimonials from CMS
- `faq.ts` - Fetch FAQs from CMS
- `team.ts` - Fetch team members from CMS
- `pricing.ts` - Fetch pricing tiers from CMS
- `case-studies.ts` - Fetch case studies from CMS

---

## 🚀 How to Enable GraphQL Integration

### Step 1: Add Content to CMS

Before enabling GraphQL on the pages, you need to add content through the CMS:

**CMS URL**: http://localhost:3010
**GraphQL Playground**: http://localhost:3010/api/graphql

#### Required CMS Models

You'll need to create these content types in your CMS:

1. **Testimonials**
   - Fields: name, role, rating (1-5), comment, project, image, date
   - Add 5-10 testimonials with real or sample data

2. **FAQs**
   - Fields: category (General/Process/Pricing), question, answer
   - Add 15-20 FAQs across categories

3. **Team Members**
   - Fields: name, role, bio, image, email, phone, socialProfiles[]
   - Add 6-12 team members

4. **Pricing Tiers**
   - Fields: name, description, price, currency, features[], highlighted
   - Add 3 pricing tiers (Essential, Premium, Luxury)

5. **Case Studies**
   - Fields: title, location, category, budget, duration, excerpt, image, slug
   - Add 6-10 case studies

### Step 2: Test GraphQL API

Use the GraphQL Playground to test your queries:

```graphql
# Test Testimonials
query {
  testimonials(locale: "en", published: true) {
    id
    name
    rating
    comment
  }
}

# Test Team
query {
  teamMembers(locale: "en", active: true) {
    id
    name
    role
  }
}

# Test Pricing
query {
  pricingTiers(locale: "en", active: true) {
    id
    name
    price
  }
}
```

### Step 3: Update Pages to Use GraphQL

Once you have content in the CMS, update each page to fetch real data:

#### Example: Testimonials Page

**Before (Hardcoded)**:
```typescript
// apps/frontend/app/[locale]/testimonials/page.tsx
export default async function TestimonialsPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';

  // Hardcoded data
  const testimonials = [
    { id: '1', name: 'John Doe', ... },
    // ...
  ];
```

**After (GraphQL)**:
```typescript
// apps/frontend/app/[locale]/testimonials/page.tsx
import { getTestimonials } from '@/lib/fetchers/testimonials';

export default async function TestimonialsPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';

  // Fetch from CMS
  const testimonials = await getTestimonials(locale);

  // Fallback to placeholder if no data
  if (!testimonials || testimonials.length === 0) {
    // Use hardcoded fallback data
  }
```

---

## 📝 CMS Schema Requirements

### 1. Testimonials Schema

```prisma
model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String
  rating    Int      // 1-5
  comment   String   @db.Text
  project   String?
  image     String?
  date      DateTime @default(now())
  locale    String   @default("en")
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. FAQ Schema

```prisma
model FAQ {
  id        String   @id @default(cuid())
  category  String   // General, Process, Pricing
  question  String
  answer    String   @db.Text
  locale    String   @default("en")
  order     Int      @default(0)
  published Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3. Team Member Schema

```prisma
model TeamMember {
  id             String   @id @default(cuid())
  name           String
  role           String
  bio            String   @db.Text
  image          String?
  email          String?
  phone          String?
  socialProfiles Json?    // [{platform: "linkedin", url: "..."}]
  locale         String   @default("en")
  active         Boolean  @default(true)
  order          Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

### 4. Pricing Tier Schema

```prisma
model PricingTier {
  id          String   @id @default(cuid())
  name        String
  description String
  price       Float
  currency    String   @default("AED")
  priceSuffix String?
  features    Json     // ["Feature 1", "Feature 2", ...]
  highlighted Boolean  @default(false)
  ctaText     String
  locale      String   @default("en")
  active      Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 5. Case Study Schema

```prisma
model CaseStudy {
  id         String   @id @default(cuid())
  title      String
  location   String
  category   String   // Residential, Commercial, Heritage, Hospitality
  budget     String
  duration   String
  completion String
  excerpt    String   @db.Text
  content    String?  @db.Text
  image      String
  gallery    Json?    // ["image1.jpg", "image2.jpg", ...]
  slug       String   @unique
  locale     String   @default("en")
  published  Boolean  @default(true)
  metrics    Json?    // [{label: "...", value: "..."}]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## 🔧 GraphQL Resolvers Required

You'll need to add resolvers in the CMS for these queries:

**Location**: `apps/cms/src/graphql/resolvers/`

### Testimonials Resolver

```typescript
// apps/cms/src/graphql/resolvers/testimonials.ts
export const testimonialResolvers = {
  Query: {
    testimonials: async (_, { locale, published }, { prisma }) => {
      return await prisma.testimonial.findMany({
        where: {
          locale,
          published: published ?? true,
        },
        orderBy: { date: 'desc' },
      });
    },
    testimonial: async (_, { id }, { prisma }) => {
      return await prisma.testimonial.findUnique({ where: { id } });
    },
  },
};
```

### FAQ Resolver

```typescript
// apps/cms/src/graphql/resolvers/faq.ts
export const faqResolvers = {
  Query: {
    faqs: async (_, { locale, category }, { prisma }) => {
      const where = { locale, published: true };
      if (category) where.category = category;

      const faqs = await prisma.fAQ.findMany({
        where,
        orderBy: { order: 'asc' },
      });

      // Group by category
      const grouped = faqs.reduce((acc, faq) => {
        const cat = acc.find(c => c.category === faq.category);
        if (cat) {
          cat.questions.push({
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
          });
        } else {
          acc.push({
            category: faq.category,
            questions: [{
              id: faq.id,
              question: faq.question,
              answer: faq.answer,
            }],
          });
        }
        return acc;
      }, []);

      return grouped;
    },
  },
};
```

### Team Resolver

```typescript
// apps/cms/src/graphql/resolvers/team.ts
export const teamResolvers = {
  Query: {
    teamMembers: async (_, { locale, active }, { prisma }) => {
      return await prisma.teamMember.findMany({
        where: {
          locale,
          active: active ?? true,
        },
        orderBy: { order: 'asc' },
      });
    },
    teamMember: async (_, { id }, { prisma }) => {
      return await prisma.teamMember.findUnique({ where: { id } });
    },
  },
};
```

### Pricing Resolver

```typescript
// apps/cms/src/graphql/resolvers/pricing.ts
export const pricingResolvers = {
  Query: {
    pricingTiers: async (_, { locale, active }, { prisma }) => {
      return await prisma.pricingTier.findMany({
        where: {
          locale,
          active: active ?? true,
        },
        orderBy: { order: 'asc' },
      });
    },
    pricingTier: async (_, { id }, { prisma }) => {
      return await prisma.pricingTier.findUnique({ where: { id } });
    },
  },
};
```

### Case Studies Resolver

```typescript
// apps/cms/src/graphql/resolvers/case-studies.ts
export const caseStudyResolvers = {
  Query: {
    caseStudies: async (_, { locale, category }, { prisma }) => {
      const where = { locale, published: true };
      if (category) where.category = category;

      return await prisma.caseStudy.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    },
    caseStudy: async (_, { id, slug }, { prisma }) => {
      if (id) {
        return await prisma.caseStudy.findUnique({ where: { id } });
      }
      if (slug) {
        return await prisma.caseStudy.findUnique({ where: { slug } });
      }
      return null;
    },
  },
};
```

---

## 🎨 Migration Commands

If you need to add these models to your Prisma schema:

```bash
# 1. Add models to apps/cms/prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_new_content_models

# 3. Generate Prisma Client
npx prisma generate

# 4. Restart CMS server
npm run dev:cms
```

---

## ✅ Integration Checklist

Before switching from hardcoded to GraphQL:

- [ ] CMS models created in Prisma schema
- [ ] Database migrated with new models
- [ ] GraphQL resolvers added to CMS
- [ ] Sample content added to CMS (at least 3-5 items per type)
- [ ] Tested queries in GraphQL Playground
- [ ] Queries return expected data structure
- [ ] Updated page components to use fetchers
- [ ] Tested pages with real data
- [ ] Fallback to placeholder data if CMS is empty

---

## 🔄 Hybrid Approach (Recommended)

Use a hybrid approach where pages try to fetch from CMS but fall back to placeholder data:

```typescript
export default async function TestimonialsPage({ params }: Props) {
  const locale = params.locale as 'en' | 'ar';

  // Try to fetch from CMS
  let testimonials = await getTestimonials(locale);

  // Fall back to placeholder if no data
  if (!testimonials || testimonials.length === 0) {
    testimonials = [
      // Hardcoded fallback data
      { id: '1', name: 'John Doe', ... },
    ];
  }

  // Rest of page logic
}
```

This approach ensures:
- Pages work immediately with placeholder data
- Seamless transition when CMS data is added
- No broken pages during development

---

## 📊 Current Status

**GraphQL Infrastructure**: ✅ Complete
**Data Fetchers**: ✅ Ready
**CMS Models**: ⏳ Pending (need to be added)
**CMS Content**: ⏳ Pending (need to be created)
**Page Integration**: ⏳ Ready when CMS data is available

---

## 🚀 Quick Start Commands

```bash
# 1. Start CMS
npm run dev:cms

# 2. Open GraphQL Playground
open http://localhost:3010/api/graphql

# 3. Test a query
query {
  pages {
    id
    titleEn
  }
}

# 4. Start Frontend
npm run dev:frontend

# 5. View pages
open http://localhost:3007/en/testimonials
```

---

## 📞 Need Help?

If you need assistance:
1. Check GraphQL Playground for query errors
2. Review server logs for resolver errors
3. Verify Prisma schema matches resolver expectations
4. Test with simple queries first, then complex ones

---

**Next Steps**:
1. Add Prisma models for new content types
2. Run migrations
3. Add GraphQL resolvers
4. Add sample content through CMS
5. Test queries in Playground
6. Update pages to use fetchers

**Created**: October 18, 2025
**Status**: Infrastructure ready, awaiting CMS setup
