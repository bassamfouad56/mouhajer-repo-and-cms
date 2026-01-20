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
  console.error('SANITY_API_TOKEN required');
  process.exit(1);
}

const PUBLIC_DIR = join(process.cwd(), 'public');

// ============ STEP 1: Delete all projects ============
async function deleteAllProjects() {
  console.log('\n=== STEP 1: Deleting all existing projects ===');
  const projects = await client.fetch('*[_type == "project"] { _id }');
  console.log('Found ' + projects.length + ' projects to delete');

  for (const project of projects) {
    try {
      await client.delete(project._id);
      console.log('  Deleted: ' + project._id);
    } catch (err) {
      console.error('  Failed to delete ' + project._id + ': ' + err.message);
    }
  }
  console.log('All projects deleted');
}

// ============ STEP 2: Create award tag ============
async function createAwardTag() {
  console.log('\n=== STEP 2: Creating award tag ===');

  const tag = {
    _id: 'tag-award-best-hotel-interior-abu-dhabi',
    _type: 'tag',
    name: {
      en: 'Best Hotel Interior Abu Dhabi',
      ar: 'أفضل تصميم داخلي لفندق في أبوظبي'
    },
    category: 'award',
    description: {
      en: '5-Star Winner - Best Hotel Interior Abu Dhabi',
      ar: 'الفائز بخمس نجوم - أفضل تصميم داخلي لفندق في أبوظبي'
    },
    featured: true,
    order: 1
  };

  try {
    await client.createOrReplace(tag);
    console.log('Award tag created: ' + tag._id);
  } catch (err) {
    console.error('Failed to create tag: ' + err.message);
  }
}

// ============ STEP 3: Upload images ============
async function uploadImage(imagePath, filename) {
  try {
    const imageBuffer = readFileSync(imagePath);
    const asset = await client.assets.upload('image', imageBuffer, { filename });
    return asset._id;
  } catch (err) {
    console.error('  Failed to upload ' + filename + ': ' + err.message);
    return null;
  }
}

async function uploadAllImages() {
  console.log('\n=== STEP 3: Uploading images to Sanity ===');
  const uploadedAssets = {
    mainImages: [],
    beforeAfterPairs: [],
    lobbyImages: [],
    restaurantImages: [],
    smokingRoomImages: []
  };

  // 3a. Upload main project images
  console.log('\nUploading main project images...');
  const mainDir = join(PUBLIC_DIR, 'projects/sheraton');
  const mainFiles = readdirSync(mainDir).filter(f => f.endsWith('.jpg')).sort();

  for (const file of mainFiles) {
    console.log('  Uploading: ' + file);
    const assetId = await uploadImage(join(mainDir, file), file);
    if (assetId) {
      uploadedAssets.mainImages.push({ filename: file, assetId });
    }
  }
  console.log('Uploaded ' + uploadedAssets.mainImages.length + ' main images');

  // 3b. Upload before/after pairs
  console.log('\nUploading before/after images...');
  const baDir = join(PUBLIC_DIR, 'sh/before - after');
  const baDirs = readdirSync(baDir).filter(d => !d.startsWith('.')).sort((a, b) => parseInt(a) - parseInt(b));

  for (const dir of baDirs) {
    const pairDir = join(baDir, dir);
    const files = readdirSync(pairDir).filter(f => f.toLowerCase().endsWith('.jpg')).sort();

    if (files.length >= 2) {
      console.log('  Pair ' + dir + ': ' + files[0] + ' / ' + files[1]);
      const beforeId = await uploadImage(join(pairDir, files[0]), 'before-' + dir + '-' + files[0]);
      const afterId = await uploadImage(join(pairDir, files[1]), 'after-' + dir + '-' + files[1]);

      if (beforeId && afterId) {
        uploadedAssets.beforeAfterPairs.push({
          pairNumber: parseInt(dir),
          beforeAssetId: beforeId,
          afterAssetId: afterId
        });
      }
    }
  }
  console.log('Uploaded ' + uploadedAssets.beforeAfterPairs.length + ' before/after pairs');

  // 3c. Upload lobby images (select best for hero)
  console.log('\nUploading lobby images (for hero and gallery)...');
  const lobbyDir = join(PUBLIC_DIR, 'sh/final pictures/Lobby');
  const lobbyFiles = readdirSync(lobbyDir).filter(f => f.toLowerCase().endsWith('.jpg')).sort().slice(0, 15);

  for (const file of lobbyFiles) {
    console.log('  Uploading: ' + file);
    const assetId = await uploadImage(join(lobbyDir, file), 'lobby-' + file);
    if (assetId) {
      uploadedAssets.lobbyImages.push({ filename: file, assetId });
    }
  }
  console.log('Uploaded ' + uploadedAssets.lobbyImages.length + ' lobby images');

  // 3d. Upload restaurant images
  console.log('\nUploading restaurant images...');
  const restDir = join(PUBLIC_DIR, 'sh/final pictures/Flavours Restaurant');
  const restFiles = readdirSync(restDir).filter(f => f.toLowerCase().endsWith('.jpg')).sort().slice(0, 10);

  for (const file of restFiles) {
    console.log('  Uploading: ' + file);
    const assetId = await uploadImage(join(restDir, file), 'restaurant-' + file);
    if (assetId) {
      uploadedAssets.restaurantImages.push({ filename: file, assetId });
    }
  }
  console.log('Uploaded ' + uploadedAssets.restaurantImages.length + ' restaurant images');

  return uploadedAssets;
}

// ============ STEP 4: Create Sheraton project ============
async function createSheratonProject(assets) {
  console.log('\n=== STEP 4: Creating Sheraton project ===');

  // Build gallery array
  const gallery = [];
  let galleryKey = 0;

  // Add before/after pairs
  for (const pair of assets.beforeAfterPairs) {
    gallery.push({
      _key: 'gallery-' + (galleryKey++),
      _type: 'image',
      category: 'before',
      caption: { en: 'Before renovation - View ' + pair.pairNumber, ar: 'قبل التجديد' },
      asset: { _type: 'reference', _ref: pair.beforeAssetId }
    });
    gallery.push({
      _key: 'gallery-' + (galleryKey++),
      _type: 'image',
      category: 'after',
      caption: { en: 'After renovation - View ' + pair.pairNumber, ar: 'بعد التجديد' },
      asset: { _type: 'reference', _ref: pair.afterAssetId }
    });
  }

  // Add main project images as interior
  for (const img of assets.mainImages.slice(0, 20)) {
    gallery.push({
      _key: 'gallery-' + (galleryKey++),
      _type: 'image',
      category: 'interior',
      caption: { en: 'Sheraton Abu Dhabi Interior', ar: 'التصميم الداخلي لشيراتون أبوظبي' },
      asset: { _type: 'reference', _ref: img.assetId }
    });
  }

  // Add lobby images
  for (const img of assets.lobbyImages.slice(1)) {
    gallery.push({
      _key: 'gallery-' + (galleryKey++),
      _type: 'image',
      category: 'interior',
      caption: { en: 'Hotel Lobby', ar: 'بهو الفندق' },
      asset: { _type: 'reference', _ref: img.assetId }
    });
  }

  // Add restaurant images
  for (const img of assets.restaurantImages) {
    gallery.push({
      _key: 'gallery-' + (galleryKey++),
      _type: 'image',
      category: 'interior',
      caption: { en: 'Flavours Restaurant', ar: 'مطعم فلايفورز' },
      asset: { _type: 'reference', _ref: img.assetId }
    });
  }

  // Use first lobby image as hero
  const heroAssetId = assets.lobbyImages[0]?.assetId || assets.mainImages[0]?.assetId;

  const challengeText = `Reinventing a Landmark

The Sheraton Abu Dhabi is not just a hotel; it is a heritage landmark on the Corniche. The client, Abu Dhabi National Hotels (ADNH), presented a formidable challenge: execute a comprehensive modernization of this 277-room 5-star property within an incredibly aggressive timeline of just 10 months.

The mandate was clear: transform the aging interiors into a contemporary masterpiece while respecting the building's iconic structural guidelines. The project required a total budget management of AED 140 Million and a seamless coordination of civil works, MEP, and high-end joinery without compromising on the quality expected of a luxury resort.`;

  const approachText = `A Symphony of Heritage & Innovation

Mouhajer International Design approached this project with a philosophy of "Consumable Artistic Reality." We bridged the gap between the hotel's historic charm and the demands of modern luxury travel.

Public Areas (Lobby, Restaurants, Spa/Gym): We reimagined the public spaces as grand social theaters. By upgrading the lobby with opulent marble flooring and bespoke lighting installations, we created an immediate sense of arrival. The renovation extended to key outlets including the spa and restaurants, where we utilized custom fit-outs to distinct atmospheric zones—from the high-energy fitness areas to the serene, acoustic-controlled spa environments.

Guest Rooms & Suites: The redesign of the 277 keys focused on "smart luxury." We stripped back outdated elements and introduced a palette of warm neutrals, rich textures, and ergonomic layouts. The result is a suite of rooms that feel expansive, sophisticated, and technologically integrated.

Engineering & Fit-Out: To meet the 10-month deadline, our engineering teams worked in parallel with our design division. We executed complex structural upgrades and MEP (Mechanical, Electrical, Plumbing) works simultaneously with fine finishing, ensuring zero downtime in the transition from construction to handover.`;

  const outcomeText = `Delivered on time and within budget, the newly renovated Sheraton Abu Dhabi stands as a testament to Mouhajer Design's capacity for large-scale commercial execution. The project successfully re-positioned the hotel as a market leader in Abu Dhabi hospitality, earning the prestigious Best Hotel Interior Abu Dhabi award.

The transformation was absolute, turning a classic property into a modern icon of opulence, proving once again that tight deadlines are no barrier to perfection when expertise is at the helm.

"Creating the new guidelines of Sheraton in 10 months only."`;

  const project = {
    _id: 'project-sheraton-abu-dhabi',
    _type: 'project',
    title: {
      en: 'Sheraton Abu Dhabi Hotel & Resort',
      ar: 'فندق ومنتجع شيراتون أبوظبي'
    },
    slug: { _type: 'slug', current: 'sheraton-abu-dhabi-hotel-resort' },
    excerpt: {
      en: 'Full Turnkey Renovation of a 277-room 5-star landmark on the Corniche. From concept to completion in just 10 months, this AED 140 Million transformation earned the Best Hotel Interior Abu Dhabi award.',
      ar: 'تجديد شامل لمعلم بارز من فئة 5 نجوم يضم 277 غرفة على الكورنيش. من المفهوم إلى الإنجاز في 10 أشهر فقط، حصل هذا التحول بقيمة 140 مليون درهم على جائزة أفضل تصميم داخلي لفندق في أبوظبي.'
    },
    featured: true,
    status: 'completed',
    publishedAt: '2021-11-30T00:00:00Z',

    // Classification
    sector: { _type: 'reference', _ref: 'industry-hospitality' },
    location: { _type: 'reference', _ref: 'location-abu-dhabi' },
    tags: [{ _type: 'reference', _ref: 'tag-award-best-hotel-interior-abu-dhabi', _key: 'tag-1' }],

    // Project Details
    client: { en: 'Abu Dhabi National Hotels (ADNH)', ar: 'فنادق أبوظبي الوطنية' },
    yearCompleted: 2021,
    duration: {
      startDate: '2021-05-01',
      endDate: '2021-11-30',
      months: 6
    },
    budget: {
      amount: 140000000,
      currency: 'AED',
      range: '100m+'
    },
    units: {
      count: 277,
      label: 'Rooms'
    },

    // Content
    theChallenge: {
      en: challengeText,
      ar: 'إعادة ابتكار معلم بارز\n\nفندق شيراتون أبوظبي ليس مجرد فندق؛ إنه معلم تراثي على الكورنيش. قدم العميل، فنادق أبوظبي الوطنية، تحديًا هائلاً: تنفيذ تحديث شامل لهذا الفندق من فئة 5 نجوم الذي يضم 277 غرفة في جدول زمني عدواني للغاية يبلغ 10 أشهر فقط.'
    },
    designApproach: {
      en: approachText,
      ar: 'سيمفونية من التراث والابتكار\n\nتعاملت موحجر للتصميم الدولي مع هذا المشروع بفلسفة "الواقع الفني القابل للاستهلاك". لقد سددنا الفجوة بين سحر الفندق التاريخي ومتطلبات السفر الفاخر الحديث.'
    },
    scopeOfWork: [
      {
        _key: 'scope-1',
        title: { en: 'Civil & Structural', ar: 'الأعمال المدنية والإنشائية' },
        description: { en: 'Complete overhaul of corridors, guest rooms, and public facility structures.', ar: 'إصلاح شامل للممرات وغرف الضيوف وهياكل المرافق العامة.' }
      },
      {
        _key: 'scope-2',
        title: { en: 'Interior Design & Fit-Out', ar: 'التصميم الداخلي والتجهيز' },
        description: { en: 'End-to-end execution including gypsum works, wall cladding, and flooring.', ar: 'تنفيذ شامل يشمل أعمال الجبس وتكسية الجدران والأرضيات.' }
      },
      {
        _key: 'scope-3',
        title: { en: 'FF&E (Furniture, Fixtures & Equipment)', ar: 'الأثاث والتجهيزات والمعدات' },
        description: { en: 'Sourcing and installation of custom bespoke furniture and soft furnishings.', ar: 'توريد وتركيب الأثاث المخصص والمفروشات الناعمة.' }
      },
      {
        _key: 'scope-4',
        title: { en: 'MEP Services', ar: 'خدمات الميكانيكا والكهرباء والسباكة' },
        description: { en: 'Full upgrade of electrical and mechanical systems to meet modern energy standards.', ar: 'ترقية كاملة للأنظمة الكهربائية والميكانيكية لتلبية معايير الطاقة الحديثة.' }
      }
    ],
    theOutcome: {
      en: outcomeText,
      ar: 'تم التسليم في الوقت المحدد وضمن الميزانية، ويقف فندق شيراتون أبوظبي المجدد حديثًا كشهادة على قدرة موحجر للتصميم على التنفيذ التجاري الكبير. نجح المشروع في إعادة وضع الفندق كرائد في سوق الضيافة في أبوظبي، وحصل على جائزة أفضل تصميم داخلي لفندق في أبوظبي المرموقة.'
    },

    // Media
    mainImage: {
      _type: 'image',
      alt: { en: 'Sheraton Abu Dhabi Hotel & Resort Lobby', ar: 'بهو فندق ومنتجع شيراتون أبوظبي' },
      asset: { _type: 'reference', _ref: heroAssetId }
    },
    gallery: gallery,

    // SEO
    metaTitle: {
      en: 'Sheraton Abu Dhabi Hotel & Resort | Award-Winning Renovation | MIDC',
      ar: 'فندق ومنتجع شيراتون أبوظبي | تجديد حائز على جوائز | MIDC'
    },
    metaDescription: {
      en: 'Discover the award-winning renovation of Sheraton Abu Dhabi. 277 rooms transformed in 10 months. Winner of Best Hotel Interior Abu Dhabi.',
      ar: 'اكتشف التجديد الحائز على جوائز لفندق شيراتون أبوظبي. تم تحويل 277 غرفة في 10 أشهر. الفائز بجائزة أفضل تصميم داخلي لفندق في أبوظبي.'
    }
  };

  try {
    await client.createOrReplace(project);
    console.log('Sheraton project created successfully!');
    console.log('  ID: ' + project._id);
    console.log('  Gallery items: ' + gallery.length);
  } catch (err) {
    console.error('Failed to create project: ' + err.message);
  }
}

// ============ MAIN ============
async function main() {
  console.log('Starting Sheraton project migration...');

  await deleteAllProjects();
  await createAwardTag();
  const assets = await uploadAllImages();
  await createSheratonProject(assets);

  console.log('\n=== MIGRATION COMPLETE ===');
}

main().catch(console.error);
