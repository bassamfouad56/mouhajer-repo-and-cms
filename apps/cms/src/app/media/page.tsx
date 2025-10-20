'use client';

import { useState, useEffect, useMemo } from 'react';
import MediaUploader from '@/components/MediaUploader';
import ImageEditor from '@/components/ImageEditor';
import SearchInput from '@/components/SearchInput';
import FilterDropdown, { FilterOption } from '@/components/FilterDropdown';
import MediaDetailModal from '@/components/MediaDetailModal';

interface MediaFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'document';
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
  uploadedBy?: string;
  alt?: string;
  caption?: string;
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [detailFile, setDetailFile] = useState<MediaFile | null>(null);

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      setMediaFiles(data);
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter, search, and sort media files
  const filteredFiles = useMemo(() => {
    let filtered = [...mediaFiles];

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(file => file.type === filterType);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.caption?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime());
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.originalName.localeCompare(b.originalName));
    } else if (sortBy === 'size') {
      filtered.sort((a, b) => b.size - a.size);
    }

    return filtered;
  }, [mediaFiles, filterType, searchQuery, sortBy]);

  const typeOptions: FilterOption[] = [
    { label: 'All Types', value: 'all' },
    { label: 'Images', value: 'image' },
    { label: 'Videos', value: 'video' },
    { label: 'Documents', value: 'document' }
  ];

  const sortOptions: FilterOption[] = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Name (A-Z)', value: 'name' },
    { label: 'Size (Largest)', value: 'size' }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDeleteSelected = async () => {
    if (confirm(`Are you sure you want to delete ${selectedFiles.length} file(s)?`)) {
      try {
        // Delete each file individually
        for (const id of selectedFiles) {
          await fetch(`/api/media/${id}`, {
            method: 'DELETE',
          });
        }

        // Refresh media files
        await fetchMediaFiles();
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error deleting files:', error);
        alert('Failed to delete files');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        const response = await fetch(`/api/media/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchMediaFiles();
        } else {
          alert('Failed to delete file');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete file');
      }
    }
  };

  const handleEditFile = async (file: MediaFile, updates: Partial<MediaFile>) => {
    try {
      const response = await fetch(`/api/media/${file.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await fetchMediaFiles();
        setEditingFile(null);
      }
    } catch (error) {
      console.error('Error updating file:', error);
    }
  };

  const handleEditImage = (file: MediaFile) => {
    if (file.type === 'image') {
      setEditingFile(file);
      setShowImageEditor(true);
    }
  };

  const handleSaveEditedImage = async (editedUrl: string, width: number, height: number) => {
    if (!editingFile) return;

    // Update the media file record with the new edited image
    await handleEditFile(editingFile, {
      url: editedUrl,
      width,
      height,
    });

    setShowImageEditor(false);
    setEditingFile(null);
  };

  const handleUploadComplete = async () => {
    await fetchMediaFiles();
    setShowUploader(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your images, videos, and documents.
            </p>
          </div>
          <button
            onClick={() => setShowUploader(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Files
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by filename, alt text, or caption..."
              />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <FilterDropdown
                label="Type"
                options={typeOptions}
                value={filterType}
                onChange={(value) => setFilterType(value as 'all' | 'image' | 'video' | 'document')}
              />
              <FilterDropdown
                label="Sort"
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 text-sm ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1 text-sm ${
                    viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedFiles.length} selected</span>
                  <button
                    onClick={handleDeleteSelected}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Delete Selected
                  </button>
                </div>
              )}
            </div>
          </div>

          {(searchQuery || filterType !== 'all') && (
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <span>Showing {filteredFiles.length} of {mediaFiles.length} files</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                  setSortBy('newest');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              {getFileIcon(filterType === 'all' ? 'image' : filterType)}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-sm text-gray-500 mb-6">
              {filterType === 'all' ? 'Upload your first file to get started' : `No ${filterType}s found`}
            </p>
            {filterType === 'all' && (
              <button
                onClick={() => setShowUploader(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Upload Files
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer border-2 ${
                  selectedFiles.includes(file.id) ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => handleFileSelect(file.id)}
              >
                <div className="aspect-square relative overflow-hidden rounded-t-lg bg-gray-100">
                  {file.type === 'image' ? (
                    <img
                      src={file.thumbnailUrl || file.url}
                      alt={file.alt || file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.originalName}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                  {file.width && file.height && (
                    <p className="text-xs text-gray-500">{file.width} × {file.height}</p>
                  )}
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      file.type === 'image' ? 'bg-blue-100 text-blue-700' :
                      file.type === 'video' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {file.type}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailFile(file);
                        }}
                        className="text-gray-600 hover:text-gray-800"
                        title="View details"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      {file.type === 'image' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditImage(file);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className={selectedFiles.includes(file.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => handleFileSelect(file.id)}
                          className="mr-3 h-4 w-4 text-blue-600 rounded"
                        />
                        <div className="text-sm font-medium text-gray-900">{file.originalName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        file.type === 'image' ? 'bg-blue-100 text-blue-800' :
                        file.type === 'video' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {file.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setDetailFile(file)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Details
                        </button>
                        {file.type === 'image' && (
                          <button
                            onClick={() => handleEditImage(file)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Media Uploader Modal */}
      {showUploader && (
        <MediaUploader
          onUploadComplete={handleUploadComplete}
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* Image Editor Modal */}
      {showImageEditor && editingFile && (
        <ImageEditor
          imageUrl={editingFile.url}
          imageName={editingFile.originalName}
          onSave={handleSaveEditedImage}
          onClose={() => {
            setShowImageEditor(false);
            setEditingFile(null);
          }}
        />
      )}

      {/* Media Detail Modal */}
      {detailFile && (
        <MediaDetailModal
          file={detailFile}
          onClose={() => setDetailFile(null)}
          onUpdate={async (updates) => {
            await fetchMediaFiles();
            setDetailFile(null);
          }}
        />
      )}
    </div>
  );
}
