// Sitemap generation utilities
import { MetadataRoute } from 'next'

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] || 'https://www.mouhajerdesign.com'

// Static pages configuration
const STATIC_PAGES = [
  {
    url: '',
    priority: 1.0,
    changeFrequency: 'weekly' as const
  },
  {
    url: '/about',
    priority: 0.9,
    changeFrequency: 'monthly' as const
  },
  {
    url: '/services',
    priority: 0.9,
    changeFrequency: 'monthly' as const
  },
  {
    url: '/our-projects',
    priority: 0.8,
    changeFrequency: 'weekly' as const
  },
  {
    url: '/contact',
    priority: 0.7,
    changeFrequency: 'monthly' as const
  },
  {
    url: '/careers',
    priority: 0.6,
    changeFrequency: 'monthly' as const
  },
  {
    url: '/suppliers',
    priority: 0.5,
    changeFrequency: 'monthly' as const
  },
  {
    url: '/privacy-policy',
    priority: 0.3,
    changeFrequency: 'yearly' as const
  },
  {
    url: '/terms-of-service',
    priority: 0.3,
    changeFrequency: 'yearly' as const
  }
]

// Service pages (if they exist)
const SERVICE_PAGES = [
  'residential-interior-design',
  'commercial-interior-design',
  'villa-interior-design',
  'apartment-renovation',
  'office-interior-design',
  'hotel-interior-design',
  'restaurant-interior-design',
  'luxury-interior-design',
  'modern-interior-design',
  'traditional-interior-design',
  'interior-design-consultation',
  'space-planning',
  'furniture-selection',
  'lighting-design',
  'color-consultation'
]

// Location-based landing pages
const LOCATION_PAGES = [
  'dubai-interior-design',
  'abu-dhabi-interior-design',
  'sharjah-interior-design',
  'ajman-interior-design',
  'ras-al-khaimah-interior-design',
  'fujairah-interior-design',
  'umm-al-quwain-interior-design',
  'jumeirah-interior-design',
  'downtown-dubai-interior-design',
  'marina-dubai-interior-design',
  'business-bay-interior-design',
  'jbr-interior-design'
]

export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  // Add static pages
  STATIC_PAGES.forEach(page => {
    sitemap.push({
      url: `${SITE_URL}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority
    })
  })

  // Add service pages
  SERVICE_PAGES.forEach(service => {
    sitemap.push({
      url: `${SITE_URL}/services/${service}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7
    })
  })

  // Add location pages
  LOCATION_PAGES.forEach(location => {
    sitemap.push({
      url: `${SITE_URL}/${location}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8
    })
  })

  // Add dynamic content from CMS (if available)
  try {
    // Uncomment when Sanity is properly configured
    // const projects = await getProjects()
    // projects.forEach(project => {
    //   sitemap.push({
    //     url: `${SITE_URL}/our-projects/${project.slug}`,
    //     lastModified: new Date(project._updatedAt),
    //     changeFrequency: 'monthly',
    //     priority: 0.6,
    //     alternates: {
    //       languages: {
    //         en: `/en/our-projects/${project.slug}`,
    //         ar: `/ar/our-projects/${project.slug}`
    //       }
    //     }
    //   })
    // })

    // const blogPosts = await getBlogPosts()
    // blogPosts.forEach(post => {
    //   sitemap.push({
    //     url: `${SITE_URL}/blog/${post.slug}`,
    //     lastModified: new Date(post._updatedAt),
    //     changeFrequency: 'monthly',
    //     priority: 0.5,
    //     alternates: {
    //       languages: {
    //         en: `/en/blog/${post.slug}`,
    //         ar: `/ar/blog/${post.slug}`
    //       }
    //     }
    //   })
    // })
  } catch (error) {
    console.warn('Could not fetch dynamic content for sitemap:', error)
  }

  return sitemap
}

// Generate robots.txt
export function generateRobots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/private/',
          '/_next/',
          '/studio/',
          '*.json',
          '/search?*'
        ]
      },
      {
        userAgent: 'GPTBot',
        disallow: '/'
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/'
      },
      {
        userAgent: 'CCBot',
        disallow: '/'
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  }
}

// Image sitemap for better image SEO
export async function generateImageSitemap() {
  const images = [
    {
      url: `${SITE_URL}/og-default.jpg`,
      title: 'Mouhajer International Design - Luxury Interior Design Dubai',
      caption: 'Award-winning interior design company in Dubai specializing in luxury residential and commercial spaces'
    },
    {
      url: `${SITE_URL}/hero-bg.jpg`,
      title: 'Luxury Villa Interior Design Dubai',
      caption: 'Modern luxury villa interior design by Mouhajer International Design'
    }
    // Add more images as needed
  ]

  const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${images.map(image => `
  <url>
    <loc>${SITE_URL}/</loc>
    <image:image>
      <image:loc>${image.url}</image:loc>
      <image:title>${image.title}</image:title>
      <image:caption>${image.caption}</image:caption>
    </image:image>
  </url>
`).join('')}
</urlset>`

  return imageSitemap
}

// News sitemap for blog posts
export async function generateNewsSitemap() {
  // This would fetch recent blog posts from your CMS
  const recentPosts: Array<{ url: string; publishedAt: string; title: string; language: string }> = [
    // Example structure:
    // {
    //   url: '/blog/latest-interior-design-trends-2024',
    //   publishedAt: '2024-01-15',
    //   title: 'Latest Interior Design Trends 2024',
    //   language: 'en'
    // }
  ]

  if (recentPosts.length === 0) return null

  const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentPosts.map(post => `
  <url>
    <loc>${SITE_URL}${post.url}</loc>
    <news:news>
      <news:publication>
        <news:name>Mouhajer International Design</news:name>
        <news:language>${post.language}</news:language>
      </news:publication>
      <news:publication_date>${post.publishedAt}</news:publication_date>
      <news:title>${post.title}</news:title>
    </news:news>
  </url>
`).join('')}
</urlset>`

  return newsSitemap
}

// Video sitemap for project videos
export async function generateVideoSitemap() {
  const videos: Array<{ url: string; videoUrl: string; thumbnailUrl: string; title: string; description: string; duration: number; viewCount: number }> = [
    // Example structure:
    // {
    //   url: '/our-projects/luxury-villa-dubai',
    //   videoUrl: 'https://example.com/video.mp4',
    //   thumbnailUrl: 'https://example.com/thumb.jpg',
    //   title: 'Luxury Villa Interior Design - Dubai',
    //   description: 'Complete transformation of a luxury villa in Dubai',
    //   duration: 120,
    //   viewCount: 1500
    // }
  ]

  if (videos.length === 0) return null

  const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videos.map(video => `
  <url>
    <loc>${SITE_URL}${video.url}</loc>
    <video:video>
      <video:thumbnail_loc>${video.thumbnailUrl}</video:thumbnail_loc>
      <video:title>${video.title}</video:title>
      <video:description>${video.description}</video:description>
      <video:content_loc>${video.videoUrl}</video:content_loc>
      <video:duration>${video.duration}</video:duration>
      <video:view_count>${video.viewCount}</video:view_count>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
  </url>
`).join('')}
</urlset>`

  return videoSitemap
}