/**
 * Sanity Data Migration Script
 *
 * This script migrates data from the old Sanity project (b6q28exv)
 * to the new Sanity project (b6q28exv)
 *
 * Run with: npx tsx scripts/migrate-sanity-data.ts
 */

import { createClient } from "@sanity/client";

// Old Sanity project credentials
const oldClient = createClient({
  projectId: "b6q28exv",
  dataset: "production",
  apiVersion: "2024-11-21",
  token:
    "sknLI9zeZYMWy8WFthsEaS6oC2xjQIpqnXMCDftesR41VXIAscgOEZLU2b7fzFxb6nJEp8p3LR6pqcDtY0UH4bAB6OguiCLuZHyuZVXlmUiDyu8waCgyS1nn6eeSDxDjWRNOkk7vaHhajaYwpgMYHTzy81ke8Amanrtq0k16Pvvh5ZStg32d",
  useCdn: false,
});

// New Sanity project credentials
const newClient = createClient({
  projectId: "b6q28exv",
  dataset: "production",
  apiVersion: "2024-11-21",
  token:
    "skiIzl2j9bAUcxtrJGS2MFp1JccNsjBPTSwzGGuydjQpIkCqtx6tt6jDtKKsZaarRfFHApyFrWH64y0RYkFPm7pLOAErsezEPJ5tGAn48O3ruOLA9n6scz2zWZsF6JOPNwSAMWpsupJlNrTVMoJ2Jju6OCcVB5RAs2kFKXtDVOO2jZ04eTZJ",
  useCdn: false,
});

// Document types to migrate
const DOCUMENT_TYPES = [
  "project",
  "service",
  "industry",
  "post",
  "client",
  "testimonial",
];

interface MigrationStats {
  type: string;
  oldCount: number;
  migratedCount: number;
  failedCount: number;
  errors: string[];
}

async function migrateDocumentType(type: string): Promise<MigrationStats> {
  const stats: MigrationStats = {
    type,
    oldCount: 0,
    migratedCount: 0,
    failedCount: 0,
    errors: [],
  };

  try {
    console.log(`\n📦 Migrating ${type} documents...`);

    // Fetch all documents of this type from old project
    const query = `*[_type == "${type}"]`;
    const documents = await oldClient.fetch(query);
    stats.oldCount = documents.length;

    console.log(`   Found ${documents.length} ${type} documents`);

    if (documents.length === 0) {
      console.log(`   ⚠️  No ${type} documents found in old project`);
      return stats;
    }

    // Migrate each document to new project
    for (const doc of documents) {
      try {
        // Remove system fields that shouldn't be copied
        const { _rev, ...cleanDoc } = doc;

        // Create or update document in new project
        await newClient.createOrReplace(cleanDoc);
        stats.migratedCount++;
        console.log(`   ✅ Migrated: ${doc.title || doc.name || doc._id}`);
      } catch (error: any) {
        stats.failedCount++;
        const errorMsg = `Failed to migrate ${doc._id}: ${error.message}`;
        stats.errors.push(errorMsg);
        console.error(`   ❌ ${errorMsg}`);
      }
    }

    console.log(
      `   ✨ Completed: ${stats.migratedCount}/${stats.oldCount} successful`
    );
  } catch (error: any) {
    console.error(`   💥 Error fetching ${type} documents: ${error.message}`);
    stats.errors.push(`Fetch error: ${error.message}`);
  }

  return stats;
}

async function migrateAssets(): Promise<MigrationStats> {
  const stats: MigrationStats = {
    type: "assets",
    oldCount: 0,
    migratedCount: 0,
    failedCount: 0,
    errors: [],
  };

  try {
    console.log(`\n🖼️  Migrating image assets...`);

    // Fetch all image assets from old project
    const query = `*[_type == "sanity.imageAsset"]`;
    const assets = await oldClient.fetch(query);
    stats.oldCount = assets.length;

    console.log(`   Found ${assets.length} image assets`);

    if (assets.length === 0) {
      console.log(`   ⚠️  No assets found in old project`);
      return stats;
    }

    console.log(
      `   ℹ️  Note: Assets need to be manually uploaded to the new project`
    );
    console.log(`   ℹ️  or use Sanity CLI: sanity dataset export + import`);

    // Assets can't be easily migrated via API, need manual process
    stats.errors.push("Assets require manual migration via Sanity CLI");
  } catch (error: any) {
    console.error(`   💥 Error checking assets: ${error.message}`);
    stats.errors.push(`Asset check error: ${error.message}`);
  }

  return stats;
}

async function testConnections() {
  console.log("🔌 Testing Sanity connections...\n");

  try {
    console.log("   Testing OLD project (b6q28exv)...");
    const oldProjects = await oldClient.fetch(`*[_type == "project"][0...1]`);
    console.log(
      `   ✅ Old project connected (found ${oldProjects.length} sample documents)`
    );
  } catch (error: any) {
    console.error(`   ❌ Old project connection failed: ${error.message}`);
    throw new Error("Cannot connect to old Sanity project");
  }

  try {
    console.log("   Testing NEW project (b6q28exv)...");
    const newProjects = await newClient.fetch(`*[_type == "project"][0...1]`);
    console.log(
      `   ✅ New project connected (found ${newProjects.length} existing documents)`
    );
  } catch (error: any) {
    console.error(`   ❌ New project connection failed: ${error.message}`);
    throw new Error("Cannot connect to new Sanity project");
  }
}

async function main() {
  console.log("🚀 Starting Sanity Data Migration");
  console.log("=====================================\n");

  try {
    // Test connections first
    await testConnections();

    console.log("\n📊 Migration Summary");
    console.log("=====================================");

    const allStats: MigrationStats[] = [];

    // Migrate all document types
    for (const type of DOCUMENT_TYPES) {
      const stats = await migrateDocumentType(type);
      allStats.push(stats);
    }

    // Check assets (but can't migrate via API)
    const assetStats = await migrateAssets();
    allStats.push(assetStats);

    // Print final summary
    console.log("\n\n📈 FINAL SUMMARY");
    console.log("=====================================");

    let totalOld = 0;
    let totalMigrated = 0;
    let totalFailed = 0;

    allStats.forEach((stats) => {
      if (stats.type !== "assets") {
        totalOld += stats.oldCount;
        totalMigrated += stats.migratedCount;
        totalFailed += stats.failedCount;
      }

      console.log(`\n${stats.type.toUpperCase()}:`);
      console.log(`   Old documents: ${stats.oldCount}`);
      console.log(`   Migrated: ${stats.migratedCount}`);
      console.log(`   Failed: ${stats.failedCount}`);

      if (stats.errors.length > 0) {
        console.log(`   Errors:`);
        stats.errors.forEach((error) => console.log(`     - ${error}`));
      }
    });

    console.log("\n=====================================");
    console.log(`Total documents: ${totalOld}`);
    console.log(`✅ Successfully migrated: ${totalMigrated}`);
    console.log(`❌ Failed: ${totalFailed}`);
    console.log(
      `📊 Success rate: ${totalOld > 0 ? Math.round((totalMigrated / totalOld) * 100) : 0}%`
    );

    if (totalFailed === 0) {
      console.log("\n🎉 Migration completed successfully!");
    } else {
      console.log(
        "\n⚠️  Migration completed with some errors. Check the log above."
      );
    }

    console.log("\n📝 Next Steps:");
    console.log(
      "   1. Verify data in Sanity Studio: https://b6q28exv.sanity.studio"
    );
    console.log(
      "   2. If assets are missing, use: sanity dataset export + import"
    );
    console.log("   3. Restart your Next.js dev server to use new project");
  } catch (error: any) {
    console.error("\n💥 Migration failed:", error.message);
    process.exit(1);
  }
}

// Run migration
main();
