'use client';

import { useState, useEffect, useCallback } from 'react';
import { translateText, debounce } from '@/lib/translate';

interface SiteSettings {
  siteName: { en: string; ar: string };
  siteDescription: { en: string; ar: string };
  contactEmail: string;
  contactPhone: string;
  address: { en: string; ar: string };
  socialMedia: {
    instagram: string;
    facebook: string;
    linkedin: string;
    twitter: string;
  };
  seo: {
    defaultTitle: { en: string; ar: string };
    defaultDescription: { en: string; ar: string };
    keywords: { en: string[]; ar: string[] };
    robotsTxt: string;
    googleAnalyticsId: string;
    googleSearchConsole: string;
    facebookPixelId: string;
    canonicalUrl: string;
    openGraph: {
      image: string;
      type: string;
    };
  };
  appearance: {
    primaryColor: string;
    logo: string;
    favicon: string;
  };
}

const defaultSettings: SiteSettings = {
  siteName: {
    en: 'Mouhajer International Design',
    ar: 'مهاجر الدولية للتصميم'
  },
  siteDescription: {
    en: 'Premier luxury interior design company in Dubai, UAE',
    ar: 'شركة التصميم الداخلي الفاخر الرائدة في دبي، الإمارات العربية المتحدة'
  },
  contactEmail: 'info@mouhajerdesign.com',
  contactPhone: '+971 4 123 4567',
  address: {
    en: 'Dubai Design District, Dubai, UAE',
    ar: 'حي دبي للتصميم، دبي، الإمارات العربية المتحدة'
  },
  socialMedia: {
    instagram: 'https://instagram.com/mouhajerdesign',
    facebook: 'https://facebook.com/mouhajerdesign',
    linkedin: 'https://linkedin.com/company/mouhajerdesign',
    twitter: 'https://twitter.com/mouhajerdesign'
  },
  seo: {
    defaultTitle: {
      en: 'Luxury Interior Design Dubai | Mouhajer International Design',
      ar: 'تصميم داخلي فاخر دبي | مهاجر الدولية للتصميم'
    },
    defaultDescription: {
      en: 'Award-winning luxury interior design company in Dubai. Transform your villa, apartment, or commercial space with our expert designers.',
      ar: 'شركة التصميم الداخلي الفاخر الحائزة على جوائز في دبي. حول الفيلا أو الشقة أو المساحة التجارية مع مصممينا الخبراء.'
    },
    keywords: {
      en: ['interior design Dubai', 'luxury design UAE', 'villa design', 'commercial design'],
      ar: ['تصميم داخلي دبي', 'تصميم فاخر الإمارات', 'تصميم فيلا', 'تصميم تجاري']
    },
    robotsTxt: 'User-agent: *\nDisallow:\nSitemap: https://mouhajerdesign.com/sitemap.xml',
    googleAnalyticsId: '',
    googleSearchConsole: '',
    facebookPixelId: '',
    canonicalUrl: 'https://mouhajerdesign.com',
    openGraph: {
      image: '/images/og-image.jpg',
      type: 'website'
    }
  },
  appearance: {
    primaryColor: '#2563eb',
    logo: '/images/logo.png',
    favicon: '/images/favicon.ico'
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'contact' | 'social' | 'seo' | 'appearance'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seoPreview, setSeoPreview] = useState<'en' | 'ar'>('en');
  const [autoTranslate, setAutoTranslate] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAutoTranslate = useCallback(
    async (field: string, value: string, sourceLang: 'en' | 'ar', setter: (value: string) => void) => {
      if (!autoTranslate || !value || value.trim() === '') return;

      const targetLang = sourceLang === 'en' ? 'ar' : 'en';
      try {
        const translated = await translateText(value, targetLang);
        setter(translated);
      } catch (error) {
        console.error('Translation failed:', error);
      }
    },
    [autoTranslate]
  );

  const debouncedAutoTranslate = useCallback(
    debounce((field: string, value: string, sourceLang: 'en' | 'ar', setter: (value: string) => void) => {
      handleAutoTranslate(field, value, sourceLang, setter);
    }, 1000),
    [handleAutoTranslate]
  );

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'contact', name: 'Contact', icon: '📞' },
    { id: 'social', name: 'Social Media', icon: '📱' },
    { id: 'seo', name: 'SEO', icon: '🔍' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' }
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your website configuration and preferences.
                </p>
              </div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoTranslate}
                  onChange={(e) => setAutoTranslate(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-translate EN ↔ AR</span>
              </label>
            </div>

            {loading ? (
              <div className="bg-white shadow rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading settings...</p>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as 'general' | 'contact' | 'social' | 'seo' | 'appearance')}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">General Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Site Name (English)</label>
                        <input
                          type="text"
                          value={settings.siteName.en}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSettings(prev => ({
                              ...prev,
                              siteName: { ...prev.siteName, en: value }
                            }));
                            debouncedAutoTranslate('siteName', value, 'en', (translated) => {
                              setSettings(prev => ({
                                ...prev,
                                siteName: { ...prev.siteName, ar: translated }
                              }));
                            });
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Site Name (Arabic)</label>
                        <input
                          type="text"
                          value={settings.siteName.ar}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSettings(prev => ({
                              ...prev,
                              siteName: { ...prev.siteName, ar: value }
                            }));
                            debouncedAutoTranslate('siteName', value, 'ar', (translated) => {
                              setSettings(prev => ({
                                ...prev,
                                siteName: { ...prev.siteName, en: translated }
                              }));
                            });
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description (English)</label>
                        <textarea
                          rows={3}
                          value={settings.siteDescription.en}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            siteDescription: { ...prev.siteDescription, en: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Description (Arabic)</label>
                        <textarea
                          rows={3}
                          value={settings.siteDescription.ar}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            siteDescription: { ...prev.siteDescription, ar: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          value={settings.contactEmail}
                          onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          value={settings.contactPhone}
                          onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address (English)</label>
                        <textarea
                          rows={3}
                          value={settings.address.en}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            address: { ...prev.address, en: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address (Arabic)</label>
                        <textarea
                          rows={3}
                          value={settings.address.ar}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            address: { ...prev.address, ar: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Instagram</label>
                        <input
                          type="url"
                          value={settings.socialMedia.instagram}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, instagram: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Facebook</label>
                        <input
                          type="url"
                          value={settings.socialMedia.facebook}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, facebook: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://facebook.com/page"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                        <input
                          type="url"
                          value={settings.socialMedia.linkedin}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, linkedin: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://linkedin.com/company/name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Twitter</label>
                        <input
                          type="url"
                          value={settings.socialMedia.twitter}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            socialMedia: { ...prev.socialMedia, twitter: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Preview:</span>
                        <button
                          onClick={() => setSeoPreview('en')}
                          className={`px-3 py-1 text-xs rounded ${seoPreview === 'en' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          English
                        </button>
                        <button
                          onClick={() => setSeoPreview('ar')}
                          className={`px-3 py-1 text-xs rounded ${seoPreview === 'ar' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                        >
                          Arabic
                        </button>
                      </div>
                    </div>

                    {/* SEO Preview */}
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Search Engine Preview</h4>
                      <div className="bg-white p-4 rounded border">
                        <div className="text-blue-600 hover:underline text-lg font-medium cursor-pointer">
                          {settings.seo.defaultTitle?.[seoPreview] || 'Page Title'}
                        </div>
                        <div className="text-green-600 text-sm mt-1">
                          {settings.seo.canonicalUrl}
                        </div>
                        <div className="text-gray-600 text-sm mt-1 leading-relaxed">
                          {settings.seo.defaultDescription?.[seoPreview] || 'Meta description will appear here...'}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Title:</span> {settings.seo.defaultTitle?.[seoPreview]?.length || 0}/60 characters
                        <span className="ml-4 font-medium">Description:</span> {settings.seo.defaultDescription?.[seoPreview]?.length || 0}/160 characters
                      </div>
                    </div>

                    {/* Basic SEO */}
                    <div className="space-y-6">
                      <h4 className="text-md font-medium text-gray-900">Basic SEO</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Default Title (English)</label>
                          <input
                            type="text"
                            value={settings.seo.defaultTitle.en}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, defaultTitle: { ...prev.seo.defaultTitle, en: e.target.value } }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            maxLength={60}
                          />
                          <p className="mt-1 text-xs text-gray-500">Recommended: 50-60 characters</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Default Title (Arabic)</label>
                          <input
                            type="text"
                            value={settings.seo.defaultTitle.ar}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, defaultTitle: { ...prev.seo.defaultTitle, ar: e.target.value } }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            maxLength={60}
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Meta Description (English)</label>
                          <textarea
                            rows={3}
                            value={settings.seo.defaultDescription.en}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, defaultDescription: { ...prev.seo.defaultDescription, en: e.target.value } }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            maxLength={160}
                          />
                          <p className="mt-1 text-xs text-gray-500">Recommended: 150-160 characters</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Meta Description (Arabic)</label>
                          <textarea
                            rows={3}
                            value={settings.seo.defaultDescription.ar}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, defaultDescription: { ...prev.seo.defaultDescription, ar: e.target.value } }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            maxLength={160}
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Keywords (English)</label>
                          <input
                            type="text"
                            value={settings.seo.keywords.en.join(', ')}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, keywords: { ...prev.seo.keywords, en: e.target.value.split(', ').filter(k => k.trim()) } }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="interior design Dubai, luxury design UAE"
                          />
                          <p className="mt-1 text-xs text-gray-500">Separate keywords with commas</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Keywords (Arabic)</label>
                          <input
                            type="text"
                            value={settings.seo.keywords.ar.join(', ')}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, keywords: { ...prev.seo.keywords, ar: e.target.value.split(', ').filter(k => k.trim()) } }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="تصميم داخلي دبي، تصميم فاخر الإمارات"
                            dir="rtl"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Canonical URL</label>
                        <input
                          type="url"
                          value={settings.seo.canonicalUrl}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            seo: { ...prev.seo, canonicalUrl: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://mouhajerdesign.com"
                        />
                        <p className="mt-1 text-xs text-gray-500">The main URL for your website</p>
                      </div>
                    </div>

                    {/* Advanced SEO */}
                    <div className="space-y-6 pt-6 border-t border-gray-200">
                      <h4 className="text-md font-medium text-gray-900">Advanced SEO</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Open Graph Image</label>
                          <input
                            type="text"
                            value={settings.seo.openGraph.image}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, openGraph: { ...prev.seo.openGraph, image: e.target.value } }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="/images/og-image.jpg"
                          />
                          <p className="mt-1 text-xs text-gray-500">Image shown when sharing on social media (1200x630px)</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Open Graph Type</label>
                          <select
                            value={settings.seo.openGraph.type}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, openGraph: { ...prev.seo.openGraph, type: e.target.value } }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="website">Website</option>
                            <option value="article">Article</option>
                            <option value="business.business">Business</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Robots.txt Content</label>
                        <textarea
                          rows={4}
                          value={settings.seo.robotsTxt}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            seo: { ...prev.seo, robotsTxt: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
                          placeholder="User-agent: *\nDisallow:\nSitemap: https://yoursite.com/sitemap.xml"
                        />
                        <p className="mt-1 text-xs text-gray-500">Instructions for search engine crawlers</p>
                      </div>
                    </div>

                    {/* Analytics & Tracking */}
                    <div className="space-y-6 pt-6 border-t border-gray-200">
                      <h4 className="text-md font-medium text-gray-900">Analytics & Tracking</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Google Analytics ID</label>
                          <input
                            type="text"
                            value={settings.seo.googleAnalyticsId}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, googleAnalyticsId: e.target.value }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="G-XXXXXXXXXX"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Facebook Pixel ID</label>
                          <input
                            type="text"
                            value={settings.seo.facebookPixelId}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              seo: { ...prev.seo, facebookPixelId: e.target.value }
                            }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="123456789012345"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Google Search Console Verification</label>
                        <input
                          type="text"
                          value={settings.seo.googleSearchConsole}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            seo: { ...prev.seo, googleSearchConsole: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="google-site-verification content value"
                        />
                        <p className="mt-1 text-xs text-gray-500">Meta tag content for Google Search Console verification</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Appearance & Branding</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                        <div className="mt-1 flex items-center space-x-3">
                          <input
                            type="color"
                            value={settings.appearance.primaryColor}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              appearance: { ...prev.appearance, primaryColor: e.target.value }
                            }))}
                            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.appearance.primaryColor}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              appearance: { ...prev.appearance, primaryColor: e.target.value }
                            }))}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                        <input
                          type="text"
                          value={settings.appearance.logo}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            appearance: { ...prev.appearance, logo: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="/images/logo.png"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Favicon URL</label>
                        <input
                          type="text"
                          value={settings.appearance.favicon}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            appearance: { ...prev.appearance, favicon: e.target.value }
                          }))}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="/images/favicon.ico"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="pt-8 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </button>
                </div>
            </div>
            </div>
          )}
        </div>
      </div>
  );
}