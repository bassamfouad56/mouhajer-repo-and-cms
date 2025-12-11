/**
 * Upload Local Images to Sanity
 *
 * Simpler version that works with images already on your local machine.
 * Put images in the ./sanity-images folder organized by category:
 *
 * ./sanity-images/
 *   ├── hero/         (hero section backgrounds)
 *   ├── founder/      (founder/CEO images)
 *   ├── about/        (about section images)
 *   ├── contact/      (contact section backgrounds)
 *   ├── stats/        (stats section backgrounds)
 *   ├── why-choose-us/ (why choose us images)
 *   └── projects/     (general project images)
 *
 * Usage: npx ts-node scripts/upload-local-images-to-sanity.ts
 */

import { createClient } from '@sanity/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Configuration
const CONFIG = {
  // Local folder with organized images
  sourceDir: './sanity-images',
  // Sanity configuration
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN || '',
    apiVersion: '2024-01-01',
  },
  // Expected folders (categories)
  categories: [
    'hero',
    'founder',
    'about',
    'contact',
    'stats',
    'why-choose-us',
    'projects',
    'process',
  ],
  // Supported extensions
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

interface UploadedAsset {
  _id: string;
  category: string;
  filename: string;
  url: string;
}

// Create folder structure if it doesn't exist
function createFolderStructure(): void {
  console.log('📁 Checking folder structure...\n');

  if (!fs.existsSync(CONFIG.sourceDir)) {
    fs.mkdirSync(CONFIG.sourceDir, { recursive: true });
  }

  for (const category of CONFIG.categories) {
    const categoryPath = path.join(CONFIG.sourceDir, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`  Created: ${categoryPath}`);
    } else {
      const files = fs.readdirSync(categoryPath).filter(f =>
        CONFIG.imageExtensions.some(ext => f.toLowerCase().endsWith(ext))
      );
      console.log(`  ✓ ${category}/ - ${files.length} images`);
    }
  }
}

// Get all images from source directory
function getLocalImages(): { category: string; filepath: string; filename: string }[] {
  const images: { category: string; filepath: string; filename: string }[] = [];

  for (const category of CONFIG.categories) {
    const categoryPath = path.join(CONFIG.sourceDir, category);

    if (!fs.existsSync(categoryPath)) continue;

    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (!CONFIG.imageExtensions.includes(ext)) continue;

      const filepath = path.join(categoryPath, file);
      const stats = fs.statSync(filepath);

      if (stats.size > CONFIG.maxFileSize) {
        console.log(`  ⚠️  Skipping ${file} (too large: ${(stats.size / 1024 / 1024).toFixed(1)}MB)`);
        continue;
      }

      images.push({
        category,
        filepath,
        filename: file,
      });
    }
  }

  return images;
}

// Upload image to Sanity
async function uploadToSanity(
  filepath: string,
  filename: string,
  category: string
): Promise<UploadedAsset | null> {
  try {
    const imageBuffer = fs.readFileSync(filepath);
    const ext = path.extname(filename).toLowerCase();

    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
    };

    const asset = await sanityClient.assets.upload('image', imageBuffer, {
      filename,
      contentType: contentTypes[ext] || 'image/jpeg',
    });

    return {
      _id: asset._id,
      category,
      filename,
      url: asset.url,
    };
  } catch (error) {
    console.error(`  ✗ Failed to upload ${filename}:`, error);
    return null;
  }
}

// Create Site Settings document
async function createSiteSettings(assets: UploadedAsset[]): Promise<void> {
  console.log('\n📝 Creating Site Settings document...');

  // Group by category
  const byCategory: Record<string, UploadedAsset[]> = {};
  for (const asset of assets) {
    if (!byCategory[asset.category]) {
      byCategory[asset.category] = [];
    }
    byCategory[asset.category].push(asset);
  }

  // Helper to create image reference
  const getImageRef = (category: string, index = 0) => {
    const catAssets = byCategory[category] || byCategory['projects'] || [];
    if (catAssets[index]) {
      return {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: catAssets[index]._id,
        },
      };
    }
    return undefined;
  };

  const siteSettings = {
    _type: 'siteSettings',
    _id: 'siteSettings',
    siteName: 'Mouhajer International Design',
    siteTagline: 'Luxury Interior Design & Construction',
    founderName: 'Eng. Maher Mouhajer',
    founderTitle: 'CEO & Founder',
    founderQuote: 'Designing a palace on paper is easy. Building it on sand requires discipline.',
    defaultSeoTitle: 'Mouhajer International Design | Luxury Interior Design Dubai',
    defaultSeoDescription: 'Premium interior design, construction, and fit-out services in Dubai and Abu Dhabi.',

    heroImage: getImageRef('hero'),
    founderImage: getImageRef('founder'),
    aboutImage: getImageRef('about'),
    statsBackgroundImage: getImageRef('stats'),
    contactBackgroundImage: getImageRef('contact'),
    whyChooseUsImage: getImageRef('why-choose-us'),
    whyChooseUsSecondaryImage: getImageRef('why-choose-us', 1),
    ogImage: getImageRef('hero'),

    processImages: [
      { step: 'Discovery', image: getImageRef('process', 0) },
      { step: 'Design', image: getImageRef('process', 1) },
      { step: 'Engineering', image: getImageRef('process', 2) },
      { step: 'Construction', image: getImageRef('process', 3) },
      { step: 'Fit-out', image: getImageRef('process', 4) },
      { step: 'Handover', image: getImageRef('process', 5) },
    ].filter(p => p.image),
  };

  // Clean undefined values
  const clean = JSON.parse(JSON.stringify(siteSettings));

  try {
    await sanityClient.createOrReplace(clean);
    console.log('✅ Site Settings created/updated!');
  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

// Print summary
function printSummary(assets: UploadedAsset[]): void {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  UPLOAD SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const byCategory: Record<string, number> = {};
  for (const asset of assets) {
    byCategory[asset.category] = (byCategory[asset.category] || 0) + 1;
  }

  for (const [category, count] of Object.entries(byCategory)) {
    console.log(`  ${category}: ${count} images`);
  }

  console.log(`\n  Total: ${assets.length} images uploaded`);
}

// Main
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Local Images → Sanity CDN');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Validate Sanity credentials
  if (!CONFIG.sanity.projectId || !CONFIG.sanity.token) {
    console.error('❌ Missing Sanity credentials!\n');
    console.error('Please add to your .env.local:');
    console.error('  NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id');
    console.error('  SANITY_API_TOKEN=your-token\n');
    console.error('Get your token from: https://www.sanity.io/manage');
    process.exit(1);
  }

  // Create folder structure
  createFolderStructure();

  // Get images
  const images = getLocalImages();

  if (images.length === 0) {
    console.log('\n⚠️  No images found!\n');
    console.log('Please add images to these folders:');
    for (const cat of CONFIG.categories) {
      console.log(`  ${CONFIG.sourceDir}/${cat}/`);
    }
    console.log('\nThen run this script again.');
    process.exit(0);
  }

  console.log(`\n📷 Found ${images.length} images to upload\n`);

  // Upload to Sanity
  console.log('☁️  Uploading to Sanity CDN...\n');
  const uploaded: UploadedAsset[] = [];

  for (const img of images) {
    process.stdout.write(`  Uploading ${img.filename}...`);
    const asset = await uploadToSanity(img.filepath, img.filename, img.category);
    if (asset) {
      uploaded.push(asset);
      console.log(' ✓');
    } else {
      console.log(' ✗');
    }
  }

  // Create Site Settings
  if (uploaded.length > 0) {
    await createSiteSettings(uploaded);
    printSummary(uploaded);
  }

  console.log('\n✅ Done! Run `npm run dev` to see your images on the website.\n');
}

main();
