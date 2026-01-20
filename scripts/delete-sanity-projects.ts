import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@sanity/client";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-21",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function deleteAllProjects() {
  console.log("🗑️  Deleting all projects from Sanity...\n");

  try {
    // First, get all project documents
    const projects = await client.fetch(`*[_type == "project"]{ _id, title }`);
    console.log(`Found ${projects.length} projects to delete\n`);

    if (projects.length === 0) {
      console.log("No projects found.");
      return;
    }

    // Delete each project
    for (const project of projects) {
      try {
        await client.delete(project._id);
        console.log(
          `✓ Deleted: ${project.title?.en || project.title || project._id}`
        );
      } catch (error) {
        console.error(`✗ Failed to delete ${project._id}:`, error);
      }
    }

    console.log("\n✅ All projects deleted!");

    // Now delete orphaned assets (images)
    console.log("\n🗑️  Cleaning up orphaned assets...");

    // Get all assets that were uploaded
    const assets = await client.fetch(`*[_type == "sanity.imageAsset"]{ _id }`);
    console.log(`Found ${assets.length} image assets\n`);

    // Delete assets in batches
    const batchSize = 10;
    for (let i = 0; i < assets.length; i += batchSize) {
      const batch = assets.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (asset: { _id: string }) => {
          try {
            await client.delete(asset._id);
            process.stdout.write(".");
          } catch {
            // Asset might be in use, skip
          }
        })
      );
    }

    console.log("\n\n✅ Cleanup complete!");
  } catch (error) {
    console.error("Error:", error);
  }
}

deleteAllProjects();
