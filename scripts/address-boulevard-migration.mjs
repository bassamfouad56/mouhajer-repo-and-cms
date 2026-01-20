import { createClient } from "@sanity/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const client = createClient({
  projectId: "b6q28exv",
  dataset: "mouhajer-db",
  apiVersion: "2024-11-21",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN environment variable is required");
  process.exit(1);
}

const PROJECT_DIR = join(process.cwd(), "public/projects/address-boulevard");

// ========================================
// STEP 1: Upload Images
// ========================================
async function uploadImage(imagePath, filename) {
  try {
    console.log(`  📤 Uploading: ${filename}`);
    const imageBuffer = readFileSync(imagePath);
    const asset = await client.assets.upload("image", imageBuffer, {
      filename,
    });
    console.log(`  ✅ Uploaded: ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`  ❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function uploadAllImages() {
  console.log("\n📸 Uploading gallery images...\n");

  const files = readdirSync(PROJECT_DIR).filter(
    (f) => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".jpeg")
  );

  console.log(`Found ${files.length} images to upload\n`);

  const uploadedImages = [];
  let count = 0;

  for (const file of files) {
    const filePath = join(PROJECT_DIR, file);
    const asset = await uploadImage(filePath, file);
    if (asset) {
      // Determine category from filename prefix
      let category = "interior";
      if (file.startsWith("penthouse-")) category = "royal-suite";
      else if (file.startsWith("vip-")) category = "vip-suite";
      else if (file.startsWith("lounge-")) category = "club-lounge";

      uploadedImages.push({
        asset,
        filename: file,
        category,
      });
    }
    count++;
    if (count % 20 === 0) {
      console.log(`\n  Progress: ${count}/${files.length} uploaded\n`);
    }
  }

  return uploadedImages;
}

// ========================================
// STEP 2: Ensure Location Exists
// ========================================
async function ensureLocationExists() {
  console.log("\n🌍 Checking Dubai location...");

  const existing = await client.fetch(
    '*[_type == "location" && slug.current == "dubai"][0]'
  );

  if (existing) {
    console.log("  ✅ Dubai location already exists:", existing._id);
    return existing._id;
  }

  // Create Dubai location
  const location = await client.create({
    _type: "location",
    _id: "location-dubai",
    name: { en: "Dubai, UAE", ar: "دبي، الإمارات" },
    slug: { current: "dubai" },
    country: "UAE",
  });

  console.log("  ✅ Created Dubai location:", location._id);
  return location._id;
}

// ========================================
// STEP 3: Create Award Tag
// ========================================
async function ensureAwardTagExists() {
  console.log("\n🏆 Checking award tag...");

  const tagId = "tag-award-best-hotel-suite-interior-dubai";
  const existing = await client.fetch(`*[_id == "${tagId}"][0]`);

  if (existing) {
    console.log("  ✅ Award tag already exists");
    return tagId;
  }

  await client.create({
    _type: "tag",
    _id: tagId,
    name: {
      en: "Best Hotel Suite Interior Dubai (VIP Suite)",
      ar: "أفضل تصميم داخلي لجناح فندقي دبي",
    },
    slug: { current: "best-hotel-suite-interior-dubai" },
  });

  console.log("  ✅ Created award tag");
  return tagId;
}

// ========================================
// STEP 4: Create Project Document
// ========================================
async function createProject(uploadedImages, locationId, awardTagId) {
  console.log("\n📝 Creating Address Boulevard project...");

  const projectId = "project-address-boulevard";

  // Check if project already exists
  const existing = await client.fetch(`*[_id == "${projectId}"][0]`);
  if (existing) {
    console.log("  ⚠️ Project already exists, deleting first...");
    await client.delete(projectId);
  }

  // Select best image for hero (first VIP suite image)
  const heroImage =
    uploadedImages.find((img) =>
      img.filename.startsWith("vip-BLVDvipsuit01")
    ) ||
    uploadedImages.find((img) =>
      img.filename.startsWith("penthouse-penthouse01")
    ) ||
    uploadedImages[0];

  // Create gallery array
  const gallery = uploadedImages.map((img, index) => ({
    _type: "image",
    _key: `gallery-${index}`,
    asset: {
      _type: "reference",
      _ref: img.asset._id,
    },
    alt: {
      en: `Address Boulevard - ${img.category}`,
      ar: `أدريس بوليفارد - ${img.category}`,
    },
    category: img.category,
    caption: { en: "", ar: "" },
  }));

  const project = {
    _type: "project",
    _id: projectId,
    title: {
      en: "Address Boulevard (VIP)",
      ar: "أدريس بوليفارد (الأجنحة الملكية وكبار الشخصيات)",
    },
    slug: { current: "address-boulevard" },
    excerpt: {
      en: "Design & Build of 15 VIP Suites and 4 Royal Suites at Address Boulevard, Downtown Dubai. A showcase of surgical precision in a live hotel environment, delivering bespoke luxury without disturbing a single guest.",
      ar: "تصميم وبناء 15 جناحاً لكبار الشخصيات و4 أجنحة ملكية في أدريس بوليفارد، وسط دبي. عرض للدقة الجراحية في بيئة فندقية حية.",
    },
    featured: true,
    status: "completed",

    // Classification
    sector: { _type: "reference", _ref: "industry-hospitality" },
    location: { _type: "reference", _ref: locationId },

    // Project Details
    client: {
      en: "ADNH (Abu Dhabi National Hotels)",
      ar: "فنادق أبوظبي الوطنية",
    },
    yearCompleted: 2023,
    duration: {
      startDate: "2022-08-01",
      endDate: "2023-03-31",
      months: 8,
    },
    budget: {
      amount: 25000000,
      currency: "AED",
      range: "10m-50m",
    },
    units: {
      count: 19,
      label: { en: "Suites", ar: "جناح" },
    },

    // Content
    theChallenge: {
      en: `The Invisible Construction Site

Operating within Address Boulevard—a fully operational 5-star landmark in the heart of Downtown Dubai—presented a unique paradox: How do you execute a full-scale Design & Build project involving significant civil works, custom joinery, and high-end finishes while the hotel continues to function around the clock, hosting VIP guests, corporate events, and international clientele?

The scope was demanding: 15 VIP Suites across a dedicated floor and 4 Royal Suites on the top floor, all requiring complete renovation. We couldn't afford a single noise complaint, a single dusty corridor, or a single delayed breakfast. Our task was not just to build, but to vanish.`,
      ar: `موقع البناء غير المرئي

العمل داخل أدريس بوليفارد - معلم 5 نجوم يعمل بكامل طاقته في قلب وسط دبي - قدم مفارقة فريدة: كيف تنفذ مشروع تصميم وبناء كامل يتضمن أعمالاً مدنية كبيرة ونجارة مخصصة وتشطيبات راقية بينما يستمر الفندق في العمل على مدار الساعة؟`,
    },

    designApproach: {
      en: `Silent Execution: The Mouhajer Protocol

We developed what we internally call the "Silent Execution Protocol," a methodology now embedded in our DNA for live-environment hospitality projects.

Nighttime Civil Operations: All structural and MEP interventions—core drilling, duct modifications, heavy lifting—were scheduled exclusively during late-night windows (1 AM–5 AM), coordinated daily with hotel security and operations.

Zero-Contamination Material Handling: Specialized logistics ensured that all materials arrived in sealed, hotel-compliant containers. Debris was removed in discreet, covered loads via service corridors. Not a single dust particle was permitted in guest-facing areas.

Floor-by-Floor Isolation: We constructed temporary partitions with acoustic insulation to seal active work zones. Each floor was treated as a micro-construction site, fully isolated acoustically and visually from the operating hotel.

Bespoke Joinery & Finishes: The suites demanded handcrafted detail—custom headboards, intricate paneling, gold-leaf accents, and unique stone inlays. Our in-house joinery facility prefabricated the majority of components off-site, minimizing on-site noise and installation time.`,
      ar: `التنفيذ الصامت: بروتوكول مهاجر

طورنا ما نسميه داخلياً "بروتوكول التنفيذ الصامت"، وهو منهجية أصبحت الآن جزءاً من حمضنا النووي لمشاريع الضيافة في البيئات الحية.`,
    },

    scopeOfWork: [
      {
        _key: "scope-1",
        title: { en: "VIP Suite Renovation", ar: "تجديد أجنحة كبار الشخصيات" },
        description: {
          en: "Complete design and build of 15 VIP Suites with custom finishes, bespoke joinery, and premium materials.",
          ar: "تصميم وبناء كامل لـ 15 جناحاً لكبار الشخصيات مع تشطيبات مخصصة ونجارة فاخرة.",
        },
      },
      {
        _key: "scope-2",
        title: { en: "Royal Suite Renovation", ar: "تجديد الأجنحة الملكية" },
        description: {
          en: "Full renovation of 4 Royal Suites on the top floor with gold-leaf accents, unique stone inlays, and handcrafted details.",
          ar: "تجديد كامل لـ 4 أجنحة ملكية في الطابق العلوي مع لمسات ذهبية وتفاصيل يدوية.",
        },
      },
      {
        _key: "scope-3",
        title: { en: "Custom Joinery", ar: "النجارة المخصصة" },
        description: {
          en: "Handcrafted headboards, intricate paneling, and bespoke furniture pieces manufactured in-house.",
          ar: "ألواح رأسية مصنوعة يدوياً وتكسية معقدة وقطع أثاث مخصصة.",
        },
      },
      {
        _key: "scope-4",
        title: { en: "MEP Upgrades", ar: "ترقيات الأنظمة" },
        description: {
          en: "Full upgrade of electrical, mechanical, and plumbing systems during nighttime operations.",
          ar: "ترقية كاملة للأنظمة الكهربائية والميكانيكية خلال العمليات الليلية.",
        },
      },
      {
        _key: "scope-5",
        title: { en: "Club Lounge Renovation", ar: "تجديد صالة النادي" },
        description: {
          en: "Exclusive club lounge renovation with premium finishes and bespoke design elements.",
          ar: "تجديد صالة النادي الحصرية مع تشطيبات فاخرة وعناصر تصميم مخصصة.",
        },
      },
    ],

    theOutcome: {
      en: `Delivered in March 2023, the project received widespread acclaim from ADNH and the Address Boulevard management. Our VIP Suite design was awarded "Best Hotel Suite Interior Dubai," validating our commitment to craftsmanship under constraint.

But perhaps the truest measure of our success was this: not one guest complaint was filed during the entire construction period. The suites opened to rave reviews, and the Royal Suites have since become some of the most requested accommodations in Downtown Dubai.

19 Suites delivered in a live 5-star hotel with zero guest disruption.`,
      ar: `تم التسليم في مارس 2023، وحصل المشروع على إشادة واسعة من فنادق أبوظبي الوطنية وإدارة أدريس بوليفارد. حصل تصميم جناح كبار الشخصيات على جائزة "أفضل تصميم داخلي لجناح فندقي دبي".

ولكن ربما كان المقياس الحقيقي لنجاحنا هو: لم تُقدم شكوى ضيف واحدة خلال فترة البناء بأكملها. افتتحت الأجنحة بمراجعات رائعة.`,
    },

    // Media
    mainImage: {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: heroImage?.asset._id,
      },
      alt: {
        en: "Address Boulevard VIP Suite Dubai",
        ar: "جناح كبار الشخصيات أدريس بوليفارد دبي",
      },
    },
    gallery,

    // Services
    services: [
      { _type: "reference", _ref: "service-interior-design", _key: "svc-1" },
      { _type: "reference", _ref: "service-fit-out-execution", _key: "svc-2" },
      { _type: "reference", _ref: "service-custom-joinery", _key: "svc-3" },
    ],

    // Tags
    tags: [{ _type: "reference", _ref: awardTagId, _key: "tag-1" }],
  };

  const created = await client.create(project);
  console.log("  ✅ Project created:", created._id);
  return created;
}

// ========================================
// MAIN
// ========================================
async function main() {
  console.log("🚀 Starting Address Boulevard Migration\n");
  console.log("=".repeat(50));

  try {
    // Step 1: Upload images
    const uploadedImages = await uploadAllImages();
    console.log(`\n✅ Uploaded ${uploadedImages.length} images`);

    // Step 2: Ensure location exists
    const locationId = await ensureLocationExists();

    // Step 3: Ensure award tag exists
    const awardTagId = await ensureAwardTagExists();

    // Step 4: Create project
    await createProject(uploadedImages, locationId, awardTagId);

    console.log("\n" + "=".repeat(50));
    console.log("✨ Migration complete!");
    console.log("   Project: Address Boulevard (VIP & Royal Suites)");
    console.log("   Images: " + uploadedImages.length);
    console.log("   URL: /projects/address-boulevard");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
