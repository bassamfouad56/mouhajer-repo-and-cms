/**
 * Sanity Data Seeding Script
 *
 * This script seeds your new Sanity project with sample data
 * Run with: npx tsx scripts/seed-sanity-data.ts
 */

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "b6q28exv",
  dataset: "production",
  apiVersion: "2024-11-21",
  token:
    "skiIzl2j9bAUcxtrJGS2MFp1JccNsjBPTSwzGGuydjQpIkCqtx6tt6jDtKKsZaarRfFHApyFrWH64y0RYkFPm7pLOAErsezEPJ5tGAn48O3ruOLA9n6scz2zWZsF6JOPNwSAMWpsupJlNrTVMoJ2Jju6OCcVB5RAs2kFKXtDVOO2jZ04eTZJ",
  useCdn: false,
});

// Sample Services Data
const services = [
  {
    _type: "service",
    _id: "service-1",
    title: "Interior Architecture",
    slug: { _type: "slug", current: "interior-architecture" },
    excerpt:
      "From concept sketches to approved construction drawings. Our in-house architects ensure your vision translates flawlessly into reality.",
    order: 1,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "service",
    _id: "service-2",
    title: "MEP Engineering",
    slug: { _type: "slug", current: "mep-engineering" },
    excerpt:
      "Mechanical, Electrical, and Plumbing systems designed and installed by certified engineers. From HVAC to lighting to water systems.",
    order: 2,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "service",
    _id: "service-3",
    title: "Manufacturing & Joinery",
    slug: { _type: "slug", current: "manufacturing-joinery" },
    excerpt:
      "Our own 15,000 sqft factory manufactures custom furniture, doors, wardrobes, and kitchens. No outsourcing. Full quality control.",
    order: 3,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "service",
    _id: "service-4",
    title: "Fit-Out Execution",
    slug: { _type: "slug", current: "fit-out-execution" },
    excerpt:
      "From civil works to final finishes. Our project managers coordinate everything on-site. One team, one timeline, zero confusion.",
    order: 4,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "service",
    _id: "service-5",
    title: "Handover & Maintenance",
    slug: { _type: "slug", current: "handover-maintenance" },
    excerpt:
      "We protect your investment with warranty management, 24/7 defect response, and optional long-term maintenance contracts.",
    order: 5,
    featured: true,
    __i18n_lang: "en",
  },
];

// Sample Industries Data
const industries = [
  {
    _type: "industry",
    _id: "industry-1",
    title: "Hospitality",
    slug: { _type: "slug", current: "hospitality" },
    excerpt:
      "From boutique hotels to 5-star resorts. We understand operational flow, guest experience, and live environment renovations.",
    order: 1,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "industry",
    _id: "industry-2",
    title: "Residential",
    slug: { _type: "slug", current: "residential" },
    excerpt:
      "Luxury villas, penthouses, and townhouses. From empty land to fully furnished dream homes.",
    order: 2,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "industry",
    _id: "industry-3",
    title: "Commercial",
    slug: { _type: "slug", current: "commercial" },
    excerpt:
      "Corporate offices, retail flagships, and mixed-use developments. Spaces that drive business performance.",
    order: 3,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "industry",
    _id: "industry-4",
    title: "Healthcare",
    slug: { _type: "slug", current: "healthcare" },
    excerpt:
      "Hospitals, clinics, and medical centers. Compliance-ready, infection-controlled, patient-focused design.",
    order: 4,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "industry",
    _id: "industry-5",
    title: "Education",
    slug: { _type: "slug", current: "education" },
    excerpt:
      "Schools, universities, and training centers. Learning environments that inspire and perform.",
    order: 5,
    featured: true,
    __i18n_lang: "en",
  },
  {
    _type: "industry",
    _id: "industry-6",
    title: "Retail",
    slug: { _type: "slug", current: "retail" },
    excerpt:
      "Shopping malls, flagship stores, and F&B outlets. Brand experiences that convert visitors to customers.",
    order: 6,
    featured: true,
    __i18n_lang: "en",
  },
];

// Sample Projects Data
const projects = [
  {
    _type: "project",
    _id: "project-1",
    title: "Sheraton Abu Dhabi Hotel & Resort",
    slug: { _type: "slug", current: "sheraton-abu-dhabi" },
    excerpt:
      "Complete renovation of 272 guest rooms and public areas while hotel remained operational. Zero guest complaints.",
    category: "Hospitality",
    location: "Abu Dhabi, UAE",
    year: "2023",
    featured: true,
    publishedAt: new Date("2023-12-01").toISOString(),
    __i18n_lang: "en",
  },
  {
    _type: "project",
    _id: "project-2",
    title: "Palm Jumeirah Villa",
    slug: { _type: "slug", current: "palm-jumeirah-villa" },
    excerpt:
      "From empty plot to fully furnished luxury villa. 18-month build, 8-bedroom masterpiece with private beach access.",
    category: "Residential",
    location: "Dubai, UAE",
    year: "2024",
    featured: true,
    publishedAt: new Date("2024-03-15").toISOString(),
    __i18n_lang: "en",
  },
  {
    _type: "project",
    _id: "project-3",
    title: "DIFC Corporate Headquarters",
    slug: { _type: "slug", current: "difc-headquarters" },
    excerpt:
      "Grade-A office space for international bank. Full MEP, custom furniture, and 2-floor interconnecting staircase.",
    category: "Commercial",
    location: "Dubai, UAE",
    year: "2023",
    featured: true,
    publishedAt: new Date("2023-09-20").toISOString(),
    __i18n_lang: "en",
  },
  {
    _type: "project",
    _id: "project-4",
    title: "American Hospital Dubai",
    slug: { _type: "slug", current: "american-hospital-dubai" },
    excerpt:
      "Three new operating theaters with full infection control, medical gas systems, and DHA-approved documentation.",
    category: "Healthcare",
    location: "Dubai, UAE",
    year: "2024",
    featured: true,
    publishedAt: new Date("2024-01-10").toISOString(),
    __i18n_lang: "en",
  },
  {
    _type: "project",
    _id: "project-5",
    title: "The Dubai Mall Flagship Store",
    slug: { _type: "slug", current: "dubai-mall-flagship" },
    excerpt:
      "Luxury retail brand flagship. Custom millwork, theatrical lighting, and 48-hour installation during mall closure.",
    category: "Retail",
    location: "Dubai, UAE",
    year: "2023",
    featured: true,
    publishedAt: new Date("2023-11-05").toISOString(),
    __i18n_lang: "en",
  },
  {
    _type: "project",
    _id: "project-6",
    title: "Dubai British School Expansion",
    slug: { _type: "slug", current: "dubai-british-school" },
    excerpt:
      "New science labs and sports facility. KHDA-approved, acoustic-treated, and completed during summer break.",
    category: "Education",
    location: "Dubai, UAE",
    year: "2024",
    featured: true,
    publishedAt: new Date("2024-06-01").toISOString(),
    __i18n_lang: "en",
  },
];

// Sample Blog Posts
const posts = [
  {
    _type: "post",
    _id: "post-1",
    title: 'Why "No Middleman" Saves You 20-30% on Construction Costs',
    slug: { _type: "slug", current: "no-middleman-construction-costs" },
    excerpt:
      "Design agencies, project managers, and general contractors all add markup. We eliminate 3 layers of fees by doing everything in-house.",
    category: "Cost Management",
    readTime: 8,
    featured: true,
    publishedAt: new Date("2024-10-15").toISOString(),
    __i18n_lang: "en",
  },
  {
    _type: "post",
    _id: "post-2",
    title: "The 5 Construction Documents That Saved Our Client $2M",
    slug: { _type: "slug", current: "construction-documents-value" },
    excerpt:
      "Proper shop drawings, MEP coordination, and as-built documentation prevent costly rework. Real case study from a hotel project.",
    category: "Project Management",
    readTime: 12,
    featured: true,
    publishedAt: new Date("2024-09-20").toISOString(),
    __i18n_lang: "en",
  },
  {
    _type: "post",
    _id: "post-3",
    title: "How We Renovated 272 Hotel Rooms Without Closing",
    slug: { _type: "slug", current: "hotel-renovation-live-environment" },
    excerpt:
      "Behind the scenes of the Sheraton Abu Dhabi project. Phasing strategy, noise control, and guest experience management.",
    category: "Hospitality",
    readTime: 15,
    featured: true,
    publishedAt: new Date("2024-08-10").toISOString(),
    __i18n_lang: "en",
  },
];

async function seedData() {
  console.log("🌱 Starting Sanity Data Seeding");
  console.log("=====================================\n");

  try {
    // Test connection
    console.log("🔌 Testing connection...");
    await client.fetch('*[_type == "project"][0...1]');
    console.log("   ✅ Connected to Sanity\n");

    // Seed Services
    console.log("📦 Seeding services...");
    for (const service of services) {
      await client.createOrReplace(service);
      console.log(`   ✅ Created: ${service.title}`);
    }

    // Seed Industries
    console.log("\n📦 Seeding industries...");
    for (const industry of industries) {
      await client.createOrReplace(industry);
      console.log(`   ✅ Created: ${industry.title}`);
    }

    // Seed Projects
    console.log("\n📦 Seeding projects...");
    for (const project of projects) {
      await client.createOrReplace(project);
      console.log(`   ✅ Created: ${project.title}`);
    }

    // Seed Blog Posts
    console.log("\n📦 Seeding blog posts...");
    for (const post of posts) {
      await client.createOrReplace(post);
      console.log(`   ✅ Created: ${post.title}`);
    }

    console.log("\n\n🎉 Seeding Complete!");
    console.log("=====================================");
    console.log(`✅ Services: ${services.length}`);
    console.log(`✅ Industries: ${industries.length}`);
    console.log(`✅ Projects: ${projects.length}`);
    console.log(`✅ Blog Posts: ${posts.length}`);

    console.log("\n📝 Next Steps:");
    console.log("   1. Open Sanity Studio: https://b6q28exv.sanity.studio");
    console.log("   2. Add images to your documents");
    console.log("   3. Customize the content as needed");
    console.log("   4. Restart your Next.js dev server");
  } catch (error: any) {
    console.error("\n💥 Seeding failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

seedData();
