'use client';

import { useState } from 'react';

interface GA4PropertyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function GA4PropertyForm({ onSuccess, onCancel }: GA4PropertyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    propertyName: '',
    propertyId: '',
    measurementId: '',
    clientEmail: '',
    privateKey: '',
    projectId: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ga4/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show detailed error message if available
        let errorMsg = data.error || 'Failed to add property';

        if (data.details) {
          errorMsg += '\n\n' + data.details;
        }

        // If property already exists, show helpful message with existing property info
        if (response.status === 409 && data.existingProperty) {
          errorMsg += `\n\nExisting property: "${data.existingProperty.name}" (created ${new Date(data.existingProperty.createdAt).toLocaleDateString()})`;
          errorMsg += '\n\nTip: Check your existing properties in the list above, or delete the existing one first if you want to reconfigure it.';
        }

        throw new Error(errorMsg);
      }

      alert('✅ GA4 Property added successfully!\n\nYou can now go to the GA4 Dashboard and click "Sync Data" to pull your analytics.');

      // Reset form
      setForm({
        propertyName: '',
        propertyId: '',
        measurementId: '',
        clientEmail: '',
        privateKey: '',
        projectId: '',
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Google Analytics 4 Property</h3>
        <p className="text-sm text-gray-600 mb-6">
          Connect your GA4 property to track user behavior, engagement, and revenue.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Property Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Name *
          </label>
          <input
            type="text"
            value={form.propertyName}
            onChange={(e) => setForm({ ...form, propertyName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="My Website Analytics"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Internal name for this property</p>
        </div>

        {/* Property ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property ID *
          </label>
          <input
            type="text"
            value={form.propertyId}
            onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="123456789"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Find in GA4 Admin → Property Settings
          </p>
        </div>

        {/* Measurement ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Measurement ID (Optional)
          </label>
          <input
            type="text"
            value={form.measurementId}
            onChange={(e) => setForm({ ...form, measurementId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="G-XXXXXXXXXX"
          />
          <p className="text-xs text-gray-500 mt-1">Format: G-XXXXXXXXXX</p>
        </div>

        {/* Project ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Cloud Project ID *
          </label>
          <input
            type="text"
            value={form.projectId}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="my-project-123"
            required
          />
          <p className="text-xs text-gray-500 mt-1">From Google Cloud Console</p>
        </div>
      </div>

      {/* Client Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Service Account Email *
        </label>
        <input
          type="email"
          value={form.clientEmail}
          onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="service-account@project.iam.gserviceaccount.com"
          required
        />
        <p className="text-xs text-gray-500 mt-1">From your service account JSON file</p>
      </div>

      {/* Private Key */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Private Key *
        </label>
        <textarea
          value={form.privateKey}
          onChange={(e) => setForm({ ...form, privateKey: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
          placeholder="-----BEGIN PRIVATE KEY-----&#10;...&#10;-----END PRIVATE KEY-----"
          rows={8}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Include the full key with BEGIN/END markers (from service account JSON)
        </p>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📝 How to Get Credentials</h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
          <li>Enable "Google Analytics Data API"</li>
          <li>Create a Service Account</li>
          <li>Download the JSON key file</li>
          <li>Add service account email to your GA4 property (as Viewer)</li>
        </ol>
        <a
          href="/ANALYTICS_ACCESS_GUIDE.md"
          target="_blank"
          className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          View detailed setup guide →
        </a>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding Property...
            </>
          ) : (
            'Add Property'
          )}
        </button>
      </div>
    </form>
  );
}
