'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  reviewId: string;
  reviewerName: string;
  reviewerPhotoUrl?: string;
  starRating: number;
  comment?: string;
  createTime: string;
  updateTime: string;
  replyComment?: string;
  replyUpdateTime?: string;
}

interface Stats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  unansweredReviews: number;
  recentReviews: number;
  positiveReviews: number;
  negativeReviews: number;
  responseRate: number;
}

interface Account {
  id: string;
  accountName: string;
  locationName?: string;
  address?: string;
  phoneNumber?: string;
  websiteUrl?: string;
  lastSyncAt?: string;
  syncStatus: string;
}

export default function BusinessProfilePage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [autoSetupLoading, setAutoSetupLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchReviews();
      fetchStats();
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/business-profile/accounts');
      const data = await response.json();
      // Ensure data is an array
      const accountsData = Array.isArray(data) ? data : [];
      setAccounts(accountsData);
      if (accountsData.length > 0 && !selectedAccount) {
        setSelectedAccount(accountsData[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!selectedAccount) return;
    try {
      const response = await fetch(`/api/business-profile/reviews?accountId=${selectedAccount}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const fetchStats = async () => {
    if (!selectedAccount) return;
    try {
      const response = await fetch(`/api/business-profile/stats?accountId=${selectedAccount}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSync = async () => {
    if (!selectedAccount) return;
    setSyncing(true);
    try {
      const response = await fetch('/api/business-profile/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: selectedAccount }),
      });

      if (response.ok) {
        await fetchReviews();
        await fetchStats();
        alert('✅ Reviews synced successfully!');
      } else {
        const data = await response.json();
        alert('❌ Sync failed: ' + data.message);
      }
    } catch (error) {
      alert('❌ Sync failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!selectedAccount || !replyText.trim()) return;

    try {
      const response = await fetch('/api/business-profile/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount,
          reviewId,
          replyText: replyText.trim(),
        }),
      });

      if (response.ok) {
        await fetchReviews();
        setReplyingTo(null);
        setReplyText('');
        alert('✅ Reply posted successfully!');
      } else {
        const data = await response.json();
        alert('❌ Failed to post reply: ' + data.details);
      }
    } catch (error) {
      alert('❌ Failed to post reply: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleAutoSetup = async () => {
    setAutoSetupLoading(true);
    try {
      const response = await fetch('/api/business-profile/auto-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        alert('✅ ' + data.message + '\n\nYou can now configure your specific location details in Settings.');
        await fetchAccounts();
      } else {
        const error = await response.json();
        alert('❌ Auto-setup failed: ' + (error.error || error.message));
      }
    } catch (error) {
      console.error('Auto-setup failed:', error);
      alert('❌ Auto-setup failed. Please try manual setup in Settings.');
    } finally {
      setAutoSetupLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading Business Profile data...</div>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4">
                <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Google Business Profile</h2>
              <p className="text-gray-600">Monitor reviews and manage your online reputation</p>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">What you'll get:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Monitor all Google reviews in one place
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Respond to reviews directly from your CMS
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Track review statistics and sentiment
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Get alerts for unanswered reviews
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  View customer insights and Q&A
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-900">
                  <strong>Quick Setup:</strong> We'll use your existing Google Analytics credentials to set up Business Profile automatically.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleAutoSetup}
                disabled={autoSetupLoading}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-lg hover:from-yellow-700 hover:to-orange-700 shadow-lg disabled:opacity-50 transition-all"
              >
                {autoSetupLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Setting up...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    ⚡ Quick Setup with Existing Credentials
                  </>
                )}
              </button>

              <Link
                href="/analytics/settings"
                className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manual Setup
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentAccount = accounts.find(a => a.id === selectedAccount);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Google Business Profile</h1>
          <p className="text-gray-600 mt-1">Monitor reviews and manage your reputation</p>
        </div>
        <div className="flex space-x-3">
          {accounts.length > 1 && (
            <select
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.accountName}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center"
          >
            {syncing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Syncing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Sync Reviews
              </>
            )}
          </button>
        </div>
      </div>

      {/* Business Info */}
      {currentAccount && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{currentAccount.locationName || currentAccount.accountName}</h2>
              {currentAccount.address && <p className="text-gray-600 text-sm mt-1">{currentAccount.address}</p>}
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                {currentAccount.phoneNumber && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {currentAccount.phoneNumber}
                  </span>
                )}
                {currentAccount.websiteUrl && (
                  <a href={currentAccount.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-yellow-600 hover:text-yellow-700">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>
            {currentAccount.lastSyncAt && (
              <div className="text-xs text-gray-500">
                Last synced: {new Date(currentAccount.lastSyncAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
              <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalReviews}</p>
            <p className="text-sm text-gray-600 mt-1">{stats.recentReviews} in last 30 days</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex items-end space-x-2">
              <p className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              <div className="pb-1">{renderStars(Math.round(stats.averageRating))}</div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{stats.positiveReviews} positive ({((stats.positiveReviews / stats.totalReviews) * 100).toFixed(0)}%)</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Response Rate</h3>
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.responseRate.toFixed(0)}%</p>
            <p className="text-sm text-gray-600 mt-1">{stats.unansweredReviews} unanswered</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Rating Distribution</h3>
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center text-xs">
                  <span className="w-3 text-gray-600">{star}</span>
                  <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[star] / stats.totalReviews) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-600">{stats.ratingDistribution[star]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="text-gray-600">No reviews yet. Click "Sync Reviews" to fetch latest reviews.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    {review.reviewerPhotoUrl ? (
                      <img
                        src={review.reviewerPhotoUrl}
                        alt={review.reviewerName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                        {review.reviewerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                      <p className="text-xs text-gray-500">{new Date(review.createTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {renderStars(review.starRating)}
                </div>

                {review.comment && (
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                )}

                {review.replyComment ? (
                  <div className="bg-gray-50 border-l-4 border-yellow-400 p-3 rounded">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Your Reply:</p>
                    <p className="text-sm text-gray-700">{review.replyComment}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {review.replyUpdateTime && new Date(review.replyUpdateTime).toLocaleDateString()}
                    </p>
                  </div>
                ) : replyingTo === review.reviewId ? (
                  <div className="mt-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                      rows={3}
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleReply(review.reviewId)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                      >
                        Post Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyingTo(review.reviewId)}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Reply to this review
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
