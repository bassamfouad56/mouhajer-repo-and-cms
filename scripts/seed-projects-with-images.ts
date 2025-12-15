/**
 * Seed Projects with Images to Sanity
 *
 * This script creates/updates projects with images for the Portfolio Showcase.
 *
 * Usage: SANITY_API_TOKEN="your-token" npx tsx scripts/seed-projects-with-images.ts
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r97logzc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// =============================================================================
// PROJECTS DATA WITH IMAGE FILES
// =============================================================================

interface ProjectData {
  slug: string;
  titleEn: string;
  titleAr: string;
  excerptEn: string;
  excerptAr: string;
  location: string;
  year: number;
  category: string;
  featured: boolean;
  imageFileName: string;
}

const projects: ProjectData[] = [
  {
    slug: 'la-petite-maison-restaurant',
    titleEn: 'La Petite Maison Restaurant',
    titleAr: 'مطعم لا بيتيت ميزون',
    excerptEn: 'An elegant French-inspired restaurant featuring sophisticated interior design that blends Parisian charm with Dubai luxury.',
    excerptAr: 'مطعم فرنسي أنيق يتميز بتصميم داخلي راقي يجمع بين السحر الباريسي وفخامة دبي.',
    location: 'DIFC, Dubai',
    year: 2023,
    category: 'hospitality',
    featured: true,
    imageFileName: 'la-petite-maison-restaurant.jpg',
  },
  {
    slug: 'difc-corporate-headquarters',
    titleEn: 'DIFC Corporate Headquarters',
    titleAr: 'المقر الرئيسي لمركز دبي المالي العالمي',
    excerptEn: 'A prestigious corporate headquarters featuring modern design elements and premium finishes in the heart of Dubai\'s financial district.',
    excerptAr: 'مقر رئيسي مرموق يتميز بعناصر التصميم الحديث والتشطيبات الفاخرة في قلب المنطقة المالية بدبي.',
    location: 'DIFC, Dubai',
    year: 2023,
    category: 'commercial',
    featured: true,
    imageFileName: 'difc-corporate-headquarters.jpg',
  },
  {
    slug: 'downtown-dubai-penthouse',
    titleEn: 'Downtown Dubai Penthouse',
    titleAr: 'بنتهاوس وسط مدينة دبي',
    excerptEn: 'A luxurious penthouse with panoramic views of Burj Khalifa, featuring bespoke interiors and premium materials throughout.',
    excerptAr: 'بنتهاوس فاخر بإطلالات بانورامية على برج خليفة، يتميز بتصميمات داخلية مخصصة ومواد فاخرة.',
    location: 'Downtown Dubai',
    year: 2024,
    category: 'residential',
    featured: true,
    imageFileName: 'downtown-dubai-penthouse.jpg',
  },
  {
    slug: 'jumeirah-medical-center',
    titleEn: 'Jumeirah Medical Center',
    titleAr: 'مركز جميرا الطبي',
    excerptEn: 'A state-of-the-art medical facility designed to provide patients with a calming, modern healthcare environment.',
    excerptAr: 'منشأة طبية حديثة مصممة لتوفير بيئة رعاية صحية هادئة وعصرية للمرضى.',
    location: 'Jumeirah, Dubai',
    year: 2023,
    category: 'healthcare',
    featured: true,
    imageFileName: 'jumeirah-medical-center.jpg',
  },
  {
    slug: 'palm-jumeirah-beach-villa',
    titleEn: 'Palm Jumeirah Beach Villa',
    titleAr: 'فيلا شاطئية في نخلة جميرا',
    excerptEn: 'A stunning beachfront villa with contemporary Mediterranean design, featuring seamless indoor-outdoor living spaces.',
    excerptAr: 'فيلا شاطئية مذهلة بتصميم متوسطي معاصر، تتميز بمساحات معيشة داخلية وخارجية متكاملة.',
    location: 'Palm Jumeirah, Dubai',
    year: 2024,
    category: 'residential',
    featured: true,
    imageFileName: 'palm-jumeirah-beach-villa.jpg',
  },
  {
    slug: 'city-walk-flagship-retail-store',
    titleEn: 'City Walk Flagship Retail Store',
    titleAr: 'متجر رئيسي في سيتي ووك',
    excerptEn: 'A premium retail flagship store with innovative display solutions and a memorable customer experience design.',
    excerptAr: 'متجر رئيسي فاخر مع حلول عرض مبتكرة وتصميم تجربة عملاء لا تُنسى.',
    location: 'City Walk, Dubai',
    year: 2023,
    category: 'retail',
    featured: true,
    imageFileName: 'city-walk-flagship-retail-store.jpg',
  },
  {
    slug: 'dubai-marina-wellness-spa',
    titleEn: 'Dubai Marina Wellness Spa',
    titleAr: 'سبا العافية في دبي مارينا',
    excerptEn: 'A tranquil wellness sanctuary designed to provide ultimate relaxation with Japanese-inspired minimalist aesthetics.',
    excerptAr: 'ملاذ عافية هادئ مصمم لتوفير الاسترخاء التام بجماليات يابانية بسيطة.',
    location: 'Dubai Marina',
    year: 2022,
    category: 'hospitality',
    featured: true,
    imageFileName: 'dubai-marina-wellness-spa.jpg',
  },
  {
    slug: 'luxury-hotel-al-maha-desert-resort',
    titleEn: 'Al Maha Desert Resort',
    titleAr: 'منتجع المها الصحراوي',
    excerptEn: 'A luxury desert resort experience blending traditional Arabian architecture with contemporary comforts.',
    excerptAr: 'تجربة منتجع صحراوي فاخرة تجمع بين العمارة العربية التقليدية ووسائل الراحة المعاصرة.',
    location: 'Dubai Desert Conservation Reserve',
    year: 2022,
    category: 'hospitality',
    featured: true,
    imageFileName: 'luxury-hotel-al-maha-desert-resort.jpg',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

async function uploadImage(filename: string): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), 'exported-content', 'images', filename);

    if (!fs.existsSync(fullPath)) {
      console.log(`    Warning: Image not found: ${filename}`);
      return null;
    }

    const fileBuffer = fs.readFileSync(fullPath);
    const asset = await client.assets.upload('image', fileBuffer, {
      filename: filename,
      contentType: 'image/jpeg',
    });

    console.log(`    Uploaded: ${filename}`);
    return asset._id;
  } catch (error) {
    console.error(`    Error uploading ${filename}:`, error);
    return null;
  }
}

// =============================================================================
// MAIN SEEDING FUNCTION
// =============================================================================

async function seedProjects() {
  console.log('\n=== Seeding Projects with Images to Sanity ===\n');

  // Check for existing projects
  const existingProjects = await client.fetch('*[_type == "project"]{_id, slug, "titleEn": title.en, "titleLegacy": title}');
  console.log(`Found ${existingProjects.length} existing projects in Sanity\n`);

  // Track uploaded images to avoid duplicates
  const uploadedImages: Record<string, string> = {};

  for (const project of projects) {
    console.log(`\nProcessing: ${project.titleEn}`);

    // Check if project already exists by slug
    const existing = existingProjects.find(
      (p: any) => p.slug?.current === project.slug
    );

    // Upload image if not already uploaded
    let imageAssetId: string | null = null;
    if (project.imageFileName) {
      if (uploadedImages[project.imageFileName]) {
        imageAssetId = uploadedImages[project.imageFileName];
        console.log(`    Using cached image: ${project.imageFileName}`);
      } else {
        imageAssetId = await uploadImage(project.imageFileName);
        if (imageAssetId) {
          uploadedImages[project.imageFileName] = imageAssetId;
        }
      }
    }

    // Prepare document with i18n structure
    const doc: any = {
      _type: 'project',
      title: {
        en: project.titleEn,
        ar: project.titleAr,
      },
      slug: {
        _type: 'slug',
        current: project.slug,
      },
      excerpt: {
        en: project.excerptEn,
        ar: project.excerptAr,
      },
      location: {
        en: project.location,
        ar: project.location,
      },
      year: project.year,
      category: project.category,
      featured: project.featured,
      publishedAt: new Date().toISOString(),
    };

    // Add image if uploaded
    if (imageAssetId) {
      doc.mainImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId,
        },
        alt: project.titleEn,
      };
    }

    if (existing) {
      // Update existing project
      await client.patch(existing._id).set(doc).commit();
      console.log(`    Updated: ${existing._id}`);
    } else {
      // Create new project
      const newDoc = await client.create(doc);
      console.log(`    Created: ${newDoc._id}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Projects seeding completed!\n');

  // Summary
  const finalProjects = await client.fetch('*[_type == "project" && featured == true] | order(year desc) { "title": coalesce(title.en, title), year, category, "hasImage": defined(mainImage) }');
  console.log('Featured Projects:');
  finalProjects.forEach((p: any, i: number) => {
    const imageStatus = p.hasImage ? '✓ Has Image' : '✗ NO IMAGE';
    console.log(`  ${i + 1}. [${p.year}] ${p.title} - ${p.category} (${imageStatus})`);
  });

  console.log(`\nTotal featured projects: ${finalProjects.length}`);
  console.log('\nView in Sanity Studio: http://localhost:3333/studio');
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('Starting Projects Migration to Sanity...\n');
  console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r97logzc');
  console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'production');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('\n❌ Error: SANITY_API_TOKEN environment variable is required');
    console.log('Usage: SANITY_API_TOKEN="your-token" npx tsx scripts/seed-projects-with-images.ts');
    process.exit(1);
  }

  try {
    await seedProjects();
  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}

main();
