# Mouhajer International Design - Monorepo

A modern, full-stack headless CMS architecture for Mouhajer International Design website. This monorepo contains both the CMS (content management system) and the public-facing frontend application.

![Architecture](https://img.shields.io/badge/Architecture-Monorepo-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-Private-red)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Architecture Overview

This project uses a **headless CMS architecture** with complete separation between content management and presentation:

```
┌─────────────────────────────────────────────────────────────┐
│                     MOUHAJER MONOREPO                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────┐         ┌────────────────────────┐  │
│  │   CMS (Admin)    │         │   Frontend (Public)    │  │
│  │   Port: 3010     │◄────────│   Port: 3000           │  │
│  │                  │ GraphQL │                        │  │
│  │  - Next.js 14    │         │  - Next.js 14          │  │
│  │  - Prisma ORM    │         │  - Server Components   │  │
│  │  - NextAuth      │         │  - i18n (EN/AR)        │  │
│  │  - PostgreSQL    │         │  - ISR Caching         │  │
│  │  - Vercel Blob   │         │  - SEO Optimized       │  │
│  └──────────────────┘         └────────────────────────┘  │
│           │                              │                 │
│           └──────────┬───────────────────┘                 │
│                      │                                     │
│          ┌───────────▼───────────┐                        │
│          │   Shared Packages     │                        │
│          │  - @mouhajer/types    │                        │
│          └───────────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

- **Bilingual Support**: Full English/Arabic content with RTL support
- **Type-Safe**: Shared TypeScript types across CMS and frontend
- **SEO Optimized**: JSON-LD structured data, meta tags, sitemaps
- **Modern Stack**: Next.js 14, React 18, Prisma, GraphQL
- **Headless Architecture**: Complete separation of concerns
- **Media Management**: Vercel Blob Storage for images/videos
- **Content Management**: Projects, Services, Blog, Pages, Ads
- **Authentication**: NextAuth v5 with role-based access control
- **Performance**: ISR caching, image optimization, code splitting

---

## Tech Stack

### CMS (Backend)

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL + Prisma ORM |
| Authentication | NextAuth.js v5 |
| Storage | Vercel Blob Storage |
| API | GraphQL (Apollo Server) + REST |
| Styling | Tailwind CSS v4 |
| Editor | TipTap (Rich Text) |

### Frontend (Website)

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Data Fetching | GraphQL + Server Components |
| i18n | next-intl |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |

### Shared Infrastructure

- **Monorepo**: npm workspaces + Turborepo
- **Type Safety**: Shared `@mouhajer/types` package
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Deployment**: Vercel

---

## Project Structure

```
mouhajer-monorepo/
├── apps/
│   ├── cms/                    # Content Management System
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router (pages + API)
│   │   │   ├── components/    # React components
│   │   │   ├── lib/           # Utilities & helpers
│   │   │   ├── graphql/       # GraphQL schema & resolvers
│   │   │   └── middleware.ts  # CORS & auth middleware
│   │   ├── prisma/
│   │   │   └── schema.prisma  # Database schema
│   │   ├── .env.example       # Environment template
│   │   └── package.json
│   │
│   └── frontend/              # Public Website
│       ├── app/
│       │   └── [locale]/     # i18n routing (en/ar)
│       ├── components/       # React components (80+)
│       ├── lib/              # Data fetching & utilities
│       ├── messages/         # i18n translations
│       ├── .env.example      # Environment template
│       └── package.json
│
├── packages/
│   └── types/                # Shared TypeScript types
│       ├── src/
│       │   └── index.ts      # Type definitions
│       └── package.json
│
├── package.json              # Root workspace config
├── turbo.json                # Turborepo configuration
├── docker-compose.yml        # Local dev environment
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** database (local or cloud)
- **Vercel Blob Storage** account (for media)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mouhajer-monorepo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   **CMS:**
   ```bash
   cd apps/cms
   cp .env.example .env
   # Edit .env with your actual values
   ```

   **Frontend:**
   ```bash
   cd apps/frontend
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Set up database**
   ```bash
   cd apps/cms
   npm run prisma:generate
   npm run prisma:migrate
   npm run db:seed  # Optional: seed with sample data
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - **CMS**: http://localhost:3010
   - **Frontend**: http://localhost:3000
   - **Prisma Studio**: http://localhost:5555

---

## Development

### Running Individual Apps

```bash
# Run only CMS
npm run dev:cms

# Run only Frontend
npm run dev:frontend
```

### Building

```bash
# Build all apps
npm run build

# Build individual apps
npm run build:cms
npm run build:frontend
```

### Database Commands

```bash
cd apps/cms

# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Push schema without migration
npm run db:push

# Seed database
npm run db:seed

# Open Prisma Studio
npm run prisma:studio
```

### Linting & Formatting

```bash
# Lint all apps
npm run lint

# Format code
npm run format
```

---

## Deployment

### Vercel Deployment

#### Deploy CMS

1. Create new Vercel project
2. Set **Root Directory**: `apps/cms`
3. **Framework Preset**: Next.js
4. **Build Command**: `prisma generate && next build`
5. **Install Command**: `npm install`
6. **Output Directory**: `.next`
7. Add environment variables from `apps/cms/.env.example`

#### Deploy Frontend

1. Create new Vercel project
2. Set **Root Directory**: `apps/frontend`
3. **Framework Preset**: Next.js
4. **Build Command**: `next build`
5. **Install Command**: `npm install`
6. **Output Directory**: `.next`
7. Add environment variables from `apps/frontend/.env.example`
8. Set `NEXT_PUBLIC_GRAPHQL_URL` to your deployed CMS URL

### Environment Variables

See detailed environment setup:
- **CMS**: [`apps/cms/.env.example`](apps/cms/.env.example)
- **Frontend**: [`apps/frontend/.env.example`](apps/frontend/.env.example)

---

## Scripts

### Root Level

| Script | Description |
|--------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run dev:cms` | Start only CMS |
| `npm run dev:frontend` | Start only Frontend |
| `npm run build` | Build all apps |
| `npm run lint` | Lint all apps |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Clean all node_modules and dist folders |

### CMS Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start CMS + Prisma Studio |
| `npm run dev:cms-only` | Start only CMS (no Prisma Studio) |
| `npm run build` | Build for production |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

---

## Database Schema

The CMS includes 10 comprehensive data models:

1. **User** - Authentication & authorization
2. **Project** - Portfolio projects (bilingual)
3. **Service** - Service offerings (bilingual)
4. **BlogPost** - Blog content (bilingual)
5. **Page** - Dynamic pages with blocks
6. **PageBlock** - Flexible content blocks
7. **MediaFile** - Media management
8. **Advertisement** - Ad management system
9. **Settings** - Site configuration
10. **ActivityLog** - Audit trail

All content models support:
- Full bilingual content (English/Arabic)
- SEO metadata
- Draft/Published status
- Featured flags
- Timestamps

---

## API Documentation

### GraphQL Endpoint

```
Development: http://localhost:3010/api/graphql
Production: https://your-cms.vercel.app/api/graphql
```

### GraphQL Playground

Access GraphQL playground at:
```
http://localhost:3010/playground
```

### REST Endpoints

The CMS also provides REST API endpoints:

- `/api/projects` - Projects CRUD
- `/api/services` - Services CRUD
- `/api/blog` - Blog posts CRUD
- `/api/pages` - Pages CRUD
- `/api/media` - Media management
- `/api/settings` - Site settings
- `/api/ads` - Advertisements
- `/api/users` - User management (admin only)

Authentication required for all endpoints except public read operations.

---

## Security

- **Authentication**: NextAuth v5 with JWT sessions
- **Password Hashing**: bcrypt with 10 rounds
- **CORS**: Configured for allowed origins
- **Rate Limiting**: IP-based rate limiting on forms
- **Input Validation**: Zod schemas
- **SQL Injection**: Prevented via Prisma ORM
- **XSS Protection**: Security headers configured
- **Activity Logging**: Complete audit trail

### Default Credentials (Development Only)

```
Admin: admin@mouhajerdesign.com / admin123
Editor: editor@mouhajerdesign.com / editor123
```

**IMPORTANT**: Change these in production!

---

## Troubleshooting

### Database Connection Issues

```bash
# Check database URL in .env
# Ensure PostgreSQL is running
# Run migrations
cd apps/cms
npm run prisma:migrate
```

### Build Errors

```bash
# Clean install
npm run clean
npm install

# Rebuild
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000 or 3010
npx kill-port 3000 3010
```

---

## Performance

- **ISR Caching**: 5-30 minute revalidation
- **Image Optimization**: Next/Image + Vercel Blob CDN
- **Code Splitting**: Dynamic imports for heavy modules
- **Bundle Analysis**: `@next/bundle-analyzer` included
- **Server Components**: Maximized for performance
- **Lazy Loading**: For images and interactive components

---

## Internationalization (i18n)

- **Supported Locales**: English (en), Arabic (ar)
- **RTL Support**: Automatic for Arabic
- **Translation Files**: `apps/frontend/messages/`
- **Routing**: `/en/...` and `/ar/...`
- **Content**: All CMS content fully bilingual

---

## Contributing

### Branching Strategy

- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Convention

Follow conventional commits:
```
feat: Add new feature
fix: Bug fix
docs: Documentation
style: Formatting
refactor: Code refactoring
test: Tests
chore: Maintenance
```

---

## License

Private - All rights reserved. Mouhajer International Design.

---

## Support

For issues, questions, or support:
- **Email**: admin@mouhajerdesign.com
- **Website**: https://mahermouhajer.com

---

## Changelog

### v1.0.0 (Current)

- ✅ Monorepo setup with npm workspaces + Turborepo
- ✅ Standardized Next.js 14 + React 18 across apps
- ✅ Shared types package (@mouhajer/types)
- ✅ Comprehensive environment configuration
- ✅ Docker support for local development
- ✅ Full documentation

---

**Built with ❤️ by the Mouhajer Design Team**
