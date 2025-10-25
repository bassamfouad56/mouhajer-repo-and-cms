import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding system blueprints...\n');

  // ========================================
  // SYSTEM BLUEPRINTS (Cannot be deleted)
  // ========================================

  // 1. Asset (Media files)
  await prisma.contentBlueprint.upsert({
    where: { name: 'Asset' },
    update: {},
    create: {
      name: 'Asset',
      displayName: 'Media Asset',
      description: 'System blueprint for media files (images, videos, documents)',
      blueprintType: 'COMPONENT',
      allowMultiple: true,
      isSystem: true,
      icon: 'file',
      category: 'media',
      fields: [
        {
          id: 'file',
          name: 'file',
          label: { en: 'File', ar: 'ملف' },
          type: 'file',
          required: true,
        },
        {
          id: 'alt',
          name: 'alt',
          label: { en: 'Alt Text', ar: 'نص بديل' },
          type: 'text',
          bilingual: true,
          helpText: { en: 'Describe the image for accessibility', ar: 'وصف الصورة لإمكانية الوصول' },
        },
        {
          id: 'caption',
          name: 'caption',
          label: { en: 'Caption', ar: 'تعليق' },
          type: 'textarea',
          bilingual: true,
        },
      ],
    },
  });
  console.log('✅ Created Asset blueprint');

  // 2. Navigation (Site navigation)
  await prisma.contentBlueprint.upsert({
    where: { name: 'Navigation' },
    update: {},
    create: {
      name: 'Navigation',
      displayName: 'Site Navigation',
      description: 'System blueprint for site navigation menu',
      blueprintType: 'DOCUMENT',
      allowMultiple: false, // Only one navigation
      isSystem: true,
      icon: 'menu',
      category: 'layout',
      fields: [
        {
          id: 'items',
          name: 'items',
          label: { en: 'Navigation Items', ar: 'عناصر التنقل' },
          type: 'repeater',
          fields: [
            {
              id: 'label',
              name: 'label',
              label: { en: 'Label', ar: 'التسمية' },
              type: 'text',
              bilingual: true,
              required: true,
            },
            {
              id: 'url',
              name: 'url',
              label: { en: 'URL', ar: 'الرابط' },
              type: 'text',
              required: true,
            },
            {
              id: 'icon',
              name: 'icon',
              label: { en: 'Icon', ar: 'أيقونة' },
              type: 'text',
              helpText: { en: 'Lucide icon name', ar: 'اسم أيقونة Lucide' },
            },
            {
              id: 'openInNewTab',
              name: 'openInNewTab',
              label: { en: 'Open in New Tab', ar: 'فتح في علامة تبويب جديدة' },
              type: 'boolean',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  });
  console.log('✅ Created Navigation blueprint');

  // 3. Footer (Site footer)
  await prisma.contentBlueprint.upsert({
    where: { name: 'Footer' },
    update: {},
    create: {
      name: 'Footer',
      displayName: 'Site Footer',
      description: 'System blueprint for site footer',
      blueprintType: 'DOCUMENT',
      allowMultiple: false,
      isSystem: true,
      icon: 'layout-footer',
      category: 'layout',
      fields: [
        {
          id: 'columns',
          name: 'columns',
          label: { en: 'Footer Columns', ar: 'أعمدة التذييل' },
          type: 'repeater',
          fields: [
            {
              id: 'title',
              name: 'title',
              label: { en: 'Column Title', ar: 'عنوان العمود' },
              type: 'text',
              bilingual: true,
            },
            {
              id: 'links',
              name: 'links',
              label: { en: 'Links', ar: 'روابط' },
              type: 'repeater',
              fields: [
                {
                  id: 'label',
                  name: 'label',
                  label: { en: 'Label', ar: 'التسمية' },
                  type: 'text',
                  bilingual: true,
                },
                {
                  id: 'url',
                  name: 'url',
                  label: { en: 'URL', ar: 'الرابط' },
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          id: 'copyright',
          name: 'copyright',
          label: { en: 'Copyright Text', ar: 'نص حقوق النشر' },
          type: 'text',
          bilingual: true,
        },
        {
          id: 'socialLinks',
          name: 'socialLinks',
          label: { en: 'Social Media Links', ar: 'روابط وسائل التواصل الاجتماعي' },
          type: 'group',
          fields: [
            { id: 'facebook', name: 'facebook', label: { en: 'Facebook', ar: 'فيسبوك' }, type: 'text' },
            { id: 'instagram', name: 'instagram', label: { en: 'Instagram', ar: 'إنستغرام' }, type: 'text' },
            { id: 'twitter', name: 'twitter', label: { en: 'Twitter', ar: 'تويتر' }, type: 'text' },
            { id: 'linkedin', name: 'linkedin', label: { en: 'LinkedIn', ar: 'لينكد إن' }, type: 'text' },
            { id: 'youtube', name: 'youtube', label: { en: 'YouTube', ar: 'يوتيوب' }, type: 'text' },
          ],
        },
      ],
    },
  });
  console.log('✅ Created Footer blueprint');

  // ========================================
  // COMPONENT BLUEPRINTS (Layout)
  // ========================================

  // 4. Hero Banner
  await prisma.contentBlueprint.upsert({
    where: { name: 'HeroBanner' },
    update: {},
    create: {
      name: 'HeroBanner',
      displayName: 'Hero Banner',
      description: 'Large banner section with heading, subheading, image, and CTA',
      blueprintType: 'COMPONENT',
      allowMultiple: true,
      isSystem: false,
      icon: 'image-plus',
      category: 'layout',
      fields: [
        {
          id: 'heading',
          name: 'heading',
          label: { en: 'Heading', ar: 'العنوان' },
          type: 'text',
          bilingual: true,
          required: true,
          validation: { maxLength: 60 },
          helpText: { en: 'Main heading (max 60 characters)', ar: 'العنوان الرئيسي (الحد الأقصى 60 حرفًا)' },
        },
        {
          id: 'subheading',
          name: 'subheading',
          label: { en: 'Subheading', ar: 'العنوان الفرعي' },
          type: 'textarea',
          bilingual: true,
          validation: { maxLength: 200 },
        },
        {
          id: 'backgroundImage',
          name: 'backgroundImage',
          label: { en: 'Background Image', ar: 'صورة الخلفية' },
          type: 'reference',
          referenceType: 'Asset',
          required: true,
        },
        {
          id: 'ctaButton',
          name: 'ctaButton',
          label: { en: 'Call to Action Button', ar: 'زر الدعوة للعمل' },
          type: 'group',
          fields: [
            {
              id: 'text',
              name: 'text',
              label: { en: 'Button Text', ar: 'نص الزر' },
              type: 'text',
              bilingual: true,
            },
            {
              id: 'link',
              name: 'link',
              label: { en: 'Link', ar: 'الرابط' },
              type: 'text',
            },
            {
              id: 'style',
              name: 'style',
              label: { en: 'Style', ar: 'النمط' },
              type: 'select',
              options: [
                { value: 'primary', label: { en: 'Primary', ar: 'أساسي' } },
                { value: 'secondary', label: { en: 'Secondary', ar: 'ثانوي' } },
                { value: 'outline', label: { en: 'Outline', ar: 'محدد' } },
              ],
              defaultValue: 'primary',
            },
          ],
        },
        {
          id: 'alignment',
          name: 'alignment',
          label: { en: 'Text Alignment', ar: 'محاذاة النص' },
          type: 'radio',
          options: [
            { value: 'left', label: { en: 'Left', ar: 'يسار' } },
            { value: 'center', label: { en: 'Center', ar: 'وسط' } },
            { value: 'right', label: { en: 'Right', ar: 'يمين' } },
          ],
          defaultValue: 'center',
        },
      ],
    },
  });
  console.log('✅ Created Hero Banner blueprint');

  // 5. Image Gallery
  await prisma.contentBlueprint.upsert({
    where: { name: 'ImageGallery' },
    update: {},
    create: {
      name: 'ImageGallery',
      displayName: 'Image Gallery',
      description: 'Responsive image gallery with multiple layout options',
      blueprintType: 'COMPONENT',
      allowMultiple: true,
      isSystem: false,
      icon: 'gallery-horizontal',
      category: 'media',
      fields: [
        {
          id: 'title',
          name: 'title',
          label: { en: 'Gallery Title', ar: 'عنوان المعرض' },
          type: 'text',
          bilingual: true,
        },
        {
          id: 'images',
          name: 'images',
          label: { en: 'Images', ar: 'الصور' },
          type: 'gallery',
          required: true,
          validation: { min: 1, max: 50 },
        },
        {
          id: 'layout',
          name: 'layout',
          label: { en: 'Layout', ar: 'التخطيط' },
          type: 'select',
          options: [
            { value: 'grid', label: { en: 'Grid', ar: 'شبكة' } },
            { value: 'masonry', label: { en: 'Masonry', ar: 'بناء' } },
            { value: 'carousel', label: { en: 'Carousel', ar: 'دوار' } },
          ],
          defaultValue: 'grid',
        },
        {
          id: 'columns',
          name: 'columns',
          label: { en: 'Columns', ar: 'الأعمدة' },
          type: 'number',
          validation: { min: 1, max: 6 },
          defaultValue: 3,
          helpText: { en: 'Number of columns (1-6)', ar: 'عدد الأعمدة (1-6)' },
        },
      ],
    },
  });
  console.log('✅ Created Image Gallery blueprint');

  // ========================================
  // COMPONENT BLUEPRINTS (Content)
  // ========================================

  // 6. Rich Text Block
  await prisma.contentBlueprint.upsert({
    where: { name: 'RichText' },
    update: {},
    create: {
      name: 'RichText',
      displayName: 'Rich Text',
      description: 'WYSIWYG text editor with formatting options',
      blueprintType: 'COMPONENT',
      allowMultiple: true,
      isSystem: false,
      icon: 'file-text',
      category: 'content',
      fields: [
        {
          id: 'content',
          name: 'content',
          label: { en: 'Content', ar: 'المحتوى' },
          type: 'rich_text',
          bilingual: true,
          required: true,
        },
        {
          id: 'alignment',
          name: 'alignment',
          label: { en: 'Text Alignment', ar: 'محاذاة النص' },
          type: 'radio',
          options: [
            { value: 'left', label: { en: 'Left', ar: 'يسار' } },
            { value: 'center', label: { en: 'Center', ar: 'وسط' } },
            { value: 'right', label: { en: 'Right', ar: 'يمين' } },
            { value: 'justify', label: { en: 'Justify', ar: 'ضبط' } },
          ],
          defaultValue: 'left',
        },
      ],
    },
  });
  console.log('✅ Created Rich Text blueprint');

  // 7. Testimonials
  await prisma.contentBlueprint.upsert({
    where: { name: 'Testimonials' },
    update: {},
    create: {
      name: 'Testimonials',
      displayName: 'Testimonials',
      description: 'Customer testimonials slider',
      blueprintType: 'COMPONENT',
      allowMultiple: true,
      isSystem: false,
      icon: 'quote',
      category: 'content',
      fields: [
        {
          id: 'title',
          name: 'title',
          label: { en: 'Section Title', ar: 'عنوان القسم' },
          type: 'text',
          bilingual: true,
        },
        {
          id: 'items',
          name: 'items',
          label: { en: 'Testimonials', ar: 'الشهادات' },
          type: 'repeater',
          validation: { min: 1, max: 20 },
          fields: [
            {
              id: 'name',
              name: 'name',
              label: { en: 'Name', ar: 'الاسم' },
              type: 'text',
              required: true,
            },
            {
              id: 'role',
              name: 'role',
              label: { en: 'Role/Company', ar: 'الدور/الشركة' },
              type: 'text',
              bilingual: true,
            },
            {
              id: 'comment',
              name: 'comment',
              label: { en: 'Testimonial', ar: 'الشهادة' },
              type: 'textarea',
              bilingual: true,
              required: true,
            },
            {
              id: 'rating',
              name: 'rating',
              label: { en: 'Rating', ar: 'التقييم' },
              type: 'number',
              validation: { min: 1, max: 5 },
              defaultValue: 5,
            },
            {
              id: 'image',
              name: 'image',
              label: { en: 'Photo', ar: 'الصورة' },
              type: 'reference',
              referenceType: 'Asset',
            },
          ],
        },
      ],
    },
  });
  console.log('✅ Created Testimonials blueprint');

  // 8. CTA Section
  await prisma.contentBlueprint.upsert({
    where: { name: 'CTASection' },
    update: {},
    create: {
      name: 'CTASection',
      displayName: 'Call to Action Section',
      description: 'Prominent CTA section with heading, description, and button',
      blueprintType: 'COMPONENT',
      allowMultiple: true,
      isSystem: false,
      icon: 'hand-pointing',
      category: 'content',
      fields: [
        {
          id: 'heading',
          name: 'heading',
          label: { en: 'Heading', ar: 'العنوان' },
          type: 'text',
          bilingual: true,
          required: true,
        },
        {
          id: 'description',
          name: 'description',
          label: { en: 'Description', ar: 'الوصف' },
          type: 'textarea',
          bilingual: true,
        },
        {
          id: 'primaryButton',
          name: 'primaryButton',
          label: { en: 'Primary Button', ar: 'الزر الأساسي' },
          type: 'group',
          fields: [
            {
              id: 'text',
              name: 'text',
              label: { en: 'Button Text', ar: 'نص الزر' },
              type: 'text',
              bilingual: true,
              required: true,
            },
            {
              id: 'link',
              name: 'link',
              label: { en: 'Link', ar: 'الرابط' },
              type: 'text',
              required: true,
            },
          ],
        },
        {
          id: 'secondaryButton',
          name: 'secondaryButton',
          label: { en: 'Secondary Button (Optional)', ar: 'الزر الثانوي (اختياري)' },
          type: 'group',
          fields: [
            {
              id: 'text',
              name: 'text',
              label: { en: 'Button Text', ar: 'نص الزر' },
              type: 'text',
              bilingual: true,
            },
            {
              id: 'link',
              name: 'link',
              label: { en: 'Link', ar: 'الرابط' },
              type: 'text',
            },
          ],
        },
        {
          id: 'backgroundColor',
          name: 'backgroundColor',
          label: { en: 'Background Color', ar: 'لون الخلفية' },
          type: 'select',
          options: [
            { value: 'primary', label: { en: 'Primary', ar: 'أساسي' } },
            { value: 'secondary', label: { en: 'Secondary', ar: 'ثانوي' } },
            { value: 'accent', label: { en: 'Accent', ar: 'تمييز' } },
            { value: 'transparent', label: { en: 'Transparent', ar: 'شفاف' } },
          ],
          defaultValue: 'primary',
        },
      ],
    },
  });
  console.log('✅ Created CTA Section blueprint');

  // 9. Video Embed
  await prisma.contentBlueprint.upsert({
    where: { name: 'VideoEmbed' },
    update: {},
    create: {
      name: 'VideoEmbed',
      displayName: 'Video Embed',
      description: 'Embed videos from YouTube, Vimeo, or other platforms',
      blueprintType: 'COMPONENT',
      allowMultiple: true,
      isSystem: false,
      icon: 'video',
      category: 'media',
      fields: [
        {
          id: 'title',
          name: 'title',
          label: { en: 'Video Title', ar: 'عنوان الفيديو' },
          type: 'text',
          bilingual: true,
        },
        {
          id: 'videoUrl',
          name: 'videoUrl',
          label: { en: 'Video URL', ar: 'رابط الفيديو' },
          type: 'text',
          required: true,
          helpText: { en: 'YouTube, Vimeo, or direct video URL', ar: 'YouTube أو Vimeo أو رابط فيديو مباشر' },
        },
        {
          id: 'thumbnail',
          name: 'thumbnail',
          label: { en: 'Custom Thumbnail', ar: 'صورة مصغرة مخصصة' },
          type: 'reference',
          referenceType: 'Asset',
          helpText: { en: 'Optional custom thumbnail (defaults to video platform thumbnail)', ar: 'صورة مصغرة مخصصة اختيارية' },
        },
        {
          id: 'aspectRatio',
          name: 'aspectRatio',
          label: { en: 'Aspect Ratio', ar: 'نسبة العرض إلى الارتفاع' },
          type: 'select',
          options: [
            { value: '16:9', label: { en: '16:9 (Widescreen)', ar: '16:9 (عريض)' } },
            { value: '4:3', label: { en: '4:3 (Standard)', ar: '4:3 (قياسي)' } },
            { value: '1:1', label: { en: '1:1 (Square)', ar: '1:1 (مربع)' } },
          ],
          defaultValue: '16:9',
        },
      ],
    },
  });
  console.log('✅ Created Video Embed blueprint');

  // 10. FAQ Section
  await prisma.contentBlueprint.upsert({
    where: { name: 'FAQSection' },
    update: {},
    create: {
      name: 'FAQSection',
      displayName: 'FAQ Section',
      description: 'Frequently Asked Questions accordion',
      blueprintType: 'COMPONENT',
      allowMultiple: true,
      isSystem: false,
      icon: 'help-circle',
      category: 'content',
      fields: [
        {
          id: 'title',
          name: 'title',
          label: { en: 'Section Title', ar: 'عنوان القسم' },
          type: 'text',
          bilingual: true,
        },
        {
          id: 'items',
          name: 'items',
          label: { en: 'FAQ Items', ar: 'عناصر الأسئلة الشائعة' },
          type: 'repeater',
          validation: { min: 1, max: 30 },
          fields: [
            {
              id: 'question',
              name: 'question',
              label: { en: 'Question', ar: 'السؤال' },
              type: 'text',
              bilingual: true,
              required: true,
            },
            {
              id: 'answer',
              name: 'answer',
              label: { en: 'Answer', ar: 'الجواب' },
              type: 'rich_text',
              bilingual: true,
              required: true,
            },
          ],
        },
      ],
    },
  });
  console.log('✅ Created FAQ Section blueprint');

  console.log('\n✨ System blueprints seeded successfully!');
  console.log(`\n📊 Total blueprints created: 10`);
  console.log(`   - System blueprints: 3 (Asset, Navigation, Footer)`);
  console.log(`   - Layout components: 1 (Hero Banner)`);
  console.log(`   - Media components: 2 (Image Gallery, Video Embed)`);
  console.log(`   - Content components: 4 (Rich Text, Testimonials, CTA, FAQ)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding blueprints:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
