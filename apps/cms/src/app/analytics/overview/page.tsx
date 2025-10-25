'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface OverviewStats {
  googleAds: {
    totalImpressions: number;
    totalClicks: number;
    totalCost: number;
    totalConversions: number;
    averageCTR: number;
    averageCPC: number;
  };
  ga4: {
    totalActiveUsers: number;
    totalSessions: number;
    totalPageViews: number;
    averageEngagementRate: number;
    totalConversions: number;
    totalRevenue: number;
  };
  searchConsole: {
    totalClicks: number;
    totalImpressions: number;
    averageCTR: number;
    averagePosition: number;
  };
  gtm: {
    totalContainers: number;
    totalTags: number;
    totalTriggers: number;
    totalVariables: number;
  };
  meta?: {
    hasAnyProperties: boolean;
    propertyCounts: {
      googleAds: number;
      ga4: number;
      searchConsole: number;
      gtm: number;
    };
    hasData: {
      googleAds: boolean;
      ga4: boolean;
      searchConsole: boolean;
      gtm: boolean;
    };
  };
}

export default function AnalyticsOverviewPage() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchOverviewStats();
  }, [timeRange]);

  const fetchOverviewStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/overview?daysBack=${timeRange}`);
      if (!response.ok) throw new Error('Failed to fetch overview stats');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading analytics overview...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2 text-xl">Error Loading Analytics</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2"><strong>Possible causes:</strong></p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Database connection issue</li>
              <li>Missing Prisma client</li>
              <li>Server error</li>
            </ul>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchOverviewStats}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
            <a
              href="/analytics/settings"
              className="px-4 py-2 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50"
            >
              Go to Settings
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Show setup wizard if no properties configured
  if (stats && stats.meta && !stats.meta.hasAnyProperties) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-blue-600 rounded-full mb-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Analytics!</h2>
              <p className="text-lg text-gray-600">Let's get you set up in 3 easy steps</p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Step 1 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Your First Property</h3>
                    <p className="text-gray-600 mb-3">Choose which platform to connect first:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href="/analytics/settings"
                        className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <span className="text-2xl mr-3">📊</span>
                        <div>
                          <div className="font-semibold text-green-900">Google Analytics 4</div>
                          <div className="text-xs text-green-700">Track user behavior</div>
                        </div>
                      </a>
                      <a
                        href="/analytics/settings"
                        className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <span className="text-2xl mr-3">🔍</span>
                        <div>
                          <div className="font-semibold text-purple-900">Search Console</div>
                          <div className="text-xs text-purple-700">Monitor SEO</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gray-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Enter Your Credentials</h3>
                    <p className="text-gray-600">Use the easy-to-use forms to add your Google Cloud credentials</p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-gray-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sync & Enjoy!</h3>
                    <p className="text-gray-600">Click "Sync Data" and watch your analytics come to life</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/analytics/settings"
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Get Started - Add Your First Property
              </a>
              <p className="mt-4 text-sm text-gray-600">
                Need help? Check our <a href="/ANALYTICS_ACCESS_GUIDE.md" className="text-blue-600 hover:underline">Setup Guide</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if properties configured but no data yet
  if (stats && stats.meta && stats.meta.hasAnyProperties && !Object.values(stats.meta.hasData).some(v => v)) {
    return (
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Properties Configured!</h2>
              <p className="text-gray-600">Now let's sync your data</p>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your configured properties:</h3>
              <div className="space-y-2 text-sm">
                {stats.meta.propertyCounts.ga4 > 0 && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <span>📊 Google Analytics 4</span>
                    <span className="font-semibold text-green-700">{stats.meta.propertyCounts.ga4} configured</span>
                  </div>
                )}
                {stats.meta.propertyCounts.searchConsole > 0 && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                    <span>🔍 Search Console</span>
                    <span className="font-semibold text-purple-700">{stats.meta.propertyCounts.searchConsole} configured</span>
                  </div>
                )}
                {stats.meta.propertyCounts.googleAds > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <span>💰 Google Ads</span>
                    <span className="font-semibold text-blue-700">{stats.meta.propertyCounts.googleAds} configured</span>
                  </div>
                )}
                {stats.meta.propertyCounts.gtm > 0 && (
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                    <span>🏷️ Tag Manager</span>
                    <span className="font-semibold text-orange-700">{stats.meta.propertyCounts.gtm} configured</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-3">Next step: Sync your data</h3>
              <div className="flex justify-center space-x-3">
                {stats.meta.propertyCounts.ga4 > 0 && (
                  <a
                    href="/analytics/ga4"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Sync GA4
                  </a>
                )}
                {stats.meta.propertyCounts.searchConsole > 0 && (
                  <a
                    href="/analytics/search-console"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Sync Search Console
                  </a>
                )}
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Go to each dashboard and click the "Sync Data" button
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-gray-800 font-semibold mb-2">No Data Available</h3>
          <p className="text-gray-600">Unable to load analytics data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-gray-600 mt-1">Unified view of all your Google marketing platforms</p>
        </div>
        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Google Ads Stats */}
        <Link href="/analytics" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Google Ads</h3>
            <span className="text-blue-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Total Impressions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.googleAds.totalImpressions.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Clicks</p>
                <p className="text-sm font-semibold">{stats.googleAds.totalClicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">CTR</p>
                <p className="text-sm font-semibold">{(stats.googleAds.averageCTR * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Cost</p>
                <p className="text-sm font-semibold">${stats.googleAds.totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Link>

        {/* GA4 Stats */}
        <Link href="/analytics/ga4" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Analytics 4</h3>
            <span className="text-green-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.ga4.totalActiveUsers.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Sessions</p>
                <p className="text-sm font-semibold">{stats.ga4.totalSessions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Page Views</p>
                <p className="text-sm font-semibold">{stats.ga4.totalPageViews.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-sm font-semibold">${stats.ga4.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Search Console Stats */}
        <Link href="/analytics/search-console" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Search Console</h3>
            <span className="text-purple-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.searchConsole.totalClicks.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Impressions</p>
                <p className="text-sm font-semibold">{stats.searchConsole.totalImpressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">CTR</p>
                <p className="text-sm font-semibold">{(stats.searchConsole.averageCTR * 100).toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Position</p>
                <p className="text-sm font-semibold">{stats.searchConsole.averagePosition.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Tag Manager Stats */}
        <Link href="/analytics/gtm" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tag Manager</h3>
            <span className="text-orange-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <p className="text-sm text-gray-600">Total Containers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.gtm.totalContainers}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Tags</p>
                <p className="text-sm font-semibold">{stats.gtm.totalTags}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Triggers</p>
                <p className="text-sm font-semibold">{stats.gtm.totalTriggers}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Variables</p>
                <p className="text-sm font-semibold">{stats.gtm.totalVariables}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* AI-Powered Insights */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-lg p-6 border-2 border-indigo-200">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-indigo-600 rounded-lg mr-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Intelligent Insights</h2>
            <p className="text-sm text-gray-600">AI-powered analysis across all your Google platforms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Revenue Attribution */}
          {stats.googleAds.totalCost > 0 && stats.ga4.totalRevenue > 0 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">Revenue Attribution</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">ROI</span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {((stats.ga4.totalRevenue / stats.googleAds.totalCost - 1) * 100).toFixed(1)}% ROAS
              </p>
              <p className="text-xs text-gray-600 mt-2">
                ${stats.ga4.totalRevenue.toFixed(2)} revenue from ${stats.googleAds.totalCost.toFixed(2)} ad spend
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-700">
                  {stats.ga4.totalRevenue > stats.googleAds.totalCost * 2
                    ? '🔥 Excellent ROI! Your campaigns are highly profitable.'
                    : stats.ga4.totalRevenue > stats.googleAds.totalCost
                    ? '✅ Positive ROI. Consider scaling successful campaigns.'
                    : '⚠️ Negative ROI. Review campaign targeting and landing pages.'}
                </p>
              </div>
            </div>
          )}

          {/* Traffic Quality Score */}
          {stats.searchConsole.totalClicks > 0 && stats.ga4.totalSessions > 0 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">Traffic Quality</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">SEO</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {((stats.searchConsole.totalClicks / stats.ga4.totalSessions) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Organic share of total traffic
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-700">
                  {stats.searchConsole.averagePosition < 5
                    ? '🎯 Top rankings! Your SEO is dominating.'
                    : stats.searchConsole.averagePosition < 10
                    ? '📈 Good positions. Optimize for featured snippets.'
                    : '💪 Room for improvement. Focus on high-impact keywords.'}
                </p>
              </div>
            </div>
          )}

          {/* Engagement Quality */}
          {stats.ga4.averageEngagementRate > 0 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">User Engagement</h3>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">UX</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {(stats.ga4.averageEngagementRate * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Average engagement rate
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-700">
                  {stats.ga4.averageEngagementRate > 0.7
                    ? '🌟 Exceptional! Users love your content.'
                    : stats.ga4.averageEngagementRate > 0.5
                    ? '✨ Good engagement. Test new CTAs for improvement.'
                    : '⚡ Consider A/B testing headlines and page speed.'}
                </p>
              </div>
            </div>
          )}

          {/* Click Efficiency */}
          {stats.googleAds.totalClicks > 0 && stats.googleAds.totalConversions > 0 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">Conversion Rate</h3>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">ADS</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {((stats.googleAds.totalConversions / stats.googleAds.totalClicks) * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-600 mt-2">
                {stats.googleAds.totalConversions.toFixed(0)} conversions from {stats.googleAds.totalClicks.toLocaleString()} clicks
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-700">
                  {(stats.googleAds.totalConversions / stats.googleAds.totalClicks) > 0.05
                    ? '🎉 Strong conversion rate! Your funnel is optimized.'
                    : (stats.googleAds.totalConversions / stats.googleAds.totalClicks) > 0.02
                    ? '👍 Decent performance. Test new ad copy.'
                    : '🔍 Low conversions. Review landing page and offer.'}
                </p>
              </div>
            </div>
          )}

          {/* Search Performance */}
          {stats.searchConsole.totalImpressions > 0 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-pink-500">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">Search Visibility</h3>
                <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">SEO</span>
              </div>
              <p className="text-2xl font-bold text-pink-600">
                {(stats.searchConsole.averageCTR * 100).toFixed(2)}%
              </p>
              <p className="text-xs text-gray-600 mt-2">
                CTR from {stats.searchConsole.totalImpressions.toLocaleString()} impressions
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-700">
                  {stats.searchConsole.averageCTR > 0.05
                    ? '🏆 Excellent CTR! Your titles are compelling.'
                    : stats.searchConsole.averageCTR > 0.03
                    ? '📝 Good CTR. Optimize meta descriptions for more clicks.'
                    : '🎯 Improve titles with power words and numbers.'}
                </p>
              </div>
            </div>
          )}

          {/* Cost Per Conversion */}
          {stats.googleAds.totalConversions > 0 && stats.googleAds.totalCost > 0 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-teal-500">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">Cost Efficiency</h3>
                <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">CPA</span>
              </div>
              <p className="text-2xl font-bold text-teal-600">
                ${(stats.googleAds.totalCost / stats.googleAds.totalConversions).toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Cost per conversion
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-700">
                  {stats.ga4.totalRevenue > 0 && (stats.ga4.totalRevenue / stats.googleAds.totalConversions) > (stats.googleAds.totalCost / stats.googleAds.totalConversions) * 3
                    ? '💰 Great CPA! Customer lifetime value exceeds acquisition cost.'
                    : '📊 Monitor CPA trends and optimize bid strategies.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/analytics/settings"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Accounts</h3>
              <p className="text-sm text-gray-600">Configure analytics properties</p>
            </div>
          </Link>

          <button
            onClick={fetchOverviewStats}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Refresh Data</h3>
              <p className="text-sm text-gray-600">Sync latest analytics</p>
            </div>
          </button>

          <Link
            href="/analytics/reports"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-8 h-8 text-purple-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">View Reports</h3>
              <p className="text-sm text-gray-600">Generate detailed reports</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium text-gray-900">Google Ads</span>
            </div>
            <span className="text-sm text-green-600">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium text-gray-900">Analytics 4</span>
            </div>
            <span className="text-sm text-green-600">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium text-gray-900">Search Console</span>
            </div>
            <span className="text-sm text-green-600">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              <span className="font-medium text-gray-900">Tag Manager</span>
            </div>
            <span className="text-sm text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
