'use client';

import React, { useState, useEffect } from 'react';

interface Block {
  id: string;
  type?: string;
  data?: any;
  order?: number;
  // BlueprintInstance properties
  blueprint?: {
    name?: string;
    displayName?: string;
  };
  blueprintId?: string;
  dataEn?: any;
  dataAr?: any;
}

interface DraggableBlocksProps {
  blocks: Block[];
  onReorder: (blocks: Block[]) => void;
  onEdit?: (block: Block) => void;
  onDelete?: (blockId: string) => void;
  locale: 'EN' | 'AR';
}

export default function DraggableBlocks({
  blocks: initialBlocks,
  onReorder,
  onEdit,
  onDelete,
  locale
}: DraggableBlocksProps) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [draggedBlock, setDraggedBlock] = useState<Block | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  const handleDragStart = (e: React.DragEvent, block: Block, index: number) => {
    setDraggedBlock(block);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);

    // Add dragging class after a small delay to avoid visual glitch
    setTimeout(() => {
      const element = e.currentTarget as HTMLElement;
      element.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.classList.remove('opacity-50');
    setDraggedBlock(null);
    setDragOverIndex(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear dragOverIndex if we're leaving the container entirely
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (!draggedBlock) return;

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlock.id);
    if (draggedIndex === dropIndex) return;

    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(dropIndex, 0, removed);

    // Update order property
    const reorderedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index
    }));

    setBlocks(reorderedBlocks);
    onReorder(reorderedBlocks);
    setDragOverIndex(null);
  };

  const getBlockType = (block: Block): string => {
    // For BlueprintInstance blocks
    if (block.blueprint?.name) return block.blueprint.name;
    // For regular blocks
    return block.type || 'unknown';
  };

  const getBlockIcon = (block: Block) => {
    const type = getBlockType(block);
    const icons: { [key: string]: string } = {
      hero: '🏔️',
      hero_banner: '🏔️',
      text: '📝',
      text_content: '📝',
      image: '🖼️',
      video: '🎥',
      gallery: '🎨',
      features: '⭐',
      testimonials: '💬',
      cta: '🎯',
      faq: '❓',
      contact: '📧',
      contact_form: '📧',
      map: '🗺️',
      team: '👥',
      pricing: '💰',
      services: '🛠️',
      services_showcase: '🛠️',
      portfolio: '📁',
      portfolio_section: '📁',
      portfolio_display_home: '📁',
      blog: '📰',
      blog_section: '📰',
      rich_text: '📄',
      text_image_split: '🔀',
      services_grid: '⚡',
      process: '🔄',
      process_section: '🔄',
      values: '💎',
      about_section: '👥',
      company_description_home: '🏢',
      stats_section: '📊',
      animated_headline: '✨',
      separator: '➖',
      awards_section: '🏆',
      featured_in: '⭐',
      clients_section: '🤝',
      instagram_section: '📷'
    };
    return icons[type] || '📦';
  };

  const getBlockTitle = (block: Block) => {
    // For BlueprintInstance blocks
    if (block.blueprint?.displayName) return block.blueprint.displayName;

    // Try to get a title from data (works for both regular and BlueprintInstance)
    const data = block.dataEn || block.data || {};
    if (data.title) return data.title;
    if (data.heading) return data.heading;
    if (data.name) return data.name;

    // Format block type as title
    const type = getBlockType(block);
    return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const getBlockDescription = (block: Block) => {
    // Get data from either dataEn or data
    const data = block.dataEn || block.data || {};

    if (data.description) return data.description;
    if (data.subtitle) return data.subtitle;
    if (data.text) {
      const text = data.text;
      return typeof text === 'string' && text.length > 100 ? text.substring(0, 100) + '...' : text;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Page Blocks</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
            {blocks.length} blocks
          </span>
        </div>
        {isDragging && (
          <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Drag to reorder
          </div>
        )}
      </div>

      {/* Blocks List */}
      <div className="space-y-2">
        {blocks.map((block, index) => (
          <div
            key={block.id}
            draggable
            onDragStart={(e) => handleDragStart(e, block, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              relative bg-white rounded-xl border-2 transition-all cursor-move
              ${dragOverIndex === index ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              ${draggedBlock?.id === block.id ? 'opacity-50' : ''}
            `}
          >
            {/* Drop Indicator */}
            {dragOverIndex === index && (
              <div className="absolute -top-1 left-0 right-0 h-1 bg-blue-500 rounded-full animate-pulse" />
            )}

            <div className="flex items-start p-4">
              {/* Drag Handle */}
              <div className="flex-shrink-0 mr-4 cursor-move">
                <svg className="w-6 h-6 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </div>

              {/* Block Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">{getBlockIcon(block)}</span>
              </div>

              {/* Block Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {getBlockTitle(block)}
                    </h4>
                    {getBlockDescription(block) && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {getBlockDescription(block)}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-lg font-medium">
                        {getBlockType(block)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Position: {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(block);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit block"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this block?')) {
                            onDelete(block.id);
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete block"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Feedback for Dragging */}
            {isDragging && draggedBlock?.id !== block.id && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent opacity-50 animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {blocks.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No blocks yet</h3>
          <p className="text-gray-600">Start building your page by adding blocks</p>
        </div>
      )}

      {/* Instructions */}
      {blocks.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> Drag and drop blocks to reorder them. Your changes are saved automatically.
          </div>
        </div>
      )}
    </div>
  );
}