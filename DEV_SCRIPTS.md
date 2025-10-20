# Development Scripts Guide

Quick reference for starting and managing your development environment.

## 🚀 Quick Start

### Start Everything (Recommended)
```bash
./dev-start.sh
```

This single command will:
1. ✅ Sync Prisma schema to database
2. ✅ Generate Prisma client
3. ✅ Clean up old processes
4. ✅ Start CMS backend (port 3010)
5. ✅ Start Frontend (port 3000)

### Stop Everything
```bash
./dev-stop.sh
```

Cleanly stops all development services.

---

## 📍 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Public-facing website |
| **CMS** | http://localhost:3010 | Admin dashboard & API |
| **GraphQL Playground** | http://localhost:3010/api/graphql | GraphQL API explorer |
| **Prisma Studio** | Run separately with `npm run dev` in apps/cms | Database viewer |

---

## 📝 View Logs

### Real-time logs
```bash
# CMS logs
tail -f logs/cms.log

# Frontend logs
tail -f logs/frontend.log

# Both at once
tail -f logs/*.log
```

### Search logs
```bash
# Find errors in CMS
grep -i error logs/cms.log

# Find specific query
grep "GraphQL" logs/cms.log
```

---

## 🛠️ Manual Commands

If you prefer to start services individually:

### CMS Only
```bash
cd apps/cms
npm run dev:cms-only
```

### Frontend Only
```bash
cd apps/frontend
npm run dev
```

### Prisma Commands
```bash
cd apps/cms

# Push schema changes
npx prisma db push

# Generate client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Reset database (⚠️ DELETES ALL DATA)
npx prisma migrate reset
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3010
lsof -ti :3010 | xargs kill -9

# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or just run
./dev-stop.sh
```

### Prisma Client Out of Sync
```bash
cd apps/cms
npx prisma generate
```

### Database Schema Mismatch
```bash
cd apps/cms
npx prisma db push --accept-data-loss
```

### Clear Everything and Restart
```bash
./dev-stop.sh
rm -rf apps/cms/.next
rm -rf apps/frontend/.next
npm run clean  # if available
./dev-start.sh
```

---

## 📦 First Time Setup

If this is your first time running the project:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp apps/cms/.env.example apps/cms/.env
   cp apps/frontend/.env.example apps/frontend/.env
   # Edit .env files with your settings
   ```

3. Initialize database:
   ```bash
   cd apps/cms
   npx prisma db push
   npx prisma db seed
   ```

4. Start development:
   ```bash
   cd ../..
   ./dev-start.sh
   ```

---

## 🎯 Common Workflows

### Making Database Changes
```bash
# 1. Edit prisma/schema.prisma
# 2. Push changes
cd apps/cms
npx prisma db push

# 3. Restart CMS
cd ../..
./dev-stop.sh
./dev-start.sh
```

### Testing GraphQL Queries
1. Go to http://localhost:3010/api/graphql
2. Write your query in the left panel
3. Click "Play" to execute

### Adding New Pages
Frontend pages are automatically routed based on file structure in `apps/frontend/app/[locale]/`

---

## 💡 Tips

- **Use `dev-start.sh`** instead of manual starts - it handles Prisma automatically
- **Check logs first** when something breaks - they're in `logs/` directory
- **Prisma Studio** is great for viewing/editing database records
- **Auto-restart**: Both CMS and Frontend watch for file changes and reload automatically

---

## 🆘 Need Help?

- CMS Documentation: `apps/cms/README.md`
- Frontend Documentation: `apps/frontend/README.md`
- GraphQL API Guide: `apps/cms/GRAPHQL_API_GUIDE.md`
- CRM Guide: `apps/cms/CRM-GUIDE.md`
