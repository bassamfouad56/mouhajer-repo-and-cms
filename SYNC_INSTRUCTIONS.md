# How to Sync Project to Mac Mini

## Quick Start

### Method 1: Using Git Bash (Recommended - Fastest)

Open a **new terminal** (to avoid shell profile interception) and run:

```bash
cd d:/wbsite/mouhajer-repo-and-cms
"C:\Program Files\Git\usr\bin\bash.exe" sync-files.sh
```

This will:
- ✅ Create the directory structure on your Mac Mini
- ✅ Sync all source code files
- ✅ Exclude images (jpg, png, gif, webp, svg, etc.)
- ✅ Exclude build artifacts (node_modules, .next, dist, build, .turbo)
- ✅ Exclude .env.local (for security)
- ✅ Show progress during transfer

**Estimated time:** 2-5 minutes depending on file size

---

## What Gets Synced

### ✅ Included:
- All source code (`.ts`, `.tsx`, `.js`, `.jsx`)
- Configuration files (`package.json`, `turbo.json`, etc.)
- Markdown documentation (`.md`)
- All CSS/Tailwind files
- All scripts and utilities
- Both `apps/frontend` and `apps/cms`
- All `packages/`

### ❌ Excluded:
- **Images**: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`, `.ico`, `.avif`, `.bmp`, `.tiff`
- **Videos**: `.mp4`, `.mov`, `.avi`, `.mkv`
- **Build artifacts**: `node_modules/`, `.next/`, `dist/`, `build/`, `.turbo/`
- **Git history**: `.git/`
- **Environment files**: `.env.local` (needs manual copy - see below)
- **Logs**: `*.log`
- **Upload directories**: `public/uploads/`, `public/images/`, `public/media/`

---

## After Sync: Setup on Mac Mini

1. **SSH into your Mac Mini:**
   ```bash
   ssh bassamfouad@100.111.21.66
   ```

2. **Navigate to project:**
   ```bash
   cd ~/Desktop/website/mouhajer-repo-and-cms
   ```

3. **Verify files arrived:**
   ```bash
   ls -la
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Copy .env.local manually (if needed):**

   From your Windows machine:
   ```bash
   scp "d:/wbsite/mouhajer-repo-and-cms/apps/frontend/.env.local" bassamfouad@100.111.21.66:~/Desktop/website/mouhajer-repo-and-cms/apps/frontend/.env.local
   ```

6. **Start development servers:**
   ```bash
   npm run dev
   ```

   Or individually:
   ```bash
   npm run dev:cms      # CMS only (port 3010)
   npm run dev:frontend # Frontend only (port 3007)
   ```

---

## Troubleshooting

### If rsync shows "command not found"
Make sure you're using Git Bash:
```bash
"C:\Program Files\Git\usr\bin\bash.exe" sync-files.sh
```

### If connection times out
Check Mac Mini is awake:
```bash
ping 100.111.21.66
```

### If permission denied
Verify SSH key is set up or you're entering the correct password

### To sync again (updates only)
Just run the same command - rsync only transfers changed files!

---

## File Size Information

Without images and build artifacts, the project should be:
- **Source code**: ~50-100 MB
- **With node_modules**: ~500 MB - 1 GB

---

## Environment Configuration

After syncing, you may need to update these files on Mac Mini:

### `apps/frontend/.env.local`
```env
NEXT_PUBLIC_CMS_URL=http://localhost:3010
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3010/api/graphql
REVALIDATION_SECRET=Ib2IFrbYhK6w9ur2KDbBQs8/F/2DuVySz8kpm4WKxeg=
USE_GRAPHQL=true
NEXT_PUBLIC_SITE_URL=http://localhost:3007
```

### `apps/cms/.env` (if exists)
Check if CMS has its own environment configuration and copy it manually.

---

## Verifying Sync Success

On Mac Mini, check these key files exist:

```bash
cd ~/Desktop/website/mouhajer-repo-and-cms

# Check root files
ls -la package.json turbo.json

# Check frontend
ls -la apps/frontend/package.json
ls -la apps/frontend/src/

# Check CMS
ls -la apps/cms/package.json
ls -la apps/cms/src/
```

---

## Re-syncing After Changes

To sync changes from Windows to Mac Mini again:

```bash
cd d:/wbsite/mouhajer-repo-and-cms
"C:\Program Files\Git\usr\bin\bash.exe" sync-files.sh
```

rsync will only transfer **changed files**, making subsequent syncs much faster!

---

## Alternative Method: Manual SCP (Slower)

If rsync doesn't work, you can use the PowerShell script:

```powershell
cd d:\wbsite\mouhajer-repo-and-cms
.\sync-to-mac-desktop.ps1
```

Note: This is slower as it doesn't have the smart "only changed files" feature of rsync.
