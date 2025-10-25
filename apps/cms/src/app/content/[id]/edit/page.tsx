'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Eye,
  Globe,
  Calendar,
  Plus,
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from 'lucide-react';

type ContentType = 'PAGE' | 'BLOG' | 'PROJECT' | 'SERVICE' | 'LANDING';
type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface ContentSection {
  id: string;
  contentId: string;
  blueprintId: string;
  order: number;
  dataEn: any;
  dataAr: any;
  visible: boolean;
  blueprint: {
    id: string;
    name: string;
    displayName: string;
    icon?: string;
    fields: any;
  };
}

interface Content {
  id: string;
  type: ContentType;
  template: string | null;
  titleEn: string;
  titleAr: string;
  slugEn: string;
  slugAr: string;
  descriptionEn: string;
  descriptionAr: string;
  status: ContentStatus;
  featured: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sections: ContentSection[];
}

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PUBLISHED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-red-100 text-red-700',
};

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    fetchContent();
  }, [contentId]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content/${contentId}`);
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
        // Expand all sections by default
        setExpandedSections(new Set(data.content.sections.map((s: ContentSection) => s.id)));
      } else {
        alert('Failed to load content');
        router.push('/content');
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      alert('Failed to load content');
      router.push('/content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/content/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleEn: content.titleEn,
          titleAr: content.titleAr,
          slugEn: content.slugEn,
          slugAr: content.slugAr,
          descriptionEn: content.descriptionEn,
          descriptionAr: content.descriptionAr,
          status: content.status,
          featured: content.featured,
          sections: content.sections.map((s) => ({
            id: s.id,
            order: s.order,
            dataEn: s.dataEn,
            dataAr: s.dataAr,
            visible: s.visible,
          })),
        }),
      });

      if (response.ok) {
        alert('Content saved successfully!');
        fetchContent(); // Refresh
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to save content:', error);
      alert('Failed to save content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!content) return;

    const newStatus = content.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setContent({
      ...content,
      status: newStatus,
      publishedAt: newStatus === 'PUBLISHED' ? new Date() : content.publishedAt,
    });

    // Auto-save after status change
    setTimeout(() => handleSave(), 100);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const updateSectionData = (sectionId: string, field: string, value: any) => {
    if (!content) return;

    setContent({
      ...content,
      sections: content.sections.map((section) => {
        if (section.id === sectionId) {
          const data = currentLanguage === 'en' ? section.dataEn : section.dataAr;
          const updatedData = { ...data, [field]: value };

          return {
            ...section,
            ...(currentLanguage === 'en'
              ? { dataEn: updatedData }
              : { dataAr: updatedData }),
          };
        }
        return section;
      }),
    });
  };

  const moveSectionUp = (index: number) => {
    if (!content || index === 0) return;

    const newSections = [...content.sections];
    [newSections[index - 1], newSections[index]] = [
      newSections[index],
      newSections[index - 1],
    ];

    // Update order
    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    setContent({ ...content, sections: newSections });
  };

  const moveSectionDown = (index: number) => {
    if (!content || index === content.sections.length - 1) return;

    const newSections = [...content.sections];
    [newSections[index], newSections[index + 1]] = [
      newSections[index + 1],
      newSections[index],
    ];

    // Update order
    newSections.forEach((section, idx) => {
      section.order = idx;
    });

    setContent({ ...content, sections: newSections });
  };

  const deleteSection = (sectionId: string) => {
    if (!content) return;
    if (!confirm('Are you sure you want to delete this section?')) return;

    const newSections = content.sections
      .filter((s) => s.id !== sectionId)
      .map((section, idx) => ({ ...section, order: idx }));

    setContent({ ...content, sections: newSections });
  };

  const toggleSectionVisibility = (sectionId: string) => {
    if (!content) return;

    setContent({
      ...content,
      sections: content.sections.map((section) =>
        section.id === sectionId ? { ...section, visible: !section.visible } : section
      ),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Content not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/content')}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{content.titleEn}</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      STATUS_COLORS[content.status]
                    }`}
                  >
                    {content.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Globe size={14} />
                    /{content.slugEn}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {content.publishedAt
                      ? new Date(content.publishedAt).toLocaleDateString()
                      : 'Not published'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentLanguage('en')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentLanguage === 'en'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setCurrentLanguage('ar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentLanguage === 'ar'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  AR
                </button>
              </div>

              <button
                onClick={() => window.open(`/${content.slugEn}`, '_blank')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Eye size={18} />
                Preview
              </button>

              <button
                onClick={handlePublish}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  content.status === 'PUBLISHED'
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {content.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium ${
                  saving
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Sections */}
        <div className="space-y-4">
          {content.sections.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 mb-4">No sections yet</p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                <Plus size={20} />
                Add Section
              </button>
            </div>
          ) : (
            content.sections.map((section, index) => {
              const isExpanded = expandedSections.has(section.id);
              const data = currentLanguage === 'en' ? section.dataEn : section.dataAr;

              return (
                <div
                  key={section.id}
                  className={`bg-white rounded-lg shadow-sm border-2 transition-all ${
                    section.visible ? 'border-gray-200' : 'border-red-200 opacity-60'
                  }`}
                >
                  {/* Section Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button className="cursor-grab text-gray-400 hover:text-gray-600">
                          <GripVertical size={20} />
                        </button>
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="flex items-center gap-2"
                        >
                          {isExpanded ? (
                            <ChevronUp size={20} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-400" />
                          )}
                        </button>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {section.blueprint.displayName}
                          </h3>
                          <p className="text-sm text-gray-500">{section.blueprint.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSectionVisibility(section.id)}
                          className={`p-2 rounded-lg ${
                            section.visible
                              ? 'text-green-600 bg-green-50 hover:bg-green-100'
                              : 'text-red-600 bg-red-50 hover:bg-red-100'
                          }`}
                          title={section.visible ? 'Hide section' : 'Show section'}
                        >
                          {section.visible ? <Eye size={18} /> : <X size={18} />}
                        </button>
                        <button
                          onClick={() => moveSectionUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp size={18} />
                        </button>
                        <button
                          onClick={() => moveSectionDown(index)}
                          disabled={index === content.sections.length - 1}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown size={18} />
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="p-6 space-y-4">
                      {section.blueprint.fields &&
                        Array.isArray(section.blueprint.fields) &&
                        section.blueprint.fields.map((field: any) => (
                          <div key={field.name}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label || field.name}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </label>

                            {field.type === 'text' && (
                              <input
                                type="text"
                                value={data?.[field.name] || ''}
                                onChange={(e) =>
                                  updateSectionData(section.id, field.name, e.target.value)
                                }
                                placeholder={field.placeholder}
                                lang={currentLanguage}
                                spellCheck={true}
                                autoCorrect="on"
                                autoCapitalize="words"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            )}

                            {field.type === 'textarea' && (
                              <textarea
                                value={data?.[field.name] || ''}
                                onChange={(e) =>
                                  updateSectionData(section.id, field.name, e.target.value)
                                }
                                placeholder={field.placeholder}
                                lang={currentLanguage}
                                spellCheck={true}
                                autoCorrect="on"
                                autoCapitalize="sentences"
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              />
                            )}

                            {field.type === 'richtext' && (
                              <textarea
                                value={data?.[field.name] || ''}
                                onChange={(e) =>
                                  updateSectionData(section.id, field.name, e.target.value)
                                }
                                placeholder={field.placeholder}
                                lang={currentLanguage}
                                spellCheck={true}
                                autoCorrect="on"
                                autoCapitalize="sentences"
                                rows={8}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                              />
                            )}

                            {field.type === 'url' && (
                              <input
                                type="url"
                                value={data?.[field.name] || ''}
                                onChange={(e) =>
                                  updateSectionData(section.id, field.name, e.target.value)
                                }
                                placeholder={field.placeholder || 'https://example.com'}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            )}

                            {field.type === 'image' && (
                              <div className="space-y-2">
                                <input
                                  type="url"
                                  value={data?.[field.name] || ''}
                                  onChange={(e) =>
                                    updateSectionData(section.id, field.name, e.target.value)
                                  }
                                  placeholder="Image URL"
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {data?.[field.name] && (
                                  <img
                                    src={data[field.name]}
                                    alt="Preview"
                                    className="max-w-xs rounded-lg border border-gray-200"
                                  />
                                )}
                              </div>
                            )}

                            {field.type === 'select' && (
                              <select
                                value={data?.[field.name] || ''}
                                onChange={(e) =>
                                  updateSectionData(section.id, field.name, e.target.value)
                                }
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select...</option>
                                {field.options?.map((option: any) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            )}

                            {field.description && (
                              <p className="text-sm text-gray-500 mt-1">{field.description}</p>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
