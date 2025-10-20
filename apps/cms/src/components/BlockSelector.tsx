/**
 * Block Selector Component
 * Modal interface for selecting block types to add to pages
 */

'use client';

import React, { useState, useMemo } from 'react';
import WebsiteThumbnailPreview from './WebsiteThumbnailPreview';

interface BlockType {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: Record<string, unknown>;
}

interface Category {
  id: string;
  name: string;
}

interface BlockSelectorProps {
  blockTypes: BlockType[];
  onSelectBlock: (blockTypeId: string) => void;
  onClose: () => void;
}

const categories: Category[] = [
  { id: 'all', name: 'All Blocks' },
  { id: 'headers', name: 'Headers & Banners' },
  { id: 'content', name: 'Content Sections' },
  { id: 'social_proof', name: 'Social Proof' },
  { id: 'forms', name: 'Forms & Contact' },
  { id: 'media', name: 'Media & Galleries' },
  { id: 'interactive', name: 'Interactive Elements' },
  { id: 'decorative', name: 'Decorative Elements' },
  { id: 'advanced', name: 'Advanced' }
];

const blockIcons: Record<string, string> = {
  hero_banner: '🎯',
  featured_in: '⭐',
  our_clients: '🤝',
  animated_headline: '✨',
  about_section: 'ℹ️',
  contact_form: '📝',
  portfolio_section: '🖼️',
  services_section: '🔧',
  blog_section: '📚',
  benefits_swiper: '🎠',
  accordion_swiper: '📋',
  gallery_section: '🖼️',
  awards_section: '🏆',
  press_articles: '📰',
  custom_html: '💻',
  text_content: '📄',
  cta_section: '🚀',
  stats_section: '📊',
  faq_section: '❓',
  testimonials_section: '💬',
  video_section: '🎥',
  team_section: '👥',
  partners_section: '🤝',
  key_facts_section: '📋',
  vision_mission_section: '🎯',
  timeline_section: '📅'
};

export default function BlockSelector({ blockTypes, onSelectBlock, onClose }: BlockSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlocks = useMemo(() => {
    let filtered = blockTypes;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(block => block.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(block =>
        block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        block.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [blockTypes, selectedCategory, searchTerm]);

  const handleBlockSelect = (blockTypeId: string) => {
    onSelectBlock(blockTypeId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Add Content Block</h2>
            <p className="text-sm text-gray-500 mt-1">Choose a block type to add to your page</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blocks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Block Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blocks found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'No blocks available in this category'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBlocks.map((blockType) => (
                <div
                  key={blockType.id}
                  onClick={() => handleBlockSelect(blockType.id)}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 space-y-2">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg group-hover:bg-blue-100 transition-colors">
                        {blockIcons[blockType.id] || '📦'}
                      </div>
                      <div className="flex justify-center">
                        <WebsiteThumbnailPreview
                          block={{
                            id: 'preview',
                            type: blockType.id,
                            data: blockType.fields,
                            order: 0
                          }}
                          size="small"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {blockType.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {blockType.description}
                      </p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {categories.find(c => c.id === blockType.category)?.name || blockType.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Preview of fields */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Fields: {Object.keys(blockType.fields).slice(0, 3).join(', ')}
                      {Object.keys(blockType.fields).length > 3 && '...'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {filteredBlocks.length} block{filteredBlocks.length !== 1 ? 's' : ''} available
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}