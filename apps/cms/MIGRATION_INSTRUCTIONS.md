# Database Migration Instructions

## Current Status

The ProjectHandoff model has been added to the Prisma schema, but the database migration could not be executed automatically due to:
1. Database server is not reachable from the current environment
2. Dev server (PID 25512) has Prisma files locked

## Migration Options

### Option 1: Restart Dev Server (Recommended - Easiest)

The dev server will automatically detect schema changes and apply them:

```bash
# Stop the current dev server (Ctrl+C in the terminal where it's running)
# Or kill the process:
taskkill /F /PID 25512

# Start the dev server again
npm run dev
```

When the server starts, it will:
- Detect the new ProjectHandoff model
- Automatically sync the database schema
- Generate the Prisma client with TypeScript types

### Option 2: Manual Migration (If Option 1 doesn't work)

1. **Stop the dev server first**:
   ```bash
   taskkill /F /PID 25512
   ```

2. **Run Prisma migration**:
   ```bash
   cd d:\Desktop\wbsite\mouhajer-cms
   npx prisma migrate dev --name add_project_handoff
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Option 3: Direct Schema Push (Development Only)

```bash
# Stop dev server first
taskkill /F /PID 25512

# Push schema changes
npx prisma db push

# Generate client
npx prisma generate

# Restart server
npm run dev
```

### Option 4: Manual SQL (Last Resort)

If all Prisma commands fail, you can manually execute this SQL:

```sql
-- Create project_handoffs table
CREATE TABLE "project_handoffs" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "project_id" TEXT NOT NULL UNIQUE,

  -- Project Details
  "completion_date" TIMESTAMP(3),
  "duration" TEXT,
  "square_footage" TEXT,
  "number_of_rooms" TEXT,
  "budget_range" TEXT,
  "budget_amount" DOUBLE PRECISION,
  "design_software" TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Client Information
  "client_name" TEXT,
  "client_company" TEXT,
  "client_testimonial_en" TEXT,
  "client_testimonial_ar" TEXT,
  "client_rating" INTEGER,
  "use_client_name" BOOLEAN NOT NULL DEFAULT false,
  "use_client_photos" BOOLEAN NOT NULL DEFAULT true,
  "allow_reference" BOOLEAN NOT NULL DEFAULT false,

  -- Design Story
  "design_concept_en" TEXT,
  "design_concept_ar" TEXT,
  "challenges_en" TEXT,
  "challenges_ar" TEXT,
  "solutions_en" TEXT,
  "solutions_ar" TEXT,
  "unique_features_en" TEXT,
  "unique_features_ar" TEXT,
  "inspiration_sources" TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Team & Credits
  "lead_designers" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "contractors" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "suppliers" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "consultants" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "awards" TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Marketing Assets
  "before_photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "video_links" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "virtual_tour_links" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "floor_plans" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "mood_boards" TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- SEO & Marketing
  "target_keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "target_audience" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "best_platforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "geographic_focus" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "selling_points" TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Workflow
  "status" TEXT NOT NULL DEFAULT 'draft',
  "submitted_by" TEXT,
  "submitted_at" TIMESTAMP(3),
  "approved_by" TEXT,
  "approved_at" TIMESTAMP(3),
  "notes" TEXT,

  -- Timestamps
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL
);

-- Create indexes
CREATE INDEX "project_handoffs_project_id_idx" ON "project_handoffs"("project_id");
CREATE INDEX "project_handoffs_status_idx" ON "project_handoffs"("status");
CREATE INDEX "project_handoffs_submitted_by_idx" ON "project_handoffs"("submitted_by");
CREATE INDEX "project_handoffs_approved_by_idx" ON "project_handoffs"("approved_by");
```

Then run:
```bash
npx prisma generate
```

## Verification

After running the migration, verify it worked:

```bash
# Check database tables
npx prisma db pull

# Or check in the application
# Go to: http://localhost:3010/projects
# Click "📋 Handoff" button on any project
# You should see the 6-step handoff form
```

## Testing the Feature

1. Navigate to: `http://localhost:3010/projects`
2. Click **"📋 Handoff"** on any project
3. Fill out the multi-step form
4. Test auto-save (wait 30 seconds)
5. Submit to marketing
6. Check: `http://localhost:3010/marketing/handoffs`

## Troubleshooting

### Error: "Can't reach database server"
- Check your internet connection
- Verify `.env` has correct `DATABASE_URL`
- Try restarting your computer/network

### Error: "EPERM: operation not permitted"
- Stop the dev server completely
- Close VSCode/IDE if it has Prisma extensions running
- Try again

### Error: "Table already exists"
- The migration already ran successfully!
- Just run: `npx prisma generate`

## Need Help?

If you encounter issues:
1. Check the dev server console for errors
2. Look at browser console at: `http://localhost:3010/projects/[any-id]/handoff`
3. Verify the ProjectHandoff model in `prisma/schema.prisma` (lines 327-399)

---

**Recommended Next Step**: Simply restart your dev server. It should handle everything automatically! 🚀
