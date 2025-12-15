/**
 * Script to seed services with images in Sanity
 * Run with: npx tsx scripts/seed-services.ts
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface ServiceData {
  title: string;
  slug: string;
  excerpt: string;
  icon: string;
  imagePath: string;
  order: number;
  features: Array<{ title: string; description: string }>;
}

const services: ServiceData[] = [
  {
    title: 'Civil Construction',
    slug: 'civil-construction',
    excerpt: 'From foundation to finish, we deliver structural excellence with precision engineering and world-class craftsmanship.',
    icon: 'Building2',
    imagePath: 'public/projects/turnkey-design-fitout/_MID2543-HDR.jpg',
    order: 1,
    features: [
      { title: 'Structural Engineering', description: 'Expert structural design and analysis for buildings of all sizes' },
      { title: 'Foundation Work', description: 'Comprehensive foundation solutions including piling and excavation' },
      { title: 'Concrete Construction', description: 'High-quality concrete work with precise finishing' },
    ],
  },
  {
    title: 'Interior Architecture',
    slug: 'interior-architecture',
    excerpt: 'Transforming spaces into extraordinary experiences through innovative design and meticulous attention to detail.',
    icon: 'Palette',
    imagePath: 'public/projects/bedroom-interior/1.jpg',
    order: 2,
    features: [
      { title: 'Space Planning', description: 'Optimal layout design for functionality and flow' },
      { title: 'Material Selection', description: 'Curated materials that reflect luxury and durability' },
      { title: 'Custom Millwork', description: 'Bespoke joinery and built-in solutions' },
    ],
  },
  {
    title: 'MEP Engineering',
    slug: 'mep-engineering',
    excerpt: 'Integrated mechanical, electrical, and plumbing systems designed for efficiency, sustainability, and performance.',
    icon: 'Zap',
    imagePath: 'public/projects/commercial-interior/18.jpg',
    order: 3,
    features: [
      { title: 'HVAC Systems', description: 'Climate control solutions for optimal comfort' },
      { title: 'Electrical Design', description: 'Smart electrical systems with energy efficiency' },
      { title: 'Plumbing Solutions', description: 'Modern plumbing systems with water conservation' },
    ],
  },
  {
    title: 'Manufacturing & Joinery',
    slug: 'manufacturing-joinery',
    excerpt: 'Master craftsmen creating bespoke furniture and millwork that defines luxury living and working spaces.',
    icon: 'Hammer',
    imagePath: 'public/projects/turnkey-design-fitout/_MID2583-HDR.jpg',
    order: 4,
    features: [
      { title: 'Custom Furniture', description: 'Handcrafted furniture tailored to your specifications' },
      { title: 'Kitchen Cabinetry', description: 'Luxury kitchen solutions with premium finishes' },
      { title: 'Wardrobes & Closets', description: 'Bespoke storage solutions maximizing space' },
    ],
  },
  {
    title: 'Fit-Out Execution',
    slug: 'fit-out-execution',
    excerpt: 'Seamless project execution from concept to completion, delivering turnkey solutions with uncompromising quality.',
    icon: 'Wrench',
    imagePath: 'public/projects/bathroom/_MID0061-HDR.jpg',
    order: 5,
    features: [
      { title: 'Project Management', description: 'End-to-end coordination and timeline management' },
      { title: 'Quality Control', description: 'Rigorous inspection at every stage' },
      { title: 'Finishing Works', description: 'Premium finishes that exceed expectations' },
    ],
  },
  {
    title: 'Handover & Maintenance',
    slug: 'handover-maintenance',
    excerpt: 'Comprehensive handover process and ongoing maintenance support to protect your investment for years to come.',
    icon: 'Shield',
    imagePath: 'public/projects/commercial-interior/19.jpg',
    order: 6,
    features: [
      { title: 'Defects Liability', description: '12-month warranty coverage for workmanship' },
      { title: 'Preventive Maintenance', description: 'Scheduled maintenance to extend asset life' },
      { title: '24/7 Support', description: 'Emergency response for critical issues' },
    ],
  },
];

async function uploadImage(imagePath: string): Promise<string | null> {
  const fullPath = path.join(process.cwd(), imagePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`  Image not found: ${fullPath}`);
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(imagePath);

    const asset = await client.assets.upload('image', imageBuffer, {
      filename: fileName,
    });

    console.log(`  Uploaded image: ${fileName}`);
    return asset._id;
  } catch (error) {
    console.error(`  Error uploading image ${imagePath}:`, error);
    return null;
  }
}

async function seedServices() {
  console.log('Starting to seed services...\n');

  for (const service of services) {
    console.log(`Processing: ${service.title}`);

    // Check if service already exists
    const existing = await client.fetch(
      `*[_type == "service" && slug.current == $slug][0]`,
      { slug: service.slug }
    );

    if (existing) {
      console.log(`  Service already exists, updating...`);

      // Upload new image
      const imageAssetId = await uploadImage(service.imagePath);

      // Update existing service
      await client
        .patch(existing._id)
        .set({
          title: service.title,
          excerpt: service.excerpt,
          icon: service.icon,
          order: service.order,
          features: service.features,
          ...(imageAssetId && {
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAssetId,
              },
              alt: `${service.title} - MIDC`,
            },
          }),
        })
        .commit();

      console.log(`  Updated: ${service.title}\n`);
    } else {
      console.log(`  Creating new service...`);

      // Upload image
      const imageAssetId = await uploadImage(service.imagePath);

      // Create new service
      const doc = {
        _type: 'service',
        title: service.title,
        slug: {
          _type: 'slug',
          current: service.slug,
        },
        excerpt: service.excerpt,
        icon: service.icon,
        order: service.order,
        features: service.features,
        featured: service.order <= 3, // First 3 services are featured
        ...(imageAssetId && {
          mainImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAssetId,
            },
            alt: `${service.title} - MIDC`,
          },
        }),
      };

      await client.create(doc);
      console.log(`  Created: ${service.title}\n`);
    }
  }

  console.log('Services seeding complete!');
}

// Run the seed function
seedServices().catch(console.error);
