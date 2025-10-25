/**
 * Blueprints Management Interface
 * Manage content type blueprints (caisy.io-style CMS)
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ContentBlueprint {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  blueprintType: 'DOCUMENT' | 'COMPONENT';
  allowMultiple: boolean;
  isSystem: boolean;
  icon: string | null;
  thumbnailUrl: string | null;
  category: string;
  fields: any;
  createdAt: string;
  updatedAt: string;
}

export default function BlueprintsPage() {
  const router = useRouter();
  const [blueprints, setBlueprints] = useState<ContentBlueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const fetchBlueprints = async () => {
    try {
      const response = await fetch('/api/blueprints');
      const data = await response.json();
      setBlueprints(data);
    } catch (error) {
      console.error('Error fetching blueprints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the "${name}" blueprint? This will also delete all instances.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/blueprints/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlueprints(blueprints.filter(bp => bp.id !== id));
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting blueprint:', error);
      alert('Failed to delete blueprint');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/blueprints/${id}/duplicate`, {
        method: 'POST',
      });

      if (response.ok) {
        const newBlueprint = await response.json();
        setBlueprints([...blueprints, newBlueprint]);
      }
    } catch (error) {
      console.error('Error duplicating blueprint:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories', count: blueprints.length },
    { value: 'layout', label: 'Layout', count: blueprints.filter(bp => bp.category === 'layout').length },
    { value: 'media', label: 'Media', count: blueprints.filter(bp => bp.category === 'media').length },
    { value: 'content', label: 'Content', count: blueprints.filter(bp => bp.category === 'content').length },
    { value: 'general', label: 'General', count: blueprints.filter(bp => bp.category === 'general').length },
  ];

  const filteredBlueprints = selectedCategory === 'all'
    ? blueprints
    : blueprints.filter(bp => bp.category === selectedCategory);

  const systemBlueprints = filteredBlueprints.filter(bp => bp.isSystem);
  const userBlueprints = filteredBlueprints.filter(bp => !bp.isSystem);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blueprints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Content Blueprints</h1>
                <p className="text-sm text-gray-500">Define content types for your CMS</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/blueprints/new"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>New Blueprint</span>
            </Link>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="px-6 py-3 border-t bg-gray-50">
          <div className="flex items-center space-x-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* System Blueprints */}
        {systemBlueprints.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-900">System Blueprints</h2>
              <span className="text-sm text-gray-500">(Protected - Cannot be deleted)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {systemBlueprints.map(blueprint => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  onEdit={() => router.push(`/blueprints/${blueprint.id}`)}
                  onDelete={() => handleDelete(blueprint.id, blueprint.displayName)}
                  onDuplicate={() => handleDuplicate(blueprint.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* User Blueprints */}
        {userBlueprints.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">User Blueprints</h2>
              <span className="text-sm text-gray-500">{userBlueprints.length} blueprints</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userBlueprints.map(blueprint => (
                <BlueprintCard
                  key={blueprint.id}
                  blueprint={blueprint}
                  onEdit={() => router.push(`/blueprints/${blueprint.id}`)}
                  onDelete={() => handleDelete(blueprint.id, blueprint.displayName)}
                  onDuplicate={() => handleDuplicate(blueprint.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {filteredBlueprints.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No blueprints</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new blueprint.</p>
            <div className="mt-6">
              <Link
                href="/blueprints/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Blueprint
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function BlueprintCard({
  blueprint,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  blueprint: ContentBlueprint;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const fieldCount = Array.isArray(blueprint.fields) ? blueprint.fields.length : 0;

  const categoryColors: Record<string, string> = {
    layout: 'bg-blue-100 text-blue-800',
    media: 'bg-green-100 text-green-800',
    content: 'bg-purple-100 text-purple-800',
    general: 'bg-gray-100 text-gray-800',
  };

  const typeColors: Record<string, string> = {
    DOCUMENT: 'bg-orange-100 text-orange-800',
    COMPONENT: 'bg-teal-100 text-teal-800',
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-all hover:shadow-md">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {blueprint.icon ? (
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                </svg>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
            {blueprint.isSystem && (
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{blueprint.displayName}</h3>
        {blueprint.description && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{blueprint.description}</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded text-xs font-medium ${categoryColors[blueprint.category] || categoryColors.general}`}>
            {blueprint.category}
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${typeColors[blueprint.blueprintType]}`}>
            {blueprint.blueprintType}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">
            {fieldCount} field{fieldCount !== 1 ? 's' : ''}
          </span>
          {!blueprint.allowMultiple && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-700">
              Single
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-3 border-t">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDuplicate}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Duplicate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          {!blueprint.isSystem && (
            <button
              onClick={onDelete}
              className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
