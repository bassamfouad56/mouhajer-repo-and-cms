import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-11-21",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface ImageAudit {
  totalSanityImages: number;
  totalPublicImages: number;
  sanityImagesByProject: number;
  unusedSanityImages: number;
  publicImagesList: string[];
  recommendations: string[];
}

async function auditImages(): Promise<ImageAudit> {
  console.log("🔍 Starting comprehensive image audit...\n");

  // Get all Sanity images
  const sanityImages = await client.fetch(`
    *[_type == "sanity.imageAsset"] {
      _id,
      originalFilename,
      url
    }
  `);

  // Get Sanity image references in projects
  const projectsWithImages = await client.fetch(`
    *[_type == "project" && defined(images)] {
      _id,
      title,
      "imageCount": count(images)
    }
  `);

  // Get all images from public folder
  const publicDir = path.join(process.cwd(), "public");
  const publicImages: string[] = [];

  function scanDirectory(dir: string) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          scanDirectory(filePath);
        } else if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file)) {
          publicImages.push(
            filePath.replace(publicDir, "").replace(/\\/g, "/")
          );
        }
      });
    } catch (error) {
      // Skip directories we can't access
    }
  }

  scanDirectory(publicDir);

  // Calculate unused Sanity images
  const allImageRefs = await client.fetch(`
    *[_type in ["project", "service", "blog", "award"]] {
      "images": [
        mainImage.asset._ref,
        icon.asset._ref,
        ...images[].asset._ref,
        ...gallery[].asset._ref,
        projectImage.asset._ref
      ]
    }
  `);

  const usedImageIds = new Set();
  allImageRefs.forEach((doc: any) => {
    doc.images?.forEach((ref: string) => {
      if (ref) usedImageIds.add(ref);
    });
  });

  const unusedCount = sanityImages.filter(
    (img: any) => !usedImageIds.has(img._id)
  ).length;

  // Generate recommendations
  const recommendations: string[] = [];

  if (publicImages.length > 10) {
    recommendations.push(
      `⚠️  Found ${publicImages.length} images in /public folder - consider moving to Sanity`
    );
  }

  if (unusedCount > 50) {
    recommendations.push(
      `💡 ${unusedCount} Sanity images are unused - can be used for placeholders`
    );
  }

  const projectsNeedingImages = await client.fetch(
    `count(*[_type == "project" && !defined(images)])`
  );

  if (projectsNeedingImages > 0) {
    recommendations.push(
      `📸 ${projectsNeedingImages} projects don't have images - assign from Sanity`
    );
  }

  const audit: ImageAudit = {
    totalSanityImages: sanityImages.length,
    totalPublicImages: publicImages.length,
    sanityImagesByProject: projectsWithImages.length,
    unusedSanityImages: unusedCount,
    publicImagesList: publicImages,
    recommendations,
  };

  return audit;
}

async function main() {
  try {
    const audit = await auditImages();

    console.log("📊 IMAGE AUDIT RESULTS\n");
    console.log("━".repeat(60));
    console.log(`\n📁 SANITY`);
    console.log(`   Total images: ${audit.totalSanityImages}`);
    console.log(`   Used in projects: ${audit.sanityImagesByProject}`);
    console.log(`   Unused images: ${audit.unusedSanityImages}`);

    console.log(`\n📁 PUBLIC FOLDER`);
    console.log(`   Total images: ${audit.totalPublicImages}`);

    console.log(`\n\n💡 RECOMMENDATIONS\n`);
    console.log("━".repeat(60));
    audit.recommendations.forEach((rec) => console.log(rec));

    console.log(`\n\n📋 PUBLIC FOLDER IMAGES\n`);
    console.log("━".repeat(60));
    audit.publicImagesList.slice(0, 20).forEach((img, i) => {
      console.log(`${i + 1}. ${img}`);
    });
    if (audit.publicImagesList.length > 20) {
      console.log(`... and ${audit.publicImagesList.length - 20} more`);
    }

    // Save report
    const reportPath = path.join(process.cwd(), "IMAGE_AUDIT_REPORT.json");
    fs.writeFileSync(reportPath, JSON.stringify(audit, null, 2));
    console.log(`\n✅ Full report saved to: IMAGE_AUDIT_REPORT.json\n`);
  } catch (error) {
    console.error("❌ Error during audit:", error);
    process.exit(1);
  }
}

main();
