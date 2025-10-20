# Development Server Guide

## Running the Development Environment

### Single Command - Runs Both Servers

```bash
npm run dev
```

This will start **both**:
- **CMS (Next.js)**: http://localhost:3010
- **Prisma Studio**: http://localhost:5555

Both servers run in parallel with color-coded output:
- `[CMS]` in **cyan** - Your Next.js application
- `[Prisma]` in **magenta** - Database management interface

### Individual Server Commands

If you need to run servers separately:

```bash
# Run only the CMS (Next.js)
npm run dev:cms-only
# or
npm run dev:next

# Run only Prisma Studio
npm run dev:prisma
# or
npm run prisma:studio
```

## What Each Server Does

### CMS Server (Port 3010)
**Your main application:**
- Main dashboard: http://localhost:3010
- Projects management: http://localhost:3010/projects
- Project handoff form: http://localhost:3010/projects/[id]/handoff
- Marketing handoffs: http://localhost:3010/marketing/handoffs
- CRM features: http://localhost:3010/crm/*
- GraphQL Playground: http://localhost:3010/playground

### Prisma Studio (Port 5555)
**Database management interface:**
- Visual database browser: http://localhost:5555
- View all tables
- Edit records directly
- Filter and search data
- Perfect for debugging and data management

**Key Features:**
- ✅ View `project_handoffs` table
- ✅ Inspect relationships
- ✅ Quick data edits
- ✅ Browse all CMS data

## Stopping the Servers

Since both run together, you can stop them with:
- **Ctrl+C** in the terminal (stops both)
- Or kill the process:
  ```bash
  # Find the process
  netstat -ano | findstr :3010

  # Kill it (replace PID with actual process ID)
  taskkill //F //PID <PID>
  ```

## Common Workflows

### Starting Development
```bash
npm run dev
```
Then open:
- http://localhost:3010 (main app)
- http://localhost:5555 (database viewer)

### Working with Handoffs
1. Create/edit a project at http://localhost:3010/projects
2. Click "📋 Handoff" button
3. Fill out the 6-step form
4. Check the data in Prisma Studio at http://localhost:5555
5. View handoff in marketing dashboard

### Database Changes
```bash
# Stop servers (Ctrl+C)

# Make schema changes in prisma/schema.prisma

# Push changes to database
npm run db:push

# Restart servers
npm run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both CMS and Prisma Studio |
| `npm run dev:next` | Start only Next.js CMS |
| `npm run dev:prisma` | Start only Prisma Studio |
| `npm run dev:cms-only` | Alias for dev:next |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Create/apply migrations |
| `npm run prisma:studio` | Start Prisma Studio only |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Seed database with sample data |

## Port Information

| Service | Port | URL |
|---------|------|-----|
| Next.js CMS | 3010 | http://localhost:3010 |
| Prisma Studio | 5555 | http://localhost:5555 |

## Troubleshooting

### Port Already in Use

If you see `EADDRINUSE` error:

```bash
# Check what's using the port
netstat -ano | findstr :3010
netstat -ano | findstr :5555

# Kill the process
taskkill //F //PID <PID>

# Restart
npm run dev
```

### Prisma Studio Won't Start

```bash
# Stop all servers
# Ctrl+C or kill process

# Clear Prisma cache
npx prisma generate

# Restart
npm run dev
```

### Database Connection Issues

```bash
# Verify .env file has correct DATABASE_URL
cat .env | grep DATABASE

# Test connection
npx prisma db pull

# Restart servers
npm run dev
```

## Development Tips

1. **Keep Prisma Studio open** - Great for debugging database issues
2. **Use browser DevTools** - Network tab shows API calls
3. **Check both consoles** - Terminal shows server logs, browser shows client logs
4. **Hot reload works** - Both servers auto-reload on file changes
5. **Database changes need restart** - After schema changes, restart `npm run dev`

## Production Deployment

For production, only run the CMS:

```bash
# Build
npm run build

# Start production server
npm run start
```

Prisma Studio should **NOT** be exposed in production. It's a development tool only.

---

**Quick Reference:**
- Start everything: `npm run dev`
- CMS: http://localhost:3010
- Database UI: http://localhost:5555
- Stop: Ctrl+C
