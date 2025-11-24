/**
 * Migration Script: WordPress to Sanity CMS
 *
 * This script migrates project data from projectResData.ts to Sanity CMS
 * Run with: npx tsx scripts/migrate-to-sanity.ts
 */

import { createClient } from '@sanity/client';
import { ProjectsResData } from '../projectResData';

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'b6q28exv',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-21',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// WordPress media base URL
const WP_MEDIA_BASE_URL = 'https://yuz.beb.mybluehost.me/wp-content/uploads';

/**
 * Convert WordPress media URL to full URL
 */
function getFullMediaUrl(url: string | null | undefined): string {
  if (!url) return '';

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${WP_MEDIA_BASE_URL}/${cleanUrl}`;
}

/**
 * Upload image to Sanity from URL
 */
async function uploadImageToSanity(imageUrl: string, alt: string = '') {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop() || 'image.jpg',
    });

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
      alt: alt || '',
    };
  } catch (error) {
    console.error(`Failed to upload image ${imageUrl}:`, error);
    return null;
  }
}

/**
 * Transform WordPress project to Sanity format
 */
async function transformProjectForSanity(wpProject: any) {
  const acf = wpProject.acf || {};

  // Extract basic info
  const title = wpProject.title?.rendered || acf.title || 'Untitled Project';
  const titleArabic = acf.title_arabic || title;
  const slug = wpProject.slug || `project-${wpProject.id}`;
  const projectType = acf.type?.value || acf.type?.label || 'Residential';
  const location = acf.location || 'Dubai, UAE';
  const year = wpProject.date ? new Date(wpProject.date).getFullYear().toString() : '2024';

  // Extract descriptions
  const description = acf.description_right || acf.descriptive_title_left || wpProject.content?.rendered || '';
  const descriptionArabic = acf.description_arabic_right || acf.descriptive_title_arabic_left || '';

  console.log(`Processing project: ${title}...`);

  // Upload featured image
  let featuredImage = null;
  const mainImageUrl = getFullMediaUrl(acf.main_image || acf.big_image);
  if (mainImageUrl) {
    console.log(`  Uploading featured image...`);
    featuredImage = await uploadImageToSanity(mainImageUrl, title);
  }

  // Upload gallery images
  const galleryImages = [];
  if (acf.projects_gallery && Array.isArray(acf.projects_gallery)) {
    console.log(`  Uploading ${acf.projects_gallery.length} gallery images...`);
    for (const img of acf.projects_gallery) {
      const imgUrl = getFullMediaUrl(img.img);
      if (imgUrl) {
        const uploadedImg = await uploadImageToSanity(imgUrl, `${title} gallery image`);
        if (uploadedImg) {
          galleryImages.push(uploadedImg);
        }
      }
    }
  }

  // Additional images
  const additionalImages = [
    acf.second_small_image,
    acf.third_small_image,
    acf.big_image_quote,
  ];

  for (const img of additionalImages) {
    if (img?.url || img) {
      const imgUrl = getFullMediaUrl(typeof img === 'string' ? img : img.url);
      if (imgUrl) {
        const uploadedImg = await uploadImageToSanity(imgUrl, `${title} additional image`);
        if (uploadedImg) {
          galleryImages.push(uploadedImg);
        }
      }
    }
  }

  // Create Sanity document
  return {
    _type: 'project',
    _id: `project-${wpProject.id}`,
    title: {
      en: title,
      ar: titleArabic,
    },
    slug: {
      current: slug,
    },
    description: {
      en: description,
      ar: descriptionArabic,
    },
    featuredImage: featuredImage,
    gallery: galleryImages,
    projectType: projectType,
    location: location,
    yearCompleted: year,
    client: acf.client || '',
    area: acf.area || '',
    services: Array.isArray(acf.services) ? acf.services : [],
    tags: Array.isArray(wpProject.tags) ? wpProject.tags : [],
    publishedAt: wpProject.date || new Date().toISOString(),
  };
}

/**
 * Main migration function
 */
async function migrateProjects() {
  console.log('🚀 Starting migration from WordPress to Sanity...\n');
  console.log(`📊 Found ${ProjectsResData.length} projects to migrate\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const wpProject of ProjectsResData) {
    try {
      const sanityProject = await transformProjectForSanity(wpProject);

      // Create or replace document in Sanity
      await client.createOrReplace(sanityProject);

      successCount++;
      console.log(`✅ Migrated: ${sanityProject.title.en}\n`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate project ${wpProject.id}:`, error);
      console.log('');
    }
  }

  console.log('\n📈 Migration Summary:');
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Failed: ${errorCount}`);
  console.log(`  📊 Total: ${ProjectsResData.length}`);
  console.log('\n🎉 Migration complete!');
  console.log('\n📍 View your projects in Sanity Studio: http://localhost:3333');
}

// Run migration
migrateProjects().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
