import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCtaImage() {
  try {
    console.log('🔍 Finding home page...');

    // Get the home page
    const homePage = await prisma.page.findFirst({
      where: {
        OR: [
          { slugEn: 'home' },
          { id: 'home' }
        ]
      },
      include: {
        blocks: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!homePage) {
      console.error('❌ Home page not found!');
      process.exit(1);
    }

    console.log('✅ Found home page:', homePage.titleEn);
    console.log(`📦 Total blocks: ${homePage.blocks.length}`);

    // Find the CTA section block
    const ctaBlock = homePage.blocks.find(
      (block) => block.type === 'cta_section'
    );

    if (!ctaBlock) {
      console.error('❌ CTA section block not found!');
      console.log('Available blocks:', homePage.blocks.map(b => b.type));
      process.exit(1);
    }

    console.log('✅ Found CTA section block:', ctaBlock.id);
    console.log('Current data:', JSON.stringify(ctaBlock.data, null, 2));

    // Check if backgroundImage already exists
    const currentData = ctaBlock.data as any;
    if (currentData?.backgroundImage) {
      console.log('✅ Background image already exists:', currentData.backgroundImage);
      console.log('No changes needed!');
      process.exit(0);
    }

    // Get a high-quality image from media library
    const mediaImages = await prisma.mediaFile.findMany({
      where: {
        mimeType: {
          startsWith: 'image/'
        },
        width: {
          gte: 1200  // At least 1200px wide for good quality
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      },
      take: 5
    });

    if (mediaImages.length === 0) {
      console.log('⚠️  No high-res images found, trying any image...');
      const anyImage = await prisma.mediaFile.findFirst({
        where: {
          mimeType: {
            startsWith: 'image/'
          }
        },
        orderBy: {
          uploadedAt: 'desc'
        }
      });

      if (!anyImage) {
        console.error('❌ No images found in media library!');
        process.exit(1);
      }

      mediaImages.push(anyImage);
    }

    // Pick a random image
    const randomImage = mediaImages[Math.floor(Math.random() * mediaImages.length)];
    const backgroundImage = randomImage.url;

    console.log('🖼️  Selected image:', backgroundImage);
    console.log('   Size:', randomImage.width, 'x', randomImage.height);
    console.log('   File:', randomImage.filename);

    // Update the CTA block to add backgroundImage
    const updatedData = {
      ...currentData,
      backgroundImage: backgroundImage,
      // Ensure other required fields exist
      title: currentData?.title || {
        en: 'Ready to Transform Your Space?',
        ar: 'هل أنت مستعد لتحويل مساحتك؟'
      },
      description: currentData?.description || {
        en: 'Schedule a free consultation with our design experts today. Let\'s discuss your vision and create something extraordinary together.',
        ar: 'حدد موعدًا لاستشارة مجانية مع خبراء التصميم لدينا اليوم. دعنا نناقش رؤيتك ونخلق شيئًا استثنائيًا معًا.'
      },
      primaryButton: currentData?.primaryButton || {
        text: { en: 'Book Free Consultation', ar: 'احجز استشارة مجانية' },
        link: '/contact-us'
      }
    };

    // Save to database
    await prisma.pageBlock.update({
      where: { id: ctaBlock.id },
      data: {
        data: updatedData,
        updatedAt: new Date()
      }
    });

    console.log('✅ Successfully updated CTA section block!');
    console.log('Updated data:', JSON.stringify(updatedData, null, 2));

    // Summary
    console.log('\n📊 Summary:');
    console.log('  - Page:', homePage.titleEn);
    console.log('  - Block ID:', ctaBlock.id);
    console.log('  - Block type:', ctaBlock.type);
    console.log('  - Background image:', backgroundImage);
    console.log('  - Image size:', `${randomImage.width}x${randomImage.height}px`);
    console.log('  - Has title:', !!updatedData.title);
    console.log('  - Has description:', !!updatedData.description);
    console.log('  - Has CTA button:', !!updatedData.primaryButton);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixCtaImage()
  .then(() => {
    console.log('\n✨ Done! The CTA section now has a background image.');
    console.log('💡 Tip: Refresh your frontend to see the changes!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
