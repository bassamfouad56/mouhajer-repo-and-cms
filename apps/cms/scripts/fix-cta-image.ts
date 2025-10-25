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
      }
    });

    if (!homePage) {
      console.error('❌ Home page not found!');
      process.exit(1);
    }

    console.log('✅ Found home page:', homePage.titleEn);

    // Parse the blocks
    const blocks = homePage.blocks as any[];
    console.log(`📦 Total blocks: ${blocks.length}`);

    // Find the CTA section block
    const ctaBlockIndex = blocks.findIndex(
      (block: any) => block.type === 'cta_section'
    );

    if (ctaBlockIndex === -1) {
      console.error('❌ CTA section block not found!');
      console.log('Available blocks:', blocks.map((b: any) => b.type));
      process.exit(1);
    }

    const ctaBlock = blocks[ctaBlockIndex];
    console.log('✅ Found CTA section block:', ctaBlock.id);
    console.log('Current data:', JSON.stringify(ctaBlock.data, null, 2));

    // Get a random image from media library to use as background
    const mediaImages = await prisma.media.findMany({
      where: {
        mimeType: {
          startsWith: 'image/'
        }
      },
      take: 1,
      orderBy: {
        uploadedAt: 'desc'
      }
    });

    if (mediaImages.length === 0) {
      console.error('❌ No images found in media library!');
      process.exit(1);
    }

    const backgroundImage = mediaImages[0].url;
    console.log('🖼️  Using image:', backgroundImage);

    // Update the CTA block to add backgroundImage
    ctaBlock.data = {
      ...ctaBlock.data,
      backgroundImage: backgroundImage,
      // Also ensure other fields exist
      title: ctaBlock.data?.title || {
        en: 'Ready to Transform Your Space?',
        ar: 'هل أنت مستعد لتحويل مساحتك؟'
      },
      description: ctaBlock.data?.description || {
        en: 'Schedule a free consultation with our design experts today.',
        ar: 'حدد موعدًا لاستشارة مجانية مع خبراء التصميم لدينا اليوم.'
      }
    };

    // Update blocks array
    blocks[ctaBlockIndex] = ctaBlock;

    // Save back to database
    await prisma.page.update({
      where: { id: homePage.id },
      data: {
        blocks: blocks,
        updatedAt: new Date()
      }
    });

    console.log('✅ Successfully updated CTA section block!');
    console.log('Updated data:', JSON.stringify(ctaBlock.data, null, 2));

    // Also log a summary
    console.log('\n📊 Summary:');
    console.log('  - Page:', homePage.titleEn);
    console.log('  - Block type:', ctaBlock.type);
    console.log('  - Background image:', backgroundImage);
    console.log('  - Has title:', !!ctaBlock.data?.title);
    console.log('  - Has description:', !!ctaBlock.data?.description);

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
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
