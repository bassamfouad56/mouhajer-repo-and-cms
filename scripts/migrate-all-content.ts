/**
 * Complete Content Migration Script
 * Migrates all website content to Sanity CMS
 * Run with: npx tsx scripts/migrate-all-content.ts
 */

import { createClient } from '@sanity/client';

// Direct configuration - use your Sanity project details
const SANITY_PROJECT_ID = 'r97logzc';
const SANITY_DATASET = 'production';
const SANITY_TOKEN = process.env.SANITY_API_TOKEN || '';

// Sanity client
const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2024-11-21',
  token: SANITY_TOKEN,
  useCdn: false,
});

// ============================================================================
// DATA DEFINITIONS
// ============================================================================

const industries = [
  { id: 'hospitality', title: { en: 'Hospitality', ar: 'الضيافة' }, description: { en: 'Hotels, resorts, restaurants and entertainment venues', ar: 'الفنادق والمنتجعات والمطاعم وأماكن الترفيه' } },
  { id: 'residential', title: { en: 'Residential', ar: 'سكني' }, description: { en: 'Luxury villas, apartments and private homes', ar: 'الفيلات الفاخرة والشقق والمنازل الخاصة' } },
  { id: 'commercial', title: { en: 'Commercial', ar: 'تجاري' }, description: { en: 'Offices, headquarters and corporate spaces', ar: 'المكاتب والمقرات الرئيسية ومساحات الشركات' } },
  { id: 'healthcare', title: { en: 'Healthcare', ar: 'الرعاية الصحية' }, description: { en: 'Clinics, hospitals and wellness centers', ar: 'العيادات والمستشفيات ومراكز العافية' } },
  { id: 'retail', title: { en: 'Retail', ar: 'تجزئة' }, description: { en: 'Showrooms, boutiques and shopping destinations', ar: 'صالات العرض والمتاجر ووجهات التسوق' } },
];

const projectTypes = [
  { id: 'villa', title: { en: 'Villa', ar: 'فيلا' } },
  { id: 'apartment', title: { en: 'Apartment', ar: 'شقة' } },
  { id: 'penthouse', title: { en: 'Penthouse', ar: 'بنتهاوس' } },
  { id: 'hotel', title: { en: 'Hotel', ar: 'فندق' } },
  { id: 'restaurant', title: { en: 'Restaurant', ar: 'مطعم' } },
  { id: 'office', title: { en: 'Office', ar: 'مكتب' } },
  { id: 'retail-store', title: { en: 'Retail Store', ar: 'متجر تجزئة' } },
  { id: 'clinic', title: { en: 'Clinic', ar: 'عيادة' } },
  { id: 'spa', title: { en: 'Spa & Wellness', ar: 'سبا وعافية' } },
];

const locations = [
  { id: 'dubai', name: { en: 'Dubai', ar: 'دبي' }, country: 'UAE' },
  { id: 'abu-dhabi', name: { en: 'Abu Dhabi', ar: 'أبوظبي' }, country: 'UAE' },
  { id: 'sharjah', name: { en: 'Sharjah', ar: 'الشارقة' }, country: 'UAE' },
  { id: 'ajman', name: { en: 'Ajman', ar: 'عجمان' }, country: 'UAE' },
  { id: 'ras-al-khaimah', name: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' }, country: 'UAE' },
  { id: 'palm-jumeirah', name: { en: 'Palm Jumeirah', ar: 'نخلة جميرا' }, country: 'UAE' },
  { id: 'downtown-dubai', name: { en: 'Downtown Dubai', ar: 'داون تاون دبي' }, country: 'UAE' },
  { id: 'dubai-marina', name: { en: 'Dubai Marina', ar: 'دبي مارينا' }, country: 'UAE' },
  { id: 'jumeirah', name: { en: 'Jumeirah', ar: 'جميرا' }, country: 'UAE' },
];

const services = [
  {
    id: 'interior-design',
    title: 'Interior Design',
    slug: 'interior-design',
    excerpt: 'Comprehensive interior design services from concept to completion, creating spaces that inspire and function beautifully.',
    icon: 'Palette',
    order: 1,
    features: [
      { title: 'Concept Development', description: 'Creating unique design concepts tailored to your vision and lifestyle.' },
      { title: 'Space Planning', description: 'Optimizing layouts for functionality, flow, and aesthetic appeal.' },
      { title: 'Material Selection', description: 'Curating premium materials, finishes, and color palettes.' },
      { title: '3D Visualization', description: 'Bringing designs to life with photorealistic renderings.' },
    ],
  },
  {
    id: 'fit-out-execution',
    title: 'Fit-Out & Execution',
    slug: 'fit-out-execution',
    excerpt: 'Complete turnkey fit-out services delivering exceptional quality and precision in every detail.',
    icon: 'Wrench',
    order: 2,
    features: [
      { title: 'Project Management', description: 'Expert oversight ensuring timely delivery and budget control.' },
      { title: 'Construction', description: 'High-quality construction and finishing works.' },
      { title: 'MEP Works', description: 'Complete mechanical, electrical, and plumbing installations.' },
      { title: 'Quality Control', description: 'Rigorous quality checks at every stage.' },
    ],
  },
  {
    id: 'custom-joinery',
    title: 'Custom Joinery',
    slug: 'custom-joinery',
    excerpt: 'Bespoke joinery and millwork crafted with precision and attention to detail.',
    icon: 'Hammer',
    order: 3,
    features: [
      { title: 'Custom Furniture', description: 'One-of-a-kind pieces designed for your space.' },
      { title: 'Built-in Solutions', description: 'Seamlessly integrated storage and architectural elements.' },
      { title: 'Premium Materials', description: 'Finest woods and materials from around the world.' },
      { title: 'Expert Craftsmanship', description: 'Skilled artisans bringing designs to life.' },
    ],
  },
  {
    id: 'hospitality-design',
    title: 'Hospitality Design',
    slug: 'hospitality-design',
    excerpt: 'Creating memorable hospitality experiences through thoughtful design of hotels, restaurants, and entertainment venues.',
    icon: 'Hotel',
    order: 4,
    features: [
      { title: 'Hotel Design', description: 'Luxurious guest experiences from lobby to suite.' },
      { title: 'Restaurant Design', description: 'Atmospheric dining environments that enhance culinary experiences.' },
      { title: 'Spa & Wellness', description: 'Tranquil spaces promoting relaxation and wellbeing.' },
      { title: 'Brand Integration', description: 'Design that reflects and elevates brand identity.' },
    ],
  },
  {
    id: 'commercial-office',
    title: 'Commercial & Office',
    slug: 'commercial-office',
    excerpt: 'Innovative workspace design that boosts productivity, collaboration, and employee wellbeing.',
    icon: 'Building2',
    order: 5,
    features: [
      { title: 'Corporate Headquarters', description: 'Prestigious headquarters reflecting company culture.' },
      { title: 'Open Plan Offices', description: 'Collaborative workspaces fostering innovation.' },
      { title: 'Executive Suites', description: 'Sophisticated private offices and boardrooms.' },
      { title: 'Wellness Spaces', description: 'Break areas and amenities supporting employee wellbeing.' },
    ],
  },
  {
    id: '3d-visualization',
    title: '3D Visualization',
    slug: '3d-visualization',
    excerpt: 'Photorealistic 3D renderings and virtual tours bringing your designs to life before construction begins.',
    icon: 'Box',
    order: 6,
    features: [
      { title: 'Photorealistic Renders', description: 'Ultra-realistic visualizations of your future space.' },
      { title: '360° Virtual Tours', description: 'Immersive walkthroughs from any device.' },
      { title: 'Animation', description: 'Dynamic flythroughs showcasing design flow.' },
      { title: 'Design Options', description: 'Compare multiple design directions side by side.' },
    ],
  },
];

const projects = [
  {
    slug: 'luxury-bathroom-design-dubai',
    title: { en: 'Luxury Bathroom Interior Design', ar: 'تصميم حمام فاخر' },
    excerpt: { en: 'Elegant bathroom design featuring premium marble finishes, custom vanities, and sophisticated lighting.', ar: 'تصميم حمام أنيق يتميز بتشطيبات رخام فاخرة وخزائن مخصصة وإضاءة راقية.' },
    category: 'residential',
    location: 'dubai',
    projectType: 'villa',
    year: 2024,
    client: { en: 'Private Residence', ar: 'مسكن خاص' },
    featured: true,
  },
  {
    slug: 'villa-hatem-master-bedroom',
    title: { en: 'Villa Hatem Master Bedroom Suite', ar: 'جناح غرفة النوم الرئيسية - فيلا حاتم' },
    excerpt: { en: 'Opulent master bedroom design featuring bespoke headboard, custom lighting, and premium textiles.', ar: 'تصميم غرفة نوم رئيسية فاخرة بلوح رأسي مخصص وإضاءة مميزة ومنسوجات فاخرة.' },
    category: 'residential',
    location: 'dubai',
    projectType: 'villa',
    year: 2024,
    client: { en: 'Villa Hatem', ar: 'فيلا حاتم' },
    featured: true,
  },
  {
    slug: 'modern-bedroom-interior-ajman',
    title: { en: 'Modern Bedroom Interior - Ajman Villa', ar: 'تصميم غرفة نوم عصرية - فيلا عجمان' },
    excerpt: { en: 'Contemporary bedroom design with clean lines, natural light optimization, and modern amenities.', ar: 'تصميم غرفة نوم معاصر بخطوط نظيفة وإضاءة طبيعية مثالية ومرافق حديثة.' },
    category: 'residential',
    location: 'ajman',
    projectType: 'villa',
    year: 2023,
    client: { en: 'Private Client', ar: 'عميل خاص' },
    featured: false,
  },
  {
    slug: 'premium-commercial-interior-dubai',
    title: { en: 'Premium Commercial Interior Fit-out', ar: 'تجهيز داخلي تجاري فاخر' },
    excerpt: { en: 'High-end commercial space design featuring sophisticated finishes and optimal space planning.', ar: 'تصميم مساحة تجارية راقية بتشطيبات فخمة وتخطيط مساحات مثالي.' },
    category: 'commercial',
    location: 'dubai',
    projectType: 'office',
    year: 2024,
    client: { en: 'Corporate Client', ar: 'عميل شركات' },
    featured: true,
  },
  {
    slug: 'modern-office-fitout-dubai',
    title: { en: 'Modern Office Fit-out Project', ar: 'مشروع تجهيز مكتب عصري' },
    excerpt: { en: 'Contemporary office fit-out featuring ergonomic workstations and collaborative zones.', ar: 'تجهيز مكتب معاصر بمحطات عمل مريحة ومناطق تعاونية.' },
    category: 'commercial',
    location: 'dubai',
    projectType: 'office',
    year: 2024,
    client: { en: 'Corporate Client', ar: 'عميل شركات' },
    featured: false,
  },
  {
    slug: 'turnkey-residential-fitout',
    title: { en: 'Turnkey Residential Fit-out', ar: 'تجهيز سكني متكامل' },
    excerpt: { en: 'Complete turnkey residential fit-out from design concept to final handover with premium finishes.', ar: 'تجهيز سكني متكامل من مفهوم التصميم إلى التسليم النهائي بتشطيبات فاخرة.' },
    category: 'residential',
    location: 'dubai',
    projectType: 'apartment',
    year: 2024,
    client: { en: 'Private Client', ar: 'عميل خاص' },
    featured: true,
  },
  {
    slug: 'closet-dressing-room-design',
    title: { en: 'Luxury Closet & Dressing Room', ar: 'غرفة ملابس وخزانة فاخرة' },
    excerpt: { en: 'Custom walk-in closet design with premium organization systems and elegant finishes.', ar: 'تصميم خزانة ملابس مخصصة بأنظمة تنظيم فاخرة وتشطيبات أنيقة.' },
    category: 'residential',
    location: 'dubai',
    projectType: 'villa',
    year: 2024,
    client: { en: 'Private Residence', ar: 'مسكن خاص' },
    featured: false,
  },
  {
    slug: 'grand-hyatt-prince-suite',
    title: { en: 'Grand Hyatt Prince Suite', ar: 'جناح الأمير جراند حياة' },
    excerpt: { en: 'Royal suite renovation at Grand Hyatt Dubai with bespoke luxury finishes.', ar: 'تجديد الجناح الملكي في جراند حياة دبي بتشطيبات فاخرة مخصصة.' },
    category: 'hospitality',
    location: 'dubai',
    projectType: 'hotel',
    year: 2024,
    client: { en: 'Grand Hyatt Dubai', ar: 'جراند حياة دبي' },
    featured: true,
  },
  {
    slug: 'ritz-carlton-villas',
    title: { en: 'Ritz Carlton Villas', ar: 'فلل ريتز كارلتون' },
    excerpt: { en: 'Luxury villa interiors at Ritz Carlton with world-class design standards.', ar: 'تصميمات داخلية فاخرة للفلل في ريتز كارلتون بمعايير تصميم عالمية.' },
    category: 'hospitality',
    location: 'dubai',
    projectType: 'villa',
    year: 2024,
    client: { en: 'Ritz Carlton', ar: 'ريتز كارلتون' },
    featured: true,
  },
  {
    slug: 'sheraton-abu-dhabi-renovation',
    title: { en: 'Sheraton Abu Dhabi Hotel & Resort', ar: 'فندق ومنتجع شيراتون أبوظبي' },
    excerpt: { en: 'Complete interior renovation of Sheraton Abu Dhabi Hotel & Resort.', ar: 'تجديد داخلي شامل لفندق ومنتجع شيراتون أبوظبي.' },
    category: 'hospitality',
    location: 'abu-dhabi',
    projectType: 'hotel',
    year: 2024,
    client: { en: 'Sheraton Hotels', ar: 'فنادق شيراتون' },
    featured: false,
  },
];

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

async function migrateIndustries() {
  console.log('\n📂 Migrating Industries...');
  for (const industry of industries) {
    try {
      await client.createOrReplace({
        _type: 'industry',
        _id: `industry-${industry.id}`,
        title: industry.title,
        slug: { current: industry.id },
        description: industry.description,
      });
      console.log(`  ✅ ${industry.title.en}`);
    } catch (error) {
      console.error(`  ❌ Failed: ${industry.title.en}`, error);
    }
  }
}

async function migrateProjectTypes() {
  console.log('\n🏷️ Migrating Project Types...');
  for (const type of projectTypes) {
    try {
      await client.createOrReplace({
        _type: 'projectType',
        _id: `projectType-${type.id}`,
        title: type.title,
        slug: { current: type.id },
      });
      console.log(`  ✅ ${type.title.en}`);
    } catch (error) {
      console.error(`  ❌ Failed: ${type.title.en}`, error);
    }
  }
}

async function migrateLocations() {
  console.log('\n📍 Migrating Locations...');
  for (const location of locations) {
    try {
      await client.createOrReplace({
        _type: 'location',
        _id: `location-${location.id}`,
        name: location.name,
        slug: { current: location.id },
        country: location.country,
      });
      console.log(`  ✅ ${location.name.en}`);
    } catch (error) {
      console.error(`  ❌ Failed: ${location.name.en}`, error);
    }
  }
}

async function migrateServices() {
  console.log('\n🔧 Migrating Services...');
  for (const service of services) {
    try {
      await client.createOrReplace({
        _type: 'service',
        _id: `service-${service.id}`,
        title: service.title,
        slug: { current: service.slug },
        excerpt: service.excerpt,
        icon: service.icon,
        order: service.order,
        featured: service.order <= 3,
        features: service.features,
      });
      console.log(`  ✅ ${service.title}`);
    } catch (error) {
      console.error(`  ❌ Failed: ${service.title}`, error);
    }
  }
}

async function migrateProjects() {
  console.log('\n🏗️ Migrating Projects...');
  for (const project of projects) {
    try {
      // Map category to industry reference
      const industryMap: Record<string, string> = {
        residential: 'industry-residential',
        commercial: 'industry-commercial',
        hospitality: 'industry-hospitality',
        healthcare: 'industry-healthcare',
        retail: 'industry-retail',
      };

      await client.createOrReplace({
        _type: 'project',
        _id: `project-${project.slug}`,
        title: project.title,
        slug: { current: project.slug },
        excerpt: project.excerpt,
        client: project.client,
        year: project.year,
        featured: project.featured,
        status: 'completed',
        publishedAt: new Date().toISOString(),
        sector: {
          _type: 'reference',
          _ref: industryMap[project.category] || 'industry-residential',
        },
        projectType: {
          _type: 'reference',
          _ref: `projectType-${project.projectType}`,
        },
        location: {
          _type: 'reference',
          _ref: `location-${project.location}`,
        },
        // Legacy category for backwards compatibility
        category: project.category,
      });
      console.log(`  ✅ ${project.title.en}`);
    } catch (error) {
      console.error(`  ❌ Failed: ${project.title.en}`, error);
    }
  }
}

async function createSiteSettings() {
  console.log('\n⚙️ Creating Site Settings...');
  try {
    await client.createOrReplace({
      _type: 'siteSettings',
      _id: 'siteSettings',
      siteName: 'Mouhajer International Design',
      siteTagline: 'Premium Interior Design & Fit-Out Solutions',
      founderName: 'Maher Mouhajer',
      founderTitle: 'Founder & Managing Director',
      founderQuote: 'We transform visions into extraordinary spaces that inspire, comfort, and endure.',
      defaultSeoTitle: 'Mouhajer International Design | Premium Interior Design Dubai',
      defaultSeoDescription: 'Leading interior design and fit-out company in Dubai and UAE. Luxury residential, hospitality, and commercial spaces crafted with excellence since 2008.',
    });
    console.log('  ✅ Site Settings created');
  } catch (error) {
    console.error('  ❌ Failed to create site settings', error);
  }
}

// ============================================================================
// MAIN MIGRATION
// ============================================================================

async function runMigration() {
  console.log('🚀 Starting Complete Content Migration to Sanity...');
  console.log(`📊 Project ID: ${client.config().projectId}`);
  console.log(`📁 Dataset: ${client.config().dataset}`);

  // Verify connection
  try {
    await client.fetch('*[_type == "project"][0]');
    console.log('✅ Connected to Sanity successfully\n');
  } catch (error) {
    console.error('❌ Failed to connect to Sanity:', error);
    process.exit(1);
  }

  // Run migrations in order (taxonomy first, then content)
  await migrateIndustries();
  await migrateProjectTypes();
  await migrateLocations();
  await migrateServices();
  await migrateProjects();
  await createSiteSettings();

  console.log('\n' + '='.repeat(50));
  console.log('📈 Migration Summary:');
  console.log(`  📂 Industries: ${industries.length}`);
  console.log(`  🏷️ Project Types: ${projectTypes.length}`);
  console.log(`  📍 Locations: ${locations.length}`);
  console.log(`  🔧 Services: ${services.length}`);
  console.log(`  🏗️ Projects: ${projects.length}`);
  console.log('='.repeat(50));
  console.log('\n🎉 Migration complete!');
  console.log('📍 View your content in Sanity Studio at /studio');
}

// Run the migration
runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
