import { MetadataRoute } from 'next';
import { getProjects, getServices, getIndustries, getPosts } from '@/lib/wordpress';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mouhajerdesign.com';

  // Fetch all dynamic content
  const [projects, services, industries, posts] = await Promise.all([
    getProjects(),
    getServices(),
    getIndustries(),
    getPosts(),
  ]);

  // Static pages for both locales
  const locales = ['en', 'ar'];
  const staticPages = [
    '',
    '/projects',
    '/services',
    '/industries',
    '/blog',
    '/privacy',
    '/terms',
  ];

  const staticUrls: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      staticUrls.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : 0.8,
      });
    });
  });

  // Dynamic project pages
  const projectUrls: MetadataRoute.Sitemap = projects.flatMap((project) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/projects/${project.slug}`,
      lastModified: new Date(project.date || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Dynamic service pages
  const serviceUrls: MetadataRoute.Sitemap = services.flatMap((service) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/services/${service.slug}`,
      lastModified: new Date(service.date || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Dynamic industry pages
  const industryUrls: MetadataRoute.Sitemap = industries.flatMap((industry) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/industries/${industry.slug}`,
      lastModified: new Date(industry.date || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Dynamic blog posts
  const postUrls: MetadataRoute.Sitemap = posts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  );

  return [...staticUrls, ...projectUrls, ...serviceUrls, ...industryUrls, ...postUrls];
}
