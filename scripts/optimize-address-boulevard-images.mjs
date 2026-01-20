import sharp from 'sharp';
import { readdir, stat, mkdir, copyFile } from 'fs/promises';
import { join } from 'path';

const SOURCE_FOLDERS = [
  {
    path: '/Volumes/lacie 1/bassam/our projects page/4 penthouse address boulevard',
    prefix: 'penthouse',
    category: 'royal-suite'
  },
  {
    path: '/Volumes/lacie 1/bassam/our projects page/9 HOTEL ADDRESS BOULEVARD VIP SUITE',
    prefix: 'vip',
    category: 'vip-suite'
  },
  {
    path: '/Volumes/lacie 1/bassam/our projects page/8 CLUB LOUNGE ADDRESS BOULEVARD',
    prefix: 'lounge',
    category: 'club-lounge'
  }
];

const OUTPUT_DIR = join(process.cwd(), 'public/projects/address-boulevard');

const MAX_DIMENSION = 2400;
const QUALITY = 85;

async function optimizeImages() {
  console.log('🚀 Optimizing Address Boulevard images...\n');

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  let totalOriginal = 0;
  let totalOptimized = 0;
  let processed = 0;
  let totalFiles = 0;

  for (const folder of SOURCE_FOLDERS) {
    console.log(`\n📂 Processing: ${folder.prefix} (${folder.path})\n`);

    let files;
    try {
      files = await readdir(folder.path);
    } catch (error) {
      console.error(`  ❌ Cannot access folder: ${error.message}`);
      continue;
    }

    const jpgFiles = files.filter(f =>
      f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg')
    );

    console.log(`  Found ${jpgFiles.length} images\n`);
    totalFiles += jpgFiles.length;

    for (const file of jpgFiles) {
      const inputPath = join(folder.path, file);
      // Use prefix to avoid filename collisions
      const outputFilename = `${folder.prefix}-${file}`;
      const outputPath = join(OUTPUT_DIR, outputFilename);

      try {
        const originalStat = await stat(inputPath);
        totalOriginal += originalStat.size;

        // Get image metadata
        const metadata = await sharp(inputPath).metadata();
        const { width, height } = metadata;

        // Calculate new dimensions
        let newWidth = width;
        let newHeight = height;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            newWidth = MAX_DIMENSION;
            newHeight = Math.round((height / width) * MAX_DIMENSION);
          } else {
            newHeight = MAX_DIMENSION;
            newWidth = Math.round((width / height) * MAX_DIMENSION);
          }
        }

        // Optimize
        await sharp(inputPath)
          .resize(newWidth, newHeight, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: QUALITY, mozjpeg: true })
          .toFile(outputPath);

        const optimizedStat = await stat(outputPath);
        totalOptimized += optimizedStat.size;

        processed++;
        if (processed % 20 === 0) {
          console.log(`  Processed ${processed}/${totalFiles}...`);
        }
      } catch (error) {
        console.error(`  ❌ Error processing ${file}:`, error.message);
      }
    }
  }

  const savedMB = ((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(1);
  const savingsPercent = ((1 - totalOptimized / totalOriginal) * 100).toFixed(0);

  console.log('\n✨ Optimization complete!');
  console.log(`  Images processed: ${processed}`);
  console.log(`  Original: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Optimized: ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Saved: ${savedMB} MB (${savingsPercent}%)`);
  console.log(`  Output: ${OUTPUT_DIR}`);
}

optimizeImages().catch(console.error);
