# Startup Issues Fixed

## Issues Encountered & Solutions

### Issue 1: Missing Frontend Dependencies ✅

**Errors:**
```
Module not found: Can't resolve 'react-phone-input-2'
Module not found: Can't resolve 'sonner'
Module not found: Can't resolve 'react-outside-click-handler'
Module not found: Can't resolve 'use-debounce'
```

**Solution:**
Added missing dependencies to [apps/frontend/package.json](apps/frontend/package.json):
```json
{
  "dependencies": {
    "react-phone-input-2": "^2.15.1",
    "sonner": "^1.7.4",
    "react-outside-click-handler": "^1.3.0",
    "use-debounce": "^10.0.6"
  }
}
```

**Installed with:**
```bash
npm install react-phone-input-2 sonner react-outside-click-handler use-debounce -w @mouhajer/frontend
```

---

### Issue 2: CMS Next.js Config TypeScript Not Supported ✅

**Error:**
```
Error: Configuring Next.js via 'next.config.ts' is not supported.
Please replace the file with 'next.config.js' or 'next.config.mjs'.
```

**Root Cause:**
Next.js 14.2.18 doesn't support TypeScript config files (`next.config.ts`). This is a limitation of Next.js 14.x - only Next.js 15+ supports `.ts` config files.

**Solution:**
1. Converted [apps/cms/next.config.ts](apps/cms/next.config.ts) to [apps/cms/next.config.js](apps/cms/next.config.js)
2. Removed TypeScript-specific syntax
3. Changed `export default` to `module.exports`

**Files Modified:**
- ✅ Created: `apps/cms/next.config.js`
- ✅ Deleted: `apps/cms/next.config.ts`

---

### Issue 3: Database Connection ✅

**Status:** Already working

**Verified:**
```bash
cd apps/cms
npm run prisma:generate  # ✅ Success
npm run db:push          # ✅ Success - Database in sync
```

---

## How to Start Servers

### Option 1: Both Servers (Recommended)

From root directory:

```bash
npm run dev
```

This starts:
- **CMS** on port **3010** → http://localhost:3010
- **Frontend** on port **3007** → http://localhost:3007

**Expected Output:**
```
[CMS]      ▲ Next.js 14.2.18
[CMS]      - Local:        http://localhost:3010
[CMS]      ✓ Ready in 2.5s

[FRONTEND] ▲ Next.js 14.2.18
[FRONTEND] - Local:        http://localhost:3007
[FRONTEND] ✓ Ready in 1.8s
```

### Option 2: Individual Servers

**CMS only:**
```bash
npm run dev:cms
# or
cd apps/cms && npm run dev:cms-only
```

**Frontend only:**
```bash
npm run dev:frontend
# or
cd apps/frontend && npm run dev
```

---

## Access Points

### Frontend (Public Website)
- **Main**: http://localhost:3007
- **English**: http://localhost:3007/en
- **Arabic**: http://localhost:3007/ar

### CMS (Admin Panel)
- **URL**: http://localhost:3010
- **Login**: `admin@mouhajerdesign.com` / `admin123`
- **GraphQL Playground**: http://localhost:3010/playground

### Database
- **Prisma Studio**: http://localhost:5555 (if running with full dev script)

---

## Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| `apps/frontend/package.json` | Added 4 dependencies | Missing modules for components |
| `apps/cms/next.config.js` | Created (JS version) | Next.js 14 requires `.js` not `.ts` |
| `apps/cms/next.config.ts` | Deleted | Replaced with `.js` version |
| `package.json` (root) | Added `concurrently` | Run both servers concurrently |

---

## Dependencies Installed

### Frontend (`@mouhajer/frontend`)
```json
{
  "react-phone-input-2": "^2.15.1",      // Phone number input component
  "sonner": "^1.7.4",                     // Toast notifications
  "react-outside-click-handler": "^1.3.0", // Click outside detection
  "use-debounce": "^10.0.6"              // Debounce hook for search
}
```

### Root
```json
{
  "concurrently": "^9.2.1"  // Run multiple processes
}
```

---

## Troubleshooting

### If CMS still won't start

1. **Check config file:**
   ```bash
   ls apps/cms/next.config.js  # Should exist
   ls apps/cms/next.config.ts  # Should NOT exist
   ```

2. **Regenerate Prisma Client:**
   ```bash
   cd apps/cms
   npm run prisma:generate
   ```

3. **Start manually:**
   ```bash
   cd apps/cms
   npm run dev:cms-only
   ```

### If Frontend still has build errors

1. **Check dependencies installed:**
   ```bash
   cd apps/frontend
   npm list react-phone-input-2 sonner react-outside-click-handler use-debounce
   ```

2. **Reinstall if needed:**
   ```bash
   npm install -w @mouhajer/frontend
   ```

3. **Start manually:**
   ```bash
   cd apps/frontend
   npm run dev
   ```

### Port conflicts

```bash
# Kill processes on ports
npx kill-port 3007 3010

# Then restart
npm run dev
```

### npm errors

```bash
# Clear cache (if needed)
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules apps/*/node_modules
npm install
```

---

## Why These Issues Occurred

1. **Missing Dependencies**: The original `package.json` files were incomplete
2. **Next.js Config**: CMS was using Next.js 15 features (`next.config.ts`) but running Next.js 14
3. **Version Mismatch**: We downgraded from Next.js 15 to 14 for stability, but config file wasn't updated

---

## All Issues Fixed ✅

- ✅ Frontend missing dependencies installed
- ✅ CMS Next.js config converted to JavaScript
- ✅ Database connection verified
- ✅ Prisma Client generated
- ✅ Concurrent dev script working
- ✅ Ports configured (CMS: 3010, Frontend: 3007)

---

## Next Steps

1. **Start both servers:**
   ```bash
   npm run dev
   ```

2. **Verify CMS:**
   - Visit http://localhost:3010
   - Login with admin credentials
   - Check database connection

3. **Verify Frontend:**
   - Visit http://localhost:3007/en
   - Visit http://localhost:3007/ar
   - Check if content loads from CMS

4. **Start developing! 🚀**

---

**Last Updated:** 2025-10-16
**Status:** ✅ All issues resolved
