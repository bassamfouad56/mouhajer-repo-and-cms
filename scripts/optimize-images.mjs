import sharp from 'sharp';
import { readdir, stat, mkdir, rename, rm } from 'fs/promises';
import { join, basename } from 'path';

const SOURCE_DIR = join(process.cwd(), 'public/projects/sheraton');
const OUTPUT_DIR = join(process.cwd(), 'public/projects/sheraton-optimized');

const MAX_DIMENSION = 2400;
const QUALITY = 85;

async function optimizeImages() {
  console.log('Starting image optimization...');

  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await readdir(SOURCE_DIR);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg'));

  console.log('Found ' + jpgFiles.length + ' images to optimize');

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const file of jpgFiles) {
    const inputPath = join(SOURCE_DIR, file);
    const outputPath = join(OUTPUT_DIR, file);

    try {
      const originalStats = await stat(inputPath);
      totalOriginalSize += originalStats.size;

      const image = sharp(inputPath);
      const metadata = await image.metadata();

      let resizeOptions = {};
      if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        if (metadata.width > metadata.height) {
          resizeOptions = { width: MAX_DIMENSION };
        } else {
          resizeOptions = { height: MAX_DIMENSION };
        }
      }

      await image
        .resize(resizeOptions)
        .jpeg({ quality: QUALITY, progressive: true })
        .toFile(outputPath);

      const optimizedStats = await stat(outputPath);
      totalOptimizedSize += optimizedStats.size;

      const originalMB = (originalStats.size / 1024 / 1024).toFixed(2);
      const optimizedMB = (optimizedStats.size / 1024 / 1024).toFixed(2);
      const reduction = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);

      console.log('Done: ' + file + ' ' + originalMB + 'MB -> ' + optimizedMB + 'MB (' + reduction + '% saved)');
    } catch (error) {
      console.error('Failed: ' + file + ' - ' + error.message);
    }
  }

  console.log('');
  console.log('Summary:');
  console.log('  Original: ' + (totalOriginalSize / 1024 / 1024).toFixed(2) + 'MB');
  console.log('  Optimized: ' + (totalOptimizedSize / 1024 / 1024).toFixed(2) + 'MB');
  console.log('  Saved: ' + ((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2) + 'MB');
}

optimizeImages().catch(console.error);
