'use client';

import React, { useState } from 'react';
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
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface BlueprintsListWithDeleteProps {
  blueprints: ContentBlueprint[];
  onBlueprintsDeleted: () => void;
  onDuplicate: (id: string) => void;
}

export default function BlueprintsListWithDelete({
  blueprints,
  onBlueprintsDeleted,
  onDuplicate
}: BlueprintsListWithDeleteProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'single' | 'bulk'>('single');
  const [blueprintToDelete, setBlueprintToDelete] = useState<ContentBlueprint | null>(null);

  const handleToggleSelect = (blueprintId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(blueprintId)) {
      newSelected.delete(blueprintId);
    } else {
      newSelected.add(blueprintId);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (blueprints: ContentBlueprint[]) => {
    const nonSystemBlueprints = blueprints.filter(bp => !bp.isSystem);

    if (selectedIds.size === nonSystemBlueprints.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(nonSystemBlueprints.map(bp => bp.id)));
    }
  };

  const handleDeleteSingle = (blueprint: ContentBlueprint) => {
    if (blueprint.isSystem) {
      alert('System blueprints cannot be deleted');
      return;
    }
    setBlueprintToDelete(blueprint);
    setDeleteMode('single');
    setShowConfirmDelete(true);
  };

  const handleDeleteBulk = () => {
    if (selectedIds.size === 0) return;
    setDeleteMode('bulk');
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      let url = '/api/blueprints?';

      if (deleteMode === 'single' && blueprintToDelete) {
        url += `id=${blueprintToDelete.id}`;
      } else if (deleteMode === 'bulk') {
        const ids = Array.from(selectedIds).join(',');
        url += `ids=${ids}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete blueprints');
      }

      // Clear selections and refresh blueprints
      setSelectedIds(new Set());
      setShowConfirmDelete(false);
      setBlueprintToDelete(null);
      onBlueprintsDeleted();
    } catch (error) {
      console.error('Error deleting blueprints:', error);
      alert('Failed to delete blueprints. ' + (error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderBlueprintGroup = (title: string, blueprints: ContentBlueprint[]) => {
    if (blueprints.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {title} ({blueprints.length})
          </h3>
          {title === 'User-Created Blueprints' && blueprints.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={blueprints.every(bp => selectedIds.has(bp.id))}
                onChange={() => handleSelectAll(blueprints)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="font-medium text-gray-700">Select All</span>
            </label>
          )}
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blueprints.map((blueprint) => (
            <div
              key={blueprint.id}
              className={`relative bg-white rounded-xl border-2 transition-all hover:shadow-md ${
                selectedIds.has(blueprint.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              {/* Selection Checkbox (only for non-system blueprints) */}
              {!blueprint.isSystem && (
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(blueprint.id)}
                    onChange={() => handleToggleSelect(blueprint.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Blueprint Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className={`${!blueprint.isSystem ? 'ml-8' : ''} flex-1`}>
                    <div className="flex items-center gap-2 mb-1">
                      {blueprint.icon && (
                        <span className="text-2xl">{blueprint.icon}</span>
                      )}
                      <h3 className="font-semibold text-gray-900">
                        {blueprint.displayName}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">
                      {blueprint.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {blueprint.isSystem ? (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        System
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeleteSingle(blueprint)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete blueprint"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        blueprint.blueprintType === 'DOCUMENT'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {blueprint.blueprintType}
                    </span>
                  </div>
                </div>

                {blueprint.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {blueprint.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {blueprint.category}
                  </span>
                  <div className="flex items-center gap-2">
                    {!blueprint.isSystem && (
                      <button
                        onClick={() => onDuplicate(blueprint.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Duplicate
                      </button>
                    )}
                    <button
                      onClick={() => router.push(`/blueprints/${blueprint.id}`)}
                      className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.size} blueprint{selectedIds.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear selection
            </button>
          </div>
          <button
            onClick={handleDeleteBulk}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected
          </button>
        </div>
      )}

      {/* Blueprints Lists */}
      {renderBlueprintGroup('System Blueprints', blueprints.filter(bp => bp.isSystem))}
      {renderBlueprintGroup('User-Created Blueprints', blueprints.filter(bp => !bp.isSystem))}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-4">
              {deleteMode === 'single' && blueprintToDelete
                ? (
                    <>
                      Are you sure you want to delete "<strong>{blueprintToDelete.displayName}</strong>"?
                      <br />
                      <span className="text-sm text-red-600 mt-2 block">
                        ⚠️ This will also delete all content instances using this blueprint.
                      </span>
                    </>
                  )
                : (
                    <>
                      Are you sure you want to delete {selectedIds.size} blueprint{selectedIds.size > 1 ? 's' : ''}?
                      <br />
                      <span className="text-sm text-red-600 mt-2 block">
                        ⚠️ This will also delete all content instances using these blueprints.
                      </span>
                    </>
                  )}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmDelete(false);
                  setBlueprintToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}