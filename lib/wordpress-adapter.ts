/**
 * WordPress Data Adapter
 *
 * Transforms WordPress project data into the application's expected format
 * with comprehensive error handling and image URL management
 */

import { ProjectsResData } from '../projectResData';
import {
  getSafeImageUrl,
  getSafeAltText,
  isNonEmptyString,
  isNonEmptyArray,
  safeGet,
  getSafeExcerpt,
  logWarning,
  filterValidImages,
} from './error-handling';

// WordPress media base URL
const WP_MEDIA_BASE_URL = 'https://yuz.beb.mybluehost.me/wp-content/uploads';

/**
 * Convert WordPress media URL to full URL
 */
function getFullMediaUrl(url: string | null | undefined): string {
  if (!isNonEmptyString(url)) {
    return 'https://placehold.co/1200x800/e5e5e5/737373?text=Image+Not+Available';
  }

  // If it's already a full URL, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Remove leading slash if present
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;

  // Construct full URL
  return `${WP_MEDIA_BASE_URL}/${cleanUrl}`;
}

/**
 * Transform WordPress image object to our format
 */
function transformWordPressImage(wpImage: any): {
  sourceUrl: string;
  altText: string;
  width?: number;
  height?: number;
} | null {
  if (!wpImage) return null;

  // Handle string URLs
  if (typeof wpImage === 'string') {
    return {
      sourceUrl: getFullMediaUrl(wpImage),
      altText: 'Project Image',
    };
  }

  // Handle image objects
  if (typeof wpImage === 'object') {
    const url = wpImage.url || wpImage.img || wpImage.sourceUrl;
    const alt = wpImage.alt || wpImage.altText || wpImage.title || '';

    return {
      sourceUrl: getFullMediaUrl(url),
      altText: alt || 'Project Image',
      width: wpImage.width,
      height: wpImage.height,
    };
  }

  return null;
}

/**
 * Transform WordPress gallery to our format
 */
function transformGallery(gallery: any[]): Array<{
  sourceUrl: string;
  altText: string;
}> {
  if (!isNonEmptyArray(gallery)) {
    return [];
  }

  const transformedImages = gallery
    .map((item) => transformWordPressImage(item))
    .filter((img): img is NonNullable<typeof img> => img !== null);

  return filterValidImages(transformedImages) as Array<{
    sourceUrl: string;
    altText: string;
  }>;
}

/**
 * Transform single WordPress project to app format
 * Matches the Project interface from mock-data.ts
 */
function transformProject(wpProject: any) {
  try {
    const acf = wpProject.acf || {};

    // Extract title
    const title = safeGet(wpProject, 'title.rendered', '') || acf.title || 'Untitled Project';

    // Extract slug
    const slug = wpProject.slug || `project-${wpProject.id}`;

    // Extract type/category
    const projectType = acf.type?.value || acf.type?.label || 'Residential';

    // Extract location
    const location = acf.location || 'Dubai, UAE';

    // Extract year
    const year = wpProject.date ? new Date(wpProject.date).getFullYear().toString() : '2024';

    // Main/Featured image
    const mainImage = transformWordPressImage(
      acf.main_image || acf.big_image || acf.featured_image
    );

    // Gallery images
    const galleryImages = transformGallery(acf.projects_gallery || []);

    // Additional images
    const secondImage = transformWordPressImage(acf.second_small_image);
    const thirdImage = transformWordPressImage(acf.third_small_image);
    const bigImage = transformWordPressImage(acf.big_image);
    const quoteImage = transformWordPressImage(acf.big_image_quote);

    // Combine all images into gallery (featured + gallery + additional)
    const allGalleryImages = [
      mainImage,
      ...galleryImages,
      secondImage,
      thirdImage,
      bigImage,
      quoteImage,
    ].filter((img): img is NonNullable<typeof img> => img !== null);

    // Extract descriptions
    const description =
      acf.description_right ||
      acf.descriptive_title_left ||
      wpProject.content?.rendered ||
      '';

    const content = description;
    const excerpt = getSafeExcerpt({ excerpt: description }, 200);

    // Extract other metadata
    const client = acf.client || '';
    const area = acf.area || '';
    const services = acf.services || [];

    // Return in format matching Project interface from mock-data.ts
    return {
      id: wpProject.id.toString(),
      databaseId: wpProject.id,
      slug,
      title,
      excerpt,
      content,
      date: wpProject.date || new Date().toISOString(),
      modified: wpProject.modified || wpProject.date || new Date().toISOString(),
      featuredImage: mainImage
        ? {
            node: {
              sourceUrl: mainImage.sourceUrl,
              altText: mainImage.altText,
              mediaDetails: mainImage.width
                ? {
                    width: mainImage.width,
                    height: mainImage.height || mainImage.width,
                  }
                : undefined,
            },
          }
        : undefined,
      acfFields: {
        projectType,
        location,
        client,
        yearCompleted: year,
        projectArea: area,
        projectDescription: description,
        gallery: allGalleryImages.map((img) => ({
          sourceUrl: img.sourceUrl,
          altText: img.altText,
          mediaDetails: img.width
            ? {
                width: img.width,
                height: img.height || img.width,
              }
            : undefined,
        })),
        services: Array.isArray(services) ? services : [],
      },
      // Keep additional data for compatibility
      _raw: {
        titleArabic: acf.title_arabic || title,
        descriptionArabic: acf.description_arabic_right || acf.descriptive_title_arabic_left || '',
        secondTitle: acf.second_title || '',
        secondTitleArabic: acf.second_title_arabic || '',
        descriptiveTitle: acf.descriptive_title_left || '',
        descriptiveTitleArabic: acf.descriptive_title_arabic_left || '',
        quoteTitle: acf.quote_title || '',
        wpData: wpProject,
      },
    };
  } catch (error) {
    logWarning('Failed to transform WordPress project', {
      projectId: wpProject?.id,
      error,
    });

    // Return minimal valid project matching Project interface
    return {
      id: wpProject?.id?.toString() || 'unknown',
      databaseId: wpProject?.id || 0,
      slug: wpProject?.slug || 'untitled',
      title: 'Untitled Project',
      excerpt: '',
      content: '',
      date: new Date().toISOString(),
      modified: new Date().toISOString(),
      featuredImage: undefined,
      acfFields: {
        projectType: 'Residential',
        location: 'Dubai, UAE',
        yearCompleted: '2024',
        client: '',
        projectArea: '',
        projectDescription: '',
        gallery: [],
        services: [],
      },
      _raw: { wpData: wpProject },
    };
  }
}

/**
 * Get all projects from WordPress data
 */
export function getWordPressProjects(locale: string = 'en') {
  try {
    const projects = ProjectsResData.map(transformProject);

    // Sort by date (newest first)
    projects.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    return projects;
  } catch (error) {
    logWarning('Failed to get WordPress projects', { error });
    return [];
  }
}

/**
 * Get single project by slug
 */
export function getWordPressProjectBySlug(slug: string, locale: string = 'en') {
  try {
    const wpProject = ProjectsResData.find((p) => p.slug === slug);

    if (!wpProject) {
      logWarning('Project not found', { slug });
      return null;
    }

    return transformProject(wpProject);
  } catch (error) {
    logWarning('Failed to get WordPress project by slug', { slug, error });
    return null;
  }
}

/**
 * Get projects by type/category
 */
export function getWordPressProjectsByType(type: string, locale: string = 'en') {
  try {
    const allProjects = getWordPressProjects(locale);
    return allProjects.filter(
      (p) => p.acfFields?.projectType?.toLowerCase() === type.toLowerCase()
    );
  } catch (error) {
    logWarning('Failed to get WordPress projects by type', { type, error });
    return [];
  }
}

/**
 * Get featured/recent projects
 */
export function getWordPressFeaturedProjects(limit: number = 6, locale: string = 'en') {
  try {
    const allProjects = getWordPressProjects(locale);
    return allProjects.slice(0, limit);
  } catch (error) {
    logWarning('Failed to get WordPress featured projects', { error });
    return [];
  }
}

/**
 * Get project types/categories
 */
export function getWordPressProjectTypes() {
  try {
    const projects = getWordPressProjects();
    const types = new Set<string>();

    projects.forEach((p) => {
      if (p.acfFields?.projectType) {
        types.add(p.acfFields.projectType);
      }
    });

    return Array.from(types);
  } catch (error) {
    logWarning('Failed to get WordPress project types', { error });
    return ['Residential', 'Commercial', 'Hospitality'];
  }
}

export default {
  getWordPressProjects,
  getWordPressProjectBySlug,
  getWordPressProjectsByType,
  getWordPressFeaturedProjects,
  getWordPressProjectTypes,
};
