/**
 * Block Builder Management Interface
 * Create, edit, and manage custom block types
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlockType {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: Record<string, any>;
  isCustom?: boolean;
}

interface FieldDefinition {
  type: string;
  bilingual?: boolean;
  required?: boolean;
  default?: any;
  options?: string[];
  min?: number;
  max?: number;
  subFields?: Record<string, FieldDefinition>;
}

const fieldTypes = [
  { id: 'text', name: 'Text', description: 'Single line text input' },
  { id: 'textarea', name: 'Textarea', description: 'Multi-line text input' },
  { id: 'richtext', name: 'Rich Text', description: 'WYSIWYG editor' },
  { id: 'number', name: 'Number', description: 'Numeric input' },
  { id: 'boolean', name: 'Boolean', description: 'True/false toggle' },
  { id: 'select', name: 'Select', description: 'Dropdown selection' },
  { id: 'image', name: 'Image', description: 'Image upload' },
  { id: 'video', name: 'Video', description: 'Video upload/URL' },
  { id: 'color', name: 'Color', description: 'Color picker' },
  { id: 'date', name: 'Date', description: 'Date picker' },
  { id: 'email', name: 'Email', description: 'Email input' },
  { id: 'url', name: 'URL', description: 'URL input' },
  { id: 'gallery', name: 'Gallery', description: 'Multiple images' },
  { id: 'repeater', name: 'Repeater', description: 'Repeatable field group' },
  { id: 'group', name: 'Group', description: 'Field group' },
  { id: 'code', name: 'Code', description: 'Code editor' }
];

const categories = [
  { id: 'headers', name: 'Headers & Banners' },
  { id: 'content', name: 'Content Sections' },
  { id: 'social_proof', name: 'Social Proof' },
  { id: 'forms', name: 'Forms & Contact' },
  { id: 'media', name: 'Media & Galleries' },
  { id: 'interactive', name: 'Interactive Elements' },
  { id: 'decorative', name: 'Decorative Elements' },
  { id: 'advanced', name: 'Advanced' }
];

export default function BlockBuilderPage() {
  const [blockTypes, setBlockTypes] = useState<BlockType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // New block form state
  const [newBlock, setNewBlock] = useState({
    name: '',
    description: '',
    category: 'content',
    fields: {} as Record<string, FieldDefinition>
  });

  useEffect(() => {
    fetchBlockTypes();
  }, []);

  const fetchBlockTypes = async () => {
    try {
      const response = await fetch('/api/blocks');
      const data = await response.json();
      setBlockTypes(data.blockTypes);
    } catch (error) {
      console.error('Error fetching block types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlock = () => {
    setIsCreating(true);
    setNewBlock({
      name: '',
      description: '',
      category: 'content',
      fields: {}
    });
  };

  const addField = (fieldName: string, fieldType: string) => {
    const fieldDef: FieldDefinition = {
      type: fieldType,
      required: false,
      bilingual: fieldType === 'text' || fieldType === 'textarea' || fieldType === 'richtext'
    };

    if (fieldType === 'select') {
      fieldDef.options = ['Option 1', 'Option 2'];
    }

    setNewBlock(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: fieldDef
      }
    }));
  };

  const removeField = (fieldName: string) => {
    setNewBlock(prev => ({
      ...prev,
      fields: Object.fromEntries(
        Object.entries(prev.fields).filter(([key]) => key !== fieldName)
      )
    }));
  };

  const filteredBlocks = selectedCategory === 'all' 
    ? blockTypes 
    : blockTypes.filter(block => block.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading block types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Block Builder</h1>
                <p className="text-sm text-gray-500">Create and manage custom block types</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleCreateBlock}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Create Block Type
            </button>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Categories Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen border-r">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Blocks ({blockTypes.length})
              </button>
              {categories.map((category) => {
                const count = blockTypes.filter(b => b.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {isCreating ? (
            /* Block Creation Form */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">Create New Block Type</h2>
                  <p className="text-sm text-gray-500 mt-1">Define the structure and fields for your custom block</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Block Name
                      </label>
                      <input
                        type="text"
                        value={newBlock.name}
                        onChange={(e) => setNewBlock(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Custom Hero Section"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={newBlock.category}
                        onChange={(e) => setNewBlock(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newBlock.description}
                      onChange={(e) => setNewBlock(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Describe what this block does and when to use it"
                    />
                  </div>

                  {/* Fields Builder */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Block Fields</h3>
                      <button
                        onClick={() => {
                          const fieldName = prompt('Enter field name:');
                          if (fieldName) {
                            addField(fieldName, 'text');
                          }
                        }}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                      >
                        Add Field
                      </button>
                    </div>

                    <div className="space-y-4">
                      {Object.entries(newBlock.fields).map(([fieldName, fieldDef]) => (
                        <div key={fieldName} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{fieldName}</h4>
                            <button
                              onClick={() => removeField(fieldName)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Field Type
                              </label>
                              <select
                                value={fieldDef.type}
                                onChange={(e) => {
                                  setNewBlock(prev => ({
                                    ...prev,
                                    fields: {
                                      ...prev.fields,
                                      [fieldName]: { ...fieldDef, type: e.target.value }
                                    }
                                  }));
                                }}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                              >
                                {fieldTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={fieldDef.required || false}
                                  onChange={(e) => {
                                    setNewBlock(prev => ({
                                      ...prev,
                                      fields: {
                                        ...prev.fields,
                                        [fieldName]: { ...fieldDef, required: e.target.checked }
                                      }
                                    }));
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-xs text-gray-700">Required</span>
                              </label>
                              
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={fieldDef.bilingual || false}
                                  onChange={(e) => {
                                    setNewBlock(prev => ({
                                      ...prev,
                                      fields: {
                                        ...prev.fields,
                                        [fieldName]: { ...fieldDef, bilingual: e.target.checked }
                                      }
                                    }));
                                  }}
                                  className="mr-2"
                                />
                                <span className="text-xs text-gray-700">Bilingual</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Create Block Type
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Block Types List */
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === 'all' ? 'All Block Types' : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredBlocks.length} block type{filteredBlocks.length !== 1 ? 's' : ''} available
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBlocks.map((blockType) => (
                  <div key={blockType.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 font-bold">
                              {blockType.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{blockType.name}</h3>
                            {blockType.isCustom && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                Custom
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {blockType.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          <strong>Category:</strong> {categories.find(c => c.id === blockType.category)?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          <strong>Fields:</strong> {Object.keys(blockType.fields).length}
                        </div>
                      </div>
                    </div>
                    
                    <div className="px-6 py-3 bg-gray-50 border-t flex justify-between">
                      <button className="text-sm text-purple-600 hover:text-purple-700">
                        Edit
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Preview
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}