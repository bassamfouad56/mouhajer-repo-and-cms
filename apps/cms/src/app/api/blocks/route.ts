import { NextRequest, NextResponse } from 'next/server';

// Available block types that can be used in the page builder
const blockTypes = [
  {
    id: 'hero_banner',
    name: 'Hero Banner',
    description: 'Main banner with background image/video and text overlay',
    category: 'headers',
    fields: {
      title: { type: 'text', bilingual: true, required: true },
      subtitle: { type: 'text', bilingual: true, required: false },
      backgroundImage: { type: 'image', required: false },
      backgroundVideo: { type: 'video', required: false },
      ctaText: { type: 'text', bilingual: true, required: false },
      ctaLink: { type: 'text', required: false },
      maskLayer: { type: 'boolean', default: true },
      projectsLinkImage: { type: 'image', required: false }
    }
  },
  {
    id: 'featured_in',
    name: 'Featured In',
    description: 'Display company logos and media features',
    category: 'social_proof',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      logos: { type: 'gallery', required: true }
    }
  },
  {
    id: 'our_clients',
    name: 'Our Clients',
    description: 'Client testimonials and logos section',
    category: 'social_proof',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      clients: { type: 'gallery', required: true }
    }
  },
  {
    id: 'animated_headline',
    name: 'Animated Headline',
    description: 'Scrolling animated text banner',
    category: 'decorative',
    fields: {
      text: { type: 'text', bilingual: true, required: true },
      blackened: { type: 'boolean', default: false }
    }
  },
  {
    id: 'about_section',
    name: 'About Section',
    description: 'Company information and description with gallery',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: true },
      subtitle: { type: 'text', bilingual: true, required: false },
      description: { type: 'textarea', bilingual: true, required: true },
      image: { type: 'image', required: false },
      gallery: { type: 'gallery', required: false },
      yearsOfExperience: { type: 'text', default: '22' },
      experienceLabel: { type: 'text', bilingual: true, default: { en: 'Years of Experience', ar: 'عاماً من الخبرة' } },
      features: { type: 'repeater', subFields: { title: { type: 'text', bilingual: true }, description: { type: 'text', bilingual: true } } },
      backgroundImage: { type: 'image', required: false },
      backgroundColor: { type: 'color', default: '#FFFEF5' }
    }
  },
  {
    id: 'contact_form',
    name: 'Contact Form',
    description: 'Contact form with customizable fields',
    category: 'forms',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      description: { type: 'textarea', bilingual: true, required: false },
      fields: {
        type: 'repeater',
        subFields: {
          label: { type: 'text', bilingual: true },
          type: { type: 'select', options: ['text', 'email', 'phone', 'textarea', 'select'] },
          required: { type: 'boolean', default: true },
          placeholder: { type: 'text', bilingual: true }
        }
      }
    }
  },
  {
    id: 'portfolio_section',
    name: 'Portfolio Section',
    description: 'Display projects in grid or carousel layout',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      layout: { type: 'select', options: ['grid', 'carousel'], default: 'grid' },
      featured: { type: 'boolean', default: false },
      maxItems: { type: 'number', default: 6 },
      showCategories: { type: 'boolean', default: true }
    }
  },
  {
    id: 'services_section',
    name: 'Services Section',
    description: 'Display services in grid or list layout',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      layout: { type: 'select', options: ['grid', 'list'], default: 'grid' },
      featured: { type: 'boolean', default: false },
      maxItems: { type: 'number', default: 6 }
    }
  },
  {
    id: 'blog_section',
    name: 'Blog Section',
    description: 'Display blog posts',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      layout: { type: 'select', options: ['grid', 'list'], default: 'grid' },
      featured: { type: 'boolean', default: false },
      published: { type: 'boolean', default: true },
      maxItems: { type: 'number', default: 3 },
      showExcerpt: { type: 'boolean', default: true },
      showAuthor: { type: 'boolean', default: true },
      showDate: { type: 'boolean', default: true },
      showCategory: { type: 'boolean', default: true }
    }
  },
  {
    id: 'benefits_swiper',
    name: 'Benefits Swiper',
    description: 'Interactive benefits showcase with images',
    category: 'interactive',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      benefits: {
        type: 'repeater',
        subFields: {
          title: { type: 'text', bilingual: true },
          description: { type: 'textarea', bilingual: true },
          image: { type: 'image', required: true },
          bigImage: { type: 'image', required: true }
        }
      }
    }
  },
  {
    id: 'accordion_swiper',
    name: 'Accordion Swiper',
    description: 'Accordion with background image',
    category: 'interactive',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      backgroundImage: { type: 'image', required: true },
      items: {
        type: 'repeater',
        subFields: {
          title: { type: 'text', bilingual: true },
          content: { type: 'textarea', bilingual: true }
        }
      }
    }
  },
  {
    id: 'gallery_section',
    name: 'Gallery Section',
    description: 'Image gallery with various layouts',
    category: 'media',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      images: { type: 'gallery', required: true },
      layout: { type: 'select', options: ['grid', 'masonry', 'carousel'], default: 'grid' },
      columns: { type: 'select', options: ['2', '3', '4'], default: '3' }
    }
  },
  {
    id: 'awards_section',
    name: 'Awards Section',
    description: 'Display company awards and achievements',
    category: 'social_proof',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      awards: { type: 'gallery', required: true }
    }
  },
  {
    id: 'press_articles',
    name: 'Press Articles',
    description: 'Media coverage and press mentions',
    category: 'social_proof',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      articles: {
        type: 'repeater',
        subFields: {
          title: { type: 'text', bilingual: true },
          publication: { type: 'text', required: true },
          logo: { type: 'image', required: true },
          link: { type: 'text', required: false },
          date: { type: 'date', required: false }
        }
      }
    }
  },
  {
    id: 'key_facts_section',
    name: 'Key Facts',
    description: 'Display key project facts and details',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      facts: {
        type: 'repeater',
        subFields: {
          subtitle: { type: 'text', bilingual: true, required: true },
          title: { type: 'text', bilingual: true, required: true }
        }
      }
    }
  },
  {
    id: 'vision_mission_section',
    name: 'Vision & Mission',
    description: 'Company vision and mission with highlights',
    category: 'content',
    fields: {
      vision: {
        type: 'group',
        subFields: {
          title: { type: 'text', bilingual: true, required: true },
          subtitle: { type: 'text', bilingual: true, required: true },
          description: { type: 'textarea', bilingual: true, required: true },
          highlights: {
            type: 'repeater',
            subFields: {
              icon: { type: 'select', options: ['Sparkles', 'Target', 'Heart', 'Award'], required: true },
              title: { type: 'text', bilingual: true, required: true },
              text: { type: 'textarea', bilingual: true, required: true }
            }
          }
        }
      },
      mission: {
        type: 'group',
        subFields: {
          title: { type: 'text', bilingual: true, required: true },
          subtitle: { type: 'text', bilingual: true, required: true },
          description: { type: 'textarea', bilingual: true, required: true },
          highlights: {
            type: 'repeater',
            subFields: {
              icon: { type: 'select', options: ['Sparkles', 'Target', 'Heart', 'Award'], required: true },
              title: { type: 'text', bilingual: true, required: true },
              text: { type: 'textarea', bilingual: true, required: true }
            }
          }
        }
      }
    }
  },
  {
    id: 'timeline_section',
    name: 'Timeline',
    description: 'Company history timeline with milestones',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      items: {
        type: 'repeater',
        subFields: {
          year: { type: 'text', required: true },
          title: { type: 'text', bilingual: true, required: true },
          desc: { type: 'textarea', bilingual: true, required: true },
          img: { type: 'image', required: true },
          dateLeft: { type: 'text', required: true },
          dateRight: { type: 'text', required: true }
        }
      }
    }
  },
  {
    id: 'custom_html',
    name: 'Custom HTML',
    description: 'Custom HTML/CSS content block',
    category: 'advanced',
    fields: {
      html: { type: 'code', language: 'html', required: true },
      css: { type: 'code', language: 'css', required: false }
    }
  },
  {
    id: 'text_content',
    name: 'Rich Text Content',
    description: 'Rich text editor with formatting options',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      content: { type: 'richtext', bilingual: true, required: true },
      layout: { type: 'select', options: ['single-column', 'two-columns', 'centered'], default: 'single-column' },
      backgroundColor: { type: 'color', default: '#ffffff' },
      textAlign: { type: 'select', options: ['left', 'center', 'right'], default: 'left' }
    }
  },
  {
    id: 'cta_section',
    name: 'Call to Action',
    description: 'Call to action section with buttons',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: true },
      description: { type: 'textarea', bilingual: true, required: false },
      primaryCta: {
        type: 'group',
        subFields: {
          text: { type: 'text', bilingual: true, required: true },
          link: { type: 'text', required: true },
          style: { type: 'select', options: ['primary', 'secondary', 'outline'], default: 'primary' }
        }
      },
      secondaryCta: {
        type: 'group',
        subFields: {
          text: { type: 'text', bilingual: true, required: false },
          link: { type: 'text', required: false },
          style: { type: 'select', options: ['primary', 'secondary', 'outline'], default: 'secondary' }
        }
      },
      backgroundImage: { type: 'image', required: false },
      backgroundColor: { type: 'color', default: '#f8f9fa' }
    }
  },
  {
    id: 'stats_section',
    name: 'Statistics',
    description: 'Display key statistics and numbers',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      stats: {
        type: 'repeater',
        subFields: {
          label: { type: 'text', bilingual: true, required: true },
          value: { type: 'text', required: true },
          suffix: { type: 'text', required: false },
          icon: { type: 'text', required: false }
        }
      },
      layout: { type: 'select', options: ['horizontal', 'grid'], default: 'grid' },
      backgroundColor: { type: 'color', default: '#ffffff' }
    }
  },
  {
    id: 'faq_section',
    name: 'FAQ Section',
    description: 'Frequently asked questions with accordion',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: true },
      faqs: {
        type: 'repeater',
        subFields: {
          question: { type: 'text', bilingual: true, required: true },
          answer: { type: 'richtext', bilingual: true, required: true }
        }
      }
    }
  },
  {
    id: 'testimonials_section',
    name: 'Testimonials',
    description: 'Customer testimonials and reviews',
    category: 'social_proof',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      testimonials: {
        type: 'repeater',
        subFields: {
          name: { type: 'text', required: true },
          role: { type: 'text', bilingual: true, required: false },
          company: { type: 'text', required: false },
          content: { type: 'textarea', bilingual: true, required: true },
          image: { type: 'image', required: false },
          rating: { type: 'number', min: 1, max: 5, default: 5 }
        }
      },
      layout: { type: 'select', options: ['carousel', 'grid'], default: 'carousel' }
    }
  },
  {
    id: 'video_section',
    name: 'Video Section',
    description: 'Embedded video with optional overlay',
    category: 'media',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      videoUrl: { type: 'text', required: true },
      thumbnail: { type: 'image', required: false },
      autoplay: { type: 'boolean', default: false },
      loop: { type: 'boolean', default: false },
      controls: { type: 'boolean', default: true }
    }
  },
  {
    id: 'team_section',
    name: 'Team Section',
    description: 'Display team members',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      members: {
        type: 'repeater',
        subFields: {
          name: { type: 'text', required: true },
          role: { type: 'text', bilingual: true, required: true },
          bio: { type: 'textarea', bilingual: true, required: false },
          image: { type: 'image', required: true },
          social: {
            type: 'group',
            subFields: {
              linkedin: { type: 'text', required: false },
              twitter: { type: 'text', required: false },
              email: { type: 'email', required: false }
            }
          }
        }
      },
      layout: { type: 'select', options: ['grid', 'list'], default: 'grid' }
    }
  },
  {
    id: 'partners_section',
    name: 'Partners Section',
    description: 'Display business partners and collaborators',
    category: 'social_proof',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      partners: {
        type: 'repeater',
        subFields: {
          name: { type: 'text', required: true },
          logo: { type: 'image', required: true },
          website: { type: 'text', required: false },
          description: { type: 'textarea', bilingual: true, required: false }
        }
      },
      layout: { type: 'select', options: ['grid', 'carousel'], default: 'grid' }
    }
  },
  {
    id: 'company_description_home',
    name: 'Company Description (Homepage)',
    description: 'Company overview section with features and highlights',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: true },
      subtitle: { type: 'text', bilingual: true, required: false },
      description: { type: 'textarea', bilingual: true, required: true },
      image: { type: 'image', required: false },
      features: {
        type: 'repeater',
        subFields: {
          title: { type: 'text', bilingual: true, required: true },
          description: { type: 'text', bilingual: true, required: false }
        }
      },
      gallery: { type: 'gallery', required: false },
      yearsOfExperience: { type: 'text', default: '22' },
      backgroundColor: { type: 'color', default: '#F8F9FA' }
    }
  },
  {
    id: 'services_showcase',
    name: 'Services Showcase',
    description: 'Showcase services in a carousel or grid with images',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      subtitle: { type: 'text', bilingual: true, required: false },
      description: { type: 'textarea', bilingual: true, required: false },
      services: {
        type: 'repeater',
        subFields: {
          title: { type: 'text', bilingual: true, required: true },
          description: { type: 'textarea', bilingual: true, required: false },
          image: { type: 'image', required: false },
          icon: { type: 'text', required: false },
          link: { type: 'text', required: false }
        }
      },
      layout: { type: 'select', options: ['carousel', 'grid'], default: 'carousel' },
      backgroundColor: { type: 'color', default: '#FFFFFF' }
    }
  },
  {
    id: 'portfolio_display_home',
    name: 'Portfolio Display (Homepage)',
    description: 'Featured portfolio projects for homepage',
    category: 'content',
    fields: {
      headline: { type: 'text', bilingual: true, required: false },
      title: { type: 'text', bilingual: true, required: false },
      featured: { type: 'boolean', default: true },
      maxItems: { type: 'number', default: 6 }
    }
  },
  {
    id: 'process_section',
    name: 'Process Section',
    description: 'Display workflow or process steps',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      subtitle: { type: 'text', bilingual: true, required: false },
      steps: {
        type: 'repeater',
        subFields: {
          number: { type: 'text', required: false },
          title: { type: 'text', bilingual: true, required: true },
          description: { type: 'textarea', bilingual: true, required: false }
        }
      },
      mainImage: { type: 'image', required: false },
      smallImage: { type: 'image', required: false },
      backgroundColor: { type: 'color', default: '#FFFFFF' }
    }
  },
  {
    id: 'text_section',
    name: 'Text Section',
    description: 'Simple text content section',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      subtitle: { type: 'text', bilingual: true, required: false },
      content: { type: 'richtext', bilingual: true, required: true },
      image: { type: 'image', required: false },
      backgroundColor: { type: 'color', default: '#F8F9FA' }
    }
  },
  {
    id: 'text_columns',
    name: 'Text Columns',
    description: 'Multi-column text layout (mission, vision, values)',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      columns: {
        type: 'repeater',
        subFields: {
          title: { type: 'text', bilingual: true, required: true },
          content: { type: 'textarea', bilingual: true, required: true },
          icon: { type: 'text', required: false }
        }
      },
      backgroundColor: { type: 'color', default: '#FFFFFF' }
    }
  },
  {
    id: 'features_grid',
    name: 'Features Grid',
    description: 'Grid of features or benefits',
    category: 'content',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      features: {
        type: 'repeater',
        subFields: {
          icon: { type: 'text', required: false },
          title: { type: 'text', bilingual: true, required: true },
          description: { type: 'text', bilingual: true, required: false }
        }
      },
      columns: { type: 'select', options: ['2', '3', '4'], default: '3' },
      backgroundColor: { type: 'color', default: '#F8F9FA' }
    }
  },
  {
    id: 'separator',
    name: 'Section Separator',
    description: 'Visual separator between sections',
    category: 'decorative',
    fields: {
      style: { type: 'select', options: ['line', 'dots', 'wave', 'custom'], default: 'line' },
      color: { type: 'color', default: '#E5E5E5' },
      spacing: { type: 'select', options: ['small', 'medium', 'large'], default: 'medium' }
    }
  },
  {
    id: 'clients_section',
    name: 'Clients Section',
    description: 'Display client logos and information',
    category: 'social_proof',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      clients: { type: 'gallery', required: true },
      layout: { type: 'select', options: ['grid', 'carousel'], default: 'grid' }
    }
  },
  {
    id: 'instagram_section',
    name: 'Instagram Section',
    description: 'Display Instagram feed or gallery',
    category: 'social_proof',
    fields: {
      title: { type: 'text', bilingual: true, required: false },
      username: { type: 'text', required: false },
      media: { type: 'gallery', required: false },
      maxItems: { type: 'number', default: 6 }
    }
  }
];
export async function GET() {
  try {
    return NextResponse.json({
      blockTypes,
      categories: [
        { id: 'headers', name: 'Headers & Banners' },
        { id: 'content', name: 'Content Sections' },
        { id: 'social_proof', name: 'Social Proof' },
        { id: 'forms', name: 'Forms & Contact' },
        { id: 'media', name: 'Media & Galleries' },
        { id: 'interactive', name: 'Interactive Elements' },
        { id: 'decorative', name: 'Decorative Elements' },
        { id: 'advanced', name: 'Advanced' }
      ]
    });
  } catch (error) {
    console.error('Error fetching block types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch block types' },
      { status: 500 }
    );
  }
}