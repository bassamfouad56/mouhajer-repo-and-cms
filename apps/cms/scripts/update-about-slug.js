require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '..', '.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAboutPageSlug() {
  console.log('🔄 Updating About page slug to "who-we-are"...\n');

  try {
    // Find the About page
    const aboutPage = await prisma.page.findFirst({
      where: {
        OR: [
          { slugEn: 'about' },
          { slugEn: 'about-us' },
          { titleEn: { contains: 'About', mode: 'insensitive' } }
        ]
      }
    });

    if (!aboutPage) {
      console.log('❌ About page not found. Available options:');
      console.log('   1. Create a new "who-we-are" page in the CMS');
      console.log('   2. Check if the page exists with a different slug\n');

      // List all pages to help find it
      const allPages = await prisma.page.findMany({
        select: {
          id: true,
          titleEn: true,
          titleAr: true,
          slugEn: true,
          slugAr: true,
          status: true
        }
      });

      console.log('📋 Existing pages:');
      allPages.forEach(page => {
        console.log(`   - ${page.titleEn} (/${page.slugEn}) - Status: ${page.status}`);
      });

      return;
    }

    console.log(`✓ Found page: "${aboutPage.titleEn}" with slug "/${aboutPage.slugEn}"`);

    // Update the slug
    const updatedPage = await prisma.page.update({
      where: { id: aboutPage.id },
      data: {
        slugEn: 'who-we-are',
        slugAr: 'من-نحن'
      }
    });

    console.log('\n✅ Successfully updated page slug!');
    console.log(`   English: /${updatedPage.slugEn}`);
    console.log(`   Arabic: /${updatedPage.slugAr}`);
    console.log('\n🌐 You can now visit:');
    console.log(`   http://localhost:3000/en/who-we-are`);
    console.log(`   http://localhost:3000/ar/من-نحن`);

  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ Error: A page with slug "who-we-are" already exists!');

      // Find the conflicting page
      const existingPage = await prisma.page.findUnique({
        where: { slugEn: 'who-we-are' }
      });

      if (existingPage) {
        console.log(`\n📄 Existing "who-we-are" page:`);
        console.log(`   Title: ${existingPage.titleEn}`);
        console.log(`   ID: ${existingPage.id}`);
        console.log(`   Status: ${existingPage.status}`);
        console.log('\n💡 Options:');
        console.log('   1. Delete or rename the existing "who-we-are" page');
        console.log('   2. Use a different slug for the about page');
      }
    } else {
      console.error('❌ Error updating page:', error);
    }
  }
}

async function main() {
  await updateAboutPageSlug();
}

main()
  .catch((e) => {
    console.error('❌ Script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
