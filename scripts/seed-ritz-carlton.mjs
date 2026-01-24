#!/usr/bin/env node
/**
 * Seed Ritz Carlton Residences Project Images to Sanity
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: 'b6q28exv',
  dataset: 'mouhajer-db',
  apiVersion: '2024-11-21',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const PROJECT_SLUG = 'ritz-carlton-residences';
const IMAGES_DIR = '/tmp/ritz-carlton-webp';

async function uploadImage(filePath, filename) {
  const imageBuffer = fs.readFileSync(filePath);

  try {
    const asset = await client.assets.upload('image', imageBuffer, {
      filename: filename,
      contentType: 'image/webp',
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
  console.log('🚀 Starting Ritz Carlton Residences image seeding...\n');

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN environment variable is not set!');
    process.exit(1);
  }

  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`❌ Images directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  const imageFiles = fs.readdirSync(IMAGES_DIR)
    .filter(f => f.endsWith('.webp'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  console.log(`📷 Found ${imageFiles.length} WebP images to upload\n`);

  console.log(`🔍 Looking for project: ${PROJECT_SLUG}`);
  const project = await findProjectBySlug(PROJECT_SLUG);

  if (!project) {
    console.error(`❌ Project not found: ${PROJECT_SLUG}`);
    const allProjects = await client.fetch('*[_type == "project"]{ _id, title, "slug": slug.current }');
    console.log('\n📝 Available projects:');
    allProjects.forEach(p => console.log(`  - ${p.slug}: ${p.title}`));
    process.exit(1);
  }

  console.log(`✅ Found project: ${project.title} (${project._id})\n`);

  const BATCH_SIZE = 5;
  const uploadedAssets = [];

  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    const batch = imageFiles.slice(i, i + BATCH_SIZE);
    console.log(`\n📦 Uploading batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(imageFiles.length / BATCH_SIZE)}`);

    const batchPromises = batch.map(filename => {
      const filePath = path.join(IMAGES_DIR, filename);
      return uploadImage(filePath, filename);
    });

    const results = await Promise.all(batchPromises);
    uploadedAssets.push(...results.filter(Boolean));

    if (i + BATCH_SIZE < imageFiles.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✅ Successfully uploaded ${uploadedAssets.length}/${imageFiles.length} images\n`);

  const galleryRefs = uploadedAssets.map((asset, index) => ({
    _type: 'image',
    _key: `img_${index}_${Date.now()}`,
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
    alt: `Ritz Carlton Residences - Image ${index + 1}`,
  }));

  console.log('📝 Updating project gallery...');
  const success = await updateProjectGallery(project._id, galleryRefs);

  if (success) {
    console.log('\n🎉 Successfully seeded Ritz Carlton Residences project!');
    console.log(`   Total images: ${uploadedAssets.length}`);
    console.log(`   Project: ${project.title}`);
    console.log(`   URL: https://mouhajerdesign.com/en/projects/${PROJECT_SLUG}`);
  }
}

main().catch(console.error);
