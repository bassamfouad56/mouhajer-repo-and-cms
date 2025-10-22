import { prisma } from './prisma';

export async function seedHomePage() {
  try {
    // Delete existing Home page if it exists
    await prisma.page.deleteMany({
      where: {
        OR: [
          { slugEn: 'home' },
          { titleEn: 'Home' }
        ]
      }
    });

    // Create comprehensive Home page with quality content
    const homePage = await prisma.page.create({
      data: {
        titleEn: 'Home',
        titleAr: 'الرئيسية',
        slugEn: 'home',
        slugAr: 'الرئيسية',
        descriptionEn: 'Mouhajer International Design - Premier luxury interior design company in Dubai. Transforming spaces with award-winning design excellence for over 20 years.',
        descriptionAr: 'مهاجر الدولية للتصميم - شركة رائدة في التصميم الداخلي الفاخر في دبي. تحويل المساحات بتميز تصميمي حائز على جوائز لأكثر من 20 عامًا.',
        seoMetaTitleEn: 'Luxury Interior Design Dubai | Award-Winning | Mouhajer International Design',
        seoMetaTitleAr: 'تصميم داخلي فاخر دبي | حائز على جوائز | مهاجر الدولية للتصميم',
        seoMetaDescEn: 'Transform your space with Dubai\'s #1 interior design company. 20+ years experience, 500+ luxury projects, 98% client satisfaction. Award-winning residential & commercial design. Free consultation!',
        seoMetaDescAr: 'حوّل مساحتك مع شركة التصميم الداخلي رقم 1 في دبي. خبرة أكثر من 20 عامًا، أكثر من 500 مشروع فاخر، رضا العملاء 98%. تصميم سكني وتجاري حائز على جوائز. استشارة مجانية!',
        seoKeywords: [
          'interior design Dubai',
          'luxury interior designer Dubai',
          'villa interior design UAE',
          'apartment design Dubai',
          'commercial interior design Dubai',
          'best interior design company Dubai',
          'luxury home design UAE',
          'interior design and contracting Dubai',
          'Dubai Marina interior design',
          'Downtown Dubai interior designer',
          'Palm Jumeirah villa design',
          'Mouhajer International Design',
          'تصميم داخلي دبي',
          'مصمم داخلي فاخر دبي',
          'تصميم داخلي فيلا الإمارات',
          'تصميم شقة دبي',
          'تصميم داخلي تجاري دبي',
          'أفضل شركة تصميم داخلي دبي',
          'تصميم منزل فاخر الإمارات',
          'تصميم داخلي وتعاقد دبي',
          'تصميم داخلي دبي مارينا',
          'مصمم داخلي وسط مدينة دبي',
          'تصميم فيلا نخلة جميرا',
          'مهاجر الدولية للتصميم'
        ],
        status: 'published',
        featured: true,
        blocks: {
          create: [
            {
              type: 'hero_banner',
              order: 1,
              data: {
                titleEn: 'Luxury Interior Design with Distinction',
                titleAr: 'تصميم داخلي فاخر بامتياز',
                subtitleEn: 'Transforming spaces into extraordinary experiences for over 22 years in Dubai',
                subtitleAr: 'تحويل المساحات إلى تجارب استثنائية لأكثر من 22 عامًا في دبي',
                backgroundImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
                ctaTextEn: 'Explore Our Work',
                ctaTextAr: 'استكشف أعمالنا'
              }
            },
            {
              type: 'animated_headline',
              order: 2,
              data: {
                textEn: 'Why Choose Mouhajer International Design',
                textAr: 'لماذا تختار مهاجر الدولية للتصميم'
              }
            },
            {
              type: 'text_content',
              order: 3,
              data: {
                titleEn: 'Award-Winning Excellence',
                titleAr: 'التميز الحائز على الجوائز',
                subtitleEn: 'Recognized as Dubai\'s Premier Interior Design Company',
                subtitleAr: 'معترف بها كشركة التصميم الداخلي الرائدة في دبي',
                descriptionEn: 'With over two decades of expertise, Mouhajer International Design has established itself as the leading interior design and contracting company in Dubai. We specialize in creating bespoke luxury environments that reflect our clients\' unique vision while maintaining the highest standards of craftsmanship.',
                descriptionAr: 'مع أكثر من عقدين من الخبرة، رسخت مهاجر الدولية للتصميم مكانتها كشركة رائدة في التصميم الداخلي والمقاولات في دبي. نحن متخصصون في إنشاء بيئات فاخرة مخصصة تعكس رؤية عملائنا الفريدة مع الحفاظ على أعلى معايير الحرفية.',
                backgroundImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
              }
            },
            {
              type: 'about_section',
              order: 4,
              data: {
                titleEn: 'The Mouhajer Design Philosophy',
                titleAr: 'فلسفة تصميم المهاجر',
                subtitleEn: 'Where Innovation Meets Tradition',
                subtitleAr: 'حيث يلتقي الابتكار بالتقليد',
                descriptionEn: 'Our approach transcends conventional interior design. We integrate architecture, engineering, and artistic vision to create spaces that are not just beautiful, but functional, sustainable, and deeply personal. Every project tells a story, and we are the storytellers of luxury living.',
                descriptionAr: 'نهجنا يتجاوز التصميم الداخلي التقليدي. نحن ندمج الهندسة المعمارية والهندسة والرؤية الفنية لإنشاء مساحات ليست جميلة فحسب، بل عملية ومستدامة وشخصية للغاية. كل مشروع يحكي قصة، ونحن رواة قصص المعيشة الفاخرة.',
                image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                yearsOfExperience: '22',
                experienceLabelEn: 'Years of Excellence',
                experienceLabelAr: 'عامًا من التميز',
                gallery: [
                  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                ],
                features: [
                  {
                    titleEn: 'Bespoke Design Solutions',
                    titleAr: 'حلول تصميم مخصصة',
                    descriptionEn: 'Tailored to your unique lifestyle and preferences',
                    descriptionAr: 'مصممة خصيصًا لنمط حياتك وتفضيلاتك الفريدة'
                  },
                  {
                    titleEn: 'Premium Materials',
                    titleAr: 'مواد فاخرة',
                    descriptionEn: 'Sourced from the finest suppliers worldwide',
                    descriptionAr: 'مصدرها من أفضل الموردين في جميع أنحاء العالم'
                  },
                  {
                    titleEn: 'Expert Craftsmanship',
                    titleAr: 'حرفية خبيرة',
                    descriptionEn: 'Executed by skilled artisans and professionals',
                    descriptionAr: 'منفذة من قبل حرفيين ومهنيين مهرة'
                  }
                ]
              }
            },
            {
              type: 'portfolio_section',
              order: 5,
              data: {
                titleEn: 'Our Portfolio',
                titleAr: 'أعمالنا',
                subtitleEn: 'Discover Our Award-Winning Projects',
                subtitleAr: 'اكتشف مشاريعنا الحائزة على الجوائز'
              }
            },
            {
              type: 'separator',
              order: 6,
              data: {}
            },
            {
              type: 'awards_section',
              order: 7,
              data: {
                titleEn: 'Recognition & Awards',
                titleAr: 'التقدير والجوائز'
              }
            },
            {
              type: 'featured_in',
              order: 8,
              data: {
                titleEn: 'Featured In',
                titleAr: 'مميز في',
                logos: [
                  'https://via.placeholder.com/200x100/333/fff?text=Forbes',
                  'https://via.placeholder.com/200x100/333/fff?text=Architectural+Digest',
                  'https://via.placeholder.com/200x100/333/fff?text=Elle+Decor'
                ]
              }
            },
            {
              type: 'blog_section',
              order: 9,
              data: {
                titleEn: 'Latest Insights',
                titleAr: 'أحدث الرؤى'
              }
            },
            {
              type: 'clients_section',
              order: 10,
              data: {
                titleEn: 'Trusted by Leading Brands',
                titleAr: 'موثوق من قبل العلامات التجارية الرائدة'
              }
            },
            {
              type: 'instagram_section',
              order: 11,
              data: {
                titleEn: 'Follow Our Journey',
                titleAr: 'تابع رحلتنا'
              }
            },
            {
              type: 'contact_form',
              order: 12,
              data: {
                titleEn: 'Start Your Design Journey',
                titleAr: 'ابدأ رحلة التصميم الخاصة بك'
              }
            }
          ]
        }
      },
      include: {
        blocks: true
      }
    });

    console.log('Comprehensive Home page created successfully');
    return homePage;
  } catch (error) {
    console.error('Error seeding Home page:', error);
    throw error;
  }
}