import { MetadataRoute } from 'next';
import { cmsClient } from '@/lib/cms-client';

// ISR: Revalidate sitemap every hour
export const revalidate = 3600;

const SITE_URL = process.env['NEXT_PUBLIC_SITE_URL'] || 'https://mouhajer.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all published content from CMS
    const [projects, services, blogPosts, pages] = await Promise.all([
      cmsClient.getProjects(),
      cmsClient.getServices(),
      cmsClient.getBlogPosts('published'),
      cmsClient.getPages(),
    ]);

    const sitemap: MetadataRoute.Sitemap = [];

    // Homepage (highest priority)
    sitemap.push({
      url: `${SITE_URL}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });
    sitemap.push({
      url: `${SITE_URL}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    // Static pages (high priority)
    const staticPages = [
      { path: 'our-projects', priority: 0.9 },
      { path: 'services', priority: 0.9 },
      { path: 'blogs', priority: 0.8 },
      { path: 'who-we-are', priority: 0.8 },
      { path: 'contact-us', priority: 0.8 },
    ];

    staticPages.forEach(({ path, priority }) => {
      sitemap.push({
        url: `${SITE_URL}/en/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority,
      });
      sitemap.push({
        url: `${SITE_URL}/ar/${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority,
      });
    });

    // Project detail pages
    projects.forEach((project) => {
      const enSlug = project.slug?.en || project.id;
      const arSlug = project.slug?.ar || project.id;
      const lastMod = project.updatedAt ? new Date(project.updatedAt) : new Date();

      sitemap.push({
        url: `${SITE_URL}/en/our-projects/${enSlug}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
      sitemap.push({
        url: `${SITE_URL}/ar/our-projects/${arSlug}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });

    // Service detail pages
    services.forEach((service) => {
      const enSlug = service.slug?.en || service.id;
      const arSlug = service.slug?.ar || service.id;
      const lastMod = service.updatedAt ? new Date(service.updatedAt) : new Date();

      sitemap.push({
        url: `${SITE_URL}/en/services/${enSlug}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
      sitemap.push({
        url: `${SITE_URL}/ar/services/${arSlug}`,
        lastModified: lastMod,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });

    // Blog post detail pages
    blogPosts.forEach((post) => {
      const enSlug = post.slug?.en || post.id;
      const arSlug = post.slug?.ar || post.id;
      const lastMod = post.updatedAt ? new Date(post.updatedAt) : new Date();

      sitemap.push({
        url: `${SITE_URL}/en/blogs/${enSlug}`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
      sitemap.push({
        url: `${SITE_URL}/ar/blogs/${arSlug}`,
        lastModified: lastMod,
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    });

    // Custom pages from CMS
    pages
      .filter((page) => page.status === 'published' && page.slug)
      .forEach((page) => {
        const enSlug = page.slug?.en;
        const arSlug = page.slug?.ar;
        const lastMod = page.updatedAt ? new Date(page.updatedAt) : new Date();

        // Skip homepage (already added above)
        if (enSlug && enSlug !== 'home') {
          sitemap.push({
            url: `${SITE_URL}/en/${enSlug}`,
            lastModified: lastMod,
            changeFrequency: 'monthly',
            priority: 0.5,
          });
        }
        if (arSlug && arSlug !== 'home') {
          sitemap.push({
            url: `${SITE_URL}/ar/${arSlug}`,
            lastModified: lastMod,
            changeFrequency: 'monthly',
            priority: 0.5,
          });
        }
      });

    console.log(`[Sitemap] Generated ${sitemap.length} URLs`);
    return sitemap;
  } catch (error) {
    console.error('[Sitemap] Error generating sitemap:', error);

    // Return minimal sitemap as fallback
    return [
      {
        url: `${SITE_URL}/en`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/ar`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
