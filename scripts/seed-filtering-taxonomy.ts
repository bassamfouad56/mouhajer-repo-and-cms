/**
 * Seed Sanity with Industries, Project Types, and Locations for Advanced Filtering
 * Run with: npx tsx scripts/seed-filtering-taxonomy.ts
 */

import { client } from '../sanity/lib/client';

// Industries (Sectors)
const industries = [
  {
    _type: 'industry',
    title: 'Residential',
    slug: { _type: 'slug', current: 'residential' },
    excerpt: 'Luxury residential projects including villas, apartments, penthouses, and palaces across the UAE',
    icon: 'Building',
    featured: true,
    order: 1,
  },
  {
    _type: 'industry',
    title: 'Commercial',
    slug: { _type: 'slug', current: 'commercial' },
    excerpt: 'Commercial interior design including offices, retail spaces, showrooms, and corporate environments',
    icon: 'Building2',
    featured: true,
    order: 2,
  },
  {
    _type: 'industry',
    title: 'Hospitality',
    slug: { _type: 'slug', current: 'hospitality' },
    excerpt: 'Hospitality projects including hotels, restaurants, cafes, spas, and leisure spaces',
    icon: 'Hotel',
    featured: true,
    order: 3,
  },
];

// Project Types
const projectTypes = [
  // Residential Types
  { _type: 'projectType', title: 'Villa', slug: { _type: 'slug', current: 'villa' }, sector: 'residential', order: 1 },
  { _type: 'projectType', title: 'Apartment', slug: { _type: 'slug', current: 'apartment' }, sector: 'residential', order: 2 },
  { _type: 'projectType', title: 'Penthouse', slug: { _type: 'slug', current: 'penthouse' }, sector: 'residential', order: 3 },
  { _type: 'projectType', title: 'Townhouse', slug: { _type: 'slug', current: 'townhouse' }, sector: 'residential', order: 4 },
  { _type: 'projectType', title: 'Palace', slug: { _type: 'slug', current: 'palace' }, sector: 'residential', order: 5 },

  // Commercial Types
  { _type: 'projectType', title: 'Office', slug: { _type: 'slug', current: 'office' }, sector: 'commercial', order: 6 },
  { _type: 'projectType', title: 'Retail Store', slug: { _type: 'slug', current: 'retail-store' }, sector: 'commercial', order: 7 },
  { _type: 'projectType', title: 'Showroom', slug: { _type: 'slug', current: 'showroom' }, sector: 'commercial', order: 8 },
  { _type: 'projectType', title: 'Medical Clinic', slug: { _type: 'slug', current: 'medical-clinic' }, sector: 'commercial', order: 9 },
  { _type: 'projectType', title: 'Educational', slug: { _type: 'slug', current: 'educational' }, sector: 'commercial', order: 10 },

  // Hospitality Types
  { _type: 'projectType', title: 'Hotel', slug: { _type: 'slug', current: 'hotel' }, sector: 'hospitality', order: 11 },
  { _type: 'projectType', title: 'Restaurant', slug: { _type: 'slug', current: 'restaurant' }, sector: 'hospitality', order: 12 },
  { _type: 'projectType', title: 'Cafe', slug: { _type: 'slug', current: 'cafe' }, sector: 'hospitality', order: 13 },
  { _type: 'projectType', title: 'Bar & Lounge', slug: { _type: 'slug', current: 'bar-lounge' }, sector: 'hospitality', order: 14 },
  { _type: 'projectType', title: 'Spa', slug: { _type: 'slug', current: 'spa' }, sector: 'hospitality', order: 15 },
];

// Locations
const locations = [
  { _type: 'location', name: 'Dubai', slug: { _type: 'slug', current: 'dubai' }, type: 'city', featured: true, order: 1, countryCode: 'AE' },
  { _type: 'location', name: 'Abu Dhabi', slug: { _type: 'slug', current: 'abu-dhabi' }, type: 'city', featured: true, order: 2, countryCode: 'AE' },
  { _type: 'location', name: 'Sharjah', slug: { _type: 'slug', current: 'sharjah' }, type: 'city', featured: true, order: 3, countryCode: 'AE' },
  { _type: 'location', name: 'Ajman', slug: { _type: 'slug', current: 'ajman' }, type: 'city', order: 4, countryCode: 'AE' },
  { _type: 'location', name: 'Ras Al Khaimah', slug: { _type: 'slug', current: 'ras-al-khaimah' }, type: 'city', order: 5, countryCode: 'AE' },
  { _type: 'location', name: 'Fujairah', slug: { _type: 'slug', current: 'fujairah' }, type: 'city', order: 6, countryCode: 'AE' },
  { _type: 'location', name: 'Umm Al Quwain', slug: { _type: 'slug', current: 'umm-al-quwain' }, type: 'city', order: 7, countryCode: 'AE' },
];

async function seedTaxonomy() {
  console.log('🌱 Starting Sanity taxonomy seeding...\n');

  try {
    // Step 1: Create Industries
    console.log('📦 Creating Industries...');
    const createdIndustries: Record<string, string> = {};

    for (const industry of industries) {
      const result = await client.create(industry);
      createdIndustries[industry.slug.current] = result._id;
      console.log(`  ✅ Created: ${industry.title} (${result._id})`);
    }

    // Step 2: Create Project Types (with sector references)
    console.log('\n📦 Creating Project Types...');
    const createdProjectTypes: Record<string, string> = {};

    for (const projectType of projectTypes) {
      const sectorId = createdIndustries[projectType.sector];
      if (!sectorId) {
        console.log(`  ⚠️  Skipping ${projectType.title} - sector not found`);
        continue;
      }

      const result = await client.create({
        ...projectType,
        sector: {
          _type: 'reference',
          _ref: sectorId,
        },
      });
      createdProjectTypes[projectType.slug.current] = result._id;
      console.log(`  ✅ Created: ${projectType.title} → ${projectType.sector} (${result._id})`);
    }

    // Step 3: Create Locations
    console.log('\n📦 Creating Locations...');
    const createdLocations: Record<string, string> = {};

    for (const location of locations) {
      const result = await client.create(location);
      createdLocations[location.slug.current] = result._id;
      console.log(`  ✅ Created: ${location.name} (${result._id})`);
    }

    // Step 4: Update existing projects (if any)
    console.log('\n🔄 Checking for existing projects to update...');
    const existingProjects = await client.fetch(`*[_type == "project" && !defined(sector)][0...10]`);

    if (existingProjects.length > 0) {
      console.log(`  Found ${existingProjects.length} projects without sector. Updating first 10...`);

      // Distribute projects across sectors
      const sectors = ['residential', 'commercial', 'hospitality'];

      for (let i = 0; i < existingProjects.length; i++) {
        const project = existingProjects[i];
        const sectorSlug = sectors[i % sectors.length];
        const sectorId = createdIndustries[sectorSlug];

        // Pick a random project type for this sector
        const typesForSector = projectTypes.filter(pt => pt.sector === sectorSlug);
        const randomType = typesForSector[Math.floor(Math.random() * typesForSector.length)];
        const typeId = createdProjectTypes[randomType.slug.current];

        // Pick a random location
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const locationId = createdLocations[randomLocation.slug.current];

        await client
          .patch(project._id)
          .set({
            sector: { _type: 'reference', _ref: sectorId },
            projectType: { _type: 'reference', _ref: typeId },
            location: { _type: 'reference', _ref: locationId },
            status: i % 5 === 0 ? 'in-progress' : 'completed', // 20% in-progress
          })
          .commit();

        console.log(`  ✅ Updated: ${project.title?.en || project.title} → ${sectorSlug}/${randomType.title}/${randomLocation.name}`);
      }
    } else {
      console.log('  ℹ️  No projects found or all projects already have sectors.');
    }

    // Step 5: Summary
    console.log('\n✅ Seeding Complete!\n');
    console.log('📊 Summary:');
    console.log(`  - Industries: ${Object.keys(createdIndustries).length}`);
    console.log(`  - Project Types: ${Object.keys(createdProjectTypes).length}`);
    console.log(`  - Locations: ${Object.keys(createdLocations).length}`);
    console.log(`  - Updated Projects: ${Math.min(existingProjects.length, 10)}`);

    console.log('\n🎯 Next Steps:');
    console.log('  1. Visit your Sanity Studio to verify the data');
    console.log('  2. Update remaining projects manually or run this script again');
    console.log('  3. Test the filtering at: http://localhost:4050/en/projects');

    console.log('\n🧪 Test in Sanity Vision:');
    console.log('  *[_type == "industry"] { title, slug }');
    console.log('  *[_type == "project" && defined(sector)] | order(_createdAt desc) [0...5] {');
    console.log('    title,');
    console.log('    "sector": sector->title,');
    console.log('    "type": projectType->title,');
    console.log('    "location": location->name');
    console.log('  }');

  } catch (error) {
    console.error('\n❌ Error seeding taxonomy:', error);
    process.exit(1);
  }
}

// Run the seeding
seedTaxonomy();
