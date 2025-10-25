import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Adding Featured In block to homepage...');

    // Find the homepage (empty slug means homepage)
    const homepage = await prisma.page.findFirst({
      where: {
        OR: [
          { slugEn: '' },
          { slugEn: '/' },
          { titleEn: { contains: 'Home', mode: 'insensitive' } }
        ]
      },
      include: {
        blocks: true
      }
    });

    if (!homepage) {
      console.log('❌ Homepage not found in database');
      throw new Error('Homepage not found');
    }

    console.log(`✓ Found homepage: "${homepage.titleEn}" (ID: ${homepage.id})`);
    console.log(`  Current blocks count: ${homepage.blocks.length}`);

    // Check if featured_in block already exists
    const featuredInExists = homepage.blocks.some(block => block.type === 'featured_in');

    if (featuredInExists) {
      console.log('✓ Featured In block already exists!');
      return;
    }

    // Find the highest order number
    const maxOrder = homepage.blocks.length > 0
      ? Math.max(...homepage.blocks.map(block => block.order))
      : 0;

    // Create the featured_in block
    const newBlock = await prisma.pageBlock.create({
      data: {
        pageId: homepage.id,
        type: 'featured_in',
        order: maxOrder + 1,
        data: {
          title: {
            en: 'Featured In',
            ar: 'مميز في'
          }
        }
      }
    });

    console.log('✓ Successfully added Featured In block!');
    console.log('  Block ID:', newBlock.id);
    console.log('  Block order:', newBlock.order);
    console.log('  Block type:', newBlock.type);

  } catch (error) {
    console.error('Error adding Featured In block:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('\n✓ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  });
