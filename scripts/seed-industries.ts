/**
 * Script to seed industries with images in Sanity
 * Run with: npx tsx scripts/seed-industries.ts
 *
 * This script creates/updates industries with:
 * - Proper i18n fields (title, excerpt in en/ar)
 * - Images from Unsplash (downloaded and uploaded to Sanity)
 * - Correct slugs matching the mega menu expectations
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "b6q28exv",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

interface IndustryData {
  title: { en: string; ar: string };
  slug: string;
  excerpt: { en: string; ar: string };
  icon: string;
  imageUrl: string;
  order: number;
}

const industries: IndustryData[] = [
  {
    title: {
      en: "Luxury Hospitality",
      ar: "الضيافة الفاخرة",
    },
    slug: "luxury-hospitality",
    excerpt: {
      en: "Creating unforgettable experiences through world-class hotel interiors, restaurants, and hospitality venues.",
      ar: "إنشاء تجارب لا تُنسى من خلال التصميمات الداخلية للفنادق والمطاعم وأماكن الضيافة على مستوى عالمي.",
    },
    icon: "Hotel",
    imageUrl:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    order: 1,
  },
  {
    title: {
      en: "High-End Residential",
      ar: "السكني الفاخر",
    },
    slug: "high-end-residential",
    excerpt: {
      en: "Transforming luxury homes and villas into personalized sanctuaries of elegance and comfort.",
      ar: "تحويل المنازل والفلل الفاخرة إلى ملاذات شخصية من الأناقة والراحة.",
    },
    icon: "Home",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    order: 2,
  },
  {
    title: {
      en: "Commercial & Corporate",
      ar: "التجاري والمؤسسي",
    },
    slug: "commercial-corporate",
    excerpt: {
      en: "Designing inspiring workplaces and commercial spaces that drive productivity and brand identity.",
      ar: "تصميم أماكن عمل ومساحات تجارية ملهمة تعزز الإنتاجية وهوية العلامة التجارية.",
    },
    icon: "Building",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    order: 3,
  },
];

async function uploadImageFromUrl(
  imageUrl: string,
  filename: string
): Promise<string | null> {
  try {
    console.log(`  Downloading image from URL...`);
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
    return asset._id;
  } catch (error) {
    console.error(`  ✗ Error uploading image:`, error);
    return null;
  }
}

async function seedIndustries() {
  console.log("🏭 Starting to seed industries...\n");
  console.log("Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log("Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET);
  console.log("Token:", process.env.SANITY_API_TOKEN ? "✓ Found" : "✗ Missing");
  console.log("");

  if (!process.env.SANITY_API_TOKEN) {
    console.error("❌ SANITY_API_TOKEN not found in environment variables");
    process.exit(1);
  }

  for (const industry of industries) {
    console.log(`Processing: ${industry.title.en}`);

    // Check if industry already exists
    const existing = await client.fetch(
      `*[_type == "industry" && slug.current == $slug][0]`,
      { slug: industry.slug }
    );

    // Upload image from URL
    const imageAssetId = await uploadImageFromUrl(
      industry.imageUrl,
      `industry-${industry.slug}`
    );

    if (existing) {
      console.log(`  Industry already exists, updating with new image...`);

      // Update existing industry with i18n fields and new image
      await client
        .patch(existing._id)
        .set({
          title: industry.title,
          excerpt: industry.excerpt,
          icon: industry.icon,
          order: industry.order,
          featured: true,
          ...(imageAssetId && {
            mainImage: {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageAssetId,
              },
              alt: `${industry.title.en} - MIDC`,
            },
          }),
        })
        .commit();

      console.log(`  ✓ Updated: ${industry.title.en}\n`);
    } else {
      console.log(`  Creating new industry...`);

      // Create new industry with i18n fields
      const doc = {
        _type: "industry",
        title: industry.title,
        slug: {
          _type: "slug",
          current: industry.slug,
        },
        excerpt: industry.excerpt,
        icon: industry.icon,
        order: industry.order,
        featured: true,
        ...(imageAssetId && {
          mainImage: {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAssetId,
            },
            alt: `${industry.title.en} - MIDC`,
          },
        }),
      };

      await client.create(doc);
      console.log(`  ✓ Created: ${industry.title.en}\n`);
    }
  }

  console.log("✅ Industries seeding complete!");
  console.log("\nRefresh your website to see the new images in the mega menu.");
}

// Run the seed function
seedIndustries().catch(console.error);
