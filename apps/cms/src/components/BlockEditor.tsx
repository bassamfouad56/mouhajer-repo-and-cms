/**
 * Block Editor Component
 * Dynamic form interface for editing block properties and content
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageBlock } from '@/lib/db';
import { translateText, debounce } from '@/lib/translate';
import MediaPicker from '@/components/MediaPicker';

interface BlockType {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: Record<string, unknown>;
}

interface BlockEditorProps {
  block: PageBlock;
  blockType?: BlockType;
  onSave: (block: PageBlock) => void;
  onClose: () => void;
}

export default function BlockEditor({ block, blockType, onSave, onClose }: BlockEditorProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(block.data);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [translating, setTranslating] = useState<Record<string, boolean>>({});
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [currentField, setCurrentField] = useState<{ name: string; type: 'image' | 'gallery'; language?: string } | null>(null);

  useEffect(() => {
    setFormData(block.data);
  }, [block.data]);

  const handleTranslation = useCallback(
    async (fieldName: string, text: string, sourceLang: 'en' | 'ar') => {
      if (!autoTranslate || !text || text.trim() === '') return;

      const targetLang = sourceLang === 'en' ? 'ar' : 'en';
      setTranslating(prev => ({ ...prev, [`${fieldName}_${targetLang}`]: true }));

      try {
        const translated = await translateText(text, targetLang);
        setFormData(prev => ({
          ...prev,
          [fieldName]: {
            ...(prev[fieldName] as Record<string, unknown>),
            [targetLang]: translated
          }
        }));
      } catch (error) {
        console.error('Translation failed:', error);
      } finally {
        setTranslating(prev => ({ ...prev, [`${fieldName}_${targetLang}`]: false }));
      }
    },
    [autoTranslate]
  );

  const debouncedTranslate = useCallback(
    debounce((fieldName: string, text: string, language: 'en' | 'ar') => {
      handleTranslation(fieldName, text, language);
    }, 1000),
    [handleTranslation]
  );

  if (!blockType) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <p className="text-red-600">Block type not found</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-300 rounded">Close</button>
        </div>
      </div>
    );
  }

  const handleFieldChange = (fieldName: string, value: unknown, language?: string, shouldTranslate = true) => {
    setFormData(prev => {
      if (language) {
        return {
          ...prev,
          [fieldName]: {
            ...(prev[fieldName] as Record<string, unknown>),
            [language]: value
          }
        };
      } else {
        return {
          ...prev,
          [fieldName]: value
        };
      }
    });

    // Trigger auto-translation for bilingual text fields
    if (language && shouldTranslate && typeof value === 'string') {
      debouncedTranslate(fieldName, value, language as 'en' | 'ar');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedBlock: PageBlock = {
        ...block,
        data: formData
      };
      onSave(updatedBlock);
    } catch (error) {
      console.error('Error saving block:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderField = (fieldName: string, fieldConfig: unknown) => {
    const { type, bilingual, required, options, default: defaultValue, language } = fieldConfig as {
      type: string;
      bilingual?: boolean;
      required?: boolean;
      options?: unknown[];
      default?: unknown;
      language?: string;
    };

    const getFieldValue = (lang?: string): string => {
      if (bilingual && lang) {
        const value = (formData[fieldName] as Record<string, string>)?.[lang];
        return typeof value === 'string' ? value : '';
      }
      const value = formData[fieldName] || defaultValue;
      return typeof value === 'string' ? value : String(value || '');
    };

    const setFieldValue = (value: unknown, lang?: string) => {
      handleFieldChange(fieldName, value, lang);
    };

    const fieldId = `${fieldName}_${bilingual ? activeTab : 'single'}`;
    const fieldLabel = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');

    const commonClasses = "mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500";

    const renderSingleField = (lang?: string) => {
      const value = getFieldValue(lang);
      const setValue = (val: unknown) => setFieldValue(val, lang);

      switch (type) {
        case 'text':
          return (
            <input
              type="text"
              id={fieldId}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={commonClasses}
              placeholder={`Enter ${fieldLabel.toLowerCase()}${lang ? ` (${lang.toUpperCase()})` : ''}`}
              required={required}
            />
          );

        case 'textarea':
          return (
            <textarea
              id={fieldId}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
              className={commonClasses}
              placeholder={`Enter ${fieldLabel.toLowerCase()}${lang ? ` (${lang.toUpperCase()})` : ''}`}
              required={required}
            />
          );

        case 'number':
          return (
            <input
              type="number"
              id={fieldId}
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value) || 0)}
              className={commonClasses}
              required={required}
            />
          );

        case 'boolean':
          return (
            <div className="flex items-center">
              <input
                type="checkbox"
                id={fieldId}
                checked={value === 'true' || value === '1'}
                onChange={(e) => setValue(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={fieldId} className="ml-2 text-sm text-gray-700">
                Enable {fieldLabel.toLowerCase()}
              </label>
            </div>
          );

        case 'select':
          return (
            <select
              id={fieldId}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={commonClasses}
              required={required}
            >
              <option value="">Select {fieldLabel.toLowerCase()}</option>
              {options?.map((opt) => {
                const option = String(opt);
                return (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                );
              })}
            </select>
          );

        case 'color':
          return (
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id={fieldId}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={commonClasses.replace('w-full', 'flex-1')}
                placeholder="#000000"
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          );

        case 'image':
          return (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  id={fieldId}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className={commonClasses}
                  placeholder="Image URL or path"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCurrentField({ name: fieldName, type: 'image', language: lang });
                    setShowMediaPicker(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                >
                  Browse Media
                </button>
              </div>
              {value && (
                <div className="mt-2 relative inline-block">
                  <img
                    src={value}
                    alt="Preview"
                    className="h-32 w-auto object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setValue('')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          );

        case 'gallery':
          // Handle both direct array and bilingual object structure
          let galleryValue: string[] = [];
          if (bilingual && lang) {
            const bilingualValue = formData[fieldName] as Record<string, string[]>;
            galleryValue = Array.isArray(bilingualValue?.[lang]) ? bilingualValue[lang] : [];
          } else {
            galleryValue = Array.isArray(value) ? value : [];
          }
          
          return (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentField({ name: fieldName, type: 'gallery', language: lang });
                      setShowMediaPicker(true);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Images
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    {fieldName === 'logos' ? 'Select company logos and media features' : 
                     fieldName === 'clients' ? 'Select client logos and testimonials' :
                     'Select multiple images for this gallery'}
                  </p>
                </div>
              </div>
              {galleryValue.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      {galleryValue.length} image{galleryValue.length !== 1 ? 's' : ''} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentField({ name: fieldName, type: 'gallery', language: lang });
                        setShowMediaPicker(true);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Add More
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {galleryValue.map((img: string, index: number) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={img}
                          alt={`${fieldName} ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg border border-gray-200 group-hover:border-gray-300 transition-colors"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              const newGallery = galleryValue.filter((_, i) => i !== index);
                              if (bilingual && lang) {
                                handleFieldChange(fieldName, newGallery, lang, false);
                              } else {
                                handleFieldChange(fieldName, newGallery, undefined, false);
                              }
                            }}
                            className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );

        case 'code':
          return (
            <textarea
              id={fieldId}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={8}
              className={`${commonClasses} font-mono text-sm`}
              placeholder={`Enter ${language || 'code'} here...`}
              required={required}
            />
          );

        default:
          return (
            <input
              type="text"
              id={fieldId}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className={commonClasses}
              placeholder={`Enter ${fieldLabel.toLowerCase()}`}
              required={required}
            />
          );
      }
    };

    return (
      <div key={fieldName} className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {fieldLabel}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {bilingual ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'en'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  English
                  {translating[`${fieldName}_en`] && (
                    <span className="ml-2 inline-block">
                      <svg className="animate-spin h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ar')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    activeTab === 'ar'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Arabic
                  {translating[`${fieldName}_ar`] && (
                    <span className="ml-2 inline-block">
                      <svg className="animate-spin h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
              {autoTranslate && (
                <span className="text-xs text-gray-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  Auto
                </span>
              )}
            </div>
            {renderSingleField(activeTab)}
          </div>
        ) : (
          renderSingleField()
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-0 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit {blockType.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{blockType.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-translate</span>
              </label>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form className="space-y-6">
              {Object.entries(blockType.fields).map(([fieldName, fieldConfig]) =>
                renderField(fieldName, fieldConfig)
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center"
            >
              {isSaving && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {isSaving ? 'Saving...' : 'Save Block'}
            </button>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && currentField && (
        <MediaPicker
          multiple={currentField.type === 'gallery'}
          fileType="image"
          onSelect={(selectedMedia) => {
            if (currentField.type === 'gallery') {
              // Handle gallery selection - replace existing with new selection
              const urls = Array.isArray(selectedMedia) 
                ? selectedMedia.map(m => m.url)
                : [selectedMedia.url];
              
              handleFieldChange(currentField.name, urls, currentField.language, false);
            } else {
              // Handle single image selection
              const url = Array.isArray(selectedMedia) ? selectedMedia[0]?.url : selectedMedia.url;
              handleFieldChange(currentField.name, url, currentField.language, false);
            }
            setShowMediaPicker(false);
            setCurrentField(null);
          }}
          onClose={() => {
            setShowMediaPicker(false);
            setCurrentField(null);
          }}
        />
      )}
    </div>
  );
}