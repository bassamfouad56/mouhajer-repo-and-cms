'use client';

import { useState } from 'react';
import Modal from './Modal';

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
  mimeType?: string;
}

interface MediaDetailModalProps {
  file: MediaFile;
  onClose: () => void;
  onUpdate?: (updatedFile: Partial<MediaFile>) => void;
}

export default function MediaDetailModal({ file, onClose, onUpdate }: MediaDetailModalProps) {
  const [alt, setAlt] = useState(file.alt || '');
  const [caption, setCaption] = useState(file.caption || '');
  const [isSaving, setIsSaving] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/media/${file.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt, caption }),
      });

      if (response.ok) {
        onUpdate?.({ alt, caption });
        onClose();
      }
    } catch (error) {
      console.error('Failed to update media file:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Media Details"
    >
      <div className="space-y-6">
        {/* Preview */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
          {file.type === 'image' && (
            <img
              src={file.url}
              alt={file.alt || file.originalName}
              className="max-w-full max-h-[400px] object-contain rounded"
            />
          )}
          {file.type === 'video' && (
            <video
              src={file.url}
              controls
              className="max-w-full max-h-[400px] rounded"
            />
          )}
          {file.type === 'document' && (
            <div className="text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-gray-600">{file.originalName}</p>
            </div>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">File Name</p>
            <p className="text-sm text-gray-900 truncate">{file.originalName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">File Type</p>
            <p className="text-sm text-gray-900">{file.mimeType || file.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">File Size</p>
            <p className="text-sm text-gray-900">{formatFileSize(file.size)}</p>
          </div>
          {file.width && file.height && (
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Dimensions</p>
              <p className="text-sm text-gray-900">{file.width} × {file.height} px</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Uploaded</p>
            <p className="text-sm text-gray-900">{new Date(file.uploadedAt).toLocaleDateString()}</p>
          </div>
          {file.uploadedBy && (
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Uploaded By</p>
              <p className="text-sm text-gray-900">{file.uploadedBy}</p>
            </div>
          )}
        </div>

        {/* URL with Copy */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">File URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={file.url}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
            />
            <button
              onClick={() => copyToClipboard(file.url)}
              className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Alt Text (Images only) */}
        {file.type === 'image' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text
              <span className="text-red-500 ml-1">*</span>
              <span className="text-xs text-gray-500 font-normal ml-2">(Required for accessibility)</span>
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Describe this image for screen readers"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        )}

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption for this media"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || (file.type === 'image' && !alt.trim())}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
