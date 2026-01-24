#!/usr/bin/env node
/**
 * Seed Awards to Sanity
 *
 * This script populates the Sanity database with all awards
 * from public/awards folder
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} catch (e) {
  console.log('Note: Could not load .env.local');
}

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

// All awards data based on PDF files in public/awards
const awardsData = [
  {
    _type: 'award',
    title: 'Best Hotel Suite Interior Dubai',
    type: 'award',
    organization: 'International Property Awards',
    year: 2024,
    level: '5-Star',
    category: 'design',
    projectName: 'Address Boulevard VIP Suite',
    subtitle: 'Recognized for exceptional luxury interior design in hospitality',
    description: 'Awarded for outstanding hotel suite design showcasing bespoke craftsmanship, attention to detail, and world-class luxury interior execution.',
    certificatePath: '/awards/APA - 2023-2024 Best Hotel Suite Interior Dubai - Address Boulevard VIP Suite.pdf',
    featured: true,
    order: 1,
  },
  {
    _type: 'award',
    title: 'Best Hotel Suite Interior Arabia',
    type: 'award',
    organization: 'International Property Awards',
    year: 2024,
    level: '5-Star',
    category: 'design',
    projectName: 'Address Boulevard VIP Suite',
    subtitle: 'Regional recognition for outstanding hotel suite design across Arabia',
    description: 'Regional winner celebrating excellence in luxury hospitality design across the Arabia region.',
    certificatePath: '/awards/APA - 2023-2024 Best Hotel Suite Interior Arabia - Address Boulevard VIP Suite.pdf',
    featured: true,
    order: 2,
  },
  {
    _type: 'award',
    title: 'Best Residential Interior Apartment Dubai',
    type: 'award',
    organization: 'International Property Awards',
    year: 2024,
    level: '5-Star',
    category: 'design',
    projectName: 'Address Boulevard Penthouse 70-71',
    subtitle: 'Excellence in luxury residential interior design',
    description: 'Recognized for exceptional residential interior design featuring Fendi-inspired joinery and smart home integration.',
    certificatePath: '/awards/APA - 2023-2024 Best Residential Interior Apartment Dubai - Address Boulevard Penthouse 70-71.pdf',
    featured: true,
    order: 3,
  },
  {
    _type: 'award',
    title: 'Award Winner Hotel Suite Dubai',
    type: 'award',
    organization: 'International Property Awards',
    year: 2024,
    level: 'Winner',
    category: 'design',
    projectName: 'Address Boulevard VIP Suite',
    subtitle: 'Award Winner for Hotel Suite category in Dubai',
    description: 'Awarded winner status for exceptional hotel suite design and execution.',
    certificatePath: '/awards/APA - 2023-2024 Award Winner for Hotel Suite Dubai - Address Boulevard VIP Suite.pdf',
    featured: false,
    order: 4,
  },
  {
    _type: 'award',
    title: 'Award Winner Residential Interior Apartment Dubai',
    type: 'award',
    organization: 'International Property Awards',
    year: 2024,
    level: 'Winner',
    category: 'design',
    projectName: 'Address Boulevard Penthouse 70-71',
    subtitle: 'Award Winner for Residential Interior Apartment category in Dubai',
    description: 'Awarded winner status for exceptional residential interior design.',
    certificatePath: '/awards/APA - 2023-2024 Award Winner for Residential Interior Apartment Dubai - Address Boulevard Penthouse 70-71.pdf',
    featured: false,
    order: 5,
  },
  {
    _type: 'award',
    title: 'Best Hotel Interior Abu Dhabi',
    type: 'award',
    organization: 'International Property Awards',
    year: 2023,
    level: '5-Star',
    category: 'design',
    projectName: 'Sheraton Abu Dhabi Hotel & Resort',
    subtitle: 'Honored for exceptional full hotel interior renovation',
    description: 'Recognized for exceptional full hotel interior renovation, delivered on time while maintaining guest operations.',
    certificatePath: '/awards/APA - 2022-2023 Best Hotel Interior Abu Dhabi - Sheraton Abu Dhabi (2).pdf',
    featured: true,
    order: 6,
  },
  {
    _type: 'award',
    title: 'Certificate of Recognition',
    type: 'recognition',
    organization: 'Luxury Lifestyle Awards',
    year: 2021,
    level: 'Winner',
    category: 'business',
    projectName: 'MIDC Excellence',
    subtitle: 'Recognition for excellence in luxury construction and design',
    description: 'Recognition for excellence in luxury construction and design, honoring 25+ years of industry leadership.',
    certificatePath: '/awards/Luxury Lifestyle - 2021 Certificate of Recognition.pdf',
    featured: true,
    order: 7,
  },
];

async function deleteExistingAwards() {
  console.log('🗑️  Deleting existing awards...');

  try {
    const existingAwards = await client.fetch('*[_type == "award"]{ _id }');

    if (existingAwards.length === 0) {
      console.log('   No existing awards to delete');
      return;
    }

    for (const award of existingAwards) {
      await client.delete(award._id);
    }

    console.log(`   Deleted ${existingAwards.length} existing awards`);
  } catch (error) {
    console.error('❌ Error deleting awards:', error.message);
  }
}

async function createAward(award) {
  try {
    const result = await client.create(award);
    console.log(`✅ Created: ${award.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Failed to create ${award.title}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🏆 Starting Awards Seeding...\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is not set!');
    console.error('   Add it to .env.local or set it in your environment');
    process.exit(1);
  }

  // Delete existing awards first
  await deleteExistingAwards();

  console.log('\n📝 Creating new awards...\n');

  // Create all awards
  const createdAwards = [];
  for (const award of awardsData) {
    const result = await createAward(award);
    if (result) {
      createdAwards.push(result);
    }
    // Small delay between creations
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n🎉 Successfully created ${createdAwards.length}/${awardsData.length} awards!`);
  console.log('\n📋 Summary:');
  createdAwards.forEach((award, index) => {
    console.log(`   ${index + 1}. ${award.title} (${award.year})`);
  });
}

main().catch(console.error);
