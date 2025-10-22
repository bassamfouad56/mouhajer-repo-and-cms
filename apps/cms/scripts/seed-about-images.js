require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// About section images to seed (using high-quality professional interior design images)
const aboutImages = [
  {
    name: 'mouhajer-studio-main',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Mouhajer International Design Studio',
    tags: ['about', 'studio', 'main']
  },
  {
    name: 'team-at-work',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Design Team at Work',
    tags: ['about', 'team', 'work']
  },
  {
    name: 'luxury-project-showcase',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Luxury Interior Project',
    tags: ['about', 'project', 'luxury']
  },
  {
    name: 'modern-villa-design',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Modern Villa Interior',
    tags: ['about', 'villa', 'modern']
  },
  {
    name: 'commercial-space',
    url: 'https://images.unsplash.com/photo-1565183928294-7d21b36c9c24?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    alt: 'Commercial Space Design',
    tags: ['about', 'commercial', 'office']
  }
];

async function uploadImageFromUrl(imageData) {
  try {
    // For seeding purposes, we'll save the images directly to the MediaFile table
    // In production, you would use the actual upload endpoint with proper authentication

    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename: `${imageData.name}.jpg`,
        originalName: `${imageData.name}.jpg`,
        url: imageData.url,
        thumbnailUrl: imageData.url, // Same as main URL for now
        mimeType: 'image/jpeg',
        type: 'image',
        size: 500000, // Approximate size
        width: 1200,
        height: 800,
        alt: imageData.alt,
        tags: imageData.tags
      }
    });

    return mediaFile;
  } catch (error) {
    console.error(`Failed to create media entry for ${imageData.name}:`, error);
    return null;
  }
}

async function updateAboutSectionGallery(galleryUrls) {
  try {
    // Find the home page
    const homePage = await prisma.page.findFirst({
      where: {
        slugEn: 'home'
      },
      include: {
        blocks: true
      }
    });

    if (!homePage) {
      console.log('Home page not found. Please run the seed-home-page script first.');
      return;
    }

    // Find the about_section block
    const aboutBlock = homePage.blocks.find(block => block.type === 'about_section');

    if (!aboutBlock) {
      console.log('About section block not found in home page.');
      return;
    }

    // Update the block with new gallery URLs
    const updatedData = {
      ...aboutBlock.data,
      gallery: galleryUrls
    };

    await prisma.block.update({
      where: { id: aboutBlock.id },
      data: {
        data: updatedData
      }
    });

    console.log('✅ Updated about section gallery with new images');
  } catch (error) {
    console.error('Failed to update about section gallery:', error);
  }
}

async function main() {
  console.log('🌱 Seeding About Section Images...\n');

  const uploadedImages = [];

  // Upload each image
  for (const imageData of aboutImages) {
    console.log(`📸 Processing: ${imageData.name}`);
    const mediaFile = await uploadImageFromUrl(imageData);

    if (mediaFile) {
      uploadedImages.push(mediaFile.url);
      console.log(`✅ Created media entry: ${imageData.name}`);
    }
  }

  console.log(`\n🎉 Successfully created ${uploadedImages.length} media entries`);

  // Update the about section block with the new gallery images
  if (uploadedImages.length > 0) {
    console.log('\n🔄 Updating about section gallery...');
    await updateAboutSectionGallery(uploadedImages);
  }

  // Display summary
  console.log('\n📊 Summary:');
  console.log(`  - Total images processed: ${aboutImages.length}`);
  console.log(`  - Successfully uploaded: ${uploadedImages.length}`);

  console.log('\n📊 Test the images:');
  console.log('  1. Visit http://localhost:3010/media to view all media files');
  console.log('  2. Visit http://localhost:3010/pages and edit the Home page');
  console.log('  3. Check the About Section block to see the updated gallery');

  console.log('\n📊 API Endpoints:');
  console.log('  GET  http://localhost:3010/api/media - Get all media files');
  console.log('  GET  http://localhost:3010/api/pages - Get all pages with blocks');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding about images:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });