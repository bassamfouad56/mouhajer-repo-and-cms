import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Fixing blueprint conflicts...\n');

  // Remove duplicate/conflicting blueprints
  // Keep only the home page blueprints, remove any system duplicates
  const blueprintsToRemove = [
    'HeroBanner',       // Keep hero_banner instead
    'ImageGallery',     // Not needed for forms
    'VideoEmbed',       // Not needed for forms
    'RichText',         // Not needed for forms
    'CTASection',       // Not needed for forms
  ];

  console.log('📋 Removing conflicting blueprints:');
  blueprintsToRemove.forEach(name => console.log(`   - ${name}`));
  console.log();

  const result = await prisma.contentBlueprint.deleteMany({
    where: {
      name: {
        in: blueprintsToRemove,
      },
    },
  });

  console.log(`✅ Removed ${result.count} conflicting blueprints\n`);

  // List remaining blueprints
  const remaining = await prisma.contentBlueprint.findMany({
    select: {
      name: true,
      displayName: true,
      category: true,
    },
    orderBy: {
      category: 'asc',
    },
  });

  console.log(`📋 Remaining blueprints (${remaining.length}):`);

  const byCategory: Record<string, any[]> = {};
  remaining.forEach((bp) => {
    if (!byCategory[bp.category]) {
      byCategory[bp.category] = [];
    }
    byCategory[bp.category].push(bp);
  });

  Object.entries(byCategory).forEach(([category, blueprints]) => {
    console.log(`\n  ${category}:`);
    blueprints.forEach((bp) => {
      console.log(`   - ${bp.displayName} (${bp.name})`);
    });
  });

  console.log('\n✅ Blueprint cleanup complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Run: npx tsx scripts/generate-graphql-from-blueprints.ts');
  console.log('   2. Restart CMS: npm run dev:cms-only');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
