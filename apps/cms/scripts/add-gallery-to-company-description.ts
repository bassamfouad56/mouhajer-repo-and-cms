#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addGalleryField() {
  console.log('🔄 Adding gallery field to company_description_home blueprint...');

  const blueprint = await prisma.contentBlueprint.findFirst({
    where: { name: 'company_description_home' }
  });

  if (!blueprint) {
    console.error('❌ Blueprint not found: company_description_home');
    process.exit(1);
  }

  // Parse current fields
  const fields = typeof blueprint.fields === 'string'
    ? JSON.parse(blueprint.fields)
    : blueprint.fields;

  // Check if gallery field already exists
  const hasGallery = fields.some((f: any) => f.name === 'gallery');

  if (hasGallery) {
    console.log('✅ Gallery field already exists in blueprint');
    return;
  }

  // Find the imageCount field index
  const imageCountIndex = fields.findIndex((f: any) => f.name === 'imageCount');

  // Add gallery field before imageCount
  const newGalleryField = {
    name: 'gallery',
    label: 'Select Images',
    type: 'gallery',
    required: false,
    helpText: 'Select specific images to display. If empty, random images will be shown based on Image Count below.'
  };

  if (imageCountIndex !== -1) {
    fields.splice(imageCountIndex, 0, newGalleryField);
  } else {
    // If imageCount not found, add at the end
    fields.push(newGalleryField);
  }

  // Update the helpText for imageCount
  const imageCountField = fields.find((f: any) => f.name === 'imageCount');
  if (imageCountField) {
    imageCountField.label = 'Number of Random Images (if no images selected)';
    imageCountField.helpText = 'Used only when no images are selected in the gallery above';
  }

  // Update blueprint in database
  await prisma.contentBlueprint.update({
    where: { id: blueprint.id },
    data: {
      fields: fields as any,
      updatedAt: new Date()
    }
  });

  console.log('✅ Successfully added gallery field to company_description_home blueprint');
  console.log('📋 Total fields:', fields.length);
}

async function main() {
  try {
    await addGalleryField();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
