'use client';

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Analysis {
  id: string;
  url: string;
  strategy: string;
  performanceScore: number;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  speedIndex: number | null;
  totalBlockingTime: number | null;
  interactive: number | null;
  timestamp: string;
}

interface MonitoringUrl {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  monitoringFrequency: string;
  strategies: string[];
  minPerformanceScore: number | null;
  lastAnalysisAt: string | null;
  lastMobileScore: number | null;
  lastDesktopScore: number | null;
  alertStatus: string;
  alertMessage: string | null;
}

interface AnalysisResult {
  url: string;
  strategy: string;
  metrics: {
    performanceScore: number;
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    fcp: number | null;
    ttfb: number | null;
    speedIndex: number | null;
    totalBlockingTime: number | null;
    interactive: number | null;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
    savings: number | null;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    score: number | null;
  }>;
}

export default function PageSpeedInsightsPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [monitoring, setMonitoring] = useState<MonitoringUrl[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  // Form state
  const [analyzeUrl, setAnalyzeUrl] = useState('');
  const [analyzeStrategy, setAnalyzeStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [newMonitoringName, setNewMonitoringName] = useState('');
  const [newMonitoringUrl, setNewMonitoringUrl] = useState('');
  const [showAddMonitoring, setShowAddMonitoring] = useState(false);

  const [selectedUrl, setSelectedUrl] = useState<string>('');
  const [historyDays, setHistoryDays] = useState(30);

  useEffect(() => {
    fetchMonitoring();
  }, []);

  useEffect(() => {
    if (selectedUrl) {
      fetchHistory(selectedUrl);
    } else {
      fetchHistory();
    }
  }, [selectedUrl, historyDays]);

  const fetchMonitoring = async () => {
    try {
      const res = await fetch('/api/pagespeed/monitoring');
      const data = await res.json();
      if (data.success) {
        setMonitoring(data.monitoring);
      }
    } catch (error) {
      console.error('Failed to fetch monitoring:', error);
    }
  };

  const fetchHistory = async (url?: string) => {
    try {
      const params = new URLSearchParams({
        days: historyDays.toString(),
      });

      if (url) {
        params.append('url', url);
      }

      const res = await fetch(`/api/pagespeed/history?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAnalyses(data.analyses);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleAnalyze = async () => {
    if (!analyzeUrl) return;

    setIsAnalyzing(true);
    setCurrentAnalysis(null);

    try {
      const res = await fetch('/api/pagespeed/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: analyzeUrl,
          strategy: analyzeStrategy,
          saveToDb: true,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCurrentAnalysis(data.result);
        fetchHistory(selectedUrl || undefined);
        fetchMonitoring();
      } else {
        alert(`Analysis failed: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddMonitoring = async () => {
    if (!newMonitoringName || !newMonitoringUrl) return;

    try {
      const res = await fetch('/api/pagespeed/monitoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMonitoringName,
          url: newMonitoringUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMonitoring([...monitoring, data.monitoring]);
        setNewMonitoringName('');
        setNewMonitoringUrl('');
        setShowAddMonitoring(false);
      } else {
        alert(`Failed to add monitoring: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to add monitoring:', error);
      alert('Failed to add monitoring. Please try again.');
    }
  };

  const handleDeleteMonitoring = async (id: string) => {
    if (!confirm('Are you sure you want to stop monitoring this URL?')) return;

    try {
      const res = await fetch(`/api/pagespeed/monitoring?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMonitoring(monitoring.filter((m) => m.id !== id));
      } else {
        alert(`Failed to delete monitoring: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to delete monitoring:', error);
    }
  };

  const getCoreWebVitalsStatus = (
    metric: 'lcp' | 'fid' | 'cls',
    value: number | null
  ): 'good' | 'needs-improvement' | 'poor' => {
    if (value === null) return 'poor';

    if (metric === 'lcp') {
      if (value <= 2500) return 'good';
      if (value <= 4000) return 'needs-improvement';
      return 'poor';
    }

    if (metric === 'fid') {
      if (value <= 100) return 'good';
      if (value <= 300) return 'needs-improvement';
      return 'poor';
    }

    if (metric === 'cls') {
      if (value <= 0.1) return 'good';
      if (value <= 0.25) return 'needs-improvement';
      return 'poor';
    }

    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlertStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Chart data
  const chartData = {
    labels: analyses.map((a) =>
      new Date(a.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ).reverse(),
    datasets: [
      {
        label: 'Performance Score',
        data: analyses.map((a) => a.performanceScore).reverse(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PageSpeed Insights</h1>
        <p className="text-gray-600">
          Monitor website performance and Core Web Vitals with Google PageSpeed Insights
        </p>
      </div>

      {/* Analyze URL Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Analyze URL</h2>
        <div className="flex gap-4">
          <input
            type="url"
            value={analyzeUrl}
            onChange={(e) => setAnalyzeUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={analyzeStrategy}
            onChange={(e) => setAnalyzeStrategy(e.target.value as 'mobile' | 'desktop')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !analyzeUrl}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {/* Current Analysis Results */}
        {currentAnalysis && (
          <div className="mt-6 space-y-6">
            {/* Performance Score */}
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className={`text-6xl font-bold ${getScoreColor(currentAnalysis.metrics.performanceScore)}`}>
                {currentAnalysis.metrics.performanceScore}
              </div>
              <div className="text-gray-600 mt-2">Performance Score</div>
              <div className="text-sm text-gray-500 mt-1">{currentAnalysis.strategy}</div>
            </div>

            {/* Core Web Vitals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* LCP */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">LCP</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(
                      getCoreWebVitalsStatus('lcp', currentAnalysis.metrics.lcp)
                    )}`}
                  >
                    {getCoreWebVitalsStatus('lcp', currentAnalysis.metrics.lcp)}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentAnalysis.metrics.lcp ? `${(currentAnalysis.metrics.lcp / 1000).toFixed(2)}s` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Largest Contentful Paint</div>
              </div>

              {/* FID */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">FID</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(
                      getCoreWebVitalsStatus('fid', currentAnalysis.metrics.fid)
                    )}`}
                  >
                    {getCoreWebVitalsStatus('fid', currentAnalysis.metrics.fid)}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentAnalysis.metrics.fid ? `${currentAnalysis.metrics.fid.toFixed(0)}ms` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">First Input Delay</div>
              </div>

              {/* CLS */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">CLS</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(
                      getCoreWebVitalsStatus('cls', currentAnalysis.metrics.cls)
                    )}`}
                  >
                    {getCoreWebVitalsStatus('cls', currentAnalysis.metrics.cls)}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {currentAnalysis.metrics.cls !== null ? currentAnalysis.metrics.cls.toFixed(3) : 'N/A'}
                </div>
                <div className="text-xs text-gray-500 mt-1">Cumulative Layout Shift</div>
              </div>
            </div>

            {/* Other Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-600">FCP</div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentAnalysis.metrics.fcp ? `${(currentAnalysis.metrics.fcp / 1000).toFixed(2)}s` : 'N/A'}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-600">TTFB</div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentAnalysis.metrics.ttfb ? `${currentAnalysis.metrics.ttfb.toFixed(0)}ms` : 'N/A'}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-600">Speed Index</div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentAnalysis.metrics.speedIndex ? `${(currentAnalysis.metrics.speedIndex / 1000).toFixed(2)}s` : 'N/A'}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-600">TBT</div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentAnalysis.metrics.totalBlockingTime ? `${currentAnalysis.metrics.totalBlockingTime.toFixed(0)}ms` : 'N/A'}
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm text-gray-600">TTI</div>
                <div className="text-lg font-semibold text-gray-900">
                  {currentAnalysis.metrics.interactive ? `${(currentAnalysis.metrics.interactive / 1000).toFixed(2)}s` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Opportunities */}
            {currentAnalysis.opportunities && currentAnalysis.opportunities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Opportunities</h3>
                <div className="space-y-2">
                  {currentAnalysis.opportunities.slice(0, 5).map((opp) => (
                    <div key={opp.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{opp.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{opp.description}</div>
                        </div>
                        {opp.savings && (
                          <div className="ml-4 text-sm font-semibold text-blue-600">
                            ~{(opp.savings / 1000).toFixed(2)}s
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* History Chart */}
      {analyses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Performance History</h2>
            <div className="flex gap-2">
              <select
                value={selectedUrl}
                onChange={(e) => setSelectedUrl(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
              >
                <option value="">All URLs</option>
                {Array.from(new Set(analyses.map((a) => a.url))).map((url) => (
                  <option key={url} value={url}>
                    {url}
                  </option>
                ))}
              </select>
              <select
                value={historyDays}
                onChange={(e) => setHistoryDays(parseInt(e.target.value))}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>
          <div style={{ height: '300px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Monitoring URLs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Monitoring URLs</h2>
          <button
            onClick={() => setShowAddMonitoring(!showAddMonitoring)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add URL
          </button>
        </div>

        {showAddMonitoring && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <input
                type="text"
                value={newMonitoringName}
                onChange={(e) => setNewMonitoringName(e.target.value)}
                placeholder="Name (e.g., Homepage)"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="url"
                value={newMonitoringUrl}
                onChange={(e) => setNewMonitoringUrl(e.target.value)}
                placeholder="https://example.com"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddMonitoring}
                disabled={!newMonitoringName || !newMonitoringUrl}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddMonitoring(false);
                  setNewMonitoringName('');
                  setNewMonitoringUrl('');
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {monitoring.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No monitoring URLs yet. Add a URL to start monitoring performance.
          </div>
        ) : (
          <div className="space-y-3">
            {monitoring.map((mon) => (
              <div key={mon.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{mon.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getAlertStatusColor(mon.alertStatus)}`}
                      >
                        {mon.alertStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{mon.url}</div>
                    {mon.alertMessage && (
                      <div className="text-sm text-red-600 mt-1">{mon.alertMessage}</div>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      {mon.lastMobileScore !== null && (
                        <span>Mobile: {mon.lastMobileScore}/100</span>
                      )}
                      {mon.lastDesktopScore !== null && (
                        <span>Desktop: {mon.lastDesktopScore}/100</span>
                      )}
                      {mon.lastAnalysisAt && (
                        <span>
                          Last: {new Date(mon.lastAnalysisAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMonitoring(mon.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
