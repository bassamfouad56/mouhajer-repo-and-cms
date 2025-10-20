# CMS Integration Guide

## For Claude Code Users

### Context Prompts

When working on the **Mouhajer Frontend** (`mouhajer-repo`), use this context:
```
I'm working on the Mouhajer frontend (mouhajer-repo) - a Next.js client that CONSUMES data from a separate CMS backend. The CMS backend is in a different repository called mouhajer-cms. This frontend fetches data via REST API from the CMS.
```

When working on the **Mouhajer CMS Backend** (`mouhajer-cms`), use this context:
```
I'm working on the Mouhajer CMS backend (mouhajer-cms) - a headless CMS that PROVIDES data to a separate Next.js frontend. The frontend is in a different repository called mouhajer-repo. This CMS exposes REST API endpoints that the frontend consumes.
```

---

## Project Relationship

```
┌─────────────────────────┐          API Calls         ┌─────────────────────────┐
│   mouhajer-cms          │◄──────────────────────────│   mouhajer-repo         │
│   (Backend/CMS)         │                            │   (Frontend/Client)     │
│                         │                            │                         │
│   - Express/Next API    │         JSON Data         │   - Next.js 14 App      │
│   - Firebase/Database   │───────────────────────────►│   - React Components    │
│   - Admin Dashboard     │                            │   - Public Website      │
│   - Content Management  │                            │   - Displays Content    │
│                         │                            │                         │
│   Port: 3010           │                            │   Port: 3000           │
└─────────────────────────┘                            └─────────────────────────┘
```

---

## API Endpoints Reference

### Base URL
- **Development**: `http://localhost:3010`
- **Production**: `https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app`

### Endpoints

| Endpoint | Method | Description | Used In Frontend |
|----------|--------|-------------|------------------|
| `/api/settings` | GET | Site-wide settings | Layout, SEO, Contact info |
| `/api/projects` | GET | All projects | Projects page, Featured projects |
| `/api/projects/:id` | GET | Single project | Project detail page |
| `/api/services` | GET | All services | Services page, Featured services |
| `/api/services/:id` | GET | Single service | Service detail page |
| `/api/blog` | GET | Blog posts | Blog listing, Featured blogs |
| `/api/blog/:id` | GET | Single blog post | Blog detail page |
| `/api/pages` | GET | Dynamic pages | Homepage, About page, etc. |
| `/api/pages/:id` | GET | Single page | Dynamic page rendering |
| `/api/media` | GET | Media library | Images throughout the site |
| `/api/ads` | GET | Advertisements | Ad banners, popups |

---

## Data Flow Example

### Example: Displaying Projects on Homepage

**Frontend (`mouhajer-repo`):**
```typescript
// app/[locale]/page.tsx
import { cmsClient } from '@/lib/cms-client';

export default async function Home() {
  const featuredProjects = await cmsClient.getFeaturedProjects();

  return <PortfolioHomePageDisplay projects={featuredProjects} />;
}
```

**CMS Backend (`mouhajer-cms`):**
```typescript
// Should provide this endpoint
// GET /api/projects
// Returns: [{ id, title: {en, ar}, featured: true, ... }]
```

---

## Environment Variables

### Frontend (mouhajer-repo)
```env
# .env.local or .env.production
NEXT_PUBLIC_CMS_URL=http://localhost:3010
```

### Backend (mouhajer-cms)
```env
# .env
PORT=3010
CORS_ORIGIN=http://localhost:3000,https://your-production-domain.com
```

---

## Local Development Setup

### 1. Start CMS Backend First
```bash
cd mouhajer-cms
npm install
npm run dev
# Should run on http://localhost:3010
```

### 2. Start Frontend
```bash
cd mouhajer-repo
npm install
npm run dev
# Should run on http://localhost:3000
```

### 3. Verify Connection
- Frontend should fetch data from `http://localhost:3010/api/*`
- Check browser Network tab for API calls
- Check CMS backend logs for incoming requests

---

## Common Issues & Solutions

### Issue: Frontend shows "Service Unavailable"
**Cause**: CMS backend is not running or URL is wrong

**Solution**:
1. Verify CMS backend is running: `curl http://localhost:3010/api/settings`
2. Check `NEXT_PUBLIC_CMS_URL` in `.env.local`
3. Check CORS settings in CMS backend

### Issue: Data not updating
**Cause**: Frontend is using cached data

**Solution**:
1. Clear Next.js cache: `rm -rf .next`
2. Restart dev server
3. Check CMS cache settings (revalidate time is 60s)

### Issue: TypeScript errors
**Cause**: CMS data structure doesn't match frontend types

**Solution**:
1. Update `lib/cms-types.ts` in frontend
2. Verify CMS API response matches expected types
3. Add proper type guards in frontend

---

## Making Changes

### Adding a New Field to Existing Content

**In CMS Backend (`mouhajer-cms`):**
1. Add field to database schema
2. Update API response to include new field
3. Test endpoint returns correct data

**In Frontend (`mouhajer-repo`):**
1. Update type in `lib/cms-types.ts`
2. Update components using that data
3. Test display

### Adding a New Content Type

**In CMS Backend (`mouhajer-cms`):**
1. Create database model
2. Create CRUD API endpoints
3. Add admin UI for managing content
4. Document the API endpoint

**In Frontend (`mouhajer-repo`):**
1. Add type to `lib/cms-types.ts`
2. Add API method to `lib/cms-client.ts`
3. Create page/component to display
4. Update this documentation

---

## Testing

### Testing CMS Endpoints (Backend)
```bash
# Test settings endpoint
curl http://localhost:3010/api/settings

# Test projects endpoint
curl http://localhost:3010/api/projects

# Test specific project
curl http://localhost:3010/api/projects/123
```

### Testing Frontend Integration
1. Start both servers
2. Open http://localhost:3000
3. Check browser console for errors
4. Verify data displays correctly
5. Check Network tab for API calls

---

## Deployment

### Backend Deployment
1. Deploy `mouhajer-cms` to Vercel/hosting
2. Note the production URL
3. Configure CORS to allow frontend domain

### Frontend Deployment
1. Update `.env.production` with CMS production URL
2. Deploy `mouhajer-repo` to Vercel/hosting
3. Verify API calls work in production

---

## For AI Assistants (Claude Code)

### When in `mouhajer-repo` (Frontend):
- ✅ Modify components, pages, layouts
- ✅ Update API client calls (`lib/cms-client.ts`)
- ✅ Update TypeScript types (`lib/cms-types.ts`)
- ❌ Don't try to modify API endpoints (those are in `mouhajer-cms`)
- ❌ Don't try to modify database schemas
- ❌ Don't try to create admin interfaces

### When in `mouhajer-cms` (Backend):
- ✅ Modify API endpoints
- ✅ Update database schemas
- ✅ Create admin dashboard features
- ✅ Manage content storage
- ❌ Don't try to modify frontend components
- ❌ Don't try to modify Next.js pages
- ❌ Don't try to modify React components

---

*Last Updated: January 2025*
