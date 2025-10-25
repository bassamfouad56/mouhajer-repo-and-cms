'use client';

import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface ExportHistory {
  id: string;
  title: string;
  type: string;
  spreadsheetId: string;
  spreadsheetUrl: string;
  recordCount: number;
  sharedWith: string[];
  exportedAt: Date;
}

export default function GoogleSheetsPage() {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [shareEmail, setShareEmail] = useState('');
  const [days, setDays] = useState(30);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [lastExport, setLastExport] = useState<{ type: string; url: string } | null>(null);

  useEffect(() => {
    fetchExportHistory();
  }, []);

  const fetchExportHistory = async () => {
    try {
      const res = await fetch('/api/sheets/history?limit=20');
      const data = await res.json();
      if (data.success) {
        setExportHistory(data.exports);
      }
    } catch (error) {
      console.error('Failed to fetch export history:', error);
    }
  };

  const testConnection = async () => {
    setTestStatus('testing');
    try {
      const res = await fetch('/api/sheets/test', { method: 'POST' });
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

  const handleExport = async (type: 'pagespeed' | 'trends' | 'reviews') => {
    setIsExporting(type);
    setLastExport(null);

    try {
      const body: any = { days };
      if (shareEmail.trim()) {
        body.shareEmail = shareEmail.trim();
      }

      const res = await fetch(`/api/sheets/export-${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setLastExport({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          url: data.spreadsheet.url,
        });
        fetchExportHistory();
      } else {
        alert(`Export failed: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error(`Export failed:`, error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pagespeed':
        return 'bg-blue-100 text-blue-800';
      case 'trends':
        return 'bg-purple-100 text-purple-800';
      case 'reviews':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pagespeed':
        return 'Performance';
      case 'trends':
        return 'Trends';
      case 'reviews':
        return 'Reviews';
      default:
        return type;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Sheets Exports</h1>
        <p className="text-gray-600">
          Export your analytics data to Google Sheets for reporting and collaboration
        </p>
      </div>

      {/* Connection Test */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Connection Status</h2>
            <p className="text-sm text-gray-600">
              Test your Google Sheets API credentials
            </p>
          </div>
          <button
            onClick={testConnection}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            {testStatus === 'testing' && (
              <span className="animate-spin">⚙️</span>
            )}
            {testStatus === 'success' && <CheckCircle className="h-4 w-4" />}
            {testStatus === 'error' && <AlertCircle className="h-4 w-4" />}
            {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
        {testStatus === 'success' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            ✅ Connection successful! Google Sheets API is working properly.
          </div>
        )}
        {testStatus === 'error' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ❌ Connection failed. Please check your credentials in .env file.
          </div>
        )}
      </div>

      {/* Last Export Success */}
      {lastExport && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">
              {lastExport.type} data exported successfully!
            </span>
          </div>
          <a
            href={lastExport.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
          >
            Open spreadsheet
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Export Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period (Days)
            </label>
            <select
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share With Email (Optional)
            </label>
            <input
              type="email"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PageSpeed Export */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
              <h3 className="font-semibold">Performance Data</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Export PageSpeed analyses with Core Web Vitals
            </p>
            <button
              onClick={() => handleExport('pagespeed')}
              disabled={isExporting === 'pagespeed'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting === 'pagespeed' ? 'Exporting...' : 'Export'}
            </button>
          </div>

          {/* Trends Export */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileSpreadsheet className="h-8 w-8 text-purple-600" />
              <h3 className="font-semibold">Keyword Research</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Export Google Trends keyword queries
            </p>
            <button
              onClick={() => handleExport('trends')}
              disabled={isExporting === 'trends'}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting === 'trends' ? 'Exporting...' : 'Export'}
            </button>
          </div>

          {/* Reviews Export */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
              <h3 className="font-semibold">Customer Reviews</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Export Google Business Profile reviews
            </p>
            <button
              onClick={() => handleExport('reviews')}
              disabled={isExporting === 'reviews'}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              {isExporting === 'reviews' ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>

      {/* Export History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Export History</h2>

        {exportHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No exports yet. Create your first export above!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exportHistory.map((exp) => (
              <div
                key={exp.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(exp.type)}`}>
                        {getTypeLabel(exp.type)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {exp.recordCount} records
                      </span>
                      {exp.sharedWith && exp.sharedWith.length > 0 && (
                        <span className="text-xs text-gray-500">
                          • Shared with {exp.sharedWith.join(', ')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Exported {new Date(exp.exportedAt).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={exp.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1"
                  >
                    Open
                    <ExternalLink className="h-3 w-3" />
                  </a>
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
          <p>To use Google Sheets exports, add these environment variables to your .env file:</p>
          <pre className="bg-blue-100 p-3 rounded text-xs overflow-x-auto">
{`GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
GOOGLE_SHEETS_PROJECT_ID=your-project-id`}
          </pre>
          <p className="mt-2">
            <a
              href="https://developers.google.com/sheets/api/quickstart/nodejs"
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
