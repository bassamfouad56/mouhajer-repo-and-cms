/**
 * Generate Image Mappings Script
 *
 * This script fetches all media from the CMS and generates comprehensive
 * image mappings organized by tags and categories for use in components.
 *
 * Usage: npx tsx scripts/generate-image-mappings.ts
 */

import fs from 'fs';
import path from 'path';

// Types for CMS media structure
interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  caption?: string | null;
  tags?: string[];
  uploadedAt: string;
  updatedAt: string;
}

interface ImageMapping {
  [category: string]: {
    [subcategory: string]: string[];
  };
}

interface RandomImageAssignments {
  [component: string]: {
    images: string[];
    category: string;
    count: number;
  };
}

// CMS API endpoint
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

async function fetchAllMedia(): Promise<MediaFile[]> {
  try {
    console.log('📡 Fetching media from CMS...');

    // Try to fetch from CMS API first
    try {
      const response = await fetch(`${CMS_API_URL}/api/media`);

      if (response.ok) {
        const media = await response.json();
        console.log(`✅ Fetched ${media.length} media files from CMS API`);
        return media;
      }
    } catch (apiError) {
      console.log('⚠️  CMS API not available, using local data...');
    }

    // Fallback to local media data
    const localDataPath = path.join(process.cwd(), '..', 'cms', 'data', 'media-files.json');

    if (fs.existsSync(localDataPath)) {
      const localData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
      console.log(`✅ Loaded ${localData.length} media files from local data`);
      return localData;
    }

    throw new Error('No media data available from CMS API or local files');
  } catch (error) {
    console.error('❌ Error fetching media:', error);
    throw error;
  }
}

function categorizeImages(media: MediaFile[]): ImageMapping {
  const mapping: ImageMapping = {};

  // Filter only images
  const images = media.filter((m) => m.type === 'image');

  console.log(`📊 Processing ${images.length} images...`);

  images.forEach((image) => {
    // Extract tags or create category from filename
    const tags = image.tags || [];
    const filename = image.name.toLowerCase();

    // Determine category based on tags or filename patterns
    let category = 'misc';
    let subcategory = 'general';

    // Tag-based categorization
    if (tags.includes('project') || tags.includes('residential') || tags.includes('villa')) {
      category = 'projects';
      if (tags.includes('villa')) subcategory = 'villas';
      else if (tags.includes('penthouse')) subcategory = 'penthouses';
      else if (tags.includes('apartment')) subcategory = 'apartments';
      else subcategory = 'commercial';
    } else if (tags.includes('service') || tags.includes('interior')) {
      category = 'services';
      if (tags.includes('luxury')) subcategory = 'luxury';
      else if (tags.includes('hospitality')) subcategory = 'hospitality';
      else subcategory = 'residential';
    } else if (tags.includes('blog')) {
      category = 'blog';
      subcategory = 'featured';
    } else if (tags.includes('team')) {
      category = 'team';
      subcategory = 'members';
    } else if (tags.includes('award')) {
      category = 'awards';
      subcategory = 'certificates';
    } else if (tags.includes('client')) {
      category = 'clients';
      subcategory = 'logos';
    } else if (tags.includes('instagram')) {
      category = 'social';
      subcategory = 'instagram';
    } else if (tags.includes('about')) {
      category = 'about';
      subcategory = 'studio';
    } else if (tags.includes('homepage') || tags.includes('hero')) {
      category = 'homepage';
      subcategory = 'banners';
    }

    // Filename-based categorization fallback
    if (category === 'misc') {
      if (filename.includes('villa') || filename.includes('project')) {
        category = 'projects';
        subcategory = 'villas';
      } else if (filename.includes('service') || filename.includes('interior')) {
        category = 'services';
        subcategory = 'residential';
      } else if (filename.includes('blog')) {
        category = 'blog';
        subcategory = 'featured';
      } else if (filename.includes('team') || filename.includes('founder')) {
        category = 'team';
        subcategory = 'members';
      } else if (filename.includes('award') || filename.includes('certificate')) {
        category = 'awards';
        subcategory = 'certificates';
      } else if (filename.includes('client') || filename.includes('logo')) {
        category = 'clients';
        subcategory = 'logos';
      } else if (filename.includes('banner') || filename.includes('hero')) {
        category = 'homepage';
        subcategory = 'banners';
      }
    }

    // Initialize category if not exists
    if (!mapping[category]) {
      mapping[category] = {};
    }
    if (!mapping[category][subcategory]) {
      mapping[category][subcategory] = [];
    }

    mapping[category][subcategory].push(image.url);
  });

  return mapping;
}

function generateRandomAssignments(mapping: ImageMapping): RandomImageAssignments {
  const assignments: RandomImageAssignments = {};

  // Component-specific assignments
  const componentMappings = {
    HeroBanner: { category: 'homepage', subcategory: 'banners', count: 1 },
    AboutSectionCarousel: { category: 'about', subcategory: 'studio', count: 4 },
    ProjectGallery: { category: 'projects', subcategory: 'villas', count: 6 },
    ServiceImages: { category: 'services', subcategory: 'residential', count: 3 },
    BlogFeatured: { category: 'blog', subcategory: 'featured', count: 3 },
    TeamMembers: { category: 'team', subcategory: 'members', count: 4 },
    ClientLogos: { category: 'clients', subcategory: 'logos', count: 8 },
    AwardCertificates: { category: 'awards', subcategory: 'certificates', count: 5 },
    SocialInstagram: { category: 'social', subcategory: 'instagram', count: 6 },
    PortfolioCarousel: { category: 'projects', subcategory: 'villas', count: 5 },
    ContactImages: { category: 'about', subcategory: 'studio', count: 3 },
    ErrorPages: { category: 'misc', subcategory: 'general', count: 2 },
  };

  Object.entries(componentMappings).forEach(([component, config]) => {
    const { category, subcategory, count } = config;

    if (mapping[category] && mapping[category][subcategory]) {
      const availableImages = mapping[category][subcategory];
      const selectedImages = availableImages
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, count);

      assignments[component] = {
        images: selectedImages,
        category,
        count: selectedImages.length,
      };
    } else {
      // Fallback to any available images
      const allImages = Object.values(mapping).flatMap((cat) => Object.values(cat).flat());

      assignments[component] = {
        images: allImages.sort(() => Math.random() - 0.5).slice(0, count),
        category: 'fallback',
        count: Math.min(count, allImages.length),
      };
    }
  });

  return assignments;
}

function generateCmsImagesFile(mapping: ImageMapping, assignments: RandomImageAssignments): string {
  const timestamp = new Date().toISOString().split('T')[0];

  return `/**
 * CMS Image URLs - Auto-generated
 * Generated on: ${timestamp}
 * Total images: ${
   Object.values(mapping)
     .flatMap((cat) => Object.values(cat))
     .flat().length
 }
 * 
 * This file contains all CMS images organized by category and component.
 * Images are fetched from: ${CMS_API_URL}/api/media
 */

// ==================== Projects ====================
export const PROJECT_IMAGES = {
  ${Object.entries(mapping.projects || {})
    .map(([sub, images]) => `${sub}: "${images[0] || ''}",`)
    .join('\n  ')}
};

// Array of all project images
export const PROJECT_GALLERY_IMAGES = [
  ${Object.values(mapping.projects || {})
    .flat()
    .slice(0, 10)
    .map((url) => `"${url}"`)
    .join(',\n  ')}
];

// ==================== Services ====================
export const SERVICE_IMAGES = {
  ${Object.entries(mapping.services || {})
    .map(([sub, images]) => `${sub}: "${images[0] || ''}",`)
    .join('\n  ')}
};

// ==================== Homepage ====================
export const HOMEPAGE_IMAGES = {
  ${Object.entries(mapping.homepage || {})
    .map(([sub, images]) => `${sub}: "${images[0] || ''}",`)
    .join('\n  ')}
};

// ==================== About ====================
export const ABOUT_IMAGES = [
  ${(mapping.about?.studio || [])
    .slice(0, 4)
    .map((url) => `"${url}"`)
    .join(',\n  ')}
];

// ==================== Team ====================
export const TEAM_IMAGES = [
  ${(mapping.team?.members || [])
    .slice(0, 4)
    .map((url) => `"${url}"`)
    .join(',\n  ')}
];

// ==================== Clients ====================
export const CLIENT_LOGOS = {
  ${Object.entries(mapping.clients || {})
    .map(([sub, images]) => `${sub}: "${images[0] || ''}",`)
    .join('\n  ')}
};

// Array of all client logos
export const CLIENT_LOGOS_ARRAY = Object.values(CLIENT_LOGOS);

// ==================== Awards ====================
export const AWARD_IMAGES = [
  ${(mapping.awards?.certificates || [])
    .slice(0, 5)
    .map((url) => `"${url}"`)
    .join(',\n  ')}
];

// ==================== Blog ====================
export const BLOG_IMAGES = [
  ${(mapping.blog?.featured || [])
    .slice(0, 3)
    .map((url) => `"${url}"`)
    .join(',\n  ')}
];

// ==================== Social ====================
export const SOCIAL_IMAGES = {
  instagram: [
    ${(mapping.social?.instagram || [])
      .slice(0, 6)
      .map((url) => `"${url}"`)
      .join(',\n    ')}
  ]
};

// ==================== Misc ====================
export const MISC_IMAGES = {
  ${Object.entries(mapping.misc || {})
    .map(([sub, images]) => `${sub}: "${images[0] || ''}",`)
    .join('\n  ')}
};

// ==================== Component Assignments ====================
export const COMPONENT_IMAGES = {
  ${Object.entries(assignments)
    .map(
      ([component, data]) =>
        `${component}: [\n    ${data.images.map((url) => `"${url}"`).join(',\n    ')}\n  ],`,
    )
    .join('\n  ')}
};

// ==================== Random Image Helpers ====================
export function getRandomProjectImage(): string {
  const images = PROJECT_GALLERY_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomServiceImage(): string {
  const images = Object.values(SERVICE_IMAGES);
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomAboutImage(): string {
  const images = ABOUT_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomTeamImage(): string {
  const images = TEAM_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomClientLogo(): string {
  const images = CLIENT_LOGOS_ARRAY;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomAwardImage(): string {
  const images = AWARD_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomBlogImage(): string {
  const images = BLOG_IMAGES;
  return images[Math.floor(Math.random() * images.length)];
}

export function getRandomSocialImage(): string {
  const images = SOCIAL_IMAGES.instagram;
  return images[Math.floor(Math.random() * images.length)];
}

// ==================== Statistics ====================
export const IMAGE_STATS = {
  totalImages: ${
    Object.values(mapping)
      .flatMap((cat) => Object.values(cat))
      .flat().length
  },
  categories: ${Object.keys(mapping).length},
  projects: ${Object.values(mapping.projects || {}).flat().length},
  services: ${Object.values(mapping.services || {}).flat().length},
  homepage: ${Object.values(mapping.homepage || {}).flat().length},
  about: ${Object.values(mapping.about || {}).flat().length},
  team: ${Object.values(mapping.team || {}).flat().length},
  clients: ${Object.values(mapping.clients || {}).flat().length},
  awards: ${Object.values(mapping.awards || {}).flat().length},
  blog: ${Object.values(mapping.blog || {}).flat().length},
  social: ${Object.values(mapping.social || {}).flat().length},
  misc: ${Object.values(mapping.misc || {}).flat().length}
};
`;
}

async function main() {
  try {
    console.log('🚀 Starting image mapping generation...');

    // Fetch all media from CMS
    const media = await fetchAllMedia();

    // Categorize images by tags and filename patterns
    const mapping = categorizeImages(media);

    // Generate random assignments for components
    const assignments = generateRandomAssignments(mapping);

    // Generate the new cms-images.ts file
    const cmsImagesContent = generateCmsImagesFile(mapping, assignments);

    // Write to file
    const outputPath = path.join(process.cwd(), 'lib', 'cms-images.ts');
    fs.writeFileSync(outputPath, cmsImagesContent);

    console.log('✅ Generated comprehensive image mappings:');
    console.log(`   📁 Output: ${outputPath}`);
    console.log(`   📊 Categories: ${Object.keys(mapping).length}`);
    console.log(
      `   🖼️  Total images: ${
        Object.values(mapping)
          .flatMap((cat) => Object.values(cat))
          .flat().length
      }`,
    );
    console.log(`   🎯 Component assignments: ${Object.keys(assignments).length}`);

    // Generate summary report
    const reportPath = path.join(process.cwd(), 'IMAGE_MAPPING_REPORT.md');
    const report = `# Image Mapping Report

Generated on: ${new Date().toISOString()}

## Summary
- **Total Images**: ${
      Object.values(mapping)
        .flatMap((cat) => Object.values(cat))
        .flat().length
    }
- **Categories**: ${Object.keys(mapping).length}
- **Component Assignments**: ${Object.keys(assignments).length}

## Categories
${Object.entries(mapping)
  .map(
    ([category, subcats]) =>
      `### ${category.toUpperCase()}\n${Object.entries(subcats)
        .map(([sub, images]) => `- **${sub}**: ${images.length} images`)
        .join('\n')}`,
  )
  .join('\n\n')}

## Component Assignments
${Object.entries(assignments)
  .map(
    ([component, data]) =>
      `### ${component}\n- **Category**: ${data.category}\n- **Count**: ${data.count}\n- **Images**: ${data.images.length}`,
  )
  .join('\n\n')}
`;

    fs.writeFileSync(reportPath, report);
    console.log(`   📋 Report: ${reportPath}`);
  } catch (error) {
    console.error('❌ Error generating image mappings:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { fetchAllMedia, categorizeImages, generateRandomAssignments };
