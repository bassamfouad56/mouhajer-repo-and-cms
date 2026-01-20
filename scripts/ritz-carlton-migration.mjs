import { createClient } from '@sanity/client';
import { readFileSync, readdirSync, mkdirSync, statSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

const SOURCE_DIR = '/Volumes/lacie 1/bassam/our projects page/18 ritz carlton villas';
const OUTPUT_DIR = join(process.cwd(), 'public/projects/ritz-carlton-abu-dhabi');
const MAX_DIMENSION = 2400;
const QUALITY = 85;

// ========================================
// STEP 1: Optimize Images
// ========================================
async function optimizeImages() {
  console.log('\n🖼️ Optimizing Ritz-Carlton images...\n');

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = readdirSync(SOURCE_DIR).filter(f =>
    f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg')
  );

  console.log(`Found ${files.length} images to optimize\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  const optimizedFiles = [];

  for (const file of files) {
    const inputPath = join(SOURCE_DIR, file);
    const outputPath = join(OUTPUT_DIR, file);

    try {
      const originalStat = statSync(inputPath);
      totalOriginal += originalStat.size;

      const metadata = await sharp(inputPath).metadata();
      const { width, height } = metadata;

      let newWidth = width;
      let newHeight = height;

      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          newWidth = MAX_DIMENSION;
          newHeight = Math.round((height / width) * MAX_DIMENSION);
        } else {
          newHeight = MAX_DIMENSION;
          newWidth = Math.round((width / height) * MAX_DIMENSION);
        }
      }

      await sharp(inputPath)
        .resize(newWidth, newHeight, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(outputPath);

      const optimizedStat = statSync(outputPath);
      totalOptimized += optimizedStat.size;
      optimizedFiles.push(file);

      console.log(`  ✅ ${file}`);
    } catch (error) {
      console.error(`  ❌ Error processing ${file}:`, error.message);
    }
  }

  const savedMB = ((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(1);
  const savingsPercent = ((1 - totalOptimized / totalOriginal) * 100).toFixed(0);

  console.log(`\n✨ Optimization complete!`);
  console.log(`  Original: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Optimized: ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Saved: ${savedMB} MB (${savingsPercent}%)`);

  return optimizedFiles;
}

// ========================================
// STEP 2: Upload Images
// ========================================
async function uploadImages(files) {
  console.log('\n📸 Uploading images to Sanity...\n');

  const uploadedImages = [];

  for (const file of files) {
    const filePath = join(OUTPUT_DIR, file);
    try {
      console.log(`  📤 Uploading: ${file}`);
      const imageBuffer = readFileSync(filePath);
      const asset = await client.assets.upload('image', imageBuffer, { filename: file });
      console.log(`  ✅ Uploaded: ${asset._id}`);
      uploadedImages.push({ asset, filename: file });
    } catch (error) {
      console.error(`  ❌ Failed to upload ${file}:`, error.message);
    }
  }

  return uploadedImages;
}

// ========================================
// STEP 3: Ensure Location Exists
// ========================================
async function ensureLocationExists() {
  console.log('\n🌍 Checking Abu Dhabi location...');

  const existing = await client.fetch('*[_type == "location" && slug.current == "abu-dhabi"][0]');

  if (existing) {
    console.log('  ✅ Abu Dhabi location already exists:', existing._id);
    return existing._id;
  }

  const location = await client.create({
    _type: 'location',
    _id: 'location-abu-dhabi',
    name: { en: 'Abu Dhabi, UAE', ar: 'أبوظبي، الإمارات' },
    slug: { current: 'abu-dhabi' },
    country: 'UAE',
  });

  console.log('  ✅ Created Abu Dhabi location:', location._id);
  return location._id;
}

// ========================================
// STEP 4: Create Project Document
// ========================================
async function createProject(uploadedImages, locationId) {
  console.log('\n📝 Creating Ritz-Carlton project...');

  const projectId = 'project-ritz-carlton-abu-dhabi';

  const existing = await client.fetch(`*[_id == "${projectId}"][0]`);
  if (existing) {
    console.log('  ⚠️ Project already exists, deleting first...');
    await client.delete(projectId);
  }

  const heroImage = uploadedImages[0];

  const gallery = uploadedImages.map((img, index) => ({
    _type: 'image',
    _key: `gallery-${index}`,
    asset: {
      _type: 'reference',
      _ref: img.asset._id,
    },
    alt: { en: `Ritz-Carlton Abu Dhabi Villa - ${img.filename}`, ar: `فيلا ريتز كارلتون أبوظبي` },
    category: 'interior',
  }));

  const project = {
    _type: 'project',
    _id: projectId,
    title: {
      en: 'The Ritz-Carlton Abu Dhabi, Grand Canal',
      ar: 'ريتز كارلتون أبوظبي، القناة الكبرى',
    },
    slug: { current: 'ritz-carlton-abu-dhabi-grand-canal' },
    excerpt: {
      en: 'Structural metamorphosis of 20 villas into 10 palatial 3-bedroom sanctuaries with private pools at The Ritz-Carlton Abu Dhabi, Grand Canal.',
      ar: 'تحويل هيكلي لـ 20 فيلا إلى 10 ملاذات فاخرة من 3 غرف نوم مع مسابح خاصة في ريتز كارلتون أبوظبي.',
    },
    featured: true,
    status: 'completed',

    sector: { _type: 'reference', _ref: 'industry-hospitality' },
    location: { _type: 'reference', _ref: locationId },

    client: {
      en: 'Abu Dhabi National Hotels (ADNH)',
      ar: 'فنادق أبوظبي الوطنية',
    },
    yearCompleted: 2023,
    duration: {
      startDate: '2021-12-01',
      endDate: '2023-10-31',
      months: 22,
    },
    budget: {
      amount: 50000000,
      currency: 'AED',
      range: '10m-50m',
    },
    units: {
      count: 10,
      label: { en: 'Villas', ar: 'فيلا' },
    },

    theChallenge: {
      en: `Structural Metamorphosis

The objective was architecturally ambitious: Merge 20 existing villas into 10 expansive, high-inventory luxury villas. Each new unit was to be transformed into a 3-bedroom sanctuary, complete with its own private swimming pool.

As this was a VIP project within the operating grounds of the Ritz-Carlton, the stakes were exceptionally high. We faced two major hurdles:

Structural Integrity: Merging two distinct buildings into one requires complex civil engineering to ensure load-bearing walls and MEP systems are unified seamlessly.

VIP Hospitality Standards: Because the hotel remained active and hosted VIP guests, construction had to be conducted with zero visual or noise pollution. Every logistical move was choreographed to maintain the Ritz-Carlton's world-class guest experience.`,
      ar: `التحول الهيكلي

كان الهدف طموحاً من الناحية المعمارية: دمج 20 فيلا موجودة في 10 فيلات فاخرة واسعة. كل وحدة جديدة سيتم تحويلها إلى ملاذ من 3 غرف نوم، مع مسبح خاص.`,
    },

    designApproach: {
      en: `Grandeur Redefined

Mouhajer International Design executed a comprehensive "Design and Build" strategy that prioritized privacy, scale, and the brand's signature Mediterranean-meets-Arabic aesthetic.

Space Transformation: By knocking down the dividing lines of 20 units, we created massive, open-plan living areas that lead directly to the private pool decks. The transition from bedroom to lounge was designed to emphasize the "Majlis" concept, a space for gathering and prestige.

The Private Oasis: Each villa was equipped with a custom-engineered private pool. This required intricate waterproofing, plumbing, and aesthetic tiling that mirrored the luxury of the Grand Canal surroundings.

Bespoke Interiors: We utilized premium materials—hand-selected marble, ornate gypsum, and bespoke joinery—to create an environment fitting for VIP guests. The lighting design was curated to highlight the architectural volume created by the merger.`,
      ar: `إعادة تعريف الفخامة

نفذت مهاجر للتصميم الدولي استراتيجية "التصميم والبناء" الشاملة التي أعطت الأولوية للخصوصية والحجم والجمالية المتوسطية العربية المميزة للعلامة التجارية.`,
    },

    scopeOfWork: [
      {
        _key: 'scope-1',
        title: { en: 'Civil & Structural', ar: 'الأعمال المدنية والهيكلية' },
        description: {
          en: 'Merging of structural frames, demolition of dividing walls, and foundation work for 10 private pools.',
          ar: 'دمج الإطارات الهيكلية وهدم الجدران الفاصلة وأعمال الأساسات لـ 10 مسابح خاصة.',
        },
      },
      {
        _key: 'scope-2',
        title: { en: 'Architecture & MEP', ar: 'الهندسة المعمارية والأنظمة' },
        description: {
          en: 'Full redesign of mechanical and electrical systems to support the new 3-bedroom layout and individual pool heating/filtration.',
          ar: 'إعادة تصميم كاملة للأنظمة الميكانيكية والكهربائية لدعم التصميم الجديد.',
        },
      },
      {
        _key: 'scope-3',
        title: { en: 'High-End Fit-Out', ar: 'التجهيز الفاخر' },
        description: {
          en: 'Turnkey interior execution including custom floor patterns, wall cladding, and high-ceiling treatments.',
          ar: 'تنفيذ داخلي متكامل يشمل أنماط الأرضيات المخصصة وتكسية الجدران ومعالجات الأسقف العالية.',
        },
      },
      {
        _key: 'scope-4',
        title: { en: 'External Works', ar: 'الأعمال الخارجية' },
        description: {
          en: 'Landscaping and deck construction for the new private pool areas.',
          ar: 'تنسيق الحدائق وبناء الأسطح لمناطق المسابح الخاصة الجديدة.',
        },
      },
    ],

    theOutcome: {
      en: `Completed in October 2023, the Rabdan Villas represent the pinnacle of our "Design and Build" division. We successfully doubled the luxury value of the property by creating larger, more exclusive inventory that did not exist before.

Despite the operational complexity of the Ritz-Carlton environment, the project was delivered with surgical precision, proving that Mouhajer Design can manage high-stakes structural changes without compromising the serenity of a 5-star resort.

20 units transformed into 10 palatial sanctuaries, delivered within the heart of an operating 5-star icon.`,
      ar: `اكتمل المشروع في أكتوبر 2023، وتمثل فيلات ربدان ذروة قسم "التصميم والبناء" لدينا. نجحنا في مضاعفة القيمة الفاخرة للعقار من خلال إنشاء مخزون أكبر وأكثر حصرية لم يكن موجوداً من قبل.`,
    },

    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroImage?.asset._id,
      },
      alt: { en: 'The Ritz-Carlton Abu Dhabi Grand Canal Villa', ar: 'فيلا ريتز كارلتون أبوظبي القناة الكبرى' },
    },
    gallery,

    services: [
      { _type: 'reference', _ref: 'service-interior-design', _key: 'svc-1' },
      { _type: 'reference', _ref: 'service-fit-out-execution', _key: 'svc-2' },
      { _type: 'reference', _ref: 'service-custom-joinery', _key: 'svc-3' },
    ],

    tags: [],
  };

  const created = await client.create(project);
  console.log('  ✅ Project created:', created._id);
  return created;
}

// ========================================
// MAIN
// ========================================
async function main() {
  console.log('🚀 Starting Ritz-Carlton Abu Dhabi Migration\n');
  console.log('=' .repeat(50));

  try {
    // Step 1: Optimize images
    const optimizedFiles = await optimizeImages();

    // Step 2: Upload images
    const uploadedImages = await uploadImages(optimizedFiles);
    console.log(`\n✅ Uploaded ${uploadedImages.length} images`);

    // Step 3: Ensure location exists
    const locationId = await ensureLocationExists();

    // Step 4: Create project
    await createProject(uploadedImages, locationId);

    console.log('\n' + '=' .repeat(50));
    console.log('✨ Migration complete!');
    console.log('   Project: The Ritz-Carlton Abu Dhabi, Grand Canal');
    console.log('   Images: ' + uploadedImages.length);
    console.log('   URL: /projects/ritz-carlton-abu-dhabi-grand-canal');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
