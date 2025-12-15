/**
 * Script to seed industries with images in Sanity
 * Run with: npx tsx scripts/seed-industries.ts
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

interface IndustryData {
  title: string;
  slug: string;
  excerpt: string;
  icon: string;
  imagePath: string;
  order: number;
}

const industries: IndustryData[] = [
  {
    title: 'Luxury Hospitality',
    slug: 'luxury-hospitality',
    excerpt: 'Creating unforgettable experiences through world-class hotel interiors, restaurants, and hospitality venues.',
    icon: 'Hotel',
    imagePath: 'public/projects/commercial-interior/23.jpg',
    order: 1,
  },
  {
    title: 'High-End Residential',
    slug: 'high-end-residential',
    excerpt: 'Transforming luxury homes and villas into personalized sanctuaries of elegance and comfort.',
    icon: 'Home',
    imagePath: 'public/projects/bedroom-interior/5.jpg',
    order: 2,
  },
  {
    title: 'Commercial & Corporate',
    slug: 'commercial-corporate',
    excerpt: 'Designing inspiring workplaces and commercial spaces that drive productivity and brand identity.',
    icon: 'Building',
    imagePath: 'public/projects/commercial-interior/27.jpg',
    order: 3,
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

async function seedIndustries() {
  console.log('Starting to seed industries...\n');

  for (const industry of industries) {
    console.log(`Processing: ${industry.title}`);

    // Check if industry already exists
    const existing = await client.fetch(
      `*[_type == "industry" && slug.current == $slug][0]`,
      { slug: industry.slug }
    );

    if (existing) {
      console.log(`  Industry already exists, updating...`);

      // Upload new image
      const imageAssetId = await uploadImage(industry.imagePath);

      // Update existing industry
      await client
        .patch(existing._id)
        .set({
          title: industry.title,
          excerpt: industry.excerpt,
          icon: industry.icon,
          order: industry.order,
          ...(imageAssetId && {
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAssetId,
              },
              alt: `${industry.title} - MIDC`,
            },
          }),
        })
        .commit();

      console.log(`  Updated: ${industry.title}\n`);
    } else {
      console.log(`  Creating new industry...`);

      // Upload image
      const imageAssetId = await uploadImage(industry.imagePath);

      // Create new industry
      const doc = {
        _type: 'industry',
        title: industry.title,
        slug: {
          _type: 'slug',
          current: industry.slug,
        },
        excerpt: industry.excerpt,
        icon: industry.icon,
        order: industry.order,
        featured: true,
        ...(imageAssetId && {
          mainImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAssetId,
            },
            alt: `${industry.title} - MIDC`,
          },
        }),
      };

      await client.create(doc);
      console.log(`  Created: ${industry.title}\n`);
    }
  }

  console.log('Industries seeding complete!');
}

// Run the seed function
seedIndustries().catch(console.error);
