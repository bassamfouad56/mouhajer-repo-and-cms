/**
 * Live Block Preview Component
 * Shows actual thumbnails from the live Mouhajer website using iframes
 */

'use client';

import React, { useState, useEffect } from 'react';
import { PageBlock } from '@/lib/db';

interface LiveBlockPreviewProps {
  block: PageBlock;
  size?: 'small' | 'medium' | 'large';
  fallback?: boolean;
}

export default function LiveBlockPreview({ block, size = 'small', fallback = true }: LiveBlockPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: {
      container: 'w-16 h-12',
      scale: '0.1'
    },
    medium: {
      container: 'w-24 h-18',
      scale: '0.15'
    },
    large: {
      container: 'w-32 h-24',
      scale: '0.2'
    }
  };

  const config = sizeConfig[size];

  // URL mapping for different block types to specific sections of the Mouhajer website
  const getBlockUrl = (blockType: string): string => {
    const baseUrl = 'http://localhost:3005/en';

    const urlMapping: Record<string, string> = {
      // Hero sections
      hero: `${baseUrl}`,
      hero_banner: `${baseUrl}`,

      // Content sections
      featured_in: `${baseUrl}`,
      our_clients: `${baseUrl}`,
      about_section: `${baseUrl}`,

      // Project/Portfolio sections
      portfolio_section: `${baseUrl}/our-projects`,
      projects_gallery: `${baseUrl}/our-projects`,

      // Service sections
      services_section: `${baseUrl}`,
      benefits_swiper: `${baseUrl}`,

      // Blog sections
      blog_section: `${baseUrl}/blog`,

      // Contact sections
      contact_form: `${baseUrl}/contact-us`,
      contact: `${baseUrl}/contact-us`,

      // Interactive sections
      accordion_swiper: `${baseUrl}`,
      awards_section: `${baseUrl}`,
      press_articles: `${baseUrl}`,

      // Generic content
      text: `${baseUrl}`,
      content: `${baseUrl}`,
      image: `${baseUrl}/our-projects`,
      gallery: `${baseUrl}/our-projects`,
      cta: `${baseUrl}`,
      call_to_action: `${baseUrl}`,
      features: `${baseUrl}`,
      testimonial: `${baseUrl}`
    };

    return urlMapping[blockType] || baseUrl;
  };

  // Get the specific section selector for the block type
  const getSectionSelector = (blockType: string): string => {
    const selectorMapping: Record<string, string> = {
      hero: '.hero-section, .hero-banner, section:first-of-type',
      hero_banner: '.hero-section, .hero-banner, section:first-of-type',
      featured_in: '.featured-in, .featured-section',
      our_clients: '.clients-section, .our-clients',
      about_section: '.about-section',
      portfolio_section: '.portfolio-section, .projects-section',
      services_section: '.services-section',
      blog_section: '.blog-section',
      contact_form: '.contact-form, .contact-section',
      benefits_swiper: '.benefits-section, .swiper-container',
      accordion_swiper: '.accordion-section, .faq-section',
      awards_section: '.awards-section',
      press_articles: '.press-section, .articles-section',
      testimonial: '.testimonials-section'
    };

    return selectorMapping[blockType] || 'main';
  };

  const blockUrl = getBlockUrl(block.type);
  const sectionId = getSectionSelector(block.type);

  // Fallback to simple preview if iframe fails or fallback is requested
  const SimpleFallback = () => (
    <div className={`${config.container} bg-gray-100 border border-gray-300 rounded-sm overflow-hidden flex items-center justify-center`}>
      <div className="text-center">
        <div className="text-[6px] font-medium text-gray-600 mb-0.5">
          {block.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </div>
        <div className="w-2 h-1 bg-blue-300 rounded mx-auto"></div>
      </div>
    </div>
  );

  if (fallback || hasError) {
    return <SimpleFallback />;
  }

  return (
    <div className="relative group">
      <div className={`${config.container} bg-white border border-gray-200 rounded-sm overflow-hidden relative`}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin w-2 h-2 border border-gray-400 border-t-transparent rounded-full"></div>
          </div>
        )}

        <iframe
          src={blockUrl}
          className="w-full h-full border-none pointer-events-none"
          style={{
            transform: `scale(${config.scale})`,
            transformOrigin: 'top left',
            width: `${100 / parseFloat(config.scale)}%`,
            height: `${100 / parseFloat(config.scale)}%`
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          title={`Preview of ${block.type}`}
          sandbox="allow-same-origin"
        />

        {/* Overlay to prevent interaction */}
        <div className="absolute inset-0 bg-transparent"></div>
      </div>

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {block.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        <br />
        <span className="text-xs opacity-75">Live from Mouhajer</span>
      </div>
    </div>
  );
}