import { queryGraphQL } from './graphql/server-client';
import { GET_PROJECTS, GET_BLOG_POSTS, GET_SETTINGS } from './graphql/queries/homepage';
import type { Project, BlogPost, Settings, Media, Service } from './cms-types';

// Transform flat GraphQL response to nested structure
function transformProject(project: any): Project {
  return {
    ...project,
    title: { en: project.titleEn, ar: project.titleAr },
    description: { en: project.descriptionEn, ar: project.descriptionAr },
  };
}

function transformBlogPost(post: any): BlogPost {
  return {
    ...post,
    title: { en: post.titleEn, ar: post.titleAr },
    slug: { en: post.slugEn, ar: post.slugAr },
    excerpt: { en: post.excerptEn, ar: post.excerptAr },
    content: { en: post.contentEn, ar: post.contentAr },
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

export const graphqlClient = {
  async getProjects(featured?: boolean, category?: string, limit?: number): Promise<Project[]> {
    const data = await queryGraphQL({
      query: GET_PROJECTS,
      variables: { featured, category, limit },
    });
    return (data.projects?.projects || []).map(transformProject);
  },

  async getFeaturedProjects(): Promise<Project[]> {
    return this.getProjects(true, undefined, 6);
  },

  async getBlogPosts(featured?: boolean, status = 'published', limit?: number): Promise<BlogPost[]> {
    const data = await queryGraphQL({
      query: GET_BLOG_POSTS,
      variables: { featured, status, limit },
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

  async getServices(): Promise<Service[]> {
    // Services endpoint - return empty array for now
    return [];
  },

  async getMedia(tags?: string[], limit?: number): Promise<Media[]> {
    // Media endpoint - return empty array for now
    return [];
  },
};