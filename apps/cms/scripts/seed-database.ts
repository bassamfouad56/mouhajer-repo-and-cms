import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedContent() {
  console.log('📝 Seeding sample content (projects, services, blog)...');

  // Seed Projects
  const projects = [
    {
      titleEn: 'Luxury Villa in Dubai Hills',
      titleAr: 'فيلا فاخرة في دبي هيلز',
      descriptionEn: 'A stunning contemporary villa featuring bespoke interiors with a perfect blend of modern luxury and traditional Arabic elements. This 12,000 sq ft masterpiece showcases our expertise in high-end residential design.',
      descriptionAr: 'فيلا معاصرة مذهلة تتميز بتصميمات داخلية مخصصة مع مزيج مثالي من الفخامة الحديثة والعناصر العربية التقليدية. تعرض هذه التحفة الفنية البالغة 12,000 قدم مربع خبرتنا في التصميم السكني الراقي.',
      images: ['/images/projects/villa-1.jpg', '/images/projects/villa-2.jpg', '/images/projects/villa-3.jpg'],
      category: 'Residential',
      featured: true,
      status: 'published'
    },
    {
      titleEn: 'Emirates Palace Penthouse',
      titleAr: 'بنتهاوس قصر الإمارات',
      descriptionEn: 'An opulent penthouse design featuring Italian marble, gold leaf details, and panoramic city views. This project exemplifies our commitment to creating spaces of unparalleled luxury.',
      descriptionAr: 'تصميم بنتهاوس فاخر يضم رخام إيطالي وتفاصيل ورق ذهبي وإطلالات بانورامية على المدينة. يجسد هذا المشروع التزامنا بإنشاء مساحات ذات فخامة لا مثيل لها.',
      images: ['/images/projects/penthouse-1.jpg', '/images/projects/penthouse-2.jpg'],
      category: 'Residential',
      featured: true,
      status: 'published'
    },
    {
      titleEn: 'Downtown Dubai Corporate Office',
      titleAr: 'مكتب شركات وسط دبي',
      descriptionEn: 'A modern corporate workspace designed to inspire innovation and collaboration. Features include smart office technology, sustainable materials, and biophilic design elements.',
      descriptionAr: 'مساحة عمل شركات حديثة مصممة لإلهام الابتكار والتعاون. تشمل الميزات تكنولوجيا المكاتب الذكية والمواد المستدامة وعناصر التصميم المحبة للطبيعة.',
      images: ['/images/projects/office-1.jpg', '/images/projects/office-2.jpg', '/images/projects/office-3.jpg'],
      category: 'Commercial',
      featured: true,
      status: 'published'
    }
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  // Seed Services
  const services = [
    {
      titleEn: 'Interior Design Consultancy',
      titleAr: 'استشارات التصميم الداخلي',
      descriptionEn: 'Our comprehensive interior design consultancy service transforms your vision into reality. From concept development to final execution, we guide you through every step of creating your dream space.',
      descriptionAr: 'تحول خدمة استشارات التصميم الداخلي الشاملة لدينا رؤيتك إلى واقع. من تطوير المفهوم إلى التنفيذ النهائي، نرشدك خلال كل خطوة من إنشاء المساحة التي تحلم بها.',
      shortDescriptionEn: 'Transform your space with expert design consultation',
      shortDescriptionAr: 'حول مساحتك مع استشارة تصميم خبيرة',
      icon: '🎨',
      featuresEn: ['Concept Development', '3D Visualization', 'Material Selection', 'Project Management'],
      featuresAr: ['تطوير المفهوم', 'التصور ثلاثي الأبعاد', 'اختيار المواد', 'إدارة المشاريع'],
      price: 'Starting from AED 50,000',
      duration: '8-12 weeks',
      featured: true,
      status: 'published'
    },
    {
      titleEn: 'Luxury Fit-Out Services',
      titleAr: 'خدمات التجهيز الفاخر',
      descriptionEn: 'Complete turnkey fit-out solutions for residential and commercial projects. We manage every aspect of the fit-out process, ensuring impeccable quality, timely delivery, and budget adherence.',
      descriptionAr: 'حلول التجهيز الكاملة الجاهزة للمشاريع السكنية والتجارية. نحن ندير كل جانب من جوانب عملية التجهيز، مما يضمن جودة لا تشوبها شائبة وتسليم في الوقت المناسب والالتزام بالميزانية.',
      shortDescriptionEn: 'End-to-end fit-out solutions with premium finishes',
      shortDescriptionAr: 'حلول التجهيز من البداية للنهاية مع تشطيبات ممتازة',
      icon: '🔨',
      featuresEn: ['Full Project Management', 'Quality Assurance', 'On-time Delivery', 'Budget Control'],
      featuresAr: ['إدارة المشروع الكاملة', 'ضمان الجودة', 'التسليم في الموعد', 'التحكم في الميزانية'],
      price: 'Custom Quote',
      duration: '12-20 weeks',
      featured: true,
      status: 'published'
    }
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  // Seed Blog Posts
  const blogPosts = [
    {
      titleEn: '10 Luxury Interior Design Trends for 2025',
      titleAr: '10 اتجاهات تصميم داخلي فاخر لعام 2025',
      slugEn: '10-luxury-interior-design-trends-2025',
      slugAr: '10-اتجاهات-تصميم-داخلي-فاخر-2025',
      excerptEn: 'Discover the top luxury interior design trends that will define elite spaces in 2025. From sustainable materials to smart home integration.',
      excerptAr: 'اكتشف أفضل اتجاهات التصميم الداخلي الفاخر التي ستحدد المساحات النخبوية في عام 2025. من المواد المستدامة إلى تكامل المنزل الذكي.',
      contentEn: 'The luxury interior design landscape is evolving. Here are the top 10 trends we are seeing for 2025...',
      contentAr: 'يتطور مشهد التصميم الداخلي الفاخر. فيما يلي أهم 10 اتجاهات نراها لعام 2025...',
      featuredImage: '/images/blog/trends-2025.jpg',
      category: 'Design Trends',
      tags: ['trends', 'luxury', 'interior design', '2025'],
      author: 'Eng. Maher Mouhajer',
      publishedAt: new Date(),
      featured: true,
      status: 'published'
    }
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  console.log('✅ Sample content seeded successfully');
}

async function seedHomepage() {
  console.log('🏠 Seeding homepage with blocks...');

  // Delete existing homepage
  const existingPage = await prisma.page.findFirst({
    where: { slugEn: 'home' }
  });

  if (existingPage) {
    await prisma.pageBlock.deleteMany({
      where: { pageId: existingPage.id }
    });
    await prisma.page.delete({
      where: { id: existingPage.id }
    });
  }

  // Create homepage
  const homepage = await prisma.page.create({
    data: {
      titleEn: 'Home',
      titleAr: 'الرئيسية',
      slugEn: 'home',
      slugAr: 'الرئيسية',
      descriptionEn: 'Luxury Interior Design Company in Dubai - Award-winning design studio',
      descriptionAr: 'شركة التصميم الداخلي الفاخر في دبي - استوديو التصميم الحائز على جوائز',
      seoMetaTitleEn: 'Luxury Interior Design Dubai | Mouhajer International Design',
      seoMetaTitleAr: 'تصميم داخلي فاخر دبي | مهاجر الدولية للتصميم',
      seoMetaDescEn: 'Award-winning luxury interior design company in Dubai. Transform your villa, apartment, or commercial space with our expert designers. 500+ successful projects across UAE.',
      seoMetaDescAr: 'شركة التصميم الداخلي الفاخر الحائزة على جوائز في دبي. حول الفيلا أو الشقة أو المساحة التجارية مع مصممينا الخبراء. أكثر من 500 مشروع ناجح في الإمارات.',
      seoKeywords: ['interior design Dubai', 'luxury interior design', 'villa design Dubai'],
      status: 'published',
      featured: true
    }
  });

  // Create blocks
  const blocks = [
    {
      type: 'hero_banner',
      data: {
        backgroundImage: '/newbanner.jpg',
        backgroundVideo: '/videos/hero-bg.mp4',
        title: {
          en: 'Excellence in Architecture, Interior Design & Fit-Out Services',
          ar: 'التميز في الهندسة المعمارية والتصميم الداخلي وخدمات التجهيز'
        },
        subtitle: {
          en: 'Transform your space with Dubai\'s award-winning design studio',
          ar: 'حول مساحتك مع استوديو التصميم الحائز على جوائز في دبي'
        },
        maskLayer: true
      },
      order: 1
    },
    {
      type: 'animated_headline',
      data: {
        text: {
          en: 'LUXURY • INNOVATION • CRAFTSMANSHIP • EXCELLENCE',
          ar: 'فخامة • ابتكار • حرفية • تميز'
        },
        blackened: true
      },
      order: 2
    },
    {
      type: 'company_description_home',
      data: { backgroundColor: '#202020' },
      order: 3
    },
    {
      type: 'about_carousel_home',
      data: { images: [] },
      order: 4
    },
    {
      type: 'services_swiper',
      data: {
        title: {
          en: 'Our Comprehensive Design Services',
          ar: 'خدمات التصميم الشاملة لدينا'
        }
      },
      order: 5
    },
    {
      type: 'portfolio_display_home',
      data: {
        headline: { en: 'OUR PORTFOLIO', ar: 'أعمالنا' },
        projectCount: 400,
        featured: true,
        maxItems: 10
      },
      order: 6
    },
    {
      type: 'founder_section',
      data: { image: '/images/engineer-placeholder.jpg' },
      order: 7
    },
    {
      type: 'awards_section',
      data: {
        title: { en: 'Awards & Recognition', ar: 'الجوائز والتقدير' }
      },
      order: 8
    },
    {
      type: 'featured_in',
      data: { logos: [] },
      order: 9
    },
    {
      type: 'blog_section',
      data: {
        title: { en: 'Latest From Our Blog', ar: 'آخر المقالات من مدونتنا' },
        featured: true,
        published: true,
        maxItems: 3,
        layout: 'grid'
      },
      order: 10
    },
    {
      type: 'contact_form',
      data: {
        title: { en: 'Get In Touch', ar: 'تواصل معنا' }
      },
      order: 11
    }
  ];

  for (const block of blocks) {
    await prisma.pageBlock.create({
      data: {
        pageId: homepage.id,
        ...block
      }
    });
  }

  console.log('✅ Homepage seeded successfully');
}

async function main() {
  console.log('🌱 Seeding Mouhajer CMS Database...\n');

  await seedContent();
  console.log('');
  await seedHomepage();

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Visit http://localhost:3000/en to see your homepage');
  console.log('2. Visit http://localhost:3010 to manage content in the CMS');
  console.log('3. Upload images via the CMS media library');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
