/**
 * Create missing ContentBlueprints for additional block types
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const additionalBlueprints = [
  {
    name: 'company_description_home',
    displayName: 'Company Description',
    description: 'Company description with image carousel',
    category: 'content',
    icon: 'building',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
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
        required: false
      },
      {
        name: 'yearsOfExperience',
        displayName: 'Years of Experience',
        fieldType: 'text',
        defaultValue: '22'
      },
      {
        name: 'experienceLabel',
        displayName: 'Experience Label',
        fieldType: 'text',
        required: false
      },
      {
        name: 'imageCount',
        displayName: 'Number of Images',
        fieldType: 'number',
        defaultValue: 4
      },
      {
        name: 'showCta',
        displayName: 'Show CTA',
        fieldType: 'boolean',
        defaultValue: true
      },
      {
        name: 'ctaText',
        displayName: 'CTA Text',
        fieldType: 'text',
        required: false
      },
      {
        name: 'ctaLink',
        displayName: 'CTA Link',
        fieldType: 'text',
        required: false
      }
    ]
  },
  {
    name: 'services_showcase',
    displayName: 'Services Showcase',
    description: 'Display services in a swiper/carousel',
    category: 'content',
    icon: 'layers',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      },
      {
        name: 'services',
        displayName: 'Services',
        fieldType: 'json',
        required: true,
        description: 'Array of services with title, description, and image'
      }
    ]
  },
  {
    name: 'process_section',
    displayName: 'Process Section',
    description: 'Display work process steps',
    category: 'content',
    icon: 'activity',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      },
      {
        name: 'steps',
        displayName: 'Process Steps',
        fieldType: 'json',
        required: true,
        description: 'Array of process steps'
      },
      {
        name: 'mainImage',
        displayName: 'Main Image',
        fieldType: 'image',
        required: false
      },
      {
        name: 'smallImage',
        displayName: 'Small Image',
        fieldType: 'image',
        required: false
      }
    ]
  },
  {
    name: 'clients_section',
    displayName: 'Clients Section',
    description: 'Display client logos and testimonials',
    category: 'content',
    icon: 'users',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      },
      {
        name: 'clients',
        displayName: 'Clients',
        fieldType: 'gallery',
        required: false
      }
    ]
  },
  {
    name: 'instagram_section',
    displayName: 'Instagram Section',
    description: 'Display Instagram feed or social media content',
    category: 'content',
    icon: 'instagram',
    fields: [
      {
        name: 'title',
        displayName: 'Title',
        fieldType: 'text',
        required: false
      },
      {
        name: 'username',
        displayName: 'Instagram Username',
        fieldType: 'text',
        required: false
      },
      {
        name: 'media',
        displayName: 'Media Gallery',
        fieldType: 'gallery',
        required: false
      }
    ]
  }
];

async function createMissingBlueprints() {
  console.log('🚀 Creating missing ContentBlueprints...');

  try {
    for (const blueprint of additionalBlueprints) {
      // Check if blueprint already exists
      const existing = await prisma.contentBlueprint.findFirst({
        where: { name: blueprint.name }
      });

      if (!existing) {
        await prisma.contentBlueprint.create({
          data: {
            name: blueprint.name,
            displayName: blueprint.displayName,
            description: blueprint.description,
            blueprintType: 'COMPONENT',
            allowMultiple: true,
            isSystem: false,
            icon: blueprint.icon,
            category: blueprint.category,
            fields: blueprint.fields
          }
        });
        console.log(`✅ Created blueprint: ${blueprint.displayName}`);
      } else {
        console.log(`⏭️ Blueprint already exists: ${blueprint.displayName}`);
      }
    }

    console.log('✨ All blueprints created successfully!');
  } catch (error) {
    console.error('❌ Failed to create blueprints:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the creation
createMissingBlueprints();