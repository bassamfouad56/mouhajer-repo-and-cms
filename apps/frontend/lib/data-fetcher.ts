// GraphQL-only data fetcher
import { graphqlClient } from './graphql-client';
import type { Project, BlogPost, Settings, Service, Media } from './cms-types';

export const dataFetcher = {
  async getProjects(): Promise<Project[]> {
    return await graphqlClient.getProjects();
  },

  async getFeaturedProjects(): Promise<Project[]> {
    return await graphqlClient.getFeaturedProjects();
  },

  async getBlogPosts(): Promise<BlogPost[]> {
    return await graphqlClient.getBlogPosts();
  },

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return await graphqlClient.getFeaturedBlogPosts();
  },

  async getSettings(): Promise<Settings> {
    return await graphqlClient.getSettings();
  },

  async getServices(): Promise<Service[]> {
    return await graphqlClient.getServices();
  },

  async getMedia(): Promise<Media[]> {
    return await graphqlClient.getMedia();
  },
};