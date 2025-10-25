'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MetricsSummary {
  totalImpressions: number;
  totalClicks: number;
  totalCost: number;
  totalConversions: number;
  totalConversionValue: number;
  averageCtr: number;
  averageCpc: number;
  costPerConversion: number;
  roas: number;
}

interface GoogleAdsAccount {
  id: string;
  accountName: string;
  customerId: string;
  isActive: boolean;
  lastSyncAt: string | null;
  syncStatus: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsDashboard() {
  const [accounts, setAccounts] = useState<GoogleAdsAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [metrics, setMetrics] = useState<any[]>([]);
  const [summary, setSummary] = useState<MetricsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });

  // Fetch Google Ads accounts
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch metrics when account or date range changes
  useEffect(() => {
    if (selectedAccount) {
      fetchMetrics();
    }
  }, [selectedAccount, dateRange]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/google-ads/accounts');
      const data = await res.json();
      // Ensure data is an array before setting
      if (Array.isArray(data)) {
        setAccounts(data);
        if (data.length > 0 && !selectedAccount) {
          setSelectedAccount(data[0].id);
        }
      } else {
        console.error('Accounts API returned non-array data:', data);
        setAccounts([]);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setAccounts([]);
    }
  };

  const fetchMetrics = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        accountId: selectedAccount,
        dateFrom: dateRange.from,
        dateTo: dateRange.to,
      });

      const res = await fetch(`/api/google-ads/metrics?${params}`);
      const data = await res.json();
      setMetrics(data.metrics);
      setSummary(data.summary);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const res = await fetch('/api/google-ads/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount,
          syncType: 'all',
          dateFrom: dateRange.from,
          dateTo: dateRange.to,
        }),
      });

      if (res.ok) {
        alert('Sync completed successfully!');
        fetchMetrics();
      } else {
        const error = await res.json();
        alert(`Sync failed: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert('Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Ads & Tag Manager Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive analytics for your advertising campaigns
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountName} ({account.customerId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSync}
                disabled={loading || !selectedAccount}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Syncing...' : 'Sync Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Impressions</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.totalImpressions)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Clicks</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.totalClicks)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                CTR: {formatPercent(summary.averageCtr)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Cost</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.totalCost)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Avg CPC: {formatCurrency(summary.averageCpc)}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Conversions</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.totalConversions)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                ROAS: {summary.roas.toFixed(2)}x
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        {metrics.length > 0 && (
          <div className="space-y-6">
            {/* Clicks and Impressions Over Time */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Clicks & Impressions Over Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="clicks"
                    stroke="#0088FE"
                    strokeWidth={2}
                    name="Clicks"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="impressions"
                    stroke="#00C49F"
                    strokeWidth={2}
                    name="Impressions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cost and Conversions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Cost & Conversions Over Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="cost"
                    fill="#FFBB28"
                    name="Cost ($)"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="conversions"
                    fill="#FF8042"
                    name="Conversions"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* No Data State */}
        {metrics.length === 0 && !loading && selectedAccount && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-lg">
              No data available for the selected date range.
            </div>
            <div className="text-gray-500 mt-2">
              Try syncing your data or selecting a different date range.
            </div>
          </div>
        )}

        {/* Empty State */}
        {accounts.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-lg">
              No Google Ads accounts configured.
            </div>
            <div className="text-gray-500 mt-2">
              Add your first account to start tracking your campaigns.
            </div>
            <button
              onClick={() => window.location.href = '/analytics/settings'}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Add Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
