'use client';

import { useState, useEffect } from 'react';
import GA4PropertyForm from '@/components/analytics/GA4PropertyForm';
import SearchConsolePropertyForm from '@/components/analytics/SearchConsolePropertyForm';

type Platform = 'google-ads' | 'gtm' | 'ga4' | 'search-console';

interface Property {
  id: string;
  [key: string]: any;
}

export default function AnalyticsSettingsNew() {
  const [activeTab, setActiveTab] = useState<Platform>('ga4');
  const [properties, setProperties] = useState<Record<Platform, Property[]>>({
    'google-ads': [],
    'gtm': [],
    'ga4': [],
    'search-console': []
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProperties(activeTab);
  }, [activeTab]);

  const fetchProperties = async (platform: Platform) => {
    try {
      setLoading(true);
      const apiMap = {
        'google-ads': '/api/google-ads/accounts',
        'gtm': '/api/gtm/accounts',
        'ga4': '/api/ga4/properties',
        'search-console': '/api/search-console/properties'
      };

      const response = await fetch(apiMap[platform]);
      const data = await response.json();

      setProperties(prev => ({
        ...prev,
        [platform]: Array.isArray(data) ? data : []
      }));
    } catch (error) {
      console.error(`Failed to fetch ${platform} properties:`, error);
      setProperties(prev => ({ ...prev, [platform]: [] }));
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (platform: Platform, id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const apiMap = {
        'google-ads': `/api/google-ads/accounts?id=${id}`,
        'gtm': `/api/gtm/accounts?id=${id}`,
        'ga4': `/api/ga4/properties?id=${id}`,
        'search-console': `/api/search-console/properties?id=${id}`
      };

      const response = await fetch(apiMap[platform], { method: 'DELETE' });

      if (response.ok) {
        alert('Property deleted successfully!');
        fetchProperties(platform);
      } else {
        const error = await response.json();
        alert(`Failed to delete: ${error.error}`);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete property');
    }
  };

  const tabs = [
    { id: 'ga4' as Platform, name: 'Google Analytics 4', icon: '📊' },
    { id: 'search-console' as Platform, name: 'Search Console', icon: '🔍' },
    { id: 'google-ads' as Platform, name: 'Google Ads', icon: '💰' },
    { id: 'gtm' as Platform, name: 'Tag Manager', icon: '🏷️' }
  ];

  const renderPropertyCard = (property: Property, platform: Platform) => {
    const getPropertyName = () => {
      if (platform === 'ga4') return property.propertyName;
      if (platform === 'search-console') return property.propertyName;
      return property.accountName;
    };

    const getPropertyId = () => {
      if (platform === 'ga4') return property.propertyId;
      if (platform === 'search-console') return property.siteUrl;
      return property.customerId || property.accountId;
    };

    return (
      <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{getPropertyName()}</h3>
              {property.isActive ? (
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                  Active
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{getPropertyId()}</p>

            {property.lastSyncAt && (
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>Last synced: {new Date(property.lastSyncAt).toLocaleString()}</span>
                <span className={`px-2 py-1 rounded ${
                  property.syncStatus === 'success' ? 'bg-green-50 text-green-700' :
                  property.syncStatus === 'error' ? 'bg-red-50 text-red-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  {property.syncStatus}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => deleteProperty(platform, property.id)}
            className="ml-4 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const renderAddPropertyGuide = (platform: Platform) => {
    const guides = {
      'ga4': {
        title: 'Add Google Analytics 4 Property',
        fields: [
          { label: 'Property Name', example: 'My Website Analytics' },
          { label: 'Property ID', example: '123456789 (from GA4 admin)' },
          { label: 'Measurement ID', example: 'G-XXXXXXXXXX (optional)' },
          { label: 'Client Email', example: 'service-account@project.iam.gserviceaccount.com' },
          { label: 'Private Key', example: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----' },
          { label: 'Project ID', example: 'your-google-cloud-project' }
        ],
        docs: 'https://developers.google.com/analytics/devguides/reporting/data/v1'
      },
      'search-console': {
        title: 'Add Search Console Property',
        fields: [
          { label: 'Property Name', example: 'My Website SEO' },
          { label: 'Site URL', example: 'https://yourdomain.com' },
          { label: 'Client Email', example: 'service-account@project.iam.gserviceaccount.com' },
          { label: 'Private Key', example: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----' },
          { label: 'Project ID', example: 'your-google-cloud-project' }
        ],
        docs: 'https://developers.google.com/webmaster-tools'
      },
      'google-ads': {
        title: 'Add Google Ads Account',
        fields: [
          { label: 'Account Name', example: 'My Ads Account' },
          { label: 'Customer ID', example: '123-456-7890' },
          { label: 'Developer Token', example: 'Your developer token' },
          { label: 'Client ID', example: 'OAuth2 Client ID' },
          { label: 'Client Secret', example: 'OAuth2 Client Secret' },
          { label: 'Refresh Token', example: 'OAuth2 Refresh Token' }
        ],
        docs: 'https://developers.google.com/google-ads/api'
      },
      'gtm': {
        title: 'Add Tag Manager Account',
        fields: [
          { label: 'Account Name', example: 'My GTM Account' },
          { label: 'Account ID', example: '123456' },
          { label: 'Account Path', example: 'accounts/123456' },
          { label: 'Client Email', example: 'service-account@project.iam.gserviceaccount.com' },
          { label: 'Private Key', example: '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----' },
          { label: 'Project ID', example: 'your-google-cloud-project' }
        ],
        docs: 'https://developers.google.com/tag-platform/tag-manager/api'
      }
    };

    const guide = guides[platform];

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">{guide.title}</h3>

        <div className="space-y-3 mb-4">
          <p className="text-sm text-blue-800 font-medium">Required Fields:</p>
          {guide.fields.map((field, index) => (
            <div key={index} className="bg-white rounded p-3">
              <p className="text-sm font-medium text-gray-900">{field.label}</p>
              <p className="text-xs text-gray-600 mt-1">{field.example}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm font-medium text-gray-900 mb-2">📝 How to Add via API:</p>
          <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
            POST /api/{platform === 'google-ads' ? 'google-ads/accounts' : platform === 'gtm' ? 'gtm/accounts' : `${platform}/properties`}
          </code>
        </div>

        <div className="flex items-center justify-between">
          <a
            href={guide.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View API Documentation →
          </a>
          <a
            href="/ANALYTICS_ACCESS_GUIDE.md"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Setup Guide →
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Settings</h1>
        <p className="text-gray-600 mt-1">Manage your analytics properties and credentials</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
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

      {/* Content */}
      <div>
        {/* Add New Property Form */}
        {showForm && (
          <div className="mb-6">
            {activeTab === 'ga4' && (
              <GA4PropertyForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchProperties('ga4');
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
            {activeTab === 'search-console' && (
              <SearchConsolePropertyForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchProperties('search-console');
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        )}

        {/* Add Property Guide (when form is not shown) */}
        {!showForm && renderAddPropertyGuide(activeTab)}

        {/* Properties List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.name} Properties
            </h2>
            <div className="flex items-center space-x-3">
              {(activeTab === 'ga4' || activeTab === 'search-console') && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  + Add Property
                </button>
              )}
              <button
                onClick={() => fetchProperties(activeTab)}
                disabled={loading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading properties...</div>
            </div>
          ) : properties[activeTab].length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-600 mb-4">No properties configured yet</p>
              <p className="text-sm text-gray-500">
                Use the API endpoint above to add your first property, or check the setup guide
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties[activeTab].map((property) => renderPropertyCard(property, activeTab))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/analytics/overview"
              className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-900">Overview</div>
            </a>
            <a
              href="/analytics/ga4"
              className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-2xl mb-2">📈</div>
              <div className="text-sm font-medium text-gray-900">GA4 Dashboard</div>
            </a>
            <a
              href="/analytics/search-console"
              className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="text-2xl mb-2">🔍</div>
              <div className="text-sm font-medium text-gray-900">Search Console</div>
            </a>
            <a
              href="/ANALYTICS_ACCESS_GUIDE.md"
              target="_blank"
              className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="text-2xl mb-2">📖</div>
              <div className="text-sm font-medium text-gray-900">Setup Guide</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
