# Portfolio Showcase Section - Implementation Guide

This guide explains how to use the new Portfolio Showcase component that matches your design requirements.

## Overview

The Portfolio Showcase component is a premium carousel-style section that displays your featured projects with:
- ✨ Large serif typography matching your design
- 🎨 Black background with elegant white text
- 🎯 Circular navigation arrows
- 📊 Project counter showing total portfolio size
- 🖼️ Two-column project grid with hover effects
- 📱 Fully responsive design
- 🌐 RTL support for Arabic

## File Structure

```
apps/frontend/
├── components/
│   └── PortfolioShowcase.tsx          # Main component
├── app/
│   └── [locale]/
│       └── page.tsx                    # Homepage integration
└── lib/
    └── graphql/
        └── server-client.ts            # Helper functions
```

## Component Features

### 1. Header Section
- Large serif "PORTFOLIO ✦ PORTFOLIO" title
- Project counter (e.g., "+400 PROJECTS")
- "SEE ALL PROJECTS" link

### 2. Carousel Navigation
- Slide counter (01/05)
- Circular navigation arrows
- Auto-disabled during animation
- Smooth transitions

### 3. Project Cards
- Large featured project (left)
- Secondary project (right)
- Hover effects with "VIEW" button overlay
- Category badges
- Add to favorites button (+)

### 4. Progress Indicators
- Dot navigation at bottom
- Active slide highlighting
- Clickable dots for direct navigation

## Usage

### Basic Integration

The component is already integrated into your homepage at [apps/frontend/app/[locale]/page.tsx](apps/frontend/app/[locale]/page.tsx).

It will automatically display when:
1. You have featured projects in your database
2. The projects have images
3. The projects are published

### Props

```typescript
interface PortfolioShowcaseProps {
  projects: Project[];           // Array of project objects
  locale?: 'en' | 'ar';         // Language locale
  totalProjectsCount?: number;   // Total projects count for display
}
```

### Project Data Structure

```typescript
interface Project {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  category: string;              // e.g., "INTERIOR DESIGN, FITOUT"
  images: string[];              // Array of image URLs
  featured: boolean;
}
```

## Setting Up Projects in CMS

### Step 1: Mark Projects as Featured

1. Go to your CMS: `http://localhost:3010/projects`
2. Edit a project
3. Check the **"Featured"** checkbox
4. Make sure the project has:
   - Title in both English and Arabic
   - At least one image
   - Category filled out
   - Status set to "Published"
5. Save the project

### Step 2: Verify Data

1. Open your GraphQL playground: `http://localhost:3010/api/graphql`
2. Run this query to see featured projects:

```graphql
query GetFeaturedProjects {
  projects(filter: { featured: true }, limit: 10) {
    projects {
      id
      titleEn
      titleAr
      descriptionEn
      category
      images
      featured
    }
    total
  }
}
```

### Step 3: View on Frontend

1. Start your frontend: `npm run dev:frontend`
2. Navigate to: `http://localhost:3000/en` or `http://localhost:3000/ar`
3. Scroll down to see the Portfolio Showcase section

## Customization

### Change Number of Projects Per Slide

In [PortfolioShowcase.tsx](apps/frontend/components/PortfolioShowcase.tsx), line 29:

```typescript
// Current: 2 projects per slide
const slidesCount = Math.ceil(projects.length / 2);

// To show 3 projects per slide:
const slidesCount = Math.ceil(projects.length / 3);
```

Then update the grid layout (line 205):

```typescript
// Current
<div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">

// For 3 columns
<div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
```

### Change Animation Speed

Line 37 and 42:

```typescript
// Current: 600ms
setTimeout(() => setIsAnimating(false), 600);

// Faster: 400ms
setTimeout(() => setIsAnimating(false), 400);

// Slower: 800ms
setTimeout(() => setIsAnimating(false), 800);
```

### Customize Colors

The component uses Tailwind CSS. To change colors:

**Background:**
```typescript
// Line 48: Black background
<section className="bg-black text-white ...">

// Change to dark gray
<section className="bg-gray-900 text-white ...">
```

**Hover Button:**
```typescript
// Line 104: White button on hover
className="w-24 h-24 rounded-full bg-white text-black ...">

// Change to gold
className="w-24 h-24 rounded-full bg-yellow-500 text-black ...">
```

### Add Auto-play

Add this to the component (after line 32):

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    nextSlide();
  }, 5000); // Auto-advance every 5 seconds

  return () => clearInterval(interval);
}, [currentSlide]);
```

### Custom Typography

The component uses `font-serif` for headings. To customize:

1. Update [tailwind.config.ts](apps/frontend/tailwind.config.ts):

```typescript
theme: {
  extend: {
    fontFamily: {
      serif: ['Playfair Display', 'serif'], // Add your custom font
    }
  }
}
```

2. Import the font in [layout.tsx](apps/frontend/app/layout.tsx):

```typescript
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
```

## Styling Tips

### Matching the Screenshot

The design uses:
- **Font**: Serif typeface (Playfair Display, Crimson, or similar)
- **Spacing**: Large padding (py-20)
- **Typography**: Mixed sizes (8xl for header, 2xl for project names)
- **Effects**: Subtle hover animations
- **Icons**: Decorative star (✦) separators

### Responsive Breakpoints

- **Mobile (< 768px)**: Single column, stacked layout
- **Tablet (768px - 1024px)**: Single column with larger images
- **Desktop (> 1024px)**: Two-column grid layout
- **Large screens (> 1600px)**: Max-width container

## Troubleshooting

### Projects Not Showing

**Check:**
1. Are projects marked as "featured"?
2. Are projects "published"?
3. Do projects have images?
4. Is GraphQL endpoint working?

**Test:**
```bash
# Check GraphQL endpoint
curl -X POST http://localhost:3010/api/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ projects(filter:{featured:true}){projects{id titleEn}}}"}'
```

### Images Not Loading

**Verify:**
1. Image URLs are absolute paths
2. Images exist in the media library
3. Image URLs are accessible
4. Next.js Image optimization is configured

**Fix in [next.config.js](apps/frontend/next.config.js):**
```javascript
images: {
  domains: ['your-cms-domain.com'],
}
```

### Navigation Not Working

**Check browser console for errors:**
1. Animation timing conflicts
2. State update issues
3. Click handler binding

**Debug:**
```typescript
// Add logging in nextSlide function
const nextSlide = () => {
  console.log('Next slide clicked', { currentSlide, slidesCount });
  // ... rest of code
};
```

### Styling Issues

**Common fixes:**
1. Clear browser cache
2. Rebuild Tailwind: `npm run build`
3. Check Tailwind config includes component path
4. Verify all Tailwind classes are valid

## Advanced Features

### Add Filters

Add category filtering to the showcase:

```typescript
const [selectedCategory, setSelectedCategory] = useState('all');

const filteredProjects = projects.filter(p =>
  selectedCategory === 'all' || p.category === selectedCategory
);
```

### Add Search

Implement real-time search:

```typescript
const [searchTerm, setSearchTerm] = useState('');

const searchedProjects = projects.filter(p =>
  p.titleEn.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### Analytics Tracking

Track carousel interactions:

```typescript
const nextSlide = () => {
  // ... existing code

  // Track in Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'portfolio_slide_next', {
      slide_number: currentSlide + 1,
    });
  }
};
```

### Lazy Loading

Optimize image loading:

```typescript
<Image
  src={mainProject.images[0]}
  alt={mainProject.titleEn}
  fill
  loading="lazy" // Add lazy loading
  placeholder="blur" // Add blur placeholder
  blurDataURL="/placeholder-blur.jpg"
  className="object-cover ..."
/>
```

## Performance Optimization

### 1. Image Optimization

Use Next.js Image optimization:
- Automatic WebP conversion
- Responsive images
- Lazy loading
- Blur placeholders

### 2. Code Splitting

The component is already code-split by Next.js.

### 3. Memoization

Add memoization for expensive calculations:

```typescript
import { useMemo } from 'react';

const currentProjects = useMemo(() => {
  const startIdx = currentSlide * 2;
  return projects.slice(startIdx, startIdx + 2);
}, [currentSlide, projects]);
```

## Accessibility

The component includes:
- ✅ ARIA labels on buttons
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Semantic HTML

### Improvements

Add keyboard shortcuts:

```typescript
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

## Testing

### Manual Testing Checklist

- [ ] Projects display correctly
- [ ] Navigation arrows work
- [ ] Progress dots are clickable
- [ ] Hover effects work
- [ ] Images load properly
- [ ] Links work correctly
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Works in both English and Arabic
- [ ] Animations are smooth
- [ ] No console errors

### Automated Testing

Add Jest tests:

```typescript
import { render, screen } from '@testing-library/react';
import PortfolioShowcase from './PortfolioShowcase';

test('renders portfolio showcase', () => {
  const mockProjects = [
    { id: '1', titleEn: 'Test Project', images: ['/test.jpg'], ... }
  ];

  render(<PortfolioShowcase projects={mockProjects} />);

  expect(screen.getByText('PORTFOLIO')).toBeInTheDocument();
  expect(screen.getByText('Test Project')).toBeInTheDocument();
});
```

## Next Steps

1. **Add more projects** to your CMS
2. **Mark projects as featured** for the carousel
3. **Upload high-quality images** for each project
4. **Test on different devices** and screen sizes
5. **Customize colors and fonts** to match your brand
6. **Enable auto-play** if desired
7. **Add analytics tracking** for insights
8. **Optimize images** for performance

## Support

For issues or questions:
- Check the browser console for errors
- Verify GraphQL queries are working
- Ensure projects have all required fields
- Test with different browsers
- Check responsive design on mobile

## Resources

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hooks Reference](https://react.dev/reference/react)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Created**: October 2025
**Status**: ✅ Production Ready
**Component**: [PortfolioShowcase.tsx](apps/frontend/components/PortfolioShowcase.tsx)
