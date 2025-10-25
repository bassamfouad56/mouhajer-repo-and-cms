'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GA4Property {
  id: string;
  propertyName: string;
  propertyId: string;
  isActive: boolean;
  lastSyncAt: string | null;
  syncStatus: string;
}

interface GA4Metric {
  date: string;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  bounceRate: number;
  engagementRate: number;
  screenPageViews: number;
  conversions: number;
  totalRevenue: number;
}

export default function GA4DashboardPage() {
  const [properties, setProperties] = useState<GA4Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [metrics, setMetrics] = useState<GA4Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      fetchMetrics();
    }
  }, [selectedProperty]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/ga4/properties');
      const data = await response.json();

      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setProperties(data);
        if (data.length > 0 && !selectedProperty) {
          setSelectedProperty(data[0].id);
        }
      } else {
        console.error('Invalid data format:', data);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ga4/metrics?propertyId=${selectedProperty}&daysBack=30`);
      const data = await response.json();

      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setMetrics(data);
      } else {
        console.error('Invalid metrics data format:', data);
        setMetrics([]);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMetrics([]);
    } finally {
      setLoading(false);
    }
  };

  const syncData = async () => {
    if (!selectedProperty) return;

    try {
      setSyncing(true);
      const response = await fetch('/api/ga4/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: selectedProperty, daysBack: 30 }),
      });

      if (response.ok) {
        await fetchMetrics();
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

  if (loading && properties.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading GA4 dashboard...</div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-yellow-800 font-semibold mb-2">No GA4 Properties Configured</h3>
          <p className="text-yellow-600 mb-4">Please add a Google Analytics 4 property to view analytics.</p>
          <a
            href="/analytics/settings"
            className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Add GA4 Property
          </a>
        </div>
      </div>
    );
  }

  const totalActiveUsers = metrics.reduce((sum, m) => sum + m.activeUsers, 0);
  const totalSessions = metrics.reduce((sum, m) => sum + m.sessions, 0);
  const totalPageViews = metrics.reduce((sum, m) => sum + m.screenPageViews, 0);
  const totalRevenue = metrics.reduce((sum, m) => sum + m.totalRevenue, 0);
  const avgEngagementRate = metrics.length > 0
    ? metrics.reduce((sum, m) => sum + m.engagementRate, 0) / metrics.length
    : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Google Analytics 4</h1>
          <p className="text-gray-600 mt-1">User behavior and engagement metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Array.isArray(properties) && properties.map((prop) => (
              <option key={prop.id} value={prop.id}>
                {prop.propertyName}
              </option>
            ))}
          </select>
          <button
            onClick={syncData}
            disabled={syncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-gray-900">{totalActiveUsers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Sessions</p>
          <p className="text-2xl font-bold text-gray-900">{totalSessions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Page Views</p>
          <p className="text-2xl font-bold text-gray-900">{totalPageViews.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Engagement Rate</p>
          <p className="text-2xl font-bold text-gray-900">{(avgEngagementRate * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="activeUsers" stroke="#3B82F6" name="Active Users" />
              <Line type="monotone" dataKey="newUsers" stroke="#10B981" name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sessions" fill="#8B5CF6" name="Sessions" />
              <Bar dataKey="screenPageViews" fill="#F59E0B" name="Page Views" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sessions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.slice().reverse().map((metric, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(metric.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.activeUsers.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.sessions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {metric.screenPageViews.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(metric.engagementRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${metric.totalRevenue.toFixed(2)}
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
