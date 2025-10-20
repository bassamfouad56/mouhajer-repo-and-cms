# Architecture Documentation - Mouhajer Monorepo

This document provides a comprehensive overview of the system architecture, design decisions, and technical implementation details.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Principles](#architecture-principles)
3. [Technology Stack](#technology-stack)
4. [Data Flow](#data-flow)
5. [Database Architecture](#database-architecture)
6. [API Design](#api-design)
7. [Frontend Architecture](#frontend-architecture)
8. [Security Architecture](#security-architecture)
9. [Caching Strategy](#caching-strategy)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

Mouhajer uses a **headless CMS architecture** with complete separation between content management (CMS) and content presentation (Frontend).

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MOUHAJER ECOSYSTEM                               │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                ┌───────────────────┴────────────────────┐
                │                                        │
    ┌───────────▼──────────┐              ┌─────────────▼────────────┐
    │   CMS (Admin Panel)  │              │   Frontend (Website)     │
    │   Port: 3010         │              │   Port: 3000             │
    │                      │              │                          │
    │  - Content Creation  │              │  - Public Interface      │
    │  - User Management   │              │  - SEO Optimized         │
    │  - Media Library     │              │  - Multi-language        │
    │  - Settings          │              │  - Responsive            │
    │  - Authentication    │              │  - High Performance      │
    └──────────┬───────────┘              └────────────┬─────────────┘
               │                                       │
               │ GraphQL API                          │ GraphQL Client
               │ REST API                             │ HTTP/HTTPS
               │                                      │
               └────────────┬─────────────────────────┘
                            │
                ┌───────────▼───────────┐
                │   PostgreSQL Database │
                │   (Prisma Accelerate) │
                └───────────┬───────────┘
                            │
                ┌───────────▼───────────┐
                │  Vercel Blob Storage  │
                │  (Media Files)        │
                └───────────────────────┘
```

### Key Components

1. **CMS (Content Management System)**
   - Admin interface for managing content
   - REST & GraphQL APIs
   - Authentication & authorization
   - Media management
   - Database management

2. **Frontend (Public Website)**
   - Next.js server-side rendering
   - Bilingual support (EN/AR)
   - SEO optimization
   - Performance optimization

3. **Shared Packages**
   - `@mouhajer/types`: Shared TypeScript types
   - Future: `@mouhajer/utils`, `@mouhajer/ui`

4. **External Services**
   - PostgreSQL: Data storage
   - Vercel Blob: Media storage
   - Vercel: Hosting & deployment

---

## Architecture Principles

### 1. Separation of Concerns

Each component has a single, well-defined responsibility:
- CMS manages content
- Frontend presents content
- Database stores data
- Blob storage handles media

### 2. Type Safety

- TypeScript throughout
- Shared type definitions via `@mouhajer/types`
- Prisma for type-safe database access
- Zod for runtime validation

### 3. Scalability

- Horizontal scaling via serverless functions
- Database connection pooling (Prisma Accelerate)
- CDN for static assets (Vercel Edge Network)
- ISR for content caching

### 4. Security First

- Authentication via NextAuth
- CORS configuration
- Rate limiting
- Input validation
- Activity logging
- Secure headers

### 5. Developer Experience

- Monorepo structure
- Hot reloading
- Type safety
- Comprehensive documentation
- Docker support
- Automated tooling (Turbo)

### 6. Performance

- Incremental Static Regeneration (ISR)
- Image optimization
- Code splitting
- Lazy loading
- Bundle optimization

---

## Technology Stack

### CMS Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14 App Router | Full-stack React framework |
| **Language** | TypeScript 5 | Type safety |
| **Database** | PostgreSQL 16 | Relational data storage |
| **ORM** | Prisma 6.2 | Type-safe database client |
| **Auth** | NextAuth.js v5 | Authentication & sessions |
| **API** | GraphQL + REST | Data APIs |
| **GraphQL** | Apollo Server | GraphQL implementation |
| **Storage** | Vercel Blob | Media file storage |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Editor** | TipTap | Rich text editing |
| **Validation** | Zod | Schema validation |
| **Icons** | Lucide React | Icon library |

### Frontend Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | Next.js 14 App Router | SSR React framework |
| **Language** | TypeScript 5 | Type safety |
| **Data** | GraphQL Client | API consumption |
| **i18n** | next-intl | Internationalization |
| **Styling** | Tailwind CSS v3 | Utility-first CSS |
| **Animation** | Framer Motion | Animations |
| **Forms** | React Hook Form | Form handling |
| **Validation** | Zod | Form validation |
| **SEO** | next/head, JSON-LD | Meta tags & structured data |
| **Carousels** | Swiper, Embla | Content sliders |

### Shared Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Monorepo** | npm workspaces | Workspace management |
| **Build** | Turborepo | Build orchestration |
| **Types** | TypeScript | Shared type definitions |
| **Linting** | ESLint | Code quality |
| **Formatting** | Prettier | Code formatting |
| **Version Control** | Git | Source control |
| **Hosting** | Vercel | Deployment platform |

---

## Data Flow

### Content Creation Flow

```
1. Admin logs into CMS (port 3010)
   ↓
2. Admin creates/edits content (Project, Service, Blog, etc.)
   ↓
3. Content validated via Zod schemas
   ↓
4. Prisma saves to PostgreSQL database
   ↓
5. Media files uploaded to Vercel Blob
   ↓
6. Activity logged to ActivityLog table
   ↓
7. Content published (status: draft → published)
   ↓
8. Frontend can now access via GraphQL/REST API
```

### Content Consumption Flow

```
1. User visits website (port 3000)
   ↓
2. Next.js Server Component fetches data
   ↓
3. GraphQL query sent to CMS API
   ↓
4. CMS queries PostgreSQL via Prisma
   ↓
5. Data returned to frontend
   ↓
6. Next.js renders page (SSR/ISR)
   ↓
7. HTML sent to browser
   ↓
8. Client-side hydration
   ↓
9. Page cached for ISR (5-30 minutes)
```

### Authentication Flow

```
1. User submits credentials on /login
   ↓
2. NextAuth.js validates credentials
   ↓
3. Database lookup (User table)
   ↓
4. Bcrypt compares password hash
   ↓
5. JWT session token created
   ↓
6. Token signed with NEXTAUTH_SECRET
   ↓
7. Session cookie set (30-day expiry)
   ↓
8. User redirected to dashboard
   ↓
9. Subsequent requests include session token
   ↓
10. Middleware validates token on each request
```

---

## Database Architecture

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
│ (Auth)      │
└──────┬──────┘
       │ 1:N
       │
       ▼
┌─────────────┐
│ ActivityLog │
│ (Audit)     │
└─────────────┘

┌─────────────┐      ┌──────────────┐
│   Project   │      │   Service    │
│ (Portfolio) │      │  (Offering)  │
└─────────────┘      └──────────────┘

┌─────────────┐      ┌──────────────┐
│  BlogPost   │──────│    User      │
│  (Content)  │ N:1  │  (Author)    │
└─────────────┘      └──────────────┘

┌─────────────┐      ┌──────────────┐
│    Page     │──────│  PageBlock   │
│  (Dynamic)  │ 1:N  │  (Content)   │
└─────────────┘      └──────────────┘

┌─────────────┐      ┌──────────────┐
│ MediaFile   │      │ Advertisement│
│ (Storage)   │      │  (Marketing) │
└─────────────┘      └──────────────┘

┌─────────────┐
│  Settings   │
│ (Singleton) │
└─────────────┘
```

### Key Tables

#### 1. User
- Stores admin/editor accounts
- Bcrypt hashed passwords
- Role-based access (admin, editor, viewer)
- Last login tracking

#### 2. Project
- Portfolio projects (bilingual)
- Image arrays (Vercel Blob URLs)
- Category filtering
- Featured flag
- SEO metadata
- Published/draft status

#### 3. Service
- Service offerings (bilingual)
- Features array
- Pricing information
- Related services (self-referencing)
- SEO metadata

#### 4. BlogPost
- Blog content (bilingual)
- Rich text content (TipTap JSON)
- Author relationship
- Categories & tags
- Featured image
- SEO metadata

#### 5. Page & PageBlock
- Dynamic page system
- Flexible JSON block data
- Block ordering
- Multiple block types (hero, sections, etc.)

#### 6. MediaFile
- Metadata for uploaded files
- Vercel Blob URLs
- Image dimensions
- MIME types
- Thumbnails

#### 7. Advertisement
- Ad management system
- Zone-based placement
- Date scheduling
- Impression/click tracking
- Target page filtering

#### 8. Settings
- Singleton table (only 1 row)
- Site configuration
- Contact information
- Social media links
- SEO defaults

#### 9. ActivityLog
- Comprehensive audit trail
- All CRUD operations logged
- User actions tracked
- IP address & user agent

### Indexing Strategy

Optimized indexes for common queries:

```sql
-- Projects
CREATE INDEX idx_projects_featured ON Project(featured);
CREATE INDEX idx_projects_status ON Project(status);
CREATE INDEX idx_projects_category ON Project(category);

-- Blog Posts
CREATE UNIQUE INDEX idx_blog_slug_en ON BlogPost(slugEn);
CREATE UNIQUE INDEX idx_blog_slug_ar ON BlogPost(slugAr);
CREATE INDEX idx_blog_featured ON BlogPost(featured);
CREATE INDEX idx_blog_status ON BlogPost(status);
CREATE INDEX idx_blog_category ON BlogPost(category);

-- Pages
CREATE UNIQUE INDEX idx_page_slug_en ON Page(slugEn);
CREATE UNIQUE INDEX idx_page_slug_ar ON Page(slugAr);

-- Advertisements
CREATE INDEX idx_ads_zone ON Advertisement(zone);
CREATE INDEX idx_ads_active ON Advertisement(active);
CREATE INDEX idx_ads_dates ON Advertisement(startDate, endDate);
```

---

## API Design

### GraphQL API

**Endpoint**: `http://localhost:3010/api/graphql`

**Schema Overview**:

```graphql
type Query {
  # Projects
  projects(featured: Boolean, category: String, limit: Int): [Project!]!
  project(id: ID, slug: String): Project

  # Services
  services(featured: Boolean, limit: Int): [Service!]!
  service(id: ID, slug: String): Service

  # Blog
  blogPosts(featured: Boolean, category: String, limit: Int): [BlogPost!]!
  blogPost(id: ID, slug: String): BlogPost

  # Pages
  pages: [Page!]!
  page(id: ID, slug: String): Page

  # Settings
  settings: Settings!

  # Homepage
  homepageData: HomepageData!
}

type Project {
  id: ID!
  titleEn: String!
  titleAr: String!
  descriptionEn: String!
  descriptionAr: String!
  slugEn: String!
  slugAr: String!
  images: [String!]!
  category: String
  featured: Boolean!
  status: String!
  # ... SEO fields
}

# ... other types
```

**Query Examples**:

```graphql
# Get featured projects
{
  projects(featured: true, limit: 6) {
    id
    titleEn
    titleAr
    images
    category
  }
}

# Get homepage data
{
  homepageData {
    settings {
      siteNameEn
      siteNameAr
    }
    featuredProjects {
      titleEn
      images
    }
    featuredBlogs {
      titleEn
      excerptEn
    }
  }
}
```

### REST API

**Base URL**: `http://localhost:3010/api`

**Endpoints**:

```
Authentication:
  POST   /api/auth/signin         # Login
  POST   /api/auth/signout        # Logout

Content Management (Auth Required):
  GET    /api/projects            # List projects
  POST   /api/projects            # Create project
  GET    /api/projects/:id        # Get project
  PUT    /api/projects/:id        # Update project
  DELETE /api/projects/:id        # Delete project

  GET    /api/services            # List services
  POST   /api/services            # Create service
  ...

  GET    /api/blog                # List blog posts
  POST   /api/blog                # Create blog post
  ...

Media:
  POST   /api/media/upload        # Upload file
  GET    /api/media               # List files
  DELETE /api/media/:id           # Delete file

Settings:
  GET    /api/settings            # Get settings
  PUT    /api/settings            # Update settings

Admin:
  GET    /api/users               # List users (admin only)
  POST   /api/users               # Create user (admin only)

  GET    /api/activity            # Activity logs (admin only)
```

**Response Format**:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Frontend Architecture

### Page Rendering Strategy

| Page Type | Strategy | Revalidation |
|-----------|----------|--------------|
| Homepage | ISR | 300s (5 min) |
| Project List | ISR | 600s (10 min) |
| Project Detail | ISR | 1800s (30 min) |
| Service List | ISR | 1800s (30 min) |
| Service Detail | ISR | 1800s (30 min) |
| Blog List | ISR | 600s (10 min) |
| Blog Detail | ISR | 600s (10 min) |
| About/Static | ISR | 3600s (1 hour) |
| Contact | SSR | N/A |

### Component Architecture

```
app/
├── [locale]/                    # i18n wrapper
│   ├── layout.tsx              # Root layout with nav/footer
│   ├── template.tsx            # Page transition wrapper
│   ├── page.tsx                # Homepage (ISR)
│   │
│   ├── services/
│   │   ├── page.tsx            # Service list (ISR)
│   │   └── [slug]/[service]/
│   │       └── page.tsx        # Service detail (ISR)
│   │
│   ├── blogs/
│   │   ├── page.tsx            # Blog list (ISR)
│   │   └── [slug]/
│   │       └── page.tsx        # Blog detail (ISR)
│   │
│   └── our-projects/
│       ├── page.tsx            # Project list (ISR)
│       └── [slug]/
│           └── page.tsx        # Project detail (ISR)
│
├── api/
│   ├── revalidate/route.ts     # On-demand revalidation
│   └── sitemap.ts              # Dynamic sitemap
│
└── components/
    ├── sections/               # Page sections
    ├── ui/                     # UI primitives (shadcn)
    ├── SVG/                    # SVG icons
    └── utils/                  # Utility components
```

### Data Fetching Pattern

```typescript
// Server Component (RSC)
async function ProjectPage({ params }: { params: { slug: string } }) {
  // Fetch data server-side
  const project = await fetchProject(params.slug, {
    next: { revalidate: 1800 }, // 30 minute cache
  });

  return <ProjectDetail project={project} />;
}
```

### Internationalization

```
Routes:
  /en/services      → English version
  /ar/services      → Arabic version

Content:
  titleEn → English title
  titleAr → Arabic title

Direction:
  en → LTR (left-to-right)
  ar → RTL (right-to-left)
```

---

## Security Architecture

### Authentication

- **Method**: NextAuth.js v5 with JWT
- **Session**: 30-day expiry
- **Password**: Bcrypt hashing (10 rounds)
- **Storage**: HTTP-only cookies

### Authorization

```typescript
// Role hierarchy
type UserRole = 'admin' | 'editor' | 'viewer';

// Permissions
admin   → Full access (CRUD + settings + users)
editor  → Content CRUD (no settings/users)
viewer  → Read-only access
```

### Security Headers

```typescript
{
  'Strict-Transport-Security': 'max-age=15552000; includeSubDomains',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
}
```

### CORS Policy

```typescript
// Allowed origins
const allowedOrigins = [
  'https://mahermouhajer.com',
  'https://www.mahermouhajer.com',
  'https://mouhajer.ae',
  'http://localhost:3000',
  'http://localhost:3010',
];
```

### Rate Limiting

```typescript
// Contact form: 5 requests per 15 minutes per IP
// Media upload: 10 requests per hour per user
// API requests: 100 requests per minute per IP
```

---

## Caching Strategy

### ISR (Incremental Static Regeneration)

```typescript
// Short cache (5 min) - Frequently updated content
export const revalidate = 300;

// Medium cache (10 min) - Moderately updated content
export const revalidate = 600;

// Long cache (30 min) - Rarely updated content
export const revalidate = 1800;
```

### On-Demand Revalidation

```typescript
// Webhook endpoint
POST /api/revalidate
{
  "path": "/en/services/interior-design",
  "secret": "revalidation-secret"
}
```

### GraphQL Caching

```typescript
fetch(GRAPHQL_URL, {
  method: 'POST',
  body: JSON.stringify({ query }),
  next: { revalidate: 300 }, // 5 minute cache
});
```

---

## Deployment Architecture

### Vercel Deployment

```
┌─────────────────────────────────────────────────────┐
│                 Vercel Edge Network                 │
│                     (Global CDN)                    │
└───────────────────┬─────────────────────────────────┘
                    │
        ┌───────────┴──────────┐
        │                      │
┌───────▼────────┐    ┌────────▼────────┐
│   CMS Instance │    │ Frontend Instance│
│   (Serverless) │    │   (Serverless)  │
│                │    │                 │
│ • API Routes   │    │ • ISR Pages     │
│ • GraphQL      │    │ • Static Assets │
│ • Auth         │    │ • Images (CDN)  │
└────────┬───────┘    └────────┬────────┘
         │                     │
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │  PostgreSQL Database│
         │  (Prisma Accelerate)│
         └──────────┬──────────┘
                    │
         ┌──────────▼──────────┐
         │  Vercel Blob Storage│
         │   (Media Files CDN) │
         └─────────────────────┘
```

### Environment Separation

```
Development:
  - Local (localhost:3000, localhost:3010)
  - Local PostgreSQL or dev database
  - Development Blob Storage

Staging (optional):
  - Vercel preview deployments
  - Staging database
  - Staging Blob Storage

Production:
  - Custom domains (mahermouhajer.com)
  - Production database
  - Production Blob Storage
  - Analytics enabled
```

---

## Performance Metrics

### Target Metrics

- **Time to First Byte (TTFB)**: < 200ms
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

### Optimization Techniques

1. **Image Optimization**
   - Next/Image automatic optimization
   - WebP format
   - Lazy loading
   - Responsive images

2. **Code Splitting**
   - Route-based splitting
   - Dynamic imports
   - Lazy hydration

3. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression (Brotli)

4. **Caching**
   - ISR for content
   - CDN for static assets
   - Browser caching

---

## Scalability Considerations

### Horizontal Scaling

- Serverless functions auto-scale
- Database connection pooling
- CDN handles static assets
- No server state management

### Database Scaling

- Prisma Accelerate connection pooling
- Database indexes for common queries
- Potential for read replicas
- Query optimization

### Media Scaling

- CDN distribution (Vercel Blob)
- Image optimization pipeline
- Lazy loading
- Responsive images

---

## Future Enhancements

1. **Shared UI Library** (`@mouhajer/ui`)
2. **Shared Utils** (`@mouhajer/utils`)
3. **Redis Caching Layer**
4. **Full-text Search** (Algolia/Meilisearch)
5. **Analytics Dashboard**
6. **A/B Testing Framework**
7. **Multi-tenant Support**
8. **Mobile Apps** (React Native)

---

**Document Version**: 1.0.0
**Last Updated**: 2025-01-16
