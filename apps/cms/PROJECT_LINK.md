# Project Linking Guide

## Current Setup

Both `mouhajer-repo` and `mouhajer-cms` appear to be **the same codebase** (or very similar), but configured differently:

- **mouhajer-repo**: Main frontend repository
- **mouhajer-cms**: CMS/Admin dashboard instance

## Directory Structure
```
D:\Desktop\wbsite\
├── mouhajer-repo/     # Main frontend (client-facing website)
├── mouhajer-cms/      # CMS Admin dashboard
└── (potential) actual-cms-backend/  # Headless CMS API server (if separate)
```

## Linking Strategy

### Option 1: They ARE the same codebase
If both are the same Next.js app with different configurations:

**mouhajer-repo** → Public website (port 3000)
**mouhajer-cms** → Admin dashboard (port 3010)

#### Configuration:
```env
# mouhajer-repo/.env.local
NEXT_PUBLIC_CMS_URL=http://localhost:3010
NEXT_PUBLIC_API_URL=http://localhost:3010/api

# mouhajer-cms/.env.local
PORT=3010
NODE_ENV=development
NEXT_PUBLIC_ADMIN_MODE=true
```

### Option 2: They need a separate backend
If you need a true headless CMS, you should:

1. **Create API endpoints** in `mouhajer-cms`:
   ```
   mouhajer-cms/app/api/
   ├── settings/route.ts
   ├── projects/route.ts
   ├── services/route.ts
   ├── blog/route.ts
   ├── pages/route.ts
   └── media/route.ts
   ```

2. **Frontend consumes** from `mouhajer-repo`

3. **Both run simultaneously**:
   ```bash
   # Terminal 1
   cd mouhajer-cms
   npm run dev  # Runs on :3010

   # Terminal 2
   cd mouhajer-repo
   npm run dev  # Runs on :3000
   ```

## Current State Analysis

Based on the repositories:
- Both have same dependencies (Next.js, React, etc.)
- Both have `[locale]` folder structure
- Both are frontend applications

**Recommendation**: Create API routes in `mouhajer-cms` to serve data to `mouhajer-repo`

## Next Steps

### 1. Add API Routes to mouhajer-cms

Create these files in `mouhajer-cms`:

```typescript
// app/api/settings/route.ts
export async function GET() {
  return Response.json({
    siteName: { en: 'Mouhajer', ar: 'مهاجر' },
    // ... rest of settings
  });
}

// app/api/projects/route.ts
export async function GET() {
  const projects = await getProjectsFromDatabase();
  return Response.json(projects);
}

// ... etc for all endpoints
```

### 2. Update mouhajer-repo to consume APIs

Already done! The `lib/cms-client.ts` is configured to fetch from CMS_URL.

### 3. Run both projects

```bash
# Start CMS backend (serves API)
cd D:\Desktop\wbsite\mouhajer-cms
npm run dev -- -p 3010

# Start Frontend (consumes API)
cd D:\Desktop\wbsite\mouhajer-repo
npm run dev -- -p 3000
```

## Environment Configuration

### mouhajer-cms/.env.local
```env
PORT=3010
NODE_ENV=development

# Database (Firebase/Firestore)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3010
```

### mouhajer-repo/.env.local
```env
# CMS API URL
NEXT_PUBLIC_CMS_URL=http://localhost:3010

# Frontend runs on default port 3000
```

## Testing the Link

```bash
# Test CMS API is working
curl http://localhost:3010/api/settings

# Test Frontend can fetch from CMS
# Open http://localhost:3000 and check browser console
```

---

**Need Help?**
See `CMS_INTEGRATION.md` in either repository for detailed integration docs.
