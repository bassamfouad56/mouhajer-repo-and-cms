const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

/**
 * Upload Images to Mouhajer CMS
 * This script uploads all images from public/images to the live CMS
 */

const CMS_URL = process.env.CMS_URL || 'https://mouhajer-cms-omega.vercel.app';
const UPLOAD_ENDPOINT = `${CMS_URL}/api/media/upload`;
const IMAGES_DIR = path.join(__dirname, 'public', 'images');

// Configuration
const BATCH_SIZE = 5; // Upload 5 images at a time
const DELAY_BETWEEN_BATCHES = 2000; // 2 seconds delay between batches
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max file size
const SKIP_FOLDERS = ['optimized']; // Skip these folders

// Get all image files recursively
function findAllImages(dir, fileList = [], baseDir = dir) {
  if (!fs.existsSync(dir)) return fileList;

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip certain folders
      if (!SKIP_FOLDERS.includes(file)) {
        findAllImages(filePath, fileList, baseDir);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        const relativePath = path.relative(baseDir, filePath);
        fileList.push({
          fullPath: filePath,
          relativePath,
          filename: file,
          size: stat.size,
        });
      }
    }
  });

  return fileList;
}

// Upload single file
async function uploadFile(file, sessionCookie) {
  const formData = new FormData();
  const fileStream = fs.createReadStream(file.fullPath);

  formData.append('file', fileStream, {
    filename: file.filename,
    contentType: getMimeType(file.filename),
  });

  try {
    const headers = {
      ...formData.getHeaders(),
    };

    // Add session cookie if provided
    if (sessionCookie) {
      headers['Cookie'] = sessionCookie;
    }

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        file: file.filename,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return {
      success: true,
      file: file.filename,
      data,
    };
  } catch (error) {
    return {
      success: false,
      file: file.filename,
      error: error.message,
    };
  }
}

// Get MIME type from filename
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Format file size
function formatSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Sleep helper
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main upload function
async function uploadAllImages() {
  console.log('🚀 Mouhajer CMS Image Upload Tool\n');
  console.log(`📡 CMS URL: ${CMS_URL}`);
  console.log(`📁 Images Directory: ${IMAGES_DIR}\n`);

  // Check if images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log('❌ Images directory not found!');
    return;
  }

  // Find all images
  console.log('🔍 Scanning for images...');
  const allImages = findAllImages(IMAGES_DIR);

  // Filter out files that are too large
  const validImages = allImages.filter(img => img.size <= MAX_FILE_SIZE);
  const skippedLarge = allImages.filter(img => img.size > MAX_FILE_SIZE);

  console.log(`📊 Found ${allImages.length} total images`);
  console.log(`✅ ${validImages.length} images ready to upload`);
  if (skippedLarge.length > 0) {
    console.log(`⚠️  ${skippedLarge.length} images skipped (too large):`);
    skippedLarge.forEach(img => {
      console.log(`   - ${img.filename} (${formatSize(img.size)})`);
    });
  }
  console.log('');

  if (validImages.length === 0) {
    console.log('❌ No images to upload!');
    return;
  }

  // Check if session cookie is provided
  const sessionCookie = process.env.SESSION_COOKIE;
  if (!sessionCookie) {
    console.log('⚠️  WARNING: No SESSION_COOKIE environment variable set!');
    console.log('   The upload may fail if authentication is required.\n');
    console.log('   To set a session cookie:');
    console.log('   1. Login to the CMS in your browser');
    console.log('   2. Open DevTools > Application > Cookies');
    console.log('   3. Copy the session cookie value');
    console.log('   4. Run: SESSION_COOKIE="your-cookie" node upload-images-to-cms.js\n');

    // Ask for confirmation
    console.log('   Continue without authentication? (Ctrl+C to cancel)');
    await sleep(5000);
  }

  // Calculate total size
  const totalSize = validImages.reduce((sum, img) => sum + img.size, 0);
  console.log(`📦 Total upload size: ${formatSize(totalSize)}\n`);

  // Confirm upload
  console.log('⚠️  This will upload all images to the live CMS!');
  console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
  await sleep(5000);

  console.log('🚀 Starting upload...\n');

  // Upload in batches
  const results = {
    success: [],
    failed: [],
    total: validImages.length,
  };

  let uploadedCount = 0;

  for (let i = 0; i < validImages.length; i += BATCH_SIZE) {
    const batch = validImages.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(validImages.length / BATCH_SIZE);

    console.log(`📤 Batch ${batchNum}/${totalBatches} (${batch.length} files):`);

    // Upload batch in parallel
    const promises = batch.map(file => uploadFile(file, sessionCookie));
    const batchResults = await Promise.all(promises);

    // Process results
    batchResults.forEach(result => {
      if (result.success) {
        results.success.push(result);
        uploadedCount++;
        console.log(`   ✅ ${result.file} (${uploadedCount}/${validImages.length})`);
      } else {
        results.failed.push(result);
        console.log(`   ❌ ${result.file} - ${result.error}`);
      }
    });

    // Delay between batches (except for last batch)
    if (i + BATCH_SIZE < validImages.length) {
      console.log(`   ⏳ Waiting ${DELAY_BETWEEN_BATCHES}ms before next batch...\n`);
      await sleep(DELAY_BETWEEN_BATCHES);
    } else {
      console.log('');
    }
  }

  // Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('                  UPLOAD COMPLETE                      ');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`✅ Successfully uploaded: ${results.success.length}/${results.total} files`);
  console.log(`❌ Failed uploads: ${results.failed.length}/${results.total} files\n`);

  if (results.failed.length > 0) {
    console.log('❌ Failed files:');
    results.failed.forEach(result => {
      console.log(`   - ${result.file}: ${result.error}`);
    });
    console.log('');
  }

  // Save results to file
  const reportFile = 'upload-results.json';
  fs.writeFileSync(reportFile, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed results saved to: ${reportFile}\n`);

  // Calculate success rate
  const successRate = Math.round((results.success.length / results.total) * 100);
  console.log(`📊 Success Rate: ${successRate}%`);

  if (results.success.length === results.total) {
    console.log('\n🎉 All images uploaded successfully!');
  } else if (results.failed.length === results.total) {
    console.log('\n😞 All uploads failed. Check authentication and network connection.');
  } else {
    console.log('\n⚠️  Some uploads failed. Check the errors above.');
  }
}

// Run the upload
uploadAllImages().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
