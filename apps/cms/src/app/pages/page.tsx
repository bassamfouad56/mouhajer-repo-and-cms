/**
 * Advanced Pages Management with SEO Optimization
 * Build pages with comprehensive SEO fields following 2025 best practices
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Page } from '@/lib/db';
import VisualBlockComposer from '@/components/VisualBlockComposer';
import AIContentGenerator from '@/components/AIContentGenerator';
import SEOAnalyzer from '@/components/SEOAnalyzer';
import LanguageToggle, { AnimatedLanguageToggle } from '@/components/LanguageToggle';
import DraggableBlocks from '@/components/DraggableBlocks';

interface SEOConfig {
  // Basic SEO
  metaTitleEn: string;
  metaTitleAr: string;
  metaDescEn: string;
  metaDescAr: string;
  keywords: string[];
  canonicalUrl: string;
  metaRobots: string;

  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;

  // Twitter Cards
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;

  // Structured Data
  schemaType: string;
  schemaData: any;
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'social' | 'schema'>('content');
  const [locale, setLocale] = useState<'EN' | 'AR'>('EN');
  const [viewLanguage, setViewLanguage] = useState<'EN' | 'AR'>('EN'); // For toggling display language
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [isTranslatingTitle, setIsTranslatingTitle] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);
  const [newPage, setNewPage] = useState({
    titleEn: '',
    titleAr: '',
    slugEn: '',
    slugAr: '',
    descriptionEn: '',
    descriptionAr: '',
  });
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiGeneratedContent, setAiGeneratedContent] = useState<any>(null);
  const [visualComposerRef, setVisualComposerRef] = useState<any>(null);
  const [pageBlocks, setPageBlocks] = useState<any[]>([]);
  const [seoConfig, setSeoConfig] = useState<SEOConfig>({
    metaTitleEn: '',
    metaTitleAr: '',
    metaDescEn: '',
    metaDescAr: '',
    keywords: [],
    canonicalUrl: '',
    metaRobots: 'index, follow',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogType: 'website',
    ogUrl: '',
    twitterCard: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    schemaType: 'WebPage',
    schemaData: null,
  });

  useEffect(() => {
    fetchPages();
  }, []);

  // Auto-translate English title and slug to Arabic
  useEffect(() => {
    if (!newPage.titleEn) {
      return; // Don't translate if English title is empty
    }

    const timeoutId = setTimeout(async () => {
      setIsTranslatingTitle(true);
      try {
        // Translate title
        const titleResponse = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: newPage.titleEn,
            targetLanguage: 'ar',
          }),
        });

        if (titleResponse.ok) {
          const titleData = await titleResponse.json();

          // Translate the English slug to Arabic (translate the words, not just the title)
          const slugToTranslate = newPage.slugEn.replace(/-/g, ' '); // Convert "about-us" to "about us"
          const slugResponse = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: slugToTranslate,
              targetLanguage: 'ar',
            }),
          });

          let arabicSlug = newPage.slugEn; // Fallback to English slug
          if (slugResponse.ok) {
            const slugData = await slugResponse.json();
            // Create Arabic slug from translated text
            // Keep Arabic characters in the slug for better SEO
            arabicSlug = slugData.translatedText
              .toLowerCase()
              .trim()
              .replace(/\s+/g, '-')           // Replace spaces with hyphens
              .replace(/[^\u0600-\u06FF0-9-]/g, '') // Keep only Arabic letters, numbers, and hyphens
              .replace(/-+/g, '-')            // Replace multiple hyphens with single
              .replace(/^-|-$/g, '');         // Remove leading/trailing hyphens
          }

          setNewPage(prev => ({
            ...prev,
            titleAr: titleData.translatedText,
            slugAr: arabicSlug,
          }));
        }
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsTranslatingTitle(false);
      }
    }, 800); // Debounce: wait 800ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [newPage.titleEn, newPage.slugEn]);

  // Auto-translate English description to Arabic
  useEffect(() => {
    if (!newPage.descriptionEn) {
      return; // Don't translate if English description is empty
    }

    const timeoutId = setTimeout(async () => {
      setIsTranslatingDesc(true);
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: newPage.descriptionEn,
            targetLanguage: 'ar',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setNewPage(prev => ({
            ...prev,
            descriptionAr: data.translatedText,
          }));
        }
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsTranslatingDesc(false);
      }
    }, 800); // Debounce: wait 800ms after user stops typing

    return () => clearTimeout(timeoutId);
  }, [newPage.descriptionEn]);

  // Function to convert AI content to page blocks
  const convertAIContentToBlocks = async (content: any) => {
    const blocks = [];

    // Add hero section with title
    if (content.title) {
      blocks.push({
        id: `block-${Date.now()}-hero`,
        type: 'hero',
        data: {
          title: content.title,
          subtitle: content.metaDescription || '',
          backgroundImage: '',
          ctaText: 'Learn More',
          ctaLink: '#'
        }
      });
    }

    // Parse content and create text blocks
    if (content.content) {
      const sections = content.content.split('\n\n');

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i].trim();

        if (section.startsWith('#')) {
          // It's a heading with content
          const lines = section.split('\n');
          const heading = lines[0].replace(/^#+\s*/, '');
          const text = lines.slice(1).join('\n').trim();

          blocks.push({
            id: `block-${Date.now()}-${i}`,
            type: 'text_image_split',
            data: {
              heading,
              text,
              imageUrl: '',
              imagePosition: i % 2 === 0 ? 'right' : 'left'
            }
          });
        } else if (section.length > 100) {
          // Regular text block
          blocks.push({
            id: `block-${Date.now()}-text-${i}`,
            type: 'rich_text',
            data: {
              content: section
            }
          });
        }
      }
    }

    // Add FAQ section if available
    if (content.faqs && content.faqs.length > 0) {
      blocks.push({
        id: `block-${Date.now()}-faq`,
        type: 'faq',
        data: {
          title: 'Frequently Asked Questions',
          items: content.faqs.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer
          }))
        }
      });
    }

    // Add CTA section at the end
    blocks.push({
      id: `block-${Date.now()}-cta`,
      type: 'cta',
      data: {
        title: 'Ready to Get Started?',
        description: 'Contact us today to learn more about our services.',
        buttonText: 'Contact Us',
        buttonLink: '/contact'
      }
    });

    return blocks;
  };

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageSelect = async (page: Page) => {
    setSelectedPage(page);

    // Fetch page blocks
    try {
      const response = await fetch(`/api/pages/${page.id}/components`);
      if (response.ok) {
        const blocks = await response.json();
        setPageBlocks(blocks);
      }
    } catch (error) {
      console.error('Failed to fetch page blocks:', error);
    }

    // Load SEO config from page
    setSeoConfig({
      metaTitleEn: page.seoMetaTitleEn || '',
      metaTitleAr: page.seoMetaTitleAr || '',
      metaDescEn: page.seoMetaDescEn || '',
      metaDescAr: page.seoMetaDescAr || '',
      keywords: page.seoKeywords || [],
      canonicalUrl: (page as any).canonicalUrl || '',
      metaRobots: (page as any).metaRobots || 'index, follow',
      ogTitle: (page as any).ogTitle || '',
      ogDescription: (page as any).ogDescription || '',
      ogImage: (page as any).ogImage || '',
      ogType: (page as any).ogType || 'website',
      ogUrl: (page as any).ogUrl || '',
      twitterCard: (page as any).twitterCard || 'summary_large_image',
      twitterTitle: (page as any).twitterTitle || '',
      twitterDescription: (page as any).twitterDescription || '',
      twitterImage: (page as any).twitterImage || '',
      schemaType: (page as any).schemaType || 'WebPage',
      schemaData: (page as any).schemaData || null,
    });
  };

  const handleSeoUpdate = async () => {
    if (!selectedPage) return;

    try {
      const response = await fetch(`/api/pages/${selectedPage.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seoMetaTitleEn: seoConfig.metaTitleEn,
          seoMetaTitleAr: seoConfig.metaTitleAr,
          seoMetaDescEn: seoConfig.metaDescEn,
          seoMetaDescAr: seoConfig.metaDescAr,
          seoKeywords: seoConfig.keywords,
          canonicalUrl: seoConfig.canonicalUrl || null,
          metaRobots: seoConfig.metaRobots,
          ogTitle: seoConfig.ogTitle || null,
          ogDescription: seoConfig.ogDescription || null,
          ogImage: seoConfig.ogImage || null,
          ogType: seoConfig.ogType,
          ogUrl: seoConfig.ogUrl || null,
          twitterCard: seoConfig.twitterCard,
          twitterTitle: seoConfig.twitterTitle || null,
          twitterDescription: seoConfig.twitterDescription || null,
          twitterImage: seoConfig.twitterImage || null,
          schemaType: seoConfig.schemaType,
          schemaData: seoConfig.schemaData,
        }),
      });

      if (response.ok) {
        alert('SEO settings saved successfully!');
        fetchPages();
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to save SEO settings'}`);
      }
    } catch (error) {
      console.error('Error updating SEO:', error);
      alert('Error updating SEO settings. Please try again.');
    }
  };

  const handleCreatePage = async () => {
    setCreateError('');

    // Validation
    if (!newPage.titleEn || !newPage.slugEn) {
      setCreateError('English title and slug are required');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: {
            en: newPage.titleEn,
            ar: newPage.titleAr || newPage.titleEn,
          },
          slug: {
            en: newPage.slugEn,
            ar: newPage.slugAr || newPage.slugEn,
          },
          description: {
            en: newPage.descriptionEn || '',
            ar: newPage.descriptionAr || newPage.descriptionEn || '',
          },
          status: 'draft',
        }),
      });

      if (response.ok) {
        const createdPage = await response.json();
        await fetchPages();
        setShowCreateModal(false);
        setNewPage({
          titleEn: '',
          titleAr: '',
          slugEn: '',
          slugAr: '',
          descriptionEn: '',
          descriptionAr: '',
        });
        setSelectedPage(createdPage);
      } else {
        const error = await response.json();
        setCreateError(error.error || error.message || 'Failed to create page');
      }
    } catch (error) {
      console.error('Error creating page:', error);
      setCreateError('An error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Auto-generate slug from title (on every change)
  const handleTitleChange = (value: string, lang: 'en' | 'ar') => {
    const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    setNewPage(prev => ({
      ...prev,
      ...(lang === 'en' ? { titleEn: value, slugEn: slug } : { titleAr: value, slugAr: slug }),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pages</h1>
                <p className="text-sm text-gray-500">Build & optimize pages for SEO</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              + Create New Page
            </button>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Pages List Sidebar */}
        <aside className="w-80 bg-white shadow-sm border-r overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Pages ({pages.length})
              </h2>
              <LanguageToggle
                currentLanguage={viewLanguage}
                onChange={setViewLanguage}
                variant="pill"
              />
            </div>

            <div className="space-y-2">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPage?.id === page.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageSelect(page)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      {viewLanguage === 'EN' ? (
                        <>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-semibold">EN</span>
                            <h3 className="font-semibold text-gray-900 truncate">
                              {page.title?.en || 'Untitled'}
                            </h3>
                          </div>
                          {page.description?.en && (
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2 ml-6">
                              {page.description.en}
                            </p>
                          )}
                          <div className="flex items-center text-xs text-gray-500 ml-6">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <code className="text-[10px]">/{page.slug?.en}</code>
                          </div>
                        </>
                      ) : (
                        <div dir="rtl">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {page.title?.ar || page.title?.en || 'بدون عنوان'}
                            </h3>
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-semibold">AR</span>
                          </div>
                          {page.description?.ar && (
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2 mr-6">
                              {page.description.ar}
                            </p>
                          )}
                          <div className="flex items-center text-xs text-gray-500 mr-6">
                            <code className="text-[10px]">/{page.slug?.ar || page.slug?.en}</code>
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                        page.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {page.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-3 text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        {page.blocks?.length || 0}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (page.seo?.metaTitle?.en && page.seo?.metaDescription?.en)
                              ? 'bg-green-500 w-4/5'
                              : 'bg-yellow-500 w-2/5'
                          }`}
                        />
                      </div>
                      <span className="text-gray-700 font-medium text-[10px]">
                        {(page.seo?.metaTitle?.en && page.seo?.metaDescription?.en) ? '80%' : '40%'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Page Editor */}
        <main className="flex-1 overflow-y-auto">
          {selectedPage ? (
            <div className="max-w-5xl mx-auto p-8">
              {/* Page Header - Showing which page you're editing */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-md p-6 mb-6 border-2 border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Currently Editing
                      </div>
                      <AnimatedLanguageToggle
                        currentLanguage={viewLanguage}
                        onChange={setViewLanguage}
                      />
                    </div>

                    {viewLanguage === 'EN' ? (
                      /* English Title & Description */
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-white/80 rounded text-xs font-medium text-gray-600 border border-gray-200">EN</span>
                          <h2 className="text-2xl font-bold text-gray-900">
                            {selectedPage.title?.en || 'Untitled Page'}
                          </h2>
                        </div>
                        {selectedPage.description?.en && (
                          <p className="text-gray-700 ml-11 mb-2">
                            {selectedPage.description.en}
                          </p>
                        )}
                        <div className="flex items-center ml-11 text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <code className="bg-white/80 px-2 py-0.5 rounded border border-gray-200">/{selectedPage.slug?.en}</code>
                        </div>
                      </div>
                    ) : (
                      /* Arabic Title & Description */
                      <div dir="rtl">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {selectedPage.title?.ar || selectedPage.title?.en || 'عنوان غير محدد'}
                          </h2>
                          <span className="px-2 py-0.5 bg-white/80 rounded text-xs font-medium text-gray-600 border border-gray-200">AR</span>
                        </div>
                        {selectedPage.description?.ar && (
                          <p className="text-gray-700 mr-11 mb-2">
                            {selectedPage.description.ar}
                          </p>
                        )}
                        <div className="flex items-center mr-11 text-sm text-gray-600">
                          <code className="bg-white/80 px-2 py-0.5 rounded border border-gray-200">/{selectedPage.slug?.ar || selectedPage.slug?.en}</code>
                          <svg className="w-4 h-4 ml-1.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Page Meta Info */}
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 text-sm">
                      <span className={`flex items-center px-3 py-1 rounded-full font-medium ${
                        selectedPage.status === 'published'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {selectedPage.status}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Updated {new Date(selectedPage.updatedAt).toLocaleString()}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        {selectedPage.blocks?.length || 0} blocks
                      </span>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl">
                    Publish
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {[
                      { id: 'content', label: 'Content', icon: '📝' },
                      { id: 'seo', label: 'SEO Settings', icon: '🎯' },
                      { id: 'social', label: 'Social Sharing', icon: '🔗' },
                      { id: 'schema', label: 'Schema.org', icon: '⚡' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-8">
                  {/* Content Tab */}
                  {activeTab === 'content' && (
                    <div className="space-y-6">
                      {/* Locale Selector and AI Tools */}
                      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Page Components</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Build your page by adding and arranging components
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          {/* AI Content Generator Button */}
                          <button
                            onClick={() => setShowAIGenerator(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-medium">AI Content</span>
                          </button>

                          <span className="text-sm text-gray-600">Editing:</span>
                          <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => setLocale('EN')}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                locale === 'EN'
                                  ? 'bg-white text-blue-600 shadow-sm'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              English
                            </button>
                            <button
                              onClick={() => setLocale('AR')}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                locale === 'AR'
                                  ? 'bg-white text-blue-600 shadow-sm'
                                  : 'text-gray-600 hover:text-gray-900'
                              }`}
                            >
                              العربية
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* AI-Generated Content Alert */}
                      {aiGeneratedContent && (
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-start">
                            <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">AI Content Ready!</h4>
                              <p className="text-sm text-gray-600 mb-3">
                                Generated content is ready to be added to your page. You can edit it after adding.
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={async () => {
                                    try {
                                      // Convert AI content to blocks
                                      const newBlocks = await convertAIContentToBlocks(aiGeneratedContent);

                                      // Add new blocks to existing blocks
                                      const updatedBlocks = [...pageBlocks, ...newBlocks];
                                      setPageBlocks(updatedBlocks);

                                      // Save blocks to the page
                                      const response = await fetch(`/api/pages/${selectedPage.id}/components`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ components: updatedBlocks }),
                                      });

                                      if (response.ok) {
                                        alert('✅ AI content added to page successfully!');
                                        setAiGeneratedContent(null);
                                      } else {
                                        throw new Error('Failed to add content to page');
                                      }
                                    } catch (error) {
                                      console.error('Error adding AI content:', error);
                                      alert('❌ Error adding content. Please try again.');
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  Add to Page
                                </button>
                                <button
                                  onClick={() => setAiGeneratedContent(null)}
                                  className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Draggable Blocks - Drag & Drop Interface */}
                      <DraggableBlocks
                        blocks={pageBlocks}
                        locale={locale}
                        onReorder={async (reorderedBlocks) => {
                          try {
                            setPageBlocks(reorderedBlocks); // Update local state immediately

                            const response = await fetch(`/api/pages/${selectedPage.id}/components`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ components: reorderedBlocks }),
                            });

                            if (!response.ok) {
                              throw new Error('Failed to save reordered blocks');
                            }
                          } catch (error) {
                            console.error('Error reordering blocks:', error);
                            alert('❌ Error saving block order. Please try again.');
                          }
                        }}
                        onEdit={(block) => {
                          // TODO: Open block editor
                          alert('Block editing coming soon!');
                        }}
                        onDelete={async (blockId) => {
                          try {
                            const updatedBlocks = pageBlocks.filter(b => b.id !== blockId);
                            setPageBlocks(updatedBlocks);

                            const response = await fetch(`/api/pages/${selectedPage.id}/components`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ components: updatedBlocks }),
                            });

                            if (response.ok) {
                              alert('✅ Block deleted successfully!');
                            } else {
                              throw new Error('Failed to delete block');
                            }
                          } catch (error) {
                            console.error('Error deleting block:', error);
                            alert('❌ Error deleting block. Please try again.');
                          }
                        }}
                      />

                      {/* Visual Block Composer - For Adding New Blocks */}
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Blocks</h3>
                        <VisualBlockComposer
                          pageId={selectedPage.id}
                          locale={locale}
                          existingBlocks={pageBlocks}
                          onSave={async (instances) => {
                            try {
                              const updatedBlocks = [...pageBlocks, ...instances];
                              setPageBlocks(updatedBlocks);

                              const response = await fetch(`/api/pages/${selectedPage.id}/components`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ components: updatedBlocks }),
                              });

                              if (response.ok) {
                                alert('✅ New blocks added successfully!');
                              } else {
                                throw new Error('Failed to save components');
                              }
                            } catch (error) {
                              console.error('Error saving components:', error);
                              alert('❌ Error saving components. Please try again.');
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* SEO Tab */}
                  {activeTab === 'seo' && (
                    <div className="space-y-6">
                      {/* Real-time SEO Analyzer */}
                      <SEOAnalyzer
                        titleEn={seoConfig.metaTitleEn || selectedPage?.title?.en}
                        titleAr={seoConfig.metaTitleAr || selectedPage?.title?.ar}
                        descriptionEn={seoConfig.metaDescEn || selectedPage?.description?.en}
                        descriptionAr={seoConfig.metaDescAr || selectedPage?.description?.ar}
                        content=""
                        slug={selectedPage?.slug?.en}
                        keywords={seoConfig.keywords}
                      />

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <span className="mr-2">🎯</span>
                          Basic SEO Settings
                        </h3>

                        {/* Meta Title */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Title (English) *
                              <span className="ml-2 text-xs text-gray-500">
                                {seoConfig.metaTitleEn.length}/60
                              </span>
                            </label>
                            <input
                              type="text"
                              value={seoConfig.metaTitleEn}
                              onChange={(e) => setSeoConfig({...seoConfig, metaTitleEn: e.target.value})}
                              maxLength={60}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter meta title..."
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Optimal: 50-60 characters. Include 1-2 keywords.
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Title (Arabic) *
                              <span className="ml-2 text-xs text-gray-500">
                                {seoConfig.metaTitleAr.length}/60
                              </span>
                            </label>
                            <input
                              type="text"
                              value={seoConfig.metaTitleAr}
                              onChange={(e) => setSeoConfig({...seoConfig, metaTitleAr: e.target.value})}
                              maxLength={60}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="أدخل عنوان الميتا..."
                              dir="rtl"
                            />
                          </div>
                        </div>

                        {/* Meta Description */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Description (English) *
                              <span className="ml-2 text-xs text-gray-500">
                                {seoConfig.metaDescEn.length}/155
                              </span>
                            </label>
                            <textarea
                              value={seoConfig.metaDescEn}
                              onChange={(e) => setSeoConfig({...seoConfig, metaDescEn: e.target.value})}
                              maxLength={155}
                              rows={3}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter meta description..."
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Optimal: 120-155 characters. Include 2-3 keywords.
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Meta Description (Arabic) *
                              <span className="ml-2 text-xs text-gray-500">
                                {seoConfig.metaDescAr.length}/155
                              </span>
                            </label>
                            <textarea
                              value={seoConfig.metaDescAr}
                              onChange={(e) => setSeoConfig({...seoConfig, metaDescAr: e.target.value})}
                              maxLength={155}
                              rows={3}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="أدخل وصف الميتا..."
                              dir="rtl"
                            />
                          </div>
                        </div>

                        {/* Keywords */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Focus Keywords
                          </label>
                          <input
                            type="text"
                            placeholder="Enter keywords separated by commas..."
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onBlur={(e) => {
                              const keywords = e.target.value.split(',').map(k => k.trim()).filter(k => k);
                              setSeoConfig({...seoConfig, keywords});
                            }}
                          />
                          <div className="mt-2 flex flex-wrap gap-2">
                            {seoConfig.keywords.map((keyword, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Advanced SEO */}
                        <div className="pt-6 border-t border-gray-200">
                          <h4 className="text-md font-semibold text-gray-900 mb-4">Advanced Settings</h4>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Canonical URL
                              </label>
                              <input
                                type="url"
                                value={seoConfig.canonicalUrl || ''}
                                onChange={(e) => setSeoConfig({...seoConfig, canonicalUrl: e.target.value})}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="https://example.com/page"
                              />
                              <p className="mt-1 text-xs text-gray-500">Prevents duplicate content issues</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Robots
                              </label>
                              <select
                                value={seoConfig.metaRobots || 'index, follow'}
                                onChange={(e) => setSeoConfig({...seoConfig, metaRobots: e.target.value})}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="index, follow">Index, Follow (Default)</option>
                                <option value="noindex, follow">No Index, Follow</option>
                                <option value="index, nofollow">Index, No Follow</option>
                                <option value="noindex, nofollow">No Index, No Follow</option>
                              </select>
                              <p className="mt-1 text-xs text-gray-500">Controls search engine crawling</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                          <button
                            onClick={handleSeoUpdate}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                          >
                            Save SEO Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Tab */}
                  {activeTab === 'social' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🔗</span>
                        Social Media Sharing
                      </h3>

                      {/* Open Graph */}
                      <div className="bg-gray-50 rounded-xl p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Open Graph (Facebook, LinkedIn, etc.)
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">OG Title</label>
                            <input
                              type="text"
                              value={seoConfig.ogTitle || seoConfig.metaTitleEn}
                              onChange={(e) => setSeoConfig({...seoConfig, ogTitle: e.target.value})}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Defaults to meta title if empty"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">OG Description</label>
                            <textarea
                              value={seoConfig.ogDescription || seoConfig.metaDescEn}
                              onChange={(e) => setSeoConfig({...seoConfig, ogDescription: e.target.value})}
                              rows={2}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Defaults to meta description if empty"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
                            <input
                              type="url"
                              value={seoConfig.ogImage || ''}
                              onChange={(e) => setSeoConfig({...seoConfig, ogImage: e.target.value})}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://example.com/image.jpg"
                            />
                            <p className="mt-1 text-xs text-gray-500">Recommended: 1200×630px</p>
                          </div>
                        </div>
                      </div>

                      {/* Twitter Cards */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                          Twitter Cards
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Type</label>
                            <select
                              value={seoConfig.twitterCard || 'summary_large_image'}
                              onChange={(e) => setSeoConfig({...seoConfig, twitterCard: e.target.value})}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="summary">Summary</option>
                              <option value="summary_large_image">Summary with Large Image</option>
                              <option value="app">App</option>
                              <option value="player">Player</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Title</label>
                            <input
                              type="text"
                              value={seoConfig.twitterTitle || seoConfig.metaTitleEn}
                              onChange={(e) => setSeoConfig({...seoConfig, twitterTitle: e.target.value})}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Defaults to meta title if empty"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Image</label>
                            <input
                              type="url"
                              value={seoConfig.twitterImage || seoConfig.ogImage || ''}
                              onChange={(e) => setSeoConfig({...seoConfig, twitterImage: e.target.value})}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Defaults to OG image if empty"
                            />
                            <p className="mt-1 text-xs text-gray-500">Recommended: 800×418px (summary_large_image)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Schema Tab */}
                  {activeTab === 'schema' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">⚡</span>
                        Structured Data (Schema.org)
                      </h3>

                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-start">
                          <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Why Structured Data?</h4>
                            <p className="text-sm text-gray-700 mb-3">
                              Structured data helps search engines understand your content and can result in rich snippets (star ratings, breadcrumbs, FAQ cards) in search results.
                            </p>
                            <p className="text-sm text-gray-700">
                              <strong>2025 Trend:</strong> With Google's AI Overview dominating search results, proper structured data is more important than ever.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Schema Type</label>
                        <select
                          value={seoConfig.schemaType || 'WebPage'}
                          onChange={(e) => setSeoConfig({...seoConfig, schemaType: e.target.value})}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="WebPage">WebPage (Default)</option>
                          <option value="Article">Article</option>
                          <option value="Product">Product</option>
                          <option value="Service">Service</option>
                          <option value="LocalBusiness">Local Business</option>
                          <option value="FAQPage">FAQ Page</option>
                          <option value="HowTo">How-To</option>
                          <option value="Recipe">Recipe</option>
                        </select>
                      </div>

                      <div className="bg-gray-900 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-100">JSON-LD Preview</h4>
                          <button className="text-xs text-blue-400 hover:text-blue-300">Copy Code</button>
                        </div>
                        <pre className="text-xs text-green-400 overflow-x-auto">
{`{
  "@context": "https://schema.org",
  "@type": "${seoConfig.schemaType || 'WebPage'}",
  "name": "${seoConfig.metaTitleEn || 'Page Title'}",
  "description": "${seoConfig.metaDescEn || 'Page Description'}",
  "url": "${seoConfig.canonicalUrl || 'https://example.com/page'}"
}`}
                        </pre>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start">
                          <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-blue-900">
                            <strong>Pro Tip:</strong> Test your structured data with{' '}
                            <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700">
                              Google's Rich Results Test
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Select a Page to Edit
                </h3>
                <p className="text-gray-600 mb-6">
                  Choose a page from the sidebar to start building and optimizing content with our advanced SEO tools.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-2">2025 SEO Features</h4>
                  <ul className="text-sm text-gray-700 space-y-1 text-left">
                    <li>✓ Meta tags optimization</li>
                    <li>✓ Open Graph & Twitter Cards</li>
                    <li>✓ Schema.org structured data</li>
                    <li>✓ Real-time character counters</li>
                    <li>✓ SEO score indicators</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Page</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {createError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {createError}
                </div>
              )}

              {/* English Fields */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">English Content</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    value={newPage.titleEn}
                    onChange={(e) => handleTitleChange(e.target.value, 'en')}
                    placeholder="e.g., About Us"
                    lang="en"
                    spellCheck={true}
                    autoCorrect="on"
                    autoCapitalize="words"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug (English) *
                  </label>
                  <input
                    type="text"
                    value={newPage.slugEn}
                    readOnly
                    placeholder="auto-generated-from-title"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-mono"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-generated from title
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    value={newPage.descriptionEn}
                    onChange={(e) => setNewPage(prev => ({ ...prev, descriptionEn: e.target.value }))}
                    rows={3}
                    placeholder="Brief description of the page..."
                    lang="en"
                    spellCheck={true}
                    autoCorrect="on"
                    autoCapitalize="sentences"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Arabic Fields */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900">Arabic Content</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title (Arabic)
                    {isTranslatingTitle && (
                      <span className="ml-2 text-xs text-blue-600">
                        <svg className="inline w-3 h-3 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Translating...
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={newPage.titleAr}
                    onChange={(e) => handleTitleChange(e.target.value, 'ar')}
                    placeholder="Auto-translated from English..."
                    dir="rtl"
                    lang="ar"
                    spellCheck={true}
                    autoCorrect="on"
                    autoCapitalize="words"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-translated from English title (you can edit if needed)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Slug (Arabic)
                    {isTranslatingTitle && (
                      <span className="ml-2 text-xs text-blue-600">
                        <svg className="inline w-3 h-3 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Translating...
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={newPage.slugAr || newPage.slugEn}
                    readOnly
                    placeholder="auto-translated-from-english-slug"
                    dir="rtl"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-mono"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-translated from English slug (e.g., "about-us" → "حول-نا")
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Arabic)
                    {isTranslatingDesc && (
                      <span className="ml-2 text-xs text-blue-600">
                        <svg className="inline w-3 h-3 animate-spin mr-1" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Translating...
                      </span>
                    )}
                  </label>
                  <textarea
                    value={newPage.descriptionAr}
                    onChange={(e) => setNewPage(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    rows={3}
                    placeholder="Auto-translated from English..."
                    dir="rtl"
                    lang="ar"
                    spellCheck={true}
                    autoCorrect="on"
                    autoCapitalize="sentences"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Auto-translated from English description (you can edit if needed)
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePage}
                disabled={isCreating || !newPage.titleEn || !newPage.slugEn}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Page'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Content Generator Modal */}
      {showAIGenerator && (
        <AIContentGenerator
          onClose={() => setShowAIGenerator(false)}
          onGenerate={(content) => {
            setAiGeneratedContent(content);
            setShowAIGenerator(false);
          }}
        />
      )}
    </div>
  );
}
