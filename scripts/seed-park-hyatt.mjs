#!/usr/bin/env node
/**
 * Seed Park Hyatt Villa Project Images to Sanity
 *
 * This script:
 * 1. Compresses images from external drive
 * 2. Uploads to Sanity
 * 3. Updates the dubai-creek-residence project
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
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

const PROJECT_SLUG = 'dubai-creek-residence';
const SOURCE_DIR = '/Volumes/lacie 1/bassam/our projects page/7 hotel park hyatt villa';
const TEMP_DIR = '/tmp/park-hyatt-compressed';

// Select best images (representative of different areas)
const SELECTED_IMAGES = [
  'hotelparkhyattvilla01.jpg', // Cover/entrance
  'hotelparkhyattvilla02.jpg',
  'hotelparkhyattvilla05.jpg',
  'hotelparkhyattvilla08.jpg',
  'hotelparkhyattvilla10.jpg',
  'hotelparkhyattvilla12.jpg',
  'hotelparkhyattvilla15.jpg',
  'hotelparkhyattvilla18.jpg',
  'hotelparkhyattvilla20.jpg',
  'hotelparkhyattvilla22.jpg',
  'hotelparkhyattvilla25.jpg',
  'hotelparkhyattvilla28.jpg',
  'hotelparkhyattvilla30.jpg',
  'hotelparkhyattvilla33.jpg',
  'hotelparkhyattvilla35.jpg',
  'hotelparkhyattvilla38.jpg',
  'hotelparkhyattvilla40.jpg',
  'hotelparkhyattvilla43.jpg',
  'hotelparkhyattvilla45.jpg',
  'hotelparkhyattvilla50.jpg',
];

async function compressImages() {
  console.log('📦 Compressing images...\n');

  // Create temp directory
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const compressed = [];

  for (const filename of SELECTED_IMAGES) {
    const sourcePath = path.join(SOURCE_DIR, filename);
    const outputFilename = filename.replace('.jpg', '.webp');
    const outputPath = path.join(TEMP_DIR, outputFilename);

    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Source not found: ${filename}`);
      continue;
    }

    try {
      // Use sips (macOS built-in) for resizing, then convert to webp
      // First resize to max 2000px width
      const tempResized = path.join(TEMP_DIR, `temp_${filename}`);

      // Copy and resize with sips
      execSync(`sips -Z 2000 "${sourcePath}" --out "${tempResized}" 2>/dev/null`, { stdio: 'pipe' });

      // Convert to WebP with cwebp (or use sips if available)
      try {
        execSync(`cwebp -q 82 "${tempResized}" -o "${outputPath}" 2>/dev/null`, { stdio: 'pipe' });
      } catch {
        // Fallback: just copy as JPEG if cwebp not installed
        fs.copyFileSync(tempResized, outputPath.replace('.webp', '.jpg'));
        compressed.push({ filename: outputFilename.replace('.webp', '.jpg'), path: outputPath.replace('.webp', '.jpg') });
        console.log(`✅ Compressed (JPEG): ${filename}`);
        fs.unlinkSync(tempResized);
        continue;
      }

      fs.unlinkSync(tempResized);
      compressed.push({ filename: outputFilename, path: outputPath });
      console.log(`✅ Compressed: ${filename} → ${outputFilename}`);
    } catch (error) {
      console.error(`❌ Failed to compress ${filename}:`, error.message);
    }
  }

  return compressed;
}

async function uploadImage(filePath, filename) {
  const imageBuffer = fs.readFileSync(filePath);
  const contentType = filename.endsWith('.webp') ? 'image/webp' : 'image/jpeg';

  try {
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
      contentType: contentType,
    });

    console.log(`✅ Uploaded: ${filename}`);
    return asset;
  } catch (error) {
    console.error(`❌ Failed to upload ${filename}:`, error.message);
    return null;
  }
}

async function findProjectBySlug(slug) {
  const query = `*[_type == "project" && slug.current == $slug][0]{ _id, title, slug, gallery }`;
  return await client.fetch(query, { slug });
}

async function updateProjectGallery(projectId, galleryRefs) {
  try {
    await client.patch(projectId)
      .set({
        gallery: galleryRefs,
      })
      .commit();

    console.log(`✅ Updated project gallery with ${galleryRefs.length} images`);
    return true;
  } catch (error) {
    console.error('❌ Failed to update project:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Park Hyatt Villa image seeding...\n');
  console.log(`   Source: ${SOURCE_DIR}`);
  console.log(`   Target project: ${PROJECT_SLUG}\n`);

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is not set!');
    console.error('   Add it to .env.local or set it in your environment');
    process.exit(1);
  }

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    console.error('   Make sure the external drive is connected');
    process.exit(1);
  }

  // Step 1: Compress images
  const compressedImages = await compressImages();

  if (compressedImages.length === 0) {
    console.error('❌ No images were compressed');
    process.exit(1);
  }

  console.log(`\n📷 Compressed ${compressedImages.length} images\n`);

  // Step 2: Find project
  console.log(`🔍 Looking for project: ${PROJECT_SLUG}`);
  const project = await findProjectBySlug(PROJECT_SLUG);

  if (!project) {
    console.error(`❌ Project not found: ${PROJECT_SLUG}`);
    const allProjects = await client.fetch('*[_type == "project"]{ _id, title, "slug": slug.current }');
    console.log('\n📝 Available projects:');
    allProjects.slice(0, 10).forEach(p => console.log(`  - ${p.slug}: ${typeof p.title === 'object' ? p.title.en : p.title}`));
    process.exit(1);
  }

  console.log(`✅ Found project: ${typeof project.title === 'object' ? project.title.en : project.title} (${project._id})\n`);

  // Step 3: Upload images
  const BATCH_SIZE = 3;
  const uploadedAssets = [];

  for (let i = 0; i < compressedImages.length; i += BATCH_SIZE) {
    const batch = compressedImages.slice(i, i + BATCH_SIZE);
    console.log(`\n📤 Uploading batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(compressedImages.length / BATCH_SIZE)}`);

    const batchPromises = batch.map(img => uploadImage(img.path, img.filename));

    const results = await Promise.all(batchPromises);
    uploadedAssets.push(...results.filter(Boolean));

    if (i + BATCH_SIZE < compressedImages.length) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n✅ Successfully uploaded ${uploadedAssets.length}/${compressedImages.length} images\n`);

  // Step 4: Update project gallery
  const galleryRefs = uploadedAssets.map((asset, index) => ({
    _type: 'image',
    _key: `parkhyatt_${index}_${Date.now()}`,
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
    alt: `Park Hyatt Villa - Image ${index + 1}`,
  }));

  console.log('📝 Updating project gallery...');
  const success = await updateProjectGallery(project._id, galleryRefs);

  if (success) {
    console.log('\n🎉 Successfully seeded Park Hyatt Villa project!');
    console.log(`   Total images: ${uploadedAssets.length}`);
    console.log(`   Project: ${typeof project.title === 'object' ? project.title.en : project.title}`);
    console.log(`   URL: http://localhost:4050/en/projects/${PROJECT_SLUG}`);
  }

  // Cleanup temp files
  console.log('\n🧹 Cleaning up temp files...');
  try {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
    console.log('✅ Temp files cleaned up');
  } catch (e) {
    console.log('⚠️  Could not clean up temp files');
  }
}

main().catch(console.error);
