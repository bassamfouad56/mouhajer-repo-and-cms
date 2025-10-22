import { queryGraphQL } from './graphql/server-client';
import { GET_PROJECTS, GET_BLOG_POSTS, GET_SETTINGS } from './graphql/queries/homepage';
import { GET_SERVICES_STRING } from './graphql/queries/services';
import type { Project, BlogPost, Settings, Media, Service } from './cms-types';

// Transform flat GraphQL response to nested structure
function transformProject(project: any): Project {
  return {
    id: project.id,
    title: { en: project.titleEn, ar: project.titleAr },
    slug: { en: project.slugEn, ar: project.slugAr },
    description: { en: project.descriptionEn, ar: project.descriptionAr },
    images: project.images || [],
    category: project.category,
    featured: project.featured,
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

function transformBlogPost(post: any): BlogPost {
  return {
    id: post.id,
    title: { en: post.titleEn, ar: post.titleAr },
    slug: { en: post.slugEn, ar: post.slugAr },
    excerpt: { en: post.excerptEn, ar: post.excerptAr },
    content: { en: post.contentEn, ar: post.contentAr },
    featuredImage: post.featuredImage,
    category: post.category,
    tags: post.tags || [],
    author: post.author,
    publishedAt: post.publishedAt,
    featured: post.featured,
    status: post.status,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

function transformSettings(settings: any): Settings {
  return {
    ...settings,
    siteName: { en: settings.siteNameEn, ar: settings.siteNameAr },
    siteDescription: { en: settings.siteDescriptionEn, ar: settings.siteDescriptionAr },
    logo: settings.logoUrl,
    seo: {
      en: {
        defaultTitle: settings.seoMetaTitleEn,
        defaultDescription: settings.seoMetaDescriptionEn,
        keywords: settings.seoKeywords?.filter((k: string) => /^[a-zA-Z]/.test(k)) || [],
      },
      ar: {
        defaultTitle: settings.seoMetaTitleAr,
        defaultDescription: settings.seoMetaDescriptionAr,
        keywords: settings.seoKeywords?.filter((k: string) => /[\u0600-\u06FF]/.test(k)) || [],
      },
    },
  };
}

function transformService(service: any): Service {
  return {
    id: service.id,
    title: { en: service.titleEn, ar: service.titleAr },
    slug: { en: service.slugEn, ar: service.slugAr },
    description: { en: service.descriptionEn, ar: service.descriptionAr },
    shortDescription: { en: service.shortDescriptionEn, ar: service.shortDescriptionAr },
    icon: service.icon,
    images: service.images || [],
    features: { en: service.featuresEn || [], ar: service.featuresAr || [] },
    price: service.price,
    duration: service.duration,
    featured: service.featured,
    status: service.status,
    seoMetaTitleEn: service.seoMetaTitleEn,
    seoMetaTitleAr: service.seoMetaTitleAr,
    seoMetaDescEn: service.seoMetaDescEn,
    seoMetaDescAr: service.seoMetaDescAr,
    seoKeywordsEn: service.seoKeywordsEn || [],
    seoKeywordsAr: service.seoKeywordsAr || [],
    targetLocations: service.targetLocations || [],
    serviceArea: service.serviceArea || [],
    faqs: service.faqs,
    relatedServiceIds: service.relatedServiceIds || [],
    viewCount: service.viewCount || 0,
    averageRating: service.averageRating,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

export const graphqlClient = {
  async getProjects(featured?: boolean, category?: string, limit?: number): Promise<Project[]> {
    const data = await queryGraphQL({
      query: GET_PROJECTS,
      variables: {
        filter: {
          featured,
          category,
        },
        limit: limit || 10,
      },
    });
    return (data.projects?.projects || []).map(transformProject);
  },

  async getFeaturedProjects(): Promise<Project[]> {
    return this.getProjects(true, undefined, 6);
  },

  async getBlogPosts(
    featured?: boolean,
    status = 'published',
    limit?: number,
  ): Promise<BlogPost[]> {
    const data = await queryGraphQL({
      query: GET_BLOG_POSTS,
      variables: {
        filter: {
          featured,
          status,
        },
        limit: limit || 10,
      },
    });
    return (data.blogPosts?.posts || []).map(transformBlogPost);
  },

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return this.getBlogPosts(true, 'published', 3);
  },

  async getSettings(): Promise<Settings> {
    const data = await queryGraphQL({
      query: GET_SETTINGS,
    });
    return transformSettings(data.settings);
  },

  async getServices(featured?: boolean, status?: string, limit?: number): Promise<Service[]> {
    try {
      const data = await queryGraphQL({
        query: GET_SERVICES_STRING,
        variables: {
          filter: {
            featured,
            status: status || 'published',
          },
          limit: limit || 10,
        },
      });
      return (data.services?.services || []).map(transformService);
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  async getMedia(tags?: string[], limit?: number): Promise<Media[]> {
    // Media endpoint - return empty array for now
    return [];
  },
};
