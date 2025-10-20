const fetch = require('node-fetch');

const CMS_API_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3010/api/graphql';

// High-quality content for Mouhajer International Design
const seedData = {
  // Settings
  settings: {
    siteNameEn: "Mouhajer International Design",
    siteNameAr: "موهاجر للتصميم الدولي",
    siteDescriptionEn: "Premier luxury interior design and contracting company in Dubai, transforming spaces with award-winning excellence for over 20 years.",
    siteDescriptionAr: "شركة رائدة في التصميم الداخلي الفاخر والمقاولات في دبي، نحول المساحات بتميز حائز على جوائز لأكثر من 20 عاماً.",
    contactPhone: "+971 4 123 4567",
    contactEmail: "info@mouhajer.com",
    logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=80&fit=crop",
    seoMetaTitleEn: "Mouhajer International Design - Luxury Interior Design Dubai",
    seoMetaTitleAr: "موهاجر للتصميم الدولي - التصميم الداخلي الفاخر دبي",
    seoMetaDescriptionEn: "Transform your space with Dubai's premier interior design company. Award-winning luxury designs for villas, offices, and commercial spaces.",
    seoMetaDescriptionAr: "حول مساحتك مع شركة التصميم الداخلي الرائدة في دبي. تصاميم فاخرة حائزة على جوائز للفلل والمكاتب والمساحات التجارية.",
    seoKeywords: ["interior design dubai", "luxury interior design", "villa design", "office design", "التصميم الداخلي دبي", "التصميم الفاخر"]
  },

  // Projects
  projects: [
    {
      titleEn: "Luxury Villa - Emirates Hills",
      titleAr: "فيلا فاخرة - تلال الإمارات",
      descriptionEn: "A stunning contemporary villa featuring bespoke furniture, marble finishes, and panoramic city views. This 8-bedroom masterpiece showcases our expertise in luxury residential design.",
      descriptionAr: "فيلا معاصرة مذهلة تتميز بأثاث مخصص ولمسات رخامية ومناظر بانورامية للمدينة. تعرض هذه التحفة المكونة من 8 غرف نوم خبرتنا في التصميم السكني الفاخر.",
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
      ],
      category: "Residential",
      featured: true,
      status: "published"
    },
    {
      titleEn: "Corporate Headquarters - DIFC",
      titleAr: "المقر الرئيسي للشركة - مركز دبي المالي العالمي",
      descriptionEn: "Modern corporate office design featuring smart technology integration, sustainable materials, and flexible workspaces for a leading financial institution.",
      descriptionAr: "تصميم مكتب شركة حديث يتميز بتكامل التكنولوجيا الذكية والمواد المستدامة ومساحات العمل المرنة لمؤسسة مالية رائدة.",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop"
      ],
      category: "Commercial",
      featured: true,
      status: "published"
    },
    {
      titleEn: "Boutique Hotel - Jumeirah",
      titleAr: "فندق بوتيك - جميرا",
      descriptionEn: "Elegant boutique hotel interior combining traditional Arabian elements with contemporary luxury. Features custom lighting, artisanal furniture, and premium materials.",
      descriptionAr: "تصميم داخلي أنيق لفندق بوتيك يجمع بين العناصر العربية التقليدية والفخامة المعاصرة. يتميز بإضاءة مخصصة وأثاث حرفي ومواد فاخرة.",
      images: [
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"
      ],
      category: "Hospitality",
      featured: true,
      status: "published"
    }
  ],

  // Blog Posts
  blogPosts: [
    {
      titleEn: "2024 Interior Design Trends: What's Hot in Dubai",
      titleAr: "اتجاهات التصميم الداخلي 2024: ما هو رائج في دبي",
      slugEn: "2024-interior-design-trends-dubai",
      slugAr: "اتجاهات-التصميم-الداخلي-2024-دبي",
      excerptEn: "Discover the latest interior design trends shaping Dubai's luxury spaces in 2024, from sustainable materials to smart home integration.",
      excerptAr: "اكتشف أحدث اتجاهات التصميم الداخلي التي تشكل المساحات الفاخرة في دبي في 2024، من المواد المستدامة إلى تكامل المنزل الذكي.",
      contentEn: "The interior design landscape in Dubai continues to evolve, blending traditional Arabian aesthetics with cutting-edge contemporary design...",
      contentAr: "يستمر مشهد التصميم الداخلي في دبي في التطور، مزج الجماليات العربية التقليدية مع التصميم المعاصر المتطور...",
      featuredImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      category: "Trends",
      tags: ["trends", "dubai", "luxury", "2024"],
      author: "Mouhajer Design Team",
      publishedAt: new Date().toISOString(),
      featured: true,
      status: "published"
    },
    {
      titleEn: "Sustainable Luxury: Eco-Friendly Interior Design",
      titleAr: "الفخامة المستدامة: التصميم الداخلي الصديق للبيئة",
      slugEn: "sustainable-luxury-eco-friendly-design",
      slugAr: "الفخامة-المستدامة-التصميم-الصديق-للبيئة",
      excerptEn: "Learn how luxury and sustainability can coexist in modern interior design, featuring eco-friendly materials and energy-efficient solutions.",
      excerptAr: "تعلم كيف يمكن للفخامة والاستدامة أن تتعايش في التصميم الداخلي الحديث، مع المواد الصديقة للبيئة والحلول الموفرة للطاقة.",
      contentEn: "Sustainable luxury is no longer an oxymoron. Today's discerning clients demand both opulence and environmental responsibility...",
      contentAr: "لم تعد الفخامة المستدامة تناقضاً في المصطلحات. عملاء اليوم المميزون يطالبون بالثراء والمسؤولية البيئية معاً...",
      featuredImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      category: "Sustainability",
      tags: ["sustainability", "luxury", "eco-friendly", "green design"],
      author: "Sarah Al-Mansouri",
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      featured: true,
      status: "published"
    }
  ],

  // Home Page Blocks
  homePageBlocks: [
    {
      type: "hero_banner",
      order: 1,
      data: {
        title: {
          en: "Welcome to Mouhajer International Design",
          ar: "مرحباً بكم في موهاجر للتصميم الدولي"
        },
        subtitle: {
          en: "Transforming Spaces, Creating Dreams",
          ar: "نحول المساحات، نصنع الأحلام"
        },
        backgroundImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop",
        ctaText: {
          en: "Explore Our Work",
          ar: "استكشف أعمالنا"
        },
        ctaLink: "/our-projects"
      }
    },
    {
      type: "animated_headline",
      order: 2,
      data: {
        text: {
          en: "Award-Winning Design Excellence",
          ar: "تميز في التصميم حائز على جوائز"
        }
      }
    },
    {
      type: "text_content",
      order: 3,
      data: {
        title: {
          en: "Dubai's Premier Interior Design Company",
          ar: "شركة التصميم الداخلي الرائدة في دبي"
        },
        subtitle: {
          en: "Over 20 Years of Excellence",
          ar: "أكثر من 20 عاماً من التميز"
        },
        description: {
          en: "Mouhajer International Design has been at the forefront of luxury interior design in Dubai and the UAE. Our award-winning team creates bespoke spaces that reflect our clients' unique vision while maintaining the highest standards of craftsmanship and innovation.",
          ar: "كانت موهاجر للتصميم الدولي في المقدمة في التصميم الداخلي الفاخر في دبي والإمارات العربية المتحدة. فريقنا الحائز على جوائز ينشئ مساحات مخصصة تعكس رؤية عملائنا الفريدة مع الحفاظ على أعلى معايير الحرفية والابتكار."
        },
        backgroundImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop"
      }
    },
    {
      type: "about_section",
      order: 4,
      data: {
        title: {
          en: "About Mouhajer International Design",
          ar: "حول موهاجر للتصميم الدولي"
        },
        subtitle: {
          en: "Crafting Exceptional Spaces Since 2003",
          ar: "نصنع مساحات استثنائية منذ 2003"
        },
        description: {
          en: "We are passionate about creating spaces that inspire and delight. Our comprehensive approach combines innovative design, premium materials, and meticulous attention to detail to deliver projects that exceed expectations.",
          ar: "نحن متحمسون لإنشاء مساحات تلهم وتسعد. نهجنا الشامل يجمع بين التصميم المبتكر والمواد الفاخرة والاهتمام الدقيق بالتفاصيل لتقديم مشاريع تتجاوز التوقعات."
        },
        yearsOfExperience: "22",
        experienceLabel: {
          en: "Years of Excellence",
          ar: "عاماً من التميز"
        },
        features: [
          {
            title: { en: "Bespoke Design", ar: "تصميم مخصص" },
            description: { en: "Tailored solutions for every client", ar: "حلول مخصصة لكل عميل" }
          },
          {
            title: { en: "Premium Materials", ar: "مواد فاخرة" },
            description: { en: "Only the finest quality materials", ar: "فقط أجود المواد" }
          },
          {
            title: { en: "Expert Craftsmanship", ar: "حرفية خبيرة" },
            description: { en: "Skilled artisans and contractors", ar: "حرفيون ومقاولون مهرة" }
          }
        ]
      }
    },
    {
      type: "portfolio_section",
      order: 5,
      data: {
        title: {
          en: "Featured Projects",
          ar: "المشاريع المميزة"
        }
      }
    },
    {
      type: "separator",
      order: 6,
      data: {}
    },
    {
      type: "awards_section",
      order: 7,
      data: {
        title: {
          en: "Awards & Recognition",
          ar: "الجوائز والتقدير"
        }
      }
    },
    {
      type: "blog_section",
      order: 8,
      data: {
        title: {
          en: "Latest Insights",
          ar: "أحدث الرؤى"
        }
      }
    },
    {
      type: "contact_form",
      order: 9,
      data: {
        title: {
          en: "Start Your Project",
          ar: "ابدأ مشروعك"
        },
        subtitle: {
          en: "Let's create something extraordinary together",
          ar: "دعونا ننشئ شيئاً استثنائياً معاً"
        }
      }
    }
  ]
};

// GraphQL mutations
const mutations = {
  updateSettings: `
    mutation UpdateSettings($input: UpdateSettingsInput!) {
      updateSettings(input: $input) {
        id
        siteNameEn
        siteNameAr
      }
    }
  `,
  
  createProject: `
    mutation CreateProject($input: CreateProjectInput!) {
      createProject(input: $input) {
        id
        titleEn
        titleAr
      }
    }
  `,
  
  createBlogPost: `
    mutation CreateBlogPost($input: CreateBlogPostInput!) {
      createBlogPost(input: $input) {
        id
        titleEn
        titleAr
      }
    }
  `,
  
  updateHomePage: `
    mutation UpdatePage($id: ID!, $input: UpdatePageInput!) {
      updatePage(id: $id, input: $input) {
        id
        title
        blocks {
          id
          type
          data
          order
        }
      }
    }
  `,
  
  createPage: `
    mutation CreatePage($input: CreatePageInput!) {
      createPage(input: $input) {
        id
        title
        slug
      }
    }
  `
};

async function executeGraphQL(query, variables = {}) {
  try {
    const response = await fetch(CMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Network error:', error);
    return null;
  }
}

async function seedCMS() {
  console.log('🌱 Starting CMS seeding...');

  try {
    // 1. Update Settings
    console.log('📝 Updating settings...');
    await executeGraphQL(mutations.updateSettings, {
      input: seedData.settings
    });

    // 2. Create Projects
    console.log('🏗️ Creating projects...');
    for (const project of seedData.projects) {
      await executeGraphQL(mutations.createProject, {
        input: project
      });
    }

    // 3. Create Blog Posts
    console.log('📰 Creating blog posts...');
    for (const post of seedData.blogPosts) {
      await executeGraphQL(mutations.createBlogPost, {
        input: post
      });
    }

    // 4. Create/Update Home Page
    console.log('🏠 Setting up home page...');
    
    // First try to create the page
    const homePageResult = await executeGraphQL(mutations.createPage, {
      input: {
        title: "Home",
        slug: "home",
        status: "published",
        blocks: seedData.homePageBlocks
      }
    });

    if (!homePageResult) {
      // If creation failed, try to update existing page
      console.log('🔄 Updating existing home page...');
      await executeGraphQL(mutations.updateHomePage, {
        id: "home", // Assuming home page exists
        input: {
          blocks: seedData.homePageBlocks
        }
      });
    }

    console.log('✅ CMS seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Settings updated`);
    console.log(`- ${seedData.projects.length} projects created`);
    console.log(`- ${seedData.blogPosts.length} blog posts created`);
    console.log(`- Home page with ${seedData.homePageBlocks.length} blocks configured`);
    console.log('\n🎉 Your CMS is now populated with high-quality content!');

  } catch (error) {
    console.error('❌ Error seeding CMS:', error);
  }
}

// Run the seeder
if (require.main === module) {
  seedCMS();
}

module.exports = { seedCMS, seedData };