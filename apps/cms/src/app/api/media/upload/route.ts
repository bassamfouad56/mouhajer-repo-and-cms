import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadFile, getFileType } from '@/lib/blob-upload';
import { auth } from '@/lib/auth';

/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload media file
 *     description: Upload an image or other media file to Vercel Blob storage (Admin only)
 *     tags: [Media]
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Media'
 *       400:
 *         description: Bad request (no file provided or upload failed)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload and process file
    const uploadResult = await uploadFile(file);

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 400 }
      );
    }

    // Determine file type
    const type = getFileType(file.type);

    // Save to database
    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename: uploadResult.fileName || file.name,
        originalName: uploadResult.originalName || file.name,
        url: uploadResult.url || '',
        thumbnailUrl: uploadResult.thumbnailUrl || null,
        mimeType: file.type || 'application/octet-stream',
        type,
        size: uploadResult.size || file.size,
        width: uploadResult.width || null,
        height: uploadResult.height || null,
      },
    });

    return NextResponse.json(mediaFile, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Handle multiple file uploads
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadedFiles = [];
    const errors = [];

    for (const file of files) {
      const uploadResult = await uploadFile(file);

      if (uploadResult.success) {
        const type = getFileType(file.type);

        const mediaFile = await prisma.mediaFile.create({
          data: {
            filename: uploadResult.fileName || file.name,
            originalName: uploadResult.originalName || file.name,
            url: uploadResult.url || '',
            thumbnailUrl: uploadResult.thumbnailUrl || null,
            mimeType: file.type || 'application/octet-stream',
            type,
            size: uploadResult.size || file.size,
            width: uploadResult.width || null,
            height: uploadResult.height || null,
          },
        });

        uploadedFiles.push(mediaFile);
      } else {
        errors.push({
          fileName: file.name,
          error: uploadResult.error,
        });
      }
    }

    return NextResponse.json({
      success: true,
      uploaded: uploadedFiles.length,
      total: files.length,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}
