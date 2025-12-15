# 🌱 Seed Sanity & Test Filters

## Quick Start - Get Filtering Working in 2 Minutes

### Step 1: Seed Sanity Database

Run this command from your project root:

```bash
npx tsx scripts/seed-filtering-taxonomy.ts
```

This will create:
- ✅ **3 Industries**: Residential, Commercial, Hospitality
- ✅ **15 Project Types**: Villa, Apartment, Hotel, Office, etc.
- ✅ **7 Locations**: Dubai, Abu Dhabi, Sharjah, etc.
- ✅ **Updates first 10 projects** with proper references

### Step 2: Verify in Sanity Studio

Open your Sanity Studio (usually `http://localhost:3333`) and check:

1. **Industries** - Should see 3 industries with slugs:
   - residential
   - commercial
   - hospitality

2. **Project Types** - Should see 15 types linked to sectors

3. **Locations** - Should see 7 UAE cities

4. **Projects** - First 10 projects should now have:
   - Sector (Industry) selected
   - Project Type selected
   - Location selected
   - Status set (completed or in-progress)

### Step 3: Test the Filters

Visit these URLs to test:

#### **Main Category Tabs** (Should filter projects by sector)

1. **All Projects**: http://localhost:4050/en/projects
   - Should show all projects
   - Should see 4 tabs with counts

2. **Residential**: http://localhost:4050/en/projects/residential
   - URL changes to `/projects/residential`
   - Cards update to show only residential projects
   - Active tab highlights

3. **Commercial**: http://localhost:4050/en/projects/commercial
   - URL changes to `/projects/commercial`
   - Cards show only commercial projects

4. **Hospitality**: http://localhost:4050/en/projects/hospitality
   - URL changes to `/projects/hospitality`
   - Cards show only hospitality projects

5. **Ongoing**: http://localhost:4050/en/projects/ongoing
   - URL changes to `/projects/ongoing`
   - Cards show only in-progress projects

#### **Sidebar Filters** (Should refine results)

On any category page, use the sidebar filters:

1. **Project Types**:
   - Click "Villa" checkbox
   - URL updates: `?types=villa`
   - Cards filter to show only villas
   - Applied filter chip appears

2. **Locations**:
   - Click "Dubai" checkbox
   - URL updates: `?locations=dubai`
   - Cards filter to show only Dubai projects
   - Applied filter chip appears

3. **Combined Filters**:
   - Select "Villa" + "Dubai"
   - URL: `?types=villa&locations=dubai`
   - Cards show: Residential Villas in Dubai only
   - Both filter chips appear

4. **Clear Filters**:
   - Click "Clear All" or individual X buttons
   - URL clears query params
   - Cards reset to category view

## 🎯 Expected Behavior

### Category Tabs (Main Filters)
✅ **Click "Residential"**
- URL: `/en/projects/residential`
- Server fetches only residential projects
- Cards update immediately
- Tab gets gold underline
- Count badge shows number

### Sidebar Filters
✅ **Check "Villa"**
- URL adds: `?types=villa`
- Cards filter client-side (fast!)
- "Villa" chip appears above cards
- Can combine with location filters

✅ **Check "Dubai"**
- URL adds: `?locations=dubai`
- Cards filter to Dubai only
- "Dubai" chip appears
- Works with project type filters

### Search
✅ **Type in search**
- URL adds: `?search=luxury`
- Cards filter by keyword
- Works with all other filters
- Search chip appears

## 🧪 Testing Checklist

### Main Category Filtering
- [ ] Click "Residential" - URL changes, cards update
- [ ] Click "Commercial" - URL changes, cards update
- [ ] Click "Hospitality" - URL changes, cards update
- [ ] Click "Ongoing" - URL changes, shows in-progress projects
- [ ] Tab counts show correct numbers
- [ ] Active tab has gold underline

### Sidebar Filtering
- [ ] Check a project type - cards filter, URL updates
- [ ] Check a location - cards filter, URL updates
- [ ] Check multiple types - cards show all selected
- [ ] Check multiple locations - cards show all selected
- [ ] Applied filter chips appear
- [ ] Click X on chip - removes filter, cards update
- [ ] Click "Clear All" - removes all filters

### Combined Filtering
- [ ] Category + Type: `/residential?types=villa`
- [ ] Category + Location: `/commercial?locations=dubai`
- [ ] Category + Type + Location: `/hospitality?types=hotel&locations=dubai`
- [ ] All + Search: `/projects?search=luxury&types=villa&locations=dubai`

### URL Sharing
- [ ] Copy URL with filters
- [ ] Paste in new tab
- [ ] Filters persist
- [ ] Cards show correct filtered results

## 🐛 Troubleshooting

### No projects showing after seeding

**Check Sanity Vision:**
```groq
*[_type == "project" && defined(sector)] | order(_createdAt desc) [0...5] {
  title,
  "sector": sector->title,
  "sectorSlug": sector->slug.current,
  "type": projectType->title,
  "location": location->name,
  status
}
```

**Expected result**: Should see projects with sector, type, and location populated

### Category tabs not filtering

**Check industry slugs:**
```groq
*[_type == "industry"] { title, slug }
```

**Expected result**: Should see exact slugs: `residential`, `commercial`, `hospitality`

### Sidebar filters not working

**Check project data structure:**
```groq
*[_type == "project"][0] {
  title,
  category,
  location,
  "hasCategory": defined(category),
  "hasLocation": defined(location)
}
```

**Note**: Sidebar filters use the old `category` and `location` string fields for now (Phase 1). Phase 2 will use the new taxonomy references.

### Counts showing wrong numbers

- Counts on main `/projects` page show total project count (will be fixed when fetching category counts from server)
- Counts on category pages (`/residential`) are accurate

## 📝 Notes

### Data Flow

1. **Category Tabs** → Server-side filtering
   - Navigates to new route
   - Fetches filtered data from Sanity
   - Fast, SEO-friendly

2. **Sidebar Filters** → Client-side filtering
   - Filters already-fetched projects
   - Instant updates
   - No server request needed

### Performance

- **First load**: Fetches ~50 projects for the category
- **Sidebar filtering**: Instant (client-side)
- **Search**: Instant (client-side)
- **Category switch**: ~200ms (server fetch)

### Next Steps (Phase 2)

- [ ] Mobile filter drawer
- [ ] Server-side sidebar filtering (better accuracy)
- [ ] Filter counts per option
- [ ] Advanced sorting
- [ ] Save filter presets
- [ ] Share filtered views

## ✅ Success Criteria

You'll know it's working when:

1. ✅ Clicking category tabs changes URL and filters cards
2. ✅ Sidebar checkboxes update URL and filter cards
3. ✅ Filter chips appear when filters are active
4. ✅ "Clear All" removes all filters
5. ✅ Filters persist when sharing URLs
6. ✅ No console errors
7. ✅ Smooth animations throughout

🎉 **Once these work, Phase 1 is complete!**
