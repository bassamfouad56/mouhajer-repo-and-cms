import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// Sanity client with write token
const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// Check if token is available
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  console.log('Please set it with: export SANITY_API_TOKEN=your_token_here');
  process.exit(1);
}

const PUBLIC_DIR = join(process.cwd(), 'public');

// Image mappings - using existing images from public folder
const SERVICE_IMAGES = {
  'interior-design': '/team/MID9207.jpg',
  'architecture': '/team/MID9563.jpg',
  'furniture': '/founder/CID_2106_00_COVER.jpg',
  'project-management': '/team/MID8563.jpg',
  'turnkey-solutions': '/team/MID9207.jpg',
  '3d-visualization': '/mep/Layer 21.png',
  'custom-joinery': '/founder/CID_2106_00_COVER.jpg',
  'fit-out-execution': '/team/MID9563.jpg',
  'hospitality-design': '/team/MID8563.jpg',
  'commercial-office': '/team/MID9207.jpg',
  // Fallback for any other services
  'default': '/team/MID9207.jpg',
};

const INDUSTRY_IMAGES = {
  'commercial': '/team/MID9207.jpg',
  'healthcare': '/mep/Layer 21.png',
  'hospitality': '/team/MID8563.jpg',
  'residential': '/team/MID9563.jpg',
  'retail': '/founder/CID_2106_00_COVER.jpg',
  // Fallback
  'default': '/team/MID9207.jpg',
};

async function uploadImage(imagePath) {
  const fullPath = join(PUBLIC_DIR, imagePath);

  try {
    console.log(`  📤 Uploading: ${imagePath}`);
    const imageBuffer = readFileSync(fullPath);
    const filename = imagePath.split('/').pop();

    const asset = await client.assets.upload('image', imageBuffer, {
      filename,
    });

    console.log(`  ✅ Uploaded: ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`  ❌ Failed to upload ${imagePath}:`, error.message);
    return null;
  }
}

async function updateDocument(docId, assetId) {
  try {
    await client
      .patch(docId)
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

    console.log(`  ✅ Updated document: ${docId}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to update ${docId}:`, error.message);
    return false;
  }
}

async function processServices() {
  console.log('\n📦 Processing Services...\n');

  const services = await client.fetch(`*[_type == "service"] { _id, slug, title }`);
  console.log(`Found ${services.length} services\n`);

  // Track uploaded images to reuse
  const uploadedImages = {};

  for (const service of services) {
    const slug = service.slug?.current || service.slug?._type === 'slug' ? service.slug.current : '';
    const title = typeof service.title === 'object' ? service.title.en : service.title;

    console.log(`\n🔧 Service: ${title} (${slug})`);

    // Get image path for this service
    const imagePath = SERVICE_IMAGES[slug] || SERVICE_IMAGES['default'];

    // Check if we already uploaded this image
    if (!uploadedImages[imagePath]) {
      const asset = await uploadImage(imagePath);
      if (asset) {
        uploadedImages[imagePath] = asset._id;
      }
    }

    if (uploadedImages[imagePath]) {
      await updateDocument(service._id, uploadedImages[imagePath]);
    }
  }
}

async function processIndustries() {
  console.log('\n\n🏭 Processing Industries...\n');

  const industries = await client.fetch(`*[_type == "industry"] { _id, slug, title }`);
  console.log(`Found ${industries.length} industries\n`);

  // Track uploaded images to reuse
  const uploadedImages = {};

  for (const industry of industries) {
    const slug = industry.slug?.current || '';
    const title = typeof industry.title === 'object' ? industry.title.en : industry.title;

    console.log(`\n🏢 Industry: ${title} (${slug})`);

    // Get image path for this industry
    const imagePath = INDUSTRY_IMAGES[slug] || INDUSTRY_IMAGES['default'];

    // Check if we already uploaded this image
    if (!uploadedImages[imagePath]) {
      const asset = await uploadImage(imagePath);
      if (asset) {
        uploadedImages[imagePath] = asset._id;
      }
    }

    if (uploadedImages[imagePath]) {
      await updateDocument(industry._id, uploadedImages[imagePath]);
    }
  }
}

async function main() {
  console.log('🚀 Starting Sanity Image Upload Script\n');
  console.log('Project ID:', 'b6q28exv');
  console.log('Dataset:', 'mouhajer-db');

  try {
    await processServices();
    await processIndustries();

    console.log('\n\n✨ All done! Images have been uploaded to Sanity.');
    console.log('The mega menu should now display the images from Sanity.');
  } catch (error) {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  }
}

main();
