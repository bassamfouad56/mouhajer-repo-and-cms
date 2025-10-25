import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET export history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');

    console.log(`[Sheets History] Fetching export history (type: ${exportType || 'all'})...`);

    const where = exportType ? { exportType } : {};

    const exports = await prisma.sheetsExport.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    console.log(`[Sheets History] Found ${exports.length} exports`);

    return NextResponse.json({
      success: true,
      exports: exports.map((exp) => ({
        id: exp.id,
        title: exp.title,
        type: exp.exportType,
        spreadsheetId: exp.spreadsheetId,
        spreadsheetUrl: exp.spreadsheetUrl,
        recordCount: exp.rowCount,
        sharedWith: exp.sharedWith,
        exportedAt: exp.createdAt,
      })),
      total: exports.length,
    });
  } catch (error) {
    console.error('[Sheets History] Failed to fetch export history:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch export history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
