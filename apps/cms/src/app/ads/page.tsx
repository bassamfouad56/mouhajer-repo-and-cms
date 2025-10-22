'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MediaPicker from '@/components/MediaPicker';

interface Advertisement {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  image: string;
  videoUrl?: string;
  linkUrl: string;
  ctaText: { en: string; ar: string };
  zone: 'header' | 'sidebar' | 'footer' | 'inline' | 'popup' | 'banner';
  type: 'image' | 'video' | 'html';
  htmlContent?: { en: string; ar: string };
  startDate: string;
  endDate: string;
  alwaysActive: boolean;
  pages: string[];
  showOnAllPages: boolean;
  priority: number;
  clickCount: number;
  impressionCount: number;
  maxImpressions?: number;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [filterZone, setFilterZone] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const [formData, setFormData] = useState<{
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    image: string;
    videoUrl: string;
    linkUrl: string;
    ctaText: { en: string; ar: string };
    zone: 'header' | 'sidebar' | 'footer' | 'inline' | 'popup' | 'banner';
    type: 'image' | 'video' | 'html';
    htmlContent: { en: string; ar: string };
    startDate: string;
    endDate: string;
    alwaysActive: boolean;
    pages: string[];
    showOnAllPages: boolean;
    priority: number;
    maxImpressions: number | undefined;
    active: boolean;
    featured: boolean;
  }>({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    image: '',
    videoUrl: '',
    linkUrl: '',
    ctaText: { en: 'Learn More', ar: 'اعرف المزيد' },
    zone: 'banner',
    type: 'image',
    htmlContent: { en: '', ar: '' },
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    alwaysActive: false,
    pages: [],
    showOnAllPages: true,
    priority: 5,
    maxImpressions: undefined,
    active: true,
    featured: false,
  });

  useEffect(() => {
    fetchAds();

    const action = searchParams.get('action');
    if (action === 'new') {
      setShowForm(true);
    }
  }, [searchParams]);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingAd ? `/api/ads/${editingAd.id}` : '/api/ads';
      const method = editingAd ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchAds();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving ad:', error);
      alert('Failed to save advertisement');
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description,
      image: ad.image,
      videoUrl: ad.videoUrl || '',
      linkUrl: ad.linkUrl,
      ctaText: ad.ctaText,
      zone: ad.zone,
      type: ad.type,
      htmlContent: ad.htmlContent || { en: '', ar: '' },
      startDate: ad.startDate.split('T')[0],
      endDate: ad.endDate.split('T')[0],
      alwaysActive: ad.alwaysActive,
      pages: ad.pages,
      showOnAllPages: ad.showOnAllPages,
      priority: ad.priority,
      maxImpressions: ad.maxImpressions,
      active: ad.active,
      featured: ad.featured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;

    try {
      const response = await fetch(`/api/ads/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchAds();
      }
    } catch (error) {
      console.error('Error deleting ad:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: { en: '', ar: '' },
      description: { en: '', ar: '' },
      image: '',
      videoUrl: '',
      linkUrl: '',
      ctaText: { en: 'Learn More', ar: 'اعرف المزيد' },
      zone: 'banner',
      type: 'image',
      htmlContent: { en: '', ar: '' },
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      alwaysActive: false,
      pages: [],
      showOnAllPages: true,
      priority: 5,
      maxImpressions: undefined,
      active: true,
      featured: false,
    });
    setEditingAd(null);
    setShowForm(false);
  };

  const filteredAds = ads.filter(ad => {
    if (filterZone !== 'all' && ad.zone !== filterZone) return false;
    if (filterStatus === 'active' && !ad.active) return false;
    if (filterStatus === 'inactive' && ad.active) return false;
    return true;
  });

  const getCTR = (ad: Advertisement) => {
    if (ad.impressionCount === 0) return '0%';
    return ((ad.clickCount / ad.impressionCount) * 100).toFixed(2) + '%';
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading advertisements...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advertisements</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your website advertisements and campaigns
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? 'Cancel' : '+ New Advertisement'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.title.en}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title (Arabic)</label>
                  <input
                    type="text"
                    required
                    value={formData.title.ar}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Zone and Type */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zone</label>
                  <select
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value as 'header' | 'sidebar' | 'footer' | 'inline' | 'popup' | 'banner' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="header">Header</option>
                    <option value="sidebar">Sidebar</option>
                    <option value="footer">Footer</option>
                    <option value="inline">Inline</option>
                    <option value="popup">Popup</option>
                    <option value="banner">Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'image' | 'video' | 'html' })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="html">HTML</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Media */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ad Image</label>

                  {/* Selected Image Display */}
                  {formData.image && (
                    <div className="relative mb-3">
                      <img
                        src={formData.image}
                        alt="Ad"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Select Image Button */}
                  <button
                    type="button"
                    onClick={() => setShowMediaPicker(true)}
                    className="w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formData.image ? 'Change' : 'Select Image'}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Link URL</label>
                  <input
                    type="url"
                    required
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Scheduling */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Impressions</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxImpressions || ''}
                    onChange={(e) => setFormData({ ...formData, maxImpressions: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.alwaysActive}
                    onChange={(e) => setFormData({ ...formData, alwaysActive: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Always Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingAd ? 'Update' : 'Create'} Advertisement
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Zone</label>
            <select
              value={filterZone}
              onChange={(e) => setFilterZone(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Zones</option>
              <option value="header">Header</option>
              <option value="sidebar">Sidebar</option>
              <option value="footer">Footer</option>
              <option value="inline">Inline</option>
              <option value="popup">Popup</option>
              <option value="banner">Banner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Ads List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              All Advertisements ({filteredAds.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAds.map((ad) => (
                  <tr key={ad.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ad.title.en}</div>
                      <div className="text-sm text-gray-500">{ad.title.ar}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {ad.zone}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ad.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ad.impressionCount}
                      {ad.maxImpressions && ` / ${ad.maxImpressions}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ad.clickCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getCTR(ad)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ad.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(ad)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAds.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No advertisements found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={(files) => {
            const selectedFile = Array.isArray(files) ? files[0] : files;
            setFormData({ ...formData, image: selectedFile.url });
            setShowMediaPicker(false);
          }}
          onClose={() => setShowMediaPicker(false)}
          multiple={false}
          fileType="image"
        />
      )}
    </div>
  );
}
