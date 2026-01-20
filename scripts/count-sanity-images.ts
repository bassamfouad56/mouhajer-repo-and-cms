import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-11-21",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function countImages() {
  try {
    console.log("🔍 Counting images in Sanity...\n");

    // Count all image assets
    const imageAssets = await client.fetch(`
      *[_type == "sanity.imageAsset"] {
        _id,
        originalFilename,
        size,
        url
      }
    `);

    console.log(`📊 Total images in Sanity: ${imageAssets.length}\n`);

    // Calculate total size
    const totalSize = imageAssets.reduce(
      (sum: number, img: any) => sum + (img.size || 0),
      0
    );
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    console.log(`💾 Total size: ${totalSizeMB} MB\n`);

    // Show some sample images
    console.log("📸 Sample images:");
    imageAssets.slice(0, 10).forEach((img: any, index: number) => {
      const sizeMB = ((img.size || 0) / (1024 * 1024)).toFixed(2);
      console.log(
        `  ${index + 1}. ${img.originalFilename || "Unnamed"} (${sizeMB} MB)`
      );
    });

    if (imageAssets.length > 10) {
      console.log(`  ... and ${imageAssets.length - 10} more`);
    }

    // Count images used in different document types
    console.log("\n📋 Images by document type:");

    const projectImages = await client.fetch(`
      count(*[_type == "project" && defined(images)])
    `);
    console.log(`  Projects with images: ${projectImages}`);

    const blogImages = await client.fetch(`
      count(*[_type == "blog" && defined(mainImage)])
    `);
    console.log(`  Blog posts with images: ${blogImages}`);

    const serviceImages = await client.fetch(`
      count(*[_type == "service" && defined(icon)])
    `);
    console.log(`  Services with images: ${serviceImages}`);
  } catch (error) {
    console.error("❌ Error counting images:", error);
    process.exit(1);
  }
}

countImages();
