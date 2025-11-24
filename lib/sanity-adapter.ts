/**
 * Sanity CMS Data Adapter
 *
 * Fetches and transforms data from Sanity CMS
 * This will replace the WordPress adapter when you're ready to switch
 */

import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import {
  getSafeImageUrl,
  isNonEmptyArray,
  logWarning,
  filterValidImages,
} from './error-handling';

// GROQ Queries
const projectsQuery = `*[_type == "project"] | order(publishedAt desc) {
  _id,
  title,
  slug,
  description,
  featuredImage,
  gallery,
  projectType,
  location,
  yearCompleted,
  client,
  area,
  services,
  tags,
  publishedAt,
  _updatedAt
}`;

const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  featuredImage,
  gallery,
  projectType,
  location,
  yearCompleted,
  client,
  area,
  services,
  tags,
  publishedAt,
  _updatedAt
}`;

/**
 * Get Sanity image URL
 */
function getSanityImageUrl(image: any): string {
  if (!image?.asset) {
    return 'https://placehold.co/1200x800/e5e5e5/737373?text=No+Image';
  }

  try {
    return urlFor(image)
      .width(1200)
      .height(800)
      .auto('format')
      .url();
  } catch (error) {
    logWarning('Failed to get Sanity image URL', { error });
    return 'https://placehold.co/1200x800/e5e5e5/737373?text=Image+Error';
  }
}

/**
 * Transform Sanity project to app format
 */
function transformSanityProject(sanityProject: any, locale: string = 'en') {
  try {
    // Get localized content
    const title = sanityProject.title?.[locale] || sanityProject.title?.en || 'Untitled Project';
    const description = sanityProject.description?.[locale] || sanityProject.description?.en || '';
    const slug = sanityProject.slug?.current || 'untitled';

    // Transform featured image
    const featuredImageUrl = getSanityImageUrl(sanityProject.featuredImage);

    // Transform gallery images
    const galleryImages = [];
    if (isNonEmptyArray(sanityProject.gallery)) {
      for (const img of sanityProject.gallery) {
        const imgUrl = getSanityImageUrl(img);
        if (imgUrl) {
          galleryImages.push({
            sourceUrl: imgUrl,
            altText: img.alt || title,
          });
        }
      }
    }

    // Return in format matching Project interface
    return {
      id: sanityProject._id,
      databaseId: parseInt(sanityProject._id.replace('project-', '')) || 0,
      slug,
      title,
      excerpt: description.substring(0, 200) + (description.length > 200 ? '...' : ''),
      content: description,
      date: sanityProject.publishedAt || new Date().toISOString(),
      modified: sanityProject._updatedAt || sanityProject.publishedAt || new Date().toISOString(),
      featuredImage: {
        node: {
          sourceUrl: featuredImageUrl,
          altText: title,
        },
      },
      acfFields: {
        projectType: sanityProject.projectType || 'Residential',
        location: sanityProject.location || 'Dubai, UAE',
        client: sanityProject.client || '',
        yearCompleted: sanityProject.yearCompleted || new Date().getFullYear().toString(),
        projectArea: sanityProject.area || '',
        projectDescription: description,
        gallery: galleryImages,
        services: Array.isArray(sanityProject.services) ? sanityProject.services : [],
        tags: Array.isArray(sanityProject.tags) ? sanityProject.tags : [],
      },
      _raw: {
        sanityData: sanityProject,
      },
    };
  } catch (error) {
    logWarning('Failed to transform Sanity project', {
      projectId: sanityProject?._id,
      error,
    });

    // Return minimal valid project
    return {
      id: sanityProject?._id || 'unknown',
      databaseId: 0,
      slug: sanityProject?.slug?.current || 'untitled',
      title: 'Untitled Project',
      excerpt: '',
      content: '',
      date: new Date().toISOString(),
      modified: new Date().toISOString(),
      featuredImage: {
        node: {
          sourceUrl: 'https://placehold.co/1200x800/e5e5e5/737373?text=No+Image',
          altText: 'Untitled Project',
        },
      },
      acfFields: {
        projectType: 'Residential',
        location: 'Dubai, UAE',
        yearCompleted: new Date().getFullYear().toString(),
        client: '',
        projectArea: '',
        projectDescription: '',
        gallery: [],
        services: [],
      },
      _raw: { sanityData: sanityProject },
    };
  }
}

/**
 * Get all projects from Sanity
 */
export async function getSanityProjects(locale: string = 'en') {
  try {
    const projects = await client.fetch(projectsQuery);

    if (!isNonEmptyArray(projects)) {
      logWarning('No projects found in Sanity');
      return [];
    }

    return projects.map((p: any) => transformSanityProject(p, locale));
  } catch (error) {
    logWarning('Failed to fetch Sanity projects', { error });
    return [];
  }
}

/**
 * Get single project by slug from Sanity
 */
export async function getSanityProjectBySlug(slug: string, locale: string = 'en') {
  try {
    const project = await client.fetch(projectBySlugQuery, { slug });

    if (!project) {
      logWarning('Project not found in Sanity', { slug });
      return null;
    }

    return transformSanityProject(project, locale);
  } catch (error) {
    logWarning('Failed to fetch Sanity project by slug', { slug, error });
    return null;
  }
}

/**
 * Get projects by type from Sanity
 */
export async function getSanityProjectsByType(type: string, locale: string = 'en') {
  try {
    const query = `*[_type == "project" && projectType == $type] | order(publishedAt desc) {
      _id,
      title,
      slug,
      description,
      featuredImage,
      gallery,
      projectType,
      location,
      yearCompleted,
      client,
      area,
      services,
      tags,
      publishedAt,
      _updatedAt
    }`;

    const projects = await client.fetch(query, { type });

    if (!isNonEmptyArray(projects)) {
      return [];
    }

    return projects.map((p: any) => transformSanityProject(p, locale));
  } catch (error) {
    logWarning('Failed to fetch Sanity projects by type', { type, error });
    return [];
  }
}

/**
 * Get featured/recent projects from Sanity
 */
export async function getSanityFeaturedProjects(limit: number = 6, locale: string = 'en') {
  try {
    const query = `*[_type == "project"] | order(publishedAt desc)[0...${limit}] {
      _id,
      title,
      slug,
      description,
      featuredImage,
      gallery,
      projectType,
      location,
      yearCompleted,
      client,
      area,
      services,
      tags,
      publishedAt,
      _updatedAt
    }`;

    const projects = await client.fetch(query);

    if (!isNonEmptyArray(projects)) {
      return [];
    }

    return projects.map((p: any) => transformSanityProject(p, locale));
  } catch (error) {
    logWarning('Failed to fetch Sanity featured projects', { error });
    return [];
  }
}

/**
 * Get project types from Sanity
 */
export async function getSanityProjectTypes() {
  try {
    const query = `array::unique(*[_type == "project"].projectType)`;
    const types = await client.fetch(query);

    if (!isNonEmptyArray(types)) {
      return ['Residential', 'Commercial', 'Hospitality'];
    }

    return types;
  } catch (error) {
    logWarning('Failed to fetch Sanity project types', { error });
    return ['Residential', 'Commercial', 'Hospitality'];
  }
}

export default {
  getSanityProjects,
  getSanityProjectBySlug,
  getSanityProjectsByType,
  getSanityFeaturedProjects,
  getSanityProjectTypes,
};
