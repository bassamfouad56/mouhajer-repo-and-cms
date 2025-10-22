'use client';

import { useState } from 'react';
import { Page, PageBlock } from '@/lib/db';

interface PagePreviewProps {
  page: Page;
  isOpen: boolean;
  onClose: () => void;
}

// Helper type for bilingual text fields
type BilingualText = { en?: string; ar?: string; [key: string]: string | undefined };

// Type-safe helpers for block data access
const getText = (field: unknown): BilingualText | undefined =>
  field as BilingualText | undefined;

const getString = (field: unknown): string | undefined =>
  typeof field === 'string' ? field : undefined;

const getArray = (field: unknown): unknown[] | undefined =>
  Array.isArray(field) ? field : undefined;

export default function PagePreview({ page, isOpen, onClose }: PagePreviewProps) {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const renderBlock = (block: PageBlock) => {
    const data = block.data;

    switch (block.type) {
      case 'hero':
        return (
          <div className="relative bg-gray-900 text-white min-h-96 flex items-center justify-center">
            {getString(data.backgroundImage) && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
                style={{ backgroundImage: `url(${getString(data.backgroundImage)})` }}
              />
            )}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {getText(data.title)?.[language] || 'Hero Title'}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                {getText(data.subtitle)?.[language] || 'Hero subtitle'}
              </p>
              {getText(data.buttonText)?.[language] && (
                <button
                  className="inline-block px-8 py-3 text-lg font-semibold rounded-lg"
                  style={{ backgroundColor: getString(data.buttonColor) || '#2563eb', color: '#fff' }}
                >
                  {getText(data.buttonText)?.[language]}
                </button>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            {getText(data.title)?.[language] && (
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                {getText(data.title)?.[language]}
              </h2>
            )}
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: getText(data.content)?.[language] || '' }}
            />
          </div>
        );

      case 'image':
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <img
              src={getString(data.src) || '/placeholder-image.jpg'}
              alt={getText(data.alt)?.[language] || 'Image'}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {getText(data.caption)?.[language] && (
              <p className="text-center text-gray-600 mt-4 text-sm">
                {getText(data.caption)?.[language]}
              </p>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            {getText(data.title)?.[language] && (
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                {getText(data.title)?.[language]}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(getArray(data.images) || []).map((img: unknown, index: number) => {
                const image = img as { src?: string; alt?: Record<string, string>; caption?: Record<string, string> };
                return (
                  <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={getString(image.src) || '/placeholder-image.jpg'}
                      alt={getText(image.alt)?.[language] || `Gallery image ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'cta':
        return (
          <div
            className="py-16 text-center text-white"
            style={{ backgroundColor: getString(data.backgroundColor) || '#2563eb' }}
          >
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-4xl font-bold mb-4">
                {getText(data.title)?.[language] || 'Call to Action'}
              </h2>
              <p className="text-xl mb-8 text-opacity-90">
                {getText(data.description)?.[language] || 'Call to action description'}
              </p>
              {getText(data.buttonText)?.[language] && (
                <button
                  className="inline-block px-8 py-3 text-lg font-semibold rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  {getText(data.buttonText)?.[language]}
                </button>
              )}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="max-w-6xl mx-auto px-4 py-12">
            {getText(data.title)?.[language] && (
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                {getText(data.title)?.[language]}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(getArray(data.features) || []).map((feat: unknown, index: number) => {
                const feature = feat as { icon?: string; title?: Record<string, string>; description?: Record<string, string> };
                return (
                  <div key={index} className="text-center">
                    {getString(feature.icon) && (
                      <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100">
                        <img src={getString(feature.icon)} alt="" className="w-8 h-8" />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {getText(feature.title)?.[language] || 'Feature'}
                    </h3>
                    <p className="text-gray-600">
                      {getText(feature.description)?.[language] || 'Feature description'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'testimonial':
        return (
          <div className="bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 text-center">
              <blockquote className="text-2xl font-medium text-gray-900 mb-6">
                &quot;{getText(data.quote)?.[language] || 'Testimonial quote'}&quot;
              </blockquote>
              <div className="flex items-center justify-center">
                {getString(data.avatar) && (
                  <img
                    src={getString(data.avatar)}
                    alt={getString(data.name) || 'Customer'}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                )}
                <div>
                  <div className="font-semibold text-gray-900">
                    {getString(data.name) || 'Customer Name'}
                  </div>
                  <div className="text-gray-600">
                    {getText(data.title)?.[language] || 'Customer Title'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="max-w-4xl mx-auto px-4 py-12">
            {getText(data.title)?.[language] && (
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                {getText(data.title)?.[language]}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Get in Touch</h3>
                <div className="space-y-3">
                  {getString(data.phone) && (
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3">📞</span>
                      <span>{getString(data.phone)}</span>
                    </div>
                  )}
                  {getString(data.email) && (
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3">✉️</span>
                      <span>{getString(data.email)}</span>
                    </div>
                  )}
                  {getText(data.address)?.[language] && (
                    <div className="flex items-center">
                      <span className="w-5 h-5 mr-3">📍</span>
                      <span>{getText(data.address)?.[language]}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'hero_banner':
        return (
          <div className="relative bg-gray-900 text-white min-h-96 flex items-center justify-center">
            {getString(data.backgroundImage) && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
                style={{ backgroundImage: `url(${getString(data.backgroundImage)})` }}
              />
            )}
            {getString(data.backgroundVideo) && !getString(data.backgroundImage) && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <span className="text-sm text-gray-400">Video Background</span>
              </div>
            )}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {getText(data.title)?.[language] || 'Hero Banner Title'}
              </h1>
              {getText(data.subtitle)?.[language] && (
                <p className="text-xl md:text-2xl mb-8 text-gray-200">
                  {getText(data.subtitle)?.[language]}
                </p>
              )}
              {getText(data.ctaText)?.[language] && (
                <button className="inline-block px-8 py-3 text-lg font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  {getText(data.ctaText)?.[language]}
                </button>
              )}
            </div>
          </div>
        );

      case 'stats_section':
        return (
          <div className="bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {(getArray(data.stats) || []).map((stat: unknown, index: number) => {
                  const statItem = stat as { number?: string; label?: Record<string, string>; icon?: string };
                  return (
                    <div key={index} className="text-center">
                      <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                        {getString(statItem.number) || '0'}
                      </div>
                      <div className="text-sm md:text-base text-gray-700 font-medium">
                        {getText(statItem.label)?.[language] || 'Stat Label'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'company_description_home':
        return (
          <div className="py-16" style={{ backgroundColor: getString(data.backgroundColor) || '#FFFEF5' }}>
            <div className="max-w-6xl mx-auto px-4">
              {getText(data.subtitle)?.[language] && (
                <p className="text-sm font-semibold text-blue-600 mb-2 text-center tracking-wider">
                  {getText(data.subtitle)?.[language]}
                </p>
              )}
              {getText(data.title)?.[language] && (
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              {getText(data.description)?.[language] && (
                <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-4xl mx-auto text-center">
                  {getText(data.description)?.[language]}
                </p>
              )}
              {getArray(data.features) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                  {(getArray(data.features) || []).map((feature: unknown, index: number) => {
                    const featureItem = feature as { title?: Record<string, string>; description?: Record<string, string> };
                    return (
                      <div key={index} className="text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {getText(featureItem.title)?.[language] || 'Feature'}
                        </h3>
                        {getText(featureItem.description)?.[language] && (
                          <p className="text-gray-600">
                            {getText(featureItem.description)?.[language]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );

      case 'featured_in':
        return (
          <div className="bg-white py-12">
            <div className="max-w-6xl mx-auto px-4">
              {getText(data.title)?.[language] && (
                <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              <div className="flex flex-wrap items-center justify-center gap-8">
                {(getArray(data.logos) || []).slice(0, 6).map((logo: unknown, index: number) => {
                  const logoItem = logo as { src?: string; alt?: Record<string, string> };
                  return (
                    <div key={index} className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100">
                      <img
                        src={getString(logoItem.src) || '/placeholder-logo.png'}
                        alt={getText(logoItem.alt)?.[language] || `Logo ${index + 1}`}
                        className="h-12 w-auto object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'our_clients':
        return (
          <div className="bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
              {getText(data.title)?.[language] && (
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(getArray(data.clients) || []).map((client: unknown, index: number) => {
                  const clientItem = client as { src?: string; alt?: Record<string, string> };
                  return (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center">
                      <img
                        src={getString(clientItem.src) || '/placeholder-client.png'}
                        alt={getText(clientItem.alt)?.[language] || `Client ${index + 1}`}
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'animated_headline':
        return (
          <div className={`py-8 overflow-hidden ${getString(data.blackened) === 'true' || data.blackened === true ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
            <div className="whitespace-nowrap animate-marquee">
              <span className="text-4xl md:text-6xl font-bold mx-8">
                {getText(data.text)?.[language] || 'Animated Headline'}
              </span>
              <span className="text-4xl md:text-6xl font-bold mx-8">
                {getText(data.text)?.[language] || 'Animated Headline'}
              </span>
              <span className="text-4xl md:text-6xl font-bold mx-8">
                {getText(data.text)?.[language] || 'Animated Headline'}
              </span>
            </div>
          </div>
        );

      case 'about_section':
        return (
          <div className="py-16" style={{ backgroundColor: getString(data.backgroundColor) || '#FFFEF5' }}>
            {getString(data.backgroundImage) && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
                style={{ backgroundImage: `url(${getString(data.backgroundImage)})` }}
              />
            )}
            <div className="max-w-4xl mx-auto px-4 relative">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {getText(data.title)?.[language] || 'About Section'}
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: getText(data.description)?.[language] || '' }}
              />
            </div>
          </div>
        );

      case 'contact_form':
        return (
          <div className="max-w-2xl mx-auto px-4 py-12">
            {getText(data.title)?.[language] && (
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
                {getText(data.title)?.[language]}
              </h2>
            )}
            {getText(data.description)?.[language] && (
              <p className="text-center text-gray-600 mb-8">
                {getText(data.description)?.[language]}
              </p>
            )}
            <form className="space-y-4">
              {(getArray(data.fields) || []).map((field: unknown, index: number) => {
                const fieldItem = field as { label?: Record<string, string>; type?: string; placeholder?: Record<string, string> };
                const fieldType = getString(fieldItem.type) || 'text';
                return (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {getText(fieldItem.label)?.[language] || 'Field'}
                    </label>
                    {fieldType === 'textarea' ? (
                      <textarea
                        rows={4}
                        placeholder={getText(fieldItem.placeholder)?.[language] || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type={fieldType}
                        placeholder={getText(fieldItem.placeholder)?.[language] || ''}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                );
              })}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Submit
              </button>
            </form>
          </div>
        );

      case 'portfolio_section':
      case 'services_section':
      case 'blog_section':
        return (
          <div className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              {getText(data.title)?.[language] && (
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="h-48 bg-gradient-to-br from-blue-200 to-purple-200"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {block.type === 'portfolio_section' ? 'Project' : block.type === 'services_section' ? 'Service' : 'Blog Post'} {index + 1}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Dynamic content from database will be displayed here
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'benefits_swiper':
        return (
          <div className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              {getText(data.title)?.[language] && (
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(getArray(data.benefits) || []).slice(0, 4).map((benefit: unknown, index: number) => {
                  const benefitItem = benefit as { title?: Record<string, string>; description?: Record<string, string>; image?: string };
                  return (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                      {getString(benefitItem.image) && (
                        <div className="h-48 bg-gradient-to-br from-green-200 to-blue-200"></div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {getText(benefitItem.title)?.[language] || 'Benefit'}
                        </h3>
                        <p className="text-gray-600">
                          {getText(benefitItem.description)?.[language] || 'Description'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'accordion_swiper':
        return (
          <div className="relative py-16">
            {getString(data.backgroundImage) && (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: `url(${getString(data.backgroundImage)})` }}
              />
            )}
            <div className="max-w-4xl mx-auto px-4 relative">
              {getText(data.title)?.[language] && (
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              <div className="space-y-4">
                {(getArray(data.items) || []).map((item: unknown, index: number) => {
                  const accordionItem = item as { title?: Record<string, string>; content?: Record<string, string> };
                  return (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {getText(accordionItem.title)?.[language] || 'Accordion Item'}
                      </h3>
                      <p className="text-gray-600">
                        {getText(accordionItem.content)?.[language] || 'Content'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'gallery_section':
        return (
          <div className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              {getText(data.title)?.[language] && (
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              <div className={`grid gap-4 ${getString(data.columns) === '4' ? 'grid-cols-4' : getString(data.columns) === '2' ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {(getArray(data.images) || []).map((img: unknown, index: number) => {
                  const image = img as { src?: string; alt?: Record<string, string> };
                  return (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={getString(image.src) || '/placeholder-image.jpg'}
                        alt={getText(image.alt)?.[language] || `Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'awards_section':
        return (
          <div className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              {getText(data.title)?.[language] && (
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(getArray(data.awards) || []).map((award: unknown, index: number) => {
                  const awardItem = award as { src?: string; alt?: Record<string, string> };
                  return (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center">
                      <img
                        src={getString(awardItem.src) || '/placeholder-award.png'}
                        alt={getText(awardItem.alt)?.[language] || `Award ${index + 1}`}
                        className="h-24 w-auto object-contain"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'press_articles':
        return (
          <div className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              {getText(data.title)?.[language] && (
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                  {getText(data.title)?.[language]}
                </h2>
              )}
              <div className="space-y-6">
                {(getArray(data.articles) || []).map((article: unknown, index: number) => {
                  const articleItem = article as { title?: Record<string, string>; publication?: string; logo?: string; date?: string };
                  return (
                    <div key={index} className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
                      {getString(articleItem.logo) && (
                        <img
                          src={getString(articleItem.logo)}
                          alt={getString(articleItem.publication) || 'Publication'}
                          className="h-12 w-auto object-contain"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {getText(articleItem.title)?.[language] || 'Article Title'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{getString(articleItem.publication) || 'Publication'}</span>
                          {getString(articleItem.date) && <span>{getString(articleItem.date)}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'custom_html':
        return (
          <div className="py-8 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
              <div className="bg-gray-900 text-green-400 p-6 rounded-lg font-mono text-sm">
                <div className="mb-2 text-gray-400">// Custom HTML Block</div>
                <div dangerouslySetInnerHTML={{ __html: getString(data.html) || '<div>Custom HTML content will render here</div>' }} />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">Block type: {block.type}</p>
              <p className="text-sm text-gray-400 mt-2">Preview not available for this block type</p>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  const sortedBlocks = [...page.blocks].sort((a, b) => a.order - b.order);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative bg-white shadow-xl">
        {/* Preview Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Page Preview: {page.title[language] || page.title.en}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                page.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {page.status}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Language:</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 text-sm rounded ${
                    language === 'en' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1 text-sm rounded ${
                    language === 'ar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  العربية
                </button>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`p-2 rounded ${
                    viewMode === 'desktop' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Desktop"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('tablet')}
                  className={`p-2 rounded ${
                    viewMode === 'tablet' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Tablet"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`p-2 rounded ${
                    viewMode === 'mobile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'
                  }`}
                  title="Mobile"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex justify-center bg-gray-100 min-h-screen">
          <div
            className={`bg-white shadow-lg transition-all duration-300 ${
              viewMode === 'desktop' ? 'w-full max-w-none' :
              viewMode === 'tablet' ? 'w-[768px] my-4 rounded-lg' :
              'w-[375px] my-4 rounded-lg'
            }`}
            style={{
              direction: language === 'ar' ? 'rtl' : 'ltr',
              minHeight: viewMode === 'desktop' ? '100vh' : 'auto'
            }}
          >
            {sortedBlocks.length > 0 ? (
              sortedBlocks.map((block) => (
                <div key={block.id}>
                  {renderBlock(block)}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center min-h-96 text-gray-500">
                <div className="text-center">
                  <p className="text-lg">No content blocks found</p>
                  <p className="text-sm mt-2">Add some blocks to see the preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}