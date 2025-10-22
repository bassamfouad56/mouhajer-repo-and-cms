/**
 * Website Thumbnail Preview Component
 * Shows actual thumbnails from the Mouhajer website using stored screenshots
 */

'use client';

import React, { useState } from 'react';
import { PageBlock } from '@/lib/db';

interface WebsiteThumbnailPreviewProps {
  block: PageBlock;
  size?: 'small' | 'medium' | 'large';
}

export default function WebsiteThumbnailPreview({ block, size = 'small' }: WebsiteThumbnailPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-16 h-12',
    },
    medium: {
      container: 'w-24 h-18',
    },
    large: {
      container: 'w-32 h-24',
    }
  };

  const config = sizeConfig[size];

  // Mapping of block types to their actual website thumbnail URLs
  // These should be actual screenshots from the Mouhajer website
  const getThumbnailUrl = (blockType: string): string => {
    const thumbnailMapping: Record<string, string> = {
      // Hero sections - captured from home page hero
      hero: 'http://localhost:3005/en/api/thumbnail?section=hero',
      hero_banner: 'http://localhost:3005/en/api/thumbnail?section=hero',

      // Featured/Client sections
      featured_in: 'http://localhost:3005/en/api/thumbnail?section=featured-in',
      our_clients: 'http://localhost:3005/en/api/thumbnail?section=clients',

      // About section
      about_section: 'http://localhost:3005/en/api/thumbnail?section=about',

      // Portfolio/Projects
      portfolio_section: 'http://localhost:3005/en/api/thumbnail?section=portfolio',
      projects_gallery: 'http://localhost:3005/en/api/thumbnail?section=portfolio',

      // Services
      services_section: 'http://localhost:3005/en/api/thumbnail?section=services',
      benefits_swiper: 'http://localhost:3005/en/api/thumbnail?section=services',

      // Blog
      blog_section: 'http://localhost:3005/en/api/thumbnail?section=blog',

      // Contact
      contact_form: 'http://localhost:3005/en/api/thumbnail?section=contact',
      contact: 'http://localhost:3005/en/api/thumbnail?section=contact',

      // Interactive elements
      accordion_swiper: 'http://localhost:3005/en/api/thumbnail?section=services',
      awards_section: 'http://localhost:3005/en/api/thumbnail?section=about',
      press_articles: 'http://localhost:3005/en/api/thumbnail?section=blog',

      // Stats and company info
      stats_section: 'http://localhost:3005/en/api/thumbnail?section=stats',
      company_description_home: 'http://localhost:3005/en/api/thumbnail?section=about',
      about_section: 'http://localhost:3005/en/api/thumbnail?section=about',

      // Interactive and special sections
      animated_headline: 'http://localhost:3005/en/api/thumbnail?section=hero',
      benefits_swiper: 'http://localhost:3005/en/api/thumbnail?section=services',
      accordion_swiper: 'http://localhost:3005/en/api/thumbnail?section=services',
      gallery_section: 'http://localhost:3005/en/api/thumbnail?section=portfolio',
      awards_section: 'http://localhost:3005/en/api/thumbnail?section=about',
      press_articles: 'http://localhost:3005/en/api/thumbnail?section=blog',
      services_section: 'http://localhost:3005/en/api/thumbnail?section=services',

      // Generic content types
      text: 'http://localhost:3005/en/api/thumbnail?section=about',
      content: 'http://localhost:3005/en/api/thumbnail?section=about',
      image: 'http://localhost:3005/en/api/thumbnail?section=portfolio',
      gallery: 'http://localhost:3005/en/api/thumbnail?section=portfolio',
      cta: 'http://localhost:3005/en/api/thumbnail?section=cta',
      call_to_action: 'http://localhost:3005/en/api/thumbnail?section=cta',
      features: 'http://localhost:3005/en/api/thumbnail?section=services',
      testimonial: 'http://localhost:3005/en/api/thumbnail?section=testimonial'
    };

    return thumbnailMapping[blockType] || 'http://localhost:3005/en/api/thumbnail?section=default';
  };

  // Fallback component when image fails to load
  const FallbackPreview = () => (
    <div className={`${config.container} bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 rounded-sm overflow-hidden flex items-center justify-center`}>
      <div className="text-center">
        <div className="text-[6px] font-medium text-gray-600 mb-0.5 leading-tight">
          {block.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        <div className="w-3 h-0.5 bg-blue-400 rounded mx-auto opacity-60"></div>
      </div>
    </div>
  );

  const thumbnailUrl = getThumbnailUrl(block.type);

  if (imageError) {
    return <FallbackPreview />;
  }

  return (
    <div className="relative group">
      <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden relative`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse w-full h-full bg-gray-200 rounded"></div>
          </div>
        )}

        <img
          src={thumbnailUrl}
          alt={`${block.type} preview`}
          className="w-full h-full object-cover object-top"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
          loading="lazy"
        />

        {/* Overlay with subtle border effect */}
        <div className="absolute inset-0 border border-black/10 rounded-sm pointer-events-none"></div>
      </div>

      {/* Enhanced hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        <div className="font-medium">
          {block.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        <div className="text-xs opacity-75">
          Live from Mouhajer Website
        </div>
      </div>
    </div>
  );
}