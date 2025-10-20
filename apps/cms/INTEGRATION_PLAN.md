# 🚀 Mouhajer CMS Integration Plan

## 📋 **Current Status Assessment**

### ✅ **What's Already Built**
- ✅ Basic CMS structure with Next.js 15 and React 19
- ✅ File-based JSON database system
- ✅ TypeScript interfaces for Projects, Services, Blog Posts, Media, Settings
- ✅ Basic API structure (`src/lib/api.ts`)
- ✅ Dashboard UI with stats cards and navigation
- ✅ AuthGuard component for security
- ✅ Bilingual content support (EN/AR)

### ❌ **What's Missing/Needs Implementation**
- ❌ API Routes (`/api/*` endpoints)
- ❌ CRUD operations for content management
- ❌ Media upload functionality
- ❌ Form components for content creation/editing
- ❌ Real-time data integration with main website
- ❌ Authentication system implementation
- ❌ Image optimization and CDN integration

---

## 🎯 **Phase 1: Core API Development (Week 1)**

### 1.1 Create API Routes
```bash
mkdir -p src/app/api/{projects,services,blog,media,settings}
```

**Files to create:**
- `src/app/api/projects/route.ts` - GET, POST /api/projects
- `src/app/api/projects/[id]/route.ts` - GET, PUT, DELETE /api/projects/[id]
- `src/app/api/services/route.ts` - GET, POST /api/services
- `src/app/api/services/[id]/route.ts` - GET, PUT, DELETE /api/services/[id]
- `src/app/api/blog/route.ts` - GET, POST /api/blog
- `src/app/api/blog/[id]/route.ts` - GET, PUT, DELETE /api/blog/[id]
- `src/app/api/media/route.ts` - GET, POST /api/media
- `src/app/api/media/[id]/route.ts` - DELETE /api/media/[id]
- `src/app/api/settings/route.ts` - GET, PUT /api/settings

### 1.2 Implement Authentication
```bash
npm install next-auth bcryptjs jsonwebtoken
```

**Files to create:**
- `src/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `src/middleware.ts` - Route protection
- `src/lib/auth.ts` - Authentication utilities

### 1.3 Update Package.json
```json
{
  "scripts": {
    "dev": "next dev --port 3002",
    "seed": "tsx src/lib/seed-data.ts"
  }
}
```

---

## 🎯 **Phase 2: Content Management UI (Week 2)**

### 2.1 Create Content Management Pages
```bash
mkdir -p src/app/{projects,services,blog,media,settings}
```

**Pages to create:**
- `src/app/projects/page.tsx` - Projects listing + CRUD
- `src/app/services/page.tsx` - Services listing + CRUD
- `src/app/blog/page.tsx` - Blog posts listing + CRUD
- `src/app/media/page.tsx` - Media library with upload
- `src/app/settings/page.tsx` - Site settings management

### 2.2 Build Form Components
```bash
mkdir -p src/components/forms
```

**Components to create:**
- `src/components/forms/ProjectForm.tsx` - Project create/edit form
- `src/components/forms/ServiceForm.tsx` - Service create/edit form
- `src/components/forms/BlogForm.tsx` - Blog post create/edit form
- `src/components/forms/MediaUpload.tsx` - File upload component
- `src/components/forms/SettingsForm.tsx` - Settings form

### 2.3 Add Rich Text Editor
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
```

---

## 🎯 **Phase 3: Main Website Integration (Week 3)**

### 3.1 Update Main Website API Consumption

**In main `mouhajer` project:**

1. **Update WordPress actions to include CMS fallback:**
```typescript
// lib/actions/cms-actions.ts
export async function getCMSProjects() {
  try {
    const response = await fetch(`${CMS_API_URL}/api/projects`);
    return await response.json();
  } catch (error) {
    console.error('CMS API error, falling back to WordPress:', error);
    return await getWordPressProjects();
  }
}
```

2. **Create CMS integration components:**
```bash
mkdir -p components/cms-integration
```

**Components to create:**
- `components/cms-integration/CMSProjectsSection.tsx`
- `components/cms-integration/CMSServicesSection.tsx`
- `components/cms-integration/CMSBlogSection.tsx`

### 3.2 Environment Configuration

**In main `mouhajer/.env.local`:**
```env
CMS_API_URL=http://localhost:3002
CMS_API_KEY=your-secure-api-key
WORDPRESS_FALLBACK=true
```

**In `mouhajer-cms/.env.local`:**
```env
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@mouhajerdesign.com
ADMIN_PASSWORD=your-secure-password
```

### 3.3 Update Main Website Scripts

**In main `mouhajer/package.json`:**
```json
{
  "scripts": {
    "dev": "next dev --port 3000",
    "dev:cms": "cd ../mouhajer-cms && npm run dev",
    "dev:full": "concurrently \"npm run dev\" \"npm run dev:cms\"",
    "build": "next build",
    "build:cms": "cd ../mouhajer-cms && npm run build"
  }
}
```

---

## 🎯 **Phase 4: Advanced Features (Week 4)**

### 4.1 Media Management & CDN
```bash
npm install multer sharp aws-sdk cloudinary
```

**Features to implement:**
- Image upload with automatic optimization
- Multiple image sizes generation
- CDN integration (Cloudinary/AWS S3)
- Image metadata extraction

### 4.2 SEO & Performance
- Automatic sitemap generation
- Meta tags management
- Image optimization pipeline
- Content caching strategy

### 4.3 Backup & Security
- Automated database backups
- API rate limiting
- Content versioning
- Role-based access control

---

## 🎯 **Phase 5: Production Deployment (Week 5)**

### 5.1 Database Migration
- Migrate from JSON files to PostgreSQL/MongoDB
- Set up database connection pooling
- Implement database migrations

### 5.2 Deployment Setup
```bash
# Production configuration
NEXT_PUBLIC_CMS_API_URL=https://cms.mouhajerdesign.com
DATABASE_URL=postgresql://...
CLOUDINARY_URL=cloudinary://...
```

### 5.3 CI/CD Pipeline
- GitHub Actions for automated deployment
- Environment-specific builds
- Database migration scripts
- Health checks and monitoring

---

## 📊 **Integration Architecture**

### Data Flow:
```
Main Website (Port 3000) ←→ CMS API (Port 3002) ←→ Database (JSON/PostgreSQL)
                ↓
        WordPress (Fallback)
```

### API Endpoints:
```
GET    /api/projects          - List projects
POST   /api/projects          - Create project
GET    /api/projects/[id]     - Get project
PUT    /api/projects/[id]     - Update project
DELETE /api/projects/[id]     - Delete project

Similar patterns for /api/services, /api/blog, /api/media
```

### Authentication Flow:
```
CMS Dashboard → NextAuth → JWT Token → Protected API Routes
```

---

## 🛠 **Development Commands**

### Start both projects:
```bash
# From mouhajer directory
npm run dev:full
```

### Development URLs:
- Main Website: http://localhost:3000
- CMS Dashboard: http://localhost:3002
- API Endpoints: http://localhost:3002/api/*

---

## 🔄 **Migration Strategy**

### From WordPress to CMS:
1. **Export WordPress content** using WP REST API
2. **Transform data** to match CMS schema
3. **Import to CMS** using seed scripts
4. **Update main website** to use CMS API with WordPress fallback
5. **Gradual transition** - enable CMS for new content first

### Content Sync Options:
- **Option A:** Full CMS replacement (recommended)
- **Option B:** Hybrid approach (CMS for new content, WordPress for existing)
- **Option C:** CMS as primary with WordPress backup

---

## ✅ **Success Metrics**

- [ ] All CRUD operations working for Projects, Services, Blog Posts
- [ ] Media upload and optimization functional
- [ ] Main website consuming CMS API successfully
- [ ] Authentication and authorization working
- [ ] Bilingual content management operational
- [ ] Performance meets requirements (< 2s page load)
- [ ] SEO features implemented and tested
- [ ] Production deployment successful

---

## 🚨 **Risk Mitigation**

### Potential Issues:
1. **Data Loss:** Regular backups, content versioning
2. **Performance:** Caching, CDN, database optimization
3. **Security:** Authentication, input validation, rate limiting
4. **Downtime:** WordPress fallback, health checks

### Rollback Plan:
- Keep WordPress as fallback during transition
- Database backups before major changes
- Feature flags for gradual rollout
- Monitoring and alerting setup

---

## 👥 **Next Steps**

1. **Week 1:** Start with Phase 1 - API Routes development
2. **Set up development environment** with both projects running
3. **Create first API endpoint** (Projects) and test integration
4. **Implement authentication** for CMS access
5. **Begin building content management forms**

This plan provides a structured approach to fully integrate the mouhajer-cms with the main website while maintaining stability and allowing for incremental development.