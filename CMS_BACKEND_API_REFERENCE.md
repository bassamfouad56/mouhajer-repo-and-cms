# CMS Backend API Reference

## Overview

Complete GraphQL API documentation for the Mouhajer CMS backend. This document covers all 5 content types integrated in Phase 1, authentication requirements, sample queries, and frontend integration guidelines.

**API Endpoint**: `http://localhost:3010/api/graphql`
**GraphQL Playground**: `http://localhost:3010/api/graphql` (GET request in browser)

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Content Types Overview](#content-types-overview)
3. [Testimonials API](#testimonials-api)
4. [FAQs API](#faqs-api)
5. [Team Members API](#team-members-api)
6. [Pricing Plans API](#pricing-plans-api)
7. [Case Studies API](#case-studies-api)
8. [Testing Guide](#testing-guide)
9. [Frontend Integration](#frontend-integration)
10. [Database Schema](#database-schema)

---

## Authentication & Authorization

### Role-Based Access Control

All mutations (create, update, delete) require authentication with appropriate roles:

- **Admin Role**: Full access (create, update, delete)
- **Editor Role**: Create and update access only
- **Viewer/Unauthenticated**: Read-only access to queries

### Authentication Pattern

```typescript
// All mutations check for user authentication
if (!user) {
  throw new GraphQLError('Unauthorized - Please log in', {
    extensions: { code: 'UNAUTHORIZED' },
  });
}

// Delete operations require admin role
if (user.role !== 'admin') {
  throw new GraphQLError('Forbidden - Admin access required', {
    extensions: { code: 'FORBIDDEN' },
  });
}

// Create/Update operations require admin or editor role
if (user.role !== 'admin' && user.role !== 'editor') {
  throw new GraphQLError('Forbidden - Admin or Editor access required', {
    extensions: { code: 'FORBIDDEN' },
  });
}
```

---

## Content Types Overview

| Content Type | Total Records | Bilingual | Featured Support | Published Support |
|--------------|---------------|-----------|------------------|-------------------|
| Testimonials | 5 | ✅ | ✅ | ✅ |
| FAQs | 14 | ✅ | ❌ | ✅ |
| Team Members | 8 | ✅ | ✅ | ✅ |
| Pricing Plans | 4 | ✅ | ✅ | ✅ |
| Case Studies | 5 | ✅ | ✅ | ✅ |
| **Total** | **36** | - | - | - |

---

## Testimonials API

### Queries

#### Get All Testimonials

```graphql
query GetTestimonials($filter: TestimonialFilterInput, $limit: Int, $offset: Int) {
  testimonials(filter: $filter, limit: $limit, offset: $offset) {
    id
    nameEn
    nameAr
    roleEn
    roleAr
    companyEn
    companyAr
    testimonialEn
    testimonialAr
    rating
    projectType
    avatarUrl
    locale
    featured
    published
    createdAt
  }
}
```

**Variables:**
```json
{
  "filter": {
    "locale": "en",
    "projectType": "residential",
    "featured": true,
    "published": true
  },
  "limit": 10,
  "offset": 0
}
```

#### Get Single Testimonial

```graphql
query GetTestimonial($id: ID!) {
  testimonial(id: $id) {
    id
    nameEn
    nameAr
    testimonialEn
    testimonialAr
    rating
    featured
  }
}
```

#### Get Testimonials Count

```graphql
query GetTestimonialsCount($filter: TestimonialFilterInput) {
  testimonialsCount(filter: $filter)
}
```

#### Get Testimonials by Project Type

```graphql
query GetTestimonialsByProjectType($projectType: String!, $locale: String) {
  testimonialsByProjectType(projectType: $projectType, locale: $locale) {
    id
    nameEn
    testimonialEn
    rating
    projectType
  }
}
```

### Mutations

#### Create Testimonial (Admin/Editor)

```graphql
mutation CreateTestimonial($input: CreateTestimonialInput!) {
  createTestimonial(input: $input) {
    id
    nameEn
    testimonialEn
    rating
  }
}
```

**Variables:**
```json
{
  "input": {
    "nameEn": "John Smith",
    "nameAr": "جون سميث",
    "roleEn": "CEO",
    "roleAr": "الرئيس التنفيذي",
    "companyEn": "Tech Corp",
    "companyAr": "تك كورب",
    "testimonialEn": "Excellent service!",
    "testimonialAr": "خدمة ممتازة!",
    "rating": 5,
    "projectType": "commercial",
    "locale": "en",
    "featured": true,
    "published": true
  }
}
```

#### Update Testimonial (Admin/Editor)

```graphql
mutation UpdateTestimonial($id: ID!, $input: UpdateTestimonialInput!) {
  updateTestimonial(id: $id, input: $input) {
    id
    nameEn
    rating
    updatedAt
  }
}
```

#### Delete Testimonial (Admin Only)

```graphql
mutation DeleteTestimonial($id: ID!) {
  deleteTestimonial(id: $id)
}
```

---

## FAQs API

### Queries

#### Get All FAQs

```graphql
query GetFAQs($filter: FAQFilterInput, $limit: Int, $offset: Int) {
  faqs(filter: $filter, limit: $limit, offset: $offset) {
    id
    questionEn
    questionAr
    answerEn
    answerAr
    category
    order
    locale
    published
    createdAt
  }
}
```

**Filter Options:**
```json
{
  "filter": {
    "locale": "en",
    "category": "general",
    "published": true
  }
}
```

**Available Categories:**
- `general`
- `services`
- `pricing`
- `process`
- `technical`

#### Get FAQs by Category

```graphql
query GetFAQsByCategory($category: String!, $locale: String) {
  faqsByCategory(category: $category, locale: $locale) {
    id
    questionEn
    answerEn
    order
  }
}
```

#### Get FAQs Count

```graphql
query GetFAQsCount($filter: FAQFilterInput) {
  faqsCount(filter: $filter)
}
```

### Mutations

#### Create FAQ (Admin/Editor)

```graphql
mutation CreateFAQ($input: CreateFAQInput!) {
  createFAQ(input: $input) {
    id
    questionEn
    answerEn
    category
  }
}
```

**Variables:**
```json
{
  "input": {
    "questionEn": "What are your working hours?",
    "questionAr": "ما هي ساعات العمل؟",
    "answerEn": "We work Monday to Friday, 9 AM to 6 PM.",
    "answerAr": "نعمل من الاثنين إلى الجمعة، من 9 صباحًا إلى 6 مساءً.",
    "category": "general",
    "order": 1,
    "locale": "en",
    "published": true
  }
}
```

#### Update FAQ (Admin/Editor)

```graphql
mutation UpdateFAQ($id: ID!, $input: UpdateFAQInput!) {
  updateFAQ(id: $id, input: $input) {
    id
    questionEn
    updatedAt
  }
}
```

#### Delete FAQ (Admin Only)

```graphql
mutation DeleteFAQ($id: ID!) {
  deleteFAQ(id: $id)
}
```

---

## Team Members API

### Queries

#### Get All Team Members

```graphql
query GetTeamMembers($filter: TeamMemberFilterInput, $limit: Int, $offset: Int) {
  teamMembers(filter: $filter, limit: $limit, offset: $offset) {
    id
    nameEn
    nameAr
    roleEn
    roleAr
    bioEn
    bioAr
    specialties
    yearsExperience
    department
    profileImage
    email
    linkedin
    order
    locale
    featured
    published
    joinedAt
    createdAt
  }
}
```

**Filter Options:**
```json
{
  "filter": {
    "locale": "en",
    "department": "design",
    "featured": true,
    "published": true
  }
}
```

**Available Departments:**
- `design`
- `architecture`
- `visualization`
- `project-management`
- `sustainability`
- `technical`

#### Get Team Members by Department

```graphql
query GetTeamMembersByDepartment($department: String!, $locale: String) {
  teamMembersByDepartment(department: $department, locale: $locale) {
    id
    nameEn
    roleEn
    department
    specialties
    yearsExperience
    profileImage
  }
}
```

#### Get Team Members Count

```graphql
query GetTeamMembersCount($filter: TeamMemberFilterInput) {
  teamMembersCount(filter: $filter)
}
```

#### Get Single Team Member

```graphql
query GetTeamMember($id: ID!) {
  teamMember(id: $id) {
    id
    nameEn
    nameAr
    roleEn
    roleAr
    bioEn
    bioAr
    specialties
    yearsExperience
    department
    email
    linkedin
  }
}
```

### Mutations

#### Create Team Member (Admin/Editor)

```graphql
mutation CreateTeamMember($input: CreateTeamMemberInput!) {
  createTeamMember(input: $input) {
    id
    nameEn
    roleEn
    department
  }
}
```

**Variables:**
```json
{
  "input": {
    "nameEn": "Sarah Johnson",
    "nameAr": "سارة جونسون",
    "roleEn": "Senior Designer",
    "roleAr": "مصممة أولى",
    "bioEn": "Passionate about modern interior design with 10+ years experience.",
    "bioAr": "شغوفة بالتصميم الداخلي الحديث مع خبرة تزيد عن 10 سنوات.",
    "specialties": ["Residential", "Modern", "Minimalist"],
    "yearsExperience": 10,
    "department": "design",
    "email": "sarah@example.com",
    "linkedin": "https://linkedin.com/in/sarah-johnson",
    "order": 1,
    "locale": "en",
    "featured": true,
    "published": true
  }
}
```

#### Update Team Member (Admin/Editor)

```graphql
mutation UpdateTeamMember($id: ID!, $input: UpdateTeamMemberInput!) {
  updateTeamMember(id: $id, input: $input) {
    id
    nameEn
    roleEn
    updatedAt
  }
}
```

#### Delete Team Member (Admin Only)

```graphql
mutation DeleteTeamMember($id: ID!) {
  deleteTeamMember(id: $id)
}
```

---

## Pricing Plans API

### Queries

#### Get All Pricing Plans

```graphql
query GetPricingPlans($filter: PricingPlanFilterInput, $limit: Int, $offset: Int) {
  pricingPlans(filter: $filter, limit: $limit, offset: $offset) {
    id
    nameEn
    nameAr
    descriptionEn
    descriptionAr
    price
    currency
    pricingModel
    tier
    popular
    recommended
    featuresEn
    featuresAr
    includedServices
    order
    locale
    featured
    published
    createdAt
  }
}
```

**Filter Options:**
```json
{
  "filter": {
    "locale": "en",
    "tier": "professional",
    "featured": true,
    "published": true
  }
}
```

**Available Tiers:**
- `basic`
- `professional`
- `premium`
- `enterprise`

**Pricing Models:**
- `fixed` - One-time fixed price
- `hourly` - Hourly rate
- `monthly` - Monthly subscription
- `custom` - Custom pricing (contact for quote)

#### Get Pricing Plans by Tier

```graphql
query GetPricingPlansByTier($tier: String!, $locale: String) {
  pricingPlansByTier(tier: $tier, locale: $locale) {
    id
    nameEn
    price
    currency
    featuresEn
    popular
    recommended
  }
}
```

#### Get Pricing Plans Count

```graphql
query GetPricingPlansCount($filter: PricingPlanFilterInput) {
  pricingPlansCount(filter: $filter)
}
```

#### Get Single Pricing Plan

```graphql
query GetPricingPlan($id: ID!) {
  pricingPlan(id: $id) {
    id
    nameEn
    nameAr
    descriptionEn
    descriptionAr
    price
    currency
    tier
    featuresEn
    featuresAr
    includedServices
  }
}
```

### Mutations

#### Create Pricing Plan (Admin/Editor)

```graphql
mutation CreatePricingPlan($input: CreatePricingPlanInput!) {
  createPricingPlan(input: $input) {
    id
    nameEn
    price
    tier
  }
}
```

**Variables:**
```json
{
  "input": {
    "nameEn": "Starter Package",
    "nameAr": "باقة المبتدئين",
    "descriptionEn": "Perfect for small projects",
    "descriptionAr": "مثالي للمشاريع الصغيرة",
    "price": 10000,
    "currency": "AED",
    "pricingModel": "fixed",
    "tier": "basic",
    "popular": false,
    "recommended": false,
    "featuresEn": ["Initial consultation", "2D floor plans", "Basic 3D visualization"],
    "featuresAr": ["استشارة أولية", "مخططات 2D", "تصور 3D أساسي"],
    "includedServices": ["consultation", "floor-plans"],
    "order": 1,
    "locale": "en",
    "featured": false,
    "published": true
  }
}
```

#### Update Pricing Plan (Admin/Editor)

```graphql
mutation UpdatePricingPlan($id: ID!, $input: UpdatePricingPlanInput!) {
  updatePricingPlan(id: $id, input: $input) {
    id
    nameEn
    price
    updatedAt
  }
}
```

#### Delete Pricing Plan (Admin Only)

```graphql
mutation DeletePricingPlan($id: ID!) {
  deletePricingPlan(id: $id)
}
```

---

## Case Studies API

### Queries

#### Get All Case Studies

```graphql
query GetCaseStudies($filter: CaseStudyFilterInput, $limit: Int, $offset: Int) {
  caseStudies(filter: $filter, limit: $limit, offset: $offset) {
    id
    titleEn
    titleAr
    summaryEn
    summaryAr
    clientName
    clientType
    showClientName
    projectType
    location
    projectSize
    completionDate
    duration
    challengeEn
    challengeAr
    solutionEn
    solutionAr
    resultsEn
    resultsAr
    heroImage
    beforeImages
    afterImages
    gallery
    videoUrl
    features
    stylesTags
    budget
    budgetSaved
    timelineMet
    clientSatisfaction
    teamMembers
    contractors
    keywords
    tags
    order
    locale
    featured
    published
    createdAt
  }
}
```

**Filter Options:**
```json
{
  "filter": {
    "locale": "en",
    "projectType": "residential",
    "featured": true,
    "published": true
  }
}
```

**Available Project Types:**
- `residential`
- `commercial`
- `office`
- `hospitality`
- `retail`
- `healthcare`
- `education`
- `heritage`

#### Get Case Studies by Project Type

```graphql
query GetCaseStudiesByProjectType($projectType: String!, $locale: String) {
  caseStudiesByProjectType(projectType: $projectType, locale: $locale) {
    id
    titleEn
    summaryEn
    projectType
    location
    completionDate
    heroImage
    beforeImages
    afterImages
    features
    clientSatisfaction
  }
}
```

#### Get Case Studies Count

```graphql
query GetCaseStudiesCount($filter: CaseStudyFilterInput) {
  caseStudiesCount(filter: $filter)
}
```

#### Get Single Case Study

```graphql
query GetCaseStudy($id: ID!) {
  caseStudy(id: $id) {
    id
    titleEn
    titleAr
    summaryEn
    summaryAr
    challengeEn
    solutionEn
    resultsEn
    heroImage
    beforeImages
    afterImages
    gallery
    features
    budget
    budgetSaved
    clientSatisfaction
  }
}
```

### Mutations

#### Create Case Study (Admin/Editor)

```graphql
mutation CreateCaseStudy($input: CreateCaseStudyInput!) {
  createCaseStudy(input: $input) {
    id
    titleEn
    projectType
    location
  }
}
```

**Variables:**
```json
{
  "input": {
    "titleEn": "Modern Villa Transformation",
    "titleAr": "تحويل فيلا عصرية",
    "summaryEn": "Complete renovation of a luxury villa",
    "summaryAr": "تجديد كامل لفيلا فاخرة",
    "clientName": "Private Client",
    "clientType": "Individual",
    "showClientName": false,
    "projectType": "residential",
    "location": "Dubai Hills Estate",
    "projectSize": "5000 sqft",
    "completionDate": "2024-06-15T00:00:00Z",
    "duration": "6 months",
    "challengeEn": "Outdated interior with structural limitations",
    "challengeAr": "تصميم داخلي قديم مع قيود هيكلية",
    "solutionEn": "Modern open-plan design with smart home integration",
    "solutionAr": "تصميم عصري مفتوح مع تكامل المنزل الذكي",
    "resultsEn": "Transformed space exceeding client expectations",
    "resultsAr": "مساحة محولة تفوق توقعات العميل",
    "features": ["Smart home", "Open plan", "Sustainable materials"],
    "stylesTags": ["Modern", "Minimalist", "Eco-friendly"],
    "budget": 500000,
    "budgetSaved": 50000,
    "timelineMet": true,
    "clientSatisfaction": 5,
    "keywords": ["villa", "renovation", "luxury"],
    "tags": ["featured", "award-winner"],
    "order": 1,
    "locale": "en",
    "featured": true,
    "published": true
  }
}
```

#### Update Case Study (Admin/Editor)

```graphql
mutation UpdateCaseStudy($id: ID!, $input: UpdateCaseStudyInput!) {
  updateCaseStudy(id: $id, input: $input) {
    id
    titleEn
    projectType
    updatedAt
  }
}
```

#### Delete Case Study (Admin Only)

```graphql
mutation DeleteCaseStudy($id: ID!) {
  deleteCaseStudy(id: $id)
}
```

---

## Testing Guide

### Using cURL

#### Get All Content Types Count

```bash
curl -X POST http://localhost:3010/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { testimonialsCount pricingPlansCount faqsCount teamMembersCount caseStudiesCount }"
  }'
```

**Expected Response:**
```json
{
  "data": {
    "testimonialsCount": 5,
    "pricingPlansCount": 4,
    "faqsCount": 14,
    "teamMembersCount": 8,
    "caseStudiesCount": 5
  }
}
```

#### Get Featured Team Members

```bash
curl -X POST http://localhost:3010/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { teamMembers(filter: { featured: true, locale: \"en\" }) { nameEn roleEn department } }"
  }'
```

#### Get Pricing Plans by Tier

```bash
curl -X POST http://localhost:3010/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { pricingPlansByTier(tier: \"professional\", locale: \"en\") { nameEn price currency featuresEn } }"
  }'
```

#### Get Case Studies by Project Type

```bash
curl -X POST http://localhost:3010/api/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { caseStudiesByProjectType(projectType: \"residential\", locale: \"en\") { titleEn location completionDate } }"
  }'
```

### Using GraphQL Playground

1. Open browser to `http://localhost:3010/api/graphql`
2. Apollo Sandbox will load automatically
3. Use the Explorer panel to build queries visually
4. Test queries with variables in the Variables panel

### Common Test Scenarios

#### Scenario 1: Homepage Featured Content

```graphql
query GetHomepageContent {
  testimonials(filter: { featured: true, published: true, locale: "en" }, limit: 3) {
    nameEn
    testimonialEn
    rating
    companyEn
  }

  teamMembers(filter: { featured: true, published: true, locale: "en" }, limit: 4) {
    nameEn
    roleEn
    profileImage
  }

  caseStudies(filter: { featured: true, published: true, locale: "en" }, limit: 3) {
    titleEn
    summaryEn
    heroImage
    projectType
  }
}
```

#### Scenario 2: Pricing Page

```graphql
query GetPricingPage($locale: String!) {
  pricingPlans(filter: { published: true, locale: $locale }) {
    id
    nameEn
    nameAr
    price
    currency
    tier
    popular
    recommended
    featuresEn
    featuresAr
  }

  faqs(filter: { category: "pricing", published: true, locale: $locale }) {
    questionEn
    questionAr
    answerEn
    answerAr
  }
}
```

#### Scenario 3: Team Page

```graphql
query GetTeamPage($locale: String!) {
  teamMembers(filter: { published: true, locale: $locale }) {
    id
    nameEn
    nameAr
    roleEn
    roleAr
    bioEn
    bioAr
    department
    specialties
    yearsExperience
    profileImage
  }
}
```

#### Scenario 4: Case Studies Portfolio

```graphql
query GetPortfolio($projectType: String, $locale: String!) {
  caseStudies(filter: { projectType: $projectType, published: true, locale: $locale }) {
    id
    titleEn
    titleAr
    summaryEn
    summaryAr
    projectType
    location
    completionDate
    heroImage
    beforeImages
    afterImages
    features
    stylesTags
  }
}
```

---

## Frontend Integration

### Next.js Server Components (Recommended)

```typescript
// app/[locale]/testimonials/page.tsx
import { getClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';

const GET_TESTIMONIALS = gql`
  query GetTestimonials($locale: String!) {
    testimonials(filter: { published: true, locale: $locale }) {
      id
      nameEn
      nameAr
      testimonialEn
      testimonialAr
      rating
      companyEn
      companyAr
    }
  }
`;

export default async function TestimonialsPage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const { data } = await getClient().query({
    query: GET_TESTIMONIALS,
    variables: { locale }
  });

  return (
    <div>
      {data.testimonials.map((testimonial) => (
        <div key={testimonial.id}>
          <h3>{locale === 'ar' ? testimonial.nameAr : testimonial.nameEn}</h3>
          <p>{locale === 'ar' ? testimonial.testimonialAr : testimonial.testimonialEn}</p>
          <span>Rating: {testimonial.rating}/5</span>
        </div>
      ))}
    </div>
  );
}
```

### Apollo Client Configuration

```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3010/api/graphql',
      fetchOptions: { cache: 'no-store' }, // SSR with fresh data
    }),
  });
});
```

### Client Components with useSuspenseQuery

```typescript
// components/TeamMembers.tsx
'use client';

import { useSuspenseQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_TEAM = gql`
  query GetTeam($department: String) {
    teamMembers(filter: { published: true, department: $department }) {
      id
      nameEn
      roleEn
      profileImage
    }
  }
`;

export function TeamMembers({ department }: { department?: string }) {
  const { data } = useSuspenseQuery(GET_TEAM, {
    variables: { department }
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {data.teamMembers.map((member) => (
        <div key={member.id}>
          <img src={member.profileImage} alt={member.nameEn} />
          <h4>{member.nameEn}</h4>
          <p>{member.roleEn}</p>
        </div>
      ))}
    </div>
  );
}
```

### Environment Variables

```bash
# .env.local (Frontend)
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3010/api/graphql

# .env (CMS Backend)
DATABASE_URL="postgresql://user:password@localhost:5432/mouhajer_cms"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3010"
```

### TypeScript Type Generation

Use GraphQL Code Generator for type safety:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

```yaml
# codegen.yml
schema: http://localhost:3010/api/graphql
documents: 'app/**/*.tsx'
generates:
  ./types/graphql.ts:
    plugins:
      - typescript
      - typescript-operations
      - typescript-react-apollo
    config:
      withHooks: true
      withComponent: false
```

---

## Database Schema

### Current Models

```prisma
// Testimonials
model Testimonial {
  id             String   @id @default(uuid())
  nameEn         String
  nameAr         String?
  roleEn         String
  roleAr         String?
  companyEn      String?
  companyAr      String?
  testimonialEn  String   @db.Text
  testimonialAr  String?  @db.Text
  rating         Int
  projectType    String?
  avatarUrl      String?
  locale         String   @default("en")
  featured       Boolean  @default(false)
  published      Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([locale, featured, published, projectType])
}

// FAQs
model FAQ {
  id          String   @id @default(uuid())
  questionEn  String
  questionAr  String?
  answerEn    String   @db.Text
  answerAr    String?  @db.Text
  category    String
  order       Int      @default(0)
  locale      String   @default("en")
  published   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([locale, category, published, order])
}

// Team Members
model TeamMember {
  id              String   @id @default(uuid())
  nameEn          String
  nameAr          String?
  roleEn          String
  roleAr          String?
  bioEn           String   @db.Text
  bioAr           String?  @db.Text
  specialties     String[] @default([])
  yearsExperience Int?
  profileImage    String?
  email           String?
  linkedin        String?
  department      String?
  order           Int      @default(0)
  locale          String   @default("en")
  featured        Boolean  @default(false)
  published       Boolean  @default(true)
  joinedAt        DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([locale, department, featured, published, order])
}

// Pricing Plans
model PricingPlan {
  id              String   @id @default(uuid())
  nameEn          String
  nameAr          String?
  descriptionEn   String   @db.Text
  descriptionAr   String?  @db.Text
  price           Float?
  currency        String   @default("AED")
  pricingModel    String   @default("fixed")
  tier            String
  popular         Boolean  @default(false)
  recommended     Boolean  @default(false)
  featuresEn      String[]
  featuresAr      String[]
  includedServices String[] @default([])
  order           Int      @default(0)
  locale          String   @default("en")
  featured        Boolean  @default(false)
  published       Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([locale, tier, featured, published, order])
}

// Case Studies
model CaseStudy {
  id                 String   @id @default(uuid())
  titleEn            String
  titleAr            String?
  summaryEn          String   @db.Text
  summaryAr          String?  @db.Text
  clientName         String?
  clientType         String?
  showClientName     Boolean  @default(false)
  projectType        String
  location           String?
  projectSize        String?
  completionDate     DateTime?
  duration           String?
  challengeEn        String   @db.Text
  challengeAr        String?  @db.Text
  solutionEn         String   @db.Text
  solutionAr         String?  @db.Text
  resultsEn          String   @db.Text
  resultsAr          String?  @db.Text
  heroImage          String?
  beforeImages       String[] @default([])
  afterImages        String[] @default([])
  gallery            String[] @default([])
  videoUrl           String?
  features           String[] @default([])
  stylesTags         String[] @default([])
  budget             Float?
  budgetSaved        Float?
  timelineMet        Boolean  @default(true)
  clientSatisfaction Int?
  teamMembers        String[] @default([])
  contractors        String[] @default([])
  keywords           String[] @default([])
  tags               String[] @default([])
  order              Int      @default(0)
  locale             String   @default("en")
  featured           Boolean  @default(false)
  published          Boolean  @default(true)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@index([locale, projectType, featured, published, order])
}
```

### Database Statistics

- **Total Tables**: 5 content types
- **Total Records**: 36
- **Total Indexes**: 5 (optimized for common query patterns)
- **Bilingual Support**: All models support EN/AR content
- **Featured System**: 4 of 5 models support featured flag
- **Publishing Workflow**: All models support published flag

---

## Performance Optimization

### Database Indexes

All content types include composite indexes on frequently queried fields:

```prisma
@@index([locale, featured, published, order])
@@index([locale, category, published, order])  // FAQs
@@index([locale, department, featured, published, order])  // Team
@@index([locale, tier, featured, published, order])  // Pricing
@@index([locale, projectType, featured, published, order])  // Case Studies
```

### GraphQL Query Best Practices

1. **Use Pagination**: Always specify `limit` and `offset` for list queries
2. **Filter Early**: Use filter parameters to reduce database load
3. **Request Only Needed Fields**: Don't query all fields if you only need a few
4. **Use Count Queries**: Separate count queries for pagination metadata

### Caching Recommendations

```typescript
// Server Components: No caching (fresh data)
const { data } = await getClient().query({
  query: GET_TESTIMONIALS,
  fetchPolicy: 'no-cache'
});

// Static Pages: Cache for 1 hour
export const revalidate = 3600;

// Client Components: Cache with stale-while-revalidate
const { data } = useSuspenseQuery(GET_TEAM, {
  fetchPolicy: 'cache-and-network'
});
```

---

## Seed Data Summary

### Testimonials (5 records)
- **Featured**: 3 (Sarah Al-Mansouri, David Chen, Fatima Al-Hashimi)
- **Project Types**: residential, commercial, office
- **Average Rating**: 4.8/5
- **Languages**: All bilingual (EN/AR)

### FAQs (14 records)
- **Categories**: general (4), services (3), pricing (3), process (2), technical (2)
- **Order**: Sequentially ordered within categories
- **Languages**: All bilingual (EN/AR)

### Team Members (8 records)
- **Departments**: design (3), architecture (1), visualization (1), project-management (1), sustainability (1), technical (1)
- **Featured**: 3 (Layla Al-Hamadi, Omar Khalil, Zainab Mohammed)
- **Average Experience**: 9.5 years
- **Languages**: All bilingual (EN/AR)

### Pricing Plans (4 records)
- **Tiers**: basic, professional, premium, enterprise
- **Price Range**: AED 5,000 - 150,000+ (Enterprise custom)
- **Popular**: Professional tier
- **Recommended**: Premium tier
- **Languages**: All bilingual (EN/AR)

### Case Studies (5 records)
- **Project Types**: residential (2), commercial (2), heritage (1)
- **Featured**: 2 (Palm Jumeirah Villa, Al Fahidi Heritage)
- **Average Budget**: AED 438,000
- **Average Client Satisfaction**: 4.8/5
- **Languages**: All bilingual (EN/AR)

---

## Troubleshooting

### Common Issues

#### GraphQL Playground Not Loading
- Ensure server is running: `npm run dev:cms`
- Check port 3010 is not in use: `npx kill-port 3010`
- Verify `introspection: true` in Apollo Server config

#### Authentication Errors
- Mutations require user context
- Check `createContext()` function in `apps/cms/src/graphql/context.ts`
- Verify JWT token is valid and includes user role

#### Prisma Client Not Updated
- Run `npx prisma generate` after schema changes
- If EPERM error occurs, restart server and try again
- Database sync: `npx prisma db push`

#### Empty Results
- Check filter parameters match database values
- Verify `published: true` in filter if applicable
- Ensure locale matches ('en' or 'ar')
- Check database has seed data: `npx prisma studio`

---

## Next Steps

### Frontend Integration Roadmap

1. **Phase 1: Static Pages** (Week 1-2)
   - Homepage with featured content (testimonials, case studies, team)
   - Testimonials page with filtering
   - Team page with department filtering
   - Pricing page with tier comparison
   - FAQ page with category tabs

2. **Phase 2: Dynamic Content** (Week 3-4)
   - Case studies portfolio with project type filtering
   - Individual case study detail pages
   - Team member profiles
   - Search functionality across all content types

3. **Phase 3: Admin Dashboard** (Week 5-6)
   - Authentication implementation
   - CRUD interfaces for all content types
   - Image upload system
   - Content preview before publishing

4. **Phase 4: Optimization** (Week 7-8)
   - Implement ISR (Incremental Static Regeneration)
   - Add Redis caching layer
   - Image optimization with Next.js Image
   - SEO optimization with metadata

### Additional Features

- **Media Library**: Centralized image management
- **Analytics Integration**: Track content performance
- **Content Versioning**: History and rollback capability
- **Bulk Operations**: Import/export CSV, bulk publish/unpublish
- **Advanced Filtering**: Multi-select filters, date ranges
- **Search**: Full-text search across all content
- **Related Content**: Automatic content recommendations
- **Localization**: Add more language support beyond EN/AR

---

## Support

For issues or questions:
1. Check GraphQL Playground for schema documentation
2. Review error messages in browser console
3. Check server logs: `npm run dev:cms`
4. Verify database state: `npx prisma studio`
5. Test queries with cURL before frontend integration

---

**Last Updated**: 2025-10-19
**API Version**: 1.0.0
**Total Endpoints**: 25 queries + 15 mutations
**Total Content Records**: 36
