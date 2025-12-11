const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../public/founder');
const outputDir = path.join(__dirname, '../public/founder/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const images = [
  {
    input: 'CEO Arabia.jpg',
    output: 'ceo-arabia',
    sizes: [
      { width: 1920, suffix: 'hero' },
      { width: 1200, suffix: 'large' },
      { width: 800, suffix: 'medium' },
      { width: 600, suffix: 'small' },
    ]
  },
  {
    input: 'CID_2106_00_COVER.jpg',
    output: 'magazine-cover',
    sizes: [
      { width: 1920, suffix: 'hero' },
      { width: 1200, suffix: 'large' },
      { width: 800, suffix: 'medium' },
    ]
  },
  {
    input: 'Pages from entrepreneur_middle_east_2025_may1_2025__.pdf (1).jpg',
    output: 'entrepreneur-feature',
    sizes: [
      { width: 2000, suffix: 'hero' },
      { width: 1200, suffix: 'large' },
      { width: 800, suffix: 'medium' },
    ]
  }
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  for (const image of images) {
    const inputPath = path.join(sourceDir, image.input);

    if (!fs.existsSync(inputPath)) {
      console.log(`❌ File not found: ${image.input}`);
      continue;
    }

    console.log(`📸 Processing: ${image.input}`);

    for (const size of image.sizes) {
      const outputName = `${image.output}-${size.suffix}`;

      try {
        // Generate WebP version (best compression)
        await sharp(inputPath)
          .resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .webp({ quality: 90, effort: 6 })
          .toFile(path.join(outputDir, `${outputName}.webp`));

        console.log(`  ✅ Created ${outputName}.webp (${size.width}px)`);

        // Generate AVIF version (even better compression, newer format)
        await sharp(inputPath)
          .resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .avif({ quality: 85, effort: 6 })
          .toFile(path.join(outputDir, `${outputName}.avif`));

        console.log(`  ✅ Created ${outputName}.avif (${size.width}px)`);

        // Generate optimized JPEG as fallback
        await sharp(inputPath)
          .resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 90, progressive: true })
          .toFile(path.join(outputDir, `${outputName}.jpg`));

        console.log(`  ✅ Created ${outputName}.jpg (${size.width}px)`);

      } catch (error) {
        console.error(`  ❌ Error processing ${outputName}:`, error.message);
      }
    }

    console.log('');
  }

  console.log('✨ Image optimization complete!\n');
  console.log('📁 Optimized images saved to: public/founder/optimized/\n');
  console.log('📊 Summary:');
  console.log('   - WebP: Best quality/size ratio (90% quality)');
  console.log('   - AVIF: Next-gen format (85% quality, smallest size)');
  console.log('   - JPEG: Fallback for older browsers (90% quality)\n');
}

optimizeImages().catch(console.error);
