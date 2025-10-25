'use client';

import { useState } from 'react';
import {
  FileText,
  BookOpen,
  Briefcase,
  Package,
  Zap,
  Users,
  Mail,
  Newspaper,
  TrendingUp,
  ShoppingCart,
  Check,
} from 'lucide-react';
import {
  CONTENT_TEMPLATES,
  ContentTemplate,
  ContentType,
  CONTENT_TYPE_LABELS,
} from '@/lib/content-templates';

interface TemplateSelectorProps {
  onSelect: (template: ContentTemplate) => void;
  onCancel: () => void;
}

const ICON_MAP: Record<string, any> = {
  FileText,
  BookOpen,
  Briefcase,
  Package,
  Zap,
  Users,
  Mail,
  Newspaper,
  TrendingUp,
  ShoppingCart,
};

const TYPE_COLORS: Record<ContentType, string> = {
  PAGE: 'blue',
  BLOG: 'purple',
  PROJECT: 'green',
  SERVICE: 'orange',
  LANDING: 'pink',
};

export default function TemplateSelector({ onSelect, onCancel }: TemplateSelectorProps) {
  const [selectedType, setSelectedType] = useState<ContentType | 'ALL'>('ALL');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);

  const filteredTemplates =
    selectedType === 'ALL'
      ? CONTENT_TEMPLATES
      : CONTENT_TEMPLATES.filter((t) => t.type === selectedType);

  const templatesByType = (Object.keys(CONTENT_TYPE_LABELS) as ContentType[]).map((type) => ({
    type,
    label: CONTENT_TYPE_LABELS[type],
    templates: CONTENT_TEMPLATES.filter((t) => t.type === type),
    color: TYPE_COLORS[type],
  }));

  return (
    <div className="flex flex-col h-full">
      {/* Type Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
        <button
          onClick={() => setSelectedType('ALL')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedType === 'ALL'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Templates
        </button>
        {templatesByType.map(({ type, label, color }) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedType === type
                ? `bg-${color}-600 text-white`
                : `bg-${color}-50 text-${color}-700 hover:bg-${color}-100`
            }`}
          >
            {label.en}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredTemplates.map((template) => {
          const Icon = ICON_MAP[template.icon] || FileText;
          const isSelected = selectedTemplate?.id === template.id;
          const color = TYPE_COLORS[template.type];

          return (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`relative p-6 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                isSelected
                  ? `border-${color}-500 bg-${color}-50`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className={`absolute top-3 right-3 w-6 h-6 bg-${color}-600 rounded-full flex items-center justify-center`}>
                  <Check size={14} className="text-white" />
                </div>
              )}

              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg bg-${color}-100 flex items-center justify-center mb-4`}>
                <Icon size={24} className={`text-${color}-600`} />
              </div>

              {/* Template Info */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>

              {/* Metadata */}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium bg-${color}-100 text-${color}-700`}>
                  {CONTENT_TYPE_LABELS[template.type].en}
                </span>
                {template.defaultSections.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {template.defaultSections.length} sections
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
        <div className="text-sm text-gray-600">
          {selectedTemplate ? (
            <span>
              Selected: <strong>{selectedTemplate.name}</strong>
            </span>
          ) : (
            <span>Choose a template to continue</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedTemplate && onSelect(selectedTemplate)}
            disabled={!selectedTemplate}
            className={`px-6 py-2.5 rounded-lg font-medium ${
              selectedTemplate
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
