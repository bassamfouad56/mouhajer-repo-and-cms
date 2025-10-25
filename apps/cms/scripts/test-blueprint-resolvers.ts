import { PrismaClient } from '@prisma/client';
import { initializeBlueprintResolvers } from '../src/graphql/resolvers/blueprints';

const prisma = new PrismaClient();

async function testBlueprintResolvers() {
  console.log('🧪 Testing Blueprint Resolvers\n');

  try {
    // Initialize resolvers
    console.log('1️⃣  Initializing blueprint resolvers...');
    const resolvers = await initializeBlueprintResolvers(prisma);
    console.log('✅ Resolvers initialized successfully\n');

    // Test 1: List all blueprints
    console.log('2️⃣  Testing blueprint metadata query...');
    const blueprints = await resolvers.Query.blueprints();
    console.log(`✅ Found ${blueprints.length} blueprints:`);
    blueprints.forEach((bp: any) => {
      console.log(`   - ${bp.displayName} (${bp.name}) - Type: ${bp.blueprintType}`);
    });
    console.log('');

    // Test 2: Create a HeroBanner instance
    console.log('3️⃣  Testing createHeroBanner mutation...');
    const newHeroBanner = await resolvers.Mutation.createHeroBanner(
      null,
      {
        input: {
          headingEn: 'Welcome to Our Interior Design Studio',
          headingAr: 'مرحبا بكم في استوديو التصميم الداخلي',
          subheadingEn: 'Transform your space into a masterpiece',
          subheadingAr: 'حول مساحتك إلى تحفة فنية',
          alignment: 'center',
        },
        locale: 'EN',
      },
      { prisma }
    );
    console.log('✅ Created HeroBanner:');
    console.log(`   ID: ${newHeroBanner.id}`);
    console.log(`   Heading (EN): ${newHeroBanner.headingEn}`);
    console.log(`   Heading (AR): ${newHeroBanner.headingAr}`);
    console.log(`   Status: ${newHeroBanner.status}`);
    console.log('');

    // Test 3: Query the hero banner by ID (EN locale)
    console.log('4️⃣  Testing herobanner query (EN locale)...');
    const heroBannerEN = await resolvers.Query.herobanner(
      null,
      { id: newHeroBanner.id, locale: 'EN' },
      { prisma }
    );
    console.log('✅ Retrieved HeroBanner (EN):');
    console.log(`   Heading: ${heroBannerEN.headingEn}`);
    console.log('');

    // Test 4: Query the hero banner by ID (AR locale)
    console.log('5️⃣  Testing herobanner query (AR locale)...');
    const heroBannerAR = await resolvers.Query.herobanner(
      null,
      { id: newHeroBanner.id, locale: 'AR' },
      { prisma }
    );
    console.log('✅ Retrieved HeroBanner (AR):');
    console.log(`   Heading: ${heroBannerAR.headingAr}`);
    console.log('');

    // Test 5: Update the hero banner
    console.log('6️⃣  Testing updateHeroBanner mutation...');
    const updatedHeroBanner = await resolvers.Mutation.updateHeroBanner(
      null,
      {
        id: newHeroBanner.id,
        input: {
          headingEn: 'Welcome to Our Award-Winning Interior Design Studio',
          status: 'published',
        },
        locale: 'EN',
      },
      { prisma }
    );
    console.log('✅ Updated HeroBanner:');
    console.log(`   New Heading: ${updatedHeroBanner.headingEn}`);
    console.log(`   New Status: ${updatedHeroBanner.status}`);
    console.log('');

    // Test 6: List all hero banners
    console.log('7️⃣  Testing herobanners query (list all)...');
    const allHeroBanners = await resolvers.Query.herobanners(
      null,
      { locale: 'EN', limit: 10, offset: 0 },
      { prisma }
    );
    console.log(`✅ Found ${allHeroBanners.length} HeroBanner(s):`);
    allHeroBanners.forEach((hb: any) => {
      console.log(`   - ${hb.headingEn} (${hb.status})`);
    });
    console.log('');

    // Test 7: Create a Testimonial instance
    console.log('8️⃣  Testing createTestimonials mutation...');
    const newTestimonial = await resolvers.Mutation.createTestimonials(
      null,
      {
        input: {
          titleEn: 'Client Testimonials',
          titleAr: 'شهادات العملاء',
          items: [
            {
              name: 'Sarah Johnson',
              roleEn: 'CEO, TechCorp',
              roleAr: 'المديرة التنفيذية، تك كورب',
              commentEn: 'Exceptional design work! They transformed our office space.',
              commentAr: 'عمل تصميم استثنائي! لقد حولوا مساحة مكتبنا.',
              rating: 5,
            },
            {
              name: 'Ahmed Al-Mansoori',
              roleEn: 'Homeowner',
              roleAr: 'مالك منزل',
              commentEn: 'Professional service from start to finish.',
              commentAr: 'خدمة احترافية من البداية إلى النهاية.',
              rating: 5,
            },
          ],
        },
        locale: 'EN',
      },
      { prisma }
    );
    console.log('✅ Created Testimonials:');
    console.log(`   ID: ${newTestimonial.id}`);
    console.log(`   Title (EN): ${newTestimonial.titleEn}`);
    console.log(`   Title (AR): ${newTestimonial.titleAr}`);
    console.log(`   Items: ${JSON.stringify(newTestimonial.items, null, 2)}`);
    console.log('');

    // Test 8: Duplicate hero banner
    console.log('9️⃣  Testing duplicateHeroBanner mutation...');
    const duplicatedHeroBanner = await resolvers.Mutation.duplicateHeroBanner(
      null,
      { id: newHeroBanner.id },
      { prisma }
    );
    console.log('✅ Duplicated HeroBanner:');
    console.log(`   Original ID: ${newHeroBanner.id}`);
    console.log(`   Duplicate ID: ${duplicatedHeroBanner.id}`);
    console.log(`   Status: ${duplicatedHeroBanner.status} (should be "draft")`);
    console.log('');

    // Test 9: Filter by status
    console.log('🔟 Testing herobanners query with filter (published only)...');
    const publishedHeroBanners = await resolvers.Query.herobanners(
      null,
      {
        locale: 'EN',
        filter: { status: 'published' },
        limit: 10,
      },
      { prisma }
    );
    console.log(`✅ Found ${publishedHeroBanners.length} published HeroBanner(s):`);
    publishedHeroBanners.forEach((hb: any) => {
      console.log(`   - ${hb.headingEn}`);
    });
    console.log('');

    // Test 10: Delete instances (cleanup)
    console.log('1️⃣1️⃣  Cleaning up test data...');
    await resolvers.Mutation.deleteHeroBanner(null, { id: newHeroBanner.id }, { prisma });
    await resolvers.Mutation.deleteHeroBanner(null, { id: duplicatedHeroBanner.id }, { prisma });
    await resolvers.Mutation.deleteTestimonials(null, { id: newTestimonial.id }, { prisma });
    console.log('✅ Test data cleaned up\n');

    console.log('🎉 All tests passed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Blueprint metadata queries');
    console.log('   ✅ Create operations');
    console.log('   ✅ Read operations (single & list)');
    console.log('   ✅ Update operations');
    console.log('   ✅ Delete operations');
    console.log('   ✅ Duplicate operations');
    console.log('   ✅ Filtering operations');
    console.log('   ✅ Bilingual content (EN/AR)');
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testBlueprintResolvers()
  .then(() => {
    console.log('\n✅ All blueprint resolver tests completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Blueprint resolver tests failed:', error);
    process.exit(1);
  });
