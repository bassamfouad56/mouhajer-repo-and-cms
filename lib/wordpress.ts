/**
 * Data Layer (WordPress Data Version)
 *
 * This file provides data access functions using real WordPress data.
 * Now uses projectResData.ts instead of mock data.
 */

import {
  getWordPressProjects,
  getWordPressProjectBySlug,
  getWordPressProjectsByType,
  getWordPressFeaturedProjects,
} from './wordpress-adapter';

// Re-export types from mock-data for compatibility
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

// Import mock data functions for Services, Industries, and Posts (still using mock data)
import {
  getServices as getMockServices,
  getServiceBySlug as getMockServiceBySlug,
  getIndustries as getMockIndustries,
  getPosts as getMockPosts,
  getPostBySlug as getMockPostBySlug,
  getCategories as getMockCategories,
  mockServices,
  mockIndustries,
  mockPosts,
} from './mock-data';

// === PROJECTS - Using Real WordPress Data ===

/**
 * Get all projects (from WordPress data)
 */
export async function getProjects(locale: string = 'en') {
  return getWordPressProjects(locale);
}

/**
 * Get project by slug (from WordPress data)
 */
export async function getProjectBySlug(slug: string, locale: string = 'en') {
  const project = getWordPressProjectBySlug(slug, locale);

  if (!project) {
    throw new Error(`Project not found: ${slug}`);
  }

  return project;
}

/**
 * Get projects by type (from WordPress data)
 */
export async function getProjectsByType(type: string, locale: string = 'en') {
  return getWordPressProjectsByType(type, locale);
}

/**
 * Get featured projects (from WordPress data)
 */
export async function getFeaturedProjects(limit: number = 6, locale: string = 'en') {
  return getWordPressFeaturedProjects(limit, locale);
}

// === SERVICES - Still using mock data (for now) ===

export const getServices = getMockServices;
export const getServiceBySlug = getMockServiceBySlug;

// === INDUSTRIES - Still using mock data (for now) ===

export const getIndustries = getMockIndustries;

// === BLOG POSTS - Still using mock data (for now) ===

export const getPosts = getMockPosts;
export const getPostBySlug = getMockPostBySlug;
export const getCategories = getMockCategories;

// === EXPORTS ===

export { mockServices, mockIndustries, mockPosts };

// Legacy exports for compatibility
export type { Image as WPImage } from './mock-data';
