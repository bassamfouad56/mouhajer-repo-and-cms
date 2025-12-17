/**
 * Script to update industry images from actual Sanity projects
 *
 * Usage:
 *   node scripts/update-industry-images.mjs
 *
 * Or with --force to update all images (even existing ones):
 *   node scripts/update-industry-images.mjs --force
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables from .env.local
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.substring(0, eqIndex).trim();
          let value = trimmed.substring(eqIndex + 1).trim();
          // Remove surrounding quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          envVars[key] = value;
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error('Error loading .env.local:', error.message);
    return {};
  }
}

const envVars = loadEnvFile();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || envVars.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || envVars.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || envVars.SANITY_API_TOKEN;

// Check for --force flag
const forceUpdate = process.argv.includes('--force');

// Sanity client configuration - read client (no token needed)
const readClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Write client (needs token)
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

// Mapping of industry slugs to project category keywords
// Note: healthcare and education have been removed from Sanity
const INDUSTRY_TO_PROJECT_CATEGORY = {
  hospitality: ['hospitality', 'hotel', 'resort', 'spa'],
  residential: ['residential', 'villa', 'apartment', 'penthouse', 'home'],
  commercial: ['commercial', 'office', 'corporate', 'business'],
  retail: ['retail', 'store', 'shop', 'mall', 'f&b', 'restaurant'],
  'food-beverage': ['f&b', 'restaurant', 'cafe', 'dining'],
  corporate: ['corporate', 'office', 'headquarters'],
};

async function main() {
  console.log('\n' + '='.repeat(50));
  console.log('  Industry Image Update Script');
  console.log('  (Using actual project images from Sanity)');
  console.log('='.repeat(50));

  if (!token) {
    console.error('\n❌ SANITY_API_TOKEN is required!\n');
    console.log('Add to .env.local:');
    console.log('  SANITY_API_TOKEN=your-token-here\n');
    process.exit(1);
  }

  if (!projectId) {
    console.error('\n❌ NEXT_PUBLIC_SANITY_PROJECT_ID is required!\n');
    process.exit(1);
  }

  console.log(`\nProject: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Force update: ${forceUpdate ? 'Yes' : 'No'}`);

  // Fetch all industries
  console.log('\nFetching industries...');
  const industries = await readClient.fetch(`
    *[_type == "industry"] {
      _id,
      title,
      "slug": slug.current,
      mainImage
    }
  `);

  if (!industries?.length) {
    console.log('No industries found.');
    return;
  }

  // Fetch all projects with images
  console.log('Fetching projects...');
  const projects = await readClient.fetch(`
    *[_type == "project" && defined(mainImage.asset)] {
      _id,
      title,
      "category": coalesce(
        category,
        sector->slug.current,
        projectType->slug.current
      ),
      mainImage,
      featured,
      publishedAt
    } | order(featured desc, publishedAt desc)
  `);

  console.log(`Found ${industries.length} industries, ${projects.length} projects with images\n`);

  // Group projects by category
  const projectsByCategory = {};
  projects.forEach(project => {
    const cat = (project.category || '').toLowerCase();
    if (!projectsByCategory[cat]) {
      projectsByCategory[cat] = [];
    }
    projectsByCategory[cat].push(project);
  });

  console.log('Projects by category:');
  Object.entries(projectsByCategory).forEach(([cat, projs]) => {
    console.log(`  ${cat || '(uncategorized)'}: ${projs.length} projects`);
  });

  // Process each industry
  const processedSlugs = new Set();
  let updated = 0, skipped = 0;

  console.log('\n' + '-'.repeat(50));

  for (const industry of industries) {
    const slug = industry.slug || 'unknown';
    const title = typeof industry.title === 'string'
      ? industry.title
      : industry.title?.en || slug;

    // Skip duplicates
    if (processedSlugs.has(slug)) {
      continue;
    }
    processedSlugs.add(slug);

    console.log(`\n[${slug}] ${title}`);

    // Skip if has image (unless --force)
    if (industry.mainImage?.asset && !forceUpdate) {
      console.log('  ⏭️  Has image - skipping (use --force to update)');
      skipped++;
      continue;
    }

    // Find matching project
    const categoryKeywords = INDUSTRY_TO_PROJECT_CATEGORY[slug] || [slug];
    let matchingProject = null;

    for (const keyword of categoryKeywords) {
      // Direct category match
      if (projectsByCategory[keyword]?.length > 0) {
        matchingProject = projectsByCategory[keyword][0];
        break;
      }

      // Partial match
      for (const [cat, projs] of Object.entries(projectsByCategory)) {
        if (cat.includes(keyword) || keyword.includes(cat)) {
          matchingProject = projs[0];
          break;
        }
      }
      if (matchingProject) break;
    }

    if (!matchingProject) {
      console.log(`  ⚠️  No matching project found for categories: ${categoryKeywords.join(', ')}`);
      skipped++;
      continue;
    }

    const projectTitle = typeof matchingProject.title === 'string'
      ? matchingProject.title
      : matchingProject.title?.en || 'Unknown';

    console.log(`  📸 Using image from: "${projectTitle}"`);

    // Update industry with project's image
    try {
      await writeClient
        .patch(industry._id)
        .set({
          mainImage: matchingProject.mainImage,
        })
        .commit();

      console.log('  ✅ Updated!');
      updated++;
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`  Updated: ${updated} | Skipped: ${skipped}`);
  console.log('='.repeat(50) + '\n');
}

main().catch(console.error);
