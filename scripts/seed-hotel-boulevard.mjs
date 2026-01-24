#!/usr/bin/env node
/**
 * Seed Hotel Boulevard Autograph Collection Project Images to Sanity
 *
 * This script:
 * 1. Finds all images in the Hotel Boulevard folder
 * 2. Compresses them
 * 3. Uploads to Sanity
 * 4. Updates the hotel-boulevard-autograph-collection project
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

const PROJECT_SLUG = 'hotel-boulevard-autograph-collection';
const SOURCE_DIR = '/Volumes/lacie 1/bassam/webp images/our projects page/9 HOTEL ADDRESS BOULEVARD VIP SUITE';
const TEMP_DIR = '/tmp/hotel-boulevard-compressed';
const MAX_IMAGES = 25; // Limit to best images

function findImagesInFolder(folderPath) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
  const images = [];

  try {
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      // Skip macOS resource fork files (starting with ._)
      if (file.startsWith('._') || file.startsWith('.')) continue;

      const ext = path.extname(file);
      if (imageExtensions.includes(ext)) {
        images.push(file);
      }
    }
    // Sort alphabetically/numerically
    images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  } catch (error) {
    console.error(`Error reading folder: ${error.message}`);
  }

  return images;
}

async function compressImages(imageFiles) {
  console.log('📦 Processing images...\n');

  // Create temp directory
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }

  const compressed = [];

  // Select evenly distributed images if we have more than MAX_IMAGES
  let selectedImages = imageFiles;
  if (imageFiles.length > MAX_IMAGES) {
    const step = Math.floor(imageFiles.length / MAX_IMAGES);
    selectedImages = [];
    for (let i = 0; i < imageFiles.length && selectedImages.length < MAX_IMAGES; i += step) {
      selectedImages.push(imageFiles[i]);
    }
    console.log(`📊 Selected ${selectedImages.length} images from ${imageFiles.length} total\n`);
  }

  for (const filename of selectedImages) {
    const sourcePath = path.join(SOURCE_DIR, filename);
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, path.extname(filename));

    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Source not found: ${filename}`);
      continue;
    }

    try {
      // If already WebP, just copy it (it's already optimized)
      if (ext === '.webp') {
        const outputPath = path.join(TEMP_DIR, filename);
        fs.copyFileSync(sourcePath, outputPath);
        compressed.push({ filename: filename, path: outputPath });
        console.log(`✅ Copied (already WebP): ${filename}`);
        continue;
      }

      // For JPG/PNG, resize and optionally convert to WebP
      const tempResized = path.join(TEMP_DIR, `temp_${baseName}.jpg`);
      const outputFilename = `${baseName}.webp`;
      const outputPath = path.join(TEMP_DIR, outputFilename);

      // Copy and resize with sips
      execSync(`sips -Z 2000 "${sourcePath}" --out "${tempResized}" 2>/dev/null`, { stdio: 'pipe' });

      // Convert to WebP with cwebp
      try {
        execSync(`cwebp -q 82 "${tempResized}" -o "${outputPath}" 2>/dev/null`, { stdio: 'pipe' });
        fs.unlinkSync(tempResized);
        compressed.push({ filename: outputFilename, path: outputPath });
        console.log(`✅ Compressed: ${filename} → ${outputFilename}`);
      } catch {
        // Fallback: just use the resized JPEG if cwebp not installed
        const jpegOutput = path.join(TEMP_DIR, `${baseName}.jpg`);
        fs.renameSync(tempResized, jpegOutput);
        compressed.push({ filename: `${baseName}.jpg`, path: jpegOutput });
        console.log(`✅ Compressed (JPEG): ${filename}`);
      }
    } catch (error) {
      console.error(`❌ Failed to process ${filename}:`, error.message);
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
  console.log('🚀 Starting Hotel Boulevard image seeding...\n');
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

  // Step 1: Find all images
  console.log('🔍 Finding images in source folder...');
  const imageFiles = findImagesInFolder(SOURCE_DIR);

  if (imageFiles.length === 0) {
    console.error('❌ No images found in source folder');
    process.exit(1);
  }

  console.log(`📷 Found ${imageFiles.length} images\n`);

  // Step 2: Compress images
  const compressedImages = await compressImages(imageFiles);

  if (compressedImages.length === 0) {
    console.error('❌ No images were compressed');
    process.exit(1);
  }

  console.log(`\n📷 Compressed ${compressedImages.length} images\n`);

  // Step 3: Find project
  console.log(`🔍 Looking for project: ${PROJECT_SLUG}`);
  const project = await findProjectBySlug(PROJECT_SLUG);

  if (!project) {
    console.error(`❌ Project not found: ${PROJECT_SLUG}`);
    const allProjects = await client.fetch('*[_type == "project"]{ _id, title, "slug": slug.current }');
    console.log('\n📝 Available projects:');
    allProjects.slice(0, 15).forEach(p => console.log(`  - ${p.slug}: ${typeof p.title === 'object' ? p.title.en : p.title}`));
    process.exit(1);
  }

  console.log(`✅ Found project: ${typeof project.title === 'object' ? project.title.en : project.title} (${project._id})\n`);

  // Step 4: Upload images
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

  // Step 5: Update project gallery
  const galleryRefs = uploadedAssets.map((asset, index) => ({
    _type: 'image',
    _key: `hotelboulevard_${index}_${Date.now()}`,
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
    alt: `Hotel Boulevard Autograph Collection - Image ${index + 1}`,
  }));

  console.log('📝 Updating project gallery...');
  const success = await updateProjectGallery(project._id, galleryRefs);

  if (success) {
    console.log('\n🎉 Successfully seeded Hotel Boulevard project!');
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
