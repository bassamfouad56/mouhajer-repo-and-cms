const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Find Duplicates Between Optimized and Original Images
 * This script identifies optimized images that are duplicates of originals
 */

const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const OPTIMIZED_DIR = path.join(IMAGES_DIR, 'optimized');

// Calculate MD5 hash of file content
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// Get file size in bytes
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

// Find all image files recursively
function findAllImages(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findAllImages(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

// Format file size
function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Get base filename without extension for comparison
function getBaseName(filename) {
  return path.basename(filename, path.extname(filename));
}

// Main function
function findOptimizedDuplicates() {
  console.log('🔍 Analyzing optimized vs original images...\n');

  if (!fs.existsSync(OPTIMIZED_DIR)) {
    console.log('❌ Optimized directory not found:', OPTIMIZED_DIR);
    return;
  }

  // Find all images in optimized folder
  const optimizedImages = findAllImages(OPTIMIZED_DIR);
  console.log(`📁 Found ${optimizedImages.length} images in optimized/`);

  // Find all images in main images folder (excluding optimized subfolder)
  const allImages = findAllImages(IMAGES_DIR);
  const mainImages = allImages.filter(img => !img.includes('optimized'));
  console.log(`📁 Found ${mainImages.length} images in main images/\n`);

  console.log('📊 Computing hashes...');

  // Build hash map for all images
  const hashMap = new Map();
  const imageData = [];

  [...mainImages, ...optimizedImages].forEach((imagePath, index) => {
    try {
      const hash = getFileHash(imagePath);
      const size = getFileSize(imagePath);
      const relativePath = path.relative(PUBLIC_DIR, imagePath);
      const filename = path.basename(imagePath);
      const baseName = getBaseName(filename);
      const isOptimized = imagePath.includes('optimized');

      const data = {
        path: relativePath,
        fullPath: imagePath,
        filename,
        baseName,
        hash,
        size,
        isOptimized,
      };

      imageData.push(data);

      if (!hashMap.has(hash)) {
        hashMap.set(hash, []);
      }
      hashMap.get(hash).push(data);

      if ((index + 1) % 100 === 0) {
        process.stdout.write(`\r   Processed ${index + 1} images...`);
      }
    } catch (err) {
      console.error(`\nError processing ${imagePath}: ${err.message}`);
    }
  });

  console.log(`\r   Processed ${imageData.length} images ✓\n`);

  // Find exact duplicates (same hash)
  const exactDuplicates = [];
  hashMap.forEach((images, hash) => {
    if (images.length > 1) {
      // Check if there's a mix of optimized and non-optimized
      const hasOptimized = images.some(img => img.isOptimized);
      const hasMain = images.some(img => !img.isOptimized);

      if (hasOptimized && hasMain) {
        // This is a case where optimized = original (no optimization happened)
        exactDuplicates.push({
          hash,
          size: images[0].size,
          files: images,
          type: 'optimized-equals-original',
        });
      } else if (hasOptimized) {
        // Duplicates within optimized folder
        exactDuplicates.push({
          hash,
          size: images[0].size,
          files: images,
          type: 'optimized-duplicates',
        });
      } else if (hasMain) {
        // Duplicates within main folder
        exactDuplicates.push({
          hash,
          size: images[0].size,
          files: images,
          type: 'main-duplicates',
        });
      }
    }
  });

  // Find optimized versions (same base name, different hash/size)
  const optimizedVersions = [];
  optimizedImages.forEach(optImgPath => {
    const optData = imageData.find(d => d.fullPath === optImgPath);
    if (!optData) return;

    const matchingMain = mainImages.find(mainImgPath => {
      const mainData = imageData.find(d => d.fullPath === mainImgPath);
      if (!mainData) return false;

      const optBase = getBaseName(optData.filename).replace(/[-_]optimized/i, '');
      const mainBase = getBaseName(mainData.filename);
      return optBase === mainBase || optBase.includes(mainBase) || mainBase.includes(optBase);
    });

    if (matchingMain) {
      const mainData = imageData.find(d => d.fullPath === matchingMain);

      if (optData && mainData && optData.hash !== mainData.hash) {
        const savings = mainData.size - optData.size;
        const savingsPercent = Math.round((savings / mainData.size) * 100);

        optimizedVersions.push({
          original: mainData,
          optimized: optData,
          savings,
          savingsPercent,
        });
      }
    }
  });

  // Generate report
  const report = {
    summary: {
      totalOptimized: optimizedImages.length,
      totalMain: mainImages.length,
      exactDuplicates: exactDuplicates.length,
      optimizedEqualsOriginal: exactDuplicates.filter(d => d.type === 'optimized-equals-original').length,
      optimizedVersions: optimizedVersions.length,
    },
    exactDuplicates,
    optimizedVersions,
  };

  // Save detailed report
  fs.writeFileSync(
    'optimized-duplicates-report.json',
    JSON.stringify(report, null, 2)
  );

  // Print summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('            OPTIMIZED FOLDER ANALYSIS                  ');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`📊 Total Optimized Images: ${report.summary.totalOptimized}`);
  console.log(`📊 Total Main Images: ${report.summary.totalMain}\n`);

  // Optimized = Original (no optimization)
  const noOptimization = exactDuplicates.filter(d => d.type === 'optimized-equals-original');
  console.log('🔴 OPTIMIZED FILES IDENTICAL TO ORIGINALS (No optimization occurred):');
  console.log(`   Found ${noOptimization.length} cases\n`);

  if (noOptimization.length > 0) {
    let totalWaste = 0;
    noOptimization.forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.files[0].filename} (${formatSize(group.size)})`);
      const optimizedFile = group.files.find(f => f.isOptimized);
      const mainFile = group.files.find(f => !f.isOptimized);

      if (optimizedFile && mainFile) {
        console.log(`      ✓ KEEP:   ${mainFile.path}`);
        console.log(`      ❌ DELETE: ${optimizedFile.path} (same as original, no optimization)`);
        totalWaste += group.size;
      }
      console.log('');
    });

    console.log(`   💾 Space wasted by identical "optimized" files: ${formatSize(totalWaste)}\n`);
  }

  // Duplicates within optimized folder
  const optimizedDupes = exactDuplicates.filter(d => d.type === 'optimized-duplicates');
  if (optimizedDupes.length > 0) {
    console.log('🟡 DUPLICATES WITHIN OPTIMIZED FOLDER:');
    console.log(`   Found ${optimizedDupes.length} groups\n`);

    optimizedDupes.slice(0, 10).forEach((group, index) => {
      console.log(`   ${index + 1}. ${group.files.length} duplicates (${formatSize(group.size)})`);
      group.files.forEach((file, fileIndex) => {
        console.log(`      ${fileIndex === 0 ? '✓ KEEP' : '❌ DELETE'}: ${file.path}`);
      });
      console.log('');
    });

    if (optimizedDupes.length > 10) {
      console.log(`   ... and ${optimizedDupes.length - 10} more groups\n`);
    }
  }

  // True optimized versions
  console.log('\n🟢 TRUE OPTIMIZED VERSIONS (Different from original):');
  console.log(`   Found ${optimizedVersions.length} optimized files\n`);

  if (optimizedVersions.length > 0) {
    const topSavings = optimizedVersions
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 10);

    topSavings.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.optimized.filename}`);
      console.log(`      Original: ${formatSize(item.original.size)}`);
      console.log(`      Optimized: ${formatSize(item.optimized.size)}`);
      console.log(`      Savings: ${formatSize(item.savings)} (${item.savingsPercent}%)`);
      console.log('');
    });

    const totalOriginalSize = optimizedVersions.reduce((sum, v) => sum + v.original.size, 0);
    const totalOptimizedSize = optimizedVersions.reduce((sum, v) => sum + v.optimized.size, 0);
    const totalSavings = totalOriginalSize - totalOptimizedSize;
    const avgSavingsPercent = Math.round((totalSavings / totalOriginalSize) * 100);

    console.log(`   📊 Overall optimization stats:`);
    console.log(`      Total original size: ${formatSize(totalOriginalSize)}`);
    console.log(`      Total optimized size: ${formatSize(totalOptimizedSize)}`);
    console.log(`      Total savings: ${formatSize(totalSavings)} (${avgSavingsPercent}%)\n`);
  }

  // Space savings summary
  let totalDeletableSpace = 0;
  const deletableFiles = [];

  noOptimization.forEach(group => {
    const optimizedFile = group.files.find(f => f.isOptimized);
    if (optimizedFile) {
      totalDeletableSpace += optimizedFile.size;
      deletableFiles.push(optimizedFile);
    }
  });

  optimizedDupes.forEach(group => {
    // Delete all but first
    group.files.slice(1).forEach(file => {
      totalDeletableSpace += file.size;
      deletableFiles.push(file);
    });
  });

  console.log('\n💾 SPACE SAVINGS POTENTIAL');
  console.log(`   Files to delete: ${deletableFiles.length}`);
  console.log(`   Space to free: ${formatSize(totalDeletableSpace)}\n`);

  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📄 Detailed report saved to: optimized-duplicates-report.json');

  // Generate deletion script
  if (deletableFiles.length > 0) {
    generateDeletionScript(deletableFiles);
  } else {
    console.log('\n✅ No files to delete - optimized folder is clean!');
  }
}

function generateDeletionScript(filesToDelete) {
  const scriptLines = [
    '#!/bin/bash',
    '# Optimized Folder Cleanup Script',
    '# Generated automatically - REVIEW BEFORE RUNNING!',
    '',
    'echo "⚠️  WARNING: This will delete unnecessary optimized images!"',
    'echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."',
    'sleep 5',
    '',
  ];

  filesToDelete.forEach((file, index) => {
    scriptLines.push(`# ${index + 1}. ${file.filename} (${formatSize(file.size)})`);
    const fullPath = file.fullPath.replace(/\\/g, '/');
    scriptLines.push(`rm "${fullPath}"`);
    scriptLines.push('');
  });

  scriptLines.push(`echo "✅ Deleted ${filesToDelete.length} files"`);

  const bashScript = scriptLines.join('\n');
  const windowsScript = scriptLines
    .map(line => line.replace(/^rm /, 'del ').replace(/\//g, '\\'))
    .join('\r\n');

  fs.writeFileSync('delete-optimized-duplicates.sh', bashScript);
  fs.writeFileSync('delete-optimized-duplicates.bat', windowsScript);

  console.log('\n📝 Deletion scripts generated:');
  console.log('   - delete-optimized-duplicates.sh (Linux/Mac)');
  console.log('   - delete-optimized-duplicates.bat (Windows)');
  console.log('\n⚠️  IMPORTANT: Review the files before running!');
}

// Run the analysis
findOptimizedDuplicates();
