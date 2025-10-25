'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Component,
  Plus,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Settings,
  Trash2,
} from 'lucide-react';

// Available field types
const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: '📝', category: 'Basic' },
  { value: 'textarea', label: 'Text Area', icon: '📄', category: 'Basic' },
  { value: 'rich_text', label: 'Rich Text', icon: '✏️', category: 'Basic' },
  { value: 'number', label: 'Number', icon: '🔢', category: 'Basic' },
  { value: 'boolean', label: 'Boolean', icon: '✓', category: 'Basic' },
  { value: 'select', label: 'Select', icon: '▼', category: 'Basic' },
  { value: 'date', label: 'Date', icon: '📅', category: 'Basic' },
  { value: 'datetime', label: 'Date Time', icon: '🕐', category: 'Basic' },
  { value: 'color', label: 'Color', icon: '🎨', category: 'Basic' },
  { value: 'url', label: 'URL', icon: '🔗', category: 'Basic' },
  { value: 'email', label: 'Email', icon: '📧', category: 'Basic' },
  { value: 'image', label: 'Image', icon: '🖼️', category: 'Media' },
  { value: 'gallery', label: 'Gallery', icon: '🖼️', category: 'Media' },
  { value: 'file', label: 'File', icon: '📎', category: 'Media' },
  { value: 'video', label: 'Video', icon: '🎬', category: 'Media' },
  { value: 'asset', label: 'Asset', icon: '📦', category: 'Media' },
  { value: 'repeater', label: 'Repeater', icon: '🔄', category: 'Advanced' },
  { value: 'group', label: 'Group', icon: '📦', category: 'Advanced' },
  { value: 'relationship', label: 'Relationship', icon: '🔗', category: 'Advanced' },
  { value: 'json', label: 'JSON', icon: '{}', category: 'Advanced' },
];

const CATEGORIES = ['layout', 'media', 'content', 'general'];
const ICONS = [
  'file-text',
  'image',
  'video',
  'layout',
  'grid',
  'list',
  'type',
  'image-plus',
  'quote',
  'help-circle',
];

interface FieldDefinition {
  id: string;
  name: string;
  label: { en: string; ar: string };
  type: string;
  bilingual: boolean;
  required: boolean;
  validation?: any;
  helpText?: { en: string; ar: string };
  defaultValue?: any;
  options?: any[];
  subFields?: FieldDefinition[];
}

export default function NewBlueprintPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Blueprint metadata
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [blueprintType, setBlueprintType] = useState<'DOCUMENT' | 'COMPONENT'>('COMPONENT');
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [category, setCategory] = useState('general');
  const [icon, setIcon] = useState('file-text');

  // Fields
  const [fields, setFields] = useState<FieldDefinition[]>([]);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

  // Auto-generate name from display name
  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    if (!name || name === displayName.replace(/\s+/g, '')) {
      setName(value.replace(/\s+/g, ''));
    }
  };

  // Add new field
  const addField = (type: string) => {
    const newField: FieldDefinition = {
      id: `field_${Date.now()}`,
      name: `field${fields.length + 1}`,
      label: { en: 'New Field', ar: 'حقل جديد' },
      type,
      bilingual: false,
      required: false,
    };
    setFields([...fields, newField]);
    setEditingFieldIndex(fields.length);
  };

  // Remove field
  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    if (editingFieldIndex === index) {
      setEditingFieldIndex(null);
    }
  };

  // Move field up/down
  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFields(newFields);

    if (editingFieldIndex === index) {
      setEditingFieldIndex(targetIndex);
    } else if (editingFieldIndex === targetIndex) {
      setEditingFieldIndex(index);
    }
  };

  // Update field
  const updateField = (index: number, updates: Partial<FieldDefinition>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  // Save blueprint
  const handleSave = async () => {
    setError('');

    // Validation
    if (!name || !displayName) {
      setError('Name and Display Name are required');
      return;
    }

    if (fields.length === 0) {
      setError('Add at least one field to the blueprint');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/blueprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          displayName,
          description,
          blueprintType,
          allowMultiple,
          category,
          icon,
          fields,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create blueprint');
      }

      router.push('/blueprints');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blueprint');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Blueprint</h1>
              <p className="text-sm text-gray-500 mt-1">
                Define a new content type for your CMS
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Creating...' : 'Create Blueprint'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Form - Left Side */}
          <div className="col-span-8 space-y-6">
            {/* Blueprint Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Blueprint Information
              </h2>

              <div className="space-y-4">
                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => handleDisplayNameChange(e.target.value)}
                    placeholder="e.g., Hero Banner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Name (Technical) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name (Technical ID) *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value.replace(/\s+/g, ''))}
                    placeholder="e.g., HeroBanner"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Used in GraphQL queries. No spaces allowed.
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this blueprint is used for..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Blueprint Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blueprint Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setBlueprintType('COMPONENT')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        blueprintType === 'COMPONENT'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Component className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium text-gray-900">Component</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Reusable blocks for pages
                      </div>
                    </button>
                    <button
                      onClick={() => setBlueprintType('DOCUMENT')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        blueprintType === 'DOCUMENT'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FileText className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <div className="font-medium text-gray-900">Document</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Top-level content type
                      </div>
                    </button>
                  </div>
                </div>

                {/* Category & Icon */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ICONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Allow Multiple */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowMultiple"
                    checked={allowMultiple}
                    onChange={(e) => setAllowMultiple(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="allowMultiple" className="text-sm text-gray-700">
                    Allow multiple instances (if unchecked, only one instance can be created)
                  </label>
                </div>
              </div>
            </div>

            {/* Fields Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Fields ({fields.length})
                </h2>
              </div>

              {/* Field List */}
              {fields.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="mb-2">No fields added yet</p>
                  <p className="text-sm">Add fields from the palette on the right →</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        editingFieldIndex === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">
                              {FIELD_TYPES.find((t) => t.value === field.type)?.icon || '📝'}
                            </span>
                            <div>
                              <div className="font-medium text-gray-900">
                                {field.label.en}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </div>
                              <div className="text-sm text-gray-500">
                                {field.name} • {field.type}
                                {field.bilingual && ' • Bilingual'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Field Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => moveField(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => moveField(index, 'down')}
                            disabled={index === fields.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setEditingFieldIndex(editingFieldIndex === index ? null : index)
                            }
                            className="p-1 text-blue-600 hover:text-blue-700"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeField(index)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Field Editor */}
                      {editingFieldIndex === index && (
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Field Name *
                              </label>
                              <input
                                type="text"
                                value={field.name}
                                onChange={(e) =>
                                  updateField(index, {
                                    name: e.target.value.replace(/\s+/g, ''),
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 font-mono"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Field Type
                              </label>
                              <select
                                value={field.type}
                                onChange={(e) => updateField(index, { type: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              >
                                {FIELD_TYPES.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Label (English) *
                              </label>
                              <input
                                type="text"
                                value={field.label.en}
                                onChange={(e) =>
                                  updateField(index, {
                                    label: { ...field.label, en: e.target.value },
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Label (Arabic) *
                              </label>
                              <input
                                type="text"
                                value={field.label.ar}
                                onChange={(e) =>
                                  updateField(index, {
                                    label: { ...field.label, ar: e.target.value },
                                  })
                                }
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                                dir="rtl"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateField(index, { required: e.target.checked })
                                }
                                className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">Required</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.bilingual}
                                onChange={(e) =>
                                  updateField(index, { bilingual: e.target.checked })
                                }
                                className="w-3 h-3 text-blue-600 border-gray-300 rounded"
                              />
                              <span className="text-sm text-gray-700">Bilingual</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Field Palette - Right Sidebar */}
          <div className="col-span-4">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Field Types</h3>

                {/* Group by category */}
                {['Basic', 'Media', 'Advanced'].map((cat) => (
                  <div key={cat} className="mb-4">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">
                      {cat}
                    </div>
                    <div className="space-y-1">
                      {FIELD_TYPES.filter((type) => type.category === cat).map((type) => (
                        <button
                          key={type.value}
                          onClick={() => addField(type.value)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <span className="text-lg">{type.icon}</span>
                          <span>{type.label}</span>
                          <Plus className="w-3 h-3 ml-auto text-gray-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
