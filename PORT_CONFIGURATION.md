# Port Configuration Guide

This document explains the port configuration for the Mouhajer monorepo.

## Port Allocation

| Service           | Port | URL                   | Description            |
| ----------------- | ---- | --------------------- | ---------------------- |
| **Frontend**      | 3007 | http://localhost:3007 | Public website (EN/AR) |
| **CMS**           | 3010 | http://localhost:3010 | Admin panel & API      |
| **Prisma Studio** | 5555 | http://localhost:5555 | Database UI            |
| **PostgreSQL**    | 5432 | localhost:5432        | Database server        |

## Why Port 3007?

- **CMS**: Port 3010 (as originally configured)
- **Frontend**: Port 3007 (changed from 3000)
  - Avoids conflicts with common dev servers on port 3000
  - Clear separation from CMS port

## Running Both Servers

### Option 1: Concurrent Script (Recommended)

Run both CMS and Frontend together from the root:

```bash
npm run dev
```

This will start:

- ✅ CMS on port 3010
- ✅ Frontend on port 3007
- ✅ Both running concurrently with colored output

**Output:**

```
[CMS]      ▲ Next.js 14.2.18
[CMS]      - Local:        http://localhost:3010

[FRONTEND] ▲ Next.js 14.2.18
[FRONTEND] - Local:        http://localhost:3007
```

### Option 2: Run Individually

**CMS Only:**

```bash
npm run dev:cms
# or
cd apps/cms && npm run dev:cms-only
```

**Frontend Only:**

```bash
npm run dev:frontend
# or
cd apps/frontend && npm run dev
```

### Option 3: Docker

Run everything with Docker:

```bash
docker-compose up
```

Access:

- Frontend: http://localhost:3007
- CMS: http://localhost:3010
- Prisma Studio: http://localhost:5555

## Environment Configuration

### CMS Environment (apps/cms/.env)

```env
PORT=3010
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3007
NEXT_PUBLIC_API_URL=http://localhost:3010/api
```

### Frontend Environment (apps/frontend/.env.local)

```env
NEXT_PUBLIC_CMS_URL=http://localhost:3010
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3010/api/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3007
```

## Changing Ports

If you need to use different ports:

### Change Frontend Port

1. **Update package.json:**

   ```json
   // apps/frontend/package.json
   "scripts": {
     "dev": "next dev -p YOUR_PORT",
     "start": "next start -p YOUR_PORT"
   }
   ```

2. **Update environment files:**

   ```env
   # apps/cms/.env
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:YOUR_PORT

   # apps/frontend/.env.local
   NEXT_PUBLIC_SITE_URL=http://localhost:YOUR_PORT
   ```

3. **Update docker-compose.yml:**
   ```yaml
   frontend:
     ports:
       - 'YOUR_PORT:YOUR_PORT'
     environment:
       NEXT_PUBLIC_SITE_URL: http://localhost:YOUR_PORT
   ```

### Change CMS Port

1. **Update package.json:**

   ```json
   // apps/cms/package.json
   "scripts": {
     "dev:next": "next dev -p YOUR_PORT"
   }
   ```

2. **Update environment files:**

   ```env
   # apps/cms/.env
   PORT=YOUR_PORT
   NEXTAUTH_URL=http://localhost:YOUR_PORT
   NEXT_PUBLIC_API_URL=http://localhost:YOUR_PORT/api

   # apps/frontend/.env.local
   NEXT_PUBLIC_CMS_URL=http://localhost:YOUR_PORT
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:YOUR_PORT/api/graphql
   ```

3. **Update docker-compose.yml:**
   ```yaml
   cms:
     ports:
       - 'YOUR_PORT:YOUR_PORT'
     environment:
       PORT: YOUR_PORT
       NEXTAUTH_URL: http://localhost:YOUR_PORT
   ```

## Troubleshooting

### Port Already in Use

**Error:**

```
Error: listen EADDRINUSE: address already in use :::3007
```

**Solutions:**

1. **Kill process on port:**

   ```bash
   # Kill specific ports
   npx kill-port 3007 3010

   # Or find and kill manually (Mac/Linux)
   lsof -ti:3007 | xargs kill -9

   # Windows
   netstat -ano | findstr :3007
   taskkill /PID <PID> /F
   ```

2. **Use different port temporarily:**

   ```bash
   # Frontend
   cd apps/frontend
   npm run dev -- -p 3008

   # CMS
   cd apps/cms
   PORT=3011 npm run dev:cms-only
   ```

### Can't Access Frontend

**Check:**

1. Frontend is running: `http://localhost:3007`
2. CMS is running: `http://localhost:3010`
3. Environment variables are correct
4. No firewall blocking ports

**Test:**

```bash
# Check if ports are listening
netstat -an | grep 3007
netstat -an | grep 3010
```

### CORS Errors

If you see CORS errors in browser console:

1. **Check CMS environment:**

   ```env
   # apps/cms/.env
   NEXT_PUBLIC_FRONTEND_URL=http://localhost:3007
   ```

2. **Restart CMS** after changing environment:
   ```bash
   npm run dev:cms
   ```

## Production Considerations

In production, update URLs to your actual domains:

**CMS (.env.production):**

```env
NEXT_PUBLIC_FRONTEND_URL=https://mahermouhajer.com
NEXTAUTH_URL=https://cms.mahermouhajer.com
```

**Frontend (.env.production):**

```env
NEXT_PUBLIC_CMS_URL=https://cms.mahermouhajer.com
NEXT_PUBLIC_SITE_URL=https://mahermouhajer.com
```

Vercel automatically handles ports in production - you don't need to specify them.

## Quick Reference

```bash
# Start both servers
npm run dev

# Start CMS only (port 3010)
npm run dev:cms

# Start Frontend only (port 3007)
npm run dev:frontend

# Kill ports
npx kill-port 3007 3010

# Check what's running on port
lsof -ti:3007  # Mac/Linux
netstat -ano | findstr :3007  # Windows

# Docker
docker-compose up
docker-compose down
```

## Access URLs

### Development

- 🌐 **Frontend**: http://localhost:3007
  - English: http://localhost:3007/en
  - Arabic: http://localhost:3007/ar
- 🔐 **CMS Admin**: http://localhost:3010
  - Login: `admin@mouhajerdesign.com` / `admin123`
- 🗄️ **Prisma Studio**: http://localhost:5555
- 🔧 **GraphQL Playground**: http://localhost:3010/playground

### Production

- 🌐 **Frontend**: https://mahermouhajer.com
- 🔐 **CMS Admin**: https://your-cms-domain.vercel.app

---

**Last Updated:** 2025-01-16
