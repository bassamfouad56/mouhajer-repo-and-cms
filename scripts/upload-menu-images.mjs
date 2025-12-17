/**
 * Script to upload images to Sanity for services, industries, and posts
 * This enables the mega menu to show different images for each item
 */

import { createClient } from '@sanity/client';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r97logzc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-11-21',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Image URLs from Unsplash - high quality construction/interior images
const SERVICE_IMAGES = {
  'civil-construction': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80', // Construction site
  'interior-architecture': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', // Luxury interior
  'mep-engineering': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80', // Engineering/technical
  'manufacturing-joinery': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Woodworking
  'fit-out-execution': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', // Fit out interior
  'handover-maintenance': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', // Keys/handover
};

const INDUSTRY_IMAGES = {
  'hospitality': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', // Luxury hotel
  'luxury-hospitality': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
  'residential': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', // Luxury villa
  'high-end-residential': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', // Modern office building
  'commercial-corporate': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'corporate': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', // Corporate office
  'retail': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // Retail store
  'food-beverage': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80', // Restaurant
};

const POST_CATEGORY_IMAGES = {
  'design-trends': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', // Modern interior design
  'project-stories': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', // Project showcase
  'materials-craft': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // Materials/craft
  'engineering': 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80', // Engineering
};

// Project category images for mega menu
const PROJECT_CATEGORY_IMAGES = {
  'residential': 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  'commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  'hospitality': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
};

async function uploadImageFromUrl(imageUrl, filename) {
  try {
    console.log(`  Downloading: ${filename}...`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const buffer = await response.buffer();

    console.log(`  Uploading to Sanity: ${filename}...`);
    const asset = await client.assets.upload('image', buffer, {
      filename: `${filename}.jpg`,
      contentType: 'image/jpeg',
    });

    console.log(`  ✓ Uploaded: ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`  ✗ Error uploading ${filename}:`, error.message);
    return null;
  }
}

async function updateDocumentImage(docId, asset) {
  try {
    await client
      .patch(docId)
      .set({
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: asset._id,
          },
        },
      })
      .commit();
    console.log(`  ✓ Updated document: ${docId}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Error updating ${docId}:`, error.message);
    return false;
  }
}

async function processServices() {
  console.log('\n📦 Processing Services...\n');

  const services = await client.fetch(`*[_type == "service"] { _id, title, slug, mainImage }`);
  console.log(`Found ${services.length} services`);

  for (const service of services) {
    const slug = service.slug?.current;
    const title = typeof service.title === 'string' ? service.title : service.title?.en || 'Unknown';

    // Check if already has image
    if (service.mainImage?.asset) {
      console.log(`  ⏭ ${title} already has image, skipping`);
      continue;
    }

    const imageUrl = SERVICE_IMAGES[slug];
    if (!imageUrl) {
      console.log(`  ⚠ No image URL for service: ${slug}`);
      continue;
    }

    console.log(`\n  Processing: ${title} (${slug})`);
    const asset = await uploadImageFromUrl(imageUrl, `service-${slug}`);
    if (asset) {
      await updateDocumentImage(service._id, asset);
    }
  }
}

async function processIndustries() {
  console.log('\n🏭 Processing Industries...\n');

  const industries = await client.fetch(`*[_type == "industry"] { _id, title, slug, mainImage }`);
  console.log(`Found ${industries.length} industries`);

  for (const industry of industries) {
    const slug = industry.slug?.current;
    const title = typeof industry.title === 'string' ? industry.title : industry.title?.en || 'Unknown';

    // Check if already has image
    if (industry.mainImage?.asset) {
      console.log(`  ⏭ ${title} already has image, skipping`);
      continue;
    }

    const imageUrl = INDUSTRY_IMAGES[slug];
    if (!imageUrl) {
      console.log(`  ⚠ No image URL for industry: ${slug}`);
      continue;
    }

    console.log(`\n  Processing: ${title} (${slug})`);
    const asset = await uploadImageFromUrl(imageUrl, `industry-${slug}`);
    if (asset) {
      await updateDocumentImage(industry._id, asset);
    }
  }
}

async function processPosts() {
  console.log('\n📝 Processing Posts...\n');

  const posts = await client.fetch(`*[_type == "post"] { _id, title, slug, category, mainImage }`);
  console.log(`Found ${posts.length} posts`);

  for (const post of posts) {
    const slug = post.slug?.current;
    const category = post.category;
    const title = typeof post.title === 'string' ? post.title : post.title?.en || 'Unknown';

    // Check if already has image
    if (post.mainImage?.asset) {
      console.log(`  ⏭ ${title} already has image, skipping`);
      continue;
    }

    const imageUrl = POST_CATEGORY_IMAGES[category];
    if (!imageUrl) {
      console.log(`  ⚠ No image URL for post category: ${category}`);
      continue;
    }

    console.log(`\n  Processing: ${title} (${category})`);
    const asset = await uploadImageFromUrl(imageUrl, `post-${slug || post._id}`);
    if (asset) {
      await updateDocumentImage(post._id, asset);
    }
  }
}

async function processProjects() {
  console.log('\n🏗️ Processing Projects (for mega menu)...\n');

  // Get one featured project per category for the mega menu
  const categories = ['residential', 'commercial', 'hospitality'];

  for (const category of categories) {
    const projects = await client.fetch(
      `*[_type == "project" && category == $category && !defined(mainImage.asset)] | order(publishedAt desc)[0...1] { _id, title, slug, category }`,
      { category }
    );

    if (projects.length === 0) {
      console.log(`  ⏭ No projects without images for category: ${category}`);
      continue;
    }

    const project = projects[0];
    const title = typeof project.title === 'string' ? project.title : project.title?.en || 'Unknown';
    const imageUrl = PROJECT_CATEGORY_IMAGES[category];

    if (!imageUrl) {
      console.log(`  ⚠ No image URL for category: ${category}`);
      continue;
    }

    console.log(`\n  Processing: ${title} (${category})`);
    const asset = await uploadImageFromUrl(imageUrl, `project-${category}-featured`);
    if (asset) {
      await updateDocumentImage(project._id, asset);
    }
  }
}

async function main() {
  console.log('🚀 Starting Sanity Image Upload Script\n');
  console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
  console.log('Token:', process.env.SANITY_API_TOKEN ? '✓ Found' : '✗ Missing');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('\n❌ SANITY_API_TOKEN not found in environment variables');
    process.exit(1);
  }

  try {
    await processServices();
    await processIndustries();
    await processPosts();
    await processProjects();

    console.log('\n✅ Image upload complete!');
    console.log('\nRefresh your website to see the new images in the mega menu.');
  } catch (error) {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  }
}

main();
