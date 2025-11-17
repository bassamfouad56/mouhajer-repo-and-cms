# Mouhajer International Design - Website

Award-winning luxury interior design website built with Next.js 15, featuring WordPress as a headless CMS, stunning animations, and comprehensive SEO optimization.

## Features

- ✨ **Award-Winning Design**: Elegant, minimalist, and professional UI/UX inspired by Awwwards
- 🎨 **Premium Animations**: GSAP character animations, Framer Motion transitions, smooth scrolling with Lenis
- 📱 **Fully Responsive**: Optimized for all devices from mobile to 4K displays
- 🚀 **Performance Optimized**: Fast loading times, code splitting, and image optimization
- 🔍 **SEO Excellence**: Comprehensive metadata, Open Graph, Twitter Cards, and semantic HTML
- 📊 **Analytics Ready**: Google Analytics and Google Tag Manager pre-configured
- 🎯 **WordPress CMS**: Headless WordPress integration via GraphQL
- ✉️ **Contact Form**: Professional email integration with Nodemailer and auto-responder
- 🎭 **Loading Experience**: Elegant loading screen with progress animation
- 🎪 **Smooth Scrolling**: Buttery smooth scroll experience with Lenis

## Tech Stack

- **Framework**: Next.js 15.1.3 (App Router with RSC)
- **Styling**: Tailwind CSS v4
- **Animations**:
  - GSAP for text splitting and character animations
  - Framer Motion for component animations
  - Lenis for smooth scrolling
- **CMS**: WordPress (Headless) via GraphQL
- **Language**: TypeScript 5
- **Email**: Nodemailer with Gmail SMTP
- **Forms**: React Hook Form + Zod validation
- **Fonts**: Inter (body), Playfair Display (accents)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- WordPress site with WPGraphQL plugin enabled
- SMTP credentials (Gmail configured in .env.local)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env.local`

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
mouhajer-new-marketing-website/
├── app/
│   ├── api/
│   │   └── contact/          # Contact form API endpoint
│   │       └── route.ts
│   ├── layout.tsx            # Root layout with fonts & analytics
│   ├── page.tsx              # Homepage
│   └── globals.css           # Global styles & animations
├── components/
│   ├── sections/             # Page sections
│   │   ├── hero.tsx         # Hero section with GSAP text animation
│   │   ├── projects.tsx     # Projects showcase grid
│   │   ├── services.tsx     # Services cards
│   │   ├── about.tsx        # About section with parallax
│   │   └── contact.tsx      # Contact form
│   ├── providers/
│   │   └── smooth-scroll-provider.tsx
│   ├── header.tsx           # Navigation with mobile menu
│   ├── footer.tsx           # Footer with newsletter
│   └── loading-screen.tsx   # Loading animation
├── lib/
│   ├── wordpress.ts         # WordPress GraphQL client & queries
│   └── utils.ts             # Utility functions & animations
├── public/                  # Static assets
├── .env.local              # Environment variables
└── package.json
```

## Key Sections

### Hero Section
- GSAP SplitType text animation
- Parallax scroll effects
- Animated statistics counter
- Gradient orb backgrounds
- Smooth scroll indicator

### Projects Showcase
- Masonry-style grid layout
- Hover effects with image zoom
- Category and location badges
- Links to detailed project pages
- Fetches from WordPress CMS

### Services Section
- Icon-based service cards
- Hover animations
- Custom lucide-react icons
- Gradient overlays

### About Section
- Parallax image scrolling
- Company statistics
- Philosophy blockquote
- Call-to-action

### Contact Form
- Form validation with Zod
- Email integration via Nodemailer
- Auto-responder to customers
- Admin notification emails
- Error handling & success states

## WordPress Setup

Your WordPress site should have the following installed:
- WPGraphQL plugin
- Advanced Custom Fields (ACF) Pro

### Custom Post Types Needed:
1. **Projects**
2. **Services**
3. **Testimonials** (optional)

### ACF Custom Fields for Projects:
```
projectFields {
  category (text)
  location (text)
  year (text)
  description (textarea)
  gallery (gallery)
}
```

### ACF Custom Fields for Testimonials:
```
testimonialFields {
  clientName (text)
  clientPosition (text)
  rating (number)
  projectName (text)
}
```

**Note**: Until WordPress custom fields are configured, the site will display placeholder content with beautiful stock images.

## Environment Variables

The `.env.local` file contains:

```bash
# WordPress
NEXT_PUBLIC_WORDPRESS_API_URL=https://yuz.beb.mybluehost.me/website_d5ecf311/graphql
WP_USERNAME=admin
WP_APP_PASSWORD=C70GrB0sT0dTRVAL5y0TIIeo

# Site
NEXT_PUBLIC_SITE_URL=https://www.mouhajerdesign.com
NEXT_PUBLIC_EMAIL=info@mouhajerdesign.com
NEXT_PUBLIC_PHONE=+971-4-323-4567
NEXT_PUBLIC_WHATSAPP=+971501234567

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mouhajergallery@gmail.com
SMTP_PASSWORD=ubzyuauifiitxwky
ADMIN_EMAIL=info@mouhajerdesign.com

# Analytics
NEXT_PUBLIC_GA_ID=G-J64X79BD59
NEXT_PUBLIC_GTM_ID=GTM-MGNHGSH6
```

## Build & Deploy

### Development:
```bash
npm run dev
```

### Type checking:
```bash
npm run typecheck
```

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Deploy to Vercel:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Performance Features

- ⚡ **First Load JS**: ~217 KB (optimized)
- 🎯 **Static Generation**: Homepage pre-rendered at build time
- 🖼️ **Image Optimization**: Next.js automatic image optimization
- 📦 **Code Splitting**: Automatic route-based code splitting
- 🔄 **Revalidation**: ISR with 1-hour revalidation for CMS content
- 🎨 **CSS**: Tailwind CSS with purging for minimal CSS bundle

## SEO Features

✅ Comprehensive meta tags (title, description, keywords)
✅ Open Graph tags for social sharing
✅ Twitter Card tags
✅ Canonical URLs
✅ Semantic HTML5 structure
✅ Optimized heading hierarchy
✅ Alt text for all images
✅ Fast loading times
✅ Mobile-friendly responsive design
✅ Structured data ready

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS 12+)
- ✅ Chrome Mobile (latest)

## Design Features

### Typography
- **Primary Font**: Inter (clean, modern sans-serif)
- **Accent Font**: Playfair Display (elegant serif for headings)
- Font loading optimization with Next.js Font

### Color Palette
- **Primary**: Neutral blacks (#0a0a0a, #171717)
- **Backgrounds**: Whites and light grays (#ffffff, #fafafa)
- **Accents**: Subtle purples and blues for visual interest
- **Dark Mode**: Not implemented (luxury design focuses on light)

### Animation Principles
- Smooth, elegant transitions (0.5-1s duration)
- Easing: Cubic bezier curves for natural motion
- Scroll-triggered animations for engagement
- Loading states for better UX
- No jarring or distracting movements

## Troubleshooting

### WordPress GraphQL Errors
If you see GraphQL field errors during build:
1. Ensure WPGraphQL plugin is installed and activated
2. Check that custom post types are registered with `show_in_graphql => true`
3. Verify ACF field groups have GraphQL field names configured
4. The site will gracefully fallback to placeholder content if WordPress is unavailable

### SMTP Email Errors
If contact form emails aren't sending:
1. Verify SMTP credentials in `.env.local`
2. For Gmail, you may need to generate an App Password
3. Check SMTP_HOST and SMTP_PORT settings
4. Review server logs for detailed error messages

### Build Errors
If the build fails:
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Future Enhancements

- [ ] Individual project detail pages
- [ ] Blog/News section
- [ ] Team member profiles
- [ ] Client portal
- [ ] 3D model integration with Three.js
- [ ] Multi-language support (EN/AR)
- [ ] Advanced filtering for projects
- [ ] Video backgrounds
- [ ] Virtual tour integration

## Support & Contact

- **Website**: https://www.mouhajerdesign.com
- **Email**: info@mouhajerdesign.com
- **Phone**: +971-4-323-4567
- **WhatsApp**: +971501234567

## License

© 2024 Mouhajer International Design. All rights reserved.

---

**Built with ❤️ using Next.js 15**
