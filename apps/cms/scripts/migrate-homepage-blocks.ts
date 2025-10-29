/**
 * Migration script to convert homepage blocks to BlueprintInstance system
 * This will make homepage blocks editable in the CMS
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Block type to ContentBlueprint mapping
const blockTypeMapping = {
  hero_banner: {
    name: 'hero_banner',
    displayName: 'Hero Banner',
    description: 'Main banner with background image/video and text overlay',
    category: 'layout',
    icon: 'image',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: true,
        description: 'Main heading text',
        helpText: 'Enter the main title for the hero section'
      },
      {
        name: 'subtitle',
        displayName: 'Subtitle',
        fieldType: 'text',
        required: false,
        description: 'Supporting text below the title'
      },
      {
        name: 'backgroundImage',
        displayName: 'Background Image',
        fieldType: 'image',
        required: false,
        description: 'Background image URL'
      },
      {
        name: 'backgroundVideo',
        displayName: 'Background Video',
        fieldType: 'video',
        required: false,
        description: 'Background video URL'
      },
      {
        name: 'ctaText',
        displayName: 'CTA Text',
        fieldType: 'text',
        required: false,
        description: 'Call to action button text'
      },
      {
        name: 'ctaLink',
        displayName: 'CTA Link',
        fieldType: 'text',
        required: false,
        description: 'Call to action button link'
      }
    ]
  },
  about_section: {
    name: 'about_section',
    displayName: 'About Section',
    description: 'Company information with gallery',
    category: 'content',
    icon: 'info',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: true,
        description: 'Section title'
      },
      {
        name: 'subtitle',
        displayName: 'Subtitle',
        fieldType: 'text',
        required: false,
        description: 'Section subtitle'
      },
      {
        name: 'description',
        displayName: 'Description',
        fieldType: 'richtext',
        required: true,
        description: 'Main content description'
      },
      {
        name: 'image',
        displayName: 'Main Image',
        fieldType: 'image',
        required: false,
        description: 'Primary image'
      },
      {
        name: 'gallery',
        displayName: 'Gallery',
        fieldType: 'gallery',
        required: false,
        description: 'Image gallery'
      },
      {
        name: 'yearsOfExperience',
        displayName: 'Years of Experience',
        fieldType: 'text',
        required: false,
        defaultValue: '22'
      },
      {
        name: 'experienceLabel',
        displayName: 'Experience Label',
        fieldType: 'text',
        required: false
      }
    ]
  },
  animated_headline: {
    name: 'animated_headline',
    displayName: 'Animated Headline',
    description: 'Scrolling animated text banner',
    category: 'content',
    icon: 'type',
    fields: [
      {
        name: 'text',
        displayName: 'Text',
        fieldType: 'text',
        required: true,
        description: 'Text to animate'
      }
    ]
  },
  text_content: {
    name: 'text_content',
    displayName: 'Text Content',
    description: 'Rich text content block',
    category: 'content',
    icon: 'file-text',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: true
      },
      {
        name: 'subtitle',
        displayName: 'Subtitle',
        fieldType: 'text',
        required: false
      },
      {
        name: 'description',
        displayName: 'Description',
        fieldType: 'richtext',
        required: true
      },
      {
        name: 'backgroundImage',
        displayName: 'Background Image',
        fieldType: 'image',
        required: false
      }
    ]
  },
  portfolio_display_home: {
    name: 'portfolio_display_home',
    displayName: 'Portfolio Display',
    description: 'Display portfolio projects',
    category: 'content',
    icon: 'grid',
    fields: [
      {
        name: 'headline',
        displayName: 'Headline',
        fieldType: 'text',
        required: false
      },
      {
        name: 'sectionTitle',
        displayName: 'Section Title',
        fieldType: 'text',
        required: false
      },
      {
        name: 'description',
        displayName: 'Description',
        fieldType: 'richtext',
        required: false
      },
      {
        name: 'projectCount',
        displayName: 'Project Count Text',
        fieldType: 'text',
        required: false
      },
      {
        name: 'showFeatured',
        displayName: 'Show Featured Only',
        fieldType: 'boolean',
        defaultValue: true
      },
      {
        name: 'maxItems',
        displayName: 'Max Items',
        fieldType: 'number',
        defaultValue: 6
      }
    ]
  },
  stats_section: {
    name: 'stats_section',
    displayName: 'Statistics Section',
    description: 'Display key statistics',
    category: 'content',
    icon: 'bar-chart',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      },
      {
        name: 'stats',
        displayName: 'Statistics',
        fieldType: 'json',
        required: true,
        description: 'Array of statistics with number and label'
      }
    ]
  },
  separator: {
    name: 'separator',
    displayName: 'Separator',
    description: 'Visual separator between sections',
    category: 'layout',
    icon: 'minus',
    fields: []
  },
  awards_section: {
    name: 'awards_section',
    displayName: 'Awards Section',
    description: 'Display awards and achievements',
    category: 'content',
    icon: 'award',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      }
    ]
  },
  featured_in: {
    name: 'featured_in',
    displayName: 'Featured In',
    description: 'Display media features and logos',
    category: 'content',
    icon: 'star',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      },
      {
        name: 'logos',
        displayName: 'Logos',
        fieldType: 'gallery',
        required: false
      }
    ]
  },
  blog_section: {
    name: 'blog_section',
    displayName: 'Blog Section',
    description: 'Display featured blog posts',
    category: 'content',
    icon: 'book-open',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      }
    ]
  },
  contact_form: {
    name: 'contact_form',
    displayName: 'Contact Form',
    description: 'Contact form with customizable fields',
    category: 'forms',
    icon: 'mail',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      },
      {
        name: 'description',
        displayName: 'Description',
        fieldType: 'richtext',
        required: false
      }
    ]
  }
};

async function migrateHomepageBlocks() {
  console.log('🚀 Starting homepage blocks migration...');

  try {
    // 1. Find the homepage
    const homepage = await prisma.page.findFirst({
      where: {
        OR: [
          { slugEn: 'home' },
          { titleEn: 'Home' }
        ]
      },
      include: {
        blocks: true
      }
    });

    if (!homepage) {
      console.log('❌ Homepage not found. Please seed the homepage first.');
      return;
    }

    console.log(`✅ Found homepage with ${homepage.blocks?.length || 0} blocks`);

    // 2. Create ContentBlueprints for each block type
    console.log('📦 Creating ContentBlueprints...');

    for (const [blockType, blueprintConfig] of Object.entries(blockTypeMapping)) {
      // Check if blueprint already exists
      const existingBlueprint = await prisma.contentBlueprint.findFirst({
        where: { name: blueprintConfig.name }
      });

      if (!existingBlueprint) {
        await prisma.contentBlueprint.create({
          data: {
            name: blueprintConfig.name,
            displayName: blueprintConfig.displayName,
            description: blueprintConfig.description,
            blueprintType: 'COMPONENT',
            allowMultiple: true,
            isSystem: false,
            icon: blueprintConfig.icon,
            category: blueprintConfig.category,
            fields: blueprintConfig.fields
          }
        });
        console.log(`  ✅ Created blueprint: ${blueprintConfig.displayName}`);
      } else {
        console.log(`  ⏭️  Blueprint already exists: ${blueprintConfig.displayName}`);
      }
    }

    // 3. Convert existing blocks to BlueprintInstances
    if (homepage.blocks && homepage.blocks.length > 0) {
      console.log('🔄 Converting blocks to BlueprintInstances...');

      // Delete any existing BlueprintInstances for this page
      await prisma.blueprintInstance.deleteMany({
        where: { pageId: homepage.id }
      });

      for (const block of homepage.blocks) {
        const blockData = block as any;
        const blueprint = await prisma.contentBlueprint.findFirst({
          where: { name: blockData.type }
        });

        if (blueprint) {
          // Extract bilingual data from the block
          const dataEn: Record<string, any> = {};
          const dataAr: Record<string, any> = {};

          // Parse the block data
          const data = blockData.data || {};

          for (const [key, value] of Object.entries(data)) {
            // Handle fields ending with En or Ar
            if (key.endsWith('En')) {
              const fieldName = key.slice(0, -2);
              dataEn[fieldName] = value;
            } else if (key.endsWith('Ar')) {
              const fieldName = key.slice(0, -2);
              dataAr[fieldName] = value;
            } else if (typeof value === 'object' && value !== null && 'en' in value) {
              // Handle objects with en/ar keys
              dataEn[key] = (value as any).en;
              dataAr[key] = (value as any).ar;
            } else {
              // Copy non-bilingual fields to both
              dataEn[key] = value;
              dataAr[key] = value;
            }
          }

          // Create BlueprintInstance
          await prisma.blueprintInstance.create({
            data: {
              blueprintId: blueprint.id,
              pageId: homepage.id,
              dataEn,
              dataAr,
              order: blockData.order || 0,
              status: 'published'
            }
          });

          console.log(`  ✅ Migrated block: ${blockData.type} (order: ${blockData.order})`);
        } else {
          console.log(`  ⚠️  No blueprint found for block type: ${blockData.type}`);
        }
      }
    }

    console.log('✨ Migration completed successfully!');
    console.log('📝 You can now edit the homepage blocks in the CMS at /pages');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateHomepageBlocks();