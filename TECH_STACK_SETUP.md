# Mouhajer Marketing Website - Premium Tech Stack Setup

## 🎯 Tech Stack Overview

**Framework:** Next.js 15 (App Router) + React 19
**Language:** TypeScript (strict mode)
**Styling:** Tailwind CSS 4 + CSS Variables
**CMS:** WordPress Headless (GraphQL)
**Animation:** GSAP Pro + Framer Motion + Three.js

---

## 📦 Package.json Setup

```json
{
  "name": "mouhajer-marketing",
  "version": "2.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    // CMS Integration
    "graphql": "^16.8.1",
    "graphql-request": "^7.3.1",
    "@graphql-codegen/cli": "^5.0.2",

    // Animation Core
    "framer-motion": "^11.5.0",
    "gsap": "^3.12.5",
    "@gsap/react": "^2.1.0",
    "@studio-freight/lenis": "^1.0.42",

    // 3D & WebGL
    "three": "^0.169.0",
    "@react-three/fiber": "^8.16.0",
    "@react-three/drei": "^9.105.0",
    "@react-three/postprocessing": "^2.16.0",
    "@theatre/core": "^0.5.1",
    "@theatre/studio": "^0.5.1",

    // UI Components (Premium)
    "aceternity-ui": "^0.2.0",
    "magicui": "^0.1.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-slot": "^1.1.0",

    // Typography & Text Effects
    "split-type": "^0.3.4",
    "@next/font": "^14.0.0",

    // Utilities
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.2",
    "class-variance-authority": "^0.7.0",
    "react-intersection-observer": "^9.10.0",
    "zustand": "^4.5.2",

    // Forms & Validation
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.169.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8",
    "eslint": "^8",
    "eslint-config-next": "15.0.0"
  }
}
```

---

## 🎨 Awwwards-Level Design Patterns

### 1. Hero Section (3D + Scroll Morphing)
```typescript
// components/Hero3D.tsx
import { Canvas } from '@react-three/fiber';
import { ScrollControls, useScroll } from '@react-three/drei';

export function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ScrollControls pages={3}>
        <AbstractShape /> {/* Morphing 3D geometry */}
      </ScrollControls>
    </Canvas>
  );
}
```

### 2. Bento Grid Layout (Asymmetric)
```typescript
// components/BentoGrid.tsx
import { motion } from 'framer-motion';

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export function BentoGrid({ items }) {
  return (
    <motion.div
      variants={gridVariants}
      className="grid grid-cols-12 gap-4 auto-rows-[250px]"
    >
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
          }}
          className={getGridSpan(i)} // Dynamic col-span logic
          whileHover={{ scale: 1.02 }}
        >
          <Card item={item} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### 3. Smooth Scroll (Lenis)
```typescript
// components/SmoothScroll.tsx
'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

### 4. Magnetic Cursor
```typescript
// components/MagneticCursor.tsx
import { useEffect } from 'react';
import gsap from 'gsap';

export function MagneticButton({ children }) {
  useEffect(() => {
    const button = document.querySelector('.magnetic-btn');

    button?.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const x = (e.clientX - left - width / 2) / 2;
      const y = (e.clientY - top - height / 2) / 2;

      gsap.to(button, { x, y, duration: 0.4 });
    });

    button?.addEventListener('mouseleave', () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.4 });
    });
  }, []);

  return <button className="magnetic-btn">{children}</button>;
}
```

---

## 🎬 Advanced Animation Examples

### Text Split Animation (GSAP)
```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

export function AnimatedHeading({ text }) {
  const headingRef = useRef(null);

  useEffect(() => {
    const split = new SplitType(headingRef.current!, { types: 'chars' });

    gsap.from(split.chars, {
      opacity: 0,
      y: 100,
      rotateX: -90,
      stagger: 0.02,
      duration: 0.8,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 80%'
      }
    });
  }, []);

  return <h1 ref={headingRef}>{text}</h1>;
}
```

### Image Reveal on Scroll
```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function RevealImage({ src }) {
  const imageRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 75%'
        }
      }
    );
  }, []);

  return <img ref={imageRef} src={src} />;
}
```

---

## 🏗️ URL Structure

```
/                                  → Homepage (3D Hero + Showcase)
/about                             → Company Story
/services                          → Services Overview (Bento Grid)
  /services/[category]             → e.g., /services/interior-design
  /services/[category]/[slug]      → e.g., /services/interior-design/residential
/projects                          → Projects Gallery (Filterable Grid)
  /projects/[category]             → e.g., /projects/residential
  /projects/[slug]                 → Case Study (Parallax Sections)
/industries                        → Industries Overview
  /industries/[slug]               → e.g., /industries/hospitality
/expertise                         → Capabilities + Awards
/insights                          → Blog/Articles
  /insights/[slug]                 → Individual Article
/contact                           → Contact Form + Map
```

**SEO Best Practices:**
- Use descriptive slugs: `/services/luxury-villa-interior-design`
- Category hierarchy: `/projects/residential/dubai-penthouses`
- Breadcrumbs for navigation

---

## 🎨 Premium Typography Stack

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

:root {
  --font-heading: 'PP Mori', 'Helvetica Neue', sans-serif;
  --font-body: 'Inter Variable', system-ui;
  --font-accent: 'GT Alpina', Georgia, serif;
}

h1, h2, h3 {
  font-family: var(--font-heading);
  font-weight: 400; /* Light for elegance */
  letter-spacing: -0.02em;
}

body {
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
}

/* Fluid typography */
h1 {
  font-size: clamp(2.5rem, 8vw, 7rem);
}

h2 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

---

## 🔌 WordPress CMS Integration

### GraphQL Client Setup
```typescript
// lib/wordpress-client.ts
import { GraphQLClient } from 'graphql-request';

export const wpClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL!,
  {
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
    next: { revalidate: 3600 } // ISR
  }
);
```

### Fetch Projects with ACF Fields
```typescript
// lib/queries/projects.ts
import { gql } from 'graphql-request';

export const GET_PROJECTS_WITH_ACF = gql`
  query GetProjects {
    projects(first: 100) {
      nodes {
        id
        slug
        title
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        projectCategories {
          nodes {
            name
            slug
          }
        }
        projectDetails {
          client
          year
          location
          industry
          services
          imageGallery {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
```

---

## 🚀 Performance Optimizations

### 1. Image Optimization
```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      loading="lazy"
      quality={90}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..." // Low-quality placeholder
      {...props}
    />
  );
}
```

### 2. Code Splitting
```typescript
// app/projects/page.tsx
import dynamic from 'next/dynamic';

const ProjectsGallery = dynamic(() => import('@/components/ProjectsGallery'), {
  loading: () => <Skeleton />,
  ssr: false // Client-side only for heavy 3D components
});
```

### 3. Font Loading Strategy
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true
});
```

---

## 🎭 Design Principles

### Color Palette (Luxury)
```css
:root {
  --color-primary: #1a1a1a;        /* Deep Black */
  --color-accent: #d4af37;         /* Gold */
  --color-bg: #fafafa;             /* Off-white */
  --color-text: #2d2d2d;           /* Charcoal */
  --color-text-muted: #6b6b6b;     /* Gray */
}
```

### Spacing System (8pt Grid)
```css
:root {
  --space-1: 0.5rem;   /* 8px */
  --space-2: 1rem;     /* 16px */
  --space-3: 1.5rem;   /* 24px */
  --space-4: 2rem;     /* 32px */
  --space-6: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
  --space-12: 6rem;    /* 96px */
  --space-16: 8rem;    /* 128px */
}
```

### Elevation (Shadows)
```css
:root {
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 24px rgba(0,0,0,0.12);
  --shadow-xl: 0 24px 48px rgba(0,0,0,0.16);
}
```

---

## 📱 Responsive Design Tokens

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px', // For large displays
    },
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'magnetic': 'magnetic 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
};
```

---

## 🔒 Security & Best Practices

1. **Environment Variables**: Never expose WordPress credentials
2. **CSP Headers**: Configure strict Content Security Policy
3. **Rate Limiting**: Protect API routes (contact forms)
4. **Image CDN**: Use Cloudinary/Imgix for optimized delivery
5. **A11y**: WCAG 2.1 AA compliance (Radix UI helps)

---

## 🎯 Next Steps

1. **Initialize Next.js 15 project**
2. **Install dependencies** (see package.json above)
3. **Set up WordPress connection** (copy `.env` config)
4. **Build component library** (start with primitives)
5. **Implement design system** (tokens, colors, typography)
6. **Create layout templates** (homepage, service pages)
7. **Add animations** (GSAP + Framer Motion)
8. **Optimize performance** (Lighthouse score > 95)

---

## 🌟 Inspiration Resources

- **Awwwards.com**: Filter by "Design Agency" + "Architecture"
- **Godly.website**: Modern web design gallery
- **Codrops**: Advanced UI patterns
- **Lusion.co**: Example of premium 3D web design
- **Active Theory**: WebGL mastery

---

## 📚 Learning Resources

- **Three.js Journey** (3D fundamentals)
- **GSAP ScrollTrigger Docs** (scroll animations)
- **Framer Motion Recipes** (interaction patterns)
- **Awwwards Course** (premium web design)

---

**Let's build something extraordinary! 🚀**
