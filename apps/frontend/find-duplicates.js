const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Get all image files recursively
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Calculate hash for a file
function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

// Find duplicates
function findDuplicates(imagesDir) {
  const images = getAllImages(imagesDir);
  const hashMap = new Map();
  const duplicates = [];

  console.log(`Scanning ${images.length} images...`);

  images.forEach(imgPath => {
    const hash = getFileHash(imgPath);

    if (hashMap.has(hash)) {
      hashMap.get(hash).push(imgPath);
    } else {
      hashMap.set(hash, [imgPath]);
    }
  });

  // Find groups with duplicates
  let totalDuplicates = 0;
  hashMap.forEach((files, hash) => {
    if (files.length > 1) {
      duplicates.push({ hash, files });
      totalDuplicates += files.length - 1; // All but the first are duplicates
    }
  });

  return { duplicates, totalDuplicates };
}

// Main execution
const imagesDir = path.join(__dirname, 'public', 'images');
const { duplicates, totalDuplicates } = findDuplicates(imagesDir);

console.log(`\n=== DUPLICATE IMAGE REPORT ===`);
console.log(`Total duplicate files that can be removed: ${totalDuplicates}`);
console.log(`Number of duplicate groups: ${duplicates.length}\n`);

// Show first 20 duplicate groups
duplicates.slice(0, 20).forEach((group, index) => {
  console.log(`\nGroup ${index + 1} (${group.files.length} copies):`);
  group.files.forEach((file, i) => {
    const relPath = path.relative(imagesDir, file);
    console.log(`  ${i === 0 ? '[KEEP]' : '[DELETE]'} ${relPath}`);
  });
});

if (duplicates.length > 20) {
  console.log(`\n... and ${duplicates.length - 20} more duplicate groups`);
}

// Save full report
const report = {
  totalDuplicates,
  duplicateGroups: duplicates.length,
  groups: duplicates.map(g => ({
    files: g.files.map(f => path.relative(imagesDir, f))
  }))
};

fs.writeFileSync(
  path.join(__dirname, 'duplicate-images-report.json'),
  JSON.stringify(report, null, 2)
);

console.log(`\nFull report saved to: duplicate-images-report.json`);
