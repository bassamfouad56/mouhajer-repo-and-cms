// Script to list all Sanity media assets
// Run with: node scripts/list-sanity-assets.mjs

import { createClient } from "@sanity/client";

const SANITY_TOKEN =
  "skIdC1DpshvpNTdrONZgWZGG2zntEBr11zcgNTRsDnEdEeKrvArJ3qhigwib5kuvXoMZQKwzUmFPSnPCz31G9Xg5VkdpTYd1mn06nUkhRJPcKSTWMTCFnI0jghMNITc5X5VEk8QMX4tKR9qhE93eYLj21DeWzZZG4kHhSQLvDpjVe9Uf0EIu";

const client = createClient({
  projectId: "b6q28exv",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: SANITY_TOKEN,
  useCdn: false,
});

async function listAllAssets() {
  console.log("Fetching all image assets from Sanity...\n");

  // Fetch all image assets
  const query = `*[_type == "sanity.imageAsset"] | order(_createdAt desc) {
    _id,
    originalFilename,
    url,
    size,
    _createdAt
  }`;

  const assets = await client.fetch(query);

  console.log(`Found ${assets.length} image assets:\n`);
  console.log("=".repeat(80));

  assets.forEach((asset, index) => {
    const sizeKB = Math.round(asset.size / 1024);
    const assetId = asset._id.replace("image-", "");
    console.log(`[${index}] ${asset.originalFilename || "unnamed"}`);
    console.log(`    ID: ${assetId}`);
    console.log(`    Size: ${sizeKB} KB`);
    console.log(
      `    Created: ${new Date(asset._createdAt).toLocaleDateString()}`
    );
    console.log("");
  });

  console.log("=".repeat(80));
  console.log(`\nTotal: ${assets.length} assets`);

  // Return asset IDs for potential deletion
  return assets.map((a) => a._id.replace("image-", ""));
}

listAllAssets().catch(console.error);
