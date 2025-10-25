import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPageStructure() {
  try {
    console.log('🔍 Checking page structure...\n');

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

    console.log('📄 Page data:');
    console.log('ID:', homePage.id);
    console.log('Title EN:', homePage.titleEn);
    console.log('Title AR:', homePage.titleAr);
    console.log('Slug EN:', homePage.slugEn);
    console.log('Slug AR:', homePage.slugAr);
    console.log('\n📦 Blocks field type:', typeof homePage.blocks);
    console.log('Blocks is null?', homePage.blocks === null);
    console.log('Blocks is undefined?', homePage.blocks === undefined);

    if (homePage.blocks) {
      console.log('Blocks value:', JSON.stringify(homePage.blocks, null, 2));
    } else {
      console.log('⚠️  Blocks field is null or undefined!');
    }

    console.log('\n🔍 All page fields:');
    console.log(Object.keys(homePage));

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkPageStructure()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
