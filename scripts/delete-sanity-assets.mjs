// Script to delete Sanity media assets
// Run with: node scripts/delete-sanity-assets.mjs

import { createClient } from '@sanity/client';

// Use token from argument or hardcoded
const SANITY_TOKEN = process.argv[2] || 'skIdC1DpshvpNTdrONZgWZGG2zntEBr11zcgNTRsDnEdEeKrvArJ3qhigwib5kuvXoMZQKwzUmFPSnPCz31G9Xg5VkdpTYd1mn06nUkhRJPcKSTWMTCFnI0jghMNITc5X5VEk8QMX4tKR9qhE93eYLj21DeWzZZG4kHhSQLvDpjVe9Uf0EIu';

const client = createClient({
  projectId: 'r97logzc',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
});

// Asset IDs to delete
const assetIdsToDelete = [
  'e099b546979bf51c22e7f03db199c3d88b51fc36-1600x1068-jpg', // city-walk-flagship-retail-store.jpg
  '152c95641daecac0d669031110fdb4bc801019db-1600x1067-jpg', // dubai-marina-wellness-spa.jpg
  '1b9a4460b687137931e828833d08beeb0ecbee66-1600x1067-jpg', // luxury-hotel-al-maha-desert-resort.jpg
  '2361138e42e7d6bf00e0ece0b6494ddb5fcf53c2-1600x1067-jpg', // palm-jumeirah-beach-villa.jpg
  'fcf05c0f452f2c9a90198185996b7a972c1ebe59-1600x1089-jpg', // jumeirah-medical-center.jpg
  '1c12cf647c41436bd48d795411777437a35607ff-1600x1067-jpg', // la-petite-maison-restaurant.jpg
];

async function getAssetReferences(assetId) {
  // Find all documents referencing this asset
  const query = `*[references("image-${assetId}")]{ _id, _type, title }`;
  return await client.fetch(query);
}

async function deleteAsset(assetId) {
  const fullAssetId = `image-${assetId}`;

  console.log(`\nProcessing asset: ${assetId.substring(0, 12)}...`);

  // Check for references
  const refs = await getAssetReferences(assetId);

  if (refs.length > 0) {
    console.log(`  Found ${refs.length} references:`);
    refs.forEach(ref => {
      console.log(`    - ${ref._type}: ${ref.title || ref._id}`);
    });

    // Remove references first
    console.log('  Removing references...');
    for (const ref of refs) {
      try {
        // Patch document to remove the image reference
        await client
          .patch(ref._id)
          .unset(['mainImage', 'image', 'featuredImage', 'logo'])
          .commit();
        console.log(`    Cleared image from: ${ref._id}`);
      } catch (err) {
        console.log(`    Could not clear from ${ref._id}: ${err.message}`);
      }
    }
  }

  // Now delete the asset
  try {
    await client.delete(fullAssetId);
    console.log(`  DELETED: ${assetId.substring(0, 12)}...`);
    return true;
  } catch (err) {
    console.log(`  FAILED to delete: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('Sanity Asset Deletion Script');
  console.log('============================\n');
  console.log(`Deleting ${assetIdsToDelete.length} assets...`);

  let deleted = 0;
  let failed = 0;

  for (const assetId of assetIdsToDelete) {
    const success = await deleteAsset(assetId);
    if (success) deleted++;
    else failed++;
  }

  console.log('\n============================');
  console.log(`Completed: ${deleted} deleted, ${failed} failed`);
}

main().catch(console.error);
