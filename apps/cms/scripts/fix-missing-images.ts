#!/usr/bin/env tsx
/**
 * Script to fix missing images in homepage blocks
 * Replaces placeholder image paths with real images from media library
 */

const API_URL = 'http://localhost:3010';
const PAGE_ID = '58e67c74-ee22-4b40-8cea-4f3157590452'; // Homepage ID

async function fixMissingImages() {
  console.log('🔄 Fixing missing images in homepage blocks...\n');

  try {
    // 1. Fetch all blocks
    console.log('📥 Fetching homepage blocks...');
    const blocksResponse = await fetch(`${API_URL}/api/pages/${PAGE_ID}/components`);
    const blocks = await blocksResponse.json();
    console.log(`✅ Found ${blocks.length} blocks\n`);

    // 2. Fetch media library
    console.log('📥 Fetching media library...');
    const mediaResponse = await fetch(`${API_URL}/api/media`);
    const media = await mediaResponse.json();
    const images = media.filter((m: any) => m.type === 'image');
    console.log(`✅ Found ${images.length} images in media library\n`);

    // 3. Select replacement images
    const villaImages = images.filter((img: any) => {
      const name = (img.filename || '').toLowerCase();
      const alt = (img.altText || '').toLowerCase();
      return name.includes('villa') || name.includes('luxury') ||
             name.includes('exterior') || name.includes('main') ||
             alt.includes('villa') || alt.includes('luxury');
    });

    const projectImages = images.filter((img: any) => {
      const name = (img.filename || '').toLowerCase();
      return name.includes('project') || name.includes('interior') ||
             name.includes('royal') || name.includes('suite') ||
             name.includes('reception') || name.includes('design');
    });

    const logoImages = images.filter((img: any) => {
      const name = (img.filename || '').toLowerCase();
      return name.endsWith('.png') && (img.size || 0) < 100000 &&
             (name.includes('logo') || name.includes('brand') ||
              name.includes('sheraton') || name.includes('zawya') ||
              name.includes('radison') || name.includes('retaj'));
    });

    console.log(`Found ${villaImages.length} villa/luxury images`);
    console.log(`Found ${projectImages.length} project images`);
    console.log(`Found ${logoImages.length} logo images\n`);

    // 4. Update blocks
    let updatedCount = 0;
    const updatedBlocks = blocks.map((block: any) => {
      const blockType = block.blueprint.name;
      let updated = false;

      // Fix hero_banner background image
      if (blockType === 'hero_banner' && block.dataEn?.backgroundImage === '/images/hero-bg.jpg') {
        const newImage = villaImages[0] || images[0];
        block.dataEn.backgroundImage = newImage.url;
        block.dataAr.backgroundImage = newImage.url;
        console.log(`✏️  Updated hero_banner backgroundImage → ${newImage.filename}`);
        updated = true;
        updatedCount++;
      }

      // Fix featured_in logos
      if (blockType === 'featured_in' && Array.isArray(block.dataEn?.logos)) {
        const logos = block.dataEn.logos;
        let logoUpdated = false;

        logos.forEach((logo: any, index: number) => {
          if (logo.url && logo.url.startsWith('/images/project-')) {
            // Use logo images if available, otherwise use project images
            const replacementImages = logoImages.length >= 8 ? logoImages : projectImages;
            const newImage = replacementImages[index % replacementImages.length];

            if (newImage) {
              logo.url = newImage.url;
              logo.alt = newImage.altText || logo.alt || 'Client Logo';
              logoUpdated = true;
            }
          }
        });

        if (logoUpdated) {
          // Also update Arabic version
          if (Array.isArray(block.dataAr?.logos)) {
            block.dataAr.logos.forEach((logo: any, index: number) => {
              if (logo.url && logo.url.startsWith('/images/project-')) {
                const replacementImages = logoImages.length >= 8 ? logoImages : projectImages;
                const newImage = replacementImages[index % replacementImages.length];
                if (newImage) {
                  logo.url = newImage.url;
                  logo.alt = newImage.altText || logo.alt || 'شعار العميل';
                }
              }
            });
          }
          console.log(`✏️  Updated featured_in logos (${logos.length} logos)`);
          updated = true;
          updatedCount++;
        }
      }

      // Fix services_showcase images
      if (blockType === 'services_showcase' && Array.isArray(block.dataEn?.services)) {
        let servicesUpdated = false;
        block.dataEn.services.forEach((service: any, index: number) => {
          if (service.image === '/images/hero-bg.jpg') {
            const newImage = projectImages[index % projectImages.length] || images[index % images.length];
            service.image = newImage.url;
            servicesUpdated = true;
          }
        });

        if (servicesUpdated && Array.isArray(block.dataAr?.services)) {
          block.dataAr.services.forEach((service: any, index: number) => {
            if (service.image === '/images/hero-bg.jpg') {
              const newImage = projectImages[index % projectImages.length] || images[index % images.length];
              service.image = newImage.url;
            }
          });
          console.log(`✏️  Updated services_showcase images`);
          updated = true;
          updatedCount++;
        }
      }

      // Fix awards_section images
      if (blockType === 'awards_section' && Array.isArray(block.dataEn?.awards)) {
        let awardsUpdated = false;
        block.dataEn.awards.forEach((award: any, index: number) => {
          if (award.image === '/images/hero-bg.jpg') {
            const newImage = projectImages[index % projectImages.length] || images[index % images.length];
            award.image = newImage.url;
            awardsUpdated = true;
          }
        });

        if (awardsUpdated && Array.isArray(block.dataAr?.awards)) {
          block.dataAr.awards.forEach((award: any, index: number) => {
            if (award.image === '/images/hero-bg.jpg') {
              const newImage = projectImages[index % projectImages.length] || images[index % images.length];
              award.image = newImage.url;
            }
          });
          console.log(`✏️  Updated awards_section images`);
          updated = true;
          updatedCount++;
        }
      }

      return block;
    });

    if (updatedCount === 0) {
      console.log('\n✅ No images needed updating - all images are already valid!');
      return;
    }

    // 5. Save updated blocks
    console.log(`\n💾 Saving ${updatedCount} updated blocks...`);
    const saveResponse = await fetch(`${API_URL}/api/pages/${PAGE_ID}/components`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ components: updatedBlocks }),
    });

    if (saveResponse.ok) {
      console.log('✅ Successfully updated all blocks with real images!');
      console.log(`\n📊 Summary:`);
      console.log(`   Total blocks: ${blocks.length}`);
      console.log(`   Updated blocks: ${updatedCount}`);
      console.log(`   Images replaced with media library URLs`);
    } else {
      const error = await saveResponse.json();
      console.error('❌ Failed to save blocks:', error);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
fixMissingImages();
