'use client';

import React, { useState } from 'react';

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  blocks: any[];
  seoConfig: {
    titleTemplate: string;
    descriptionTemplate: string;
    keywords: string[];
  };
}

interface PageTemplatesProps {
  onSelectTemplate: (template: PageTemplate) => void;
}

export default function PageTemplates({ onSelectTemplate }: PageTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<PageTemplate | null>(null);

  const templates: PageTemplate[] = [
    {
      id: 'landing-hero',
      name: 'Hero Landing Page',
      description: 'Eye-catching landing page with hero section, features, and CTA',
      category: 'landing',
      thumbnail: '🏠',
      blocks: [
        {
          type: 'hero',
          data: {
            title: 'Welcome to Our Amazing Service',
            subtitle: 'Transform your business with our innovative solutions',
            backgroundImage: '',
            ctaText: 'Get Started',
            ctaLink: '#contact'
          }
        },
        {
          type: 'features',
          data: {
            title: 'Why Choose Us',
            features: [
              { title: 'Fast & Reliable', description: 'Lightning-fast performance', icon: '⚡' },
              { title: 'Secure', description: 'Enterprise-grade security', icon: '🔒' },
              { title: 'Support', description: '24/7 customer support', icon: '💬' }
            ]
          }
        },
        {
          type: 'cta',
          data: {
            title: 'Ready to Get Started?',
            description: 'Join thousands of satisfied customers',
            buttonText: 'Start Free Trial',
            buttonLink: '/signup'
          }
        }
      ],
      seoConfig: {
        titleTemplate: '{Company} - Professional Services',
        descriptionTemplate: 'Discover our professional services and transform your business',
        keywords: ['services', 'professional', 'business solutions']
      }
    },
    {
      id: 'about-company',
      name: 'About Us Page',
      description: 'Company story, team, and values',
      category: 'corporate',
      thumbnail: '👥',
      blocks: [
        {
          type: 'hero',
          data: {
            title: 'About Our Company',
            subtitle: 'Learn about our mission and values',
            backgroundImage: ''
          }
        },
        {
          type: 'text_image_split',
          data: {
            heading: 'Our Story',
            text: 'Founded with a vision to transform the industry...',
            imageUrl: '',
            imagePosition: 'right'
          }
        },
        {
          type: 'team',
          data: {
            title: 'Meet Our Team',
            members: []
          }
        },
        {
          type: 'values',
          data: {
            title: 'Our Values',
            values: [
              { title: 'Innovation', description: 'Always pushing boundaries' },
              { title: 'Excellence', description: 'Quality in everything we do' },
              { title: 'Integrity', description: 'Honest and transparent' }
            ]
          }
        }
      ],
      seoConfig: {
        titleTemplate: 'About {Company} - Our Story & Team',
        descriptionTemplate: 'Learn about our company, mission, values, and team',
        keywords: ['about us', 'company', 'team', 'mission']
      }
    },
    {
      id: 'services-grid',
      name: 'Services Showcase',
      description: 'Grid layout for showcasing multiple services',
      category: 'services',
      thumbnail: '🛠️',
      blocks: [
        {
          type: 'hero',
          data: {
            title: 'Our Services',
            subtitle: 'Comprehensive solutions for your needs'
          }
        },
        {
          type: 'services_grid',
          data: {
            services: [
              { title: 'Web Development', description: 'Custom websites', icon: '🌐' },
              { title: 'Mobile Apps', description: 'iOS & Android', icon: '📱' },
              { title: 'Consulting', description: 'Expert guidance', icon: '💡' }
            ]
          }
        },
        {
          type: 'process',
          data: {
            title: 'How We Work',
            steps: [
              { number: 1, title: 'Consultation', description: 'Understanding your needs' },
              { number: 2, title: 'Planning', description: 'Creating a roadmap' },
              { number: 3, title: 'Execution', description: 'Bringing ideas to life' },
              { number: 4, title: 'Support', description: 'Ongoing assistance' }
            ]
          }
        }
      ],
      seoConfig: {
        titleTemplate: '{Company} Services - Professional Solutions',
        descriptionTemplate: 'Explore our range of professional services',
        keywords: ['services', 'solutions', 'professional']
      }
    },
    {
      id: 'portfolio-gallery',
      name: 'Portfolio Gallery',
      description: 'Showcase your best work with style',
      category: 'portfolio',
      thumbnail: '🎨',
      blocks: [
        {
          type: 'hero',
          data: {
            title: 'Our Portfolio',
            subtitle: 'Explore our latest projects'
          }
        },
        {
          type: 'portfolio_gallery',
          data: {
            projects: [],
            layout: 'masonry'
          }
        },
        {
          type: 'testimonials',
          data: {
            title: 'Client Testimonials',
            testimonials: []
          }
        }
      ],
      seoConfig: {
        titleTemplate: '{Company} Portfolio - Our Work',
        descriptionTemplate: 'Browse our portfolio of successful projects',
        keywords: ['portfolio', 'projects', 'work', 'gallery']
      }
    },
    {
      id: 'contact-form',
      name: 'Contact Page',
      description: 'Contact form with map and information',
      category: 'contact',
      thumbnail: '📧',
      blocks: [
        {
          type: 'hero',
          data: {
            title: 'Get In Touch',
            subtitle: 'We\'d love to hear from you'
          }
        },
        {
          type: 'contact_split',
          data: {
            formTitle: 'Send us a message',
            infoTitle: 'Contact Information',
            address: '',
            phone: '',
            email: ''
          }
        },
        {
          type: 'map',
          data: {
            latitude: 25.2048,
            longitude: 55.2708,
            zoom: 12
          }
        },
        {
          type: 'faq',
          data: {
            title: 'Frequently Asked Questions',
            items: []
          }
        }
      ],
      seoConfig: {
        titleTemplate: 'Contact {Company} - Get In Touch',
        descriptionTemplate: 'Contact us for inquiries and support',
        keywords: ['contact', 'support', 'get in touch']
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All Templates', icon: '📚' },
    { id: 'landing', label: 'Landing Pages', icon: '🏠' },
    { id: 'corporate', label: 'Corporate', icon: '🏢' },
    { id: 'services', label: 'Services', icon: '🛠️' },
    { id: 'portfolio', label: 'Portfolio', icon: '🎨' },
    { id: 'contact', label: 'Contact', icon: '📧' }
  ];

  const filteredTemplates = selectedCategory === 'all'
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Page Template</h2>
          <p className="text-gray-600">Start with a professionally designed template</p>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setPreviewTemplate(template)}
              >
                <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <span className="text-5xl">{template.thumbnail}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg">
                      {template.blocks.length} blocks
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(template);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Modal */}
        {previewTemplate && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{previewTemplate.name}</h3>
                <p className="text-gray-600">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Page Structure</h4>
                <div className="space-y-2">
                  {previewTemplate.blocks.map((block, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-500 mr-3">{index + 1}</span>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{block.type}</span>
                        {block.data.title && (
                          <span className="ml-2 text-sm text-gray-600">- {block.data.title}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">SEO Configuration</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Title Template:</span>
                    <p className="text-sm text-gray-600">{previewTemplate.seoConfig.titleTemplate}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Description:</span>
                    <p className="text-sm text-gray-600">{previewTemplate.seoConfig.descriptionTemplate}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {previewTemplate.seoConfig.keywords.map(keyword => (
                        <span key={keyword} className="text-xs bg-white px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use This Template
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}