import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load env file
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.substring(0, eqIndex).trim();
          let value = trimmed.substring(eqIndex + 1).trim();
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          envVars[key] = value;
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error('Error loading .env.local:', error.message);
    return {};
  }
}

const envVars = loadEnvFile();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || envVars.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || envVars.NEXT_PUBLIC_SANITY_DATASET || 'production';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Known stock image patterns (common stock photo filenames)
const STOCK_IMAGE_PATTERNS = [
  /unsplash/i,
  /pexels/i,
  /shutterstock/i,
  /istockphoto/i,
  /istock/i,
  /getty/i,
  /adobe/i,
  /stock/i,
  /placeholder/i,
  /sample/i,
  /demo/i,
  /test/i,
  // Generic numbered stock patterns
  /^\d+$/,
  /^image[_-]?\d+/i,
  /^photo[_-]?\d+/i,
  /^img[_-]?\d+/i,
];

function isLikelyStockImage(filename) {
  if (!filename) return false;
  return STOCK_IMAGE_PATTERNS.some(pattern => pattern.test(filename));
}

async function listImages() {
  console.log('Fetching image assets from Sanity...\n');
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}\n`);

  // Get all image assets
  const assets = await client.fetch(`
    *[_type == 'sanity.imageAsset'] | order(_createdAt desc) {
      _id,
      originalFilename,
      url,
      _createdAt,
      size,
      "usedBy": count(*[references(^._id)])
    }
  `);

  console.log(`Total images found: ${assets.length}\n`);

  // Separate into likely stock vs uploaded
  const likelyStock = [];
  const likelyUploaded = [];

  assets.forEach(asset => {
    if (isLikelyStockImage(asset.originalFilename)) {
      likelyStock.push(asset);
    } else {
      likelyUploaded.push(asset);
    }
  });

  console.log('=== LIKELY STOCK IMAGES (may want to remove) ===\n');
  if (likelyStock.length === 0) {
    console.log('No obvious stock images found based on filename patterns.\n');
  } else {
    likelyStock.forEach((asset, i) => {
      console.log(`${i + 1}. ${asset.originalFilename || 'Unknown'}`);
      console.log(`   ID: ${asset._id}`);
      console.log(`   Created: ${asset._createdAt}`);
      console.log(`   Used by: ${asset.usedBy} documents`);
      console.log(`   Size: ${Math.round(asset.size / 1024)} KB`);
      console.log('');
    });
  }

  console.log('\n=== LIKELY USER UPLOADED IMAGES ===\n');
  likelyUploaded.slice(0, 30).forEach((asset, i) => {
    console.log(`${i + 1}. ${asset.originalFilename || 'Unknown'}`);
    console.log(`   ID: ${asset._id}`);
    console.log(`   Created: ${asset._createdAt}`);
    console.log(`   Used by: ${asset.usedBy} documents`);
    console.log(`   Size: ${Math.round(asset.size / 1024)} KB`);
    console.log('');
  });

  if (likelyUploaded.length > 30) {
    console.log(`... and ${likelyUploaded.length - 30} more uploaded images`);
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Likely stock images: ${likelyStock.length}`);
  console.log(`Likely uploaded images: ${likelyUploaded.length}`);
  console.log(`Total: ${assets.length}`);

  // Also list unused images
  const unusedImages = assets.filter(a => a.usedBy === 0);
  console.log(`\nUnused images (not referenced): ${unusedImages.length}`);
  if (unusedImages.length > 0) {
    console.log('\nUnused image filenames:');
    unusedImages.forEach(a => console.log(`  - ${a.originalFilename || a._id}`));
  }
}

listImages().catch(console.error);
