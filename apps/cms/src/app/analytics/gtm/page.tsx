'use client';

import { useState, useEffect } from 'react';

interface GTMAccount {
  id: string;
  accountName: string;
  accountId: string;
  isActive: boolean;
  lastSyncAt: string | null;
  syncStatus: string;
  containers: GTMContainer[];
}

interface GTMContainer {
  id: string;
  containerName: string;
  publicId: string;
  _count: {
    tags: number;
    triggers: number;
    variables: number;
  };
}

interface ContainerDetails {
  id: string;
  containerName: string;
  publicId: string;
  tags: any[];
  triggers: any[];
  variables: any[];
}

export default function GTMDashboard() {
  const [accounts, setAccounts] = useState<GTMAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [selectedContainer, setSelectedContainer] = useState<string>('');
  const [containerDetails, setContainerDetails] = useState<ContainerDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedContainer) {
      fetchContainerDetails();
    }
  }, [selectedContainer]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/gtm/accounts');
      const data = await res.json();
      setAccounts(data);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch GTM accounts:', error);
    }
  };

  const fetchContainerDetails = async () => {
    if (!selectedContainer) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/gtm/containers/${selectedContainer}`);
      const data = await res.json();
      setContainerDetails(data);
    } catch (error) {
      console.error('Failed to fetch container details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    if (!selectedAccount) return;

    setLoading(true);
    try {
      const res = await fetch('/api/gtm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: selectedAccount }),
      });

      if (res.ok) {
        alert('GTM sync completed successfully!');
        fetchAccounts();
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

  const currentAccount = accounts.find(acc => acc.id === selectedAccount);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Tag Manager Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your GTM containers, tags, triggers, and variables
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {account.accountName} ({account.accountId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Container
              </label>
              <select
                value={selectedContainer}
                onChange={(e) => setSelectedContainer(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!currentAccount}
              >
                <option value="">Select container</option>
                {currentAccount?.containers.map((container) => (
                  <option key={container.id} value={container.id}>
                    {container.containerName} ({container.publicId})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSync}
                disabled={loading || !selectedAccount}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Syncing...' : 'Sync GTM Data'}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {currentAccount && currentAccount.containers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Containers</div>
              <div className="text-2xl font-bold text-gray-900">
                {currentAccount.containers.length}
              </div>
            </div>

            {selectedContainer && containerDetails && (
              <>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-gray-500 mb-1">Tags</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {containerDetails.tags.length}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-gray-500 mb-1">Triggers</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {containerDetails.triggers.length}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Container Details */}
        {containerDetails && (
          <div className="space-y-6">
            {/* Tags */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tags ({containerDetails.tags.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {containerDetails.tags.map((tag) => (
                  <div key={tag.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{tag.name}</div>
                        <div className="text-sm text-gray-500">{tag.type}</div>
                      </div>
                      <div>
                        {tag.paused && (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Paused
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {containerDetails.tags.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No tags found
                  </div>
                )}
              </div>
            </div>

            {/* Triggers */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Triggers ({containerDetails.triggers.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {containerDetails.triggers.map((trigger) => (
                  <div key={trigger.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="font-medium text-gray-900">{trigger.name}</div>
                    <div className="text-sm text-gray-500">{trigger.type}</div>
                  </div>
                ))}
                {containerDetails.triggers.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No triggers found
                  </div>
                )}
              </div>
            </div>

            {/* Variables */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Variables ({containerDetails.variables.length})
                </h2>
              </div>
              <div className="divide-y divide-gray-200">
                {containerDetails.variables.map((variable) => (
                  <div key={variable.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="font-medium text-gray-900">{variable.name}</div>
                    <div className="text-sm text-gray-500">{variable.type}</div>
                  </div>
                ))}
                {containerDetails.variables.length === 0 && (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No variables found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {accounts.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-gray-400 text-lg">
              No GTM accounts configured.
            </div>
            <div className="text-gray-500 mt-2">
              Add your first account to start managing your tags.
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
