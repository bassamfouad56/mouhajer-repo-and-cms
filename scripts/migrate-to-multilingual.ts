/**
 * Migration Script: Convert single-language Sanity fields to multilingual
 *
 * This script transforms existing content from:
 *   title: "Some text"
 * To:
 *   title: { en: "Some text", ar: "Some text" }
 *
 * The Arabic field is populated with English content as a placeholder
 * for manual translation later.
 *
 * Run with: npx tsx scripts/migrate-to-multilingual.ts
 */

import { createClient } from "@sanity/client";

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-11-21",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Document types to migrate
const DOCUMENT_TYPES = ["service", "industry", "post", "testimonial"] as const;

// Top-level fields to convert for each document type
const FIELD_MAPPINGS: Record<string, string[]> = {
  service: ["title", "excerpt"],
  industry: ["title", "excerpt"],
  post: ["title", "excerpt"],
  testimonial: ["role", "company", "quote"],
};

// Nested array fields with their translatable subfields
const NESTED_FIELD_MAPPINGS: Record<string, Record<string, string[]>> = {
  service: {
    features: ["title", "description"],
    process: ["title", "description"],
  },
  industry: {
    challenges: ["title", "description"],
    solutions: ["title", "description"],
  },
  post: {},
  testimonial: {},
};

// SEO fields (nested in seo object)
const SEO_FIELDS = ["metaTitle", "metaDescription"];

/**
 * Check if a field is already in multilingual format
 */
function isMultilingual(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    ("en" in value || "ar" in value)
  );
}

/**
 * Convert a single field to multilingual format
 */
function toMultilingual(value: unknown): { en: string; ar: string } | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    return { en: value, ar: value };
  }

  // Already multilingual
  if (isMultilingual(value)) {
    return value as { en: string; ar: string };
  }

  return null;
}

/**
 * Migrate a single document
 */
async function migrateDocument(
  doc: Record<string, unknown>,
  type: string
): Promise<boolean> {
  const patches: Record<string, unknown> = {};
  let hasChanges = false;

  // Migrate top-level fields
  const fields = FIELD_MAPPINGS[type] || [];
  for (const field of fields) {
    const value = doc[field];
    if (value && typeof value === "string") {
      patches[field] = toMultilingual(value);
      hasChanges = true;
    }
  }

  // Migrate nested array fields
  const nestedMappings = NESTED_FIELD_MAPPINGS[type] || {};
  for (const [arrayField, nestedFields] of Object.entries(nestedMappings)) {
    const array = doc[arrayField];
    if (Array.isArray(array) && array.length > 0) {
      let arrayHasChanges = false;
      const newArray = array.map((item: Record<string, unknown>) => {
        const newItem = { ...item };
        for (const nestedField of nestedFields) {
          const value = item[nestedField];
          if (value && typeof value === "string") {
            newItem[nestedField] = toMultilingual(value);
            arrayHasChanges = true;
          }
        }
        return newItem;
      });

      if (arrayHasChanges) {
        patches[arrayField] = newArray;
        hasChanges = true;
      }
    }
  }

  // Migrate SEO fields
  const seo = doc.seo as Record<string, unknown> | undefined;
  if (seo && typeof seo === "object") {
    let seoHasChanges = false;
    const newSeo = { ...seo };

    for (const seoField of SEO_FIELDS) {
      const value = seo[seoField];
      if (value && typeof value === "string") {
        newSeo[seoField] = toMultilingual(value);
        seoHasChanges = true;
      }
    }

    if (seoHasChanges) {
      patches.seo = newSeo;
      hasChanges = true;
    }
  }

  // Apply patches if there are changes
  if (hasChanges && Object.keys(patches).length > 0) {
    try {
      await client
        .patch(doc._id as string)
        .set(patches)
        .commit();
      return true;
    } catch (error) {
      console.error(`  Error migrating document ${doc._id}:`, error);
      return false;
    }
  }

  return false;
}

/**
 * Main migration function
 */
async function main() {
  console.log("=".repeat(60));
  console.log("Sanity Multilingual Migration Script");
  console.log("=".repeat(60));

  // Check for API token
  if (!process.env.SANITY_API_TOKEN) {
    console.error(
      "\nError: SANITY_API_TOKEN environment variable is required."
    );
    console.error("Set it with: export SANITY_API_TOKEN=your_token_here");
    process.exit(1);
  }

  console.log(
    "\nThis script will convert single-language fields to multilingual format."
  );
  console.log(
    "English content will be copied to Arabic fields as placeholders.\n"
  );

  const stats = {
    total: 0,
    migrated: 0,
    skipped: 0,
    errors: 0,
  };

  for (const type of DOCUMENT_TYPES) {
    console.log(`\n${"─".repeat(50)}`);
    console.log(`Processing: ${type}`);
    console.log(`${"─".repeat(50)}`);

    try {
      // Fetch all documents of this type
      const documents = await client.fetch<Record<string, unknown>[]>(
        `*[_type == "${type}"]`
      );

      console.log(`  Found ${documents.length} ${type} document(s)`);

      let typeMigrated = 0;
      let typeSkipped = 0;

      for (const doc of documents) {
        stats.total++;
        const title = doc.title;
        const displayTitle =
          typeof title === "string"
            ? title
            : (title as { en?: string })?.en || doc._id;

        // Check if already migrated (title is already an object)
        if (isMultilingual(title)) {
          console.log(`  ⏭  Skipping (already multilingual): ${displayTitle}`);
          typeSkipped++;
          stats.skipped++;
          continue;
        }

        const success = await migrateDocument(doc, type);
        if (success) {
          console.log(`  ✓  Migrated: ${displayTitle}`);
          typeMigrated++;
          stats.migrated++;
        } else {
          typeSkipped++;
          stats.skipped++;
        }
      }

      console.log(
        `\n  Summary: ${typeMigrated} migrated, ${typeSkipped} skipped`
      );
    } catch (error) {
      console.error(`  Error fetching ${type} documents:`, error);
      stats.errors++;
    }
  }

  // Print final summary
  console.log("\n" + "=".repeat(60));
  console.log("Migration Complete!");
  console.log("=".repeat(60));
  console.log(`\n  Total documents:  ${stats.total}`);
  console.log(`  Migrated:         ${stats.migrated}`);
  console.log(`  Skipped:          ${stats.skipped}`);
  console.log(`  Errors:           ${stats.errors}`);
  console.log("\nNext steps:");
  console.log("  1. Update Sanity schemas to use multilingual field types");
  console.log("  2. Update GROQ queries to extract locale-specific values");
  console.log("  3. Translate Arabic content in Sanity Studio");
}

// Run the migration
main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
