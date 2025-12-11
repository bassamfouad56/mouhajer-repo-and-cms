/**
 * Upload Images from Mac Mini LaCie Drive to Sanity
 *
 * This script:
 * 1. Connects to Mac Mini via SSH
 * 2. Finds images in the LaCie/bassam directory
 * 3. Copies them locally
 * 4. Uploads to Sanity CDN
 * 5. Creates/updates the Site Settings document
 *
 * Usage: npx ts-node scripts/upload-images-to-sanity.ts
 */

import { createClient } from '@sanity/client';
import { execSync, exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const CONFIG = {
  // Mac Mini SSH connection
  macMini: {
    host: '100.111.21.66',
    user: 'bassamfouad',
    // Base path on LaCie drive - adjust if needed
    basePath: '/Volumes/LaCie/bassam',
  },
  // Local temp directory for downloaded images
  localTempDir: './temp-sanity-uploads',
  // Sanity configuration
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN || '',
    apiVersion: '2024-01-01',
  },
  // Image categories to search for
  imageCategories: {
    hero: ['hero', 'banner', 'main', 'cover', 'homepage'],
    founder: ['founder', 'ceo', 'maher', 'mariam', 'owner', 'director'],
    about: ['about', 'company', 'office', 'team', 'studio'],
    stats: ['stats', 'numbers', 'achievements', 'interior', 'luxury'],
    contact: ['contact', 'office', 'building', 'exterior', 'reception'],
    whyChooseUs: ['why', 'choose', 'quality', 'design', 'work'],
    projects: ['project', 'villa', 'hotel', 'residential', 'commercial', 'hospitality'],
    process: ['process', 'construction', 'fitout', 'manufacturing', 'engineering'],
  },
  // Supported image extensions
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
  // Max file size (20MB)
  maxFileSize: 20 * 1024 * 1024,
};

// Sanity client
const sanityClient = createClient({
  projectId: CONFIG.sanity.projectId,
  dataset: CONFIG.sanity.dataset,
  token: CONFIG.sanity.token,
  apiVersion: CONFIG.sanity.apiVersion,
  useCdn: false,
});

interface ImageFile {
  localPath: string;
  remotePath: string;
  filename: string;
  category: string;
  size: number;
}

interface UploadedAsset {
  _id: string;
  _type: 'reference';
  url: string;
  category: string;
}

// Helper to run SSH commands on Mac Mini
function sshCommand(command: string): string {
  const sshCmd = `ssh ${CONFIG.macMini.user}@${CONFIG.macMini.host} "${command}"`;
  try {
    return execSync(sshCmd, { encoding: 'utf-8', timeout: 30000 });
  } catch (error) {
    console.error(`SSH command failed: ${command}`);
    return '';
  }
}

// Check if Mac Mini is reachable
function checkMacMiniConnection(): boolean {
  console.log('🔍 Checking Mac Mini connection...');
  try {
    const result = sshCommand('echo "connected"');
    if (result.includes('connected')) {
      console.log('✅ Mac Mini is reachable');
      return true;
    }
  } catch {
    console.error('❌ Cannot connect to Mac Mini');
  }
  return false;
}

// Find images on Mac Mini
function findImagesOnMacMini(): string[] {
  console.log('🔍 Scanning LaCie drive for images...');

  const extensions = CONFIG.imageExtensions.join('|').replace(/\./g, '\\.');
  const findCmd = `find "${CONFIG.macMini.basePath}" -type f \\( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \\) 2>/dev/null | head -500`;

  const result = sshCommand(findCmd);
  const files = result.split('\n').filter(f => f.trim().length > 0);

  console.log(`📁 Found ${files.length} images`);
  return files;
}

// Categorize images based on path/filename
function categorizeImage(filepath: string): string {
  const lowerPath = filepath.toLowerCase();

  for (const [category, keywords] of Object.entries(CONFIG.imageCategories)) {
    for (const keyword of keywords) {
      if (lowerPath.includes(keyword)) {
        return category;
      }
    }
  }

  return 'projects'; // Default category
}

// Download images from Mac Mini
function downloadImages(remoteFiles: string[]): ImageFile[] {
  console.log('📥 Downloading images from Mac Mini...');

  // Create temp directory
  if (!fs.existsSync(CONFIG.localTempDir)) {
    fs.mkdirSync(CONFIG.localTempDir, { recursive: true });
  }

  const downloadedFiles: ImageFile[] = [];
  const categoryCounts: Record<string, number> = {};

  // Limit images per category
  const maxPerCategory = 5;

  for (const remotePath of remoteFiles) {
    const category = categorizeImage(remotePath);
    categoryCounts[category] = (categoryCounts[category] || 0);

    // Skip if we have enough for this category
    if (categoryCounts[category] >= maxPerCategory) continue;

    const filename = path.basename(remotePath);
    const localPath = path.join(CONFIG.localTempDir, `${category}_${categoryCounts[category]}_${filename}`);

    try {
      // Use SCP to download
      const scpCmd = `scp "${CONFIG.macMini.user}@${CONFIG.macMini.host}:${remotePath}" "${localPath}"`;
      execSync(scpCmd, { timeout: 60000 });

      const stats = fs.statSync(localPath);

      // Skip files that are too large
      if (stats.size > CONFIG.maxFileSize) {
        fs.unlinkSync(localPath);
        continue;
      }

      downloadedFiles.push({
        localPath,
        remotePath,
        filename,
        category,
        size: stats.size,
      });

      categoryCounts[category]++;
      console.log(`  ✓ Downloaded: ${filename} (${category})`);
    } catch (error) {
      console.log(`  ✗ Failed: ${filename}`);
    }
  }

  console.log(`\n📦 Downloaded ${downloadedFiles.length} images`);
  return downloadedFiles;
}

// Upload image to Sanity
async function uploadToSanity(file: ImageFile): Promise<UploadedAsset | null> {
  try {
    const imageBuffer = fs.readFileSync(file.localPath);

    const asset = await sanityClient.assets.upload('image', imageBuffer, {
      filename: file.filename,
      contentType: getContentType(file.filename),
    });

    console.log(`  ✓ Uploaded to Sanity: ${file.filename}`);

    return {
      _id: asset._id,
      _type: 'reference',
      url: asset.url,
      category: file.category,
    };
  } catch (error) {
    console.error(`  ✗ Upload failed: ${file.filename}`, error);
    return null;
  }
}

// Get content type from filename
function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
  };
  return types[ext] || 'image/jpeg';
}

// Create or update Site Settings in Sanity
async function createSiteSettings(uploadedAssets: UploadedAsset[]): Promise<void> {
  console.log('\n📝 Creating Site Settings document...');

  // Group assets by category
  const assetsByCategory: Record<string, UploadedAsset[]> = {};
  for (const asset of uploadedAssets) {
    if (!assetsByCategory[asset.category]) {
      assetsByCategory[asset.category] = [];
    }
    assetsByCategory[asset.category].push(asset);
  }

  // Build the site settings document
  const getAssetRef = (category: string, index = 0) => {
    const assets = assetsByCategory[category];
    if (assets && assets[index]) {
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assets[index]._id,
        },
      };
    }
    return undefined;
  };

  const siteSettings = {
    _type: 'siteSettings',
    _id: 'siteSettings', // Singleton document
    siteName: 'Mouhajer International Design',
    siteTagline: 'Luxury Interior Design & Construction',
    founderName: 'Eng. Maher Mouhajer',
    founderTitle: 'CEO & Founder',
    founderQuote: 'Designing a palace on paper is easy. Building it on sand requires discipline.',
    defaultSeoTitle: 'Mouhajer International Design | Luxury Interior Design Dubai',
    defaultSeoDescription: 'Premium interior design, construction, and fit-out services in Dubai and Abu Dhabi. Over 15 years of excellence in luxury residential and commercial projects.',

    // Section images from uploaded assets
    heroImage: getAssetRef('hero') || getAssetRef('projects'),
    founderImage: getAssetRef('founder'),
    aboutImage: getAssetRef('about') || getAssetRef('projects', 1),
    statsBackgroundImage: getAssetRef('stats') || getAssetRef('projects', 2),
    contactBackgroundImage: getAssetRef('contact') || getAssetRef('projects', 3),
    whyChooseUsImage: getAssetRef('whyChooseUs') || getAssetRef('projects', 4),
    whyChooseUsSecondaryImage: getAssetRef('whyChooseUs', 1) || getAssetRef('projects', 5),
    ogImage: getAssetRef('hero') || getAssetRef('projects'),

    // Process images
    processImages: [
      { step: 'Discovery', image: getAssetRef('process', 0) },
      { step: 'Design', image: getAssetRef('process', 1) },
      { step: 'Engineering', image: getAssetRef('process', 2) },
      { step: 'Construction', image: getAssetRef('process', 3) },
      { step: 'Fit-out', image: getAssetRef('process', 4) },
      { step: 'Handover', image: getAssetRef('process', 5) },
    ].filter(p => p.image),
  };

  // Remove undefined values
  const cleanSettings = JSON.parse(JSON.stringify(siteSettings));

  try {
    // Try to create, if exists, update
    await sanityClient.createOrReplace(cleanSettings);
    console.log('✅ Site Settings document created/updated successfully!');
  } catch (error) {
    console.error('❌ Failed to create Site Settings:', error);
  }
}

// Cleanup temp files
function cleanup(): void {
  console.log('\n🧹 Cleaning up temp files...');
  if (fs.existsSync(CONFIG.localTempDir)) {
    fs.rmSync(CONFIG.localTempDir, { recursive: true });
  }
  console.log('✅ Cleanup complete');
}

// Main execution
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Sanity Image Upload Script');
  console.log('  Mac Mini LaCie → Sanity CDN');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Validate configuration
  if (!CONFIG.sanity.projectId || !CONFIG.sanity.token) {
    console.error('❌ Missing Sanity credentials. Please set:');
    console.error('   NEXT_PUBLIC_SANITY_PROJECT_ID');
    console.error('   SANITY_API_TOKEN');
    console.error('\nGet your token from: https://www.sanity.io/manage');
    process.exit(1);
  }

  console.log(`📡 Sanity Project: ${CONFIG.sanity.projectId}`);
  console.log(`📁 Mac Mini Path: ${CONFIG.macMini.basePath}\n`);

  // Check Mac Mini connection
  if (!checkMacMiniConnection()) {
    console.log('\n⚠️  Cannot connect to Mac Mini. Make sure:');
    console.log('   1. Mac Mini is on and connected to the network');
    console.log('   2. SSH is enabled on Mac Mini');
    console.log('   3. LaCie drive is mounted');
    console.log(`   4. You can SSH manually: ssh ${CONFIG.macMini.user}@${CONFIG.macMini.host}`);
    process.exit(1);
  }

  try {
    // Step 1: Find images on Mac Mini
    const remoteFiles = findImagesOnMacMini();

    if (remoteFiles.length === 0) {
      console.log('❌ No images found on Mac Mini. Check the path:', CONFIG.macMini.basePath);
      process.exit(1);
    }

    // Step 2: Download images locally
    const downloadedFiles = downloadImages(remoteFiles);

    if (downloadedFiles.length === 0) {
      console.log('❌ Failed to download any images');
      process.exit(1);
    }

    // Step 3: Upload to Sanity
    console.log('\n☁️  Uploading images to Sanity CDN...');
    const uploadedAssets: UploadedAsset[] = [];

    for (const file of downloadedFiles) {
      const asset = await uploadToSanity(file);
      if (asset) {
        uploadedAssets.push(asset);
      }
    }

    console.log(`\n✅ Uploaded ${uploadedAssets.length} images to Sanity`);

    // Step 4: Create Site Settings
    await createSiteSettings(uploadedAssets);

    // Step 5: Cleanup
    cleanup();

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ COMPLETE!');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('\nNext steps:');
    console.log('1. Open Sanity Studio to verify images');
    console.log('2. Adjust any images in Site Settings if needed');
    console.log('3. Run npm run dev to see changes on website');

  } catch (error) {
    console.error('❌ Script failed:', error);
    cleanup();
    process.exit(1);
  }
}

// Run
main();
