import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

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

export interface UploadOptions {
  file: File;
  type: 'image' | 'video' | 'document';
}

export interface UploadResult {
  success: boolean;
  filePath?: string;
  thumbnailPath?: string;
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
 * Generate unique filename
 */
export function generateFileName(originalName: string, extension?: string): string {
  const uuid = uuidv4();
  const ext = extension || path.extname(originalName).toLowerCase();
  return `${uuid}${ext}`;
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
 * Optimize and save image
 */
export async function processImage(buffer: Buffer, fileName: string): Promise<{
  filePath: string;
  thumbnailPath: string;
  width: number;
  height: number;
}> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
  const fullPath = path.join(uploadDir, fileName);
  const thumbnailName = fileName.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '-thumb.webp');
  const thumbnailPath = path.join(uploadDir, thumbnailName);

  // Get original dimensions
  const metadata = await sharp(buffer).metadata();
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  // Optimize and convert to WebP
  await sharp(buffer)
    .webp({ quality: 80 })
    .toFile(fullPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp'));

  // Generate thumbnail (300x300)
  await sharp(buffer)
    .resize(300, 300, { fit: 'cover' })
    .webp({ quality: 70 })
    .toFile(thumbnailPath);

  const finalPath = fullPath.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');

  return {
    filePath: finalPath,
    thumbnailPath,
    width,
    height,
  };
}

/**
 * Save video file
 */
export async function processVideo(buffer: Buffer, fileName: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  const fullPath = path.join(uploadDir, fileName);

  await fs.writeFile(fullPath, buffer);

  return fullPath;
}

/**
 * Save document file
 */
export async function processDocument(buffer: Buffer, fileName: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
  const fullPath = path.join(uploadDir, fileName);

  await fs.writeFile(fullPath, buffer);

  return fullPath;
}

/**
 * Convert file path to public URL
 */
export function getPublicUrl(filePath: string): string {
  const publicPath = filePath.split('/public')[1];
  return publicPath || filePath;
}

/**
 * Delete file from disk
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'public', filePath.replace(/^\//, ''));
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

/**
 * Delete multiple files from disk
 */
export async function deleteFiles(filePaths: string[]): Promise<{ success: boolean; deleted: number }> {
  let deleted = 0;

  for (const filePath of filePaths) {
    const success = await deleteFile(filePath);
    if (success) deleted++;
  }

  return { success: deleted === filePaths.length, deleted };
}

/**
 * Main upload handler
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

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique filename
    const fileName = generateFileName(file.name);

    let result: UploadResult;

    if (type === 'image') {
      const processed = await processImage(buffer, fileName);
      result = {
        success: true,
        filePath: processed.filePath,
        thumbnailPath: processed.thumbnailPath,
        url: getPublicUrl(processed.filePath),
        thumbnailUrl: getPublicUrl(processed.thumbnailPath),
        originalName: file.name,
        fileName: path.basename(processed.filePath),
        size: file.size,
        width: processed.width,
        height: processed.height,
      };
    } else if (type === 'video') {
      const filePath = await processVideo(buffer, fileName);
      result = {
        success: true,
        filePath,
        url: getPublicUrl(filePath),
        originalName: file.name,
        fileName: path.basename(filePath),
        size: file.size,
      };
    } else {
      const filePath = await processDocument(buffer, fileName);
      result = {
        success: true,
        filePath,
        url: getPublicUrl(filePath),
        originalName: file.name,
        fileName: path.basename(filePath),
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
