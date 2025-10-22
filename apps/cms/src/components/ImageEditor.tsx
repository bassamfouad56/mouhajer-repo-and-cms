'use client';

import { useState, useRef, useEffect } from 'react';

interface ImageEditorProps {
  imageUrl: string;
  imageName: string;
  onSave: (editedUrl: string, width: number, height: number) => void;
  onClose: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageEditor({ imageUrl, imageName, onSave, onClose }: ImageEditorProps) {
  const [activeTab, setActiveTab] = useState<'crop' | 'resize' | 'rotate'>('crop');
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeWidth, setResizeWidth] = useState<string>('');
  const [resizeHeight, setResizeHeight] = useState<string>('');
  const [rotation, setRotation] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setResizeWidth(img.naturalWidth.toString());
      setResizeHeight(img.naturalHeight.toString());

      // Initialize crop to full image
      if (canvasRef.current && containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const scale = Math.min(containerWidth / img.naturalWidth, 400 / img.naturalHeight);
        const displayWidth = img.naturalWidth * scale;
        const displayHeight = img.naturalHeight * scale;

        setCrop({
          x: 0,
          y: 0,
          width: displayWidth,
          height: displayHeight,
        });
      }
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTab !== 'crop') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setCrop({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || activeTab !== 'crop') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let width = x - dragStart.x;
    let height = y - dragStart.y;

    // Maintain aspect ratio if set
    if (aspectRatio) {
      if (Math.abs(width) > Math.abs(height)) {
        height = width / aspectRatio;
      } else {
        width = height * aspectRatio;
      }
    }

    setCrop({
      x: width > 0 ? dragStart.x : x,
      y: height > 0 ? dragStart.y : y,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResizeWidthChange = (value: string) => {
    setResizeWidth(value);
    if (aspectRatio && value) {
      const width = parseInt(value);
      if (!isNaN(width)) {
        setResizeHeight(Math.round(width / aspectRatio).toString());
      }
    }
  };

  const handleResizeHeightChange = (value: string) => {
    setResizeHeight(value);
    if (aspectRatio && value) {
      const height = parseInt(value);
      if (!isNaN(height)) {
        setResizeWidth(Math.round(height * aspectRatio).toString());
      }
    }
  };

  const toggleAspectRatio = () => {
    if (aspectRatio) {
      setAspectRatio(null);
    } else {
      const width = parseInt(resizeWidth) || imageSize.width;
      const height = parseInt(resizeHeight) || imageSize.height;
      setAspectRatio(width / height);
    }
  };

  const handleSave = async () => {
    setProcessing(true);

    try {
      // Calculate actual pixel values based on display scale
      const img = imageRef.current;
      if (!img) return;

      const scaleX = imageSize.width / img.width;
      const scaleY = imageSize.height / img.height;

      const actualCrop = {
        x: crop.x * scaleX,
        y: crop.y * scaleY,
        width: crop.width * scaleX,
        height: crop.height * scaleY,
      };

      const requestBody: {
        imageUrl: string;
        crop?: typeof actualCrop;
        resize?: { width?: number; height?: number; fit?: string };
        rotation?: number;
      } = {
        imageUrl,
      };

      // Add crop if meaningful crop was made
      if (activeTab === 'crop' && crop.width > 10 && crop.height > 10) {
        requestBody.crop = actualCrop;
      }

      // Add resize if dimensions changed
      if (activeTab === 'resize') {
        const newWidth = parseInt(resizeWidth);
        const newHeight = parseInt(resizeHeight);

        if (!isNaN(newWidth) || !isNaN(newHeight)) {
          requestBody.resize = {
            width: !isNaN(newWidth) ? newWidth : undefined,
            height: !isNaN(newHeight) ? newHeight : undefined,
            fit: 'contain',
          };
        }
      }

      // Add rotation if rotated
      if (rotation !== 0) {
        requestBody.rotation = rotation;
      }

      const response = await fetch('/api/media/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to edit image');
      }

      const data = await response.json();
      onSave(data.url, data.width, data.height);
    } catch (error) {
      console.error('Error editing image:', error);
      alert('Failed to edit image');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Edit Image: {imageName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('crop')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'crop'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Crop
            </button>
            <button
              onClick={() => setActiveTab('resize')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'resize'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Resize
            </button>
            <button
              onClick={() => setActiveTab('rotate')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rotate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Rotate
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Image Preview */}
          <div ref={containerRef} className="mb-6 flex justify-center">
            <div
              className="relative inline-block max-w-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: activeTab === 'crop' ? 'crosshair' : 'default' }}
            >
              <img
                ref={imageRef}
                src={imageUrl}
                alt={imageName}
                className="max-w-full h-auto max-h-[400px]"
                style={{ transform: `rotate(${rotation}deg)` }}
              />

              {/* Crop overlay */}
              {activeTab === 'crop' && crop.width > 0 && crop.height > 0 && (
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10"
                  style={{
                    left: `${crop.x}px`,
                    top: `${crop.y}px`,
                    width: `${crop.width}px`,
                    height: `${crop.height}px`,
                  }}
                >
                  <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {Math.round(crop.width)} × {Math.round(crop.height)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-50 rounded-lg p-4">
            {activeTab === 'crop' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Click and drag on the image to select the crop area.
                </p>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCrop({ x: 0, y: 0, width: 0, height: 0 })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Reset Crop
                  </button>
                  <div className="text-sm text-gray-600">
                    Original: {imageSize.width} × {imageSize.height} px
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'resize' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={resizeWidth}
                      onChange={(e) => handleResizeWidthChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={resizeHeight}
                      onChange={(e) => handleResizeHeightChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      min="1"
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={toggleAspectRatio}
                    className={`flex items-center space-x-2 text-sm ${
                      aspectRatio ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${aspectRatio ? 'text-blue-600' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 11H6V9h2v2zm0-4H6V5h2v2zm4 4h-2V9h2v2zm0-4h-2V5h2v2z" />
                    </svg>
                    <span>Lock aspect ratio</span>
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Original: {imageSize.width} × {imageSize.height} px
                </p>
              </div>
            )}

            {activeTab === 'rotate' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setRotation((rotation - 90 + 360) % 360)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span>Rotate Left 90°</span>
                  </button>
                  <button
                    onClick={() => setRotation((rotation + 90) % 360)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
                    </svg>
                    <span>Rotate Right 90°</span>
                  </button>
                  <button
                    onClick={() => setRotation(0)}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Reset
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Current rotation: {rotation}°
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={processing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {processing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
