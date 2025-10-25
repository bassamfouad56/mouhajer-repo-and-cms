#!/usr/bin/env tsx

/**
 * Script to delete all blueprint data from the database
 * Run with: npx tsx scripts/clean-blueprints.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanBlueprints() {
  console.log('🧹 Starting blueprint cleanup...\n');

  try {
    // Delete all BlueprintInstance records
    const instancesDeleted = await prisma.blueprintInstance.deleteMany();
    console.log(`✅ Deleted ${instancesDeleted.count} blueprint instances`);

    // Delete all ContentBlueprint records
    const blueprintsDeleted = await prisma.contentBlueprint.deleteMany();
    console.log(`✅ Deleted ${blueprintsDeleted.count} content blueprints`);

    // Also delete ContentSection if it exists (related to blueprints)
    try {
      const sectionsDeleted = await prisma.contentSection.deleteMany();
      console.log(`✅ Deleted ${sectionsDeleted.count} content sections`);
    } catch (error) {
      // ContentSection model might not exist, ignore
    }

    console.log('\n🎉 Blueprint cleanup completed successfully!');

    // Initialize default global components
    console.log('\n📦 Initializing default global components...\n');

    const defaultComponents = [
      {
        type: 'navbar',
        displayName: 'Navigation Bar',
        dataEn: {
          logo: '/logo.png',
          links: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Contact', href: '/contact' }
          ]
        },
        dataAr: {
          logo: '/logo.png',
          links: [
            { label: 'الرئيسية', href: '/' },
            { label: 'من نحن', href: '/about' },
            { label: 'خدماتنا', href: '/services' },
            { label: 'اتصل بنا', href: '/contact' }
          ]
        },
        enabled: true
      },
      {
        type: 'footer',
        displayName: 'Footer',
        dataEn: {
          copyright: '© 2024 Your Company. All rights reserved.',
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'instagram', url: 'https://instagram.com' }
          ],
          columns: [
            {
              title: 'Company',
              links: [
                { label: 'About Us', href: '/about' },
                { label: 'Team', href: '/team' },
                { label: 'Careers', href: '/careers' }
              ]
            },
            {
              title: 'Resources',
              links: [
                { label: 'Blog', href: '/blog' },
                { label: 'Documentation', href: '/docs' },
                { label: 'Support', href: '/support' }
              ]
            }
          ]
        },
        dataAr: {
          copyright: '© 2024 شركتك. جميع الحقوق محفوظة.',
          socialLinks: [
            { platform: 'facebook', url: 'https://facebook.com' },
            { platform: 'twitter', url: 'https://twitter.com' },
            { platform: 'instagram', url: 'https://instagram.com' }
          ],
          columns: [
            {
              title: 'الشركة',
              links: [
                { label: 'من نحن', href: '/about' },
                { label: 'الفريق', href: '/team' },
                { label: 'الوظائف', href: '/careers' }
              ]
            },
            {
              title: 'الموارد',
              links: [
                { label: 'المدونة', href: '/blog' },
                { label: 'الوثائق', href: '/docs' },
                { label: 'الدعم', href: '/support' }
              ]
            }
          ]
        },
        enabled: true
      }
    ];

    for (const component of defaultComponents) {
      try {
        // Check if component already exists
        const existing = await prisma.globalComponent.findUnique({
          where: { type: component.type }
        });

        if (!existing) {
          await prisma.globalComponent.create({
            data: component
          });
          console.log(`✅ Created ${component.displayName}`);
        } else {
          console.log(`⏩ ${component.displayName} already exists`);
        }
      } catch (error) {
        console.error(`❌ Failed to create ${component.displayName}:`, error);
      }
    }

    console.log('\n✨ Global components initialized!');

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanBlueprints().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});