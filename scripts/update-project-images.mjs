import { createClient } from '@sanity/client';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error('SANITY_API_TOKEN required');
  process.exit(1);
}

const PUBLIC_DIR = join(process.cwd(), 'public');

// Upload a single image
async function uploadImage(imagePath, filename) {
  try {
    const imageBuffer = readFileSync(imagePath);
    const asset = await client.assets.upload('image', imageBuffer, { filename });
    console.log(`  ✅ Uploaded: ${filename}`);
    return asset._id;
  } catch (err) {
    console.error(`  ❌ Failed to upload ${filename}: ${err.message}`);
    return null;
  }
}

// Get image files from directory
function getImageFiles(dir, limit = 20) {
  if (!existsSync(dir)) {
    console.log(`  ⚠️ Directory not found: ${dir}`);
    return [];
  }
  return readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort()
    .slice(0, limit);
}

// Update project with images
async function updateProjectImages(projectId, mainImageAssetId, galleryAssets) {
  const gallery = galleryAssets.map((assetId, index) => ({
    _key: `gallery-${index}`,
    _type: 'image',
    category: 'interior',
    asset: { _type: 'reference', _ref: assetId }
  }));

  const patch = {
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: mainImageAssetId }
    },
    gallery
  };

  await client.patch(projectId).set(patch).commit();
  console.log(`  ✅ Updated project: ${projectId}`);
}

// === SHERATON ===
async function updateSheraton() {
  console.log('\n📸 SHERATON ABU DHABI - Uploading images...');

  const projectsDir = join(PUBLIC_DIR, 'projects/sheraton');
  const lobbyDir = join(PUBLIC_DIR, 'sh/final pictures/lobby');
  const restaurantDir = join(PUBLIC_DIR, 'sh/final pictures/flavours restaurant');

  const assets = [];

  // Upload from projects/sheraton folder
  const sheratonFiles = getImageFiles(projectsDir, 30);
  for (const file of sheratonFiles) {
    const assetId = await uploadImage(join(projectsDir, file), `sheraton-${file}`);
    if (assetId) assets.push(assetId);
  }

  // Upload from lobby folder
  const lobbyFiles = getImageFiles(lobbyDir, 15);
  for (const file of lobbyFiles) {
    const assetId = await uploadImage(join(lobbyDir, file), `sheraton-lobby-${file}`);
    if (assetId) assets.push(assetId);
  }

  // Upload from restaurant folder
  const restaurantFiles = getImageFiles(restaurantDir, 10);
  for (const file of restaurantFiles) {
    const assetId = await uploadImage(join(restaurantDir, file), `sheraton-restaurant-${file}`);
    if (assetId) assets.push(assetId);
  }

  if (assets.length > 0) {
    await updateProjectImages('project-sheraton-abu-dhabi', assets[0], assets);
    console.log(`  📊 Total images: ${assets.length}`);
  }
}

// === SOFITEL JBR ===
async function updateSofitelJBR() {
  console.log('\n📸 SOFITEL JBR - Uploading images...');

  const projectsDir = join(PUBLIC_DIR, 'projects/sofitel-jbr');
  const jbrDir = join(PUBLIC_DIR, 'jbr');

  const assets = [];

  // Upload from projects/sofitel-jbr folder
  const sofitelFiles = getImageFiles(projectsDir, 30);
  for (const file of sofitelFiles) {
    const assetId = await uploadImage(join(projectsDir, file), `sofitel-${file}`);
    if (assetId) assets.push(assetId);
  }

  // Upload from jbr folder
  const jbrFiles = getImageFiles(jbrDir, 20);
  for (const file of jbrFiles) {
    const assetId = await uploadImage(join(jbrDir, file), `sofitel-jbr-${file}`);
    if (assetId) assets.push(assetId);
  }

  if (assets.length > 0) {
    await updateProjectImages('project-sofitel-jbr', assets[0], assets);
    console.log(`  📊 Total images: ${assets.length}`);
  }
}

// === ADDRESS BOULEVARD ===
async function updateAddressBoulevard() {
  console.log('\n📸 ADDRESS BOULEVARD - Uploading images...');

  const projectsDir = join(PUBLIC_DIR, 'projects/address-boulevard');

  const assets = [];

  const files = getImageFiles(projectsDir, 50);
  for (const file of files) {
    const assetId = await uploadImage(join(projectsDir, file), `address-boulevard-${file}`);
    if (assetId) assets.push(assetId);
  }

  if (assets.length > 0) {
    await updateProjectImages('project-address-boulevard', assets[0], assets);
    console.log(`  📊 Total images: ${assets.length}`);
  }
}

// === RITZ-CARLTON ABU DHABI ===
async function updateRitzCarlton() {
  console.log('\n📸 RITZ-CARLTON ABU DHABI - Uploading images...');

  const projectsDir = join(PUBLIC_DIR, 'projects/ritz-carlton-abu-dhabi');

  const assets = [];

  const files = getImageFiles(projectsDir, 35);
  for (const file of files) {
    const assetId = await uploadImage(join(projectsDir, file), `ritz-carlton-${file}`);
    if (assetId) assets.push(assetId);
  }

  if (assets.length > 0) {
    await updateProjectImages('project-ritz-carlton-abu-dhabi', assets[0], assets);
    console.log(`  📊 Total images: ${assets.length}`);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting image upload for projects...');
  console.log('=======================================\n');

  // Get command line argument for specific project
  const args = process.argv.slice(2);
  const specificProject = args[0];

  if (specificProject === 'sheraton') {
    await updateSheraton();
  } else if (specificProject === 'sofitel') {
    await updateSofitelJBR();
  } else if (specificProject === 'address') {
    await updateAddressBoulevard();
  } else if (specificProject === 'ritz') {
    await updateRitzCarlton();
  } else {
    // Run all
    await updateSheraton();
    await updateSofitelJBR();
    await updateAddressBoulevard();
    await updateRitzCarlton();
  }

  console.log('\n=======================================');
  console.log('✅ Image upload complete!');
}

main().catch(console.error);
