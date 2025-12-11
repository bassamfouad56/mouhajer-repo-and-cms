# Projects Page - View Types Documentation

## ✨ New Features Added

Your projects page now has **3 distinct view types** with advanced interaction:

### 1. **Grid View** (with Column Selector)
- Dynamic grid layout with 1-6 columns
- Hover over "Grid" button to see column options dropdown
- Compact card design with 4:3 aspect ratio
- Perfect for browsing many projects quickly

**Column Options:**
- 1 Column - Full width showcase
- 2 Columns - Comfortable desktop view
- 3 Columns - Default, balanced layout
- 4 Columns - Dense gallery view
- 5 Columns - Ultra-dense for large screens
- 6 Columns - Maximum density

### 2. **Immersive View**
- Full-width alternating layout
- Images alternate left/right
- Parallax scroll effects on images
- 16:10 aspect ratio for cinematic feel
- Large typography and generous spacing
- Perfect for storytelling and detailed browsing

**Features:**
- Image parallax (moves as you scroll)
- Alternating layout (every other project flips sides)
- Full project descriptions visible
- Prominent call-to-action buttons

### 3. **Cinematic View**
- Ultra-wide 21:9 aspect ratio (like movie screens)
- Dramatic full-bleed images
- Content overlaid on images
- Zoom and parallax effects on scroll
- Gold accent on hover
- Perfect for hero-style presentations

**Features:**
- Scale animation on scroll (1.2x → 1x → 1.2x)
- Content parallax (text moves independently)
- Gradient overlays from black
- Large dramatic typography
- Immersive full-screen experience

---

## 🎨 Design Details

### Grid View Cards:
```
Aspect Ratio: 4:3
Image: Scales on hover (1.05x)
Typography: Compact, minimal
Spacing: 8px gap between cards
Animation: Fade up on scroll
```

### Immersive View Cards:
```
Aspect Ratio: 16:10
Layout: 2 columns (50/50 split)
Image: Parallax scroll effect
Typography: Large, editorial style
Spacing: 32px between projects
Animation: Fade up + image parallax
```

### Cinematic View Cards:
```
Aspect Ratio: 21:9 (ultra-wide)
Layout: Full-width single column
Image: Scale + zoom on scroll
Typography: Overlaid, dramatic
Spacing: 24px between projects
Animation: Scale + parallax + fade
```

---

## 💡 User Experience

### Hover Behavior:
**Grid Button:**
- Hover → Shows dropdown with 6 column options
- Click option → Instantly changes grid layout
- Active column is highlighted in black

**All Views:**
- Smooth transitions between layouts
- Maintains scroll position on view change
- Preserves category filter selection

### Filter Integration:
All three views work seamlessly with:
- ✅ Category filtering
- ✅ Project search (if added)
- ✅ Sort options (if added)

---

## 🔧 Technical Implementation

### State Management:
```typescript
const [viewType, setViewType] = useState<ViewType>('grid');
const [gridColumns, setGridColumns] = useState<GridColumns>(3);
const [showGridOptions, setShowGridOptions] = useState(false);
```

### Dynamic Grid Classes:
```typescript
const gridColsClass = {
  1: 'grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 lg:grid-cols-4',
  5: 'md:grid-cols-3 lg:grid-cols-5',
  6: 'md:grid-cols-3 lg:grid-cols-6',
}[columns];
```

### Animations:
- **Framer Motion** for smooth transitions
- **useScroll** hook for parallax effects
- **useTransform** for scroll-based animations
- **useInView** for scroll-triggered reveals

---

## 📱 Responsive Behavior

### Grid View:
- Mobile: Always 1 column
- Tablet: 2 columns (for 2-6 column selections)
- Desktop: Full selected column count

### Immersive View:
- Mobile: Stacked (image on top, content below)
- Desktop: Side-by-side 50/50 split
- Alternating direction maintained on desktop only

### Cinematic View:
- Mobile: 16:9 aspect ratio (more mobile-friendly)
- Desktop: Full 21:9 ultra-wide
- Content remains overlaid on all screen sizes

---

## 🎯 Best Use Cases

### Grid View:
- **When:** User wants to browse many projects quickly
- **Good for:** Portfolio overview, comparison shopping
- **User intent:** "Show me everything"

### Immersive View:
- **When:** User wants detailed information and storytelling
- **Good for:** Editorial presentations, case studies
- **User intent:** "Tell me more about each project"

### Cinematic View:
- **When:** User wants dramatic, impactful presentation
- **Good for:** Hero projects, luxury showcases
- **User intent:** "Impress me"

---

## 🚀 Performance Notes

### Optimizations:
- Images loaded with Next.js Image component
- Lazy loading via useInView (margin: -100px)
- Staggered animations prevent layout shift
- Responsive image sizes:
  - Grid: 800x600
  - Immersive: 1400x900
  - Cinematic: 2000x857

### Animation Performance:
- GPU-accelerated transforms (scale, translate)
- CSS transitions for color changes
- Throttled scroll listeners via Framer Motion
- One-time animations with `once: true`

---

## 🎨 Customization Options

### Adjust Default View:
```typescript
const [viewType, setViewType] = useState<ViewType>('grid'); // Change to 'immersive' or 'cinematic'
```

### Adjust Default Grid Columns:
```typescript
const [gridColumns, setGridColumns] = useState<GridColumns>(3); // Change to 1-6
```

### Add More Column Options:
```typescript
// In GridView component, add to gridColsClass:
7: 'md:grid-cols-4 lg:grid-cols-7',
8: 'md:grid-cols-4 lg:grid-cols-8',
```

### Adjust Aspect Ratios:
```typescript
// Grid: aspect-[4/3]
// Immersive: aspect-[16/10]
// Cinematic: aspect-[21/9]
```

---

## ✅ Testing Checklist

- [x] Grid view displays correctly for all column counts (1-6)
- [x] Dropdown appears on hover over "Grid" button
- [x] Dropdown options are clickable and change grid layout
- [x] Immersive view alternates image positions correctly
- [x] Cinematic view uses ultra-wide aspect ratio
- [x] All views work with category filtering
- [x] Animations trigger on scroll
- [x] Hover effects work on all card types
- [x] Images load correctly with proper sizes
- [x] Responsive behavior works on mobile/tablet/desktop
- [x] Transitions between views are smooth
- [x] Active view is highlighted in navigation

---

## 🎬 View Comparison

| Feature | Grid | Immersive | Cinematic |
|---------|------|-----------|-----------|
| **Aspect Ratio** | 4:3 | 16:10 | 21:9 |
| **Columns** | 1-6 (variable) | 2 | 1 |
| **Content Position** | Below image | Side-by-side | Overlaid |
| **Parallax** | None | Image only | Image + content |
| **Best For** | Browsing | Storytelling | Impact |
| **Screen Usage** | Compact | Balanced | Full-width |
| **Info Density** | High | Medium | Low |
| **Visual Impact** | Clean | Editorial | Dramatic |

---

## 🔮 Future Enhancements

Possible additions:
- [ ] Add "List View" (table-style)
- [ ] Add "Masonry View" (Pinterest-style)
- [ ] Save user's preferred view in localStorage
- [ ] Add animation speed controls
- [ ] Add density controls (compact/comfortable/spacious)
- [ ] Add custom column counts (7, 8+)
- [ ] Add fullscreen preview mode
- [ ] Add comparison mode (select multiple projects)

---

## 📖 Usage Example

```typescript
// User flow:
1. User lands on /projects
2. Default view: Grid (3 columns)
3. User hovers over "Grid" → dropdown appears
4. User clicks "4 Columns" → grid instantly changes
5. User clicks "Immersive" → view changes with smooth transition
6. User scrolls → parallax effects activate
7. User clicks "Cinematic" → ultra-wide cards appear
8. User hovers over project → scale + color effects
9. Category filter still works across all views
```

---

## 🎨 Color & Typography

### Grid View:
- Title: SchnyderS, 2xl, light
- Meta: Satoshi, xs, neutral-500
- Category badge: White/90 with backdrop blur

### Immersive View:
- Title: SchnyderS, 4xl-5xl, light
- Body: Satoshi, lg, light, neutral-600
- Category: Satoshi, uppercase, neutral-400

### Cinematic View:
- Title: SchnyderS, 5xl-7xl, light, white
- Body: Satoshi, lg, light, white/80
- Hover: Gold accent (#d4af37)

---

**All three views are now live and ready to use!** 🎉
