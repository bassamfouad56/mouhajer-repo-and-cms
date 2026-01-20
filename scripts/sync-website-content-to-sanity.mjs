/**
 * Sync Website 2.0 Content to Sanity CMS
 *
 * This script uploads images from the /public/website 2.0 content/ folder
 * to Sanity and updates relevant documents with new image references.
 *
 * Usage:
 *   node scripts/sync-website-content-to-sanity.mjs
 *   node scripts/sync-website-content-to-sanity.mjs --dry-run
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const CONTENT_FOLDER = path.join(__dirname, '../public/website 2.0 content');

// Sanity client setup
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lmqsjbwi',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Image mappings: folder path -> Sanity document type and field
const IMAGE_MAPPINGS = {
  // Homepage images
  'homepage/The Main Contractor': { type: 'siteSettings', field: 'homepageImages.mainContractor' },
  'homepage/The Design Studio': { type: 'siteSettings', field: 'homepageImages.designStudio' },
  'homepage/The Craftsmen': { type: 'siteSettings', field: 'homepageImages.craftsmen' },
  'homepage/The Keys': { type: 'siteSettings', field: 'homepageImages.theKeys' },
  'homepage/Property Owners': { type: 'siteSettings', field: 'homepageImages.propertyOwners' },
  'homepage/land owners': { type: 'siteSettings', field: 'homepageImages.landOwners' },
  'homepage/In-House MEP Division': { type: 'siteSettings', field: 'homepageImages.mepDivision' },
  'homepage/Our Track Record': { type: 'siteSettings', field: 'homepageImages.trackRecord' },

  // Services - Main banners
  'services/civil construction': { type: 'service', slug: 'civil-construction', field: 'mainImage' },
  'services/interior architecture': { type: 'service', slug: 'interior-architecture', field: 'mainImage' },
  'services/MEP Engineering': { type: 'service', slug: 'mep-engineering', field: 'mainImage' },
  'services/manufacturing and joinery': { type: 'service', slug: 'manufacturing-joinery', field: 'mainImage' },
  'services/fitout execution': { type: 'service', slug: 'fit-out-execution', field: 'mainImage' },

  // Industries
  'services/industries/luxury hospitality': { type: 'industry', slug: 'luxury-hospitality', field: 'mainImage' },
  'services/industries/highend residential': { type: 'industry', slug: 'high-end-residential', field: 'mainImage' },
  'services/industries/commercial and corporate': { type: 'industry', slug: 'commercial-corporate', field: 'mainImage' },

  // Projects category thumbnails (for mega menu fallbacks)
  'projects/hospitality': { type: 'megaMenuImages', category: 'hospitality', field: 'projects.hospitality' },
  'projects/commercial': { type: 'megaMenuImages', category: 'commercial', field: 'projects.commercial' },
  'projects/residential': { type: 'megaMenuImages', category: 'residential', field: 'projects.residential' },
};

/**
 * Get all image files from a directory recursively
 */
function getImageFiles(dir, files = []) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getImageFiles(fullPath, files);
    } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(item)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Upload an image to Sanity
 */
async function uploadImage(filePath) {
  const fileName = path.basename(filePath);

  console.log(`  Uploading: ${fileName}`);

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would upload: ${filePath}`);
    return { _type: 'image', asset: { _ref: 'dry-run-ref' } };
  }

  try {
    const imageAsset = await client.assets.upload('image', fs.createReadStream(filePath), {
      filename: fileName,
    });

    console.log(`  ✓ Uploaded: ${imageAsset._id}`);

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: imageAsset._id,
      },
    };
  } catch (error) {
    console.error(`  ✗ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

/**
 * Update a Sanity document with a new image
 */
async function updateDocument(type, query, imageRef, field) {
  console.log(`  Updating ${type} document, field: ${field}`);

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would update ${type} with query: ${JSON.stringify(query)}`);
    return true;
  }

  try {
    // Find the document
    const groqQuery = type === 'siteSettings'
      ? `*[_type == "siteSettings"][0]`
      : `*[_type == "${type}" && slug.current == "${query.slug}"][0]`;

    const doc = await client.fetch(groqQuery);

    if (!doc) {
      console.log(`  ✗ Document not found for ${type}`);
      return false;
    }

    // Update the document
    await client
      .patch(doc._id)
      .set({ [field]: imageRef })
      .commit();

    console.log(`  ✓ Updated document: ${doc._id}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed to update document:`, error.message);
    return false;
  }
}

/**
 * Main sync function
 */
async function syncContent() {
  console.log('\n========================================');
  console.log('  Website 2.0 Content -> Sanity Sync');
  console.log('========================================\n');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  // Check if content folder exists
  if (!fs.existsSync(CONTENT_FOLDER)) {
    console.error(`Content folder not found: ${CONTENT_FOLDER}`);
    process.exit(1);
  }

  // Get all image files
  const allImages = getImageFiles(CONTENT_FOLDER);
  console.log(`Found ${allImages.length} image files\n`);

  // Process each mapping
  let successCount = 0;
  let failCount = 0;

  for (const [folderPath, mapping] of Object.entries(IMAGE_MAPPINGS)) {
    const fullFolderPath = path.join(CONTENT_FOLDER, folderPath);

    console.log(`\nProcessing: ${folderPath}`);
    console.log('─'.repeat(50));

    // Find images in this folder
    const folderImages = allImages.filter(img => img.startsWith(fullFolderPath));

    if (folderImages.length === 0) {
      console.log('  No images found in this folder');
      continue;
    }

    // Use the first image (or you could implement logic to pick the best one)
    const imageToUpload = folderImages[0];
    console.log(`  Found ${folderImages.length} image(s), using: ${path.basename(imageToUpload)}`);

    // Upload the image
    const imageRef = await uploadImage(imageToUpload);

    if (!imageRef) {
      failCount++;
      continue;
    }

    // Update the document
    const success = await updateDocument(
      mapping.type,
      { slug: mapping.slug },
      imageRef,
      mapping.field
    );

    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('\n========================================');
  console.log('  Sync Complete');
  console.log('========================================');
  console.log(`  ✓ Success: ${successCount}`);
  console.log(`  ✗ Failed:  ${failCount}`);
  console.log('========================================\n');

  if (DRY_RUN) {
    console.log('This was a dry run. Run without --dry-run to apply changes.\n');
  }
}

// Run the sync
syncContent().catch(console.error);
