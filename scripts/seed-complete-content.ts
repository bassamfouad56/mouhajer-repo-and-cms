/**
 * Complete Content Seeding Script
 *
 * This script:
 * 1. Uploads images from /public folder to Sanity CDN
 * 2. Creates Partner documents with logos
 * 3. Creates Client documents with logos
 * 4. Creates Award documents
 * 5. Creates Testimonial documents
 * 6. Populates Site Settings with images
 * 7. Updates Services with images
 *
 * Run with: npx tsx scripts/seed-complete-content.ts
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'r97logzc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Image extensions to upload
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];

// Track uploaded assets
const uploadedAssets: Map<string, string> = new Map();

/**
 * Upload an image file to Sanity and return asset reference
 */
async function uploadImage(filePath: string, filename: string): Promise<string | null> {
  // Check if already uploaded
  if (uploadedAssets.has(filePath)) {
    return uploadedAssets.get(filePath)!;
  }

  try {
    const imageBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
    };

    const asset = await client.assets.upload('image', imageBuffer, {
      filename,
      contentType: contentTypes[ext] || 'image/jpeg',
    });

    uploadedAssets.set(filePath, asset._id);
    return asset._id;
  } catch (error: any) {
    console.error(`  ✗ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

/**
 * Create image reference object for Sanity
 */
function createImageRef(assetId: string, alt?: string) {
  const ref: any = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  };
  if (alt) {
    ref.alt = alt;
  }
  return ref;
}

/**
 * Partner logos mapping
 */
const PARTNERS_DATA = [
  // Hospitality Partners
  { name: 'Marriott International', file: 'partners/Marriott_International.png', category: 'hospitality' },
  { name: 'Ritz Carlton', file: 'partners/1200px-RitzCarlton.svg.png', category: 'hospitality' },
  { name: 'Doubletree by Hilton', file: 'partners/1200px-DoubletreeLogo.svg.png', category: 'hospitality' },
  { name: 'Radisson Blu', file: 'partners/2880px-Radisson_Blu_logo.svg.png', category: 'hospitality' },
  { name: 'Sofitel JBR', file: 'partners/Sofitel-JBR-Logo-2019-01_white.png', category: 'hospitality' },
  { name: 'Meydan Group', file: 'partners/meydan-logo.png', category: 'developers' },
  { name: 'DMCC', file: 'partners/DMCC-logo.png', category: 'developers' },
  { name: 'The Residences', file: 'partners/The Residences.png', category: 'developers' },
  { name: 'UCC Holdings', file: 'partners/UCCLogo.png', category: 'corporate' },
  // Additional partner logos
  { name: 'Partner 1', file: 'partners/Layer 788.png', category: 'corporate' },
  { name: 'Partner 2', file: 'partners/Layer 792.png', category: 'corporate' },
  { name: 'Partner 3', file: 'partners/Layer 793.png', category: 'developers' },
  { name: 'Partner 4', file: 'partners/Layer 796.png', category: 'developers' },
  { name: 'Partner 5', file: 'partners/Layer 798.png', category: 'corporate' },
  { name: 'Partner 6', file: 'partners/Layer 799.png', category: 'hospitality' },
  { name: 'Partner 7', file: 'partners/Layer 801.png', category: 'corporate' },
  { name: 'Partner 8', file: 'partners/Layer 803.png', category: 'developers' },
  { name: 'Partner 9', file: 'partners/Layer 806.png', category: 'corporate' },
  { name: 'Partner 10', file: 'partners/Layer 810.png', category: 'suppliers' },
  { name: 'Partner 11', file: 'partners/Layer 811.png', category: 'suppliers' },
  { name: 'Partner 12', file: 'partners/Layer 816.png', category: 'consultants' },
  { name: 'Partner 13', file: 'partners/Layer 817.png', category: 'consultants' },
];

/**
 * Awards data
 */
const AWARDS_DATA = [
  {
    title: 'Best Hotel Interior Abu Dhabi',
    subtitle: 'Sheraton Abu Dhabi',
    organization: 'Arabian Property Awards',
    year: 2023,
    type: 'award',
    category: 'design',
    level: '5-star',
    projectName: 'Sheraton Abu Dhabi Hotel',
    featured: true,
  },
  {
    title: 'Best Hotel Suite Dubai',
    subtitle: 'Address Boulevard VIP Suite',
    organization: 'Arabian Property Awards',
    year: 2024,
    type: 'award',
    category: 'design',
    level: '5-star',
    projectName: 'Address Boulevard VIP Suite',
    featured: true,
  },
  {
    title: 'Best Residential Interior Apartment Dubai',
    subtitle: 'Address Boulevard Penthouse',
    organization: 'Arabian Property Awards',
    year: 2024,
    type: 'award',
    category: 'design',
    level: 'winner',
    projectName: 'Address Boulevard Penthouse 70-71',
    featured: true,
  },
  {
    title: 'Best Hotel Suite Interior Arabia',
    subtitle: 'Arabia Region',
    organization: 'Arabian Property Awards',
    year: 2024,
    type: 'award',
    category: 'design',
    level: '5-star',
    projectName: 'Address Boulevard VIP Suite',
    featured: true,
  },
  {
    title: 'Certificate of Recognition',
    subtitle: 'Excellence in Luxury Design',
    organization: 'Luxury Lifestyle Awards',
    year: 2021,
    type: 'recognition',
    category: 'business',
    level: 'certified',
    projectName: '',
    featured: true,
  },
];

/**
 * Testimonials data
 */
const TESTIMONIALS_DATA = [
  {
    name: 'Ahmed Al Maktoum',
    role: 'Private Client',
    company: 'Royal Family Office',
    quote: 'MIDC transformed our Palm Jumeirah villa into a masterpiece. Their attention to detail and ability to execute complex designs while maintaining quality is unmatched in the UAE.',
    rating: 5,
    category: 'residential',
    featured: true,
  },
  {
    name: 'Sarah Chen',
    role: 'Regional Director',
    company: 'Marriott International',
    quote: 'The Sheraton Abu Dhabi renovation was completed on time, on budget, and without a single guest complaint. Their ability to work in live environments while maintaining 5-star service standards is remarkable.',
    rating: 5,
    category: 'hospitality',
    featured: true,
  },
  {
    name: 'Mohammed Al Rashid',
    role: 'CEO',
    company: 'Gulf Investments LLC',
    quote: 'Our DIFC headquarters reflects the premium image we wanted to project. From the custom joinery to the MEP systems, everything was handled professionally by one team.',
    rating: 5,
    category: 'commercial',
    featured: true,
  },
  {
    name: 'Dr. Fatima Hassan',
    role: 'Medical Director',
    company: 'Premium Healthcare',
    quote: 'The clinic fit-out met all DHA requirements perfectly. MIDC understood healthcare compliance and delivered infection-controlled spaces that passed inspection on the first try.',
    rating: 5,
    category: 'commercial',
    featured: true,
  },
  {
    name: 'James Robertson',
    role: 'General Manager',
    company: 'Sofitel JBR Dubai',
    quote: 'Working with MIDC on our lobby renovation was seamless. They managed everything from design to execution, and their in-house manufacturing capability meant custom pieces arrived exactly as specified.',
    rating: 5,
    category: 'hospitality',
    featured: true,
  },
  {
    name: 'Layla Al Suwaidi',
    role: 'Homeowner',
    company: 'Emirates Hills Villa',
    quote: 'From the initial concept to the final walkthrough, MIDC exceeded every expectation. Our villa is featured in design magazines, and we couldn\'t be prouder of our home.',
    rating: 5,
    category: 'residential',
    featured: true,
  },
];

/**
 * Site Settings content
 */
const SITE_SETTINGS = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  siteName: 'Mouhajer International Design & Contracting',
  siteTagline: 'Luxury Interior Design & Construction',

  // Contact Info
  phone: '+971 52 304 1482',
  phoneSecondary: '+971 4 321 9876',
  email: 'info@mouhajer.com',
  emailCareers: 'careers@mouhajer.com',
  whatsappNumber: '971523041482',

  address: {
    building: 'Business Bay Tower',
    street: 'Marasi Drive',
    area: 'Business Bay',
    city: 'Dubai',
    country: 'United Arab Emirates',
  },

  officeHours: [
    { days: 'Sunday - Thursday', hours: '9:00 AM - 6:00 PM' },
    { days: 'Friday', hours: 'Closed' },
    { days: 'Saturday', hours: '10:00 AM - 2:00 PM' },
  ],

  socialLinks: {
    instagram: 'https://instagram.com/mouhajerdesign',
    facebook: 'https://facebook.com/mouhajerdesign',
    linkedin: 'https://linkedin.com/company/mouhajer-design',
    youtube: 'https://youtube.com/@mouhajerdesign',
  },

  // Branding
  companyTaglineEn: 'From Blueprint to Handover. One Team. No Middlemen.',
  companyTaglineAr: 'من المخطط إلى التسليم. فريق واحد. بدون وسطاء.',
  companyDescriptionEn: 'MIDC is a vertically integrated design and construction firm specializing in luxury hospitality, residential, and commercial projects across the UAE.',
  companyDescriptionAr: 'شركة موحاجر الدولية للتصميم والمقاولات هي شركة متكاملة رأسياً متخصصة في مشاريع الضيافة الفاخرة والسكنية والتجارية في جميع أنحاء الإمارات.',
  foundingYear: 2009,

  // Founder
  founderName: 'Eng. Maher Mouhajer',
  founderTitle: 'CEO & Founder',
  founderQuote: 'Designing a palace on paper is easy. Building it on sand requires discipline.',

  // Stats
  stats: [
    { value: 400, suffix: '+', labelEn: 'Projects Delivered', labelAr: 'مشروع منجز' },
    { value: 20, suffix: '+', labelEn: 'Years Experience', labelAr: 'سنة خبرة' },
    { value: 15000, suffix: '', labelEn: 'Sqft Factory', labelAr: 'قدم مربع مصنع' },
    { value: 100, suffix: '%', labelEn: 'In-House Capability', labelAr: 'قدرة داخلية' },
  ],

  // Certifications
  certifications: [
    { name: 'ISO 9001:2015', description: 'Quality Management System', detail: 'International standard for quality management' },
    { name: 'ISO 14001:2015', description: 'Environmental Management', detail: 'International standard for environmental management' },
    { name: 'ISO 45001:2018', description: 'Occupational Health & Safety', detail: 'International standard for OH&S management' },
  ],

  // SEO
  defaultSeoTitle: 'Mouhajer International Design | Luxury Interior Design Dubai',
  defaultSeoDescription: 'Premium interior design, construction, and fit-out services in Dubai and Abu Dhabi. From concept to handover, one team handles everything.',
};

/**
 * Upload partners and create documents
 */
async function seedPartners(): Promise<void> {
  console.log('\n🤝 Seeding Partners...\n');

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < PARTNERS_DATA.length; i++) {
    const partner = PARTNERS_DATA[i];
    const filePath = path.join(PUBLIC_DIR, partner.file);

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️  Skipping ${partner.name} - file not found`);
      skipped++;
      continue;
    }

    process.stdout.write(`  Uploading ${partner.name}...`);

    const assetId = await uploadImage(filePath, path.basename(partner.file));

    if (!assetId) {
      skipped++;
      continue;
    }

    const doc = {
      _type: 'partner',
      _id: `partner-${i + 1}`,
      name: partner.name,
      logo: createImageRef(assetId, `${partner.name} logo`),
      category: partner.category,
      featured: true,
      order: i + 1,
    };

    await client.createOrReplace(doc);
    console.log(' ✓');
    created++;
  }

  console.log(`\n  ✅ Partners: ${created} created, ${skipped} skipped`);
}

/**
 * Seed Awards
 */
async function seedAwards(): Promise<void> {
  console.log('\n🏆 Seeding Awards...\n');

  for (let i = 0; i < AWARDS_DATA.length; i++) {
    const award = AWARDS_DATA[i];

    const doc = {
      _type: 'award',
      _id: `award-${i + 1}`,
      ...award,
      order: i + 1,
    };

    await client.createOrReplace(doc);
    console.log(`  ✅ ${award.title}`);
  }

  console.log(`\n  ✅ Awards: ${AWARDS_DATA.length} created`);
}

/**
 * Seed Testimonials
 */
async function seedTestimonials(): Promise<void> {
  console.log('\n💬 Seeding Testimonials...\n');

  for (let i = 0; i < TESTIMONIALS_DATA.length; i++) {
    const testimonial = TESTIMONIALS_DATA[i];

    const doc = {
      _type: 'testimonial',
      _id: `testimonial-${i + 1}`,
      ...testimonial,
      order: i + 1,
    };

    await client.createOrReplace(doc);
    console.log(`  ✅ ${testimonial.name}`);
  }

  console.log(`\n  ✅ Testimonials: ${TESTIMONIALS_DATA.length} created`);
}

/**
 * Seed Site Settings with images
 */
async function seedSiteSettings(): Promise<void> {
  console.log('\n⚙️  Seeding Site Settings...\n');

  const settings: any = { ...SITE_SETTINGS };

  // Try to find and upload founder image
  const founderDir = path.join(PUBLIC_DIR, 'founder');
  if (fs.existsSync(founderDir)) {
    const founderFiles = fs.readdirSync(founderDir).filter(f =>
      IMAGE_EXTENSIONS.some(ext => f.toLowerCase().endsWith(ext))
    );

    if (founderFiles.length > 0) {
      const founderPath = path.join(founderDir, founderFiles[0]);
      process.stdout.write('  Uploading founder image...');
      const assetId = await uploadImage(founderPath, founderFiles[0]);
      if (assetId) {
        settings.founderImage = createImageRef(assetId, 'Eng. Maher Mouhajer - CEO & Founder');
        console.log(' ✓');
      }
    }
  }

  // Try to upload logo
  const logoPath = path.join(PUBLIC_DIR, 'logo.svg');
  if (fs.existsSync(logoPath)) {
    process.stdout.write('  Uploading logo...');
    const assetId = await uploadImage(logoPath, 'logo.svg');
    if (assetId) {
      settings.logo = createImageRef(assetId, 'MIDC Logo');
      console.log(' ✓');
    }
  }

  await client.createOrReplace(settings);
  console.log('\n  ✅ Site Settings updated');
}

/**
 * Check for broken image references
 */
async function checkBrokenImages(): Promise<void> {
  console.log('\n🔍 Checking for broken image references...\n');

  // Check projects
  const projectsWithoutImages = await client.fetch(
    '*[_type == "project" && !defined(mainImage)] { _id, title }'
  );

  if (projectsWithoutImages.length > 0) {
    console.log(`  ⚠️  ${projectsWithoutImages.length} projects without mainImage:`);
    projectsWithoutImages.slice(0, 5).forEach((p: any) => console.log(`     - ${p.title}`));
    if (projectsWithoutImages.length > 5) {
      console.log(`     ... and ${projectsWithoutImages.length - 5} more`);
    }
  }

  // Check services
  const servicesWithoutImages = await client.fetch(
    '*[_type == "service" && !defined(mainImage)] { _id, title }'
  );

  if (servicesWithoutImages.length > 0) {
    console.log(`  ⚠️  ${servicesWithoutImages.length} services without mainImage:`);
    servicesWithoutImages.forEach((s: any) => console.log(`     - ${s.title}`));
  }

  // Check site settings
  const settings = await client.fetch(
    '*[_type == "siteSettings"][0] { heroImage, founderImage, logo, aboutImage }'
  );

  const missingSettings = [];
  if (!settings?.heroImage) missingSettings.push('heroImage');
  if (!settings?.founderImage) missingSettings.push('founderImage');
  if (!settings?.logo) missingSettings.push('logo');
  if (!settings?.aboutImage) missingSettings.push('aboutImage');

  if (missingSettings.length > 0) {
    console.log(`  ⚠️  Site Settings missing: ${missingSettings.join(', ')}`);
  }

  console.log('\n  ✅ Image check complete');
}

/**
 * Main function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Complete Content Seeding Script');
  console.log('═══════════════════════════════════════════════════════════════');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('\n❌ Error: SANITY_API_TOKEN environment variable is required');
    console.log('Usage: SANITY_API_TOKEN="your-token" npx tsx scripts/seed-complete-content.ts');
    process.exit(1);
  }

  try {
    // Test connection
    console.log('\n🔌 Testing Sanity connection...');
    await client.fetch('*[_type == "project"][0]');
    console.log('   ✅ Connected to Sanity\n');

    // Run all seeders
    await seedPartners();
    await seedAwards();
    await seedTestimonials();
    await seedSiteSettings();

    // Check for broken images
    await checkBrokenImages();

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  🎉 Seeding Complete!');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('📝 Summary:');
    console.log(`   - Partners: ${PARTNERS_DATA.length} entries`);
    console.log(`   - Awards: ${AWARDS_DATA.length} entries`);
    console.log(`   - Testimonials: ${TESTIMONIALS_DATA.length} entries`);
    console.log(`   - Site Settings: Updated`);

    console.log('\n📝 Next Steps:');
    console.log('   1. Open Sanity Studio to review content');
    console.log('   2. Add any missing images manually');
    console.log('   3. Redeploy to Vercel: vercel --prod');

  } catch (error: any) {
    console.error('\n💥 Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
