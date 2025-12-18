// Script to repopulate missing Sanity images after asset deletion
// Run with: node scripts/repopulate-sanity-images.mjs

import { createClient } from '@sanity/client';

const SANITY_TOKEN = 'skIdC1DpshvpNTdrONZgWZGG2zntEBr11zcgNTRsDnEdEeKrvArJ3qhigwib5kuvXoMZQKwzUmFPSnPCz31G9Xg5VkdpTYd1mn06nUkhRJPcKSTWMTCFnI0jghMNITc5X5VEk8QMX4tKR9qhE93eYLj21DeWzZZG4kHhSQLvDpjVe9Uf0EIu';

const client = createClient({
  projectId: 'r97logzc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
});

// Fetch all image assets
async function getImageAssets() {
  const query = `*[_type == "sanity.imageAsset"] | order(originalFilename asc) {
    _id,
    originalFilename,
    url
  }`;
  return await client.fetch(query);
}

// Find asset by filename pattern
function findAssetByPattern(assets, pattern) {
  const asset = assets.find(a =>
    a.originalFilename && a.originalFilename.toLowerCase().includes(pattern.toLowerCase())
  );
  if (asset) {
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  }
  return null;
}

// Find asset by exact filename
function findAssetByName(assets, filename) {
  const asset = assets.find(a => a.originalFilename === filename);
  if (asset) {
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  }
  return null;
}

// Update a document's image field
async function updateDocumentImage(docId, fieldName, imageRef) {
  if (!imageRef) {
    console.log(`  ⚠️  No image found for ${docId}`);
    return false;
  }

  try {
    await client.patch(docId).set({ [fieldName]: imageRef }).commit();
    console.log(`  ✅ Updated ${docId} → ${fieldName}`);
    return true;
  } catch (err) {
    console.log(`  ❌ Failed to update ${docId}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Sanity Image Repopulation Script');
  console.log('='.repeat(60));
  console.log('');

  // Fetch all available image assets
  console.log('Fetching image assets from Sanity...');
  const assets = await getImageAssets();
  console.log(`Found ${assets.length} image assets\n`);

  let updated = 0;
  let failed = 0;

  // ============================================
  // INDUSTRIES
  // ============================================
  console.log('📁 INDUSTRIES');
  console.log('-'.repeat(40));

  const industryMappings = [
    { id: 'industry-1', name: 'Hospitality', pattern: 'ritzcarl01' },
    { id: 'industry-2', name: 'Residential', pattern: 'villa15x01' },
    { id: 'industry-commercial', name: 'Commercial', pattern: 'officeC101' },
    { id: 'industry-6', name: 'Retail', pattern: 'officeC110' },
  ];

  for (const mapping of industryMappings) {
    console.log(`\n  ${mapping.name} (${mapping.id}):`);
    const imageRef = findAssetByPattern(assets, mapping.pattern);
    const success = await updateDocumentImage(mapping.id, 'mainImage', imageRef);
    if (success) updated++; else failed++;
  }

  // ============================================
  // SERVICES
  // ============================================
  console.log('\n\n📁 SERVICES');
  console.log('-'.repeat(40));

  const serviceMappings = [
    { id: 'service-1', name: 'Interior Architecture', pattern: 'villa15x25' },
    { id: 'service-2', name: 'MEP Engineering', pattern: 'officeC108' },
    { id: 'service-3', name: 'Manufacturing & Joinery', pattern: 'villa15x14' },
    { id: 'service-4', name: 'Fit-Out Execution', pattern: 'sofiteljbr01' },
    { id: 'service-fit-out-execution', name: 'Fit-Out & Execution', pattern: 'sheratonAD01' },
    { id: 'service-5', name: 'Handover & Maintenance', pattern: 'JumIsl01' },
  ];

  for (const mapping of serviceMappings) {
    console.log(`\n  ${mapping.name} (${mapping.id}):`);
    const imageRef = findAssetByPattern(assets, mapping.pattern);
    const success = await updateDocumentImage(mapping.id, 'mainImage', imageRef);
    if (success) updated++; else failed++;
  }

  // ============================================
  // BLOG POSTS
  // ============================================
  console.log('\n\n📁 BLOG POSTS');
  console.log('-'.repeat(40));

  const postMappings = [
    { id: 'post-1', name: 'Post 1', pattern: 'Pakhyattvip01' },
    { id: 'post-2', name: 'Post 2', pattern: 'ritzcarl15' },
    { id: 'post-3', name: 'Post 3', pattern: 'villa15x30' },
    { id: 'post-anatomy-winner-2025', name: 'Anatomy of a Winner', pattern: 'sofiteljbr10' },
    { id: 'post-blame-game-turnkey', name: 'Blame Game Turnkey', pattern: 'officeC105' },
    { id: 'post-sound-of-luxury', name: 'Sound of Luxury', pattern: 'penthouse01' },
  ];

  for (const mapping of postMappings) {
    console.log(`\n  ${mapping.name} (${mapping.id}):`);
    const imageRef = findAssetByPattern(assets, mapping.pattern);
    const success = await updateDocumentImage(mapping.id, 'mainImage', imageRef);
    if (success) updated++; else failed++;
  }

  // ============================================
  // PROJECTS
  // ============================================
  console.log('\n\n📁 PROJECTS');
  console.log('-'.repeat(40));

  const projectMappings = [
    { id: 'project-closet-dressing-room-design', name: 'Closet Dressing Room', pattern: 'villa15x14' },
    { id: 'project-sheraton-abu-dhabi-renovation', name: 'Sheraton Abu Dhabi', pattern: 'sheratonAD01' },
    { id: 'project-modern-office-fitout-dubai', name: 'Modern Office Fitout', pattern: 'officeC101' },
    { id: 'bsdaB5yTTfnN2hUF2L6DpF', name: 'Project from batch 2', pattern: 'askim01' },
    { id: 'bsdaB5yTTfnN2hUF2L6Eye', name: 'Project from batch 2', pattern: 'prince01' },
  ];

  for (const mapping of projectMappings) {
    console.log(`\n  ${mapping.name} (${mapping.id}):`);
    const imageRef = findAssetByPattern(assets, mapping.pattern);
    const success = await updateDocumentImage(mapping.id, 'mainImage', imageRef);
    if (success) updated++; else failed++;
  }

  // ============================================
  // AWARDS
  // ============================================
  console.log('\n\n📁 AWARDS');
  console.log('-'.repeat(40));

  const awardMappings = [
    { id: 'Zuxbdi1Wl3DApzNzfEv8xJ', name: 'Best Residential Interior', pattern: 'villa15x05' },
    { id: 'xVnPuN5l3oZUVWqysm0o0Y', name: 'Best Hotel Interior', pattern: 'ritzcarl05' },
  ];

  for (const mapping of awardMappings) {
    console.log(`\n  ${mapping.name} (${mapping.id}):`);
    const imageRef = findAssetByPattern(assets, mapping.pattern);
    const success = await updateDocumentImage(mapping.id, 'image', imageRef);
    if (success) updated++; else failed++;
  }

  // ============================================
  // SUMMARY
  // ============================================
  console.log('\n');
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Updated: ${updated}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total: ${updated + failed}`);
}

main().catch(console.error);
