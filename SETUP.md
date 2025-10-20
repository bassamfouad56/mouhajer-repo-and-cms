# Setup Guide - Mouhajer Monorepo

This guide will walk you through setting up the Mouhajer monorepo for local development.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Setup](#docker-setup-recommended)
4. [Database Setup](#database-setup)
5. [Vercel Blob Storage Setup](#vercel-blob-storage-setup)
6. [Common Issues](#common-issues)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js** v18.0.0 or higher
  ```bash
  node --version  # Should be >= 18.0.0
  ```

- **npm** v9.0.0 or higher
  ```bash
  npm --version  # Should be >= 9.0.0
  ```

- **Git**
  ```bash
  git --version
  ```

### Optional (for Docker setup)

- **Docker** v20.10.0 or higher
- **Docker Compose** v2.0.0 or higher

### External Services

- **PostgreSQL Database** (cloud or local)
  - Recommended providers: Vercel Postgres, Supabase, Railway, Neon
  - Minimum version: PostgreSQL 12+

- **Vercel Blob Storage** account
  - Sign up at: https://vercel.com/

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd mouhajer-monorepo
```

### Step 2: Install Dependencies

```bash
# Install all dependencies for all workspaces
npm install
```

This will install dependencies for:
- Root workspace
- `apps/cms`
- `apps/frontend`
- `packages/types`

### Step 3: Set Up CMS Environment

1. **Copy environment template:**
   ```bash
   cd apps/cms
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```bash
   # Open in your editor
   nano .env  # or code .env
   ```

3. **Configure required variables:**

   **Database URL:**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   ```

   Get your PostgreSQL connection string from your provider:
   - **Vercel Postgres**: Dashboard → Storage → Postgres → Connection String
   - **Supabase**: Settings → Database → Connection String
   - **Railway**: Database → Connect → PostgreSQL URL
   - **Local**: `postgresql://postgres:password@localhost:5432/mouhajer_cms`

   **Vercel Blob Storage:**
   ```env
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxx"
   NEXT_PUBLIC_BLOB_STORE_URL="https://xxxxx.public.blob.vercel-storage.com"
   ```

   Get these from: https://vercel.com/dashboard/stores/blob

   **NextAuth Secret:**
   ```bash
   # Generate a secure random secret
   openssl rand -base64 32
   ```

   Then add to `.env`:
   ```env
   NEXTAUTH_SECRET="<generated-secret-here>"
   ```

### Step 4: Set Up Frontend Environment

1. **Copy environment template:**
   ```bash
   cd apps/frontend
   cp .env.example .env.local
   ```

2. **Edit `.env.local` file:**
   ```env
   NEXT_PUBLIC_CMS_URL=http://localhost:3010
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3010/api/graphql
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

   For development, you can leave most variables as default.

### Step 5: Set Up Database

```bash
cd apps/cms

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database with sample data (optional but recommended)
npm run db:seed
```

This will create:
- Database schema (10 models)
- Default admin user: `admin@mouhajerdesign.com` / `admin123`
- Default editor user: `editor@mouhajerdesign.com` / `editor123`
- Sample projects, services, blog posts

### Step 6: Start Development Servers

From the **root directory**:

```bash
# Start all apps (CMS + Frontend + Prisma Studio)
npm run dev
```

This will start:
- **CMS**: http://localhost:3010
- **Frontend**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555

**Or start apps individually:**

```bash
# Only CMS
npm run dev:cms

# Only Frontend
npm run dev:frontend
```

### Step 7: Access the Applications

1. **CMS Admin Panel:**
   - URL: http://localhost:3010
   - Login: `admin@mouhajerdesign.com` / `admin123`

2. **Frontend Website:**
   - English: http://localhost:3000/en
   - Arabic: http://localhost:3000/ar

3. **Prisma Studio (Database UI):**
   - URL: http://localhost:5555

4. **GraphQL Playground:**
   - URL: http://localhost:3010/playground

---

## Docker Setup (Recommended)

Docker provides a consistent development environment and eliminates "works on my machine" issues.

### Step 1: Install Docker

- **macOS**: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

### Step 2: Configure Environment

Copy the environment templates as described in [Step 3](#step-3-set-up-cms-environment) and [Step 4](#step-4-set-up-frontend-environment) above.

**Note**: For Docker, use these database credentials:

```env
# apps/cms/.env
DATABASE_URL="postgresql://mouhajer:mouhajer_dev_password@postgres:5432/mouhajer_cms?sslmode=disable"
```

### Step 3: Start Services

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- CMS (port 3010)
- Frontend (port 3000)
- Prisma Studio (port 5555)

### Step 4: Run Database Migrations

```bash
# Execute migrations in the CMS container
docker-compose exec cms sh -c "cd apps/cms && npm run prisma:migrate"

# Seed the database
docker-compose exec cms sh -c "cd apps/cms && npm run db:seed"
```

### Step 5: Access Applications

Same as local setup:
- CMS: http://localhost:3010
- Frontend: http://localhost:3000
- Prisma Studio: http://localhost:5555

### Docker Commands

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (database data)
docker-compose down -v

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f cms

# Restart a service
docker-compose restart cms

# Execute commands in container
docker-compose exec cms sh
```

---

## Database Setup

### Option 1: Vercel Postgres (Recommended for Production)

1. Go to https://vercel.com/dashboard
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Copy the connection string
4. Add to `apps/cms/.env`:
   ```env
   DATABASE_URL="<your-vercel-postgres-url>"
   ```

### Option 2: Supabase (Free Tier Available)

1. Go to https://supabase.com/
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection String** (ensure SSL mode)
5. Add to `apps/cms/.env`

### Option 3: Railway (Free Tier Available)

1. Go to https://railway.app/
2. Create a new PostgreSQL database
3. Copy the **PostgreSQL Connection URL**
4. Add to `apps/cms/.env`

### Option 4: Local PostgreSQL

Install PostgreSQL locally:

**macOS:**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb mouhajer_cms
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb mouhajer_cms
```

**Windows:**
Download from: https://www.postgresql.org/download/windows/

Connection string:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mouhajer_cms"
```

---

## Vercel Blob Storage Setup

Vercel Blob is used for storing media files (images, videos, documents).

### Step 1: Create Blob Store

1. Go to https://vercel.com/dashboard
2. Navigate to **Storage** → **Create Database** → **Blob**
3. Give it a name: `mouhajer-media`
4. Choose region closest to your users

### Step 2: Get Credentials

1. Click on your blob store
2. Go to **Settings**
3. Copy:
   - **Read Write Token**
   - **Store URL**

### Step 3: Add to Environment

```env
# apps/cms/.env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
NEXT_PUBLIC_BLOB_STORE_URL="https://xxxxx.public.blob.vercel-storage.com"
```

### Alternative: AWS S3, Cloudinary, etc.

If you prefer other storage providers, you'll need to:
1. Update `apps/cms/src/lib/blob-upload.ts`
2. Install appropriate SDK
3. Configure credentials

---

## Common Issues

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
cd apps/cms
npm run prisma:generate
```

### Issue: "Database connection failed"

**Solutions:**
1. Check your `DATABASE_URL` in `.env`
2. Ensure database server is running
3. Check firewall/network settings
4. Verify credentials

```bash
# Test connection with psql
psql "<your-database-url>"
```

### Issue: "Port 3000 or 3010 already in use"

**Solution:**
```bash
# Kill processes on ports
npx kill-port 3000 3010

# Or specify different ports
PORT=3011 npm run dev:cms
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clean install
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm package-lock.json apps/*/package-lock.json packages/*/package-lock.json
npm install
```

### Issue: "Prisma migration failed"

**Solution:**
```bash
cd apps/cms

# Reset database (WARNING: This will delete all data)
npm run prisma:migrate reset

# Or push schema without migration
npm run db:push
```

### Issue: "NextAuth session not persisting"

**Solution:**
1. Ensure `NEXTAUTH_SECRET` is set and is 32+ characters
2. Clear browser cookies
3. Check `NEXTAUTH_URL` matches your domain

```bash
# Generate new secret
openssl rand -base64 32
```

### Issue: Docker build fails

**Solution:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Docker logs
docker-compose logs
```

---

## Verification Checklist

After setup, verify everything is working:

- [ ] CMS loads at http://localhost:3010
- [ ] Can log in with admin credentials
- [ ] Prisma Studio accessible at http://localhost:5555
- [ ] Database has seeded data
- [ ] Frontend loads at http://localhost:3000
- [ ] Frontend shows content from CMS
- [ ] GraphQL playground works at http://localhost:3010/playground
- [ ] Can upload images in CMS
- [ ] Both English and Arabic locales work on frontend

---

## Next Steps

Once setup is complete:

1. **Explore the CMS**: Log in and familiarize yourself with the admin interface
2. **Check the Frontend**: Visit the website and see the content
3. **Read the Architecture Guide**: See [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Start Development**: See main [README.md](README.md) for development workflow

---

## Getting Help

If you encounter issues not covered here:

1. Check the main [README.md](README.md)
2. Review [ARCHITECTURE.md](ARCHITECTURE.md)
3. Search existing issues
4. Contact: admin@mouhajerdesign.com

---

**Happy Coding! 🚀**
