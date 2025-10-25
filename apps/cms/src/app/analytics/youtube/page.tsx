'use client';

import React, { useState, useEffect } from 'react';
import { Play, Users, Eye, Clock, TrendingUp, RefreshCw } from 'lucide-react';

interface Channel {
  id: string;
  channelName: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: bigint;
  lastSyncAt: Date | null;
  syncStatus: string;
}

interface Metrics {
  totalViews: number;
  totalWatchTime: number;
  totalSubscribers: number;
  totalVideos: number;
  averageViewDuration: number;
  subscriberGrowth: number;
  engagementRate: number;
}

interface Video {
  id: string;
  videoId: string;
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: Date;
}

export default function YouTubePage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [daysBack, setDaysBack] = useState(30);

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchMetrics();
      fetchVideos();
    }
  }, [selectedChannel, daysBack]);

  const fetchChannels = async () => {
    try {
      const res = await fetch('/api/youtube/channels');
      const data = await res.json();
      if (data.success && data.channels.length > 0) {
        setChannels(data.channels);
        if (!selectedChannel) {
          setSelectedChannel(data.channels[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    }
  };

  const fetchMetrics = async () => {
    if (!selectedChannel) return;

    try {
      const res = await fetch(
        `/api/youtube/metrics?channelId=${selectedChannel}&daysBack=${daysBack}`
      );
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const fetchVideos = async () => {
    if (!selectedChannel) return;

    try {
      const res = await fetch(
        `/api/youtube/videos?channelId=${selectedChannel}&limit=10`
      );
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos);
      }
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const handleSync = async () => {
    if (!selectedChannel) return;

    setIsSyncing(true);
    try {
      const res = await fetch('/api/youtube/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelIdDb: selectedChannel,
          daysBack,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert('Channel synced successfully!');
        fetchChannels();
        fetchMetrics();
        fetchVideos();
      } else {
        alert(`Sync failed: ${data.message || data.error}`);
      }
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedChannelData = channels.find((c) => c.id === selectedChannel);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">YouTube Analytics</h1>
        <p className="text-gray-600">
          Track video performance, subscriber growth, and engagement metrics
        </p>
      </div>

      {channels.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Play className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">No YouTube Channel Connected</h3>
          <p className="text-gray-600 mb-4">
            Add your YouTube channel to start tracking analytics
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-left max-w-2xl mx-auto">
            <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h4>
            <ol className="list-decimal list-inside text-blue-800 space-y-1">
              <li>Create a service account in Google Cloud Console</li>
              <li>Enable YouTube Data API v3 and YouTube Analytics API</li>
              <li>Download JSON credentials</li>
              <li>Use POST /api/youtube/channels to add your channel</li>
            </ol>
          </div>
        </div>
      ) : (
        <>
          {/* Channel Selector & Sync */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel
                  </label>
                  <select
                    value={selectedChannel || ''}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {channels.map((channel) => (
                      <option key={channel.id} value={channel.id}>
                        {channel.channelName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period
                  </label>
                  <select
                    value={daysBack}
                    onChange={(e) => setDaysBack(parseInt(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            {selectedChannelData && (
              <div className="mt-4 text-sm text-gray-600">
                Last synced:{' '}
                {selectedChannelData.lastSyncAt
                  ? new Date(selectedChannelData.lastSyncAt).toLocaleString()
                  : 'Never'}
              </div>
            )}
          </div>

          {/* Metrics Cards */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Views</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(metrics.totalViews)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Subscribers</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(metrics.totalSubscribers)}
                    </p>
                    <p className={`text-xs ${metrics.subscriberGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {metrics.subscriberGrowth >= 0 ? '+' : ''}{metrics.subscriberGrowth} this period
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Watch Time</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(metrics.totalWatchTime)}h
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Engagement Rate</p>
                    <p className="text-2xl font-bold">
                      {metrics.engagementRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Videos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Videos</h2>

            {videos.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Play className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No videos found. Click "Sync Now" to fetch your videos.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatNumber(video.viewCount)} views</span>
                          <span>{formatNumber(video.likeCount)} likes</span>
                          <span>{formatNumber(video.commentCount)} comments</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Published {new Date(video.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={`https://youtube.com/watch?v=${video.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Watch
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
