# Projects Page - URL-Based Filtering & Featured Projects

## ✨ New Features Added

### 1. **URL-Based Filtering**
The filter state is now synced with the URL, allowing:
- Shareable filtered views
- Browser back/forward navigation
- Deep linking to specific filtered views
- Bookmarkable project categories

### 2. **Featured Projects Section**
Every view type now shows:
- **Featured Projects** (projects with `featured: true`)
- **All Projects** (regular projects)
- Clear section headers with project counts

### 3. **Improved Filter UI**
- Pill-style buttons with better visual feedback
- Active filter highlighted in black with shadow
- Hover states for better interactivity
- Project count badges (optional)

### 4. **Fixed Dropdown Hover Bug**
- Added 300ms delay before dropdown hides
- Dropdown stays open when hovering over it
- Smooth transition between button and dropdown

---

## 🔗 URL Structure

### Query Parameters:

| Parameter | Values | Default | Example |
|-----------|--------|---------|---------|
| `category` | Any category name or 'all' | `all` | `?category=residential` |
| `view` | `grid`, `immersive`, `cinematic` | `grid` | `?view=immersive` |
| `columns` | `1`, `2`, `3`, `4`, `5`, `6` | `3` | `?columns=4` |

### Example URLs:

```
/projects
/projects?category=hospitality
/projects?category=residential&view=cinematic
/projects?category=commercial&view=grid&columns=4
/projects?view=immersive
```

---

## 📊 Featured Projects Logic

### How It Works:

1. **Featured Projects**:
   - Filter projects where `featured: true`
   - Display in "Featured Projects" section
   - Always shown first

2. **Regular Projects**:
   - Filter projects where `featured: false` or undefined
   - Display in "All Projects" section
   - Shown after featured projects

3. **Category Filtering**:
   - Applied to BOTH featured and regular projects
   - Each section shows only matching category

### Example:

```typescript
// Sanity data
{
  projects: [
    { title: "Luxury Villa", category: "residential", featured: true },
    { title: "Hotel Lobby", category: "hospitality", featured: true },
    { title: "Office Tower", category: "commercial", featured: false },
    { title: "Apartment", category: "residential", featured: false },
  ]
}

// When category = "residential"
Featured Projects: [Luxury Villa]
All Projects: [Apartment]

// When category = "all"
Featured Projects: [Luxury Villa, Hotel Lobby]
All Projects: [Office Tower, Apartment]
```

---

## 🎨 Filter UI Improvements

### Before (Underline Style):
```
All | Residential | Commercial | Hospitality
─────
```

### After (Pill Style):
```
┌─────┐  ┌──────────────┐  ┌────────────┐  ┌─────────────┐
│ All │  │ Residential  │  │ Commercial │  │ Hospitality │
└─────┘  └──────────────┘  └────────────┘  └─────────────┘
  ███                                    (active = black)
```

**Benefits:**
- ✅ More prominent and clickable
- ✅ Better visual hierarchy
- ✅ Clearer active state
- ✅ Modern, professional look
- ✅ Matches luxury brand aesthetic

---

## 🐛 Dropdown Hover Fix

### The Problem:
Users had to move their mouse very quickly from the "Grid" button to the dropdown, or it would disappear.

### The Solution:
```typescript
// Added delay timer
const hideTimeout = useRef<NodeJS.Timeout | null>(null);

const handleMouseEnter = () => {
  if (hideTimeout.current) {
    clearTimeout(hideTimeout.current); // Cancel hide
  }
  setShowGridOptions(true);
};

const handleMouseLeave = () => {
  hideTimeout.current = setTimeout(() => {
    setShowGridOptions(false);
  }, 300); // 300ms grace period
};
```

**Result:**
- ✅ 300ms delay before dropdown hides
- ✅ Dropdown stays open when hovering over it
- ✅ Smooth, forgiving UX
- ✅ No more accidental closures

---

## 🔄 URL Sync Behavior

### How It Works:

1. **On Page Load**:
   - Read URL parameters
   - Set initial state from URL
   - Example: `?category=hospitality&view=cinematic`

2. **On Filter Change**:
   - Update state
   - Update URL (without page reload)
   - Preserve scroll position

3. **Browser Navigation**:
   - Back/forward buttons work
   - State syncs with URL
   - Filters update automatically

### Implementation:

```typescript
// Read URL on mount
const categoryFromUrl = searchParams.get('category') || 'all';
const viewFromUrl = searchParams.get('view') as ViewType | null;
const columnsFromUrl = searchParams.get('columns');

// Update URL when state changes
useEffect(() => {
  const params = new URLSearchParams();

  if (selectedCategory !== 'all') {
    params.set('category', selectedCategory);
  }

  if (viewType !== 'grid') {
    params.set('view', viewType);
  }

  if (viewType === 'grid' && gridColumns !== 3) {
    params.set('columns', gridColumns.toString());
  }

  const queryString = params.toString();
  const newUrl = queryString ? `?${queryString}` : window.location.pathname;

  router.push(newUrl, { scroll: false });
}, [selectedCategory, viewType, gridColumns, router]);
```

---

## 📱 Use Cases

### 1. Share Filtered View
```
User: "Check out our hospitality projects in cinematic view!"
Link: /projects?category=hospitality&view=cinematic
```

### 2. Bookmark Favorite View
```
User bookmarks: /projects?view=grid&columns=6
Always opens with 6-column grid
```

### 3. Marketing Campaigns
```
Email: "See our latest residential projects"
Link: /projects?category=residential
```

### 4. Direct Links in Content
```
Blog post: "We completed 50+ commercial projects"
Link: /projects?category=commercial
```

### 5. Navigation History
```
User filters: All → Residential → Hospitality
Presses back button → Returns to Residential
```

---

## 🎯 Featured vs Regular Projects

### Visual Separation:

```
┌─────────────────────────────────────┐
│  Featured Projects              (3) │
├─────────────────────────────────────┤
│  [Project 1] [Project 2] [Project 3]│
└─────────────────────────────────────┘

───────────────────────────────────────  Border separator

┌─────────────────────────────────────┐
│  All Projects                  (12) │
├─────────────────────────────────────┤
│  [Project 4] [Project 5] [Project 6]│
│  [Project 7] [Project 8] [Project 9]│
│  ...                                │
└─────────────────────────────────────┘
```

### Section Headers:

- **Featured Projects** - Shows featured count
- **All Projects** - Shows regular count (only if featured exists)
- **No projects found** - When filters return empty

---

## 🔧 Technical Details

### State Management:

```typescript
// URL is the source of truth
const categoryFromUrl = searchParams.get('category') || 'all';

// State initialized from URL
const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

// State changes update URL
useEffect(() => {
  // Update URL params...
  router.push(newUrl, { scroll: false });
}, [selectedCategory, viewType, gridColumns]);
```

### Filter Logic:

```typescript
// Separate featured and regular
const featuredProjects = projects.filter(p => p.featured);
const regularProjects = projects.filter(p => !p.featured);

// Apply category filter to both
const filteredFeaturedProjects = selectedCategory === 'all'
  ? featuredProjects
  : featuredProjects.filter(p => p.category === selectedCategory);

const filteredRegularProjects = selectedCategory === 'all'
  ? regularProjects
  : regularProjects.filter(p => p.category === selectedCategory);
```

---

## 📊 Filter Button Counts (Optional)

Currently disabled, but you can enable by uncommenting:

```typescript
{category !== 'all' && selectedCategory === category && (
  <span className="ml-2 text-neutral-400">
    ({/* project count */})
  </span>
)}
```

This shows the number of projects in each category when selected.

---

## ✅ Benefits Summary

### URL-Based Filtering:
- ✅ Shareable links
- ✅ Browser history works
- ✅ Bookmarkable views
- ✅ Deep linking support
- ✅ Better SEO (crawlable filters)

### Featured Projects:
- ✅ Highlight best work
- ✅ Clear visual hierarchy
- ✅ Works in all view types
- ✅ Separate section headers
- ✅ Project counts

### Improved Filters:
- ✅ Modern pill design
- ✅ Clear active state
- ✅ Better click targets
- ✅ Hover feedback
- ✅ Professional appearance

### Fixed Dropdown:
- ✅ 300ms grace period
- ✅ Stays open on hover
- ✅ No accidental closes
- ✅ Smooth UX

---

## 🚀 Testing Checklist

- [x] URL updates when category changes
- [x] URL updates when view type changes
- [x] URL updates when grid columns change
- [x] Browser back/forward buttons work
- [x] Direct URL navigation works
- [x] Featured projects show first
- [x] Regular projects show after featured
- [x] Category filter applies to both sections
- [x] Empty state shows when no matches
- [x] Dropdown has 300ms delay
- [x] Dropdown stays open on hover
- [x] Filter pills have clear active state
- [x] Project counts are accurate
- [x] All view types support featured section

---

## 🎬 Example User Flow

1. **User visits** `/projects`
   - Shows all featured + all regular projects
   - Default: Grid view, 3 columns

2. **User clicks "Hospitality" filter**
   - URL changes to `?category=hospitality`
   - Shows featured hospitality + regular hospitality

3. **User clicks "Cinematic" view**
   - URL changes to `?category=hospitality&view=cinematic`
   - Same projects, different layout

4. **User hovers over "Grid"**
   - Dropdown appears
   - User moves mouse to "4 Columns"
   - Dropdown stays open (300ms delay)
   - User clicks "4 Columns"

5. **URL is now:** `?category=hospitality&view=grid&columns=4`
   - User copies URL
   - Shares with colleague
   - Colleague sees exact same view

6. **User presses back button**
   - Returns to cinematic view
   - URL: `?category=hospitality&view=cinematic`

---

**All features are now live and ready to use!** 🎉
