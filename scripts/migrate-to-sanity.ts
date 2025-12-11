/**
 * Migration Script: Local Projects to Sanity CMS
 *
 * This script migrates project data from local files to Sanity CMS
 * Images are loaded from the public/projects/ directory
 * Run with: npm run migrate:sanity
 */

import { config } from 'dotenv';
import { resolve, join, basename } from 'path';
import { createClient } from '@sanity/client';
import { readFileSync, readdirSync, existsSync, statSync } from 'fs';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r97logzc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-11-21',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Base path for local project images
const PROJECTS_DIR = resolve(process.cwd(), 'public/projects');

// Project data - define your projects here
interface ProjectData {
  slug: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  projectType: string;
  location: string;
  yearCompleted: string;
  client?: string;
  area?: string;
  industry?: string;
}

// Project configurations
const projectsData: ProjectData[] = [
  {
    slug: 'address-boulevard-penthouse',
    title: { en: 'Address Boulevard Penthouse', ar: 'بنتهاوس العنوان بوليفارد' },
    description: {
      en: 'Luxury penthouse interior design and fit-out at Address Boulevard Hotel, Downtown Dubai.',
      ar: 'تصميم داخلي وتنفيذ فاخر لبنتهاوس في فندق العنوان بوليفارد، وسط دبي.'
    },
    projectType: 'Residential',
    location: 'Downtown Dubai',
    yearCompleted: '2024',
    industry: 'hospitality'
  },
  {
    slug: 'address-marina-restaurant',
    title: { en: 'Address Marina Restaurant', ar: 'مطعم العنوان مارينا' },
    description: {
      en: 'Contemporary restaurant design at Address Dubai Marina featuring elegant interiors.',
      ar: 'تصميم مطعم معاصر في العنوان دبي مارينا يتميز بتصميمات داخلية أنيقة.'
    },
    projectType: 'Restaurant',
    location: 'Dubai Marina',
    yearCompleted: '2024',
    industry: 'hospitality'
  },
  {
    slug: 'grand-hyatt-prince-suite',
    title: { en: 'Grand Hyatt Prince Suite', ar: 'جناح الأمير جراند حياة' },
    description: {
      en: 'Royal suite renovation at Grand Hyatt Dubai with bespoke luxury finishes.',
      ar: 'تجديد الجناح الملكي في جراند حياة دبي بتشطيبات فاخرة مخصصة.'
    },
    projectType: 'Hotel Suite',
    location: 'Dubai',
    yearCompleted: '2024',
    industry: 'hospitality'
  },
  {
    slug: 'jumeirah-bay-villa',
    title: { en: 'Jumeirah Bay Villa', ar: 'فيلا جميرا باي' },
    description: {
      en: 'Exclusive beachfront villa with contemporary design and premium materials.',
      ar: 'فيلا حصرية على الواجهة البحرية بتصميم معاصر ومواد فاخرة.'
    },
    projectType: 'Residential',
    location: 'Jumeirah Bay Island',
    yearCompleted: '2024',
    industry: 'residential'
  },
  {
    slug: 'jumeirah-island-villa',
    title: { en: 'Jumeirah Islands Villa', ar: 'فيلا جزر جميرا' },
    description: {
      en: 'Luxurious villa renovation in Jumeirah Islands with modern interior design.',
      ar: 'تجديد فيلا فاخرة في جزر جميرا بتصميم داخلي حديث.'
    },
    projectType: 'Residential',
    location: 'Jumeirah Islands',
    yearCompleted: '2024',
    industry: 'residential'
  },
  {
    slug: 'palm-jumeirah-villa',
    title: { en: 'Palm Jumeirah Villa', ar: 'فيلا نخلة جميرا' },
    description: {
      en: 'Stunning waterfront villa on Palm Jumeirah with bespoke interior design.',
      ar: 'فيلا مذهلة على الواجهة البحرية في نخلة جميرا بتصميم داخلي مخصص.'
    },
    projectType: 'Residential',
    location: 'Palm Jumeirah',
    yearCompleted: '2024',
    industry: 'residential'
  },
  {
    slug: 'park-hyatt-villa',
    title: { en: 'Park Hyatt Villa', ar: 'فيلا بارك حياة' },
    description: {
      en: 'Exclusive villa at Park Hyatt Dubai featuring sophisticated design elements.',
      ar: 'فيلا حصرية في بارك حياة دبي تتميز بعناصر تصميم راقية.'
    },
    projectType: 'Residential',
    location: 'Dubai Creek',
    yearCompleted: '2024',
    industry: 'hospitality'
  },
  {
    slug: 'park-hyatt-vip-room',
    title: { en: 'Park Hyatt VIP Room', ar: 'غرفة كبار الشخصيات بارك حياة' },
    description: {
      en: 'Premium VIP lounge design at Park Hyatt Dubai with luxury finishes.',
      ar: 'تصميم صالة كبار الشخصيات الفاخرة في بارك حياة دبي بتشطيبات راقية.'
    },
    projectType: 'Hotel',
    location: 'Dubai Creek',
    yearCompleted: '2024',
    industry: 'hospitality'
  },
  {
    slug: 'ritz-carlton-villas',
    title: { en: 'Ritz Carlton Villas', ar: 'فلل ريتز كارلتون' },
    description: {
      en: 'Luxury villa interiors at Ritz Carlton with world-class design standards.',
      ar: 'تصميمات داخلية فاخرة للفلل في ريتز كارلتون بمعايير تصميم عالمية.'
    },
    projectType: 'Residential',
    location: 'Dubai',
    yearCompleted: '2024',
    industry: 'hospitality'
  },
  {
    slug: 'sheraton-abu-dhabi',
    title: { en: 'Sheraton Abu Dhabi Hotel & Resort', ar: 'فندق ومنتجع شيراتون أبوظبي' },
    description: {
      en: 'Complete interior renovation of Sheraton Abu Dhabi Hotel & Resort.',
      ar: 'تجديد داخلي شامل لفندق ومنتجع شيراتون أبوظبي.'
    },
    projectType: 'Hotel',
    location: 'Abu Dhabi',
    yearCompleted: '2024',
    industry: 'hospitality'
  },
  {
    slug: 'sofitel-jbr',
    title: { en: 'Sofitel JBR', ar: 'سوفيتيل جي بي آر' },
    description: {
      en: 'Elegant hotel interiors at Sofitel Dubai Jumeirah Beach.',
      ar: 'تصميمات داخلية أنيقة للفندق في سوفيتيل دبي جميرا بيتش.'
    },
    projectType: 'Hotel',
    location: 'JBR, Dubai',
    yearCompleted: '2024',
    industry: 'hospitality'
  },
  {
    slug: 'offices-c1-abudhabi',
    title: { en: 'Offices C1 Abu Dhabi', ar: 'مكاتب C1 أبوظبي' },
    description: {
      en: 'Modern office fit-out in Abu Dhabi with contemporary workspace design.',
      ar: 'تجهيز مكاتب حديثة في أبوظبي بتصميم مساحات عمل معاصرة.'
    },
    projectType: 'Commercial',
    location: 'Abu Dhabi',
    yearCompleted: '2024',
    industry: 'commercial'
  },
  {
    slug: 'district-one-villa-79x',
    title: { en: 'District One Villa 79X', ar: 'فيلا ديستريكت ون 79X' },
    description: {
      en: 'Contemporary villa in MBR City District One with premium interiors.',
      ar: 'فيلا معاصرة في ديستريكت ون مدينة محمد بن راشد بتصميمات داخلية فاخرة.'
    },
    projectType: 'Residential',
    location: 'MBR City',
    yearCompleted: '2024',
    industry: 'residential'
  },
];

/**
 * Get all image files from a directory
 */
function getImagesFromDirectory(dirPath: string): string[] {
  if (!existsSync(dirPath)) {
    return [];
  }

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const files = readdirSync(dirPath);

  return files
    .filter(file => {
      const ext = file.toLowerCase().slice(file.lastIndexOf('.'));
      return imageExtensions.includes(ext);
    })
    .map(file => join(dirPath, file))
    .sort();
}

/**
 * Upload image to Sanity from local file
 */
async function uploadImageToSanity(imagePath: string, alt: string = '') {
  try {
    if (!existsSync(imagePath)) {
      console.log(`  ⚠️ Image not found: ${imagePath}`);
      return null;
    }

    const stats = statSync(imagePath);
    if (stats.size < 100) {
      console.log(`  ⚠️ Skipping empty/invalid image: ${imagePath}`);
      return null;
    }

    const buffer = readFileSync(imagePath);
    const filename = basename(imagePath);

    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
    });

    console.log(`  ✓ Uploaded: ${filename}`);

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
      alt: alt || '',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`  ⚠️ Failed to upload image: ${imagePath} - ${errorMessage}`);
    return null;
  }
}

/**
 * Transform project data to Sanity format
 */
async function transformProjectForSanity(project: ProjectData) {
  const projectDir = join(PROJECTS_DIR, project.slug);
  const images = getImagesFromDirectory(projectDir);

  console.log(`\nProcessing project: ${project.title.en}...`);
  console.log(`  Found ${images.length} images in ${projectDir}`);

  // Upload featured image (first image in directory)
  let featuredImage = null;
  if (images.length > 0) {
    console.log(`  Uploading featured image...`);
    featuredImage = await uploadImageToSanity(images[0], project.title.en);
  }

  // Upload gallery images (remaining images)
  const galleryImages = [];
  if (images.length > 1) {
    console.log(`  Uploading ${images.length - 1} gallery images...`);
    for (let i = 1; i < images.length; i++) {
      const uploadedImg = await uploadImageToSanity(images[i], `${project.title.en} - Image ${i}`);
      if (uploadedImg) {
        galleryImages.push(uploadedImg);
      }
    }
  }

  // Create Sanity document - using English for titles/descriptions
  // (Arabic versions can be created as separate i18n documents in Sanity Studio)
  return {
    _type: 'project',
    _id: `project-${project.slug}`,
    title: project.title.en, // Use English title (string, not object)
    slug: {
      current: project.slug,
    },
    excerpt: project.description.en, // Use English description (string, not object)
    mainImage: featuredImage, // Renamed to match schema
    gallery: galleryImages,
    category: project.industry || 'residential', // Use industry as category
    location: project.location,
    year: parseInt(project.yearCompleted) || new Date().getFullYear(),
    client: project.client || '',
    area: project.area ? parseInt(project.area) : null,
    featured: false,
    publishedAt: new Date().toISOString(),
  };
}

/**
 * Main migration function
 */
async function migrateProjects() {
  console.log('🚀 Starting migration to Sanity CMS...\n');
  console.log(`📁 Projects directory: ${PROJECTS_DIR}`);
  console.log(`📊 Found ${projectsData.length} projects to migrate\n`);

  // Verify Sanity connection
  try {
    await client.datasets.list();
    console.log(`✓ Connected to Sanity project: ${client.config().projectId}`);
    console.log(`✓ Dataset: ${client.config().dataset}\n`);
  } catch (error) {
    console.error('❌ Failed to connect to Sanity:', error);
    process.exit(1);
  }

  let successCount = 0;
  let errorCount = 0;
  let totalImages = 0;

  for (const project of projectsData) {
    try {
      const sanityProject = await transformProjectForSanity(project);

      // Count images
      const imageCount = (sanityProject.mainImage ? 1 : 0) + sanityProject.gallery.length;
      totalImages += imageCount;

      // Create or replace document in Sanity
      await client.createOrReplace(sanityProject);

      successCount++;
      console.log(`✅ Migrated: ${sanityProject.title.en} (${imageCount} images)\n`);
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to migrate project ${project.slug}:`, error);
      console.log('');
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📈 Migration Summary:');
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Failed: ${errorCount}`);
  console.log(`  📊 Total Projects: ${projectsData.length}`);
  console.log(`  🖼️  Total Images: ${totalImages}`);
  console.log('='.repeat(50));
  console.log('\n🎉 Migration complete!');
  console.log('\n📍 View your projects in Sanity Studio at /studio');
}

// Run migration
migrateProjects().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
