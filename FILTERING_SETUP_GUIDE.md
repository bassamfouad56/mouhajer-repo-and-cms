# Advanced Filtering Setup Guide

## 🎯 Phase 1 Filtering System is Complete!

The code is ready, but you need to set up your Sanity data for it to work.

## ✅ What's Been Built

- ✅ CategoryTabs component (Residential, Commercial, Hospitality, Ongoing)
- ✅ FilterSidebar with project types and locations
- ✅ Dynamic category routes (`/projects/residential`, etc.)
- ✅ GROQ queries for server-side filtering
- ✅ URL state synchronization

## 📋 Required Sanity Setup

### Step 1: Create Industries (Sectors)

Go to your Sanity Studio and create these 3 industries:

**1. Residential**
- Title: `Residential`
- Slug: `residential` ⚠️ EXACT slug required
- Excerpt: "Luxury residential projects including villas, apartments, and penthouses"
- Icon: "Building" or "Home"

**2. Commercial**
- Title: `Commercial`
- Slug: `commercial` ⚠️ EXACT slug required
- Excerpt: "Commercial interior design including offices, retail spaces, and corporate environments"
- Icon: "Building2" or "Briefcase"

**3. Hospitality**
- Title: `Hospitality`
- Slug: `hospitality` ⚠️ EXACT slug required
- Excerpt: "Hospitality projects including hotels, restaurants, cafes, and leisure spaces"
- Icon: "Hotel" or "UtensilsCrossed"

### Step 2: Create Project Types

Create project types for each sector:

**Residential Types:**
- Villa
- Apartment
- Penthouse
- Townhouse
- Palace

**Commercial Types:**
- Office
- Retail Store
- Showroom
- Medical Clinic
- Educational

**Hospitality Types:**
- Hotel
- Restaurant
- Cafe
- Bar & Lounge
- Spa

### Step 3: Create Locations

Create location entries for UAE cities:
- Dubai
- Abu Dhabi
- Sharjah
- Ajman
- Ras Al Khaimah
- Fujairah
- Umm Al Quwain

### Step 4: Update Existing Projects

For each existing project, you need to:

1. Select a **Sector** (Industry) - Required
2. Select a **Project Type** - Required
3. Select a **Location** - Required
4. Set **Status** to:
   - `completed` for finished projects
   - `in-progress` for ongoing projects (these will show in "Ongoing" tab)

## 🧪 Testing the Filters

Once data is set up, test these URLs:

1. **Main page**: `http://localhost:4050/en/projects`
   - Should show all projects with 4 category tabs

2. **Residential**: `http://localhost:4050/en/projects/residential`
   - Should show only residential projects

3. **Commercial**: `http://localhost:4050/en/projects/commercial`
   - Should show only commercial projects

4. **Hospitality**: `http://localhost:4050/en/projects/hospitality`
   - Should show only hospitality projects

5. **Ongoing**: `http://localhost:4050/en/projects/ongoing`
   - Should show projects with status = 'in-progress'

## 🐛 Debugging

### If tabs don't work:

1. **Check browser console** for errors
2. **Verify Sanity industries** exist with exact slugs
3. **Check projects** have sector/projectType/location populated
4. **Verify status field** uses 'in-progress' (not 'ongoing')

### If no projects show:

1. **Check GROQ queries** in Sanity Vision:
   ```groq
   *[_type == "project" && sector->slug.current == "residential"] {
     title,
     sector->{title, slug},
     projectType->{title, slug},
     location->{name, slug}
   }
   ```

2. **Verify references** are properly linked

## 🚀 Next Steps (Future Phases)

After Phase 1 is working:

**Phase 2:**
- Mobile filter drawer
- Advanced sorting
- Budget range filter
- Year filter
- Filter presets

**Phase 3:**
- Saved searches
- Share filtered views
- Export filtered results
- Analytics on filter usage

## 📝 Quick Sanity Vision Test

Run this in Sanity Vision to test your setup:

```groq
{
  "industries": *[_type == "industry"] | order(order asc) {
    title,
    slug
  },
  "projectTypes": *[_type == "projectType"] | order(order asc) {
    title,
    slug,
    sector->{title, slug}
  },
  "locations": *[_type == "location"] | order(order asc) {
    name,
    slug
  },
  "sampleProject": *[_type == "project"][0] {
    title,
    sector->{title, slug},
    projectType->{title, slug},
    location->{name, slug},
    status
  }
}
```

This will show you if all the required content types and references are set up correctly.
