/**
 * Script to update post categories in Sanity to use URL-friendly slugs
 * and add images to posts
 */

import { createClient } from "@sanity/client";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-11-21",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Category mapping: old category -> new URL-friendly slug
const CATEGORY_MAPPING = {
  "Cost Management": "project-stories",
  "Project Management": "project-stories",
  Hospitality: "project-stories",
  "Interior Design": "design-trends",
  Construction: "engineering",
  Architecture: "design-trends",
  Design: "design-trends",
  Engineering: "engineering",
  Materials: "materials-craft",
  Craft: "materials-craft",
};

// Images for each category
const CATEGORY_IMAGES = {
  "design-trends":
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  "project-stories":
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "materials-craft":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  engineering:
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
  "founders-insights":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  "behind-the-scenes":
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
};

async function uploadImageFromUrl(imageUrl, filename) {
  try {
    console.log(`  Downloading: ${filename}...`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`  Uploading to Sanity: ${filename}...`);
    const asset = await client.assets.upload("image", buffer, {
      filename: `${filename}.jpg`,
      contentType: "image/jpeg",
    });

    console.log(`  ✓ Uploaded: ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`  ✗ Error uploading ${filename}:`, error.message);
    return null;
  }
}

async function updatePosts() {
  console.log("\n📝 Updating Post Categories...\n");

  const posts = await client.fetch(
    `*[_type == "post"] { _id, title, slug, category, mainImage }`
  );
  console.log(`Found ${posts.length} posts\n`);

  for (const post of posts) {
    const oldCategory = post.category;
    const title =
      typeof post.title === "string" ? post.title : post.title?.en || "Unknown";
    const slug = post.slug?.current || post._id;

    // Check if category needs mapping
    const newCategory = CATEGORY_MAPPING[oldCategory] || oldCategory;
    const needsCategoryUpdate = oldCategory && newCategory !== oldCategory;
    const needsImage = !post.mainImage?.asset;

    if (!needsCategoryUpdate && !needsImage) {
      console.log(`  ⏭ "${title}" - no updates needed`);
      continue;
    }

    console.log(`\n  Processing: "${title}"`);
    console.log(`    Current category: ${oldCategory || "none"}`);

    const updates = {};

    // Update category if needed
    if (needsCategoryUpdate) {
      console.log(`    New category: ${newCategory}`);
      updates.category = newCategory;
    }

    // Add image if needed
    if (needsImage) {
      const imageUrl =
        CATEGORY_IMAGES[newCategory] || CATEGORY_IMAGES["project-stories"];
      const asset = await uploadImageFromUrl(imageUrl, `post-${slug}`);
      if (asset) {
        updates.mainImage = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        };
      }
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      try {
        await client.patch(post._id).set(updates).commit();
        console.log(`    ✓ Updated successfully`);
      } catch (error) {
        console.error(`    ✗ Error updating:`, error.message);
      }
    }
  }
}

async function main() {
  console.log("🚀 Starting Post Category Update Script\n");
  console.log("Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log("Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET);
  console.log("Token:", process.env.SANITY_API_TOKEN ? "✓ Found" : "✗ Missing");

  if (!process.env.SANITY_API_TOKEN) {
    console.error("\n❌ SANITY_API_TOKEN not found in environment variables");
    process.exit(1);
  }

  try {
    await updatePosts();

    console.log("\n✅ Post category update complete!");
    console.log(
      "\nNote: Posts have been updated with URL-friendly category slugs."
    );
    console.log(
      "The journal URLs will now use slugs like /journal/design-trends/post-slug"
    );
  } catch (error) {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  }
}

main();
