require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '..', '.env') });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Define pages to create in CMS for each static route
const staticRoutePages = [
  {
    titleEn: 'Services',
    titleAr: 'خدماتنا',
    slugEn: 'services',
    slugAr: 'services',
    descriptionEn: 'Discover our comprehensive range of luxury interior design services',
    descriptionAr: 'اكتشف مجموعتنا الشاملة من خدمات التصميم الداخلي الفاخر',
    seoMetaTitleEn: 'Interior Design Services Dubai | Mouhajer International Design',
    seoMetaTitleAr: 'خدمات التصميم الداخلي دبي | مهاجر الدولية للتصميم',
    status: 'published',
    blocks: [
      {
        type: 'about_banner',
        order: 1,
        data: { hideScroll: true }
      },
      {
        type: 'services_list',
        order: 2,
        data: { hideTitle: false }
      }
    ]
  },
  {
    titleEn: 'Contact Us',
    titleAr: 'اتصل بنا',
    slugEn: 'contact-us',
    slugAr: 'contact-us',
    descriptionEn: 'Get in touch with our team for luxury interior design consultations',
    descriptionAr: 'تواصل مع فريقنا للحصول على استشارات التصميم الداخلي الفاخر',
    seoMetaTitleEn: 'Contact Us | Mouhajer International Design Dubai',
    seoMetaTitleAr: 'اتصل بنا | مهاجر الدولية للتصميم دبي',
    status: 'published',
    blocks: [
      {
        type: 'breadcrumbs',
        order: 1,
        data: {}
      },
      {
        type: 'project_intro',
        order: 2,
        data: {
          titleEn: 'Contact',
          titleAr: 'اتصل بنا',
          animatedTitleEn: 'CONTACT US',
          animatedTitleAr: 'اتصل بنا',
          images: [
            '/images/2024/03/333333.jpg',
            '/images/2024/03/333333.jpg',
            '/images/2024/03/333333.jpg'
          ]
        }
      },
      {
        type: 'contact_form',
        order: 3,
        data: {}
      }
    ]
  },
  {
    titleEn: 'Our Projects',
    titleAr: 'مشاريعنا',
    slugEn: 'our-projects',
    slugAr: 'our-projects',
    descriptionEn: 'Explore our portfolio of luxury interior design projects',
    descriptionAr: 'استكشف محفظة مشاريعنا للتصميم الداخلي الفاخر',
    seoMetaTitleEn: 'Interior Design Projects Dubai | Portfolio | Mouhajer',
    seoMetaTitleAr: 'مشاريع التصميم الداخلي دبي | الأعمال | مهاجر',
    status: 'published',
    blocks: [
      {
        type: 'portfolio_section',
        order: 1,
        data: {
          titleEn: 'Our Portfolio',
          titleAr: 'أعمالنا'
        }
      }
    ]
  },
  {
    titleEn: 'Blogs',
    titleAr: 'المدونة',
    slugEn: 'blogs',
    slugAr: 'blogs',
    descriptionEn: 'Interior design insights, trends, and inspiration',
    descriptionAr: 'رؤى واتجاهات وإلهام التصميم الداخلي',
    seoMetaTitleEn: 'Interior Design Blog | Tips & Trends | Mouhajer',
    seoMetaTitleAr: 'مدونة التصميم الداخلي | نصائح واتجاهات | مهاجر',
    status: 'published',
    blocks: [
      {
        type: 'blog_list',
        order: 1,
        data: {}
      }
    ]
  },
  {
    titleEn: 'About Us',
    titleAr: 'من نحن',
    slugEn: 'who-we-are',
    slugAr: 'who-we-are',
    descriptionEn: 'Learn about Mouhajer International Design\'s journey and philosophy',
    descriptionAr: 'تعرف على رحلة وفلسفة مهاجر الدولية للتصميم',
    seoMetaTitleEn: 'About Us | Mouhajer International Design Dubai',
    seoMetaTitleAr: 'من نحن | مهاجر الدولية للتصميم دبي',
    status: 'published',
    blocks: [
      {
        type: 'about_banner',
        order: 1,
        data: {}
      },
      {
        type: 'about_section',
        order: 2,
        data: {
          titleEn: 'Our Story',
          titleAr: 'قصتنا',
          descriptionEn: 'Founded with a vision to transform spaces into extraordinary experiences...',
          descriptionAr: 'تأسست برؤية لتحويل المساحات إلى تجارب استثنائية...'
        }
      },
      {
        type: 'text_columns',
        order: 3,
        data: {
          columns: [
            {
              titleEn: 'Mission',
              titleAr: 'المهمة',
              contentEn: 'To create exceptional interior spaces that reflect our clients\' unique vision while maintaining the highest standards of design excellence.',
              contentAr: 'إنشاء مساحات داخلية استثنائية تعكس رؤية عملائنا الفريدة مع الحفاظ على أعلى معايير التميز في التصميم.'
            },
            {
              titleEn: 'Vision',
              titleAr: 'الرؤية',
              contentEn: 'To be the leading luxury interior design company in the Middle East, recognized for innovation and excellence.',
              contentAr: 'أن نكون شركة التصميم الداخلي الفاخر الرائدة في الشرق الأوسط، معترف بها للابتكار والتميز.'
            },
            {
              titleEn: 'Values',
              titleAr: 'القيم',
              contentEn: 'Excellence, Innovation, Integrity, Collaboration, and Sustainability.',
              contentAr: 'التميز والابتكار والنزاهة والتعاون والاستدامة.'
            }
          ]
        }
      }
    ]
  },
  {
    titleEn: 'Team',
    titleAr: 'الفريق',
    slugEn: 'team',
    slugAr: 'team',
    descriptionEn: 'Meet our talented team of interior designers and architects',
    descriptionAr: 'تعرف على فريقنا الموهوب من المصممين الداخليين والمهندسين المعماريين',
    seoMetaTitleEn: 'Our Team | Interior Designers Dubai | Mouhajer',
    seoMetaTitleAr: 'فريقنا | المصممين الداخليين دبي | مهاجر',
    status: 'published',
    blocks: [
      {
        type: 'team_grid',
        order: 1,
        data: {}
      }
    ]
  },
  {
    titleEn: 'FAQ',
    titleAr: 'الأسئلة الشائعة',
    slugEn: 'faq',
    slugAr: 'faq',
    descriptionEn: 'Frequently asked questions about our interior design services',
    descriptionAr: 'الأسئلة الشائعة حول خدمات التصميم الداخلي لدينا',
    seoMetaTitleEn: 'FAQ | Frequently Asked Questions | Mouhajer',
    seoMetaTitleAr: 'الأسئلة الشائعة | مهاجر',
    status: 'published',
    blocks: [
      {
        type: 'faq_section',
        order: 1,
        data: {}
      }
    ]
  },
  {
    titleEn: 'Testimonials',
    titleAr: 'شهادات العملاء',
    slugEn: 'testimonials',
    slugAr: 'testimonials',
    descriptionEn: 'What our clients say about Mouhajer International Design',
    descriptionAr: 'ما يقوله عملاؤنا عن مهاجر الدولية للتصميم',
    seoMetaTitleEn: 'Client Testimonials | Reviews | Mouhajer',
    seoMetaTitleAr: 'شهادات العملاء | التقييمات | مهاجر',
    status: 'published',
    blocks: [
      {
        type: 'testimonials',
        order: 1,
        data: {}
      }
    ]
  },
  {
    titleEn: 'Pricing',
    titleAr: 'الأسعار',
    slugEn: 'pricing',
    slugAr: 'pricing',
    descriptionEn: 'Transparent pricing for our interior design services',
    descriptionAr: 'أسعار شفافة لخدمات التصميم الداخلي لدينا',
    seoMetaTitleEn: 'Interior Design Pricing | Packages | Mouhajer',
    seoMetaTitleAr: 'أسعار التصميم الداخلي | الباقات | مهاجر',
    status: 'published',
    blocks: [
      {
        type: 'pricing_table',
        order: 1,
        data: {}
      }
    ]
  },
  {
    titleEn: 'Case Studies',
    titleAr: 'دراسات الحالة',
    slugEn: 'case-studies',
    slugAr: 'case-studies',
    descriptionEn: 'In-depth look at our most successful interior design projects',
    descriptionAr: 'نظرة متعمقة على مشاريع التصميم الداخلي الأكثر نجاحًا لدينا',
    seoMetaTitleEn: 'Interior Design Case Studies | Success Stories | Mouhajer',
    seoMetaTitleAr: 'دراسات حالة التصميم الداخلي | قصص النجاح | مهاجر',
    status: 'published',
    blocks: [
      {
        type: 'case_studies',
        order: 1,
        data: {}
      }
    ]
  },
  {
    titleEn: 'Privacy Policy',
    titleAr: 'سياسة الخصوصية',
    slugEn: 'privacy-policy',
    slugAr: 'privacy-policy',
    descriptionEn: 'Our commitment to protecting your privacy',
    descriptionAr: 'التزامنا بحماية خصوصيتك',
    seoMetaTitleEn: 'Privacy Policy | Mouhajer International Design',
    seoMetaTitleAr: 'سياسة الخصوصية | مهاجر الدولية للتصميم',
    status: 'published',
    blocks: [
      {
        type: 'text_section',
        order: 1,
        data: {
          titleEn: 'Privacy Policy',
          titleAr: 'سياسة الخصوصية',
          contentEn: 'Your privacy is important to us. This policy outlines how we collect, use, and protect your information...',
          contentAr: 'خصوصيتك مهمة بالنسبة لنا. توضح هذه السياسة كيفية جمع معلوماتك واستخدامها وحمايتها...'
        }
      }
    ]
  }
];

async function main() {
  console.log('🚀 Starting migration of static routes to CMS pages...\n');

  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const pageData of staticRoutePages) {
    try {
      // Check if page already exists
      const existingPage = await prisma.page.findFirst({
        where: {
          slugEn: pageData.slugEn
        }
      });

      if (existingPage) {
        console.log(`⚠️  Page already exists: ${pageData.titleEn} (${pageData.slugEn})`);
        updated++;
        continue;
      }

      // Create the page with blocks
      const page = await prisma.page.create({
        data: {
          titleEn: pageData.titleEn,
          titleAr: pageData.titleAr,
          slugEn: pageData.slugEn,
          slugAr: pageData.slugAr,
          descriptionEn: pageData.descriptionEn,
          descriptionAr: pageData.descriptionAr,
          seoMetaTitleEn: pageData.seoMetaTitleEn,
          seoMetaTitleAr: pageData.seoMetaTitleAr,
          seoMetaDescEn: pageData.descriptionEn,
          seoMetaDescAr: pageData.descriptionAr,
          status: pageData.status,
          blocks: {
            create: pageData.blocks
          }
        },
        include: {
          blocks: true
        }
      });

      console.log(`✅ Created page: ${pageData.titleEn} (${pageData.slugEn})`);
      created++;
    } catch (error) {
      console.error(`❌ Failed to create page: ${pageData.titleEn}`, error.message);
      failed++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`  - Pages created: ${created}`);
  console.log(`  - Pages already existing: ${updated}`);
  console.log(`  - Failed: ${failed}`);
  console.log(`  - Total processed: ${staticRoutePages.length}`);

  console.log('\n✨ Next Steps:');
  console.log('1. Update your [...slug]/page.tsx to handle home page (empty slug)');
  console.log('2. Remove the static route folders from app/[locale]/');
  console.log('3. Test all pages via CMS-driven routing');
  console.log('4. Customize page blocks in CMS admin panel');

  console.log('\n📁 Folders to remove:');
  const foldersToRemove = [
    'services', 'contact-us', 'our-projects', 'blogs', 'who-we-are',
    'team', 'faq', 'testimonials', 'pricing', 'case-studies',
    'privacy-policy', 'careers', 'design-services', 'room-redesign',
    'suppliers'
  ];
  foldersToRemove.forEach(folder => {
    console.log(`  - apps/frontend/app/[locale]/${folder}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });