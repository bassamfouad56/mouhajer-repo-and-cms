'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GSCProperty {
  id: string;
  propertyName: string;
  siteUrl: string;
  isActive: boolean;
  lastSyncAt: string | null;
  syncStatus: string;
}

interface GSCPerformance {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface GSCQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export default function SearchConsoleDashboardPage() {
  const [properties, setProperties] = useState<GSCProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [performance, setPerformance] = useState<GSCPerformance[]>([]);
  const [topQueries, setTopQueries] = useState<GSCQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchPerformance();
      fetchTopQueries();
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/search-console/properties');
      const data = await response.json();
      setProperties(data);
      if (data.length > 0 && !selectedProperty) {
        setSelectedProperty(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search-console/performance?propertyId=${selectedProperty}&daysBack=30`);
      const data = await response.json();
      setPerformance(data);
    } catch (error) {
      console.error('Error fetching performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopQueries = async () => {
    try {
      const response = await fetch(`/api/search-console/queries?propertyId=${selectedProperty}&daysBack=30&limit=20`);
      const data = await response.json();

      // Aggregate queries by query text (sum clicks and impressions)
      const queryMap = new Map<string, GSCQuery>();
      data.forEach((item: any) => {
        const existing = queryMap.get(item.query);
        if (existing) {
          existing.clicks += item.clicks;
          existing.impressions += item.impressions;
        } else {
          queryMap.set(item.query, {
            query: item.query,
            clicks: item.clicks,
            impressions: item.impressions,
            ctr: item.ctr,
            position: item.position,
          });
        }
      });

      const aggregated = Array.from(queryMap.values())
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 20);

      setTopQueries(aggregated);
    } catch (error) {
      console.error('Error fetching top queries:', error);
    }
  };

  const syncData = async () => {
    if (!selectedProperty) return;

    try {
      setSyncing(true);
      const response = await fetch('/api/search-console/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: selectedProperty, daysBack: 30 }),
      });

      if (response.ok) {
        await fetchPerformance();
        await fetchTopQueries();
        alert('Data synced successfully!');
      } else {
        const error = await response.json();
        alert(`Sync failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Failed to sync data');
    } finally {
      setSyncing(false);
    }
  };

  const handleAutoSetup = async () => {
    try {
      setSettingUp(true);
      const response = await fetch('/api/search-console/auto-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();

      if (response.ok) {
        alert('Search Console configured successfully! Reloading...');
        await fetchProperties(); // Refresh the properties list
      } else {
        alert(`Setup failed: ${result.error}\n${result.suggestion || ''}`);
      }
    } catch (error) {
      console.error('Auto-setup error:', error);
      alert('Failed to auto-setup Search Console');
    } finally {
      setSettingUp(false);
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading Search Console dashboard...</div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Search Console Setup</h1>
          <p className="text-gray-600">Configure Search Console to track your website's search performance</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <svg className="h-12 w-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Quick Setup</h2>
              <p className="text-gray-600 mb-4">
                Use your existing Google Analytics credentials to automatically configure Search Console.
                This will set up tracking for <strong>https://mouhajer.com</strong>.
              </p>
              <button
                onClick={handleAutoSetup}
                disabled={settingUp}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {settingUp ? 'Setting up...' : 'Quick Setup with Existing Credentials'}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Track search queries that lead users to your site
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Monitor clicks, impressions, CTR, and average position
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Identify SEO opportunities and issues
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Analyze search performance trends over time
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <p className="text-xs text-gray-500">
              <strong>Note:</strong> Make sure your service account has been added to your Google Search Console property.
              Go to <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Search Console</a> → Settings → Users and permissions to add it.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a href="/analytics/settings" className="text-purple-600 hover:underline text-sm">
            Or configure manually in Analytics Settings →
          </a>
        </div>
      </div>
    );
  }

  const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);
  const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);
  const avgCTR = performance.length > 0
    ? performance.reduce((sum, p) => sum + p.ctr, 0) / performance.length
    : 0;
  const avgPosition = performance.length > 0
    ? performance.reduce((sum, p) => sum + p.position, 0) / performance.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Google Search Console</h1>
          <p className="text-gray-600 mt-1">Search performance and SEO insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.propertyName}
              </option>
            ))}
          </select>
          <button
            onClick={syncData}
            disabled={syncing}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Clicks</p>
          <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Impressions</p>
          <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Average CTR</p>
          <p className="text-2xl font-bold text-gray-900">{(avgCTR * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Average Position</p>
          <p className="text-2xl font-bold text-gray-900">{avgPosition.toFixed(1)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Clicks & Impressions Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clicks" stroke="#8B5CF6" name="Clicks" />
              <Line type="monotone" dataKey="impressions" stroke="#3B82F6" name="Impressions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">CTR & Position Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="ctr" stroke="#10B981" name="CTR" />
              <Line yAxisId="right" type="monotone" dataKey="position" stroke="#F59E0B" name="Position" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Queries */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Queries</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Query</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impressions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topQueries.map((query, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">{query.query}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {query.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {query.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(query.ctr * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {query.position.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Performance */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Impressions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performance.slice().reverse().map((perf, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(perf.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {perf.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {perf.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(perf.ctr * 100).toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {perf.position.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
