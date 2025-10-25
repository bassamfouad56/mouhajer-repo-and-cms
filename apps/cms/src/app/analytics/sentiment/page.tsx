'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Shuffle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Hash,
  Tag,
  Clock,
} from 'lucide-react';

interface SentimentResult {
  score: number;
  magnitude: number;
  label: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
}

interface Entity {
  name: string;
  type: string;
  salience: number;
  mentions: number;
}

interface Analysis {
  sentiment: SentimentResult;
  entities: Entity[];
  keywords: string[];
  categories?: Array<{ name: string; confidence: number }>;
  language: string;
}

interface HistoryItem {
  id: string;
  text: string;
  sentimentScore: number;
  sentimentMagnitude: number;
  sentimentLabel: string;
  keywords: string[];
  analyzedAt: Date;
}

interface Stats {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
  avgScore: number;
  avgMagnitude: number;
}

export default function SentimentAnalysisPage() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [filterLabel, setFilterLabel] = useState<string>('all');

  useEffect(() => {
    fetchHistory();
  }, [filterLabel]);

  const fetchHistory = async () => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '20');
      if (filterLabel !== 'all') {
        params.append('sentimentLabel', filterLabel);
      }

      const res = await fetch(`/api/natural-language/history?${params}`);
      const data = await res.json();

      if (data.success) {
        setHistory(data.analyses);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const testConnection = async () => {
    setTestStatus('testing');
    try {
      const res = await fetch('/api/natural-language/test', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setTestStatus('success');
        setTimeout(() => setTestStatus('idle'), 3000);
      } else {
        setTestStatus('error');
        setTimeout(() => setTestStatus('idle'), 5000);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setTestStatus('error');
      setTimeout(() => setTestStatus('idle'), 5000);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const res = await fetch('/api/natural-language/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sourceType: 'custom', saveToDatabase: true }),
      });

      const data = await res.json();

      if (data.success) {
        setAnalysis(data.analysis);
        fetchHistory(); // Refresh history
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

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'POSITIVE':
        return <ThumbsUp className="h-5 w-5 text-green-600" />;
      case 'NEGATIVE':
        return <ThumbsDown className="h-5 w-5 text-red-600" />;
      case 'NEUTRAL':
        return <Minus className="h-5 w-5 text-gray-600" />;
      case 'MIXED':
        return <Shuffle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'POSITIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'NEGATIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NEUTRAL':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'MIXED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score > 0.25) return 'text-green-600';
    if (score < -0.25) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sentiment Analysis</h1>
        <p className="text-gray-600">
          Analyze text sentiment, extract entities, and classify content using Google Natural Language AI
        </p>
      </div>

      {/* Connection Test */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Connection Status</h2>
            <p className="text-sm text-gray-600">Test your Natural Language API credentials</p>
          </div>
          <button
            onClick={testConnection}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            {testStatus === 'testing' && <span className="animate-spin">⚙️</span>}
            {testStatus === 'success' && <CheckCircle className="h-4 w-4" />}
            {testStatus === 'error' && <AlertCircle className="h-4 w-4" />}
            {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
        {testStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✅ Connection successful! Natural Language API is working properly.
          </div>
        )}
        {testStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ Connection failed. Please check your credentials in .env file.
          </div>
        )}
      </div>

      {/* Analysis Input */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Analyze Text</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to analyze sentiment, entities, and keywords..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">{text.length} characters</span>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>

          {/* Sentiment Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                {getSentimentIcon(analysis.sentiment.label)}
                <span className="text-sm text-gray-600">Sentiment</span>
              </div>
              <div
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getSentimentColor(
                  analysis.sentiment.label
                )}`}
              >
                {analysis.sentiment.label}
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Score</span>
              </div>
              <div className={`text-2xl font-bold ${getScoreColor(analysis.sentiment.score)}`}>
                {analysis.sentiment.score.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">-1.0 to 1.0</div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Magnitude</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {analysis.sentiment.magnitude.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">Emotional intensity</div>
            </div>
          </div>

          {/* Keywords */}
          {analysis.keywords.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Entities */}
          {analysis.entities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Entities</h3>
              <div className="space-y-2">
                {analysis.entities.slice(0, 5).map((entity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{entity.name}</span>
                      <span className="text-xs text-gray-500 ml-2">({entity.type})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        Salience: {(entity.salience * 100).toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-600">{entity.mentions} mentions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {analysis.categories && analysis.categories.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                {analysis.categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-600">
                      Confidence: {(category.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {stats && stats.total > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.positive}</div>
              <div className="text-sm text-gray-600">Positive</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.negative}</div>
              <div className="text-sm text-gray-600">Negative</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.neutral}</div>
              <div className="text-sm text-gray-600">Neutral</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats.mixed}</div>
              <div className="text-sm text-gray-600">Mixed</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Average Score</div>
              <div className={`text-lg font-bold ${getScoreColor(stats.avgScore)}`}>
                {stats.avgScore.toFixed(3)}
              </div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600">Average Magnitude</div>
              <div className="text-lg font-bold text-purple-600">{stats.avgMagnitude.toFixed(3)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Analysis History</h2>
          <select
            value={filterLabel}
            onChange={(e) => setFilterLabel(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEGATIVE">Negative</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="MIXED">Mixed</option>
          </select>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No analyses yet. Analyze your first text above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getSentimentIcon(item.sentimentLabel)}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(
                          item.sentimentLabel
                        )}`}
                      >
                        {item.sentimentLabel}
                      </span>
                      <span className={`text-sm font-medium ${getScoreColor(item.sentimentScore)}`}>
                        Score: {item.sentimentScore.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-600">
                        Magnitude: {item.sentimentMagnitude.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{item.text}</p>
                    {item.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.keywords.slice(0, 5).map((keyword, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {new Date(item.analyzedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">📝 Setup Required</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>To use Natural Language analysis, add these environment variables to your .env file:</p>
          <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">
            {`GOOGLE_NL_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_NL_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"`}
          </pre>
          <p className="mt-2">
            <a
              href="https://cloud.google.com/natural-language/docs/setup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View setup guide →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
