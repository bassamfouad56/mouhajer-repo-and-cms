const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Advanced Duplicate Image Finder
 * Finds duplicates based on:
 * 1. File content hash (MD5)
 * 2. File size
 * 3. Similar filenames
 */

const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

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

// Normalize filename for comparison
function normalizeFilename(filename) {
  return filename
    .toLowerCase()
    .replace(/[_\-\s]+/g, '')
    .replace(/\d+/g, '')
    .replace(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i, '');
}

// Calculate similarity between two strings
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

// Levenshtein distance
function getEditDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

// Format file size
function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Main function
function findDuplicates() {
  console.log('🔍 Starting advanced duplicate image detection...\n');

  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('❌ Images directory not found:', IMAGES_DIR);
    return;
  }

  // Find all images
  const allImages = findAllImages(IMAGES_DIR);
  console.log(`📁 Found ${allImages.length} total images\n`);

  // Group by hash (exact duplicates)
  const hashMap = new Map();
  const sizeMap = new Map();
  const imageData = [];

  console.log('📊 Analyzing images...');
  allImages.forEach((imagePath, index) => {
    const hash = getFileHash(imagePath);
    const size = getFileSize(imagePath);
    const relativePath = path.relative(PUBLIC_DIR, imagePath);
    const filename = path.basename(imagePath);
    const normalizedName = normalizeFilename(filename);

    const data = {
      path: relativePath,
      fullPath: imagePath,
      filename,
      normalizedName,
      hash,
      size,
    };

    imageData.push(data);

    // Group by hash
    if (!hashMap.has(hash)) {
      hashMap.set(hash, []);
    }
    hashMap.get(hash).push(data);

    // Group by size
    if (!sizeMap.has(size)) {
      sizeMap.set(size, []);
    }
    sizeMap.get(size).push(data);

    if ((index + 1) % 100 === 0) {
      process.stdout.write(`\r   Processed ${index + 1}/${allImages.length} images...`);
    }
  });
  console.log(`\r   Processed ${allImages.length}/${allImages.length} images ✓\n`);

  // Find exact duplicates (same hash)
  const exactDuplicates = [];
  hashMap.forEach((images, hash) => {
    if (images.length > 1) {
      exactDuplicates.push({
        hash,
        size: images[0].size,
        files: images,
      });
    }
  });

  // Find potential duplicates (same size, different hash)
  const potentialDuplicates = [];
  sizeMap.forEach((images, size) => {
    if (images.length > 1) {
      // Group by hash within same size
      const hashGroups = new Map();
      images.forEach(img => {
        if (!hashGroups.has(img.hash)) {
          hashGroups.set(img.hash, []);
        }
        hashGroups.get(img.hash).push(img);
      });

      // Only include if there are different hashes
      if (hashGroups.size > 1) {
        potentialDuplicates.push({
          size,
          groups: Array.from(hashGroups.values()),
        });
      }
    }
  });

  // Find similar filenames (different content)
  const similarNames = [];
  for (let i = 0; i < imageData.length; i++) {
    for (let j = i + 1; j < imageData.length; j++) {
      const img1 = imageData[i];
      const img2 = imageData[j];

      // Skip if same hash (already in exact duplicates)
      if (img1.hash === img2.hash) continue;

      const similarity = calculateSimilarity(img1.normalizedName, img2.normalizedName);

      if (similarity > 0.7) {
        similarNames.push({
          similarity: Math.round(similarity * 100),
          file1: img1,
          file2: img2,
        });
      }
    }
  }

  // Sort by similarity
  similarNames.sort((a, b) => b.similarity - a.similarity);

  // Generate report
  const report = {
    summary: {
      totalImages: allImages.length,
      exactDuplicates: exactDuplicates.length,
      exactDuplicateFiles: exactDuplicates.reduce((sum, group) => sum + group.files.length, 0),
      potentialDuplicates: potentialDuplicates.length,
      similarNames: similarNames.length,
    },
    exactDuplicates,
    potentialDuplicates,
    similarNames,
  };

  // Save detailed report
  fs.writeFileSync(
    'duplicate-images-detailed-report.json',
    JSON.stringify(report, null, 2)
  );

  // Print summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('                  DUPLICATE REPORT                      ');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`📊 Total Images Analyzed: ${report.summary.totalImages}\n`);

  // Exact duplicates
  console.log('🔴 EXACT DUPLICATES (Same Content):');
  console.log(`   Found ${exactDuplicates.length} groups with ${report.summary.exactDuplicateFiles} files\n`);

  if (exactDuplicates.length > 0) {
    exactDuplicates.forEach((group, index) => {
      console.log(`   Group ${index + 1}: ${group.files.length} identical files (${formatSize(group.size)})`);
      group.files.forEach((file, fileIndex) => {
        console.log(`      ${fileIndex === 0 ? '✓ KEEP' : '❌ DELETE'}: ${file.path}`);
      });
      console.log('');
    });
  }

  // Similar filenames
  console.log('\n🟡 SIMILAR FILENAMES (Different Content):');
  console.log(`   Found ${similarNames.length} pairs of similar names\n`);

  if (similarNames.length > 0) {
    const topSimilar = similarNames.slice(0, 20);
    topSimilar.forEach((pair, index) => {
      console.log(`   ${index + 1}. Similarity: ${pair.similarity}%`);
      console.log(`      File 1: ${pair.file1.path} (${formatSize(pair.file1.size)})`);
      console.log(`      File 2: ${pair.file2.path} (${formatSize(pair.file2.size)})`);
      console.log('');
    });

    if (similarNames.length > 20) {
      console.log(`   ... and ${similarNames.length - 20} more pairs\n`);
    }
  }

  // Potential duplicates
  if (potentialDuplicates.length > 0) {
    console.log('\n🟠 SAME SIZE, DIFFERENT CONTENT:');
    console.log(`   Found ${potentialDuplicates.length} size groups\n`);

    potentialDuplicates.slice(0, 10).forEach((group, index) => {
      console.log(`   ${index + 1}. Size: ${formatSize(group.size)} - ${group.groups.length} different files`);
      group.groups.forEach((files, groupIndex) => {
        files.forEach(file => {
          console.log(`      ${file.path}`);
        });
      });
      console.log('');
    });
  }

  // Space savings
  let spaceSavings = 0;
  exactDuplicates.forEach(group => {
    spaceSavings += group.size * (group.files.length - 1);
  });

  console.log('\n💾 POTENTIAL SPACE SAVINGS');
  console.log(`   By removing exact duplicates: ${formatSize(spaceSavings)}\n`);

  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📄 Detailed report saved to: duplicate-images-detailed-report.json');

  // Generate deletion script
  generateDeletionScript(exactDuplicates);
}

function generateDeletionScript(exactDuplicates) {
  if (exactDuplicates.length === 0) {
    console.log('\n✅ No exact duplicates to delete!');
    return;
  }

  const scriptLines = [
    '#!/bin/bash',
    '# Duplicate Image Deletion Script',
    '# Generated automatically - REVIEW BEFORE RUNNING!',
    '',
    'echo "⚠️  WARNING: This will delete duplicate images!"',
    'echo "Press Ctrl+C to cancel, or wait 5 seconds to continue..."',
    'sleep 5',
    '',
  ];

  let deleteCount = 0;

  exactDuplicates.forEach((group, index) => {
    scriptLines.push(`# Group ${index + 1}: ${group.files.length} duplicates of ${group.files[0].filename}`);

    // Keep first, delete rest
    group.files.slice(1).forEach(file => {
      const fullPath = file.fullPath.replace(/\\/g, '/');
      scriptLines.push(`rm "${fullPath}"`);
      deleteCount++;
    });

    scriptLines.push('');
  });

  scriptLines.push(`echo "✅ Deleted ${deleteCount} duplicate files"`);

  const bashScript = scriptLines.join('\n');
  const windowsScript = scriptLines
    .map(line => line.replace(/^rm /, 'del ').replace(/\//g, '\\'))
    .join('\r\n');

  fs.writeFileSync('delete-duplicates.sh', bashScript);
  fs.writeFileSync('delete-duplicates.bat', windowsScript);

  console.log('\n📝 Deletion scripts generated:');
  console.log('   - delete-duplicates.sh (Linux/Mac)');
  console.log('   - delete-duplicates.bat (Windows)');
  console.log('\n⚠️  IMPORTANT: Review the files before running!');
}

// Run the analysis
findDuplicates();
