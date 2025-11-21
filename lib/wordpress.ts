/**
 * Data Layer (Mock Data Version)
 *
 * This file re-exports mock data functions and types.
 * Replaces WordPress CMS integration with static mock data.
 */

// Re-export all types and functions from mock-data
export type {
  Project,
  Service,
  Industry,
  Post,
  Category,
  Image,
  FeaturedImage,
  ACFFields,
} from './mock-data';

export {
  getProjects,
  getProjectBySlug,
  getServices,
  getServiceBySlug,
  getIndustries,
  getPosts,
  getPostBySlug,
  getCategories,
  mockProjects,
  mockServices,
  mockIndustries,
  mockPosts,
} from './mock-data';

// Legacy exports for compatibility
export type { Image as WPImage } from './mock-data';
