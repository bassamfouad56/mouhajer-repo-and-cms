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

interface TrendsResult {
  keyword: string;
  geo: string;
  timeRange: string;
  averageInterest: number;
  peakInterest: number;
  currentInterest: number;
  interestOverTime: Array<{
    time: string;
    value: number;
    formattedTime: string;
  }>;
  relatedQueries: {
    top: Array<{ query: string; value: number }>;
    rising: Array<{ query: string; value: number; formattedValue: string }>;
  };
  regionalInterest: Array<{
    geoName: string;
    value: number;
  }>;
}

interface RealtimeTrend {
  title: string;
  formattedTraffic: string;
  articles: Array<{
    title: string;
    source: string;
    timeAgo: string;
  }>;
}

export default function GoogleTrendsPage() {
  const [keyword, setKeyword] = useState('');
  const [geo, setGeo] = useState('');
  const [timeRange, setTimeRange] = useState('today 12-m');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TrendsResult | null>(null);
  const [realtimeTrends, setRealtimeTrends] = useState<RealtimeTrend[]>([]);
  const [selectedTab, setSelectedTab] = useState<'search' | 'realtime'>('search');

  useEffect(() => {
    fetchRealtimeTrends();
  }, []);

  const fetchRealtimeTrends = async () => {
    try {
      const res = await fetch('/api/trends/realtime?geo=US');
      const data = await res.json();
      if (data.success) {
        setRealtimeTrends(data.trends.slice(0, 10));
      }
    } catch (error) {
      console.error('Failed to fetch realtime trends:', error);
    }
  };

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setIsSearching(true);
    setResult(null);

    try {
      const res = await fetch('/api/trends/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: keyword.trim(),
          geo,
          timeRange,
          saveToDb: true,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.result);
      } else {
        alert(`Search failed: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getInterestColor = (value: number) => {
    if (value >= 75) return 'text-green-600 bg-green-100';
    if (value >= 50) return 'text-yellow-600 bg-yellow-100';
    if (value >= 25) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Chart data
  const chartData = result ? {
    labels: result.interestOverTime.map((d) => d.formattedTime),
    datasets: [
      {
        label: result.keyword,
        data: result.interestOverTime.map((d) => d.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Interest Over Time: ${result?.keyword || ''}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Interest (0-100)',
        },
      },
    },
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Trends</h1>
        <p className="text-gray-600">
          Research keyword popularity and discover trending topics
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('search')}
            className={`${
              selectedTab === 'search'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Keyword Research
          </button>
          <button
            onClick={() => setSelectedTab('realtime')}
            className={`${
              selectedTab === 'realtime'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Trending Now
          </button>
        </nav>
      </div>

      {selectedTab === 'search' ? (
        <>
          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter keyword (e.g., interior design)"
                className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={geo}
                onChange={(e) => setGeo(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Worldwide</option>
                <option value="AE">UAE</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="SA">Saudi Arabia</option>
              </select>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="now 7-d">Past 7 days</option>
                <option value="today 1-m">Past month</option>
                <option value="today 3-m">Past 3 months</option>
                <option value="today 12-m">Past 12 months</option>
                <option value="today 5-y">Past 5 years</option>
              </select>
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching || !keyword.trim()}
              className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isSearching ? 'Searching...' : 'Search Trends'}
            </button>
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Interest Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Average Interest</h3>
                  <p className={`text-4xl font-bold ${getInterestColor(result.averageInterest).split(' ')[0]}`}>
                    {result.averageInterest}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Out of 100</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Peak Interest</h3>
                  <p className={`text-4xl font-bold ${getInterestColor(result.peakInterest).split(' ')[0]}`}>
                    {result.peakInterest}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Maximum reached</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Current Interest</h3>
                  <p className={`text-4xl font-bold ${getInterestColor(result.currentInterest).split(' ')[0]}`}>
                    {result.currentInterest}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Latest value</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div style={{ height: '400px' }}>
                  {chartData && <Line data={chartData} options={chartOptions} />}
                </div>
              </div>

              {/* Related Queries and Regional Interest */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Related Queries */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Related Queries</h3>
                  <div className="space-y-4">
                    {result.relatedQueries.rising && result.relatedQueries.rising.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Rising</h4>
                        <div className="space-y-2">
                          {result.relatedQueries.rising.slice(0, 5).map((q, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-900">{q.query}</span>
                              <span className="text-green-600 font-semibold">{q.formattedValue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.relatedQueries.top && result.relatedQueries.top.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Top</h4>
                        <div className="space-y-2">
                          {result.relatedQueries.top.slice(0, 5).map((q, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-900">{q.query}</span>
                              <span className="text-blue-600 font-semibold">{q.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Regional Interest */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Regional Interest</h3>
                  <div className="space-y-2">
                    {result.regionalInterest.slice(0, 10).map((region, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="text-sm text-gray-900 w-32">{region.geoName}</span>
                        <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${region.value}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">{region.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        /* Realtime Trending Topics */
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Trending Now</h2>
            <button
              onClick={fetchRealtimeTrends}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>

          {realtimeTrends.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Loading trending topics...
            </div>
          ) : (
            <div className="space-y-4">
              {realtimeTrends.map((trend, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1">{trend.title}</h3>
                    <span className="text-sm text-blue-600 font-medium ml-4">{trend.formattedTraffic}</span>
                  </div>
                  {trend.articles && trend.articles.length > 0 && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{trend.articles[0].source}</span>
                      <span className="mx-2">•</span>
                      <span>{trend.articles[0].timeAgo}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
