# 🚀 Mouhajer CMS - Production Deployment Guide

Complete guide to deploy your CMS to production on Vercel.

## 📋 Pre-Deployment Checklist

- [ ] PostgreSQL database ready (Vercel Postgres, Supabase, or Neon)
- [ ] Vercel Blob storage account setup
- [ ] GitHub repository created and code pushed
- [ ] Environment variables prepared

## 🗄️ Step 1: Setup Database

### Option A: Vercel Postgres (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database" → "Postgres"
3. Name it: `mouhajer-cms-db`
4. Select region closest to your users
5. Copy the `DATABASE_URL` (starts with `postgres://`)

### Option B: Neon Database (Free Tier)

1. Go to [Neon Console](https://console.neon.tech/)
2. Create new project: `mouhajer-cms`
3. Copy the connection string
4. Use as `DATABASE_URL`

### Option C: Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (use Transaction mode)

## 📦 Step 2: Setup Blob Storage

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Storage" → "Create Database" → "Blob"
3. Name it: `mouhajer-cms-media`
4. Copy the `BLOB_READ_WRITE_TOKEN`

## 🔐 Step 3: Prepare Environment Variables

Create a `.env.production` file locally to test:

```env
# Database
DATABASE_URL="your_postgres_connection_string"

# Blob Storage
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

# NextAuth
NEXTAUTH_SECRET="generate_random_32_char_string"
NEXTAUTH_URL="https://your-cms-domain.vercel.app"

# Optional: Node Environment
NODE_ENV="production"
```

### Generate NEXTAUTH_SECRET

```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Using online generator
# Visit: https://generate-secret.vercel.app/32
```

## 🚀 Step 4: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: mouhajer-cms
# - Which directory? ./
# - Override settings? No

# After first deployment, add environment variables:
vercel env add DATABASE_URL
vercel env add BLOB_READ_WRITE_TOKEN
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# Deploy to production
vercel --prod
```

### Method 2: Vercel Dashboard (Web UI)

1. **Import Repository**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

2. **Configure Project**
   - Project Name: `mouhajer-cms`
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all variables from above
   - Select "Production", "Preview", and "Development"
   - Click "Deploy"

## 🗃️ Step 5: Initialize Database

After deployment, you need to setup the database schema and seed data:

### Option 1: Using Vercel CLI

```bash
# Push database schema
vercel env pull .env.local
npx prisma db push

# Seed database
npm run db:seed
```

### Option 2: Using Deployment Hook

Create a one-time API call:

```bash
# After deployment, call this URL once:
curl -X POST https://your-cms-domain.vercel.app/api/seed
```

### Option 3: Manual Setup

1. Install Prisma CLI locally with production env:
```bash
# Copy production DATABASE_URL to .env.local
echo "DATABASE_URL=your_production_url" > .env.local

# Push schema
npx prisma db push

# Seed database
npm run db:seed

# Remove .env.local
rm .env.local
```

## 🔒 Step 6: Security Checklist

- [ ] **NEXTAUTH_SECRET** is randomly generated (not default)
- [ ] **NEXTAUTH_URL** matches your production domain
- [ ] **DATABASE_URL** is production database (not dev)
- [ ] Default admin password changed after first login
- [ ] Database is in same region as Vercel deployment
- [ ] Blob storage has proper access controls

## 🧪 Step 7: Test Deployment

1. **Visit your CMS**
   ```
   https://your-cms-domain.vercel.app
   ```

2. **Test Login**
   - Email: `admin@mouhajerdesign.com`
   - Password: `admin123`
   - ⚠️ **IMPORTANT**: Change this immediately!

3. **Change Admin Password**
   - Go to Users page
   - Edit admin user
   - Set new secure password

4. **Test Features**
   - [ ] Create a project
   - [ ] Upload media
   - [ ] Create blog post
   - [ ] Check activity log
   - [ ] Create new user

## 🌐 Step 8: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add domain: `cms.mouhajerdesign.com`
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable
5. Redeploy

## 📊 Step 9: Monitoring Setup

### Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to [src/app/layout.tsx](src/app/layout.tsx):
```typescript
import { Analytics } from '@vercel/analytics/react';

// In return statement:
<Analytics />
```

### Error Tracking with Sentry (Optional)

```bash
npm install @sentry/nextjs
```

Configure sentry:
```bash
npx @sentry/wizard@latest -i nextjs
```

## 🔄 Step 10: Continuous Deployment

Your CMS is now set for automatic deployments:

- **Push to `main`** → Auto-deploy to production
- **Push to other branches** → Preview deployments
- **Pull Requests** → Automatic preview URLs

## 📱 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | `vercel_blob_rw_...` |
| `NEXTAUTH_SECRET` | Auth encryption key | Random 32+ chars |
| `NEXTAUTH_URL` | Your CMS URL | `https://cms.example.com` |

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
vercel --force

# Check build logs
vercel logs
```

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure database is not paused (Neon free tier)

### Authentication Not Working

- Verify `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches deployment URL
- Clear browser cookies and try again

### Prisma Client Issues

```bash
# Regenerate Prisma client
vercel env pull
npx prisma generate
git add .
git commit -m "Update Prisma client"
git push
```

## 🔐 Post-Deployment Security

### Change Default Credentials

1. Login with default admin account
2. Go to Users page
3. Create new admin user with strong password
4. Login as new admin
5. Delete or disable default admin account

### Regular Maintenance

- [ ] Review activity logs weekly
- [ ] Update dependencies monthly (`npm update`)
- [ ] Backup database regularly
- [ ] Monitor Vercel usage and limits
- [ ] Review user access quarterly

## 📈 Performance Optimization

### Database Optimization

```bash
# Add database indexes (in future)
# Check query performance in Prisma Studio
```

### Image Optimization

Vercel automatically optimizes images. Ensure you're using:
```typescript
import Image from 'next/image';
```

### Caching (Future Enhancement)

Consider adding Redis for caching:
- API responses
- Media metadata
- User sessions

## 🎯 Production Checklist

- [ ] Database schema deployed
- [ ] Database seeded with admin user
- [ ] Default password changed
- [ ] All environment variables set
- [ ] Build successful
- [ ] Authentication working
- [ ] Media upload working
- [ ] All CRUD operations tested
- [ ] Activity logging verified
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring enabled

## 🆘 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Review database connection
4. Verify all environment variables
5. Check [Next.js deployment docs](https://nextjs.org/docs/deployment)
6. Review [Vercel troubleshooting](https://vercel.com/docs/troubleshooting)

---

## 🎊 Success!

Your CMS is now live at: `https://your-domain.vercel.app`

**Next Steps:**
1. Login and change admin password
2. Create additional users
3. Start managing content
4. Integrate with your frontend

---

**Deployment Status**: Ready for Production 🚀
**Last Updated**: 2025-10-08
