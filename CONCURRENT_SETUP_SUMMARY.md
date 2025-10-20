# Concurrent Server Setup - Summary

## ✅ What Was Configured

I've set up your monorepo to run both CMS and Frontend servers concurrently with the correct ports.

### Port Configuration

| Service | Port | URL |
|---------|------|-----|
| **CMS (Backend)** | 3010 | http://localhost:3010 |
| **Frontend** | 3007 | http://localhost:3007 |
| **Prisma Studio** | 5555 | http://localhost:5555 |

---

## 🚀 How to Use

### Start Both Servers (One Command)

From the root directory:

```bash
npm run dev
```

**This will:**
- ✅ Start CMS on port 3010
- ✅ Start Frontend on port 3007
- ✅ Show colored output with clear labels
- ✅ Run both concurrently in a single terminal

**Output will look like:**
```
[CMS]      ▲ Next.js 14.2.18
[CMS]      - Local:        http://localhost:3010
[CMS]      ✓ Ready in 2.5s

[FRONTEND] ▲ Next.js 14.2.18
[FRONTEND] - Local:        http://localhost:3007
[FRONTEND] ✓ Ready in 1.8s
```

### Start Individually

**CMS Only:**
```bash
npm run dev:cms
```

**Frontend Only:**
```bash
npm run dev:frontend
```

---

## 📝 Files Modified

### 1. Root package.json
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:cms\" \"npm run dev:frontend\" --names \"CMS,FRONTEND\" --prefix-colors \"cyan,magenta\"",
    "dev:cms": "cd apps/cms && npm run dev:cms-only",
    "dev:frontend": "cd apps/frontend && npm run dev"
  },
  "devDependencies": {
    "concurrently": "^9.2.1"
  }
}
```

### 2. Frontend package.json (apps/frontend/package.json)
```json
{
  "scripts": {
    "dev": "next dev -p 3007",
    "start": "next start -p 3007"
  }
}
```

### 3. Environment Files

**CMS (.env and .env.example):**
```env
PORT=3010
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3007
```

**Frontend (.env.local and .env.example):**
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3007
```

### 4. Docker Compose (docker-compose.yml)
```yaml
cms:
  environment:
    NEXT_PUBLIC_FRONTEND_URL: http://localhost:3007

frontend:
  ports:
    - "3007:3007"
  environment:
    NEXT_PUBLIC_SITE_URL: http://localhost:3007
```

---

## 🔧 Installation Required

You need to install the new dependency (`concurrently`):

```bash
npm install
```

This will install:
- `concurrently@9.2.1` - For running multiple processes

---

## 🎯 Access Points

After running `npm run dev`, access:

### Frontend (Public Website)
- **URL**: http://localhost:3007
- **English**: http://localhost:3007/en
- **Arabic**: http://localhost:3007/ar

### CMS (Admin Panel)
- **URL**: http://localhost:3010
- **Login**: `admin@mouhajerdesign.com` / `admin123`

### Prisma Studio (Database UI)
- **URL**: http://localhost:5555
- Launched automatically with CMS

### GraphQL Playground
- **URL**: http://localhost:3010/playground

---

## 🐛 Troubleshooting

### Error: "Port already in use"

**Kill the ports:**
```bash
npx kill-port 3007 3010
```

### Error: "concurrently: command not found"

**Install dependencies:**
```bash
npm install
```

### CORS Errors

Restart the CMS after any environment changes:
```bash
npm run dev:cms
```

### Servers won't start

**Check your environment files exist:**
```bash
# CMS
ls apps/cms/.env

# Frontend
ls apps/frontend/.env.local
```

If missing, copy from examples:
```bash
cp apps/cms/.env.example apps/cms/.env
cp apps/frontend/.env.example apps/frontend/.env.local
```

---

## 📚 Additional Documentation

- **[PORT_CONFIGURATION.md](PORT_CONFIGURATION.md)** - Detailed port configuration guide
- **[QUICK_START.md](QUICK_START.md)** - Quick start guide
- **[README.md](README.md)** - Full project documentation
- **[SETUP.md](SETUP.md)** - Detailed setup instructions

---

## 🎨 Features

### Concurrent Script Features

✅ **Colored Output**: CMS (cyan), Frontend (magenta)
✅ **Process Names**: Clear labels for each service
✅ **Single Terminal**: No need for multiple terminal windows
✅ **Easy to Stop**: Ctrl+C stops both servers
✅ **Error Handling**: Shows errors from both services

### Why Use Concurrent Script?

**Before (without concurrent):**
```bash
# Terminal 1
cd apps/cms && npm run dev:cms-only

# Terminal 2
cd apps/frontend && npm run dev
```

**After (with concurrent):**
```bash
# One terminal
npm run dev
```

---

## 🔄 Alternative: Docker

If you prefer Docker:

```bash
docker-compose up
```

This will start:
- PostgreSQL (port 5432)
- CMS (port 3010)
- Frontend (port 3007)
- Prisma Studio (port 5555)

---

## ✨ Next Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start both servers:**
   ```bash
   npm run dev
   ```

3. **Visit the applications:**
   - Frontend: http://localhost:3007
   - CMS: http://localhost:3010

4. **Verify everything works:**
   - [ ] Frontend loads
   - [ ] CMS admin login works
   - [ ] Frontend fetches data from CMS
   - [ ] Both English and Arabic locales work

---

## 📦 Summary of Changes

| Item | Status | Notes |
|------|--------|-------|
| Root package.json | ✅ Updated | Added concurrent script |
| Frontend package.json | ✅ Updated | Changed port to 3007 |
| CMS .env | ✅ Updated | Frontend URL → 3007 |
| CMS .env.example | ✅ Updated | Frontend URL → 3007 |
| Frontend .env.local | ✅ Updated | Site URL → 3007 |
| Frontend .env.example | ✅ Updated | Site URL → 3007 |
| docker-compose.yml | ✅ Updated | Frontend port → 3007 |
| PORT_CONFIGURATION.md | ✅ Created | Port config guide |

---

## 🎉 Ready to Go!

Your monorepo is now configured to run both servers concurrently on the correct ports.

**Start developing:**
```bash
npm install  # First time only
npm run dev  # Start both servers
```

Happy coding! 🚀

---

**Created:** 2025-01-16
**Ports:** CMS (3010) | Frontend (3007)
