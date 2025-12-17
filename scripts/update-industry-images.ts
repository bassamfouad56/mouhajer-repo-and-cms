/**
 * Script to update industry images in Sanity
 *
 * Usage: npx tsx scripts/update-industry-images.ts
 *
 * This script will:
 * 1. Fetch all industries from Sanity
 * 2. Upload unique images for each industry
 * 3. Update the industry documents with the new images
 */

import { createClient } from '@sanity/client';
import { basename } from 'path';

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Required for mutations
  useCdn: false,
});

// High-quality Unsplash images for each industry
// These are direct image URLs that can be used
const INDUSTRY_IMAGES: Record<string, string> = {
  hospitality: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&h=900&fit=crop&q=80', // Luxury hotel lobby
  residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&h=900&fit=crop&q=80', // Modern villa
  commercial: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=900&fit=crop&q=80', // Modern office building
  retail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop&q=80', // Luxury retail store
  corporate: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop&q=80', // Corporate office interior
  'food-beverage': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=900&fit=crop&q=80', // Restaurant interior
  healthcare: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=900&fit=crop&q=80', // Modern hospital
  education: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&h=900&fit=crop&q=80', // University campus
};

// Fallback image for industries not in the mapping
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1600&h=900&fit=crop&q=80';

async function uploadImageFromUrl(imageUrl: string, filename: string): Promise<string | null> {
  try {
    console.log(`  Fetching image from URL...`);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`  Uploading to Sanity (${(buffer.length / 1024).toFixed(0)} KB)...`);

    const asset = await client.assets.upload('image', buffer, {
      filename: `${filename}.jpg`,
      contentType: 'image/jpeg',
    });

    console.log(`  Uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error(`  Error uploading image:`, error);
    return null;
  }
}

async function updateIndustryImage(industryId: string, assetId: string): Promise<boolean> {
  try {
    await client
      .patch(industryId)
      .set({
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: assetId,
          },
        },
      })
      .commit();

    return true;
  } catch (error) {
    console.error(`  Error updating industry:`, error);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Industry Image Update Script');
  console.log('='.repeat(60));

  // Check for API token
  if (!process.env.SANITY_API_TOKEN) {
    console.error('\nError: SANITY_API_TOKEN environment variable is required');
    console.log('\nTo get a token:');
    console.log('1. Go to https://www.sanity.io/manage');
    console.log('2. Select your project');
    console.log('3. Go to API > Tokens');
    console.log('4. Create a new token with "Editor" permissions');
    console.log('\nThen run:');
    console.log('set SANITY_API_TOKEN=your-token-here');
    console.log('npx tsx scripts/update-industry-images.ts');
    process.exit(1);
  }

  console.log('\nFetching industries from Sanity...\n');

  // Fetch all industries
  const industries = await client.fetch(`
    *[_type == "industry"] {
      _id,
      title,
      "slug": slug.current,
      mainImage
    }
  `);

  if (!industries || industries.length === 0) {
    console.log('No industries found in Sanity.');
    return;
  }

  console.log(`Found ${industries.length} industries:\n`);

  // Track unique slugs to avoid duplicates
  const processedSlugs = new Set<string>();
  let updatedCount = 0;
  let skippedCount = 0;

  for (const industry of industries) {
    const slug = industry.slug || 'unknown';
    const title = typeof industry.title === 'string'
      ? industry.title
      : industry.title?.en || industry.title?.ar || slug;

    console.log(`\n[${slug}] ${title}`);
    console.log('-'.repeat(40));

    // Skip if already processed this slug (duplicate)
    if (processedSlugs.has(slug)) {
      console.log('  Skipping (duplicate slug)');
      skippedCount++;
      continue;
    }
    processedSlugs.add(slug);

    // Check if already has an image
    if (industry.mainImage?.asset) {
      console.log('  Already has an image, skipping...');
      console.log(`  (Use --force to override existing images)`);
      skippedCount++;
      continue;
    }

    // Get the image URL for this industry
    const imageUrl = INDUSTRY_IMAGES[slug] || FALLBACK_IMAGE;
    console.log(`  Image source: ${slug in INDUSTRY_IMAGES ? 'Industry-specific' : 'Fallback'}`);

    // Upload the image
    const assetId = await uploadImageFromUrl(imageUrl, `industry-${slug}`);

    if (!assetId) {
      console.log('  Failed to upload image');
      continue;
    }

    // Update the industry document
    console.log(`  Updating industry document...`);
    const success = await updateIndustryImage(industry._id, assetId);

    if (success) {
      console.log('  Done!');
      updatedCount++;
    } else {
      console.log('  Failed to update');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Summary:');
  console.log(`  Total industries: ${industries.length}`);
  console.log(`  Updated: ${updatedCount}`);
  console.log(`  Skipped: ${skippedCount}`);
  console.log('='.repeat(60));
}

// Run the script
main().catch(console.error);
