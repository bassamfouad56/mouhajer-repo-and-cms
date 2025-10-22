'use client';

import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  stage: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  createdAt: string;
  metadata?: {
    previousStage?: string;
    newStage?: string;
  };
}

interface DealActivitiesPanelProps {
  dealId: string;
  currentStage: string;
  onClose: () => void;
}

export default function DealActivitiesPanel({ dealId, currentStage, onClose }: DealActivitiesPanelProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [dealId]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetDealActivities($dealId: String!, $limit: Int) {
              activities(relatedTo: "deal", relatedId: $dealId, limit: $limit) {
                id
                type
                title
                description
                stage
                user {
                  id
                  name
                  email
                  avatar
                }
                metadata
                createdAt
              }
            }
          `,
          variables: {
            dealId,
            limit: 100,
          },
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;

    try {
      setSaving(true);
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            mutation AddDealNote($input: AddDealNoteInput!) {
              addDealNote(input: $input) {
                id
                title
                description
                stage
                user {
                  id
                  name
                  email
                  avatar
                }
                createdAt
              }
            }
          `,
          variables: {
            input: {
              dealId,
              stage: currentStage,
              note: note.trim(),
            },
          },
        }),
      });

      if (response.ok) {
        setNote('');
        fetchActivities();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'status_change':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'note':
        return 'bg-blue-100 text-blue-600';
      case 'status_change':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Group activities by stage
  const activitiesByStage = activities.reduce((acc, activity) => {
    const stage = activity.stage || 'general';
    if (!acc[stage]) acc[stage] = [];
    acc[stage].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Deal Activities & Notes</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Note Form */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Note for Current Phase
            </label>
            <div className="flex gap-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Add a note for this deal...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={saving}
              />
              <button
                onClick={handleAddNote}
                disabled={!note.trim() || saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors h-fit"
              >
                {saving ? 'Saving...' : 'Add Note'}
              </button>
            </div>
          </div>

          {/* Activities */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No activities yet. Add a note to get started!
            </div>
          ) : (
            <div className="space-y-6">
              {/* Current Phase Activities */}
              {activitiesByStage[currentStage] && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Phase Notes</h3>
                  <div className="space-y-3">
                    {activitiesByStage[currentStage].map((activity) => (
                      <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <p className="font-medium text-gray-900">{activity.title}</p>
                                {activity.description && (
                                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                              <div className="flex items-center gap-1">
                                {activity.user.avatar ? (
                                  <img
                                    src={activity.user.avatar}
                                    alt={activity.user.name}
                                    className="w-4 h-4 rounded-full"
                                  />
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-medium text-gray-600">
                                    {activity.user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <span className="font-medium">{activity.user.name}</span>
                              </div>
                              <span>•</span>
                              <span>{formatDate(activity.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Activities Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity Timeline</h3>
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              {activity.description && (
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              )}
                              {activity.stage && (
                                <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                                  {activity.stage.replace(/_/g, ' ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <div className="flex items-center gap-1">
                              {activity.user.avatar ? (
                                <img
                                  src={activity.user.avatar}
                                  alt={activity.user.name}
                                  className="w-4 h-4 rounded-full"
                                />
                              ) : (
                                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-medium text-gray-600">
                                  {activity.user.name.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="font-medium">{activity.user.name}</span>
                            </div>
                            <span>•</span>
                            <span>{formatDate(activity.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
