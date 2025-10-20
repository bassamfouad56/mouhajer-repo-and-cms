# GraphQL Migration Plan

## Overview
Implementing GraphQL for mouhajer-cms (backend) and mouhajer-repo (frontend) with Apollo Server + Playground.

## Current State Analysis

### mouhajer-cms
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Current API**: REST API endpoints in `/src/app/api`
- **Authentication**: NextAuth v5
- **Models**: User, Project, Service, BlogPost, Page, PageBlock, MediaFile, Settings, Advertisement, ActivityLog

### mouhajer-repo
- **Framework**: Next.js (frontend)
- **Current API Client**: Fetch API with REST endpoints

## Implementation Plan

### Phase 1: Backend Setup (mouhajer-cms)

#### 1.1 Install Dependencies
```bash
cd ../mouhajer-cms
npm install @apollo/server @as-integrations/next graphql graphql-tag
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-resolvers
```

#### 1.2 GraphQL Schema Structure
Create schemas for:
- **Projects**: Query (list, single) + Mutations (create, update, delete)
- **Services**: Query + Mutations
- **BlogPosts**: Query + Mutations
- **Pages**: Query + Mutations (including blocks)
- **MediaFiles**: Query + Mutations
- **Settings**: Query + Mutations
- **Advertisements**: Query + Mutations
- **Users**: Query + Mutations (admin only)
- **ActivityLogs**: Query (read-only)

#### 1.3 GraphQL Playground Setup
- Apollo Server with Next.js App Router integration
- Enable introspection in development
- GraphQL Playground UI at `/api/graphql`

#### 1.4 Features to Implement
- **Authentication**: Integrate with existing NextAuth
- **Authorization**: Role-based access (admin, editor, viewer)
- **Pagination**: Cursor-based pagination
- **Filtering**: Dynamic filters for queries
- **Sorting**: Multi-field sorting
- **File Uploads**: Scalar type for file uploads
- **Activity Logging**: Automatic logging via resolvers

### Phase 2: Frontend Setup (mouhajer-repo)

#### 2.1 Install Dependencies
```bash
npm install @apollo/client graphql
npm install -D @graphql-codegen/cli @graphql-codegen/client-preset
```

#### 2.2 Apollo Client Configuration
- Set up Apollo Client with Next.js 15
- Configure cache policies
- Add authentication headers
- Error handling

#### 2.3 Code Generation
- Generate TypeScript types from GraphQL schema
- Generate React hooks for queries and mutations
- Set up automatic regeneration on schema changes

### Phase 3: Migration Strategy

#### 3.1 Parallel Operation
- Keep REST APIs active during migration
- Gradually migrate frontend components to GraphQL
- Monitor performance and errors

#### 3.2 Component Migration Priority
1. Settings (simple, singleton)
2. Projects (moderate complexity)
3. Services (moderate complexity)
4. BlogPosts (complex with content)
5. Pages (most complex with blocks)
6. MediaFiles (file uploads)
7. Advertisements (complex logic)

## Benefits of GraphQL Migration

1. **Type Safety**: Full type generation from schema to frontend
2. **Efficient Queries**: Request exactly what you need
3. **Better Developer Experience**: Playground for testing
4. **Real-time Capabilities**: Easy to add subscriptions later
5. **Documentation**: Self-documenting API via introspection
6. **Reduced API Calls**: Fetch related data in single request

## File Structure

### mouhajer-cms
```
src/
├── graphql/
│   ├── schema/
│   │   ├── index.ts           # Combined schema
│   │   ├── projects.ts        # Project types & inputs
│   │   ├── services.ts        # Service types & inputs
│   │   ├── blog.ts            # BlogPost types & inputs
│   │   ├── pages.ts           # Page types & inputs
│   │   ├── media.ts           # MediaFile types & inputs
│   │   ├── settings.ts        # Settings types & inputs
│   │   ├── ads.ts             # Advertisement types & inputs
│   │   ├── users.ts           # User types & inputs
│   │   └── scalars.ts         # Custom scalars
│   ├── resolvers/
│   │   ├── index.ts           # Combined resolvers
│   │   ├── projects.ts        # Project resolvers
│   │   ├── services.ts        # Service resolvers
│   │   ├── blog.ts            # BlogPost resolvers
│   │   ├── pages.ts           # Page resolvers
│   │   ├── media.ts           # MediaFile resolvers
│   │   ├── settings.ts        # Settings resolvers
│   │   ├── ads.ts             # Advertisement resolvers
│   │   └── users.ts           # User resolvers
│   ├── context.ts             # GraphQL context (auth, prisma)
│   └── server.ts              # Apollo Server setup
├── app/
│   └── api/
│       └── graphql/
│           └── route.ts       # GraphQL endpoint
```

### mouhajer-repo
```
lib/
├── graphql/
│   ├── client.ts              # Apollo Client setup
│   ├── queries/               # GraphQL queries
│   │   ├── projects.ts
│   │   ├── services.ts
│   │   ├── blog.ts
│   │   ├── pages.ts
│   │   └── settings.ts
│   └── mutations/             # GraphQL mutations
│       ├── projects.ts
│       ├── services.ts
│       └── blog.ts
├── generated/                 # Auto-generated types
│   └── graphql.ts
```

## Timeline Estimate

- **Phase 1 (Backend)**: 2-3 days
- **Phase 2 (Frontend)**: 1-2 days
- **Phase 3 (Migration)**: 3-5 days
- **Total**: ~1-2 weeks

