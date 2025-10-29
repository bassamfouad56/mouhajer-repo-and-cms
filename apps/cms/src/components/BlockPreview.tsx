/**
 * Block Preview Component
 * Shows mini visual thumbnails/snippets of blocks for easy identification
 */

'use client';

import React from 'react';
import { PageBlock } from '@/lib/db';

interface BlockPreviewProps {
  block: PageBlock;
  size?: 'small' | 'medium' | 'large';
}

export default function BlockPreview({ block, size = 'small' }: BlockPreviewProps) {
  const data = block.data;

  // Helper type for bilingual text fields
  type BilingualText = { en?: string; ar?: string };

  // Type-safe helpers
  const getText = (field: unknown): BilingualText | undefined =>
    field as BilingualText | undefined;

  const getString = (field: unknown): string | undefined =>
    typeof field === 'string' ? field : undefined;

  const getArray = (field: unknown): unknown[] | undefined =>
    Array.isArray(field) ? field : undefined;

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-16 h-12',
      text: 'text-[4px]',
      title: 'text-[5px]',
      spacing: 'p-1 space-y-0.5'
    },
    medium: {
      container: 'w-24 h-18',
      text: 'text-[6px]',
      title: 'text-[7px]',
      spacing: 'p-1.5 space-y-1'
    },
    large: {
      container: 'w-32 h-24',
      text: 'text-[8px]',
      title: 'text-[10px]',
      spacing: 'p-2 space-y-1'
    }
  };

  const config = sizeConfig[size];

  const renderBlockPreview = () => {
    switch (block.type) {
      case 'hero':
      case 'hero_banner':
        return (
          <div className={`${config.container} bg-gradient-to-r from-blue-600 to-purple-600 rounded-sm overflow-hidden relative`}>
            <div className={`${config.spacing} text-white h-full flex flex-col justify-center items-center`}>
              <div className={`${config.title} font-bold text-center leading-tight`}>
                {getText(data.title)?.en?.substring(0, 20) || 'Hero Section'}
              </div>
              <div className={`${config.text} opacity-75 text-center leading-tight`}>
                {getText(data.subtitle)?.en?.substring(0, 30) || 'Hero subtitle'}
              </div>
              {getText(data.buttonText)?.en && (
                <div className="w-3 h-1 bg-white rounded-full mt-0.5 opacity-80"></div>
              )}
            </div>
            {getString(data.backgroundImage) && (
              <div className="absolute inset-0 bg-black/20"></div>
            )}
          </div>
        );

      case 'text':
      case 'content':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              {getText(data.title)?.en && (
                <div className={`${config.title} font-semibold text-gray-900 leading-tight`}>
                  {getText(data.title)?.en?.substring(0, 25)}
                </div>
              )}
              <div className={`${config.text} text-gray-600 leading-tight`}>
                {getText(data.content)?.en?.replace(/<[^>]*>/g, '').substring(0, 40) || 'Text content...'}
              </div>
            </div>
          </div>
        );

      case 'image':
      case 'gallery':
        return (
          <div className={`${config.container} bg-gray-100 border border-gray-200 rounded-sm overflow-hidden flex items-center justify-center`}>
            {getString(data.src) || (getArray(data.images) && getArray(data.images)!.length > 0) ? (
              <div className="w-full h-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                <svg className="w-2 h-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            ) : (
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
        );

      case 'cta':
      case 'call_to_action':
        return (
          <div className={`${config.container} rounded-sm overflow-hidden`} style={{ backgroundColor: getString(data.backgroundColor) || '#2563eb' }}>
            <div className={`${config.spacing} text-white h-full flex flex-col justify-center items-center text-center`}>
              <div className={`${config.title} font-bold leading-tight`}>
                {getText(data.title)?.en?.substring(0, 20) || 'Call to Action'}
              </div>
              <div className={`${config.text} opacity-90 leading-tight`}>
                {getText(data.description)?.en?.substring(0, 25) || 'CTA description'}
              </div>
              {getText(data.buttonText)?.en && (
                <div className="w-3 h-1 bg-white rounded-full mt-0.5"></div>
              )}
            </div>
          </div>
        );

      case 'features':
      case 'services':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              {getText(data.title)?.en && (
                <div className={`${config.title} font-semibold text-gray-900 text-center leading-tight mb-1`}>
                  {getText(data.title)?.en?.substring(0, 20)}
                </div>
              )}
              <div className="grid grid-cols-2 gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1 bg-blue-100 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className={`${config.container} bg-gray-50 border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing} text-center`}>
              <div className={`${config.text} text-gray-600 leading-tight italic`}>
                &quot;{getText(data.quote)?.en?.substring(0, 30) || 'Great testimonial'}&quot;
              </div>
              <div className="flex justify-center mt-0.5">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              </div>
              <div className={`${config.text} text-gray-500 leading-tight`}>
                {getString(data.name)?.substring(0, 15) || 'Customer'}
              </div>
            </div>
          </div>
        );

      case 'contact':
      case 'contact_form':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              {getText(data.title)?.en && (
                <div className={`${config.title} font-semibold text-gray-900 leading-tight mb-1`}>
                  {getText(data.title)?.en?.substring(0, 20)}
                </div>
              )}
              <div className="space-y-0.5">
                <div className="w-full h-0.5 bg-gray-200 rounded"></div>
                <div className="w-full h-0.5 bg-gray-200 rounded"></div>
                <div className="w-2/3 h-0.5 bg-blue-300 rounded"></div>
              </div>
            </div>
          </div>
        );

      case 'featured_in':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing} text-center`}>
              <div className={`${config.title} font-semibold text-gray-900 leading-tight mb-1`}>
                Featured In
              </div>
              <div className="flex justify-center space-x-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'our_clients':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing} text-center`}>
              <div className={`${config.title} font-semibold text-gray-900 leading-tight mb-1`}>
                Our Clients
              </div>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-blue-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'portfolio_section':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              <div className={`${config.title} font-semibold text-gray-900 text-center leading-tight mb-1`}>
                Portfolio
              </div>
              <div className="grid grid-cols-2 gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'blog_section':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              <div className={`${config.title} font-semibold text-gray-900 text-center leading-tight mb-1`}>
                Blog
              </div>
              <div className="space-y-0.5">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex space-x-0.5">
                    <div className="w-1.5 h-1 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-0.5">
                      <div className="w-full h-0.5 bg-gray-300 rounded"></div>
                      <div className="w-2/3 h-0.5 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'custom_html':
        return (
          <div className={`${config.container} bg-gray-900 border border-gray-700 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing} text-green-400 font-mono`}>
              <div className={`${config.text} leading-tight`}>
                {'<div>'}
              </div>
              <div className={`${config.text} leading-tight pl-1`}>
                {'<html>'}
              </div>
              <div className={`${config.text} leading-tight`}>
                {'</div>'}
              </div>
            </div>
          </div>
        );

      case 'stats_section':
        return (
          <div className={`${config.container} bg-gray-50 border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              <div className="grid grid-cols-2 gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center">
                    <div className={`${config.title} font-bold text-blue-600 leading-tight`}>
                      {['500+', '22', '98%', '50+'][i]}
                    </div>
                    <div className="w-full h-0.5 bg-gray-300 rounded mt-0.5"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'company_description_home':
        return (
          <div className={`${config.container} rounded-sm overflow-hidden`} style={{ backgroundColor: getString(data.backgroundColor) || '#FFFEF5' }}>
            <div className={`${config.spacing} h-full flex flex-col justify-center`}>
              {getText(data.subtitle)?.en && (
                <div className={`${config.text} text-blue-600 text-center leading-tight mb-0.5`}>
                  {getText(data.subtitle)?.en.substring(0, 15)}
                </div>
              )}
              <div className={`${config.title} font-bold text-gray-900 text-center leading-tight mb-1`}>
                {getText(data.title)?.en?.substring(0, 20) || 'Company Info'}
              </div>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-full h-0.5 bg-blue-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'animated_headline':
        return (
          <div className={`${config.container} ${getString(data.blackened) === 'true' || data.blackened === true ? 'bg-black' : 'bg-white'} border border-gray-200 rounded-sm overflow-hidden flex items-center justify-center`}>
            <div className={`${config.title} font-bold ${getString(data.blackened) === 'true' || data.blackened === true ? 'text-white' : 'text-gray-900'} leading-tight`}>
              {getText(data.text)?.en?.substring(0, 15) || 'Headline'}
            </div>
          </div>
        );

      case 'about_section':
        return (
          <div className={`${config.container} rounded-sm overflow-hidden`} style={{ backgroundColor: getString(data.backgroundColor) || '#FFFEF5' }}>
            <div className={`${config.spacing}`}>
              <div className={`${config.title} font-bold text-gray-900 leading-tight mb-1`}>
                {getText(data.title)?.en?.substring(0, 20) || 'About Us'}
              </div>
              <div className={`${config.text} text-gray-600 leading-tight`}>
                {getText(data.description)?.en?.replace(/<[^>]*>/g, '').substring(0, 40) || 'About content...'}
              </div>
            </div>
          </div>
        );

      case 'benefits_swiper':
        return (
          <div className={`${config.container} bg-gray-50 border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              <div className="grid grid-cols-2 gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gradient-to-br from-green-100 to-blue-100 rounded-sm h-2"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'accordion_swiper':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              <div className="space-y-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-0.5">
                    <div className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 h-0.5 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gallery_section':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-purple-200 to-pink-200 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'awards_section':
        return (
          <div className={`${config.container} bg-gray-50 border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing} text-center`}>
              <div className={`${config.title} font-semibold text-gray-900 leading-tight mb-1`}>
                Awards
              </div>
              <div className="grid grid-cols-4 gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-yellow-200 rounded-full mx-auto"></div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'press_articles':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              <div className={`${config.title} font-semibold text-gray-900 text-center leading-tight mb-1`}>
                Press
              </div>
              <div className="space-y-0.5">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex space-x-0.5">
                    <div className="w-1 h-1 bg-gray-300 rounded flex-shrink-0"></div>
                    <div className="flex-1 h-0.5 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'services_section':
        return (
          <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden`}>
            <div className={`${config.spacing}`}>
              <div className={`${config.title} font-semibold text-gray-900 text-center leading-tight mb-1`}>
                Services
              </div>
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-blue-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`${config.container} bg-gray-100 border border-gray-300 border-dashed rounded-sm overflow-hidden flex items-center justify-center`}>
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="relative group">
      {renderBlockPreview()}
      {/* Hover tooltip for block type */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {(block.type || 'unknown').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </div>
    </div>
  );
}