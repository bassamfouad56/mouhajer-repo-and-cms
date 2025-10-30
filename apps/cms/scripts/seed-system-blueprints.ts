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

  // 11. Form (Dynamic Forms)
  await prisma.contentBlueprint.upsert({
    where: { name: 'Form' },
    update: {},
    create: {
      name: 'Form',
      displayName: 'Dynamic Form',
      description: 'Create custom forms with dynamic fields (contact, inquiry, registration, etc.)',
      blueprintType: 'DOCUMENT',
      allowMultiple: true,
      isSystem: false,
      icon: 'form-input',
      category: 'content',
      fields: [
        {
          id: 'formName',
          name: 'formName',
          label: { en: 'Form Name', ar: 'اسم النموذج' },
          type: 'text',
          bilingual: true,
          required: true,
          helpText: { en: 'Internal name for this form', ar: 'الاسم الداخلي لهذا النموذج' },
        },
        {
          id: 'formTitle',
          name: 'formTitle',
          label: { en: 'Form Title', ar: 'عنوان النموذج' },
          type: 'text',
          bilingual: true,
          required: true,
          helpText: { en: 'Displayed title on the form', ar: 'العنوان المعروض في النموذج' },
        },
        {
          id: 'formDescription',
          name: 'formDescription',
          label: { en: 'Form Description', ar: 'وصف النموذج' },
          type: 'textarea',
          bilingual: true,
          helpText: { en: 'Optional description shown above the form', ar: 'وصف اختياري يظهر فوق النموذج' },
        },
        {
          id: 'submitButtonText',
          name: 'submitButtonText',
          label: { en: 'Submit Button Text', ar: 'نص زر الإرسال' },
          type: 'text',
          bilingual: true,
          defaultValue: { en: 'Submit', ar: 'إرسال' },
        },
        {
          id: 'successMessage',
          name: 'successMessage',
          label: { en: 'Success Message', ar: 'رسالة النجاح' },
          type: 'textarea',
          bilingual: true,
          defaultValue: { en: 'Thank you! Your submission has been received.', ar: 'شكراً! تم استلام طلبك.' },
        },
        {
          id: 'fields',
          name: 'fields',
          label: { en: 'Form Fields', ar: 'حقول النموذج' },
          type: 'repeater',
          required: true,
          validation: { min: 1, max: 50 },
          helpText: { en: 'Add and configure form fields or field groups', ar: 'إضافة وتكوين حقول النموذج أو مجموعات الحقول' },
          fields: [
            {
              id: 'itemType',
              name: 'itemType',
              label: { en: 'Item Type', ar: 'نوع العنصر' },
              type: 'select',
              required: true,
              defaultValue: 'field',
              options: [
                { value: 'field', label: { en: 'Single Field', ar: 'حقل واحد' } },
                { value: 'group', label: { en: 'Field Group (Side by Side)', ar: 'مجموعة حقول (جنبًا إلى جنب)' } },
              ],
              helpText: { en: 'Choose "Field Group" to place multiple fields side by side', ar: 'اختر "مجموعة حقول" لوضع عدة حقول جنبًا إلى جنب' },
            },
            {
              id: 'fieldType',
              name: 'fieldType',
              label: { en: 'Field Type', ar: 'نوع الحقل' },
              type: 'select',
              required: true,
              options: [
                { value: 'text', label: { en: 'Text Input', ar: 'إدخال نص' } },
                { value: 'email', label: { en: 'Email', ar: 'بريد إلكتروني' } },
                { value: 'phone', label: { en: 'Phone Number', ar: 'رقم الهاتف' } },
                { value: 'textarea', label: { en: 'Text Area', ar: 'منطقة نص' } },
                { value: 'number', label: { en: 'Number', ar: 'رقم' } },
                { value: 'select', label: { en: 'Dropdown', ar: 'قائمة منسدلة' } },
                { value: 'radio', label: { en: 'Radio Buttons', ar: 'أزرار راديو' } },
                { value: 'checkbox', label: { en: 'Checkbox', ar: 'خانة اختيار' } },
                { value: 'checkboxGroup', label: { en: 'Checkbox Group', ar: 'مجموعة خانات اختيار' } },
                { value: 'date', label: { en: 'Date Picker', ar: 'منتقي التاريخ' } },
                { value: 'file', label: { en: 'File Upload', ar: 'رفع ملف' } },
              ],
              helpText: { en: 'Only applies when Item Type is "Single Field"', ar: 'ينطبق فقط عندما يكون نوع العنصر "حقل واحد"' },
            },
            {
              id: 'fieldLabel',
              name: 'fieldLabel',
              label: { en: 'Field Label', ar: 'تسمية الحقل' },
              type: 'text',
              bilingual: true,
              required: true,
            },
            {
              id: 'fieldName',
              name: 'fieldName',
              label: { en: 'Field Name (ID)', ar: 'اسم الحقل (المعرف)' },
              type: 'text',
              required: true,
              helpText: { en: 'Unique identifier (lowercase, no spaces)', ar: 'معرف فريد (أحرف صغيرة، بدون مسافات)' },
            },
            {
              id: 'placeholder',
              name: 'placeholder',
              label: { en: 'Placeholder Text', ar: 'نص العنصر النائب' },
              type: 'text',
              bilingual: true,
            },
            {
              id: 'helpText',
              name: 'helpText',
              label: { en: 'Help Text', ar: 'نص المساعدة' },
              type: 'text',
              bilingual: true,
            },
            {
              id: 'required',
              name: 'required',
              label: { en: 'Required Field', ar: 'حقل مطلوب' },
              type: 'boolean',
              defaultValue: false,
            },
            {
              id: 'validation',
              name: 'validation',
              label: { en: 'Validation Rules', ar: 'قواعد التحقق' },
              type: 'group',
              fields: [
                {
                  id: 'minLength',
                  name: 'minLength',
                  label: { en: 'Min Length', ar: 'الحد الأدنى للطول' },
                  type: 'number',
                },
                {
                  id: 'maxLength',
                  name: 'maxLength',
                  label: { en: 'Max Length', ar: 'الحد الأقصى للطول' },
                  type: 'number',
                },
                {
                  id: 'min',
                  name: 'min',
                  label: { en: 'Min Value', ar: 'القيمة الدنيا' },
                  type: 'number',
                },
                {
                  id: 'max',
                  name: 'max',
                  label: { en: 'Max Value', ar: 'القيمة القصوى' },
                  type: 'number',
                },
                {
                  id: 'pattern',
                  name: 'pattern',
                  label: { en: 'Regex Pattern', ar: 'نمط Regex' },
                  type: 'text',
                },
              ],
            },
            {
              id: 'options',
              name: 'options',
              label: { en: 'Options (for select/radio/checkbox)', ar: 'الخيارات (للقائمة/راديو/خانة)' },
              type: 'repeater',
              helpText: { en: 'Only for select, radio, and checkbox group fields', ar: 'فقط لحقول القائمة وراديو ومجموعة خانات الاختيار' },
              fields: [
                {
                  id: 'value',
                  name: 'value',
                  label: { en: 'Value', ar: 'القيمة' },
                  type: 'text',
                  required: true,
                },
                {
                  id: 'label',
                  name: 'label',
                  label: { en: 'Label', ar: 'التسمية' },
                  type: 'text',
                  bilingual: true,
                  required: true,
                },
              ],
            },
            {
              id: 'width',
              name: 'width',
              label: { en: 'Field Width', ar: 'عرض الحقل' },
              type: 'select',
              options: [
                { value: 'full', label: { en: 'Full Width', ar: 'عرض كامل' } },
                { value: 'half', label: { en: 'Half Width', ar: 'نصف العرض' } },
                { value: 'third', label: { en: 'One Third', ar: 'ثلث العرض' } },
              ],
              defaultValue: 'full',
              helpText: { en: 'Only applies when Item Type is "Single Field"', ar: 'ينطبق فقط عندما يكون نوع العنصر "حقل واحد"' },
            },
            {
              id: 'groupFields',
              name: 'groupFields',
              label: { en: 'Group Fields', ar: 'حقول المجموعة' },
              type: 'repeater',
              validation: { min: 2, max: 6 },
              helpText: { en: 'Only applies when Item Type is "Field Group". Add 2-6 fields to display side by side.', ar: 'ينطبق فقط عندما يكون نوع العنصر "مجموعة حقول". أضف 2-6 حقول للعرض جنبًا إلى جنب.' },
              fields: [
                {
                  id: 'fieldType',
                  name: 'fieldType',
                  label: { en: 'Field Type', ar: 'نوع الحقل' },
                  type: 'select',
                  required: true,
                  options: [
                    { value: 'text', label: { en: 'Text Input', ar: 'إدخال نص' } },
                    { value: 'email', label: { en: 'Email', ar: 'بريد إلكتروني' } },
                    { value: 'phone', label: { en: 'Phone Number', ar: 'رقم الهاتف' } },
                    { value: 'number', label: { en: 'Number', ar: 'رقم' } },
                    { value: 'select', label: { en: 'Dropdown', ar: 'قائمة منسدلة' } },
                    { value: 'date', label: { en: 'Date Picker', ar: 'منتقي التاريخ' } },
                  ],
                },
                {
                  id: 'fieldLabel',
                  name: 'fieldLabel',
                  label: { en: 'Field Label', ar: 'تسمية الحقل' },
                  type: 'text',
                  bilingual: true,
                  required: true,
                },
                {
                  id: 'fieldName',
                  name: 'fieldName',
                  label: { en: 'Field Name (ID)', ar: 'اسم الحقل (المعرف)' },
                  type: 'text',
                  required: true,
                  helpText: { en: 'Unique identifier (lowercase, no spaces)', ar: 'معرف فريد (أحرف صغيرة، بدون مسافات)' },
                },
                {
                  id: 'placeholder',
                  name: 'placeholder',
                  label: { en: 'Placeholder Text', ar: 'نص العنصر النائب' },
                  type: 'text',
                  bilingual: true,
                },
                {
                  id: 'required',
                  name: 'required',
                  label: { en: 'Required Field', ar: 'حقل مطلوب' },
                  type: 'boolean',
                  defaultValue: false,
                },
                {
                  id: 'validation',
                  name: 'validation',
                  label: { en: 'Validation Rules', ar: 'قواعد التحقق' },
                  type: 'group',
                  fields: [
                    {
                      id: 'minLength',
                      name: 'minLength',
                      label: { en: 'Min Length', ar: 'الحد الأدنى للطول' },
                      type: 'number',
                    },
                    {
                      id: 'maxLength',
                      name: 'maxLength',
                      label: { en: 'Max Length', ar: 'الحد الأقصى للطول' },
                      type: 'number',
                    },
                    {
                      id: 'min',
                      name: 'min',
                      label: { en: 'Min Value', ar: 'القيمة الدنيا' },
                      type: 'number',
                    },
                    {
                      id: 'max',
                      name: 'max',
                      label: { en: 'Max Value', ar: 'القيمة القصوى' },
                      type: 'number',
                    },
                  ],
                },
                {
                  id: 'options',
                  name: 'options',
                  label: { en: 'Options (for select)', ar: 'الخيارات (للقائمة)' },
                  type: 'repeater',
                  helpText: { en: 'Only for select fields', ar: 'فقط لحقول القائمة' },
                  fields: [
                    {
                      id: 'value',
                      name: 'value',
                      label: { en: 'Value', ar: 'القيمة' },
                      type: 'text',
                      required: true,
                    },
                    {
                      id: 'label',
                      name: 'label',
                      label: { en: 'Label', ar: 'التسمية' },
                      type: 'text',
                      bilingual: true,
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'notifications',
          name: 'notifications',
          label: { en: 'Email Notifications', ar: 'إشعارات البريد الإلكتروني' },
          type: 'group',
          fields: [
            {
              id: 'enabled',
              name: 'enabled',
              label: { en: 'Enable Email Notifications', ar: 'تفعيل إشعارات البريد الإلكتروني' },
              type: 'boolean',
              defaultValue: true,
            },
            {
              id: 'recipients',
              name: 'recipients',
              label: { en: 'Recipient Emails', ar: 'بريد المستلمين الإلكتروني' },
              type: 'text',
              helpText: { en: 'Comma-separated email addresses', ar: 'عناوين البريد الإلكتروني مفصولة بفواصل' },
            },
            {
              id: 'subject',
              name: 'subject',
              label: { en: 'Email Subject', ar: 'موضوع البريد الإلكتروني' },
              type: 'text',
              bilingual: true,
              defaultValue: { en: 'New Form Submission', ar: 'تقديم نموذج جديد' },
            },
          ],
        },
        {
          id: 'settings',
          name: 'settings',
          label: { en: 'Form Settings', ar: 'إعدادات النموذج' },
          type: 'group',
          fields: [
            {
              id: 'enableCaptcha',
              name: 'enableCaptcha',
              label: { en: 'Enable CAPTCHA', ar: 'تفعيل CAPTCHA' },
              type: 'boolean',
              defaultValue: false,
            },
            {
              id: 'redirectUrl',
              name: 'redirectUrl',
              label: { en: 'Redirect URL (after submission)', ar: 'رابط إعادة التوجيه (بعد الإرسال)' },
              type: 'text',
              helpText: { en: 'Optional: redirect to a custom page after successful submission', ar: 'اختياري: إعادة التوجيه إلى صفحة مخصصة بعد الإرسال الناجح' },
            },
            {
              id: 'allowMultipleSubmissions',
              name: 'allowMultipleSubmissions',
              label: { en: 'Allow Multiple Submissions', ar: 'السماح بتقديمات متعددة' },
              type: 'boolean',
              defaultValue: true,
            },
          ],
        },
        {
          id: 'crmIntegration',
          name: 'crmIntegration',
          label: { en: 'CRM Integration', ar: 'التكامل مع CRM' },
          type: 'group',
          fields: [
            {
              id: 'connectWithCRM',
              name: 'connectWithCRM',
              label: { en: 'Connect with CRM', ar: 'الاتصال بـ CRM' },
              type: 'boolean',
              defaultValue: false,
              helpText: { en: 'Automatically create leads in CRM when form is submitted', ar: 'إنشاء عملاء محتملين تلقائيًا في CRM عند إرسال النموذج' },
            },
            {
              id: 'leadSource',
              name: 'leadSource',
              label: { en: 'Lead Source', ar: 'مصدر العميل المحتمل' },
              type: 'text',
              defaultValue: 'website_form',
              helpText: { en: 'Source identifier for tracking (e.g., "website_form", "landing_page")', ar: 'معرف المصدر للتتبع (مثل "website_form", "landing_page")' },
            },
            {
              id: 'defaultStatus',
              name: 'defaultStatus',
              label: { en: 'Default Lead Status', ar: 'حالة العميل المحتمل الافتراضية' },
              type: 'select',
              defaultValue: 'new',
              options: [
                { value: 'new', label: { en: 'New', ar: 'جديد' } },
                { value: 'contacted', label: { en: 'Contacted', ar: 'تم الاتصال' } },
                { value: 'qualified', label: { en: 'Qualified', ar: 'مؤهل' } },
                { value: 'proposal', label: { en: 'Proposal', ar: 'عرض' } },
              ],
            },
            {
              id: 'autoQualify',
              name: 'autoQualify',
              label: { en: 'Auto-Qualify Leads', ar: 'تأهيل تلقائي للعملاء المحتملين' },
              type: 'boolean',
              defaultValue: false,
              helpText: { en: 'Automatically mark leads as qualified', ar: 'وضع علامة تلقائية على العملاء المحتملين كمؤهلين' },
            },
            {
              id: 'fieldMapping',
              name: 'fieldMapping',
              label: { en: 'Field Mapping', ar: 'تعيين الحقول' },
              type: 'group',
              helpText: { en: 'Map form fields to CRM lead fields. Enter the field name from your form.', ar: 'تعيين حقول النموذج إلى حقول العميل المحتمل في CRM. أدخل اسم الحقل من النموذج الخاص بك.' },
              fields: [
                {
                  id: 'nameField',
                  name: 'nameField',
                  label: { en: 'Name Field', ar: 'حقل الاسم' },
                  type: 'text',
                  helpText: { en: 'Form field name for lead name (e.g., "fullName", "name")', ar: 'اسم حقل النموذج لاسم العميل المحتمل' },
                },
                {
                  id: 'emailField',
                  name: 'emailField',
                  label: { en: 'Email Field', ar: 'حقل البريد الإلكتروني' },
                  type: 'text',
                  helpText: { en: 'Form field name for email (e.g., "email")', ar: 'اسم حقل النموذج للبريد الإلكتروني' },
                },
                {
                  id: 'phoneField',
                  name: 'phoneField',
                  label: { en: 'Phone Field', ar: 'حقل الهاتف' },
                  type: 'text',
                  helpText: { en: 'Form field name for phone (e.g., "phone", "phoneNumber")', ar: 'اسم حقل النموذج للهاتف' },
                },
                {
                  id: 'messageField',
                  name: 'messageField',
                  label: { en: 'Message Field', ar: 'حقل الرسالة' },
                  type: 'text',
                  helpText: { en: 'Form field name for message/notes (e.g., "message", "comments")', ar: 'اسم حقل النموذج للرسالة/الملاحظات' },
                },
                {
                  id: 'projectTypeField',
                  name: 'projectTypeField',
                  label: { en: 'Project Type Field', ar: 'حقل نوع المشروع' },
                  type: 'text',
                  helpText: { en: 'Form field name for project type (e.g., "projectType", "serviceType")', ar: 'اسم حقل النموذج لنوع المشروع' },
                },
                {
                  id: 'budgetField',
                  name: 'budgetField',
                  label: { en: 'Budget Field', ar: 'حقل الميزانية' },
                  type: 'text',
                  helpText: { en: 'Form field name for budget (e.g., "budget", "budgetRange")', ar: 'اسم حقل النموذج للميزانية' },
                },
                {
                  id: 'cityField',
                  name: 'cityField',
                  label: { en: 'City Field', ar: 'حقل المدينة' },
                  type: 'text',
                  helpText: { en: 'Form field name for city (e.g., "city", "location")', ar: 'اسم حقل النموذج للمدينة' },
                },
                {
                  id: 'timelineField',
                  name: 'timelineField',
                  label: { en: 'Timeline Field', ar: 'حقل الجدول الزمني' },
                  type: 'text',
                  helpText: { en: 'Form field name for timeline (e.g., "timeline", "startDate")', ar: 'اسم حقل النموذج للجدول الزمني' },
                },
              ],
            },
          ],
        },
      ],
    },
  });
  console.log('✅ Created Form blueprint');

  console.log('\n✨ System blueprints seeded successfully!');
  console.log(`\n📊 Total blueprints created: 11`);
  console.log(`   - System blueprints: 3 (Asset, Navigation, Footer)`);
  console.log(`   - Layout components: 1 (Hero Banner)`);
  console.log(`   - Media components: 2 (Image Gallery, Video Embed)`);
  console.log(`   - Content components: 5 (Rich Text, Testimonials, CTA, FAQ, Form)`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding blueprints:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
