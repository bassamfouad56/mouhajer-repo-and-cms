# 🚀 Mouhajer CMS - Quick Start Guide

Your CMS is **LIVE** and ready to use!

## 🌐 Access Your CMS

**Production URL**: https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app

## 🔐 Login Credentials

### Admin Account (Full Access)
- **Email**: `admin@mouhajerdesign.com`
- **Password**: `admin123`
- **Access**: All features + user management

### Editor Account (Content Only)
- **Email**: `editor@mouhajerdesign.com`
- **Password**: `editor123`
- **Access**: Content creation and editing

⚠️ **Change these passwords immediately after first login!**

## 📱 CMS Features

### Dashboard (`/`)
- Real-time statistics
- Quick actions
- Overview of all content

### Content Management
- **Projects** (`/projects`) - Portfolio items with image galleries
- **Services** (`/services`) - Service offerings with pricing
- **Blog** (`/blog`) - Blog posts with categories and tags
- **Pages** (`/pages`) - Dynamic page builder
- **Media** (`/media`) - File upload and management
- **Ads** (`/ads`) - Advertisement management

### Administration
- **Settings** (`/settings`) - Site-wide configuration
- **Users** (`/users`) - User management (admin only)
- **Activity** (`/activity`) - Audit trail of all actions

## 🎯 First Steps

1. **Login**
   ```
   https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app/login
   ```

2. **Change Admin Password**
   - Go to Users page
   - Edit admin user
   - Set strong password
   - Save

3. **Create Test Content**
   - Go to Projects
   - Click "New Project"
   - Fill in details (EN/AR)
   - Upload images
   - Save

4. **Test Media Upload**
   - Go to Media
   - Click upload
   - Select images
   - Verify upload success

## 📡 API Endpoints

All content is available via REST API:

```javascript
const CMS_URL = 'https://mouhajer-dh6ryndkm-bassam-fouads-projects.vercel.app';

// Get all projects
fetch(`${CMS_URL}/api/projects`);

// Get all services
fetch(`${CMS_URL}/api/services`);

// Get blog posts
fetch(`${CMS_URL}/api/blog`);

// Get pages
fetch(`${CMS_URL}/api/pages`);

// Get site settings
fetch(`${CMS_URL}/api/settings`);
```

## 🔧 Common Tasks

### Add New User
1. Login as admin
2. Go to Users page
3. Click "Add User"
4. Fill in details
5. Assign role (admin/editor/viewer)
6. Save

### Create Blog Post
1. Go to Blog
2. Click "New Blog Post"
3. Fill in title (EN/AR)
4. Write content (EN/AR)
5. Upload featured image
6. Add tags and category
7. Publish or save as draft

### Upload Media
1. Go to Media
2. Click upload button
3. Select files
4. Add alt text/caption
5. Files auto-uploaded to Vercel Blob

### Check Activity
1. Go to Activity Log
2. Filter by action/resource
3. View who did what and when

## 🛠️ Development

### Local Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run prisma:studio    # Open database GUI
```

### Deploy Updates
```bash
git add .
git commit -m "Your changes"
git push                 # Auto-deploys to Vercel
```

### View Logs
```bash
vercel logs --follow     # Real-time logs
vercel logs              # Recent logs
```

## 📚 Documentation

- **Full Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Deployment Success**: [DEPLOYMENT_SUCCESS.md](DEPLOYMENT_SUCCESS.md)
- **Implementation Details**: [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- **Main README**: [README.md](README.md)

## 🆘 Quick Troubleshooting

### Can't Login
- Clear cookies
- Check you're using correct email/password
- Try incognito mode

### Upload Fails
- Check file size (max 4.5MB)
- Verify blob storage has space
- Check file type is supported

### Changes Not Showing
- Hard refresh (Cmd+Shift+R)
- Clear browser cache
- Check in incognito mode

## 📞 Support Resources

- Vercel Dashboard: https://vercel.com/bassam-fouads-projects/mouhajer-cms
- Deployment Logs: `vercel logs`
- Database: Prisma Studio in Vercel

---

## ✅ Quick Checklist

- [ ] Logged in successfully
- [ ] Changed admin password
- [ ] Created test project
- [ ] Uploaded test image
- [ ] Created blog post
- [ ] Added new user
- [ ] Checked activity log
- [ ] Tested API endpoint

---

**🎉 Your CMS is ready to go!**

Start creating content and managing your website.
