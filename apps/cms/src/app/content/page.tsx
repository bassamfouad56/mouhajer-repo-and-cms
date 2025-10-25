'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  BookOpen,
  Briefcase,
  Package,
  Zap,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Calendar,
  Star,
  Globe,
  ArrowLeft,
} from 'lucide-react';
import TemplateSelector from '@/components/TemplateSelector';
import { ContentTemplate } from '@/lib/content-templates';
import { translateToArabic } from '@/lib/google-translate';

type ContentType = 'PAGE' | 'BLOG' | 'PROJECT' | 'SERVICE' | 'LANDING';
type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

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
  _count?: {
    sections: number;
  };
}

const CONTENT_TYPE_CONFIG = {
  PAGE: {
    label: 'Pages',
    icon: FileText,
    color: 'blue',
    description: 'Static pages like About, Contact, etc.',
  },
  BLOG: {
    label: 'Blog Posts',
    icon: BookOpen,
    color: 'purple',
    description: 'Articles, news, and blog content',
  },
  PROJECT: {
    label: 'Projects',
    icon: Briefcase,
    color: 'green',
    description: 'Portfolio projects and case studies',
  },
  SERVICE: {
    label: 'Services',
    icon: Package,
    color: 'orange',
    description: 'Service offerings and packages',
  },
  LANDING: {
    label: 'Landing Pages',
    icon: Zap,
    color: 'pink',
    description: 'Marketing and conversion pages',
  },
};

const STATUS_CONFIG = {
  DRAFT: { label: 'Draft', color: 'gray' },
  PUBLISHED: { label: 'Published', color: 'green' },
  ARCHIVED: { label: 'Archived', color: 'red' },
};

export default function ContentPage() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<ContentStatus | 'ALL'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStep, setCreateStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTranslatingTitle, setIsTranslatingTitle] = useState(false);
  const [isTranslatingDesc, setIsTranslatingDesc] = useState(false);
  const [newContent, setNewContent] = useState({
    titleEn: '',
    titleAr: '',
    slugEn: '',
    slugAr: '',
    descriptionEn: '',
    descriptionAr: '',
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setContents(data.contents || []);
      }
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    setCreateStep('details');
  };

  // Handle title change with auto-translation
  const handleTitleChange = (value: string, lang: 'en' | 'ar') => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/^-|-$/g, '');

    if (lang === 'en') {
      setNewContent((prev) => ({
        ...prev,
        titleEn: value,
        slugEn: slug,
      }));
    } else {
      setNewContent((prev) => ({
        ...prev,
        titleAr: value,
        slugAr: slug,
      }));
    }
  };

  // Auto-translate title
  useEffect(() => {
    if (!newContent.titleEn) return;

    const timeoutId = setTimeout(async () => {
      setIsTranslatingTitle(true);
      try {
        const translatedText = await translateToArabic(newContent.titleEn);
        const slug = translatedText
          .toLowerCase()
          .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
          .replace(/^-|-$/g, '');

        setNewContent((prev) => ({
          ...prev,
          titleAr: translatedText,
          slugAr: slug,
        }));
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsTranslatingTitle(false);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [newContent.titleEn]);

  // Auto-translate description
  useEffect(() => {
    if (!newContent.descriptionEn) return;

    const timeoutId = setTimeout(async () => {
      setIsTranslatingDesc(true);
      try {
        const translatedText = await translateToArabic(newContent.descriptionEn);
        setNewContent((prev) => ({
          ...prev,
          descriptionAr: translatedText,
        }));
      } catch (error) {
        console.error('Translation error:', error);
      } finally {
        setIsTranslatingDesc(false);
      }
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [newContent.descriptionEn]);

  // Create content
  const handleCreateContent = async () => {
    if (!selectedTemplate || !newContent.titleEn) return;

    try {
      setIsCreating(true);
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedTemplate.type,
          template: selectedTemplate.id,
          titleEn: newContent.titleEn,
          titleAr: newContent.titleAr || newContent.titleEn,
          slugEn: newContent.slugEn,
          slugAr: newContent.slugAr || newContent.slugEn,
          descriptionEn: newContent.descriptionEn,
          descriptionAr: newContent.descriptionAr || newContent.descriptionEn,
          defaultSections: selectedTemplate.defaultSections,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to editor
        router.push(`/content/${data.content.id}/edit`);
      } else {
        const error = await response.json();
        alert(`Failed to create content: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Failed to create content:', error);
      alert('Failed to create content. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Reset modal state
  const resetModal = () => {
    setShowCreateModal(false);
    setCreateStep('template');
    setSelectedTemplate(null);
    setNewContent({
      titleEn: '',
      titleAr: '',
      slugEn: '',
      slugAr: '',
      descriptionEn: '',
      descriptionAr: '',
    });
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.titleAr.includes(searchQuery) ||
      content.slugEn.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'ALL' || content.type === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || content.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const contentsByType = Object.entries(CONTENT_TYPE_CONFIG).map(([type, config]) => ({
    type: type as ContentType,
    config,
    count: contents.filter((c) => c.type === type).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content</h1>
              <p className="text-gray-500 mt-1">
                Manage all your website content in one place
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
            >
              <Plus size={20} />
              New Content
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {contentsByType.map(({ type, config, count }) => {
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(selectedType === type ? 'ALL' : type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedType === type
                      ? `border-${config.color}-500 bg-${config.color}-50`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedType === type
                          ? `bg-${config.color}-100`
                          : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={
                          selectedType === type
                            ? `text-${config.color}-600`
                            : 'text-gray-600'
                        }
                      />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-gray-900">{count}</div>
                      <div className="text-xs text-gray-500">{config.label}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or slug..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ContentStatus | 'ALL')}
                className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedType !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {selectedType !== 'ALL' && (
                <button
                  onClick={() => setSelectedType('ALL')}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1 hover:bg-blue-200"
                >
                  {CONTENT_TYPE_CONFIG[selectedType].label}
                  <span className="text-blue-900">×</span>
                </button>
              )}
              {selectedStatus !== 'ALL' && (
                <button
                  onClick={() => setSelectedStatus('ALL')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1 hover:bg-green-200"
                >
                  {STATUS_CONFIG[selectedStatus].label}
                  <span className="text-green-900">×</span>
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1 hover:bg-purple-200"
                >
                  Search: "{searchQuery}"
                  <span className="text-purple-900">×</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-4">Loading content...</p>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || selectedType !== 'ALL' || selectedStatus !== 'ALL'
                  ? 'No content found'
                  : 'No content yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedType !== 'ALL' || selectedStatus !== 'ALL'
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by creating your first piece of content'}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <Plus size={20} />
                Create Content
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContents.map((content) => {
              const typeConfig = CONTENT_TYPE_CONFIG[content.type];
              const statusConfig = STATUS_CONFIG[content.status];
              const Icon = typeConfig.icon;

              return (
                <div
                  key={content.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`p-3 rounded-lg bg-${typeConfig.color}-50`}>
                      <Icon size={24} className={`text-${typeConfig.color}-600`} />
                    </div>

                    {/* Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {content.titleEn}
                            </h3>
                            {content.featured && (
                              <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate mb-2">
                            {content.titleAr}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Globe size={14} />
                              /{content.slugEn}
                            </span>
                            {content._count && (
                              <span>{content._count.sections} sections</span>
                            )}
                            {content.publishedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(content.publishedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusConfig.color}-100 text-${statusConfig.color}-700`}
                          >
                            {statusConfig.label}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium bg-${typeConfig.color}-100 text-${typeConfig.color}-700`}
                          >
                            {typeConfig.label}
                          </span>
                        </div>
                      </div>

                      {content.descriptionEn && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {content.descriptionEn}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/content/${content.id}/edit`)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => window.open(`/${content.slugEn}`, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          <Eye size={16} />
                          Preview
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                          <Copy size={16} />
                          Duplicate
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {createStep === 'details' && (
                    <button
                      onClick={() => setCreateStep('template')}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {createStep === 'template'
                        ? 'Choose a Template'
                        : 'Content Details'}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      {createStep === 'template'
                        ? 'Select a template to get started with pre-built sections'
                        : `Creating: ${selectedTemplate?.name || ''}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetModal}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {createStep === 'template' ? (
                <TemplateSelector
                  onSelect={handleTemplateSelect}
                  onCancel={resetModal}
                />
              ) : (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* English Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (English) *
                    </label>
                    <input
                      type="text"
                      value={newContent.titleEn}
                      onChange={(e) => handleTitleChange(e.target.value, 'en')}
                      placeholder="e.g., About Us"
                      lang="en"
                      spellCheck={true}
                      autoCorrect="on"
                      autoCapitalize="words"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* English Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug (English)
                    </label>
                    <input
                      type="text"
                      value={newContent.slugEn}
                      readOnly
                      placeholder="auto-generated-from-title"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-mono text-sm"
                    />
                  </div>

                  {/* Arabic Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (Arabic) *
                      {isTranslatingTitle && (
                        <span className="text-blue-600 text-xs ml-2">Translating...</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={newContent.titleAr}
                      onChange={(e) => handleTitleChange(e.target.value, 'ar')}
                      placeholder="سيتم الترجمة تلقائياً"
                      dir="rtl"
                      lang="ar"
                      spellCheck={true}
                      autoCorrect="on"
                      autoCapitalize="words"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Arabic Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug (Arabic)
                    </label>
                    <input
                      type="text"
                      value={newContent.slugAr}
                      readOnly
                      placeholder="سيتم-الإنشاء-تلقائياً"
                      dir="rtl"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed font-mono text-sm"
                    />
                  </div>

                  {/* English Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (English)
                    </label>
                    <textarea
                      value={newContent.descriptionEn}
                      onChange={(e) =>
                        setNewContent((prev) => ({ ...prev, descriptionEn: e.target.value }))
                      }
                      placeholder="Brief description for SEO and previews"
                      lang="en"
                      spellCheck={true}
                      autoCorrect="on"
                      autoCapitalize="sentences"
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Arabic Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Arabic)
                      {isTranslatingDesc && (
                        <span className="text-blue-600 text-xs ml-2">Translating...</span>
                      )}
                    </label>
                    <textarea
                      value={newContent.descriptionAr}
                      onChange={(e) =>
                        setNewContent((prev) => ({ ...prev, descriptionAr: e.target.value }))
                      }
                      placeholder="سيتم الترجمة تلقائياً"
                      dir="rtl"
                      lang="ar"
                      spellCheck={true}
                      autoCorrect="on"
                      autoCapitalize="sentences"
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Template Info */}
                  {selectedTemplate && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Template Sections</h4>
                      <p className="text-sm text-blue-700 mb-3">
                        This template includes {selectedTemplate.defaultSections.length} pre-built
                        sections:
                      </p>
                      <ul className="space-y-1 text-sm text-blue-600">
                        {selectedTemplate.defaultSections.map((section, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                            {section.blueprintName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={resetModal}
                      className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateContent}
                      disabled={!newContent.titleEn || isCreating}
                      className={`px-6 py-2.5 rounded-lg font-medium ${
                        !newContent.titleEn || isCreating
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isCreating ? 'Creating...' : 'Create & Edit'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
