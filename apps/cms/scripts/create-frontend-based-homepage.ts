/**
 * Create Frontend-Based Homepage
 * This script creates blueprints based on frontend components and assembles a perfect homepage
 */

import { prisma } from '../src/lib/prisma';

async function getMediaLibrary() {
  try {
    const media = await prisma.media.findMany();
    const images = media.filter(m => m.type === 'image');

    return {
      getRandomImage: () => images[Math.floor(Math.random() * images.length)]?.url || '/images/placeholder.jpg',
      getRandomImages: (count: number) => {
        const shuffled = [...images].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(img => ({ url: img.url, alt: img.title || 'Mouhajer Interior Design' }));
      },
      getImagesByTag: (tag: string) => images.filter(m => m.tags?.includes(tag))
    };
  } catch (error) {
    console.log('📌 No media library found, using placeholder images');
    return {
      getRandomImage: () => '/images/hero-bg.jpg',
      getRandomImages: (count: number) => Array(count).fill(null).map((_, i) => ({
        url: `/images/project-${i + 1}.jpg`,
        alt: 'Mouhajer Interior Design'
      })),
      getImagesByTag: (tag: string) => []
    };
  }
}

async function createOrUpdateBlueprints() {
  console.log('🎨 Creating/Updating blueprints based on frontend components...\n');

  const blueprints = [
    {
      name: 'hero_banner',
      displayName: 'Hero Banner',
      description: 'Main banner with background image/video and text overlay',
      blueprintType: 'COMPONENT' as const,
      category: 'headers',
      icon: '🏠',
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true, bilingual: true },
        { name: 'subtitle', type: 'text', label: 'Subtitle', required: false, bilingual: true },
        { name: 'backgroundImage', type: 'image', label: 'Background Image', required: false },
        { name: 'backgroundVideo', type: 'video', label: 'Background Video', required: false },
        { name: 'ctaText', type: 'text', label: 'CTA Text', required: false, bilingual: true },
        { name: 'ctaLink', type: 'url', label: 'CTA Link', required: false }
      ]
    },
    {
      name: 'animated_headline',
      displayName: 'Animated Headline',
      description: 'Scrolling animated text banner',
      blueprintType: 'COMPONENT' as const,
      category: 'decorative',
      icon: '✨',
      fields: [
        { name: 'text', type: 'text', label: 'Text', required: true, bilingual: true },
        { name: 'speed', type: 'number', label: 'Animation Speed', defaultValue: 50 },
        { name: 'blackened', type: 'boolean', label: 'Dark Background', defaultValue: false }
      ]
    },
    {
      name: 'company_description_home',
      displayName: 'Company Description',
      description: 'About section with carousel for homepage',
      blueprintType: 'COMPONENT' as const,
      category: 'content',
      icon: '🏢',
      fields: [
        { name: 'title', type: 'text', label: 'Title', required: true, bilingual: true },
        { name: 'subtitle', type: 'text', label: 'Subtitle', bilingual: true },
        { name: 'description', type: 'textarea', label: 'Description', required: true, bilingual: true },
        { name: 'yearsOfExperience', type: 'number', label: 'Years of Experience', defaultValue: 14 },
        { name: 'experienceLabel', type: 'text', label: 'Experience Label', bilingual: true },
        { name: 'imageCount', type: 'number', label: 'Number of Images', defaultValue: 4 },
        { name: 'showCta', type: 'boolean', label: 'Show CTA Button', defaultValue: true },
        { name: 'ctaText', type: 'text', label: 'CTA Text', bilingual: true },
        { name: 'ctaLink', type: 'url', label: 'CTA Link' }
      ]
    },
    {
      name: 'services_showcase',
      displayName: 'Services Showcase',
      description: 'Interactive services swiper/carousel',
      blueprintType: 'COMPONENT' as const,
      category: 'content',
      icon: '🛠️',
      fields: [
        { name: 'title', type: 'text', label: 'Section Title', bilingual: true },
        { name: 'services', type: 'array', label: 'Services', arrayOf: {
          title: { type: 'text', bilingual: true },
          description: { type: 'textarea', bilingual: true },
          image: { type: 'image' },
          icon: { type: 'icon' }
        }}
      ]
    },
    {
      name: 'portfolio_display_home',
      displayName: 'Portfolio Display',
      description: 'Portfolio showcase for homepage',
      blueprintType: 'COMPONENT' as const,
      category: 'portfolio',
      icon: '🎨',
      fields: [
        { name: 'headline', type: 'text', label: 'Headline', bilingual: true },
        { name: 'sectionTitle', type: 'text', label: 'Section Title', bilingual: true },
        { name: 'description', type: 'textarea', label: 'Description', bilingual: true },
        { name: 'projectCount', type: 'text', label: 'Project Count Text', bilingual: true },
        { name: 'showFeatured', type: 'boolean', label: 'Show Featured Only', defaultValue: true },
        { name: 'maxItems', type: 'number', label: 'Maximum Items', defaultValue: 6 },
        { name: 'showCta', type: 'boolean', label: 'Show CTA', defaultValue: true },
        { name: 'ctaText', type: 'text', label: 'CTA Text', bilingual: true },
        { name: 'ctaLink', type: 'url', label: 'CTA Link' },
        { name: 'projectsLinkText', type: 'text', label: 'Projects Link Text', bilingual: true },
        { name: 'projectsLink', type: 'url', label: 'Projects Link' }
      ]
    },
    {
      name: 'featured_in',
      displayName: 'Featured In',
      description: 'Display logos of media features or partners',
      blueprintType: 'COMPONENT' as const,
      category: 'social_proof',
      icon: '📰',
      fields: [
        { name: 'title', type: 'text', label: 'Title', bilingual: true },
        { name: 'logos', type: 'array', label: 'Logos', arrayOf: {
          url: { type: 'image' },
          alt: { type: 'text' },
          link: { type: 'url' }
        }}
      ]
    },
    {
      name: 'clients_section',
      displayName: 'Our Clients',
      description: 'Display client logos and testimonials',
      blueprintType: 'COMPONENT' as const,
      category: 'social_proof',
      icon: '🤝',
      fields: [
        { name: 'title', type: 'text', label: 'Title', bilingual: true },
        { name: 'subtitle', type: 'text', label: 'Subtitle', bilingual: true },
        { name: 'showLogos', type: 'boolean', label: 'Show Client Logos', defaultValue: true },
        { name: 'showTestimonials', type: 'boolean', label: 'Show Testimonials', defaultValue: true }
      ]
    },
    {
      name: 'awards_section',
      displayName: 'Awards & Recognition',
      description: 'Showcase awards and achievements',
      blueprintType: 'COMPONENT' as const,
      category: 'social_proof',
      icon: '🏆',
      fields: [
        { name: 'title', type: 'text', label: 'Title', bilingual: true },
        { name: 'subtitle', type: 'text', label: 'Subtitle', bilingual: true },
        { name: 'awards', type: 'array', label: 'Awards', arrayOf: {
          title: { type: 'text', bilingual: true },
          year: { type: 'number' },
          organization: { type: 'text', bilingual: true },
          image: { type: 'image' }
        }}
      ]
    },
    {
      name: 'process_section',
      displayName: 'How We Work',
      description: 'Process/methodology showcase',
      blueprintType: 'COMPONENT' as const,
      category: 'content',
      icon: '⚙️',
      fields: [
        { name: 'title', type: 'text', label: 'Title', bilingual: true },
        { name: 'mainImage', type: 'image', label: 'Main Image' },
        { name: 'smallImage', type: 'image', label: 'Small Image' },
        { name: 'steps', type: 'array', label: 'Process Steps', arrayOf: {
          title: { type: 'text', bilingual: true },
          description: { type: 'textarea', bilingual: true }
        }}
      ]
    },
    {
      name: 'stats_section',
      displayName: 'Key Facts/Statistics',
      description: 'Display key numbers and statistics',
      blueprintType: 'COMPONENT' as const,
      category: 'content',
      icon: '📊',
      fields: [
        { name: 'title', type: 'text', label: 'Title', bilingual: true },
        { name: 'stats', type: 'array', label: 'Statistics', arrayOf: {
          number: { type: 'text' },
          label: { type: 'text', bilingual: true },
          icon: { type: 'icon' }
        }}
      ]
    },
    {
      name: 'blog_section',
      displayName: 'Featured Blogs',
      description: 'Display featured blog posts',
      blueprintType: 'COMPONENT' as const,
      category: 'content',
      icon: '📝',
      fields: [
        { name: 'title', type: 'text', label: 'Title', bilingual: true },
        { name: 'maxPosts', type: 'number', label: 'Maximum Posts', defaultValue: 3 },
        { name: 'showFeaturedOnly', type: 'boolean', label: 'Featured Only', defaultValue: true }
      ]
    },
    {
      name: 'instagram_section',
      displayName: 'Instagram Feed',
      description: 'Display Instagram posts or gallery',
      blueprintType: 'COMPONENT' as const,
      category: 'social',
      icon: '📸',
      fields: [
        { name: 'title', type: 'text', label: 'Title', bilingual: true },
        { name: 'username', type: 'text', label: 'Instagram Username' },
        { name: 'maxPosts', type: 'number', label: 'Maximum Posts', defaultValue: 6 }
      ]
    },
    {
      name: 'contact_form',
      displayName: 'Contact Form',
      description: 'Contact form section',
      blueprintType: 'COMPONENT' as const,
      category: 'forms',
      icon: '📧',
      fields: [
        { name: 'title', type: 'text', label: 'Title', bilingual: true },
        { name: 'subtitle', type: 'text', label: 'Subtitle', bilingual: true },
        { name: 'showPhone', type: 'boolean', label: 'Show Phone', defaultValue: true },
        { name: 'showEmail', type: 'boolean', label: 'Show Email', defaultValue: true },
        { name: 'showAddress', type: 'boolean', label: 'Show Address', defaultValue: true }
      ]
    },
    {
      name: 'separator',
      displayName: 'Section Separator',
      description: 'Visual separator between sections',
      blueprintType: 'COMPONENT' as const,
      category: 'decorative',
      icon: '➖',
      fields: [
        { name: 'style', type: 'select', label: 'Style', options: ['line', 'dots', 'wave', 'custom'] },
        { name: 'height', type: 'number', label: 'Height (px)', defaultValue: 1 }
      ]
    }
  ];

  for (const blueprint of blueprints) {
    const existing = await prisma.contentBlueprint.findUnique({
      where: { name: blueprint.name }
    });

    if (!existing) {
      await prisma.contentBlueprint.create({
        data: {
          ...blueprint,
          allowMultiple: true,
          isSystem: false,
          thumbnailUrl: null,
          fields: blueprint.fields as any
        }
      });
      console.log(`✅ Created blueprint: ${blueprint.displayName}`);
    } else {
      console.log(`📌 Blueprint already exists: ${blueprint.displayName}`);
    }
  }
}

async function createPerfectHomepage() {
  console.log('\n🏠 Creating perfect homepage with high-quality content...\n');

  const media = await getMediaLibrary();

  // Check if homepage already exists
  let homepage = await prisma.page.findFirst({
    where: { slugEn: 'home' }
  });

  if (homepage) {
    console.log('📌 Homepage already exists, updating blocks...');
    // Clear existing blocks
    await prisma.pageBlock.deleteMany({
      where: { pageId: homepage.id }
    });
  } else {
    // Create new homepage
    homepage = await prisma.page.create({
      data: {
        titleEn: 'Home',
        titleAr: 'الرئيسية',
        slugEn: 'home',
        slugAr: 'home-ar',
        descriptionEn: 'Welcome to Mouhajer Interior Design - Dubai\'s Premier Interior Design Studio',
        descriptionAr: 'مرحباً بكم في موهاجر للتصميم الداخلي - استوديو التصميم الداخلي الرائد في دبي',
        status: 'published',
        featured: true,
        seoMetaTitleEn: 'Mouhajer Interior Design | Luxury Interior Design Dubai | Transform Your Space',
        seoMetaTitleAr: 'موهاجر للتصميم الداخلي | تصميم داخلي فاخر دبي | حول مساحتك',
        seoMetaDescEn: 'Award-winning interior design studio in Dubai. Specializing in luxury residential, commercial & hospitality projects. 14+ years of excellence. Get your free consultation today.',
        seoMetaDescAr: 'استوديو تصميم داخلي حائز على جوائز في دبي. متخصصون في المشاريع السكنية والتجارية والضيافة الفاخرة. أكثر من 14 عامًا من التميز. احصل على استشارتك المجانية اليوم.',
        seoKeywords: ['interior design dubai', 'luxury interior design', 'mouhajer design', 'dubai designers', 'تصميم داخلي دبي']
      }
    });
  }

  // Create homepage blocks with perfect content
  const blocks = [
    // 1. Hero Banner
    {
      type: 'hero_banner',
      order: 0,
      data: {
        title: {
          en: 'Transform Your Space Into Art',
          ar: 'حول مساحتك إلى عمل فني'
        },
        subtitle: {
          en: 'Award-winning interior design studio creating exceptional spaces across Dubai & UAE',
          ar: 'استوديو تصميم داخلي حائز على جوائز ينشئ مساحات استثنائية في دبي والإمارات'
        },
        backgroundImage: media.getRandomImage(),
        ctaText: {
          en: 'Explore Our Work',
          ar: 'استكشف أعمالنا'
        },
        ctaLink: '/portfolio'
      }
    },

    // 2. Animated Headline
    {
      type: 'animated_headline',
      order: 1,
      data: {
        text: {
          en: 'LUXURY • ELEGANCE • INNOVATION • EXCELLENCE • ',
          ar: 'فخامة • أناقة • ابتكار • تميز • '
        },
        speed: 50,
        blackened: false
      }
    },

    // 3. Company Description
    {
      type: 'company_description_home',
      order: 2,
      data: {
        title: {
          en: 'Crafting Timeless Interiors Since 2010',
          ar: 'نصنع ديكورات خالدة منذ 2010'
        },
        subtitle: {
          en: 'Where Vision Meets Reality',
          ar: 'حيث تلتقي الرؤية بالواقع'
        },
        description: {
          en: 'With over 14 years of experience, Mouhajer Interior Design has established itself as Dubai\'s leading interior design studio. We transform spaces into extraordinary experiences, combining innovative design with unparalleled craftsmanship. Our team of expert designers brings your vision to life with attention to every detail, creating interiors that are not just beautiful, but truly exceptional.',
          ar: 'مع أكثر من 14 عامًا من الخبرة، أسست موهاجر للتصميم الداخلي نفسها كاستوديو التصميم الداخلي الرائد في دبي. نحول المساحات إلى تجارب استثنائية، نجمع بين التصميم المبتكر والحرفية التي لا مثيل لها. يقوم فريقنا من المصممين الخبراء بإحياء رؤيتك مع الاهتمام بكل التفاصيل، لخلق ديكورات داخلية ليست جميلة فحسب، بل استثنائية حقًا.'
        },
        yearsOfExperience: 14,
        experienceLabel: {
          en: 'Years of Excellence',
          ar: 'عاماً من التميز'
        },
        imageCount: 4,
        showCta: true,
        ctaText: {
          en: 'Learn More About Us',
          ar: 'تعرف أكثر علينا'
        },
        ctaLink: '/about-us'
      }
    },

    // 4. Key Statistics
    {
      type: 'stats_section',
      order: 3,
      data: {
        title: {
          en: 'Our Impact in Numbers',
          ar: 'تأثيرنا بالأرقام'
        },
        stats: [
          {
            number: '500+',
            label: {
              en: 'Projects Completed',
              ar: 'مشروع مكتمل'
            }
          },
          {
            number: '450+',
            label: {
              en: 'Happy Clients',
              ar: 'عميل سعيد'
            }
          },
          {
            number: '25+',
            label: {
              en: 'Awards Won',
              ar: 'جائزة حصلنا عليها'
            }
          },
          {
            number: '14+',
            label: {
              en: 'Years Experience',
              ar: 'سنوات الخبرة'
            }
          }
        ]
      }
    },

    // 5. Services Showcase
    {
      type: 'services_showcase',
      order: 4,
      data: {
        title: {
          en: 'Our Expertise',
          ar: 'خبراتنا'
        },
        services: [
          {
            title: {
              en: 'Residential Design',
              ar: 'التصميم السكني'
            },
            description: {
              en: 'Transform your home into a luxurious sanctuary that reflects your unique style and enhances your lifestyle.',
              ar: 'حول منزلك إلى ملاذ فاخر يعكس أسلوبك الفريد ويعزز نمط حياتك.'
            },
            image: media.getRandomImage(),
            icon: '🏠'
          },
          {
            title: {
              en: 'Commercial Spaces',
              ar: 'المساحات التجارية'
            },
            description: {
              en: 'Create inspiring workspaces that boost productivity, impress clients, and reflect your brand identity.',
              ar: 'أنشئ مساحات عمل ملهمة تعزز الإنتاجية وتبهر العملاء وتعكس هوية علامتك التجارية.'
            },
            image: media.getRandomImage(),
            icon: '🏢'
          },
          {
            title: {
              en: 'Hospitality Design',
              ar: 'تصميم الضيافة'
            },
            description: {
              en: 'Design memorable experiences for hotels, restaurants, and entertainment venues that captivate guests.',
              ar: 'صمم تجارب لا تُنسى للفنادق والمطاعم وأماكن الترفيه التي تأسر الضيوف.'
            },
            image: media.getRandomImage(),
            icon: '🏨'
          },
          {
            title: {
              en: 'Retail Design',
              ar: 'تصميم المتاجر'
            },
            description: {
              en: 'Craft engaging retail environments that enhance customer experience and drive sales.',
              ar: 'اصنع بيئات تجارية جذابة تعزز تجربة العملاء وتزيد المبيعات.'
            },
            image: media.getRandomImage(),
            icon: '🛍️'
          }
        ]
      }
    },

    // 6. Portfolio Display
    {
      type: 'portfolio_display_home',
      order: 5,
      data: {
        headline: {
          en: 'Portfolio',
          ar: 'الأعمال'
        },
        sectionTitle: {
          en: 'Our Latest Projects',
          ar: 'أحدث مشاريعنا'
        },
        description: {
          en: 'Explore our portfolio of exceptional interior design projects that showcase our expertise and creativity.',
          ar: 'استكشف محفظة مشاريع التصميم الداخلي الاستثنائية التي تعرض خبرتنا وإبداعنا.'
        },
        projectCount: {
          en: '+500 Projects',
          ar: '+500 مشروع'
        },
        showFeatured: true,
        maxItems: 6,
        showCta: true,
        ctaText: {
          en: 'View All Projects',
          ar: 'عرض جميع المشاريع'
        },
        ctaLink: '/portfolio',
        projectsLinkText: {
          en: 'Explore Portfolio',
          ar: 'استكشف المعرض'
        },
        projectsLink: '/portfolio'
      }
    },

    // 7. Featured In
    {
      type: 'featured_in',
      order: 6,
      data: {
        title: {
          en: 'As Featured In',
          ar: 'كما ظهرنا في'
        },
        logos: media.getRandomImages(8)
      }
    },

    // 8. How We Work Process
    {
      type: 'process_section',
      order: 7,
      data: {
        title: {
          en: 'Our Process',
          ar: 'عمليتنا'
        },
        mainImage: media.getRandomImage(),
        smallImage: media.getRandomImage(),
        steps: [
          {
            title: {
              en: 'Discovery & Consultation',
              ar: 'الاكتشاف والاستشارة'
            },
            description: {
              en: 'We begin by understanding your vision, requirements, and lifestyle to create a design that perfectly matches your needs.',
              ar: 'نبدأ بفهم رؤيتك ومتطلباتك ونمط حياتك لإنشاء تصميم يتناسب تمامًا مع احتياجاتك.'
            }
          },
          {
            title: {
              en: 'Concept Development',
              ar: 'تطوير المفهوم'
            },
            description: {
              en: 'Our designers create detailed concepts, mood boards, and 3D visualizations to bring your vision to life.',
              ar: 'يقوم مصممونا بإنشاء مفاهيم مفصلة ولوحات مزاجية وتصورات ثلاثية الأبعاد لإحياء رؤيتك.'
            }
          },
          {
            title: {
              en: 'Design Refinement',
              ar: 'تحسين التصميم'
            },
            description: {
              en: 'We refine every detail, select materials, and finalize the design to ensure perfection in every aspect.',
              ar: 'نحسن كل التفاصيل ونختار المواد ونضع اللمسات الأخيرة على التصميم لضمان الكمال في كل جانب.'
            }
          },
          {
            title: {
              en: 'Implementation',
              ar: 'التنفيذ'
            },
            description: {
              en: 'Our expert team manages the entire implementation process, ensuring quality and timely delivery.',
              ar: 'يدير فريقنا الخبير عملية التنفيذ بأكملها، مما يضمن الجودة والتسليم في الوقت المحدد.'
            }
          }
        ]
      }
    },

    // 9. Awards Section
    {
      type: 'awards_section',
      order: 8,
      data: {
        title: {
          en: 'Awards & Recognition',
          ar: 'الجوائز والتقدير'
        },
        subtitle: {
          en: 'Excellence recognized by industry leaders',
          ar: 'التميز المعترف به من قادة الصناعة'
        },
        awards: [
          {
            title: {
              en: 'Best Interior Designer UAE',
              ar: 'أفضل مصمم داخلي في الإمارات'
            },
            year: 2023,
            organization: {
              en: 'Design Excellence Awards',
              ar: 'جوائز التميز في التصميم'
            },
            image: media.getRandomImage()
          },
          {
            title: {
              en: 'Luxury Design Award',
              ar: 'جائزة التصميم الفاخر'
            },
            year: 2022,
            organization: {
              en: 'International Design Council',
              ar: 'مجلس التصميم الدولي'
            },
            image: media.getRandomImage()
          },
          {
            title: {
              en: 'Innovation in Design',
              ar: 'الابتكار في التصميم'
            },
            year: 2022,
            organization: {
              en: 'Dubai Design Week',
              ar: 'أسبوع دبي للتصميم'
            },
            image: media.getRandomImage()
          }
        ]
      }
    },

    // 10. Clients Section
    {
      type: 'clients_section',
      order: 9,
      data: {
        title: {
          en: 'Our Valued Clients',
          ar: 'عملاؤنا الكرام'
        },
        subtitle: {
          en: 'Trusted by leading brands and individuals',
          ar: 'موثوق به من قبل العلامات التجارية الرائدة والأفراد'
        },
        showLogos: true,
        showTestimonials: true
      }
    },

    // 11. Blog Section
    {
      type: 'blog_section',
      order: 10,
      data: {
        title: {
          en: 'Latest Insights',
          ar: 'أحدث الرؤى'
        },
        maxPosts: 3,
        showFeaturedOnly: true
      }
    },

    // 12. Instagram Section
    {
      type: 'instagram_section',
      order: 11,
      data: {
        title: {
          en: 'Follow Our Journey',
          ar: 'تابع رحلتنا'
        },
        username: '@mouhajerdesign',
        maxPosts: 6
      }
    },

    // 13. Contact Form
    {
      type: 'contact_form',
      order: 12,
      data: {
        title: {
          en: 'Start Your Project Today',
          ar: 'ابدأ مشروعك اليوم'
        },
        subtitle: {
          en: 'Get a free consultation and transform your space',
          ar: 'احصل على استشارة مجانية وحول مساحتك'
        },
        showPhone: true,
        showEmail: true,
        showAddress: true
      }
    }
  ];

  // Create all blocks for the homepage
  for (const block of blocks) {
    await prisma.pageBlock.create({
      data: {
        pageId: homepage.id,
        ...block
      }
    });
    console.log(`✅ Added block: ${block.type}`);
  }

  console.log('\n🎉 Homepage created successfully with all blocks!');
  return homepage;
}

async function main() {
  console.log('🚀 Starting Frontend-Based Homepage Creation\n');
  console.log('=' .repeat(50));

  try {
    // Step 1: Create/Update Blueprints
    await createOrUpdateBlueprints();

    // Step 2: Create Perfect Homepage
    const homepage = await createPerfectHomepage();

    console.log('\n' + '='.repeat(50));
    console.log('✨ Success! Your homepage is ready at:');
    console.log(`   📱 Frontend: http://localhost:3001/`);
    console.log(`   ⚙️  CMS Edit: http://localhost:3000/pages/${homepage.id}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();