import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Find existing project images from public folder
function findProjectImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const imageFolders = ['sh', 'jbr', 'new', 'homepage', 'founder'];
  const images = [];

  for (const folder of imageFolders) {
    const folderPath = path.join(publicDir, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
          images.push(`/${folder}/${file}`);
        }
      }
    }
  }

  return images;
}

// The Ritz-Carlton Abu Dhabi, Grand Canal - Actual project content
const featuredProject = {
  _type: 'project',
  title: {
    en: 'The Ritz-Carlton Abu Dhabi, Grand Canal',
    ar: 'ريتز كارلتون أبوظبي، القناة الكبرى',
  },
  slug: {
    _type: 'slug',
    current: 'ritz-carlton-abu-dhabi-grand-canal',
  },
  excerpt: {
    en: '20 units transformed into 10 palatial sanctuaries, delivered within the heart of an operating 5-star icon. A VIP Design & Build project featuring structural reconfiguration and luxury fit-out.',
    ar: 'تحويل 20 وحدة إلى 10 ملاذات قصرية، تم تسليمها في قلب أيقونة 5 نجوم عاملة. مشروع تصميم وبناء VIP يتضمن إعادة هيكلة وتجهيزات فاخرة.',
  },
  featured: true,
  publishedAt: new Date().toISOString(),
  year: 2023,
  status: 'completed',
  area: 8500, // Estimated for 10 villas
  client: {
    en: 'Abu Dhabi National Hotels (ADNH)',
    ar: 'فنادق أبوظبي الوطنية',
  },
  duration: {
    startDate: '2021-12-01',
    endDate: '2023-10-31',
    months: 23,
  },
  budget: {
    amount: null,
    currency: 'AED',
    range: 'confidential',
  },
  units: {
    count: 10,
    label: 'Palatial Villas',
  },
  challenge: {
    en: `Structural Metamorphosis

The objective was architecturally ambitious: Merge 20 existing villas into 10 expansive, high-inventory luxury villas. Each new unit was to be transformed into a 3-bedroom sanctuary, complete with its own private swimming pool.

As this was a VIP project within the operating grounds of the Ritz-Carlton, the stakes were exceptionally high. We faced two major hurdles:

Structural Integrity: Merging two distinct buildings into one requires complex civil engineering to ensure load-bearing walls and MEP systems are unified seamlessly.

VIP Hospitality Standards: Because the hotel remained active and hosted VIP guests, construction had to be conducted with zero visual or noise pollution. Every logistical move was choreographed to maintain the Ritz-Carlton's world-class guest experience.`,
    ar: `التحول الهيكلي

كان الهدف طموحاً معمارياً: دمج 20 فيلا قائمة في 10 فلل فاخرة واسعة وعالية المخزون. كان من المقرر تحويل كل وحدة جديدة إلى ملاذ من 3 غرف نوم، مع مسبح خاص.

نظراً لأن هذا كان مشروع VIP داخل أراضي فندق ريتز كارلتون العاملة، كانت المخاطر عالية للغاية. واجهنا عقبتين رئيسيتين:

السلامة الهيكلية: يتطلب دمج مبنيين متميزين في واحد هندسة مدنية معقدة لضمان توحيد الجدران الحاملة وأنظمة MEP بسلاسة.

معايير الضيافة VIP: نظراً لأن الفندق ظل نشطاً ويستضيف ضيوف VIP، كان يجب إجراء البناء بدون أي تلوث بصري أو ضوضاء.`,
  },
  approach: {
    en: `Grandeur Redefined

Mouhajer International Design executed a comprehensive "Design and Build" strategy that prioritized privacy, scale, and the brand's signature Mediterranean-meets-Arabic aesthetic.

Space Transformation: By knocking down the dividing lines of 20 units, we created massive, open-plan living areas that lead directly to the private pool decks. The transition from bedroom to lounge was designed to emphasize the "Majlis" concept, a space for gathering and prestige.

The Private Oasis: Each villa was equipped with a custom-engineered private pool. This required intricate waterproofing, plumbing, and aesthetic tiling that mirrored the luxury of the Grand Canal surroundings.

Bespoke Interiors: We utilized premium materials—hand-selected marble, ornate gypsum, and bespoke joinery—to create an environment fitting for VIP guests. The lighting design was curated to highlight the architectural volume created by the merger.`,
    ar: `الفخامة المُعاد تعريفها

نفذت موحاجر إنترناشيونال ديزاين استراتيجية "التصميم والبناء" الشاملة التي أعطت الأولوية للخصوصية والحجم والجمالية المميزة للعلامة التجارية التي تجمع بين البحر الأبيض المتوسط والعربية.

تحويل المساحة: من خلال هدم الخطوط الفاصلة بين 20 وحدة، أنشأنا مناطق معيشة ضخمة ومفتوحة تؤدي مباشرة إلى أسطح المسابح الخاصة. تم تصميم الانتقال من غرفة النوم إلى الصالة للتأكيد على مفهوم "المجلس".

الواحة الخاصة: تم تجهيز كل فيلا بمسبح خاص مصمم خصيصاً. تطلب ذلك العزل المائي المعقد والسباكة والبلاط الجمالي.

التصميمات الداخلية المخصصة: استخدمنا مواد فاخرة - رخام مختار يدوياً، جبس مزخرف، ونجارة مخصصة - لخلق بيئة تليق بضيوف VIP.`,
  },
  outcome: {
    en: `Completed in October 2023, the Rabdan Villas represent the pinnacle of our "Design and Build" division. We successfully doubled the luxury value of the property by creating larger, more exclusive inventory that did not exist before.

Despite the operational complexity of the Ritz-Carlton environment, the project was delivered with surgical precision, proving that Mouhajer Design can manage high-stakes structural changes without compromising the serenity of a 5-star resort.

"20 units transformed into 10 palatial sanctuaries, delivered within the heart of an operating 5-star icon."`,
    ar: `تم الانتهاء في أكتوبر 2023، تمثل فلل ربدان قمة قسم "التصميم والبناء" لدينا. نجحنا في مضاعفة القيمة الفاخرة للعقار من خلال إنشاء مخزون أكبر وأكثر حصرية لم يكن موجوداً من قبل.

على الرغم من التعقيد التشغيلي لبيئة ريتز كارلتون، تم تسليم المشروع بدقة جراحية، مما يثبت أن موحاجر ديزاين يمكنها إدارة التغييرات الهيكلية عالية المخاطر دون المساس بهدوء منتجع 5 نجوم.

"20 وحدة تحولت إلى 10 ملاذات قصرية، تم تسليمها في قلب أيقونة 5 نجوم عاملة."`,
  },
  testimonial: {
    quote: {
      en: 'Mouhajer International Design delivered a masterpiece within the most challenging operational environment. Their ability to execute complex structural changes while maintaining our VIP guest experience was exceptional.',
      ar: 'قدمت موحاجر إنترناشيونال ديزاين تحفة فنية في أصعب بيئة تشغيلية. كانت قدرتهم على تنفيذ تغييرات هيكلية معقدة مع الحفاظ على تجربة ضيوف VIP استثنائية.',
    },
    author: 'ADNH Management',
    role: 'Abu Dhabi National Hotels',
  },
  scope: [
    {
      title: { en: 'Civil & Structural Engineering', ar: 'الهندسة المدنية والإنشائية' },
      description: {
        en: 'Merging of structural frames, demolition of dividing walls, and foundation work for 10 private pools. Complex civil engineering to ensure load-bearing walls and MEP systems are unified seamlessly.',
        ar: 'دمج الهياكل الإنشائية، هدم الجدران الفاصلة، وأعمال الأساسات لـ 10 مسابح خاصة. هندسة مدنية معقدة لضمان توحيد الجدران الحاملة وأنظمة MEP بسلاسة.',
      },
    },
    {
      title: { en: 'Architecture & MEP Design', ar: 'التصميم المعماري وهندسة MEP' },
      description: {
        en: 'Full redesign of mechanical and electrical systems to support the new 3-bedroom layout and individual pool heating/filtration. Mediterranean-meets-Arabic aesthetic throughout.',
        ar: 'إعادة تصميم كاملة للأنظمة الميكانيكية والكهربائية لدعم تخطيط 3 غرف نوم الجديد وتدفئة/فلترة المسابح الفردية. جمالية البحر الأبيض المتوسط والعربية.',
      },
    },
    {
      title: { en: 'High-End Interior Fit-Out', ar: 'التجهيزات الداخلية الفاخرة' },
      description: {
        en: 'Turnkey interior execution including custom floor patterns, wall cladding, and high-ceiling treatments. Hand-selected marble, ornate gypsum, and bespoke joinery crafted by master artisans.',
        ar: 'تنفيذ داخلي جاهز بما في ذلك أنماط الأرضيات المخصصة، كسوة الجدران، ومعالجات الأسقف العالية. رخام مختار يدوياً، جبس مزخرف، ونجارة مخصصة.',
      },
    },
    {
      title: { en: 'Private Pool Engineering', ar: 'هندسة المسابح الخاصة' },
      description: {
        en: 'Custom-engineered private pools for each villa with intricate waterproofing, premium plumbing systems, and aesthetic tiling that mirrors the luxury of the Grand Canal surroundings.',
        ar: 'مسابح خاصة مصممة خصيصاً لكل فيلا مع عزل مائي معقد، أنظمة سباكة فاخرة، وبلاط جمالي يعكس فخامة محيط القناة الكبرى.',
      },
    },
    {
      title: { en: 'External Works & Landscaping', ar: 'الأعمال الخارجية والمناظر الطبيعية' },
      description: {
        en: 'Landscaping and deck construction for the new private pool areas. Creating seamless indoor-outdoor transitions that emphasize the "Private Oasis" concept.',
        ar: 'المناظر الطبيعية وبناء الأسطح لمناطق المسابح الخاصة الجديدة. خلق انتقالات سلسة بين الداخل والخارج تؤكد على مفهوم "الواحة الخاصة".',
      },
    },
    {
      title: { en: 'VIP Operations Coordination', ar: 'تنسيق عمليات VIP' },
      description: {
        en: 'Zero visual or noise pollution construction methodology. Every logistical move choreographed to maintain the Ritz-Carlton\'s world-class guest experience during active hotel operations.',
        ar: 'منهجية بناء بدون تلوث بصري أو ضوضاء. تم تنسيق كل حركة لوجستية للحفاظ على تجربة ضيوف ريتز كارلتون العالمية أثناء عمليات الفندق النشطة.',
      },
    },
  ],
  featuredContent: {
    heroVideo: null,
    visionStatement: {
      en: 'Grandeur Redefined. The Ritz-Carlton Abu Dhabi Rabdan Villas represent the pinnacle of our Design and Build division—where structural metamorphosis meets VIP hospitality standards. 20 units transformed into 10 palatial sanctuaries, each a testament to our commitment to excellence in the most demanding environments.',
      ar: 'الفخامة المُعاد تعريفها. تمثل فلل ربدان في ريتز كارلتون أبوظبي قمة قسم التصميم والبناء لدينا—حيث يلتقي التحول الهيكلي بمعايير ضيافة VIP. 20 وحدة تحولت إلى 10 ملاذات قصرية.',
    },
    highlightStats: [
      { value: '20', label: { en: 'Original Villas', ar: 'الفلل الأصلية' }, suffix: '' },
      { value: '10', label: { en: 'Palatial Sanctuaries', ar: 'ملاذ قصري' }, suffix: '' },
      { value: '10', label: { en: 'Private Pools', ar: 'مسبح خاص' }, suffix: '' },
      { value: '23', label: { en: 'Months Duration', ar: 'شهر المدة' }, suffix: '' },
      { value: '100', label: { en: 'Operational Excellence', ar: 'تميز تشغيلي' }, suffix: '%' },
      { value: '0', label: { en: 'Guest Disruption', ar: 'إزعاج للضيوف' }, suffix: '' },
    ],
    transformationTitle: {
      en: 'Structural Metamorphosis',
      ar: 'التحول الهيكلي',
    },
  },
  seo: {
    metaTitle: {
      en: 'The Ritz-Carlton Abu Dhabi, Grand Canal | Mouhajer Design Featured Project',
      ar: 'ريتز كارلتون أبوظبي، القناة الكبرى | مشروع موحاجر ديزاين المميز',
    },
    metaDescription: {
      en: 'Discover how Mouhajer Design transformed 20 villas into 10 palatial sanctuaries at The Ritz-Carlton Abu Dhabi. VIP Design & Build project with zero operational disruption.',
      ar: 'اكتشف كيف حولت موحاجر ديزاين 20 فيلا إلى 10 ملاذات قصرية في ريتز كارلتون أبوظبي.',
    },
    keywords: ['Ritz-Carlton', 'Abu Dhabi', 'luxury villas', 'design and build', 'hotel renovation', 'Mouhajer Design', 'VIP project'],
  },
};

async function uploadImage(imagePath) {
  const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''));

  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠ Image not found: ${fullPath}`);
    return null;
  }

  try {
    const imageBuffer = fs.readFileSync(fullPath);
    const filename = path.basename(imagePath);

    const asset = await client.assets.upload('image', imageBuffer, {
      filename,
      contentType: `image/${path.extname(filename).slice(1)}`,
    });

    return asset;
  } catch (error) {
    console.log(`  ⚠ Failed to upload ${imagePath}:`, error.message);
    return null;
  }
}

async function seedFeaturedProject() {
  console.log('🚀 Starting to seed featured project with images...\n');

  try {
    // Find available images
    console.log('📷 Finding available images...');
    const availableImages = findProjectImages();
    console.log(`  Found ${availableImages.length} images\n`);

    // First, check if required references exist
    console.log('📋 Checking for required references...');

    // Get or create sector (industry) - Luxury Hospitality for hotel project
    let sector = await client.fetch(`*[_type == "industry" && slug.current == "luxury-hospitality"][0]`);
    if (!sector) {
      console.log('  Creating industry: Luxury Hospitality');
      sector = await client.create({
        _type: 'industry',
        title: { en: 'Luxury Hospitality', ar: 'الضيافة الفاخرة' },
        slug: { _type: 'slug', current: 'luxury-hospitality' },
      });
    }
    console.log('  ✓ Industry:', sector._id);

    // Get or create project type
    let projectType = await client.fetch(`*[_type == "projectType" && slug.current == "hotel-renovation"][0]`);
    if (!projectType) {
      console.log('  Creating project type: Hotel Renovation');
      projectType = await client.create({
        _type: 'projectType',
        title: { en: 'Hotel Renovation', ar: 'تجديد الفنادق' },
        slug: { _type: 'slug', current: 'hotel-renovation' },
      });
    }
    console.log('  ✓ Project type:', projectType._id);

    // Get or create location - Abu Dhabi
    let location = await client.fetch(`*[_type == "location" && slug.current == "abu-dhabi"][0]`);
    if (!location) {
      console.log('  Creating location: Abu Dhabi');
      location = await client.create({
        _type: 'location',
        name: { en: 'Abu Dhabi, UAE', ar: 'أبوظبي، الإمارات' },
        slug: { _type: 'slug', current: 'abu-dhabi' },
      });
    }
    console.log('  ✓ Location:', location._id);

    // Get services
    const services = await client.fetch(`*[_type == "service"][0...4]{ _id }`);
    console.log(`  ✓ Found ${services.length} services\n`);

    // Upload images and create gallery
    console.log('📤 Uploading images to Sanity...');
    const gallery = [];
    const categories = ['interior', 'exterior', 'detail', 'process', 'interior', 'detail'];
    const imagesToUpload = availableImages.slice(0, 15);

    for (let i = 0; i < imagesToUpload.length; i++) {
      const imagePath = imagesToUpload[i];
      console.log(`  Uploading ${i + 1}/${imagesToUpload.length}: ${path.basename(imagePath)}`);

      const asset = await uploadImage(imagePath);
      if (asset) {
        const captions = [
          { en: 'Luxury villa interior with Mediterranean-Arabic aesthetic', ar: 'داخلي الفيلا الفاخرة بجمالية البحر المتوسط والعربية' },
          { en: 'Private pool deck overlooking the Grand Canal', ar: 'سطح المسبح الخاص المطل على القناة الكبرى' },
          { en: 'Bespoke marble flooring and ornate gypsum details', ar: 'أرضيات رخام مخصصة وتفاصيل جبس مزخرفة' },
          { en: 'Open-plan living area with Majlis concept', ar: 'منطقة معيشة مفتوحة بمفهوم المجلس' },
          { en: 'Master bedroom with premium finishes', ar: 'غرفة النوم الرئيسية بتشطيبات فاخرة' },
          { en: 'Custom joinery crafted by master artisans', ar: 'نجارة مخصصة صنعها حرفيون متخصصون' },
        ];
        gallery.push({
          _type: 'image',
          _key: `gallery-${i}`,
          asset: { _type: 'reference', _ref: asset._id },
          alt: {
            en: `Ritz-Carlton Abu Dhabi Grand Canal - Image ${i + 1}`,
            ar: `ريتز كارلتون أبوظبي القناة الكبرى - صورة ${i + 1}`
          },
          caption: captions[i % captions.length],
          category: categories[i % categories.length],
        });
      }
    }

    console.log(`\n✓ Uploaded ${gallery.length} images\n`);

    // Upload main image
    let mainImage = null;
    if (availableImages.length > 0) {
      console.log('📤 Uploading main image...');
      const mainAsset = await uploadImage(availableImages[0]);
      if (mainAsset) {
        mainImage = {
          _type: 'image',
          asset: { _type: 'reference', _ref: mainAsset._id },
          alt: {
            en: 'The Ritz-Carlton Abu Dhabi, Grand Canal - Rabdan Villas',
            ar: 'ريتز كارلتون أبوظبي، القناة الكبرى - فلل ربدان'
          }
        };
        console.log('  ✓ Main image uploaded\n');
      }
    }

    // Check if featured project already exists
    const existingProject = await client.fetch(
      `*[_type == "project" && slug.current == "ritz-carlton-abu-dhabi-grand-canal"][0]`
    );

    if (existingProject) {
      console.log('⚠️  Featured project already exists. Updating...');

      const updatedProject = await client.patch(existingProject._id)
        .set({
          ...featuredProject,
          mainImage,
          gallery,
          sector: { _type: 'reference', _ref: sector._id },
          projectType: { _type: 'reference', _ref: projectType._id },
          location: { _type: 'reference', _ref: location._id },
          services: services.map(s => ({ _type: 'reference', _ref: s._id, _key: s._id })),
        })
        .commit();

      console.log('\n✅ Featured project updated successfully!');
      console.log('   ID:', updatedProject._id);
      console.log('   Gallery images:', gallery.length);
    } else {
      console.log('📝 Creating new featured project...');

      const newProject = await client.create({
        ...featuredProject,
        mainImage,
        gallery,
        sector: { _type: 'reference', _ref: sector._id },
        projectType: { _type: 'reference', _ref: projectType._id },
        location: { _type: 'reference', _ref: location._id },
        services: services.map(s => ({ _type: 'reference', _ref: s._id, _key: s._id })),
      });

      console.log('\n✅ Featured project created successfully!');
      console.log('   ID:', newProject._id);
      console.log('   Gallery images:', gallery.length);
    }

    console.log('\n📍 View the featured project at:');
    console.log('   http://localhost:3000/en/projects/featured/ritz-carlton-abu-dhabi-grand-canal');
    console.log('   http://localhost:3000/ar/projects/featured/ritz-carlton-abu-dhabi-grand-canal');

  } catch (error) {
    console.error('\n❌ Error seeding featured project:', error);
    process.exit(1);
  }
}

seedFeaturedProject();
