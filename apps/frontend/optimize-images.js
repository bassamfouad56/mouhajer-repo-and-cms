const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  inputDir: path.join(__dirname, 'public', 'images'),
  outputDir: path.join(__dirname, 'public', 'images', 'optimized'),
  backupDir: path.join(__dirname, 'public', 'images', 'originals'),
  minSizeForOptimization: 2 * 1024 * 1024, // 2MB
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 85,
  formats: ['webp', 'jpg'] // Output both WebP and optimized JPG
};

// Get all image files recursively
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip output and backup directories
      if (!filePath.includes('optimized') && !filePath.includes('originals')) {
        getAllImages(filePath, fileList);
      }
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      fileList.push({ path: filePath, size: stat.size, name: file });
    }
  });

  return fileList;
}

// Create directories if they don't exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Optimize a single image
async function optimizeImage(imagePath, outputPath, format) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();

  let pipeline = image;

  // Resize if image is too large
  if (metadata.width > CONFIG.maxWidth || metadata.height > CONFIG.maxHeight) {
    pipeline = pipeline.resize(CONFIG.maxWidth, CONFIG.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  // Convert to specified format with quality
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality: CONFIG.quality });
  } else if (format === 'jpg' || format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality: CONFIG.quality, mozjpeg: true });
  }

  await pipeline.toFile(outputPath);
}

// Main optimization function
async function optimizeImages() {
  console.log('=== IMAGE OPTIMIZATION STARTED ===\n');
  console.log(`Input directory: ${CONFIG.inputDir}`);
  console.log(`Output directory: ${CONFIG.outputDir}`);
  console.log(`Backup directory: ${CONFIG.backupDir}`);
  console.log(`Min size for optimization: ${(CONFIG.minSizeForOptimization / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Max dimensions: ${CONFIG.maxWidth}x${CONFIG.maxHeight}px`);
  console.log(`Quality: ${CONFIG.quality}%\n`);

  // Ensure output directories exist
  ensureDir(CONFIG.outputDir);
  ensureDir(CONFIG.backupDir);

  // Get all images
  const images = getAllImages(CONFIG.inputDir);

  // Filter images that need optimization (larger than min size)
  const largeImages = images.filter(img => img.size > CONFIG.minSizeForOptimization);

  console.log(`Total images found: ${images.length}`);
  console.log(`Images to optimize: ${largeImages.length}\n`);

  if (largeImages.length === 0) {
    console.log('No images need optimization.');
    return;
  }

  const results = {
    optimized: [],
    failed: [],
    totalOriginalSize: 0,
    totalOptimizedSize: 0
  };

  // Process each large image
  for (let i = 0; i < largeImages.length; i++) {
    const img = largeImages[i];
    const relPath = path.relative(CONFIG.inputDir, img.path);
    const parsedPath = path.parse(img.name);

    console.log(`[${i + 1}/${largeImages.length}] Processing: ${relPath}`);
    console.log(`  Original size: ${(img.size / (1024 * 1024)).toFixed(2)} MB`);

    try {
      // Create output paths
      const webpName = `${parsedPath.name}.webp`;
      const jpgName = `${parsedPath.name}.jpg`;
      const webpPath = path.join(CONFIG.outputDir, webpName);
      const jpgPath = path.join(CONFIG.outputDir, jpgName);

      // Optimize to WebP
      await optimizeImage(img.path, webpPath, 'webp');
      const webpSize = fs.statSync(webpPath).size;

      // Optimize to JPG
      await optimizeImage(img.path, jpgPath, 'jpg');
      const jpgSize = fs.statSync(jpgPath).size;

      console.log(`  ✓ WebP: ${(webpSize / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`  ✓ JPG: ${(jpgSize / (1024 * 1024)).toFixed(2)} MB`);
      console.log(`  Savings: ${((1 - (webpSize / img.size)) * 100).toFixed(1)}% (WebP)\n`);

      results.optimized.push({
        original: relPath,
        originalSize: img.size,
        webpSize: webpSize,
        jpgSize: jpgSize,
        savings: img.size - webpSize
      });

      results.totalOriginalSize += img.size;
      results.totalOptimizedSize += webpSize;

      // Backup original (move to backup directory)
      const backupPath = path.join(CONFIG.backupDir, img.name);
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(img.path, backupPath);
      }

    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}\n`);
      results.failed.push({ path: relPath, error: error.message });
    }
  }

  // Generate summary
  console.log('\n=== OPTIMIZATION COMPLETE ===\n');
  console.log(`Successfully optimized: ${results.optimized.length} images`);
  console.log(`Failed: ${results.failed.length} images`);
  console.log(`Original total size: ${(results.totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized total size: ${(results.totalOptimizedSize / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total savings: ${(results.totalOriginalSize - results.totalOptimizedSize) / (1024 * 1024).toFixed(2)} MB`);
  console.log(`Percentage saved: ${((1 - (results.totalOptimizedSize / results.totalOriginalSize)) * 100).toFixed(1)}%`);

  if (results.failed.length > 0) {
    console.log('\nFailed images:');
    results.failed.forEach(f => console.log(`  - ${f.path}: ${f.error}`));
  }

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    summary: {
      totalImages: images.length,
      optimizedCount: results.optimized.length,
      failedCount: results.failed.length,
      originalSizeMB: (results.totalOriginalSize / (1024 * 1024)).toFixed(2),
      optimizedSizeMB: (results.totalOptimizedSize / (1024 * 1024)).toFixed(2),
      savedMB: ((results.totalOriginalSize - results.totalOptimizedSize) / (1024 * 1024)).toFixed(2),
      percentageSaved: ((1 - (results.totalOptimizedSize / results.totalOriginalSize)) * 100).toFixed(1)
    },
    optimized: results.optimized.map(r => ({
      original: r.original,
      originalSizeMB: (r.originalSize / (1024 * 1024)).toFixed(2),
      webpSizeMB: (r.webpSize / (1024 * 1024)).toFixed(2),
      jpgSizeMB: (r.jpgSize / (1024 * 1024)).toFixed(2),
      savingsMB: (r.savings / (1024 * 1024)).toFixed(2)
    })),
    failed: results.failed
  };

  fs.writeFileSync(
    path.join(__dirname, 'optimization-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('\nDetailed report saved to: optimization-report.json');
  console.log(`\nBackup of original images saved to: ${CONFIG.backupDir}`);
  console.log(`Optimized images saved to: ${CONFIG.outputDir}`);
}

// Run optimization
optimizeImages().catch(console.error);
