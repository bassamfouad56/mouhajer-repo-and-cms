import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

if (!process.env.SANITY_API_TOKEN) {
  console.error('SANITY_API_TOKEN environment variable is required');
  process.exit(1);
}

// The 6 services that match the services page
const services = [
  {
    _type: 'service',
    _id: 'service-civil-construction',
    title: { en: 'Civil Construction', ar: 'البناء المدني' },
    slug: { current: 'civil-construction' },
    excerpt: {
      en: 'We Build. Licensed to execute heavy civil works from the ground up. We hold the trade licenses for excavation, concrete superstructure, and structural modifications.',
      ar: 'نحن نبني. مرخصون لتنفيذ الأعمال المدنية الثقيلة من الألف إلى الياء.',
    },
    order: 1,
  },
  {
    _type: 'service',
    _id: 'service-interior-architecture',
    title: { en: 'Interior Architecture', ar: 'الهندسة المعمارية الداخلية' },
    slug: { current: 'interior-architecture' },
    excerpt: {
      en: 'We Design. Led by Eng. Maher Mouhajer, our design studio creates the "Uncluttered Baroque" style - Arabic grandeur meets European discipline.',
      ar: 'نحن نصمم. بقيادة م. ماهر مهاجر، يبتكر استوديو التصميم لدينا أسلوب "الباروك البسيط".',
    },
    order: 2,
  },
  {
    _type: 'service',
    _id: 'service-mep-engineering',
    title: { en: 'MEP Engineering', ar: 'هندسة الميكانيك والكهرباء' },
    slug: { current: 'mep-engineering' },
    excerpt: {
      en: 'We Power. The "Invisible Art." Our in-house MEP Division ensures your asset runs silently and efficiently with HVAC, electrical, and plumbing systems.',
      ar: 'نحن نشغّل. "الفن الخفي." يضمن قسم الميكانيك والكهرباء الداخلي لدينا تشغيل أصولكم بصمت وكفاءة.',
    },
    order: 3,
  },
  {
    _type: 'service',
    _id: 'service-manufacturing-joinery',
    title: { en: 'Manufacturing & Joinery', ar: 'التصنيع والنجارة' },
    slug: { current: 'manufacturing-joinery' },
    excerpt: {
      en: 'We Make. Luxury cannot be bought from a catalog. We operate our own facility to create bespoke woodworks, custom furniture, and walk-in wardrobes.',
      ar: 'نحن نصنع. الفخامة لا تُشترى من الكتالوج. نملك منشأتنا الخاصة لصناعة الأعمال الخشبية والأثاث المخصص.',
    },
    order: 4,
  },
  {
    _type: 'service',
    _id: 'service-fit-out-execution',
    title: { en: 'Fit-Out Execution', ar: 'تنفيذ التجهيز' },
    slug: { current: 'fit-out-execution' },
    excerpt: {
      en: 'We Install. Our teams of masons, gypsum artists, and painters execute the delicate finishes that define luxury - marble, stone, gold leafing, and premium painting.',
      ar: 'نحن نركّب. فرقنا من البنائين وفناني الجبس والرسامين ينفذون التشطيبات الدقيقة التي تحدد الفخامة.',
    },
    order: 5,
  },
  {
    _type: 'service',
    _id: 'service-handover-maintenance',
    title: { en: 'Handover & Maintenance', ar: 'التسليم والصيانة' },
    slug: { current: 'handover-maintenance' },
    excerpt: {
      en: 'We Protect. Our job isn\'t done when we hand over the keys. We offer comprehensive annual maintenance contracts for HVAC, deep cleaning, and system upgrades.',
      ar: 'نحن نحمي. عملنا لا ينتهي عند تسليم المفاتيح. نقدم عقود صيانة سنوية شاملة.',
    },
    order: 6,
  },
];

async function syncServices() {
  console.log('Starting Sanity Services Sync...\n');
  console.log('='.repeat(50));

  // Step 1: Delete all existing services
  console.log('\n1. Deleting existing services...\n');

  const existingServices = await client.fetch('*[_type == "service"]{ _id, title }');
  console.log(`   Found ${existingServices.length} existing services to delete\n`);

  for (const service of existingServices) {
    const title = typeof service.title === 'object' ? service.title.en : service.title;
    try {
      await client.delete(service._id);
      console.log(`   Deleted: ${title}`);
    } catch (error) {
      console.error(`   Failed to delete ${title}:`, error.message);
    }
  }

  console.log('\n   All existing services deleted.\n');

  // Step 2: Create new services
  console.log('2. Creating new services...\n');

  for (const service of services) {
    try {
      const created = await client.createOrReplace(service);
      console.log(`   Created: ${service.title.en}`);
    } catch (error) {
      console.error(`   Failed to create ${service.title.en}:`, error.message);
    }
  }

  // Step 3: Verify
  console.log('\n3. Verifying new services...\n');

  const newServices = await client.fetch('*[_type == "service"] | order(order asc) { _id, title, slug, order }');

  console.log('   New Services in Sanity:');
  console.log('   ' + '-'.repeat(40));
  newServices.forEach((s, i) => {
    const title = typeof s.title === 'object' ? s.title.en : s.title;
    console.log(`   ${i + 1}. ${title} (/${s.slug?.current})`);
  });

  console.log('\n' + '='.repeat(50));
  console.log('Sync complete! Mega menu will now show these 6 services.');
}

syncServices().catch(console.error);
