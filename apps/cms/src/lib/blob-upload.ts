import { put, del } from '@vercel/blob';
import sharp from 'sharp';

// File type configurations
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  document: 5 * 1024 * 1024, // 5MB
};

export interface UploadResult {
  success: boolean;
  url?: string;
  thumbnailUrl?: string;
  originalName?: string;
  fileName?: string;
  size?: number;
  width?: number;
  height?: number;
  error?: string;
}

/**
 * Get file type from MIME type
 */
export function getFileType(mimeType: string): 'image' | 'video' | 'document' {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return 'document';
}

/**
 * Validate file type and size
 */
export async function validateFile(file: File, type: 'image' | 'video' | 'document'): Promise<{ valid: boolean; error?: string }> {
  // Check file type
  const allowedTypes = ALLOWED_FILE_TYPES[type];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types for ${type}: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  const maxSize = MAX_FILE_SIZES[type];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size for ${type}: ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  return { valid: true };
}

/**
 * Process and upload image to Vercel Blob
 */
async function processAndUploadImage(file: File): Promise<{
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
}> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Get original dimensions
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Optimize and convert to WebP for main image
  const optimizedBuffer = await sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer();

  // Generate thumbnail (300x300)
  const thumbnailBuffer = await sharp(buffer)
    .resize(300, 300, { fit: 'cover' })
    .webp({ quality: 70 })
    .toBuffer();

  // Upload main image to Vercel Blob
  const mainBlob = await put(
    `images/${Date.now()}-${file.name.replace(/\.[^.]+$/, '.webp')}`,
    optimizedBuffer,
    {
      access: 'public',
      contentType: 'image/webp',
    }
  );

  // Upload thumbnail to Vercel Blob
  const thumbnailBlob = await put(
    `images/thumbs/${Date.now()}-thumb-${file.name.replace(/\.[^.]+$/, '.webp')}`,
    thumbnailBuffer,
    {
      access: 'public',
      contentType: 'image/webp',
    }
  );

  return {
    url: mainBlob.url,
    thumbnailUrl: thumbnailBlob.url,
    width,
    height,
  };
}

/**
 * Upload video to Vercel Blob
 */
async function uploadVideo(file: File): Promise<string> {
  const blob = await put(
    `videos/${Date.now()}-${file.name}`,
    file,
    {
      access: 'public',
      contentType: file.type,
    }
  );

  return blob.url;
}

/**
 * Upload document to Vercel Blob
 */
async function uploadDocument(file: File): Promise<string> {
  const blob = await put(
    `documents/${Date.now()}-${file.name}`,
    file,
    {
      access: 'public',
      contentType: file.type,
    }
  );

  return blob.url;
}

/**
 * Delete file from Vercel Blob
 */
export async function deleteFile(url: string): Promise<boolean> {
  try {
    await del(url);
    return true;
  } catch (error) {
    console.error('Error deleting file from Vercel Blob:', error);
    return false;
  }
}

/**
 * Delete multiple files from Vercel Blob
 */
export async function deleteFiles(urls: string[]): Promise<{ success: boolean; deleted: number }> {
  let deleted = 0;

  for (const url of urls) {
    const success = await deleteFile(url);
    if (success) deleted++;
  }

  return { success: deleted === urls.length, deleted };
}

/**
 * Main upload handler for Vercel Blob
 */
export async function uploadFile(file: File): Promise<UploadResult> {
  try {
    // Determine file type
    const type = getFileType(file.type);

    // Validate file
    const validation = await validateFile(file, type);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    let result: UploadResult;

    if (type === 'image') {
      const processed = await processAndUploadImage(file);
      result = {
        success: true,
        url: processed.url,
        thumbnailUrl: processed.thumbnailUrl,
        originalName: file.name,
        fileName: file.name,
        size: file.size,
        width: processed.width,
        height: processed.height,
      };
    } else if (type === 'video') {
      const url = await uploadVideo(file);
      result = {
        success: true,
        url,
        originalName: file.name,
        fileName: file.name,
        size: file.size,
      };
    } else {
      const url = await uploadDocument(file);
      result = {
        success: true,
        url,
        originalName: file.name,
        fileName: file.name,
        size: file.size,
      };
    }

    return result;
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
