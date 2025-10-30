#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkHomePageBlocks() {
  try {
    // Find home page
    const homePage = await prisma.page.findFirst({
      where: {
        OR: [
          { slugEn: 'home' },
          { titleEn: 'Home' }
        ]
      }
    });

    if (!homePage) {
      console.log('❌ Home page not found');
      return;
    }

    console.log('✅ Home page found:', homePage.id, homePage.titleEn);

    // Count blocks
    const blockCount = await prisma.blueprintInstance.count({
      where: { pageId: homePage.id }
    });

    console.log('📊 Total blocks in home page:', blockCount);

    // Get all blocks
    const blocks = await prisma.blueprintInstance.findMany({
      where: { pageId: homePage.id },
      include: {
        blueprint: true
      },
      orderBy: { order: 'asc' }
    });

    console.log('\n📋 Blocks list:');
    blocks.forEach((block, idx) => {
      console.log(`${idx + 1}. ${block.blueprint?.displayName || block.blueprint?.name || 'Unknown'} (Order: ${block.order}, ID: ${block.id})`);
      console.log(`   Blueprint ID: ${block.blueprintId}`);
      console.log(`   Has dataEn: ${!!block.dataEn}`);
      console.log(`   Has dataAr: ${!!block.dataAr}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHomePageBlocks();
