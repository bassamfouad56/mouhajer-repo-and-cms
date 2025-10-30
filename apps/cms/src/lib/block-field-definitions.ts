/**
 * Comprehensive field definitions for all block types
 * Based on analysis of frontend components
 */

export interface FieldDefinition {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'image' | 'gallery' | 'boolean' | 'number' | 'select' | 'repeater' | 'color' | 'url' | 'email';
  required?: boolean;
  bilingual?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  defaultValue?: any;
  helpText?: string;
  repeaterFields?: FieldDefinition[];
  min?: number;
  max?: number;
}

export interface BlockFieldDefinition {
  type: string;
  displayName: string;
  category: string;
  icon: string;
  fields: FieldDefinition[];
}

export const blockFieldDefinitions: BlockFieldDefinition[] = [
  {
    type: 'hero_banner',
    displayName: 'Hero Banner',
    category: 'Headers',
    icon: '🏔️',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        bilingual: true,
        required: true,
        placeholder: 'Enter main heading'
      },
      {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'textarea',
        bilingual: true,
        placeholder: 'Enter subheading text'
      },
      {
        name: 'backgroundImage',
        label: 'Background Image',
        type: 'image',
        helpText: 'Recommended size: 1920x1080px'
      },
      {
        name: 'backgroundVideo',
        label: 'Background Video URL',
        type: 'url',
        placeholder: 'https://example.com/video.mp4'
      },
      {
        name: 'ctaText',
        label: 'CTA Button Text',
        type: 'text',
        bilingual: true,
        placeholder: 'e.g., Explore Our Work'
      },
      {
        name: 'ctaLink',
        label: 'CTA Button Link',
        type: 'url',
        placeholder: '/portfolio'
      },
      {
        name: 'maskLayer',
        label: 'Show Dark Overlay',
        type: 'boolean',
        defaultValue: true
      },
      {
        name: 'projectsLinkImage',
        label: 'Projects Link Image',
        type: 'image'
      },
      {
        name: 'projectsLinkText',
        label: 'Projects Link Text',
        type: 'text',
        bilingual: true,
        defaultValue: 'Projects'
      }
    ]
  },
  {
    type: 'about_section',
    displayName: 'About Section',
    category: 'Content',
    icon: '👥',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        bilingual: true,
        required: true
      },
      {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'description',
        label: 'Description',
        type: 'richtext',
        bilingual: true,
        required: true
      },
      {
        name: 'mainImage',
        label: 'Main Image',
        type: 'image'
      },
      {
        name: 'gallery',
        label: 'Image Gallery',
        type: 'gallery',
        helpText: 'Add multiple images for carousel'
      },
      {
        name: 'yearsOfExperience',
        label: 'Years of Experience',
        type: 'text',
        defaultValue: '22'
      },
      {
        name: 'experienceLabel',
        label: 'Experience Label',
        type: 'text',
        bilingual: true,
        defaultValue: { en: 'Years of Excellence', ar: 'عاماً من التميز' }
      },
      {
        name: 'features',
        label: 'Features',
        type: 'repeater',
        repeaterFields: [
          {
            name: 'title',
            label: 'Feature Title',
            type: 'text',
            bilingual: true
          },
          {
            name: 'description',
            label: 'Feature Description',
            type: 'textarea',
            bilingual: true
          },
          {
            name: 'icon',
            label: 'Feature Icon',
            type: 'text',
            placeholder: 'e.g., ⭐'
          }
        ]
      },
      {
        name: 'showCta',
        label: 'Show Call to Action',
        type: 'boolean',
        defaultValue: true
      },
      {
        name: 'ctaText',
        label: 'CTA Text',
        type: 'text',
        bilingual: true
      },
      {
        name: 'ctaLink',
        label: 'CTA Link',
        type: 'url'
      }
    ]
  },
  {
    type: 'services_showcase',
    displayName: 'Services Showcase',
    category: 'Services',
    icon: '🛠️',
    fields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Section Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'services',
        label: 'Services',
        type: 'repeater',
        repeaterFields: [
          {
            name: 'title',
            label: 'Service Title',
            type: 'text',
            bilingual: true,
            required: true
          },
          {
            name: 'description',
            label: 'Service Description',
            type: 'textarea',
            bilingual: true
          },
          {
            name: 'image',
            label: 'Service Image',
            type: 'image',
            required: true
          },
          {
            name: 'icon',
            label: 'Service Icon',
            type: 'text'
          },
          {
            name: 'link',
            label: 'Service Link',
            type: 'url'
          }
        ]
      }
    ]
  },
  {
    type: 'portfolio_display_home',
    displayName: 'Portfolio Display',
    category: 'Portfolio',
    icon: '📁',
    fields: [
      {
        name: 'headline',
        label: 'Headline',
        type: 'text',
        bilingual: true
      },
      {
        name: 'sectionTitle',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'description',
        label: 'Description',
        type: 'richtext',
        bilingual: true
      },
      {
        name: 'projectCount',
        label: 'Project Count Text',
        type: 'text',
        bilingual: true,
        placeholder: 'e.g., +400 Projects'
      },
      {
        name: 'showFeatured',
        label: 'Show Featured Projects Only',
        type: 'boolean',
        defaultValue: true
      },
      {
        name: 'maxItems',
        label: 'Maximum Projects to Display',
        type: 'number',
        defaultValue: 6,
        min: 1,
        max: 20
      },
      {
        name: 'category',
        label: 'Filter by Category',
        type: 'select',
        options: [
          { value: '', label: 'All Categories' },
          { value: 'residential', label: 'Residential' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'hotels', label: 'Hotels' },
          { value: 'restaurants', label: 'Restaurants' }
        ]
      },
      {
        name: 'showCta',
        label: 'Show CTA Button',
        type: 'boolean',
        defaultValue: true
      },
      {
        name: 'ctaText',
        label: 'CTA Text',
        type: 'text',
        bilingual: true
      },
      {
        name: 'ctaLink',
        label: 'CTA Link',
        type: 'url',
        defaultValue: '/portfolio'
      },
      {
        name: 'projectsLinkText',
        label: 'Projects Link Text',
        type: 'text',
        bilingual: true
      },
      {
        name: 'projectsLink',
        label: 'Projects Link URL',
        type: 'url'
      }
    ]
  },
  {
    type: 'contact_form',
    displayName: 'Contact Form',
    category: 'Forms',
    icon: '📧',
    fields: [
      {
        name: 'title',
        label: 'Form Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Form Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'description',
        label: 'Form Description',
        type: 'textarea',
        bilingual: true
      },
      {
        name: 'successMessage',
        label: 'Success Message',
        type: 'text',
        bilingual: true,
        defaultValue: { en: 'Thank you! We\'ll be in touch soon.', ar: 'شكراً! سنتواصل معك قريباً.' }
      },
      {
        name: 'errorMessage',
        label: 'Error Message',
        type: 'text',
        bilingual: true,
        defaultValue: { en: 'Error submitting form. Please try again.', ar: 'خطأ في إرسال النموذج. يرجى المحاولة مرة أخرى.' }
      },
      {
        name: 'fields',
        label: 'Form Fields',
        type: 'repeater',
        repeaterFields: [
          {
            name: 'fieldName',
            label: 'Field Name',
            type: 'text',
            required: true
          },
          {
            name: 'label',
            label: 'Field Label',
            type: 'text',
            bilingual: true,
            required: true
          },
          {
            name: 'placeholder',
            label: 'Placeholder Text',
            type: 'text',
            bilingual: true
          },
          {
            name: 'type',
            label: 'Field Type',
            type: 'select',
            options: [
              { value: 'text', label: 'Text' },
              { value: 'email', label: 'Email' },
              { value: 'tel', label: 'Phone' },
              { value: 'textarea', label: 'Textarea' },
              { value: 'select', label: 'Dropdown' },
              { value: 'radio', label: 'Radio Buttons' }
            ]
          },
          {
            name: 'required',
            label: 'Required Field',
            type: 'boolean',
            defaultValue: false
          }
        ]
      },
      {
        name: 'submitButtonText',
        label: 'Submit Button Text',
        type: 'text',
        bilingual: true,
        defaultValue: { en: 'Submit', ar: 'إرسال' }
      },
      {
        name: 'recipientEmail',
        label: 'Recipient Email',
        type: 'email',
        defaultValue: 'info@mouhajerdesign.com'
      }
    ]
  },
  {
    type: 'stats_section',
    displayName: 'Statistics Section',
    category: 'Content',
    icon: '📊',
    fields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Section Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'stats',
        label: 'Statistics',
        type: 'repeater',
        repeaterFields: [
          {
            name: 'number',
            label: 'Number/Value',
            type: 'text',
            required: true,
            placeholder: 'e.g., 500+'
          },
          {
            name: 'label',
            label: 'Label',
            type: 'text',
            bilingual: true,
            required: true
          },
          {
            name: 'icon',
            label: 'Icon',
            type: 'text',
            placeholder: 'e.g., 🏆'
          },
          {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            bilingual: true
          }
        ]
      },
      {
        name: 'backgroundColor',
        label: 'Background Color',
        type: 'color',
        defaultValue: '#F8F9FA'
      }
    ]
  },
  {
    type: 'process_section',
    displayName: 'Process/How We Work',
    category: 'Content',
    icon: '🔄',
    fields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Section Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'mainImage',
        label: 'Main Image',
        type: 'image'
      },
      {
        name: 'smallImage',
        label: 'Small/Accent Image',
        type: 'image'
      },
      {
        name: 'steps',
        label: 'Process Steps',
        type: 'repeater',
        repeaterFields: [
          {
            name: 'stepNumber',
            label: 'Step Number',
            type: 'number',
            min: 1
          },
          {
            name: 'title',
            label: 'Step Title',
            type: 'text',
            bilingual: true,
            required: true
          },
          {
            name: 'description',
            label: 'Step Description',
            type: 'textarea',
            bilingual: true
          },
          {
            name: 'icon',
            label: 'Step Icon',
            type: 'text'
          },
          {
            name: 'image',
            label: 'Step Image',
            type: 'image'
          }
        ]
      }
    ]
  },
  {
    type: 'animated_headline',
    displayName: 'Animated Headline',
    category: 'Decorative',
    icon: '✨',
    fields: [
      {
        name: 'text',
        label: 'Headline Text',
        type: 'text',
        bilingual: true,
        required: true
      },
      {
        name: 'animationType',
        label: 'Animation Type',
        type: 'select',
        options: [
          { value: 'scroll', label: 'Scrolling Text' },
          { value: 'fade', label: 'Fade In/Out' },
          { value: 'slide', label: 'Slide' },
          { value: 'typewriter', label: 'Typewriter Effect' }
        ],
        defaultValue: 'scroll'
      },
      {
        name: 'speed',
        label: 'Animation Speed',
        type: 'number',
        min: 1,
        max: 10,
        defaultValue: 5
      },
      {
        name: 'blackened',
        label: 'Dark Background',
        type: 'boolean',
        defaultValue: false
      }
    ]
  },
  {
    type: 'text_content',
    displayName: 'Text Content/CTA Section',
    category: 'Content',
    icon: '📝',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        bilingual: true,
        required: true
      },
      {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'description',
        label: 'Description/Content',
        type: 'richtext',
        bilingual: true
      },
      {
        name: 'founderName',
        label: 'Founder/Author Name',
        type: 'text',
        bilingual: true
      },
      {
        name: 'founderTitle',
        label: 'Founder/Author Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'founderImage',
        label: 'Founder/Author Image',
        type: 'image'
      },
      {
        name: 'backgroundImage',
        label: 'Background Image',
        type: 'image'
      },
      {
        name: 'alignment',
        label: 'Text Alignment',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' }
        ],
        defaultValue: 'left'
      }
    ]
  },
  {
    type: 'awards_section',
    displayName: 'Awards Section',
    category: 'Recognition',
    icon: '🏆',
    fields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Section Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'awards',
        label: 'Awards',
        type: 'repeater',
        repeaterFields: [
          {
            name: 'name',
            label: 'Award Name',
            type: 'text',
            bilingual: true,
            required: true
          },
          {
            name: 'year',
            label: 'Year',
            type: 'text'
          },
          {
            name: 'organization',
            label: 'Awarding Organization',
            type: 'text',
            bilingual: true
          },
          {
            name: 'image',
            label: 'Award Image/Logo',
            type: 'image'
          },
          {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            bilingual: true
          }
        ]
      },
      {
        name: 'useMediaLibrary',
        label: 'Use Awards from Media Library',
        type: 'boolean',
        helpText: 'Use images tagged with "awards" from media library'
      }
    ]
  },
  {
    type: 'featured_in',
    displayName: 'Featured In/Media Mentions',
    category: 'Recognition',
    icon: '⭐',
    fields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Section Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'logos',
        label: 'Media/Company Logos',
        type: 'gallery'
      },
      {
        name: 'useMediaLibrary',
        label: 'Use Media Library',
        type: 'boolean',
        helpText: 'Use images tagged with "press" or "featured_in" from media library'
      }
    ]
  },
  {
    type: 'clients_section',
    displayName: 'Our Clients',
    category: 'Social Proof',
    icon: '🤝',
    fields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Section Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'clients',
        label: 'Client Logos',
        type: 'gallery'
      },
      {
        name: 'testimonials',
        label: 'Client Testimonials',
        type: 'repeater',
        repeaterFields: [
          {
            name: 'clientName',
            label: 'Client Name',
            type: 'text',
            required: true
          },
          {
            name: 'clientTitle',
            label: 'Client Title/Company',
            type: 'text'
          },
          {
            name: 'testimonial',
            label: 'Testimonial Text',
            type: 'textarea',
            bilingual: true
          },
          {
            name: 'clientImage',
            label: 'Client Photo',
            type: 'image'
          },
          {
            name: 'rating',
            label: 'Rating',
            type: 'number',
            min: 1,
            max: 5
          }
        ]
      },
      {
        name: 'useMediaLibrary',
        label: 'Use Client Logos from Media Library',
        type: 'boolean',
        helpText: 'Use images tagged with "clients" from media library'
      }
    ]
  },
  {
    type: 'blog_section',
    displayName: 'Featured Blogs',
    category: 'Content',
    icon: '📰',
    fields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Section Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'showFeatured',
        label: 'Show Featured Posts Only',
        type: 'boolean',
        defaultValue: true
      },
      {
        name: 'maxPosts',
        label: 'Maximum Posts to Display',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 12
      },
      {
        name: 'category',
        label: 'Filter by Category',
        type: 'select',
        options: [
          { value: '', label: 'All Categories' },
          { value: 'design-tips', label: 'Design Tips' },
          { value: 'trends', label: 'Trends' },
          { value: 'case-studies', label: 'Case Studies' },
          { value: 'news', label: 'News' }
        ]
      },
      {
        name: 'ctaText',
        label: 'View All Button Text',
        type: 'text',
        bilingual: true
      },
      {
        name: 'ctaLink',
        label: 'View All Button Link',
        type: 'url',
        defaultValue: '/blog'
      }
    ]
  },
  {
    type: 'instagram_section',
    displayName: 'Instagram Feed',
    category: 'Social',
    icon: '📷',
    fields: [
      {
        name: 'title',
        label: 'Section Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Section Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'username',
        label: 'Instagram Username',
        type: 'text',
        defaultValue: '@mouhajerdesign'
      },
      {
        name: 'feedType',
        label: 'Feed Type',
        type: 'select',
        options: [
          { value: 'manual', label: 'Manual Selection' },
          { value: 'latest', label: 'Latest Posts' },
          { value: 'media-library', label: 'From Media Library' }
        ],
        defaultValue: 'media-library'
      },
      {
        name: 'media',
        label: 'Instagram Images',
        type: 'gallery',
        helpText: 'Upload images if using manual selection'
      },
      {
        name: 'maxPosts',
        label: 'Maximum Posts',
        type: 'number',
        defaultValue: 9,
        min: 1,
        max: 20
      },
      {
        name: 'profileLink',
        label: 'Instagram Profile Link',
        type: 'url',
        defaultValue: 'https://instagram.com/mouhajerdesign'
      }
    ]
  },
  {
    type: 'separator',
    displayName: 'Section Separator',
    category: 'Layout',
    icon: '➖',
    fields: [
      {
        name: 'style',
        label: 'Separator Style',
        type: 'select',
        options: [
          { value: 'line', label: 'Simple Line' },
          { value: 'dots', label: 'Dots' },
          { value: 'wave', label: 'Wave' },
          { value: 'custom', label: 'Custom' }
        ],
        defaultValue: 'line'
      },
      {
        name: 'spacing',
        label: 'Vertical Spacing',
        type: 'select',
        options: [
          { value: 'small', label: 'Small' },
          { value: 'medium', label: 'Medium' },
          { value: 'large', label: 'Large' }
        ],
        defaultValue: 'medium'
      },
      {
        name: 'color',
        label: 'Color',
        type: 'color'
      }
    ]
  },
  {
    type: 'company_description_home',
    displayName: 'Company Description',
    category: 'Content',
    icon: '🏢',
    fields: [
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        bilingual: true
      },
      {
        name: 'subtitle',
        label: 'Subtitle',
        type: 'text',
        bilingual: true
      },
      {
        name: 'description',
        label: 'Description',
        type: 'richtext',
        bilingual: true
      },
      {
        name: 'yearsOfExperience',
        label: 'Years of Experience',
        type: 'text',
        defaultValue: '22'
      },
      {
        name: 'experienceLabel',
        label: 'Experience Label',
        type: 'text',
        bilingual: true,
        defaultValue: { en: 'Years of Excellence', ar: 'عاماً من التميز' }
      },
      {
        name: 'gallery',
        label: 'Select Images',
        type: 'gallery',
        helpText: 'Select specific images to display. If empty, random images will be shown based on Image Count below.'
      },
      {
        name: 'imageCount',
        label: 'Number of Random Images (if no images selected)',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 20,
        helpText: 'Used only when no images are selected in the gallery above'
      },
      {
        name: 'showCta',
        label: 'Show Call to Action',
        type: 'boolean',
        defaultValue: true
      },
      {
        name: 'ctaText',
        label: 'CTA Text',
        type: 'text',
        bilingual: true,
        defaultValue: { en: 'Get in Touch', ar: 'تواصل معنا' }
      },
      {
        name: 'ctaLink',
        label: 'CTA Link',
        type: 'url',
        defaultValue: '/contact-us'
      }
    ]
  },
  {
    type: 'dynamic_form',
    displayName: 'Dynamic Form',
    category: 'Forms',
    icon: '📝',
    fields: [
      {
        name: 'formId',
        label: 'Form',
        type: 'text',
        required: true,
        helpText: 'Select or enter the Form blueprint instance ID to display'
      },
      {
        name: 'formTitle',
        label: 'Form Title Override',
        type: 'text',
        bilingual: true,
        helpText: 'Optional: Override the form title (leave empty to use form default)'
      },
      {
        name: 'formDescription',
        label: 'Form Description Override',
        type: 'textarea',
        bilingual: true,
        helpText: 'Optional: Override the form description (leave empty to use form default)'
      },
      {
        name: 'submitButtonText',
        label: 'Submit Button Text Override',
        type: 'text',
        bilingual: true,
        helpText: 'Optional: Override the submit button text'
      },
      {
        name: 'containerStyle',
        label: 'Container Style',
        type: 'select',
        options: [
          { value: 'default', label: 'Default' },
          { value: 'card', label: 'Card' },
          { value: 'bordered', label: 'Bordered' },
          { value: 'minimal', label: 'Minimal' }
        ],
        defaultValue: 'default'
      },
      {
        name: 'showLabels',
        label: 'Show Field Labels',
        type: 'boolean',
        defaultValue: true
      },
      {
        name: 'compactMode',
        label: 'Compact Mode',
        type: 'boolean',
        defaultValue: false,
        helpText: 'Reduce spacing for a more compact layout'
      }
    ]
  }
];

/**
 * Get field definitions for a specific block type
 */
export function getBlockFieldDefinition(blockType: string): BlockFieldDefinition | undefined {
  return blockFieldDefinitions.find(def => def.type === blockType);
}

/**
 * Get all field definitions grouped by category
 */
export function getFieldDefinitionsByCategory(): Record<string, BlockFieldDefinition[]> {
  return blockFieldDefinitions.reduce((acc, def) => {
    if (!acc[def.category]) {
      acc[def.category] = [];
    }
    acc[def.category].push(def);
    return acc;
  }, {} as Record<string, BlockFieldDefinition[]>);
}

/**
 * Validate block data against field definitions
 */
export function validateBlockData(blockType: string, data: any, locale: 'en' | 'ar'): { valid: boolean; errors: string[] } {
  const definition = getBlockFieldDefinition(blockType);
  if (!definition) {
    return { valid: false, errors: [`Unknown block type: ${blockType}`] };
  }

  const errors: string[] = [];

  definition.fields.forEach(field => {
    // Check required fields
    if (field.required) {
      if (field.bilingual) {
        if (!data[field.name]?.[locale]) {
          errors.push(`${field.label} is required`);
        }
      } else {
        if (!data[field.name]) {
          errors.push(`${field.label} is required`);
        }
      }
    }

    // Validate number ranges
    if (field.type === 'number' && data[field.name] !== undefined) {
      const value = Number(data[field.name]);
      if (field.min !== undefined && value < field.min) {
        errors.push(`${field.label} must be at least ${field.min}`);
      }
      if (field.max !== undefined && value > field.max) {
        errors.push(`${field.label} must be at most ${field.max}`);
      }
    }

    // Validate email format
    if (field.type === 'email' && data[field.name]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data[field.name])) {
        errors.push(`${field.label} must be a valid email address`);
      }
    }

    // Validate URL format
    if (field.type === 'url' && data[field.name]) {
      try {
        new URL(data[field.name]);
      } catch {
        // Try with relative URL
        if (!data[field.name].startsWith('/')) {
          errors.push(`${field.label} must be a valid URL`);
        }
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}