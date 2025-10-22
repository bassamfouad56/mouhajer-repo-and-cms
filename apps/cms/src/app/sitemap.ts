import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

async function getPages() {
  try {
    return await prisma.page.findMany({
      where: { status: 'published' },
      select: { id: true, slugEn: true, slugAr: true, updatedAt: true }
    });
  } catch (error) {
    console.error('Error reading pages:', error);
    return [];
  }
}

async function getProjects() {
  try {
    return await prisma.project.findMany({
      where: { status: 'published' },
      select: { id: true, updatedAt: true }
    });
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

async function getBlogPosts() {
  try {
    return await prisma.blogPost.findMany({
      where: { status: 'published' },
      select: { id: true, slugEn: true, slugAr: true, publishedAt: true }
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { status: 'published' },
      select: { id: true, updatedAt: true }
    });
  } catch (error) {
    console.error('Error reading services:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mouhajer.ae';

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ar: `${baseUrl}/ar`,
        },
      },
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          ar: `${baseUrl}/ar`,
        },
      },
    },
  ];

  // Dynamic pages
  const pages = await getPages();
  const pageRoutes: MetadataRoute.Sitemap = pages.flatMap((page) => [
    {
      url: `${baseUrl}/en/${page.slugEn}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/${page.slugEn}`,
          ar: `${baseUrl}/ar/${page.slugAr}`,
        },
      },
    },
    {
      url: `${baseUrl}/ar/${page.slugAr}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/${page.slugEn}`,
          ar: `${baseUrl}/ar/${page.slugAr}`,
        },
      },
    },
  ]);

  // Projects
  const projects = await getProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.flatMap((project, index) => [
    {
      url: `${baseUrl}/en/projects/${project.id}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/projects/${project.id}`,
          ar: `${baseUrl}/ar/projects/${project.id}`,
        },
      },
    },
    {
      url: `${baseUrl}/ar/projects/${project.id}`,
      lastModified: new Date(project.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/projects/${project.id}`,
          ar: `${baseUrl}/ar/projects/${project.id}`,
        },
      },
    },
  ]);

  // Blog posts
  const blogPosts = await getBlogPosts();
  const blogRoutes: MetadataRoute.Sitemap = blogPosts.flatMap((post) => [
    {
      url: `${baseUrl}/en/blog/${post.slugEn}`,
      lastModified: new Date(post.publishedAt || post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/en/blog/${post.slugEn}`,
          ar: `${baseUrl}/ar/blog/${post.slugAr}`,
        },
      },
    },
    {
      url: `${baseUrl}/ar/blog/${post.slugAr}`,
      lastModified: new Date(post.publishedAt || post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/en/blog/${post.slugEn}`,
          ar: `${baseUrl}/ar/blog/${post.slugAr}`,
        },
      },
    },
  ]);

  // Services
  const services = await getServices();
  const serviceRoutes: MetadataRoute.Sitemap = services.flatMap((service, index) => [
    {
      url: `${baseUrl}/en/services/${service.id}`,
      lastModified: new Date(service.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/services/${service.id}`,
          ar: `${baseUrl}/ar/services/${service.id}`,
        },
      },
    },
    {
      url: `${baseUrl}/ar/services/${service.id}`,
      lastModified: new Date(service.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/en/services/${service.id}`,
          ar: `${baseUrl}/ar/services/${service.id}`,
        },
      },
    },
  ]);

  return [
    ...staticRoutes,
    ...pageRoutes,
    ...projectRoutes,
    ...blogRoutes,
    ...serviceRoutes,
  ];
}
