const fs = require('fs');
const path = require('path');

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

// Find files with duplicate names
function findNameDuplicates(imagesDir) {
  const images = getAllImages(imagesDir);
  const nameMap = new Map();

  images.forEach(imgPath => {
    const fileName = path.basename(imgPath).toLowerCase();

    if (nameMap.has(fileName)) {
      nameMap.get(fileName).push(imgPath);
    } else {
      nameMap.set(fileName, [imgPath]);
    }
  });

  // Find names with duplicates
  const duplicates = [];
  nameMap.forEach((files, name) => {
    if (files.length > 1) {
      duplicates.push({ name, files });
    }
  });

  return duplicates;
}

// Main execution
const imagesDir = path.join(__dirname, 'public', 'images');
const duplicates = findNameDuplicates(imagesDir);

console.log(`\n=== DUPLICATE IMAGE NAMES REPORT ===`);
console.log(`Total images with duplicate names: ${duplicates.length}`);

if (duplicates.length > 0) {
  console.log(`\nShowing all duplicate name groups:\n`);

  duplicates.forEach((group, index) => {
    console.log(`\nGroup ${index + 1}: "${group.name}" (${group.files.length} copies)`);
    group.files.forEach((file, i) => {
      const relPath = path.relative(imagesDir, file);
      const size = fs.statSync(file).size;
      console.log(`  ${i + 1}. ${relPath} (${(size / 1024).toFixed(2)} KB)`);
    });
  });

  // Save report
  const report = {
    totalDuplicateNames: duplicates.length,
    groups: duplicates.map(g => ({
      name: g.name,
      count: g.files.length,
      files: g.files.map(f => ({
        path: path.relative(imagesDir, f),
        size: fs.statSync(f).size
      }))
    }))
  };

  fs.writeFileSync(
    path.join(__dirname, 'duplicate-names-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log(`\nFull report saved to: duplicate-names-report.json`);
} else {
  console.log('\nNo duplicate image names found!');
}
