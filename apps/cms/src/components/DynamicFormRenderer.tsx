'use client';

import { useState, useEffect } from 'react';
import {
  Upload,
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Link as LinkIcon,
  Mail,
  FileText,
  Image as ImageIcon,
  Film,
  File,
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import BlockEditor to avoid SSR issues
const BlockEditor = dynamic(() => import('./BlockEditor'), { ssr: false });

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
  options?: Array<{ value: string; label: { en: string; ar: string } }>;
  subFields?: FieldDefinition[];
}

interface DynamicFormRendererProps {
  fields: FieldDefinition[];
  initialData?: Record<string, any>;
  locale: 'EN' | 'AR';
  onChange?: (data: Record<string, any>) => void;
  onValidate?: (isValid: boolean, errors: Record<string, string>) => void;
}

export default function DynamicFormRenderer({
  fields,
  initialData = {},
  locale,
  onChange,
  onValidate,
}: DynamicFormRendererProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data with default values
  useEffect(() => {
    const defaultData: Record<string, any> = {};
    fields.forEach((field) => {
      if (initialData[field.name] !== undefined) {
        defaultData[field.name] = initialData[field.name];
      } else if (field.defaultValue !== undefined) {
        defaultData[field.name] = field.defaultValue;
      } else if (field.type === 'repeater' || field.type === 'gallery') {
        defaultData[field.name] = [];
      } else if (field.type === 'boolean') {
        defaultData[field.name] = false;
      } else if (field.bilingual) {
        defaultData[field.name] = { en: '', ar: '' };
      } else {
        defaultData[field.name] = '';
      }
    });
    setFormData(defaultData);
  }, [fields, initialData]);

  // Validate form
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.name];

        if (field.bilingual) {
          if (!value?.en && !value?.ar) {
            newErrors[field.name] = `${field.label.en} is required`;
          }
        } else if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[field.name] = `${field.label.en} is required`;
        }
      }

      // Validate field-specific rules
      if (field.validation) {
        const value = formData[field.name];

        if (field.validation.minLength && value?.length < field.validation.minLength) {
          newErrors[field.name] = `Minimum length is ${field.validation.minLength}`;
        }
        if (field.validation.maxLength && value?.length > field.validation.maxLength) {
          newErrors[field.name] = `Maximum length is ${field.validation.maxLength}`;
        }
        if (field.validation.min && value < field.validation.min) {
          newErrors[field.name] = `Minimum value is ${field.validation.min}`;
        }
        if (field.validation.max && value > field.validation.max) {
          newErrors[field.name] = `Maximum value is ${field.validation.max}`;
        }
        if (field.validation.pattern && !new RegExp(field.validation.pattern).test(value)) {
          newErrors[field.name] = `Invalid format`;
        }
      }
    });

    setErrors(newErrors);
    onValidate?.(Object.keys(newErrors).length === 0, newErrors);
  }, [formData, fields, onValidate]);

  // Notify parent of changes
  useEffect(() => {
    onChange?.(formData);
  }, [formData, onChange]);

  // Update field value
  const updateField = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Render field based on type
  const renderField = (field: FieldDefinition) => {
    const value = formData[field.name];
    const error = errors[field.name];
    const label = locale === 'AR' ? field.label.ar : field.label.en;
    const helpText = field.helpText ? (locale === 'AR' ? field.helpText.ar : field.helpText.en) : '';

    const fieldWrapper = (content: React.ReactNode, fullWidth = false) => (
      <div className={`mb-6 ${fullWidth ? 'col-span-2' : ''}`}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {content}
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );

    // Bilingual fields (text, textarea, rich_text)
    if (field.bilingual && ['text', 'textarea', 'rich_text'].includes(field.type)) {
      return fieldWrapper(
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            {field.type === 'textarea' ? (
              <textarea
                value={value?.en || ''}
                onChange={(e) => updateField(field.name, { ...value, en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            ) : field.type === 'rich_text' ? (
              <div className="border border-gray-300 rounded-lg">
                <BlockEditor
                  initialContent={value?.en || ''}
                  onChange={(content) => updateField(field.name, { ...value, en: content })}
                />
              </div>
            ) : (
              <input
                type="text"
                value={value?.en || ''}
                onChange={(e) => updateField(field.name, { ...value, en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Arabic</label>
            {field.type === 'textarea' ? (
              <textarea
                value={value?.ar || ''}
                onChange={(e) => updateField(field.name, { ...value, ar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                dir="rtl"
              />
            ) : field.type === 'rich_text' ? (
              <div className="border border-gray-300 rounded-lg" dir="rtl">
                <BlockEditor
                  initialContent={value?.ar || ''}
                  onChange={(content) => updateField(field.name, { ...value, ar: content })}
                />
              </div>
            ) : (
              <input
                type="text"
                value={value?.ar || ''}
                onChange={(e) => updateField(field.name, { ...value, ar: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                dir="rtl"
              />
            )}
          </div>
        </div>,
        true
      );
    }

    // Non-bilingual fields
    switch (field.type) {
      case 'text':
        return fieldWrapper(
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'textarea':
        return fieldWrapper(
          <textarea
            value={value || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'rich_text':
        return fieldWrapper(
          <div className="border border-gray-300 rounded-lg">
            <BlockEditor
              initialContent={value || ''}
              onChange={(content) => updateField(field.name, content)}
            />
          </div>,
          true
        );

      case 'number':
        return fieldWrapper(
          <input
            type="number"
            value={value || ''}
            onChange={(e) => updateField(field.name, parseFloat(e.target.value))}
            min={field.validation?.min}
            max={field.validation?.max}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case 'boolean':
        return fieldWrapper(
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => updateField(field.name, e.target.checked)}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enabled</span>
          </label>
        );

      case 'select':
        return fieldWrapper(
          <select
            value={value || ''}
            onChange={(e) => updateField(field.name, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {locale === 'AR' ? option.label.ar : option.label.en}
              </option>
            ))}
          </select>
        );

      case 'date':
        return fieldWrapper(
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'datetime':
        return fieldWrapper(
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="datetime-local"
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'color':
        return fieldWrapper(
          <div className="flex gap-3">
            <input
              type="color"
              value={value || '#000000'}
              onChange={(e) => updateField(field.name, e.target.value)}
              className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder="#000000"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
            />
          </div>
        );

      case 'url':
        return fieldWrapper(
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'email':
        return fieldWrapper(
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={value || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder="email@example.com"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );

      case 'image':
        return fieldWrapper(
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            {value ? (
              <div className="relative">
                <img src={value} alt="Preview" className="max-h-48 mx-auto rounded" />
                <button
                  onClick={() => updateField(field.name, '')}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    // TODO: Implement file upload
                    console.log('File upload:', e.target.files?.[0]);
                  }}
                  className="hidden"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Choose Image
                </button>
              </div>
            )}
          </div>,
          true
        );

      case 'gallery':
        return fieldWrapper(
          <div>
            <div className="grid grid-cols-4 gap-3 mb-3">
              {(value || []).map((img: string, index: number) => (
                <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                  <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      const newValue = [...value];
                      newValue.splice(index, 1);
                      updateField(field.name, newValue);
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
              <Plus className="w-5 h-5 inline mr-2" />
              Add Image
            </button>
          </div>,
          true
        );

      case 'file':
      case 'video':
      case 'asset':
        return fieldWrapper(
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            {value ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-8 h-8 text-gray-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{value.name || 'File'}</p>
                    <p className="text-xs text-gray-500">{value.size || 'Unknown size'}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateField(field.name, null)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Click to upload {field.type === 'video' ? 'video' : 'file'}
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Choose File
                </button>
              </div>
            )}
          </div>,
          true
        );

      case 'repeater':
        return fieldWrapper(
          <div className="space-y-3">
            {(value || []).map((item: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                  <button
                    onClick={() => {
                      const newValue = [...value];
                      newValue.splice(index, 1);
                      updateField(field.name, newValue);
                    }}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {/* TODO: Render sub-fields */}
                <div className="text-sm text-gray-500">Sub-fields rendering...</div>
              </div>
            ))}
            <button
              onClick={() => updateField(field.name, [...(value || []), {}])}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Add Item
            </button>
          </div>,
          true
        );

      case 'group':
        return fieldWrapper(
          <div className="p-4 border border-gray-200 rounded-lg space-y-4">
            {/* TODO: Render sub-fields */}
            <div className="text-sm text-gray-500">Group fields rendering...</div>
          </div>,
          true
        );

      case 'json':
        return fieldWrapper(
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                updateField(field.name, JSON.parse(e.target.value));
              } catch {
                updateField(field.name, e.target.value);
              }
            }}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="{}"
          />,
          true
        );

      default:
        return fieldWrapper(
          <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-2 gap-x-6">
      {fields.map((field) => (
        <div key={field.id} className={field.bilingual || ['rich_text', 'image', 'gallery', 'repeater', 'group', 'json'].includes(field.type) ? 'col-span-2' : ''}>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
