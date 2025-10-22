# Complete Refactoring Guide: Remove WordPress ACF, Use CMS API Only

## ✅ Completed Refactoring

### Components DONE:
1. **PortfolioCarouselHomepage.tsx** ✅
2. **FeaturedBlogsHomepage.tsx** ✅
3. **HorizontalScroll.tsx** ✅
4. **ProjectsNewCompAwwwards.tsx** ✅

## 🔧 Remaining Files to Refactor

### High Priority:
1. **components/Navbar.tsx** - Uses `el.acf.thumbnail`, `el.acf.main_image`
2. **components/BlogList.tsx** - Uses ACF blog fields
3. **components/SearchCards.tsx** - Uses `el.acf.sub_title`
4. **app/[locale]/our-projects/[slug]/page.tsx** - Project detail page
5. **app/[locale]/search/page.tsx** - Search page
6. **app/[locale]/services/[slug]/page.tsx** - Service detail page

---

## 📋 CMS Data Structure Reference

### Projects API (`/api/projects`)
```typescript
{
  id: string,
  title: { en: string, ar: string },
  description: { en: string, ar: string },
  images: string[],  // Array of image URLs
  category: string,  // "Residential", "Commercial", etc.
  location?: string, // "Dubai", "Abu Dhabi", etc.
  featured: boolean,
  status: "published" | "draft",
  createdAt: Date,
  updatedAt: Date
}
```

### Blogs API (`/api/blog`)
```typescript
{
  id: string,
  title: { en: string, ar: string },
  slug: { en: string, ar: string },
  excerpt: { en: string, ar: string },
  content: { en: string, ar: string },
  featuredImage: string,
  category: string,
  tags: string[],
  author: string,
  publishedAt: Date,
  featured: boolean,
  status: "published" | "draft"
}
```

### Services API (`/api/services`)
```typescript
{
  id: string,
  title: { en: string, ar: string },
  description: { en: string, ar: string },
  shortDescription: { en: string, ar: string },
  icon: string,
  images: string[],
  features: { en: string[], ar: string[] },
  price: string,
  featured: boolean
}
```

---

## 🔄 Refactoring Patterns

### OLD (WordPress ACF) → NEW (CMS API)

#### Projects:
```typescript
// ❌ OLD
project.acf.title → ✅ project.title.en
project.acf.title_arabic → ✅ project.title.ar
project.acf.main_image → ✅ project.images[0]
project.acf.big_image → ✅ project.images[0]
project.acf.thumbnail → ✅ project.images[0]
project.acf.description → ✅ project.description.en
project.acf.location → ✅ project.location || 'Dubai'
project.acf.category → ✅ project.category
project.acf.quote_title → ✅ project.category
project.acf.value → ✅ project.category
```

#### Blogs:
```typescript
// ❌ OLD
blog.acf.blog_title → ✅ blog.title.en
blog.acf.blog_title_arabic → ✅ blog.title.ar
blog.acf.featured_image → ✅ blog.featuredImage
blog.acf.blog_content → ✅ blog.content.en
blog.acf.category → ✅ blog.category
blog.acf.sub_title → ✅ blog.excerpt.en
```

#### Services:
```typescript
// ❌ OLD
service.acf.title → ✅ service.title.en
service.acf.main_image → ✅ service.images[0]
service.acf.description → ✅ service.description.en
service.acf.features → ✅ service.features.en
```

---

## 📝 Step-by-Step Refactoring Instructions

### 1. Navbar.tsx
**Find and replace:**
```typescript
// Line ~235
img: el.acf.thumbnail → img: el.images?.[0] || '/images/placeholder.jpg'
img: el.acf.main_image → img: el.images?.[0] || '/images/placeholder.jpg'
```

### 2. BlogList.tsx
**Update to use:**
```typescript
blog.title.en / blog.title.ar
blog.featuredImage
blog.excerpt.en / blog.excerpt.ar
blog.slug.en / blog.slug.ar
```

### 3. SearchCards.tsx
**Find:**
```typescript
el.acf.sub_title → el.excerpt?.en || el.description?.en
```

### 4. Project Detail Page (app/[locale]/our-projects/[slug]/page.tsx)
**Update to fetch from:**
```typescript
const project = await cmsClient.getProject(slug);
// Use: project.title.en, project.images, project.description.en
```

### 5. Search Page (app/[locale]/search/page.tsx)
**Remove ACF filtering, use CMS structure**

### 6. Service Detail Page (app/[locale]/services/[slug]/page.tsx)
**Update to use:**
```typescript
service.title.en / service.title.ar
service.images[0]
service.description.en / service.description.ar
service.features.en / service.features.ar
```

---

## 🧪 Testing Checklist

After refactoring each component, test:

- [ ] Homepage loads without errors
- [ ] Projects page displays correctly
- [ ] Project detail pages work
- [ ] Blog list shows posts
- [ ] Blog detail pages work
- [ ] Services page displays
- [ ] Service detail pages work
- [ ] Search functionality works
- [ ] Navigation menu displays projects/services
- [ ] Arabic/English language switching works

---

## 🚀 Quick Fix Commands

### Find all remaining ACF references:
```bash
grep -r "\.acf\." --include="*.tsx" --include="*.ts" app/ components/ | grep -v node_modules
```

### Test build:
```bash
npm run build
```

### Run dev server:
```bash
npm run dev
```

---

## 💡 Common Issues & Solutions

### Issue: `Cannot read properties of undefined (reading 'xyz')`
**Solution:** Add optional chaining and fallbacks:
```typescript
// ❌ Bad
project.acf.title

// ✅ Good
project.title?.en || 'Untitled'
project.images?.[0] || '/images/placeholder.jpg'
```

### Issue: Arabic content not showing
**Solution:** Make sure to use the bilingual structure:
```typescript
{locale === 'en' ? project.title.en : project.title.ar}
```

### Issue: Images not loading
**Solution:** Use first image from array with fallback:
```typescript
src={project.images?.[0] || '/images/placeholder.jpg'}
```

---

## 📞 Need Help?

If you encounter issues:
1. Check `CMS_INTEGRATION.md` for API documentation
2. Test CMS API directly: `curl http://localhost:3010/api/projects`
3. Check browser console for specific errors
4. Verify CMS is running: `http://localhost:3010`

---

**Status**: 4/10 files refactored ✅
**Remaining**: 6 files
**Next**: Refactor Navbar.tsx, BlogList.tsx, SearchCards.tsx
