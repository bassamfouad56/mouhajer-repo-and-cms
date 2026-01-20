import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join } from 'path';

const SOURCE_DIR = join(process.cwd(), 'public/jbr');
const OUTPUT_DIR = join(process.cwd(), 'public/projects/sofitel-jbr');

const MAX_DIMENSION = 2400;
const QUALITY = 85;

async function optimizeImages() {
  console.log('🚀 Optimizing JBR images...\n');

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(SOURCE_DIR);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));

  console.log(`Found ${jpgFiles.length} images to optimize\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  let processed = 0;

  for (const file of jpgFiles) {
    const inputPath = join(SOURCE_DIR, file);
    const outputPath = join(OUTPUT_DIR, file);

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
      if (processed % 10 === 0) {
        console.log(`  Processed ${processed}/${jpgFiles.length}...`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${file}:`, error.message);
    }
  }

  const savedMB = ((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(1);
  const savingsPercent = ((1 - totalOptimized / totalOriginal) * 100).toFixed(0);

  console.log('\n✨ Optimization complete!');
  console.log(`  Original: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Optimized: ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Saved: ${savedMB} MB (${savingsPercent}%)`);
  console.log(`  Output: ${OUTPUT_DIR}`);
}

optimizeImages().catch(console.error);
