'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GoogleService {
  id: string;
  name: string;
  icon: string;
  description: string;
  configured: boolean;
  count?: number;
  apiEndpoint: string;
  setupEndpoint?: string;
  dashboardLink?: string;
}

interface SharedCredentials {
  clientEmail: string;
  projectId: string;
  privateKey: string;
}

export default function GoogleIntegrationPage() {
  const [services, setServices] = useState<GoogleService[]>([]);
  const [sharedCreds, setSharedCreds] = useState<SharedCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupLoading, setSetupLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchGoogleServices();
  }, []);

  const fetchGoogleServices = async () => {
    try {
      setLoading(true);

      // Fetch all Google services in parallel
      const [ga4Res, gbpRes, gscRes, gtmRes] = await Promise.all([
        fetch('/api/ga4/properties').then(r => r.json()),
        fetch('/api/business-profile/accounts').then(r => r.json()),
        fetch('/api/search-console/properties').then(r => r.json()),
        fetch('/api/gtm/accounts').then(r => r.json()),
      ]);

      // Extract shared credentials from first configured service
      if (Array.isArray(ga4Res) && ga4Res.length > 0) {
        setSharedCreds({
          clientEmail: ga4Res[0].clientEmail,
          projectId: ga4Res[0].projectId,
          privateKey: ga4Res[0].privateKey
        });
      }

      const servicesData: GoogleService[] = [
        {
          id: 'ga4',
          name: 'Google Analytics 4',
          icon: '📊',
          description: 'Track website traffic, user behavior, and conversions',
          configured: Array.isArray(ga4Res) && ga4Res.length > 0,
          count: Array.isArray(ga4Res) ? ga4Res.length : 0,
          apiEndpoint: '/api/ga4/properties',
          dashboardLink: '/analytics/ga4'
        },
        {
          id: 'gbp',
          name: 'Google Business Profile',
          icon: '⭐',
          description: 'Manage reviews, respond to customers, track performance',
          configured: Array.isArray(gbpRes) && gbpRes.length > 0,
          count: Array.isArray(gbpRes) ? gbpRes.length : 0,
          apiEndpoint: '/api/business-profile/accounts',
          setupEndpoint: '/api/business-profile/accounts',
          dashboardLink: '/analytics/business-profile'
        },
        {
          id: 'gsc',
          name: 'Google Search Console',
          icon: '🔍',
          description: 'Monitor search performance, keywords, and SEO health',
          configured: Array.isArray(gscRes) && gscRes.length > 0,
          count: Array.isArray(gscRes) ? gscRes.length : 0,
          apiEndpoint: '/api/search-console/properties',
          setupEndpoint: '/api/search-console/properties',
          dashboardLink: '/analytics/search-console'
        },
        {
          id: 'gtm',
          name: 'Google Tag Manager',
          icon: '🏷️',
          description: 'Manage marketing tags and tracking pixels',
          configured: Array.isArray(gtmRes) && gtmRes.length > 0,
          count: Array.isArray(gtmRes) ? gtmRes.length : 0,
          apiEndpoint: '/api/gtm/accounts',
          setupEndpoint: '/api/gtm/accounts',
          dashboardLink: '/analytics/gtm'
        },
        {
          id: 'pagespeed',
          name: 'PageSpeed Insights',
          icon: '⚡',
          description: 'Monitor website performance and Core Web Vitals',
          configured: true, // No setup needed
          apiEndpoint: '/api/pagespeed',
          dashboardLink: '/analytics/pagespeed'
        },
        {
          id: 'trends',
          name: 'Google Trends',
          icon: '📈',
          description: 'Track search trends and keyword popularity',
          configured: true, // No auth needed
          apiEndpoint: '/api/trends',
          dashboardLink: '/analytics/trends'
        },
        {
          id: 'sheets',
          name: 'Google Sheets',
          icon: '📑',
          description: 'Export analytics data to Google Sheets',
          configured: true, // Uses same credentials
          apiEndpoint: '/api/sheets',
          dashboardLink: '/analytics/sheets'
        }
      ];

      setServices(servicesData);
    } catch (error) {
      console.error('Failed to fetch Google services:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickSetup = async (serviceId: string) => {
    if (!sharedCreds) {
      alert('No shared credentials found. Please set up Google Analytics 4 first.');
      return;
    }

    setSetupLoading(serviceId);

    try {
      const setupData: any = {
        clientEmail: sharedCreds.clientEmail,
        privateKey: sharedCreds.privateKey,
        projectId: sharedCreds.projectId,
        isActive: true
      };

      // Service-specific setup
      let endpoint = '';
      if (serviceId === 'gbp') {
        endpoint = '/api/business-profile/accounts';
        setupData.accountName = 'Mouhajer Business Profile';
        setupData.gbpAccountId = 'accounts/YOUR_ACCOUNT_ID'; // User will need to update
        setupData.locationId = 'locations/YOUR_LOCATION_ID';
      } else if (serviceId === 'gsc') {
        endpoint = '/api/search-console/properties';
        setupData.propertyName = 'Mouhajer Website';
        setupData.siteUrl = 'https://mouhajer.com'; // User will need to update
      } else if (serviceId === 'gtm') {
        endpoint = '/api/gtm/accounts';
        setupData.accountName = 'Mouhajer GTM';
        setupData.accountId = 'YOUR_ACCOUNT_ID'; // User will need to update
        setupData.accountPath = 'accounts/YOUR_ACCOUNT_ID';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData)
      });

      if (response.ok) {
        alert(`${services.find(s => s.id === serviceId)?.name} configured successfully! You may need to update the account/property IDs.`);
        fetchGoogleServices();
      } else {
        const error = await response.json();
        alert(`Setup failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Setup failed:', error);
      alert('Setup failed. Please try again.');
    } finally {
      setSetupLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google services...</p>
        </div>
      </div>
    );
  }

  const configuredCount = services.filter(s => s.configured).length;
  const totalServicesNeedingSetup = services.filter(s => !s.configured && s.setupEndpoint).length;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Integration Hub</h1>
              <p className="text-gray-600">
                Unified dashboard for all your Google services using one service account
              </p>
            </div>
            <Link
              href="/analytics/settings"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Advanced Settings
            </Link>
          </div>

          {/* Shared Credentials Status */}
          {sharedCreds && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    🔐 Shared Service Account
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700 font-medium">Service Account</p>
                      <p className="text-blue-900 font-mono text-xs mt-1 break-all">
                        {sharedCreds.clientEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700 font-medium">Project ID</p>
                      <p className="text-blue-900 font-mono text-xs mt-1">
                        {sharedCreds.projectId}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-blue-700 mt-3">
                    ✓ This service account is shared across all Google services below
                  </p>
                </div>
                <div className="ml-6 text-right">
                  <div className="text-3xl font-bold text-blue-900">{configuredCount}/{services.length}</div>
                  <p className="text-sm text-blue-700 mt-1">Services Active</p>
                </div>
              </div>
            </div>
          )}

          {!sharedCreds && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Service Account Found</h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Set up Google Analytics 4 first to configure your shared service account, then use it for all other services.
                  </p>
                  <Link
                    href="/analytics/settings"
                    className="inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
                  >
                    Set Up GA4 →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md ${
                service.configured
                  ? 'border-green-200 hover:border-green-300'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{service.icon}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{service.name}</h3>
                      {service.count !== undefined && service.count > 0 && (
                        <p className="text-xs text-gray-500">{service.count} configured</p>
                      )}
                    </div>
                  </div>
                  {service.configured ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Not Set Up
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {service.configured && service.dashboardLink && (
                    <Link
                      href={service.dashboardLink}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                    >
                      Open Dashboard
                    </Link>
                  )}

                  {!service.configured && service.setupEndpoint && sharedCreds && (
                    <button
                      onClick={() => quickSetup(service.id)}
                      disabled={setupLoading === service.id}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {setupLoading === service.id ? 'Setting up...' : '⚡ Quick Setup'}
                    </button>
                  )}

                  {!service.configured && !service.setupEndpoint && (
                    <Link
                      href={service.dashboardLink || '#'}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center text-sm font-medium"
                    >
                      View
                    </Link>
                  )}
                </div>

                {/* Credentials Indicator */}
                {sharedCreds && service.configured && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Using shared service account
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Quick Start Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">One Account, All Services</h4>
              <p className="text-sm text-gray-600 mb-3">
                All Google services use the same service account from Google Cloud. This means:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Set up once, use everywhere</li>
                <li>✓ No duplicate credentials</li>
                <li>✓ Easier to manage permissions</li>
                <li>✓ Consistent access control</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required APIs in Google Cloud</h4>
              <p className="text-sm text-gray-600 mb-3">
                Make sure these APIs are enabled in your Google Cloud project:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Analytics Data API & Admin API</li>
                <li>• My Business APIs</li>
                <li>• Search Console API</li>
                <li>• Tag Manager API</li>
                <li>• Sheets API</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Need help setting up?</p>
                <p>Check the <Link href="/ANALYTICS_ACCESS_GUIDE.md" className="underline hover:text-blue-700">complete setup guide</Link> for step-by-step instructions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
