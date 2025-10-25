'use client';

import { useState, useEffect } from 'react';

interface GoogleAdsAccount {
  id?: string;
  accountName: string;
  customerId: string;
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  loginCustomerId?: string;
}

interface GTMAccount {
  id?: string;
  accountName: string;
  accountId: string;
  accountPath: string;
  clientEmail: string;
  privateKey: string;
  projectId: string;
}

export default function AnalyticsSettings() {
  const [activeTab, setActiveTab] = useState<'google-ads' | 'gtm'>('google-ads');
  const [googleAdsAccounts, setGoogleAdsAccounts] = useState<any[]>([]);
  const [gtmAccounts, setGTMAccounts] = useState<any[]>([]);
  const [showGoogleAdsForm, setShowGoogleAdsForm] = useState(false);
  const [showGTMForm, setShowGTMForm] = useState(false);

  const [googleAdsForm, setGoogleAdsForm] = useState<GoogleAdsAccount>({
    accountName: '',
    customerId: '',
    developerToken: '',
    clientId: '',
    clientSecret: '',
    refreshToken: '',
    loginCustomerId: '',
  });

  const [gtmForm, setGTMForm] = useState<GTMAccount>({
    accountName: '',
    accountId: '',
    accountPath: '',
    clientEmail: '',
    privateKey: '',
    projectId: '',
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const [adsRes, gtmRes] = await Promise.all([
        fetch('/api/google-ads/accounts'),
        fetch('/api/gtm/accounts'),
      ]);

      const adsData = await adsRes.json();
      const gtmData = await gtmRes.json();

      // Ensure data is an array before setting state
      setGoogleAdsAccounts(Array.isArray(adsData) ? adsData : []);
      setGTMAccounts(Array.isArray(gtmData) ? gtmData : []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setGoogleAdsAccounts([]);
      setGTMAccounts([]);
    }
  };

  const handleGoogleAdsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/google-ads/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleAdsForm),
      });

      if (res.ok) {
        alert('Google Ads account added successfully!');
        setShowGoogleAdsForm(false);
        setGoogleAdsForm({
          accountName: '',
          customerId: '',
          developerToken: '',
          clientId: '',
          clientSecret: '',
          refreshToken: '',
          loginCustomerId: '',
        });
        fetchAccounts();
      } else {
        const error = await res.json();
        alert(`Failed to add account: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Failed to add account');
    }
  };

  const handleGTMSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/gtm/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gtmForm),
      });

      if (res.ok) {
        alert('GTM account added successfully!');
        setShowGTMForm(false);
        setGTMForm({
          accountName: '',
          accountId: '',
          accountPath: '',
          clientEmail: '',
          privateKey: '',
          projectId: '',
        });
        fetchAccounts();
      } else {
        const error = await res.json();
        alert(`Failed to add account: ${error.details || error.error}`);
      }
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Failed to add account');
    }
  };

  const handleDeleteGoogleAds = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      const res = await fetch(`/api/google-ads/accounts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Account deleted successfully');
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };

  const handleDeleteGTM = async (id: string) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      const res = await fetch(`/api/gtm/accounts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Account deleted successfully');
        fetchAccounts();
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Settings
          </h1>
          <p className="text-gray-600">
            Manage your Google Ads and Tag Manager accounts
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('google-ads')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'google-ads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Google Ads
            </button>
            <button
              onClick={() => setActiveTab('gtm')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'gtm'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Google Tag Manager
            </button>
          </nav>
        </div>

        {/* Google Ads Tab */}
        {activeTab === 'google-ads' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Google Ads Accounts
              </h2>
              <button
                onClick={() => setShowGoogleAdsForm(!showGoogleAdsForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {showGoogleAdsForm ? 'Cancel' : 'Add Account'}
              </button>
            </div>

            {/* Add Form */}
            {showGoogleAdsForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add New Google Ads Account
                </h3>
                <form onSubmit={handleGoogleAdsSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={googleAdsForm.accountName}
                        onChange={(e) =>
                          setGoogleAdsForm({ ...googleAdsForm, accountName: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer ID
                      </label>
                      <input
                        type="text"
                        value={googleAdsForm.customerId}
                        onChange={(e) =>
                          setGoogleAdsForm({ ...googleAdsForm, customerId: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Developer Token
                      </label>
                      <input
                        type="text"
                        value={googleAdsForm.developerToken}
                        onChange={(e) =>
                          setGoogleAdsForm({ ...googleAdsForm, developerToken: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client ID
                      </label>
                      <input
                        type="text"
                        value={googleAdsForm.clientId}
                        onChange={(e) =>
                          setGoogleAdsForm({ ...googleAdsForm, clientId: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        value={googleAdsForm.clientSecret}
                        onChange={(e) =>
                          setGoogleAdsForm({ ...googleAdsForm, clientSecret: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Refresh Token
                      </label>
                      <input
                        type="text"
                        value={googleAdsForm.refreshToken}
                        onChange={(e) =>
                          setGoogleAdsForm({ ...googleAdsForm, refreshToken: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Login Customer ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={googleAdsForm.loginCustomerId}
                        onChange={(e) =>
                          setGoogleAdsForm({ ...googleAdsForm, loginCustomerId: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Account
                  </button>
                </form>
              </div>
            )}

            {/* Accounts List */}
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              {googleAdsAccounts.map((account) => (
                <div key={account.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {account.accountName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Customer ID: {account.customerId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Last Sync: {account.lastSyncAt ? new Date(account.lastSyncAt).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGoogleAds(account.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {googleAdsAccounts.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No accounts configured
                </div>
              )}
            </div>
          </div>
        )}

        {/* GTM Tab */}
        {activeTab === 'gtm' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Google Tag Manager Accounts
              </h2>
              <button
                onClick={() => setShowGTMForm(!showGTMForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {showGTMForm ? 'Cancel' : 'Add Account'}
              </button>
            </div>

            {/* Add Form */}
            {showGTMForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Add New GTM Account
                </h3>
                <form onSubmit={handleGTMSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={gtmForm.accountName}
                        onChange={(e) =>
                          setGTMForm({ ...gtmForm, accountName: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account ID
                      </label>
                      <input
                        type="text"
                        value={gtmForm.accountId}
                        onChange={(e) =>
                          setGTMForm({ ...gtmForm, accountId: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Account Path (e.g., accounts/123456)
                      </label>
                      <input
                        type="text"
                        value={gtmForm.accountPath}
                        onChange={(e) =>
                          setGTMForm({ ...gtmForm, accountPath: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Client Email
                      </label>
                      <input
                        type="email"
                        value={gtmForm.clientEmail}
                        onChange={(e) =>
                          setGTMForm({ ...gtmForm, clientEmail: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project ID
                      </label>
                      <input
                        type="text"
                        value={gtmForm.projectId}
                        onChange={(e) =>
                          setGTMForm({ ...gtmForm, projectId: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Private Key (JSON format)
                      </label>
                      <textarea
                        value={gtmForm.privateKey}
                        onChange={(e) =>
                          setGTMForm({ ...gtmForm, privateKey: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                  >
                    Add Account
                  </button>
                </form>
              </div>
            )}

            {/* Accounts List */}
            <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
              {gtmAccounts.map((account) => (
                <div key={account.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {account.accountName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Account ID: {account.accountId}
                      </p>
                      <p className="text-sm text-gray-500">
                        Last Sync: {account.lastSyncAt ? new Date(account.lastSyncAt).toLocaleString() : 'Never'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGTM(account.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {gtmAccounts.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  No accounts configured
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
