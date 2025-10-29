'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Globe, Eye, EyeOff } from 'lucide-react';
import { FieldDefinition, getBlockFieldDefinition } from '@/lib/block-field-definitions';
import Image from 'next/image';

// Rich text editor component (simplified for now to avoid deployment issues)
const RichTextEditor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"
      placeholder="Enter rich text content..."
    />
  );
};

interface BlockEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  block: {
    id: string;
    type?: string;
    dataEn?: any;
    dataAr?: any;
    blueprint?: {
      name?: string;
      displayName?: string;
    };
  };
  locale: 'en' | 'ar';
}

export default function BlockEditorModal({
  isOpen,
  onClose,
  onSave,
  block,
  locale: initialLocale
}: BlockEditorModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [activeLocale, setActiveLocale] = useState<'en' | 'ar'>(initialLocale);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Get block type and definition
  const blockType = block.blueprint?.name || block.type || 'unknown';
  const definition = getBlockFieldDefinition(blockType);

  useEffect(() => {
    // Initialize form data from block data
    if (block && definition) {
      const initialData: any = {};

      // Merge both English and Arabic data
      definition.fields.forEach(field => {
        if (field.bilingual) {
          initialData[field.name] = {
            en: block.dataEn?.[field.name] || field.defaultValue?.en || '',
            ar: block.dataAr?.[field.name] || field.defaultValue?.ar || ''
          };
        } else {
          initialData[field.name] = block.dataEn?.[field.name] ||
                                    block.dataAr?.[field.name] ||
                                    field.defaultValue || '';
        }
      });

      setFormData(initialData);
    }
  }, [block, definition]);

  if (!isOpen || !definition) return null;

  const handleFieldChange = (fieldName: string, value: any, isBilingual: boolean = false) => {
    setFormData((prev: any) => {
      if (isBilingual) {
        return {
          ...prev,
          [fieldName]: {
            ...prev[fieldName],
            [activeLocale]: value
          }
        };
      }
      return {
        ...prev,
        [fieldName]: value
      };
    });
  };

  const handleRepeaterChange = (fieldName: string, index: number, subFieldName: string, value: any, isBilingual: boolean = false) => {
    setFormData((prev: any) => {
      const items = prev[fieldName] || [];
      const newItems = [...items];

      if (!newItems[index]) {
        newItems[index] = {};
      }

      if (isBilingual) {
        newItems[index][subFieldName] = {
          ...newItems[index][subFieldName],
          [activeLocale]: value
        };
      } else {
        newItems[index][subFieldName] = value;
      }

      return {
        ...prev,
        [fieldName]: newItems
      };
    });
  };

  const addRepeaterItem = (fieldName: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), {}]
    }));
  };

  const removeRepeaterItem = (fieldName: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      // Prepare data for saving
      const dataEn: any = {};
      const dataAr: any = {};

      definition.fields.forEach(field => {
        if (field.bilingual) {
          dataEn[field.name] = formData[field.name]?.en || '';
          dataAr[field.name] = formData[field.name]?.ar || '';
        } else {
          dataEn[field.name] = formData[field.name];
          dataAr[field.name] = formData[field.name];
        }
      });

      await onSave({
        dataEn,
        dataAr
      });

      onClose();
    } catch (error) {
      console.error('Error saving block:', error);
      setErrors(['Failed to save block. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FieldDefinition, value: any, onChange: (value: any) => void) => {
    switch (field.type) {
      case 'text':
      case 'url':
      case 'email':
        return (
          <input
            type={field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text'}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            dir={activeLocale === 'ar' ? 'rtl' : 'ltr'}
          />
        );

      case 'richtext':
        return (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <RichTextEditor
              value={value || ''}
              onChange={onChange}
            />
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            min={field.min}
            max={field.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Enable</span>
          </label>
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'color':
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter image URL or upload"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {value && (
              <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                <Image
                  src={value}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        );

      case 'gallery':
        const images = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2">
              {images.map((img: string, idx: number) => (
                <div key={idx} className="relative group">
                  <div className="relative w-full h-24 border border-gray-300 rounded-lg overflow-hidden">
                    <Image
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newImages = images.filter((_, i) => i !== idx);
                      onChange(newImages);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <input
              type="url"
              placeholder="Add image URL"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  if (target.value) {
                    onChange([...images, target.value]);
                    target.value = '';
                  }
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );

      default:
        return <div className="text-gray-500">Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Edit {definition.displayName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Block ID: {block.id}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
              <Globe className="w-4 h-4 text-gray-500" />
              <button
                onClick={() => setActiveLocale('en')}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  activeLocale === 'en'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setActiveLocale('ar')}
                className={`px-3 py-1 text-sm font-medium rounded ${
                  activeLocale === 'ar'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                AR
              </button>
            </div>

            {/* Preview Toggle */}
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-3 py-1 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            >
              {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {previewMode ? 'Edit' : 'Preview'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There were errors with your submission
                </h3>
                <ul className="mt-2 text-sm text-red-700">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {previewMode ? (
            // Preview Mode
            <div className="prose max-w-none">
              <h3>Preview ({activeLocale === 'en' ? 'English' : 'Arabic'})</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                {JSON.stringify(
                  activeLocale === 'en'
                    ? Object.entries(formData).reduce((acc, [key, value]: [string, any]) => {
                        acc[key] = value?.en !== undefined ? value.en : value;
                        return acc;
                      }, {} as any)
                    : Object.entries(formData).reduce((acc, [key, value]: [string, any]) => {
                        acc[key] = value?.ar !== undefined ? value.ar : value;
                        return acc;
                      }, {} as any),
                  null,
                  2
                )}
              </pre>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-6">
              {definition.fields.map((field) => {
                // Handle repeater fields
                if (field.type === 'repeater') {
                  const items = formData[field.name] || [];
                  return (
                    <div key={field.name} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <button
                          type="button"
                          onClick={() => addRepeaterItem(field.name)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                        >
                          Add Item
                        </button>
                      </div>
                      {field.helpText && (
                        <p className="text-xs text-gray-500">{field.helpText}</p>
                      )}
                      <div className="space-y-4">
                        {items.map((item: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                            <button
                              type="button"
                              onClick={() => removeRepeaterItem(field.name, index)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="space-y-4">
                              {field.repeaterFields?.map((subField) => (
                                <div key={subField.name}>
                                  <label className="block text-sm font-medium text-gray-600 mb-1">
                                    {subField.label}
                                    {subField.required && <span className="text-red-500 ml-1">*</span>}
                                  </label>
                                  {renderField(
                                    subField,
                                    subField.bilingual
                                      ? item[subField.name]?.[activeLocale]
                                      : item[subField.name],
                                    (value) => handleRepeaterChange(
                                      field.name,
                                      index,
                                      subField.name,
                                      value,
                                      subField.bilingual
                                    )
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Handle regular fields
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                      {field.bilingual && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({activeLocale === 'en' ? 'English' : 'Arabic'})
                        </span>
                      )}
                    </label>
                    {field.helpText && (
                      <p className="text-xs text-gray-500 mb-1">{field.helpText}</p>
                    )}
                    {renderField(
                      field,
                      field.bilingual
                        ? formData[field.name]?.[activeLocale]
                        : formData[field.name],
                      (value) => handleFieldChange(field.name, value, field.bilingual)
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}