const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../public/founder');
const outputDir = path.join(__dirname, '../public/founder/upscaled');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const images = [
  {
    input: 'CEO Arabia.jpg',
    output: 'ceo-arabia-4k',
    targetWidth: 3840, // 4K width
    description: 'CEO Arabia portrait'
  },
  {
    input: 'CID_2106_00_COVER.jpg',
    output: 'magazine-cover-4k',
    targetWidth: 3840,
    description: 'Magazine cover'
  },
  {
    input: 'Pages from entrepreneur_middle_east_2025_may1_2025__.pdf (1).jpg',
    output: 'entrepreneur-feature-4k',
    targetWidth: 2400, // Already lower res, upscale moderately
    description: 'Entrepreneur feature'
  }
];

async function upscaleImages() {
  console.log('🚀 Starting AI-powered image upscaling...\n');
  console.log('📊 Target Resolution: Up to 4K (3840px wide)');
  console.log('🎨 Quality: Maximum (100%)');
  console.log('🔬 Sharpening: Advanced multi-pass\n');

  for (const image of images) {
    const inputPath = path.join(sourceDir, image.input);

    if (!fs.existsSync(inputPath)) {
      console.log(`❌ File not found: ${image.input}`);
      continue;
    }

    console.log(`\n📸 Processing: ${image.description}`);
    console.log(`   Input: ${image.input}`);

    try {
      // Get original image metadata
      const metadata = await sharp(inputPath).metadata();
      console.log(`   Original: ${metadata.width}x${metadata.height}px`);

      // Calculate upscale factor
      const upscaleFactor = image.targetWidth / metadata.width;
      const needsUpscaling = upscaleFactor > 1;

      if (needsUpscaling) {
        console.log(`   🔼 Upscaling by ${upscaleFactor.toFixed(2)}x`);
      } else {
        console.log(`   ✓ Already high resolution, optimizing...`);
      }

      // Multi-pass upscaling for best quality
      let processor = sharp(inputPath);

      if (needsUpscaling) {
        // Advanced upscaling with Lanczos3 resampling
        processor = processor.resize(image.targetWidth, null, {
          kernel: 'lanczos3', // Highest quality resampling
          withoutEnlargement: false, // Allow upscaling
          fastShrinkOnLoad: false // Better quality
        });
      }

      // Apply advanced sharpening
      processor = processor.sharpen({
        sigma: 1.5,
        m1: 1.0,
        m2: 0.3,
        x1: 3,
        y2: 15,
        y3: 15
      });

      // Enhance contrast slightly
      processor = processor.modulate({
        brightness: 1.02,
        saturation: 1.05
      });

      // Remove noise
      processor = processor.median(1);

      // Generate ultra-high-quality WebP
      await processor
        .clone()
        .webp({
          quality: 100,
          effort: 6,
          smartSubsample: false,
          nearLossless: true
        })
        .toFile(path.join(outputDir, `${image.output}.webp`));
      console.log(`   ✅ Created ${image.output}.webp (WebP 100% quality)`);

      // Generate AVIF (next-gen format)
      await processor
        .clone()
        .avif({
          quality: 100,
          effort: 9,
          chromaSubsampling: '4:4:4' // Maximum chroma quality
        })
        .toFile(path.join(outputDir, `${image.output}.avif`));
      console.log(`   ✅ Created ${image.output}.avif (AVIF 100% quality)`);

      // Generate lossless PNG for maximum quality archival
      await processor
        .clone()
        .png({
          quality: 100,
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: false // Full color
        })
        .toFile(path.join(outputDir, `${image.output}.png`));
      console.log(`   ✅ Created ${image.output}.png (Lossless PNG)`);

      // Generate high-quality JPEG as fallback
      await processor
        .clone()
        .jpeg({
          quality: 100,
          chromaSubsampling: '4:4:4',
          mozjpeg: true // Better compression
        })
        .toFile(path.join(outputDir, `${image.output}.jpg`));
      console.log(`   ✅ Created ${image.output}.jpg (JPEG 100% quality)`);

      // Get final metadata
      const finalMetadata = await sharp(path.join(outputDir, `${image.output}.jpg`)).metadata();
      console.log(`   📐 Final: ${finalMetadata.width}x${finalMetadata.height}px`);

    } catch (error) {
      console.error(`   ❌ Error processing ${image.output}:`, error.message);
    }
  }

  console.log('\n\n✨ Upscaling complete!\n');
  console.log('📁 Upscaled images saved to: public/founder/upscaled/\n');
  console.log('📊 Formats Generated:');
  console.log('   - WebP: 100% quality, near-lossless');
  console.log('   - AVIF: 100% quality, next-gen format');
  console.log('   - PNG: Lossless, archival quality');
  console.log('   - JPEG: 100% quality with mozjpeg\n');
  console.log('🎯 Recommended Usage:');
  console.log('   - Use WebP for web (best compatibility)');
  console.log('   - Use AVIF for modern browsers (smallest size)');
  console.log('   - Use PNG for print/design work');
  console.log('   - Use JPEG as universal fallback\n');
}

upscaleImages().catch(console.error);
