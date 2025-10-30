import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Removing blueprints that conflict with existing GraphQL schemas...\n');

  // These blueprints have hardcoded GraphQL schemas that conflict
  const conflictingBlueprints = [
    'Testimonials',
    'FAQSection',
    // Already removed: 'Navigation', 'Footer', 'Asset'
  ];

  const result = await prisma.contentBlueprint.deleteMany({
    where: {
      name: {
        in: conflictingBlueprints,
      },
    },
  });

  console.log(`✅ Removed ${result.count} conflicting blueprints`);

  // List remaining blueprints
  const remaining = await prisma.contentBlueprint.findMany({
    select: {
      name: true,
      displayName: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  console.log(`\n📋 Remaining blueprints (${remaining.length}):`);
  remaining.forEach((bp) => {
    console.log(`   - ${bp.displayName} (${bp.name})`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
