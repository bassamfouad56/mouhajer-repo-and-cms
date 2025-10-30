import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: 'Home page not found' }, { status: 404 });
    }

    console.log(`✅ Found home page: ${homePage.titleEn} (ID: ${homePage.id})`);
    console.log(`📊 Page blocks in old schema: ${homePage.blocks.length}`);

    // Check current blueprint instances
    const currentInstances = await prisma.blueprintInstance.findMany({
      where: { pageId: homePage.id }
    });

    console.log(`📊 Current blueprint instances: ${currentInstances.length}`);

    if (homePage.blocks.length === 0) {
      return NextResponse.json({
        message: 'No blocks to migrate from page_blocks table',
        stats: {
          migrated: 0,
          skipped: 0,
          errors: 0,
          total: currentInstances.length
        }
      });
    }

    // Get all blueprints for mapping
    const blueprints = await prisma.contentBlueprint.findMany();
    const blueprintMap = new Map(blueprints.map(b => [b.name, b]));

    console.log('📋 Available blueprints:', blueprints.map(b => b.name).join(', '));

    // Migrate each block
    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

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
          const errorMsg = `Blueprint not found for type: ${block.type}`;
          console.warn(`⚠️  ${errorMsg}`);
          errors.push(errorMsg);
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
        const errorMsg = `Error migrating block ${block.type}: ${error}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
        errorCount++;
      }
    }

    // Verify final count
    const finalInstances = await prisma.blueprintInstance.findMany({
      where: { pageId: homePage.id },
      include: { blueprint: true },
      orderBy: { order: 'asc' }
    });

    console.log(`✅ Final blueprint instances count: ${finalInstances.length}`);

    return NextResponse.json({
      message: 'Migration completed',
      stats: {
        migrated: migratedCount,
        skipped: skippedCount,
        errors: errorCount,
        total: finalInstances.length
      },
      errors: errors.length > 0 ? errors : undefined,
      blocks: finalInstances.map((inst, idx) => ({
        index: idx + 1,
        name: inst.blueprint.displayName,
        order: inst.order,
        id: inst.id
      }))
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
