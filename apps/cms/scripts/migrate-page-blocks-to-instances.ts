#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migratePageBlocksToInstances() {
  try {
    console.log('🔄 Starting migration from page_blocks to blueprint_instances...\n');

    // Find the home page
    const homePage = await prisma.page.findFirst({
      where: {
        OR: [
          { slugEn: 'home' },
          { titleEn: 'Home' }
        ]
      },
      include: {
        blocks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!homePage) {
      console.error('❌ Home page not found');
      process.exit(1);
    }

    console.log(`✅ Found home page: ${homePage.titleEn} (ID: ${homePage.id})`);
    console.log(`📊 Page blocks in old schema: ${homePage.blocks.length}\n`);

    // Check current blueprint instances
    const currentInstances = await prisma.blueprintInstance.findMany({
      where: { pageId: homePage.id }
    });

    console.log(`📊 Current blueprint instances: ${currentInstances.length}\n`);

    if (homePage.blocks.length === 0) {
      console.log('✅ No blocks to migrate from page_blocks table');
      return;
    }

    // Get all blueprints for mapping
    const blueprints = await prisma.contentBlueprint.findMany();
    const blueprintMap = new Map(blueprints.map(b => [b.name, b]));

    console.log('📋 Available blueprints:');
    blueprints.forEach(b => {
      console.log(`  - ${b.name} (${b.displayName})`);
    });
    console.log('');

    // Migrate each block
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const block of homePage.blocks) {
      try {
        // Check if this block already exists as a blueprint instance
        const existingInstance = currentInstances.find(
          inst => inst.order === block.order
        );

        if (existingInstance) {
          console.log(`⏭️  Skipping block ${block.type} (order ${block.order}) - already exists`);
          skippedCount++;
          continue;
        }

        // Find the corresponding blueprint
        const blueprint = blueprintMap.get(block.type);

        if (!blueprint) {
          console.warn(`⚠️  Blueprint not found for type: ${block.type}`);
          errorCount++;
          continue;
        }

        // Extract data - the block.data is a JSON object that may have bilingual fields
        const blockData = block.data as any;

        // Create blueprint instance with proper data structure
        const instance = await prisma.blueprintInstance.create({
          data: {
            blueprintId: blueprint.id,
            pageId: homePage.id,
            order: block.order,
            status: 'published',
            // For now, copy the same data to both locales
            // In the future, you may want to split bilingual fields
            dataEn: blockData,
            dataAr: blockData
          }
        });

        console.log(`✅ Migrated: ${block.type} (order ${block.order}) → Blueprint Instance ${instance.id}`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Error migrating block ${block.type}:`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log(`  ✅ Migrated: ${migratedCount}`);
    console.log(`  ⏭️  Skipped: ${skippedCount}`);
    console.log(`  ❌ Errors: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    // Verify final count
    const finalInstances = await prisma.blueprintInstance.findMany({
      where: { pageId: homePage.id },
      include: { blueprint: true },
      orderBy: { order: 'asc' }
    });

    console.log(`✅ Final blueprint instances count: ${finalInstances.length}\n`);
    console.log('📋 Final blocks list:');
    finalInstances.forEach((inst, idx) => {
      console.log(`  ${idx + 1}. ${inst.blueprint.displayName} (order: ${inst.order})`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

migratePageBlocksToInstances();
