# Quick Start Guide

Get up and running with the Mouhajer monorepo in 5 minutes.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- Vercel Blob Storage account

## Setup Steps

### 1. Install Dependencies (1 min)

```bash
npm install
```

### 2. Configure CMS (2 min)

```bash
cd apps/cms
cp .env.example .env
```

Edit `.env` and set:
- `DATABASE_URL` - Your PostgreSQL connection string
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
- `NEXTAUTH_SECRET` - Run: `openssl rand -base64 32`

### 3. Configure Frontend (1 min)

```bash
cd apps/frontend
cp .env.example .env.local
```

For development, defaults are fine. Optionally set analytics IDs.

### 4. Setup Database (1 min)

```bash
cd apps/cms
npm run prisma:generate
npm run prisma:migrate
npm run db:seed  # Optional: adds sample data
```

### 5. Start Development (instant)

```bash
# From root directory
npm run dev
```

## Access Points

- **CMS**: http://localhost:3010
  - Login: `admin@mouhajerdesign.com` / `admin123`

- **Frontend**: http://localhost:3000
  - English: http://localhost:3000/en
  - Arabic: http://localhost:3000/ar

- **Prisma Studio**: http://localhost:5555
  - Database UI for viewing/editing data

- **GraphQL Playground**: http://localhost:3010/playground
  - Test GraphQL queries

## Common Commands

```bash
# Development
npm run dev              # Start all apps
npm run dev:cms          # Start only CMS
npm run dev:frontend     # Start only frontend

# Building
npm run build            # Build all apps
npm run build:cms        # Build only CMS
npm run build:frontend   # Build only frontend

# Database
cd apps/cms
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio
npm run db:seed          # Seed database

# Code Quality
npm run lint             # Lint all code
npm run format           # Format all code

# Cleanup
npm run clean            # Remove node_modules and build files
```

## Docker (Alternative Setup)

```bash
# Start all services with Docker
docker-compose up

# Run migrations
docker-compose exec cms sh -c "cd apps/cms && npm run prisma:migrate"

# Seed database
docker-compose exec cms sh -c "cd apps/cms && npm run db:seed"
```

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
cd apps/cms
npm run prisma:generate
```

### "Port already in use"
```bash
npx kill-port 3000 3010
```

### "Database connection failed"
Check your `DATABASE_URL` in `apps/cms/.env`

### "Module not found" errors
```bash
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

## Next Steps

1. ✅ Setup complete! Start developing
2. 📖 Read [README.md](README.md) for full project overview
3. 🏗️ Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
4. 🤝 Read [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow
5. 🔧 Read [SETUP.md](SETUP.md) for detailed setup options

## Getting Help

- **Documentation**: [README.md](README.md) | [SETUP.md](SETUP.md) | [ARCHITECTURE.md](ARCHITECTURE.md)
- **Email**: admin@mouhajerdesign.com

---

**You're all set! Happy coding! 🚀**
