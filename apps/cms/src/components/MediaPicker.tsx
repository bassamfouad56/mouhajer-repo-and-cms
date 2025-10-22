'use client';

import { useState, useEffect, useRef } from 'react';

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
  alt?: string;
  caption?: string;
}

interface MediaPickerProps {
  onSelect: (files: MediaFile | MediaFile[]) => void;
  onClose: () => void;
  multiple?: boolean;
  fileType?: 'image' | 'video' | 'document' | 'all';
  selectedIds?: string[];
}

export default function MediaPicker({
  onSelect,
  onClose,
  multiple = false,
  fileType = 'all',
  selectedIds = [],
}: MediaPickerProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(selectedIds));
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'document'>(fileType);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploader, setShowUploader] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/media');
      const data = await response.json();
      setMediaFiles(data);
    } catch (error) {
      console.error('Failed to fetch media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedFiles);
    const file = mediaFiles.find(f => f.id === id);
    
    if (newSelection.has(id)) {
      newSelection.delete(id);
      if (previewFile?.id === id) {
        setPreviewFile(null);
      }
    } else {
      if (multiple) {
        newSelection.add(id);
      } else {
        newSelection.clear();
        newSelection.add(id);
      }
      if (file) {
        setPreviewFile(file);
      }
    }
    setSelectedFiles(newSelection);
  };

  const handleConfirm = () => {
    const selected = mediaFiles.filter(f => selectedFiles.has(f.id));
    if (selected.length > 0) {
      onSelect(multiple ? selected : selected[0]);
    }
    onClose();
  };

  const filteredFiles = mediaFiles
    .filter(file => filter === 'all' || file.type === filter)
    .filter(file =>
      searchQuery === '' ||
      (file.name && file.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (file.originalName && file.originalName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Select Media</h2>
              <p className="text-sm text-gray-500 mt-1">
                {multiple ? 'Select one or more files' : 'Select a file'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search, Filter, and Upload */}
          <div className="flex gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
            <button
              onClick={() => setShowUploader(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Upload
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500">Loading media files...</p>
              </div>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No media files found</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredFiles.map((file) => {
                const isSelected = selectedFiles.has(file.id);
                const isPreviewing = previewFile?.id === file.id;
                return (
                  <button
                    key={file.id}
                    onClick={() => toggleSelection(file.id)}
                    onMouseEnter={() => setPreviewFile(file)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      isSelected
                        ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2'
                        : isPreviewing
                        ? 'border-blue-400'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Media Preview */}
                    {file.type === 'image' ? (
                      <img
                        src={file.thumbnailUrl || file.url}
                        alt={file.alt || file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : file.type === 'video' ? (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* File Name Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-xs text-white truncate">{file.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          </div>
          
          {/* Preview Panel */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Preview</h3>
            </div>
            <div className="flex-1 p-4">
              {previewFile ? (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {previewFile.type === 'image' ? (
                      <img
                        src={previewFile.url}
                        alt={previewFile.alt || previewFile.name}
                        className="w-full h-full object-contain"
                      />
                    ) : previewFile.type === 'video' ? (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* File Details */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">File Name</label>
                      <p className="text-sm text-gray-900 mt-1 break-words">{previewFile.name}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Original Name</label>
                      <p className="text-sm text-gray-900 mt-1 break-words">{previewFile.originalName}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
                        <p className="text-sm text-gray-900 mt-1 capitalize">{previewFile.type}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Size</label>
                        <p className="text-sm text-gray-900 mt-1">{(previewFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    
                    {previewFile.width && previewFile.height && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dimensions</label>
                        <p className="text-sm text-gray-900 mt-1">{previewFile.width} × {previewFile.height}px</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Uploaded</label>
                      <p className="text-sm text-gray-900 mt-1">{new Date(previewFile.uploadedAt).toLocaleDateString()}</p>
                    </div>
                    
                    {previewFile.alt && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Alt Text</label>
                        <p className="text-sm text-gray-900 mt-1">{previewFile.alt}</p>
                      </div>
                    )}
                    
                    {previewFile.caption && (
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Caption</label>
                        <p className="text-sm text-gray-900 mt-1">{previewFile.caption}</p>
                      </div>
                    )}
                    
                    {/* Selection Status */}
                    <div className="pt-2 border-t border-gray-200">
                      {selectedFiles.has(previewFile.id) ? (
                        <div className="flex items-center text-blue-600">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                          </svg>
                          <span className="text-sm">Click to select</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Hover or select an image to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedFiles.size > 0 ? (
              <span>{selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected</span>
            ) : (
              <span>No files selected</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedFiles.size === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select {selectedFiles.size > 0 && `(${selectedFiles.size})`}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploader && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Upload New Media</h3>
              <button
                onClick={() => setShowUploader(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <QuickUploader
              onUploadComplete={(uploadedFiles) => {
                // Refresh media files list
                fetchMediaFiles();
                setShowUploader(false);
                // Auto-select uploaded files if they match the filter
                if (uploadedFiles.length > 0) {
                  const newSelection = new Set(selectedFiles);
                  uploadedFiles.forEach(file => {
                    if (filter === 'all' || file.type === filter) {
                      if (multiple) {
                        newSelection.add(file.id);
                      } else {
                        newSelection.clear();
                        newSelection.add(file.id);
                      }
                    }
                  });
                  setSelectedFiles(newSelection);
                }
              }}
              onClose={() => setShowUploader(false)}
              accept={fileType === 'image' ? 'image/*' : fileType === 'video' ? 'video/*' : undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Quick uploader component for inline use
function QuickUploader({ onUploadComplete, onClose, accept = 'image/*' }: {
  onUploadComplete: (files: MediaFile[]) => void;
  onClose: () => void;
  accept?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadedFiles: MediaFile[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const uploadedFile = await response.json();
          uploadedFiles.push({
            id: uploadedFile.id,
            name: uploadedFile.filename,
            originalName: uploadedFile.originalName,
            url: uploadedFile.url,
            thumbnailUrl: uploadedFile.thumbnailUrl,
            type: uploadedFile.type,
            size: uploadedFile.size,
            width: uploadedFile.width,
            height: uploadedFile.height,
            uploadedAt: uploadedFile.uploadedAt,
          });
        }
      } catch (error) {
        console.error('Upload failed for', file.name, error);
      }
    }

    setUploading(false);
    onUploadComplete(uploadedFiles);
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-blue-600">Click to select files</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 10MB</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />

        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-900">
              {files.length} file{files.length !== 1 ? 's' : ''} selected
            </h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {uploading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {uploading ? 'Uploading...' : 'Upload Files'}
          </button>
        </div>
      </div>
    </div>
  );
}
