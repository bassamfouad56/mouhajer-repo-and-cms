/**
 * High-Quality CMS Content Seeder
 * Seeds the CMS with professional content, SEO optimization, and media
 */

import { prisma } from '../src/lib/prisma';
import slugify from 'slugify';

// Professional, high-quality content for Mouhajer Interior Design
const COMPANY_INFO = {
  name: 'Mouhajer Interior Design',
  tagline: 'Transforming Spaces, Elevating Lives',
  arabicTagline: 'تحويل المساحات، الارتقاء بالحياة',
  description: 'Award-winning interior design studio specializing in luxury residential and commercial spaces across the UAE',
  arabicDescription: 'استوديو تصميم داخلي حائز على جوائز متخصص في المساحات السكنية والتجارية الفاخرة في جميع أنحاء دولة الإمارات العربية المتحدة',
};

async function getAvailableMedia() {
  try {
    // Get all media from the database
    const media = await prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Found ${media.length} media items in the database`);

    // Categorize media by type
    const images = media.filter(m => m.type === 'image');
    const videos = media.filter(m => m.type === 'video');

    return {
      all: media,
      images,
      videos,
      // Helper function to get random image
      getRandomImage: () => images[Math.floor(Math.random() * images.length)]?.url || '/placeholder.jpg',
      // Helper function to get multiple random images
      getRandomImages: (count: number) => {
        const shuffled = [...images].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(img => img.url);
      }
    };
  } catch (error) {
    console.error('Error fetching media:', error);
    return {
      all: [],
      images: [],
      videos: [],
      getRandomImage: () => '/placeholder.jpg',
      getRandomImages: (count: number) => Array(count).fill('/placeholder.jpg')
    };
  }
}

async function seedHomePage(media: any) {
  console.log('Creating homepage with high-quality content...');

  const homepage = await prisma.page.create({
    data: {
      titleEn: 'Home',
      titleAr: 'الرئيسية',
      slugEn: 'home',
      slugAr: 'home-ar',
      descriptionEn: 'Welcome to Mouhajer Interior Design - Your premier destination for luxury interior design in Dubai and the UAE',
      descriptionAr: 'مرحباً بكم في موهاجر للتصميم الداخلي - وجهتكم الأولى للتصميم الداخلي الفاخر في دبي والإمارات',
      status: 'published',
      featured: true,

      // Comprehensive SEO
      seoMetaTitleEn: 'Mouhajer Interior Design | Luxury Interior Design Dubai | Award-Winning Studio',
      seoMetaTitleAr: 'موهاجر للتصميم الداخلي | تصميم داخلي فاخر دبي | استوديو حائز على جوائز',
      seoMetaDescEn: 'Transform your space with Mouhajer Interior Design. Award-winning luxury interior design services in Dubai & UAE. Residential, commercial, and hospitality projects. Get your free consultation today.',
      seoMetaDescAr: 'حول مساحتك مع موهاجر للتصميم الداخلي. خدمات التصميم الداخلي الفاخر الحائزة على جوائز في دبي والإمارات. مشاريع سكنية وتجارية وضيافة. احصل على استشارتك المجانية اليوم.',
      seoKeywords: [
        'interior design dubai',
        'luxury interior design',
        'dubai interior designers',
        'uae interior design',
        'residential design dubai',
        'commercial interior design',
        'villa interior design',
        'apartment design dubai',
        'office design dubai',
        'تصميم داخلي دبي',
        'تصميم فاخر',
        'مصممين داخليين'
      ],

      blocks: {
        create: [
          // Hero Banner
          {
            type: 'hero_banner',
            order: 0,
            data: {
              title: {
                en: 'Elevate Your Living Experience',
                ar: 'ارتقِ بتجربة معيشتك'
              },
              subtitle: {
                en: 'Creating timeless interiors that reflect your unique style and enhance your lifestyle',
                ar: 'نصمم ديكورات داخلية خالدة تعكس أسلوبك الفريد وتعزز نمط حياتك'
              },
              ctaText: {
                en: 'Start Your Project',
                ar: 'ابدأ مشروعك'
              },
              ctaLink: '/contact',
              backgroundImage: media.getRandomImage(),
              maskLayer: true
            }
          },

          // Featured In Section
          {
            type: 'featured_in',
            order: 1,
            data: {
              title: {
                en: 'Featured In',
                ar: 'ظهرنا في'
              },
              logos: media.getRandomImages(6).map((url: string) => ({
                url,
                alt: 'Media Partner'
              }))
            }
          },

          // Company Description
          {
            type: 'company_description',
            order: 2,
            data: {
              title: {
                en: 'Crafting Exceptional Interiors Since 2010',
                ar: 'نصنع ديكورات استثنائية منذ 2010'
              },
              description: {
                en: 'With over a decade of experience, Mouhajer Interior Design has transformed countless spaces into stunning works of art. Our team of expert designers combines creativity, functionality, and attention to detail to deliver interiors that exceed expectations.',
                ar: 'مع أكثر من عقد من الخبرة، قامت موهاجر للتصميم الداخلي بتحويل عدد لا يحصى من المساحات إلى أعمال فنية مذهلة. يجمع فريقنا من المصممين الخبراء بين الإبداع والوظائف والاهتمام بالتفاصيل لتقديم تصميمات داخلية تفوق التوقعات.'
              },
              images: media.getRandomImages(4),
              stats: {
                projectsCompleted: 500,
                happyClients: 450,
                awardsWon: 25,
                yearsExperience: 14
              }
            }
          },

          // Services Overview
          {
            type: 'services_grid',
            order: 3,
            data: {
              title: {
                en: 'Our Services',
                ar: 'خدماتنا'
              },
              subtitle: {
                en: 'Comprehensive design solutions tailored to your needs',
                ar: 'حلول تصميم شاملة مصممة خصيصاً لاحتياجاتك'
              },
              services: [
                {
                  title: { en: 'Residential Design', ar: 'التصميم السكني' },
                  description: {
                    en: 'Transform your home into a luxurious sanctuary that reflects your personality',
                    ar: 'حوّل منزلك إلى ملاذ فاخر يعكس شخصيتك'
                  },
                  icon: '🏠',
                  image: media.getRandomImage()
                },
                {
                  title: { en: 'Commercial Spaces', ar: 'المساحات التجارية' },
                  description: {
                    en: 'Create inspiring workspaces that boost productivity and impress clients',
                    ar: 'أنشئ مساحات عمل ملهمة تعزز الإنتاجية وتبهر العملاء'
                  },
                  icon: '🏢',
                  image: media.getRandomImage()
                },
                {
                  title: { en: 'Hospitality Design', ar: 'تصميم الضيافة' },
                  description: {
                    en: 'Design memorable experiences for hotels, restaurants, and entertainment venues',
                    ar: 'صمم تجارب لا تُنسى للفنادق والمطاعم وأماكن الترفيه'
                  },
                  icon: '🏨',
                  image: media.getRandomImage()
                },
                {
                  title: { en: 'Retail Design', ar: 'تصميم المتاجر' },
                  description: {
                    en: 'Craft engaging retail environments that drive sales and brand loyalty',
                    ar: 'اصنع بيئات تجارية جذابة تزيد المبيعات والولاء للعلامة التجارية'
                  },
                  icon: '🛍️',
                  image: media.getRandomImage()
                }
              ]
            }
          },

          // Portfolio Showcase
          {
            type: 'portfolio_showcase',
            order: 4,
            data: {
              title: {
                en: 'Recent Projects',
                ar: 'المشاريع الأخيرة'
              },
              subtitle: {
                en: 'Explore our latest interior design transformations',
                ar: 'استكشف أحدث تحولاتنا في التصميم الداخلي'
              },
              projects: media.getRandomImages(6).map((image: string, index: number) => ({
                title: {
                  en: `Luxury ${['Villa', 'Apartment', 'Office', 'Restaurant', 'Hotel', 'Boutique'][index]} Design`,
                  ar: `تصميم ${['فيلا', 'شقة', 'مكتب', 'مطعم', 'فندق', 'بوتيك'][index]} فاخر`
                },
                category: ['Residential', 'Residential', 'Commercial', 'Hospitality', 'Hospitality', 'Retail'][index],
                image,
                location: ['Dubai Marina', 'Downtown Dubai', 'DIFC', 'JBR', 'Palm Jumeirah', 'City Walk'][index]
              }))
            }
          },

          // Testimonials
          {
            type: 'testimonials',
            order: 5,
            data: {
              title: {
                en: 'What Our Clients Say',
                ar: 'ماذا يقول عملاؤنا'
              },
              testimonials: [
                {
                  name: 'Sarah Al Maktoum',
                  position: { en: 'Villa Owner', ar: 'مالكة فيلا' },
                  content: {
                    en: 'Mouhajer transformed our villa into a masterpiece. Their attention to detail and understanding of our vision was exceptional. Highly recommended!',
                    ar: 'حولت موهاجر فيلتنا إلى تحفة فنية. كان اهتمامهم بالتفاصيل وفهمهم لرؤيتنا استثنائيًا. أوصي بهم بشدة!'
                  },
                  rating: 5,
                  image: media.getRandomImage()
                },
                {
                  name: 'Ahmed Hassan',
                  position: { en: 'Restaurant Owner', ar: 'صاحب مطعم' },
                  content: {
                    en: 'The team at Mouhajer created an ambiance that perfectly matches our brand. Our customers love the new interior!',
                    ar: 'أنشأ فريق موهاجر أجواءً تتناسب تمامًا مع علامتنا التجارية. يحب عملاؤنا التصميم الداخلي الجديد!'
                  },
                  rating: 5,
                  image: media.getRandomImage()
                },
                {
                  name: 'Maria Rodriguez',
                  position: { en: 'Hotel Manager', ar: 'مديرة فندق' },
                  content: {
                    en: 'Professional, creative, and delivered on time. Mouhajer exceeded our expectations in every way.',
                    ar: 'محترفون ومبدعون وملتزمون بالمواعيد. تجاوزت موهاجر توقعاتنا في كل شيء.'
                  },
                  rating: 5,
                  image: media.getRandomImage()
                }
              ]
            }
          },

          // Call to Action
          {
            type: 'cta_section',
            order: 6,
            data: {
              title: {
                en: 'Ready to Transform Your Space?',
                ar: 'هل أنت مستعد لتحويل مساحتك؟'
              },
              description: {
                en: 'Let our expert designers bring your vision to life. Schedule a free consultation today.',
                ar: 'دع مصممينا الخبراء يحققون رؤيتك. احجز استشارة مجانية اليوم.'
              },
              primaryButton: {
                text: { en: 'Get Free Consultation', ar: 'احصل على استشارة مجانية' },
                link: '/contact'
              },
              secondaryButton: {
                text: { en: 'View Portfolio', ar: 'عرض المعرض' },
                link: '/portfolio'
              },
              backgroundImage: media.getRandomImage()
            }
          }
        ]
      }
    },
    include: {
      blocks: true
    }
  });

  console.log('✅ Homepage created successfully');
  return homepage;
}

async function seedServicePages(media: any) {
  console.log('Creating service pages...');

  const services = [
    {
      titleEn: 'Residential Interior Design',
      titleAr: 'التصميم الداخلي السكني',
      slugEn: 'residential-interior-design',
      slugAr: 'residential-interior-design-ar',
      descriptionEn: 'Complete home interior design services for villas, apartments, and penthouses',
      descriptionAr: 'خدمات التصميم الداخلي الكاملة للفلل والشقق والبنتهاوس',
      metaDescEn: 'Transform your home with our luxury residential interior design services in Dubai. Expert designers for villas, apartments, and penthouses. Free consultation available.',
      metaDescAr: 'حول منزلك مع خدمات التصميم الداخلي السكني الفاخر في دبي. مصممون خبراء للفلل والشقق والبنتهاوس. استشارة مجانية متاحة.'
    },
    {
      titleEn: 'Commercial Interior Design',
      titleAr: 'التصميم الداخلي التجاري',
      slugEn: 'commercial-interior-design',
      slugAr: 'commercial-interior-design-ar',
      descriptionEn: 'Professional office and workspace design solutions that inspire productivity',
      descriptionAr: 'حلول تصميم المكاتب ومساحات العمل المهنية التي تلهم الإنتاجية',
      metaDescEn: 'Create inspiring commercial spaces with Mouhajer Interior Design. Office design, retail spaces, and corporate interiors in Dubai. Boost productivity and impress clients.',
      metaDescAr: 'أنشئ مساحات تجارية ملهمة مع موهاجر للتصميم الداخلي. تصميم المكاتب والمساحات التجارية والديكورات الداخلية للشركات في دبي.'
    },
    {
      titleEn: 'Hospitality Interior Design',
      titleAr: 'تصميم الضيافة الداخلي',
      slugEn: 'hospitality-interior-design',
      slugAr: 'hospitality-interior-design-ar',
      descriptionEn: 'Creating memorable experiences for hotels, restaurants, and entertainment venues',
      descriptionAr: 'خلق تجارب لا تُنسى للفنادق والمطاعم وأماكن الترفيه',
      metaDescEn: 'Expert hospitality interior design services in Dubai. Hotels, restaurants, cafes, and entertainment venues. Create memorable guest experiences with our designs.',
      metaDescAr: 'خدمات تصميم الضيافة الداخلية الخبيرة في دبي. الفنادق والمطاعم والمقاهي وأماكن الترفيه. اخلق تجارب ضيوف لا تُنسى مع تصاميمنا.'
    }
  ];

  for (const service of services) {
    await prisma.page.create({
      data: {
        titleEn: service.titleEn,
        titleAr: service.titleAr,
        slugEn: service.slugEn,
        slugAr: service.slugAr,
        descriptionEn: service.descriptionEn,
        descriptionAr: service.descriptionAr,
        status: 'published',
        seoMetaTitleEn: `${service.titleEn} | Mouhajer Interior Design Dubai`,
        seoMetaTitleAr: `${service.titleAr} | موهاجر للتصميم الداخلي دبي`,
        seoMetaDescEn: service.metaDescEn,
        seoMetaDescAr: service.metaDescAr,
        seoKeywords: [
          service.slugEn,
          'dubai',
          'uae',
          'luxury',
          'design',
          'interior'
        ],
        blocks: {
          create: [
            {
              type: 'hero_banner',
              order: 0,
              data: {
                title: {
                  en: service.titleEn,
                  ar: service.titleAr
                },
                subtitle: {
                  en: service.descriptionEn,
                  ar: service.descriptionAr
                },
                backgroundImage: media.getRandomImage(),
                ctaText: {
                  en: 'Get Started',
                  ar: 'ابدأ الآن'
                },
                ctaLink: '/contact'
              }
            },
            {
              type: 'content_section',
              order: 1,
              data: {
                title: {
                  en: 'Our Approach',
                  ar: 'نهجنا'
                },
                content: {
                  en: `At Mouhajer Interior Design, we believe that every space tells a story. Our approach to ${service.titleEn.toLowerCase()} combines creativity, functionality, and your unique vision to create spaces that inspire and delight.`,
                  ar: `في موهاجر للتصميم الداخلي، نؤمن بأن كل مساحة تحكي قصة. يجمع نهجنا في ${service.titleAr} بين الإبداع والوظائف ورؤيتك الفريدة لخلق مساحات تلهم وتسعد.`
                },
                images: media.getRandomImages(2)
              }
            }
          ]
        }
      }
    });
  }

  console.log('✅ Service pages created successfully');
}

async function seedAboutPage(media: any) {
  console.log('Creating About page...');

  await prisma.page.create({
    data: {
      titleEn: 'About Us',
      titleAr: 'من نحن',
      slugEn: 'about',
      slugAr: 'about-ar',
      descriptionEn: 'Learn about Mouhajer Interior Design\'s journey, mission, and the team behind the magic',
      descriptionAr: 'تعرف على رحلة موهاجر للتصميم الداخلي ومهمتنا والفريق وراء السحر',
      status: 'published',
      seoMetaTitleEn: 'About Us | Mouhajer Interior Design - Award-Winning Design Studio Dubai',
      seoMetaTitleAr: 'من نحن | موهاجر للتصميم الداخلي - استوديو تصميم حائز على جوائز دبي',
      seoMetaDescEn: 'Discover Mouhajer Interior Design\'s story. 14+ years of excellence in luxury interior design across Dubai and UAE. Meet our award-winning team of designers.',
      seoMetaDescAr: 'اكتشف قصة موهاجر للتصميم الداخلي. أكثر من 14 عامًا من التميز في التصميم الداخلي الفاخر في دبي والإمارات. قابل فريقنا الحائز على جوائز.',
      seoKeywords: [
        'about mouhajer',
        'interior design team',
        'dubai designers',
        'design studio',
        'award winning'
      ],
      blocks: {
        create: [
          {
            type: 'hero_banner',
            order: 0,
            data: {
              title: {
                en: 'Our Story',
                ar: 'قصتنا'
              },
              subtitle: {
                en: 'Building dreams, one space at a time since 2010',
                ar: 'نبني الأحلام، مساحة تلو الأخرى منذ 2010'
              },
              backgroundImage: media.getRandomImage()
            }
          },
          {
            type: 'about_founder',
            order: 1,
            data: {
              name: 'Hassan Mouhajer',
              title: {
                en: 'Founder & Creative Director',
                ar: 'المؤسس والمدير الإبداعي'
              },
              bio: {
                en: 'With over 20 years of experience in interior design, Hassan Mouhajer founded the studio with a vision to transform spaces into extraordinary experiences. His passion for design and commitment to excellence has earned numerous awards and the trust of hundreds of clients.',
                ar: 'مع أكثر من 20 عامًا من الخبرة في التصميم الداخلي، أسس حسن موهاجر الاستوديو برؤية لتحويل المساحات إلى تجارب استثنائية. حصل شغفه بالتصميم والتزامه بالتميز على العديد من الجوائز وثقة مئات العملاء.'
              },
              image: media.getRandomImage(),
              achievements: [
                'Best Interior Designer UAE 2022',
                'Design Excellence Award 2021',
                'Forbes Top 100 Designers Middle East'
              ]
            }
          },
          {
            type: 'team_grid',
            order: 2,
            data: {
              title: {
                en: 'Meet Our Team',
                ar: 'قابل فريقنا'
              },
              members: [
                {
                  name: 'Sarah Johnson',
                  position: { en: 'Senior Designer', ar: 'مصممة أولى' },
                  image: media.getRandomImage()
                },
                {
                  name: 'Ahmad Khalil',
                  position: { en: 'Project Manager', ar: 'مدير المشروع' },
                  image: media.getRandomImage()
                },
                {
                  name: 'Elena Martinez',
                  position: { en: 'Design Consultant', ar: 'استشارية التصميم' },
                  image: media.getRandomImage()
                },
                {
                  name: 'Mohammed Ali',
                  position: { en: '3D Visualization Expert', ar: 'خبير التصور ثلاثي الأبعاد' },
                  image: media.getRandomImage()
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ About page created successfully');
}

async function seedContactPage(media: any) {
  console.log('Creating Contact page...');

  await prisma.page.create({
    data: {
      titleEn: 'Contact Us',
      titleAr: 'اتصل بنا',
      slugEn: 'contact',
      slugAr: 'contact-ar',
      descriptionEn: 'Get in touch with Mouhajer Interior Design for your next project',
      descriptionAr: 'تواصل مع موهاجر للتصميم الداخلي لمشروعك القادم',
      status: 'published',
      seoMetaTitleEn: 'Contact Us | Mouhajer Interior Design Dubai | Free Consultation',
      seoMetaTitleAr: 'اتصل بنا | موهاجر للتصميم الداخلي دبي | استشارة مجانية',
      seoMetaDescEn: 'Contact Mouhajer Interior Design for luxury interior design services in Dubai. Free consultation. Call +971-XX-XXX-XXXX or visit our Dubai showroom.',
      seoMetaDescAr: 'تواصل مع موهاجر للتصميم الداخلي لخدمات التصميم الداخلي الفاخر في دبي. استشارة مجانية. اتصل على +971-XX-XXX-XXXX أو قم بزيارة صالة العرض في دبي.',
      seoKeywords: [
        'contact interior designer',
        'dubai design consultation',
        'free consultation',
        'interior design quote'
      ],
      blocks: {
        create: [
          {
            type: 'contact_hero',
            order: 0,
            data: {
              title: {
                en: 'Let\'s Create Something Beautiful Together',
                ar: 'دعنا نصنع شيئًا جميلًا معًا'
              },
              subtitle: {
                en: 'Start your journey to exceptional interior design',
                ar: 'ابدأ رحلتك نحو التصميم الداخلي الاستثنائي'
              },
              backgroundImage: media.getRandomImage()
            }
          },
          {
            type: 'contact_info',
            order: 1,
            data: {
              title: {
                en: 'Get In Touch',
                ar: 'تواصل معنا'
              },
              address: {
                en: 'Dubai Design District, Building 6, Dubai, UAE',
                ar: 'منطقة دبي للتصميم، المبنى 6، دبي، الإمارات'
              },
              phone: '+971-4-XXX-XXXX',
              email: 'info@mouhajerdesign.ae',
              workingHours: {
                en: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
                ar: 'الأحد - الخميس: 9:00 صباحًا - 6:00 مساءً'
              }
            }
          },
          {
            type: 'contact_form',
            order: 2,
            data: {
              title: {
                en: 'Request a Free Consultation',
                ar: 'اطلب استشارة مجانية'
              },
              fields: [
                { name: 'name', type: 'text', label: { en: 'Your Name', ar: 'اسمك' }, required: true },
                { name: 'email', type: 'email', label: { en: 'Email Address', ar: 'البريد الإلكتروني' }, required: true },
                { name: 'phone', type: 'tel', label: { en: 'Phone Number', ar: 'رقم الهاتف' }, required: true },
                { name: 'projectType', type: 'select', label: { en: 'Project Type', ar: 'نوع المشروع' }, options: ['Residential', 'Commercial', 'Hospitality', 'Other'] },
                { name: 'budget', type: 'select', label: { en: 'Budget Range', ar: 'نطاق الميزانية' }, options: ['< 100K AED', '100K-500K AED', '500K-1M AED', '> 1M AED'] },
                { name: 'message', type: 'textarea', label: { en: 'Tell us about your project', ar: 'أخبرنا عن مشروعك' }, required: true }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Contact page created successfully');
}

async function seedPortfolioPage(media: any) {
  console.log('Creating Portfolio page...');

  await prisma.page.create({
    data: {
      titleEn: 'Portfolio',
      titleAr: 'المعرض',
      slugEn: 'portfolio',
      slugAr: 'portfolio-ar',
      descriptionEn: 'Explore our award-winning interior design projects across Dubai and the UAE',
      descriptionAr: 'استكشف مشاريع التصميم الداخلي الحائزة على جوائز في دبي والإمارات',
      status: 'published',
      featured: true,
      seoMetaTitleEn: 'Portfolio | Interior Design Projects Dubai | Mouhajer Design',
      seoMetaTitleAr: 'المعرض | مشاريع التصميم الداخلي دبي | موهاجر للتصميم',
      seoMetaDescEn: 'Browse our portfolio of luxury interior design projects in Dubai. Residential villas, commercial spaces, hotels, and restaurants. See our award-winning designs.',
      seoMetaDescAr: 'تصفح معرض مشاريع التصميم الداخلي الفاخر في دبي. فلل سكنية ومساحات تجارية وفنادق ومطاعم. شاهد تصاميمنا الحائزة على جوائز.',
      seoKeywords: [
        'interior design portfolio',
        'dubai projects',
        'luxury interiors',
        'design gallery',
        'villa designs',
        'commercial interiors'
      ],
      blocks: {
        create: [
          {
            type: 'portfolio_hero',
            order: 0,
            data: {
              title: {
                en: 'Our Work',
                ar: 'أعمالنا'
              },
              subtitle: {
                en: 'Discover the art of exceptional interior design',
                ar: 'اكتشف فن التصميم الداخلي الاستثنائي'
              },
              backgroundImage: media.getRandomImage()
            }
          },
          {
            type: 'portfolio_filter',
            order: 1,
            data: {
              categories: [
                { en: 'All Projects', ar: 'جميع المشاريع' },
                { en: 'Residential', ar: 'سكني' },
                { en: 'Commercial', ar: 'تجاري' },
                { en: 'Hospitality', ar: 'ضيافة' },
                { en: 'Retail', ar: 'متاجر' }
              ]
            }
          },
          {
            type: 'portfolio_grid',
            order: 2,
            data: {
              projects: media.getRandomImages(12).map((image: string, index: number) => ({
                id: `project-${index + 1}`,
                title: {
                  en: `Project ${index + 1}`,
                  ar: `المشروع ${index + 1}`
                },
                category: ['Residential', 'Commercial', 'Hospitality', 'Retail'][index % 4],
                location: ['Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Business Bay'][index % 4],
                year: 2024 - (index % 3),
                image,
                description: {
                  en: 'A stunning transformation that showcases our commitment to excellence and attention to detail.',
                  ar: 'تحول مذهل يعرض التزامنا بالتميز والاهتمام بالتفاصيل.'
                }
              }))
            }
          }
        ]
      }
    }
  });

  console.log('✅ Portfolio page created successfully');
}

async function seedTestimonials() {
  console.log('Creating testimonials...');

  const testimonials = [
    {
      name: 'Fatima Al Rashid',
      role: 'CEO',
      company: 'Al Rashid Holdings',
      commentEn: 'Mouhajer Interior Design transformed our corporate headquarters into a space that truly represents our brand values. The attention to detail and professionalism throughout the project was exceptional.',
      commentAr: 'حولت موهاجر للتصميم الداخلي مقرنا الرئيسي إلى مساحة تمثل حقًا قيم علامتنا التجارية. كان الاهتمام بالتفاصيل والاحتراف طوال المشروع استثنائيًا.',
      rating: 5,
      projectTitle: 'Corporate Office Design',
      projectType: 'Commercial',
      featured: true,
      published: true
    },
    {
      name: 'John Williams',
      role: 'Hotel Owner',
      company: 'Williams Hospitality Group',
      commentEn: 'Working with Mouhajer was a fantastic experience. They delivered a design that exceeded our expectations and completed the project on time and within budget.',
      commentAr: 'كان العمل مع موهاجر تجربة رائعة. قدموا تصميمًا فاق توقعاتنا وأكملوا المشروع في الوقت المحدد وضمن الميزانية.',
      rating: 5,
      projectTitle: 'Luxury Hotel Renovation',
      projectType: 'Hospitality',
      featured: true,
      published: true
    },
    {
      name: 'Aisha Mohammed',
      role: 'Villa Owner',
      company: null,
      commentEn: 'The team at Mouhajer understood our vision perfectly and created a home that we absolutely love. Every detail was carefully considered and beautifully executed.',
      commentAr: 'فهم فريق موهاجر رؤيتنا تمامًا وأنشأوا منزلًا نحبه تمامًا. تم النظر في كل التفاصيل بعناية وتنفيذها بشكل جميل.',
      rating: 5,
      projectTitle: 'Luxury Villa Design',
      projectType: 'Residential',
      featured: false,
      published: true
    }
  ];

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: testimonial
    });
  }

  console.log('✅ Testimonials created successfully');
}

async function seedBlogPosts(media: any) {
  console.log('Creating blog posts...');

  const posts = [
    {
      titleEn: '10 Interior Design Trends for 2024',
      titleAr: '10 اتجاهات التصميم الداخلي لعام 2024',
      slugEn: 'interior-design-trends-2024',
      slugAr: 'interior-design-trends-2024-ar',
      excerptEn: 'Discover the latest interior design trends that are shaping homes and commercial spaces in 2024.',
      excerptAr: 'اكتشف أحدث اتجاهات التصميم الداخلي التي تشكل المنازل والمساحات التجارية في عام 2024.',
      contentEn: 'From sustainable materials to smart home integration, 2024 is bringing exciting new trends to interior design...',
      contentAr: 'من المواد المستدامة إلى تكامل المنزل الذكي، يجلب عام 2024 اتجاهات جديدة مثيرة للتصميم الداخلي...',
      metaDescEn: 'Explore the top 10 interior design trends for 2024. From sustainable materials to smart homes, discover what\'s trending in Dubai interior design.',
      metaDescAr: 'استكشف أفضل 10 اتجاهات للتصميم الداخلي لعام 2024. من المواد المستدامة إلى المنازل الذكية، اكتشف ما هو رائج في التصميم الداخلي في دبي.'
    },
    {
      titleEn: 'How to Choose the Right Color Palette for Your Home',
      titleAr: 'كيفية اختيار لوحة الألوان المناسبة لمنزلك',
      slugEn: 'choosing-color-palette-home',
      slugAr: 'choosing-color-palette-home-ar',
      excerptEn: 'Learn the secrets of selecting the perfect color scheme that reflects your personality and enhances your living space.',
      excerptAr: 'تعلم أسرار اختيار نظام الألوان المثالي الذي يعكس شخصيتك ويعزز مساحة معيشتك.',
      contentEn: 'Color has the power to transform any space. Here\'s our professional guide to choosing the perfect palette...',
      contentAr: 'للألوان القدرة على تحويل أي مساحة. إليك دليلنا المهني لاختيار اللوحة المثالية...',
      metaDescEn: 'Expert guide on choosing the perfect color palette for your home. Tips from Dubai\'s leading interior designers at Mouhajer Design.',
      metaDescAr: 'دليل الخبراء لاختيار لوحة الألوان المثالية لمنزلك. نصائح من كبار مصممي الديكور الداخلي في دبي في موهاجر للتصميم.'
    },
    {
      titleEn: 'Maximizing Small Spaces: Design Tips for Compact Living',
      titleAr: 'تعظيم المساحات الصغيرة: نصائح التصميم للعيش المدمج',
      slugEn: 'maximizing-small-spaces-design-tips',
      slugAr: 'maximizing-small-spaces-design-tips-ar',
      excerptEn: 'Transform your small apartment or room into a spacious, functional, and beautiful living area with these expert tips.',
      excerptAr: 'حول شقتك الصغيرة أو غرفتك إلى منطقة معيشة واسعة وعملية وجميلة مع هذه النصائح الخبيرة.',
      contentEn: 'Living in a small space doesn\'t mean compromising on style or functionality. Here are our top tips...',
      contentAr: 'العيش في مساحة صغيرة لا يعني التنازل عن الأناقة أو الوظائف. إليك أهم نصائحنا...',
      metaDescEn: 'Expert tips for maximizing small spaces in Dubai apartments. Smart storage solutions and design tricks from Mouhajer Interior Design.',
      metaDescAr: 'نصائح الخبراء لتعظيم المساحات الصغيرة في شقق دبي. حلول التخزين الذكية وحيل التصميم من موهاجر للتصميم الداخلي.'
    }
  ];

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        titleEn: post.titleEn,
        titleAr: post.titleAr,
        slugEn: post.slugEn,
        slugAr: post.slugAr,
        excerptEn: post.excerptEn,
        excerptAr: post.excerptAr,
        contentEn: post.contentEn,
        contentAr: post.contentAr,
        featuredImage: media.getRandomImage(),
        category: 'Design Tips',
        tags: ['interior design', 'dubai', 'design tips', 'luxury', 'home decor'],
        author: 'Mouhajer Design Team',
        featured: Math.random() > 0.5,
        status: 'published',
        publishedAt: new Date()
      }
    });
  }

  console.log('✅ Blog posts created successfully');
}

async function main() {
  console.log('🚀 Starting CMS content seeding...\n');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    // console.log('🧹 Cleaning existing data...');
    // await prisma.pageBlock.deleteMany({});
    // await prisma.page.deleteMany({});
    // await prisma.testimonial.deleteMany({});
    // await prisma.blogPost.deleteMany({});
    // console.log('✅ Existing data cleaned\n');
    console.log('🔍 Keeping existing data and adding new content...\n');

    // Get available media
    const media = await getAvailableMedia();

    if (media.images.length === 0) {
      console.log('⚠️  Warning: No media found in database. Using placeholder images.');
      console.log('💡 Tip: Upload some images to the Media Library first for better results.\n');
    }

    // Seed content - only seed what doesn't exist
    const existingHomePage = await prisma.page.findFirst({
      where: { slugEn: 'home' }
    });

    if (!existingHomePage) {
      await seedHomePage(media);
      await seedServicePages(media);
      await seedAboutPage(media);
      await seedContactPage(media);
      await seedPortfolioPage(media);
    } else {
      console.log('✅ Pages already exist, skipping page creation\n');
    }

    await seedTestimonials();
    await seedBlogPosts(media);

    console.log('\n✨ CMS seeding completed successfully!');
    console.log('📊 Summary:');

    const pages = await prisma.page.count();
    const blocks = await prisma.pageBlock.count();
    const testimonials = await prisma.testimonial.count();
    const posts = await prisma.blogPost.count();

    console.log(`  - ${pages} Pages created`);
    console.log(`  - ${blocks} Content blocks added`);
    console.log(`  - ${testimonials} Testimonials added`);
    console.log(`  - ${posts} Blog posts created`);

    console.log('\n🎉 Your CMS is now populated with high-quality content!');
    console.log('🔗 Visit your CMS to view and edit the content.');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding script
main();