/**
 * Dynamic Page Builder Component
 * Drag-and-drop interface for building pages with content blocks
 */

'use client';

import React, { useState, useEffect } from 'react';
// Note: Drag-and-drop functionality will be added after installing dependencies
import BlockSelector from './BlockSelector';
import BlockEditor from './BlockEditor';
import PagePreview from './PagePreview';
import WebsiteThumbnailPreview from './WebsiteThumbnailPreview';
import { Page, PageBlock } from '@/lib/db';

interface PageBuilderProps {
  page: Page;
  onUpdate: (pageId: string, updates: Partial<Page>) => void;
  onStatusToggle: (page: Page) => void;
}

interface BlockType {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: Record<string, unknown>;
}

// Generate unique ID for blocks
function generateBlockId(): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomPart}`;
}

// Helper type for bilingual text fields
type BilingualText = { en?: string; ar?: string };

// Type-safe helpers for block data access
const getText = (field: unknown): BilingualText | undefined =>
  field as BilingualText | undefined;

const getStatsPreview = (stats: unknown): string => {
  if (!Array.isArray(stats)) return '';
  return stats
    .slice(0, 4)
    .map((stat: any) => stat.number || '')
    .filter(Boolean)
    .join(', ');
};

export default function PageBuilder({ page, onUpdate, onStatusToggle }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(page.blocks);
  const [blockTypes, setBlockTypes] = useState<BlockType[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<PageBlock | null>(null);
  const [isBlockSelectorOpen, setIsBlockSelectorOpen] = useState(false);
  const [isBlockEditorOpen, setIsBlockEditorOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBlockTypes();
  }, []);

  useEffect(() => {
    setBlocks(page.blocks);
  }, [page.blocks]);

  const fetchBlockTypes = async () => {
    try {
      const response = await fetch('/api/blocks');
      const data = await response.json();
      setBlockTypes(data.blockTypes);
    } catch (error) {
      console.error('Error fetching block types:', error);
    }
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    // Swap blocks
    [newBlocks[blockIndex], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[blockIndex]];

    // Update order values
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      order: index + 1
    }));

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);
  };

  const saveBlocks = async (updatedBlocks: PageBlock[]) => {
    setIsSaving(true);
    try {
      await onUpdate(page.id, { blocks: updatedBlocks });
    } catch (error) {
      console.error('Error saving blocks:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlock = (blockTypeId: string) => {
    const blockType = blockTypes.find(bt => bt.id === blockTypeId);
    if (!blockType) return;

    const newBlock: PageBlock = {
      id: generateBlockId(),
      type: blockTypeId,
      order: blocks.length + 1,
      data: generateDefaultBlockData(blockType.fields)
    };

    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);
    setIsBlockSelectorOpen(false);
  };

  const handleEditBlock = (block: PageBlock) => {
    setSelectedBlock(block);
    setIsBlockEditorOpen(true);
  };

  const handleUpdateBlock = (updatedBlock: PageBlock) => {
    const updatedBlocks = blocks.map(block =>
      block.id === updatedBlock.id ? updatedBlock : block
    );
    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);
    setIsBlockEditorOpen(false);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (confirm('Are you sure you want to delete this block?')) {
      const updatedBlocks = blocks
        .filter(block => block.id !== blockId)
        .map((block, index) => ({ ...block, order: index + 1 }));

      setBlocks(updatedBlocks);
      saveBlocks(updatedBlocks);
    }
  };

  const handleDuplicateBlock = (block: PageBlock) => {
    const duplicatedBlock: PageBlock = {
      ...block,
      id: generateBlockId(),
      order: block.order + 1
    };

    const updatedBlocks = [
      ...blocks.slice(0, block.order),
      duplicatedBlock,
      ...blocks.slice(block.order).map(b => ({ ...b, order: b.order + 1 }))
    ];

    setBlocks(updatedBlocks);
    saveBlocks(updatedBlocks);
  };

  const generateDefaultBlockData = (fields: Record<string, unknown>): Record<string, unknown> => {
    const defaultData: Record<string, unknown> = {};

    Object.entries(fields).forEach(([key, fieldValue]) => {
      const field = fieldValue as { bilingual?: boolean; default?: unknown; type?: string };
      if (field.bilingual) {
        defaultData[key] = { en: '', ar: '' };
      } else if (field.default !== undefined) {
        defaultData[key] = field.default;
      } else if (field.type === 'boolean') {
        defaultData[key] = false;
      } else if (field.type === 'number') {
        defaultData[key] = 0;
      } else if (field.type === 'gallery' || field.type === 'repeater') {
        defaultData[key] = [];
      } else {
        defaultData[key] = '';
      }
    });

    return defaultData;
  };

  const getBlockTypeName = (blockTypeId: string) => {
    const blockType = blockTypes.find(bt => bt.id === blockTypeId);
    return blockType?.name || blockTypeId;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{page.title.en}</h1>
            <p className="text-sm text-gray-500">{page.description.en}</p>
          </div>
          {isSaving && (
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Saving...
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isPreviewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => onStatusToggle(page)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              page.status === 'published'
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            }`}
          >
            {page.status === 'published' ? 'Published' : 'Draft'}
          </button>
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Preview Page
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Blocks Panel */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Page Blocks</h2>
              <span className="text-sm text-gray-500">({blocks.length})</span>
            </div>
            <button
              onClick={() => setIsBlockSelectorOpen(true)}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Block
            </button>
          </div>

          {/* Blocks List */}
          <div className="flex-1 overflow-y-auto p-4">
            {blocks.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mb-4">No blocks yet</p>
                <button
                  onClick={() => setIsBlockSelectorOpen(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Add your first block
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {blocks
                  .sort((a, b) => a.order - b.order)
                  .map((block, index) => (
                    <div
                      key={block.id}
                      className="bg-gray-50 border rounded-lg p-3 hover:bg-gray-100"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start space-x-3">
                          <div className="flex flex-col space-y-1 mt-1">
                            <button
                              onClick={() => handleMoveBlock(block.id, 'up')}
                              disabled={index === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleMoveBlock(block.id, 'down')}
                              disabled={index === blocks.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          <div className="flex-shrink-0">
                            <WebsiteThumbnailPreview block={block} size="small" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {getBlockTypeName(block.type)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEditBlock(block)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title="Edit block"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDuplicateBlock(block)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                            title="Duplicate block"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete block"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p className="font-medium line-clamp-1">
                          {getText(block.data.title)?.en || getText(block.data.heading)?.en || getBlockTypeName(block.type)}
                        </p>
                        <p className="text-gray-500 line-clamp-2">
                          {block.type === 'stats_section'
                            ? getStatsPreview(block.data.stats) || 'Statistics'
                            : (getText(block.data.subtitle)?.en ||
                               getText(block.data.description)?.en ||
                               getText(block.data.content)?.en?.replace(/<[^>]*>/g, '').substring(0, 60) ||
                               getText(block.data.text)?.en ||
                               'Block content preview')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 bg-gray-50">
          {isPreviewMode ? (
            <div className="h-full overflow-y-auto">
              <iframe
                src={`http://localhost:3005/${page.slug.en}?preview=true`}
                className="w-full h-full border-none"
                title="Page Preview"
              />
            </div>
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm min-h-96">
                  {blocks.length === 0 ? (
                    <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your page</h3>
                        <p className="text-gray-600 mb-4">Add content blocks to create your page layout</p>
                        <button
                          onClick={() => setIsBlockSelectorOpen(true)}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
                        >
                          Add First Block
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 p-6">
                      {blocks
                        .sort((a, b) => a.order - b.order)
                        .map((block) => (
                          <div
                            key={block.id}
                            className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors group cursor-pointer"
                            onClick={() => handleEditBlock(block)}
                          >
                            <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                {getBlockTypeName(block.type)}
                              </span>
                              <span className="text-xs text-gray-500">Order: {block.order}</span>
                            </div>
                            <div className="p-4 bg-white">
                              <div className="text-sm text-gray-600">
                                {getText(block.data.title)?.en && (
                                  <div className="font-medium mb-1">{getText(block.data.title)?.en}</div>
                                )}
                                {getText(block.data.description)?.en && (
                                  <div className="text-xs text-gray-500 line-clamp-2">{getText(block.data.description)?.en}</div>
                                )}
                                {getText(block.data.text)?.en && (
                                  <div className="text-xs text-gray-500 line-clamp-2">{getText(block.data.text)?.en}</div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Block Selector Modal */}
      {isBlockSelectorOpen && (
        <BlockSelector
          blockTypes={blockTypes}
          onSelectBlock={handleAddBlock}
          onClose={() => setIsBlockSelectorOpen(false)}
        />
      )}

      {/* Block Editor Modal */}
      {isBlockEditorOpen && selectedBlock && (
        <BlockEditor
          block={selectedBlock}
          blockType={blockTypes.find(bt => bt.id === selectedBlock.type)}
          onSave={handleUpdateBlock}
          onClose={() => setIsBlockEditorOpen(false)}
        />
      )}

      {/* Page Preview Modal */}
      <PagePreview
        page={{ ...page, blocks }}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}