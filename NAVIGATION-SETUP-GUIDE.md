# Navigation Setup Guide

## Overview
Your CMS now supports **two types of navigation**:
1. **Header Navigation** - Displays in the top navbar
2. **Footer Navigation** - Displays in the footer

All navigation items are managed through the CMS and render dynamically on the website.

## ✅ What's Been Implemented

### Backend Changes
- ✅ Added `location` field to navigation items ("header" or "footer")
- ✅ Updated navigation API to filter by location
- ✅ Navigation API endpoint: `/api/navigation/public?location=header` or `?location=footer`
- ✅ Defaults to "header" for backward compatibility

### Frontend Changes
- ✅ Layout fetches header and footer navigation separately
- ✅ Navbar uses header navigation items only
- ✅ Footer uses footer navigation items only
- ✅ **Removed all hardcoded links:**
  - ❌ Who we are
  - ❌ Our Projects
  - ❌ Services
  - ❌ Blog
  - ❌ Careers
  - ❌ Contact US

## 📝 How to Create Navigation Items

### Option 1: Through CMS UI (Current)
1. Go to https://cms-sepia.vercel.app/navigation
2. Click "Add Navigation Item"
3. Fill in the fields:
   - **Label (English)**: The link text in English
   - **Label (Arabic)**: The link text in Arabic
   - **URL**: The page URL (e.g., `/who-we-are`, `/contact-us`)
   - **Type**: Choose `link` for simple links
   - **Order**: Display order (lower numbers appear first)

**Note**: Currently the UI doesn't show the location field, so all new items default to "header". See Option 2 below to set footer items.

### Option 2: Through API (Temporary - Until UI is Updated)

To create **footer navigation** items, use the API directly:

```bash
curl -X POST https://cms-sepia.vercel.app/api/navigation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "labelEn": "Who We Are",
    "labelAr": "من نحن",
    "url": "/who-we-are",
    "type": "link",
    "location": "footer",
    "order": 1,
    "isActive": true
  }'
```

### Option 3: Directly in Database

Update existing navigation items to set them as footer items:

```sql
-- Move "Who We Are" to footer
UPDATE nav_items
SET location = 'footer'
WHERE label_en = 'Who We Are';

-- Move all nav items to footer
UPDATE nav_items
SET location = 'footer'
WHERE id IN ('item-id-1', 'item-id-2', ...);
```

## 🎯 Recommended Footer Navigation Items

Based on your previous footer, you should create these footer navigation items:

1. **Who We Are** (`/who-we-are`)
2. **Our Projects** (`/our-projects`)
3. **Services** (`/services`)
4. **Blog** (`/blogs`)
5. **Careers** (`/careers`)
6. **Contact US** (`/contact-us`)

## 🔄 Navigation Flow

```
┌─────────────────────────────────────────────────────┐
│                    CMS Database                     │
│                                                     │
│  Navigation Items Table (nav_items)                 │
│  ┌──────────────────────────────────────────┐      │
│  │ location = "header"  → Header Navbar     │      │
│  │ location = "footer"  → Footer Links      │      │
│  └──────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              Navigation API                          │
│  GET /api/navigation/public?location=header         │
│  GET /api/navigation/public?location=footer         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│               Frontend Layout                        │
│  ┌─────────────────────────────────────────┐        │
│  │  fetchNavigation('header')               │        │
│  │  fetchNavigation('footer')               │        │
│  └─────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────┘
                        ↓
       ┌────────────────────┬────────────────┐
       ↓                    ↓                ↓
  ┌─────────┐         ┌──────────┐    ┌──────────┐
  │ Navbar  │         │ Content  │    │  Footer  │
  │ (Header)│         │          │    │ (Footer) │
  └─────────┘         └──────────┘    └──────────┘
```

## 🎨 Navigation Features

### Supported Features
- ✅ Bilingual labels (English/Arabic)
- ✅ Custom URLs
- ✅ Order control
- ✅ Active/Inactive toggle
- ✅ Open in new tab option
- ✅ Nested navigation (children)
- ✅ Dropdown menus
- ✅ Mega menus

### Header vs Footer Differences
- **Header**: Supports mega menus, dropdowns, nested items
- **Footer**: Simple links only (no dropdowns)

## 🚀 Next Steps

### Immediate
1. Create footer navigation items through the API or database
2. Test the navigation on the live site
3. Verify both English and Arabic versions work correctly

### Future Enhancement
- Update CMS navigation UI to include location dropdown field
- Add bulk edit functionality for changing location
- Add navigation preview in CMS

## 📊 Database Schema

```typescript
model NavItem {
  id              String
  labelEn         String    // English label
  labelAr         String    // Arabic label
  url             String?   // Page URL
  type            String    // "link", "dropdown", "mega_menu"
  location        String    // "header" or "footer" ← NEW!
  order           Int       // Display order
  isActive        Boolean   // Show/hide
  openInNewTab    Boolean   // Target attribute
  parentId        String?   // For nested items
  children        NavItem[] // Child navigation items
  // ... other fields
}
```

## 🔧 Troubleshooting

### Footer shows no links
- Check that footer navigation items exist in database with `location = 'footer'`
- Verify items are active (`is_active = true`)
- Check the navigation API: https://cms-sepia.vercel.app/api/navigation/public?location=footer

### Links not working
- Ensure URLs start with `/` (e.g., `/who-we-are` not `who-we-are`)
- For external links, include full URL (e.g., `https://example.com`)
- Check that pages exist at those URLs

### Bilingual issues
- Verify both `labelEn` and `labelAr` are filled
- Check Arabic text displays correctly (RTL)
- Test language switcher

## 📞 Support

If you need help:
1. Check database directly to see navigation items
2. Test API endpoints to verify data flow
3. Review browser console for errors
4. Check CMS logs for API issues

---

**Deployed URLs:**
- CMS: https://cms-sepia.vercel.app
- Frontend: https://frontend-eeqibko5s-bassam2.vercel.app

**Last Updated:** October 22, 2025
