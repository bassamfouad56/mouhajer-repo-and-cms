const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all image files
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
      fileList.push({ path: filePath, size: stat.size, name: file });
    }
  });

  return fileList;
}

// Analyze images
const imagesDir = path.join(__dirname, 'public', 'images');
const images = getAllImages(imagesDir);

// Sort by size
const sortedBySize = [...images].sort((a, b) => b.size - a.size);

// Calculate total size
const totalSize = images.reduce((sum, img) => sum + img.size, 0);
const avgSize = totalSize / images.length;

console.log(`\n=== IMAGE ANALYSIS REPORT ===`);
console.log(`Total images: ${images.length}`);
console.log(`Total size: ${(totalSize / (1024 * 1024)).toFixed(2)} MB`);
console.log(`Average size: ${(avgSize / 1024).toFixed(2)} KB`);

// Find very large images (> 5MB)
const largeImages = images.filter(img => img.size > 5 * 1024 * 1024);
console.log(`\nLarge images (>5MB): ${largeImages.length}`);
if (largeImages.length > 0) {
  console.log('\nTop 20 largest images:');
  sortedBySize.slice(0, 20).forEach((img, i) => {
    const relPath = path.relative(imagesDir, img.path);
    console.log(`${i + 1}. ${relPath} - ${(img.size / (1024 * 1024)).toFixed(2)} MB`);
  });
}

// Find images with sequential numbers (potential duplicates)
const sequentialGroups = new Map();
images.forEach(img => {
  const baseName = img.name.replace(/[-_]?\d+[-_]?(HDR)?\./, '.');
  if (baseName !== img.name) {
    if (!sequentialGroups.has(baseName)) {
      sequentialGroups.set(baseName, []);
    }
    sequentialGroups.get(baseName).push(img);
  }
});

const largeSequentialGroups = Array.from(sequentialGroups.entries())
  .filter(([_, files]) => files.length > 5)
  .sort((a, b) => b[1].length - a[1].length);

if (largeSequentialGroups.length > 0) {
  console.log(`\n\nSequential image groups (potential batch uploads):`);
  largeSequentialGroups.slice(0, 10).forEach(([baseName, files]) => {
    const totalGroupSize = files.reduce((sum, f) => sum + f.size, 0);
    console.log(`\n"${baseName}" pattern: ${files.length} images, ${(totalGroupSize / (1024 * 1024)).toFixed(2)} MB total`);
    console.log(`  First: ${files[0].name}`);
    console.log(`  Last: ${files[files.length - 1].name}`);
  });
}

// Check for images referenced in code
console.log(`\n\nChecking image usage in codebase...`);
const usedImages = new Set();
const codeFiles = execSync('find . -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js"', { encoding: 'utf-8' })
  .split('\n')
  .filter(f => f && !f.includes('node_modules'));

images.forEach(img => {
  const imgName = path.basename(img.path);
  const isUsed = codeFiles.some(file => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      return content.includes(imgName);
    } catch {
      return false;
    }
  });
  if (isUsed) {
    usedImages.add(img.path);
  }
});

const unusedImages = images.filter(img => !usedImages.has(img.path));
const unusedSize = unusedImages.reduce((sum, img) => sum + img.size, 0);

console.log(`Images referenced in code: ${usedImages.size}`);
console.log(`Potentially unused images: ${unusedImages.length}`);
console.log(`Potentially unused space: ${(unusedSize / (1024 * 1024)).toFixed(2)} MB`);

// Save detailed report
const report = {
  summary: {
    totalImages: images.length,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    avgSizeKB: (avgSize / 1024).toFixed(2),
    largeImages: largeImages.length,
    usedImages: usedImages.size,
    unusedImages: unusedImages.length,
    unusedSizeMB: (unusedSize / (1024 * 1024)).toFixed(2)
  },
  largestImages: sortedBySize.slice(0, 50).map(img => ({
    path: path.relative(imagesDir, img.path),
    sizeMB: (img.size / (1024 * 1024)).toFixed(2)
  })),
  sequentialGroups: largeSequentialGroups.slice(0, 20).map(([baseName, files]) => ({
    pattern: baseName,
    count: files.length,
    totalSizeMB: (files.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024)).toFixed(2)
  })),
  potentiallyUnused: unusedImages.slice(0, 100).map(img => ({
    path: path.relative(imagesDir, img.path),
    sizeMB: (img.size / (1024 * 1024)).toFixed(2)
  }))
};

fs.writeFileSync(
  path.join(__dirname, 'image-analysis-report.json'),
  JSON.stringify(report, null, 2)
);

console.log(`\n\nDetailed report saved to: image-analysis-report.json`);
