import { createClient } from '@sanity/client';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

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

const PROJECT_DIR = join(process.cwd(), 'public/projects/sofitel-jbr');

// ========================================
// STEP 1: Upload Images
// ========================================
async function uploadImage(imagePath, filename) {
  try {
    console.log(`  📤 Uploading: ${filename}`);
    const imageBuffer = readFileSync(imagePath);
    const asset = await client.assets.upload('image', imageBuffer, { filename });
    console.log(`  ✅ Uploaded: ${asset._id}`);
    return asset;
  } catch (error) {
    console.error(`  ❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function uploadAllImages() {
  console.log('\n📸 Uploading gallery images...\n');

  const files = readdirSync(PROJECT_DIR).filter(f =>
    f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg')
  );

  console.log(`Found ${files.length} images to upload\n`);

  const uploadedImages = [];
  let count = 0;

  for (const file of files) {
    const filePath = join(PROJECT_DIR, file);
    const asset = await uploadImage(filePath, file);
    if (asset) {
      uploadedImages.push({
        asset,
        filename: file,
        category: 'interior', // Default category
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
  console.log('\n🌍 Checking Dubai location...');

  const existing = await client.fetch('*[_type == "location" && slug.current == "dubai"][0]');

  if (existing) {
    console.log('  ✅ Dubai location already exists:', existing._id);
    return existing._id;
  }

  // Create Dubai location
  const location = await client.create({
    _type: 'location',
    _id: 'location-dubai',
    name: { en: 'Dubai, UAE', ar: 'دبي، الإمارات' },
    slug: { current: 'dubai' },
    country: 'UAE',
  });

  console.log('  ✅ Created Dubai location:', location._id);
  return location._id;
}

// ========================================
// STEP 3: Create Award Tag
// ========================================
async function ensureAwardTagExists() {
  console.log('\n🏆 Checking award tag...');

  const tagId = 'tag-award-best-luxury-hotel-interior-dubai';
  const existing = await client.fetch(`*[_id == "${tagId}"][0]`);

  if (existing) {
    console.log('  ✅ Award tag already exists');
    return tagId;
  }

  await client.create({
    _type: 'tag',
    _id: tagId,
    name: { en: 'Best Luxury Hotel Interior Design Dubai', ar: 'أفضل تصميم داخلي لفندق فاخر دبي' },
    slug: { current: 'best-luxury-hotel-interior-dubai' },
  });

  console.log('  ✅ Created award tag');
  return tagId;
}

// ========================================
// STEP 4: Create Project Document
// ========================================
async function createProject(uploadedImages, locationId, awardTagId) {
  console.log('\n📝 Creating Sofitel JBR project...');

  const projectId = 'project-sofitel-jbr';

  // Check if project already exists
  const existing = await client.fetch(`*[_id == "${projectId}"][0]`);
  if (existing) {
    console.log('  ⚠️ Project already exists, deleting first...');
    await client.delete(projectId);
  }

  // Select best image for hero (first numbered image or first DSC)
  const heroImage = uploadedImages.find(img => img.filename.startsWith('1.')) ||
    uploadedImages.find(img => img.filename.startsWith('DSC3478')) ||
    uploadedImages[0];

  // Create gallery array
  const gallery = uploadedImages.map((img, index) => ({
    _type: 'image',
    _key: `gallery-${index}`,
    asset: {
      _type: 'reference',
      _ref: img.asset._id,
    },
    alt: { en: `Sofitel JBR - ${img.filename}`, ar: `سوفيتيل جي بي آر - ${img.filename}` },
    category: 'interior',
    caption: { en: '', ar: '' },
  }));

  const project = {
    _type: 'project',
    _id: projectId,
    title: {
      en: 'Sofitel JBR (Jumeirah Beach Residence)',
      ar: 'سوفيتيل جي بي آر (جميرا بيتش ريزيدنس)',
    },
    slug: { current: 'sofitel-jbr' },
    excerpt: {
      en: 'Soft Refurbishment of a 444-room luxury hotel featuring 27 floors of guest rooms and suites, plus all-day dining areas, completed during the 2020 global pandemic.',
      ar: 'تجديد ناعم لفندق فاخر يضم 444 غرفة موزعة على 27 طابقاً من الغرف والأجنحة، بالإضافة إلى مناطق تناول الطعام طوال اليوم، تم إنجازه خلال الجائحة العالمية 2020.',
    },
    featured: true,
    status: 'completed',

    // Classification
    sector: { _type: 'reference', _ref: 'industry-hospitality' },
    location: { _type: 'reference', _ref: locationId },

    // Project Details
    client: {
      en: 'Abu Dhabi National Hotels (ADNH)',
      ar: 'فنادق أبوظبي الوطنية',
    },
    yearCompleted: 2020,
    duration: {
      startDate: '2020-05-01',
      endDate: '2020-11-30',
      months: 6,
    },
    budget: {
      amount: 112000000,
      currency: 'AED',
      range: '100m+',
    },
    units: {
      count: 444,
      label: { en: 'Keys', ar: 'مفتاح' },
    },

    // Content
    theChallenge: {
      en: `Innovation Amidst Adversity

Undertaking a major renovation during the peak of the global pandemic (2020) presented a unique set of logistical and operational challenges. The client, ADNH, required a comprehensive "soft upgrade" of this massive 5-star property, comprising 444 guest rooms and suites spread across 27 floors (5th to 32nd), along with key public dining areas.

The critical constraints were strict health and safety protocols, a disrupted global supply chain, and a rigid timeline. We had a budget of AED 112 Million to refresh the hotel's aesthetic without engaging in heavy structural demolition, requiring a strategy of high-impact, precision intervention.`,
      ar: `الابتكار في خضم الشدائد

تقديم تجديد كبير خلال ذروة الجائحة العالمية (2020) قدم مجموعة فريدة من التحديات اللوجستية والتشغيلية. طلب العميل، فنادق أبوظبي الوطنية، ترقية شاملة لهذا العقار الفاخر من فئة 5 نجوم، الذي يضم 444 غرفة وجناح موزعة على 27 طابقاً.`,
    },

    designApproach: {
      en: `French Elegance Meets Arabian Hospitality

Our approach focused on "Soft Refurbishment" techniques that maximize visual impact through finishings, textures, and bespoke joinery.

Guest Rooms & Corridors (5th-32nd Floors): We revitalized the guest experience by infusing the rooms with a blend of French Art de Vivre and local culture. This involved replacing worn surfaces with premium wall coverings, upgrading the flooring to high-end timber and carpets, and installing custom FF&E that modernized the space while retaining the Sofitel brand's classic elegance.

Public Areas (All-Day Dining): The restaurant upgrade focused on flow and atmosphere. We introduced new seating configurations, ambient lighting, and decorative screens that refreshed the dining experience, making it feel open yet intimate, essential for the post-pandemic hospitality landscape.

Pandemic Execution: Executing this during the COVID-19 lockdown proved our operational resilience. We implemented rigorous safety bubbles for our workforce and sourced materials strategically to bypass international shipping delays, ensuring the project moved forward when the rest of the world stood still.`,
      ar: `الأناقة الفرنسية تلتقي بالضيافة العربية

ركز نهجنا على تقنيات "التجديد الناعم" التي تعظم التأثير البصري من خلال التشطيبات والملمس والنجارة المخصصة.`,
    },

    scopeOfWork: [
      {
        _key: 'scope-1',
        title: { en: 'Interior Renovation', ar: 'التجديد الداخلي' },
        description: {
          en: 'Comprehensive soft upgrade of 444 keys, including suites and standard rooms across 27 floors.',
          ar: 'ترقية شاملة لـ 444 غرفة، بما في ذلك الأجنحة والغرف القياسية.',
        },
      },
      {
        _key: 'scope-2',
        title: { en: 'Corridors', ar: 'الممرات' },
        description: {
          en: 'Wall cladding, flooring, and lighting upgrades across all 27 guest floors.',
          ar: 'تكسية الجدران والأرضيات وترقيات الإضاءة عبر جميع طوابق الضيوف.',
        },
      },
      {
        _key: 'scope-3',
        title: { en: 'FF&E Installation', ar: 'تركيب الأثاث والتجهيزات' },
        description: {
          en: 'Supply and installation of soft furnishings, curtains, and movable furniture.',
          ar: 'توريد وتركيب المفروشات الناعمة والستائر والأثاث المتحرك.',
        },
      },
      {
        _key: 'scope-4',
        title: { en: 'Joinery & Fit-Out', ar: 'النجارة والتجهيز' },
        description: {
          en: 'Refinishing of existing woodwork and installation of new decorative elements.',
          ar: 'إعادة تشطيب الأعمال الخشبية الحالية وتركيب عناصر زخرفية جديدة.',
        },
      },
      {
        _key: 'scope-5',
        title: { en: 'MEP Services', ar: 'خدمات الميكانيك والكهرباء' },
        description: {
          en: 'Full upgrade of electrical and mechanical systems to meet modern energy standards.',
          ar: 'ترقية كاملة للأنظمة الكهربائية والميكانيكية لتلبية معايير الطاقة الحديثة.',
        },
      },
    ],

    theOutcome: {
      en: `Mouhajer International Design delivered the project in November 2020, right on schedule. The renovation successfully refreshed the property's market appeal just as the world began to reopen. The seamless execution during such a challenging period earned the project the Best Luxury Hotel Interior Design Dubai award.

This project stands as a case study in agility and crisis management, proving that luxury and quality can be delivered even under the most restrictive global conditions.

444 Rooms upgraded in record time during the 2020 global lockdown.`,
      ar: `سلّم مهاجر للتصميم الدولي المشروع في نوفمبر 2020، في الموعد المحدد تماماً. نجح التجديد في تحديث جاذبية العقار السوقية مع بدء العالم في إعادة الفتح.`,
    },

    // Media
    mainImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroImage?.asset._id,
      },
      alt: { en: 'Sofitel JBR Dubai', ar: 'سوفيتيل جي بي آر دبي' },
    },
    gallery,

    // Services
    services: [
      { _type: 'reference', _ref: 'service-interior-design', _key: 'svc-1' },
      { _type: 'reference', _ref: 'service-fit-out-construction', _key: 'svc-2' },
      { _type: 'reference', _ref: 'service-ffe', _key: 'svc-3' },
    ],

    // Tags
    tags: [{ _type: 'reference', _ref: awardTagId, _key: 'tag-1' }],
  };

  const created = await client.create(project);
  console.log('  ✅ Project created:', created._id);
  return created;
}

// ========================================
// MAIN
// ========================================
async function main() {
  console.log('🚀 Starting Sofitel JBR Migration\n');
  console.log('=' .repeat(50));

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

    console.log('\n' + '=' .repeat(50));
    console.log('✨ Migration complete!');
    console.log('   Project: Sofitel JBR (Jumeirah Beach Residence)');
    console.log('   Images: ' + uploadedImages.length);
    console.log('   URL: /projects/sofitel-jbr');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
