/**
 * Script to seed all mega menu content (services & industries) with images in Sanity
 * Run with: npx tsx scripts/seed-mega-menu-content.ts
 *
 * IMPORTANT: Set SANITY_API_TOKEN environment variable before running:
 * PowerShell: $env:SANITY_API_TOKEN="your-token-here"
 *
 * To get a token:
 * 1. Go to https://www.sanity.io/manage/project/b6q28exv/api
 * 2. Create a new token with "Editor" permissions
 * 3. Copy the token and set it as environment variable
 */

import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

// Sanity project configuration (from sanity.config.ts)
const projectId = "b6q28exv";
const dataset = "production";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Error: SANITY_API_TOKEN environment variable is not set");
  console.log("\nTo set the token:");
  console.log("  1. Go to https://www.sanity.io/manage/project/b6q28exv/api");
  console.log('  2. Create a new token with "Editor" permissions');
  console.log('  3. Run: $env:SANITY_API_TOKEN="your-token-here" (PowerShell)');
  console.log("  4. Then run this script again");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// ============================================
// SERVICES DATA
// ============================================
const services = [
  {
    title: "Civil Construction",
    slug: "civil-construction",
    excerpt:
      "From foundation to finish, we deliver structural excellence with precision engineering and world-class craftsmanship.",
    icon: "Building2",
    imagePath: "public/projects/turnkey-design-fitout/_MID2543-HDR.jpg",
    order: 1,
    features: [
      {
        title: "Structural Engineering",
        description:
          "Expert structural design and analysis for buildings of all sizes",
      },
      {
        title: "Foundation Work",
        description:
          "Comprehensive foundation solutions including piling and excavation",
      },
      {
        title: "Concrete Construction",
        description: "High-quality concrete work with precise finishing",
      },
    ],
  },
  {
    title: "Interior Architecture",
    slug: "interior-architecture",
    excerpt:
      "Transforming spaces into extraordinary experiences through innovative design and meticulous attention to detail.",
    icon: "Palette",
    imagePath: "public/projects/bedroom-interior/1.jpg",
    order: 2,
    features: [
      {
        title: "Space Planning",
        description: "Optimal layout design for functionality and flow",
      },
      {
        title: "Material Selection",
        description: "Curated materials that reflect luxury and durability",
      },
      {
        title: "Custom Millwork",
        description: "Bespoke joinery and built-in solutions",
      },
    ],
  },
  {
    title: "MEP Engineering",
    slug: "mep-engineering",
    excerpt:
      "Integrated mechanical, electrical, and plumbing systems designed for efficiency, sustainability, and performance.",
    icon: "Zap",
    imagePath: "public/projects/commercial-interior/18.jpg",
    order: 3,
    features: [
      {
        title: "HVAC Systems",
        description: "Climate control solutions for optimal comfort",
      },
      {
        title: "Electrical Design",
        description: "Smart electrical systems with energy efficiency",
      },
      {
        title: "Plumbing Solutions",
        description: "Modern plumbing systems with water conservation",
      },
    ],
  },
  {
    title: "Manufacturing & Joinery",
    slug: "manufacturing-joinery",
    excerpt:
      "Master craftsmen creating bespoke furniture and millwork that defines luxury living and working spaces.",
    icon: "Hammer",
    imagePath: "public/projects/turnkey-design-fitout/_MID2583-HDR.jpg",
    order: 4,
    features: [
      {
        title: "Custom Furniture",
        description: "Handcrafted furniture tailored to your specifications",
      },
      {
        title: "Kitchen Cabinetry",
        description: "Luxury kitchen solutions with premium finishes",
      },
      {
        title: "Wardrobes & Closets",
        description: "Bespoke storage solutions maximizing space",
      },
    ],
  },
  {
    title: "Fit-Out Execution",
    slug: "fit-out-execution",
    excerpt:
      "Seamless project execution from concept to completion, delivering turnkey solutions with uncompromising quality.",
    icon: "Wrench",
    imagePath: "public/projects/bathroom/_MID0061-HDR.jpg",
    order: 5,
    features: [
      {
        title: "Project Management",
        description: "End-to-end coordination and timeline management",
      },
      {
        title: "Quality Control",
        description: "Rigorous inspection at every stage",
      },
      {
        title: "Finishing Works",
        description: "Premium finishes that exceed expectations",
      },
    ],
  },
  {
    title: "Handover & Maintenance",
    slug: "handover-maintenance",
    excerpt:
      "Comprehensive handover process and ongoing maintenance support to protect your investment for years to come.",
    icon: "Shield",
    imagePath: "public/projects/commercial-interior/19.jpg",
    order: 6,
    features: [
      {
        title: "Defects Liability",
        description: "12-month warranty coverage for workmanship",
      },
      {
        title: "Preventive Maintenance",
        description: "Scheduled maintenance to extend asset life",
      },
      {
        title: "24/7 Support",
        description: "Emergency response for critical issues",
      },
    ],
  },
];

// ============================================
// INDUSTRIES DATA
// ============================================
const industries = [
  {
    title: "Luxury Hospitality",
    slug: "luxury-hospitality",
    excerpt:
      "Creating unforgettable experiences through world-class hotel interiors, restaurants, and hospitality venues.",
    icon: "Hotel",
    imagePath: "public/projects/commercial-interior/23.jpg",
    order: 1,
  },
  {
    title: "High-End Residential",
    slug: "high-end-residential",
    excerpt:
      "Transforming luxury homes and villas into personalized sanctuaries of elegance and comfort.",
    icon: "Home",
    imagePath: "public/projects/bedroom-interior/5.jpg",
    order: 2,
  },
  {
    title: "Commercial & Corporate",
    slug: "commercial-corporate",
    excerpt:
      "Designing inspiring workplaces and commercial spaces that drive productivity and brand identity.",
    icon: "Building",
    imagePath: "public/projects/commercial-interior/27.jpg",
    order: 3,
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

async function uploadImage(imagePath: string): Promise<string | null> {
  const fullPath = path.join(process.cwd(), imagePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`    Image not found: ${fullPath}`);
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(imagePath);

    const asset = await client.assets.upload("image", imageBuffer, {
      filename: fileName,
    });

    console.log(`    Uploaded: ${fileName}`);
    return asset._id;
  } catch (error) {
    console.error(`    Error uploading ${imagePath}:`, error);
    return null;
  }
}

async function upsertDocument(
  type: string,
  slug: string,
  data: Record<string, unknown>,
  imagePath: string
): Promise<void> {
  // Check if document exists
  const existing = await client.fetch(
    `*[_type == $type && slug.current == $slug][0]`,
    { type, slug }
  );

  // Upload image
  const imageAssetId = await uploadImage(imagePath);

  const imageData = imageAssetId
    ? {
        mainImage: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAssetId,
          },
          alt: `${data.title} - MIDC`,
        },
      }
    : {};

  if (existing) {
    // Update existing
    await client
      .patch(existing._id)
      .set({ ...data, ...imageData })
      .commit();
    console.log(`  Updated: ${data.title}`);
  } else {
    // Create new
    const doc = {
      _type: type,
      slug: { _type: "slug", current: slug },
      ...data,
      ...imageData,
    };
    await client.create(doc);
    console.log(`  Created: ${data.title}`);
  }
}

// ============================================
// MAIN SEED FUNCTIONS
// ============================================

async function seedServices() {
  console.log("\n========================================");
  console.log("SEEDING SERVICES");
  console.log("========================================\n");

  for (const service of services) {
    console.log(`Processing: ${service.title}`);
    await upsertDocument(
      "service",
      service.slug,
      {
        title: service.title,
        excerpt: service.excerpt,
        icon: service.icon,
        order: service.order,
        features: service.features,
        featured: service.order <= 3,
      },
      service.imagePath
    );
    console.log("");
  }
}

async function seedIndustries() {
  console.log("\n========================================");
  console.log("SEEDING INDUSTRIES");
  console.log("========================================\n");

  for (const industry of industries) {
    console.log(`Processing: ${industry.title}`);
    await upsertDocument(
      "industry",
      industry.slug,
      {
        title: industry.title,
        excerpt: industry.excerpt,
        icon: industry.icon,
        order: industry.order,
        featured: true,
      },
      industry.imagePath
    );
    console.log("");
  }
}

// ============================================
// RUN
// ============================================

async function main() {
  console.log("Starting mega menu content seeding...");
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);

  try {
    await seedServices();
    await seedIndustries();

    console.log("\n========================================");
    console.log("SEEDING COMPLETE!");
    console.log("========================================");
    console.log("\nMega menu should now display Sanity images.");
    console.log("Restart your dev server to see the changes.");
  } catch (error) {
    console.error("\nError during seeding:", error);
    process.exit(1);
  }
}

main();
