import { NextRequest, NextResponse } from 'next/server';
import { createSheetsService } from '@/lib/google-sheets';
import { prisma } from '@/lib/prisma';

// POST export PageSpeed data to Google Sheets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { days = 30, shareEmail } = body;

    console.log(`[Sheets Export] Exporting PageSpeed data from last ${days} days...`);

    // Get PageSpeed analyses from database
    const analyses = await prisma.pageSpeedAnalysis.findMany({
      where: {
        timestamp: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      select: {
        url: true,
        strategy: true,
        performanceScore: true,
        lcp: true,
        fid: true,
        cls: true,
        timestamp: true,
      },
    });

    if (analyses.length === 0) {
      return NextResponse.json(
        { error: 'No PageSpeed data available for the specified period' },
        { status: 404 }
      );
    }

    console.log(`[Sheets Export] Found ${analyses.length} analyses to export`);

    // Create Sheets service
    const service = await createSheetsService();

    // Export to Google Sheets
    const spreadsheet = await service.exportPageSpeedData(
      analyses.map((a) => ({
        url: a.url,
        strategy: a.strategy,
        performanceScore: a.performanceScore,
        lcp: a.lcp,
        fid: a.fid,
        cls: a.cls,
        timestamp: a.timestamp.toISOString(),
      }))
    );

    // Share with email if provided
    if (shareEmail) {
      await service.shareSpreadsheet(spreadsheet.spreadsheetId, shareEmail, 'writer');
    }

    // Save export record
    await prisma.sheetsExport.create({
      data: {
        title: spreadsheet.title,
        exportType: 'pagespeed',
        spreadsheetId: spreadsheet.spreadsheetId,
        spreadsheetUrl: spreadsheet.spreadsheetUrl,
        rowCount: analyses.length,
        sheetNames: spreadsheet.sheets.map((s) => s.title),
        sharedWith: shareEmail ? [shareEmail] : [],
      },
    });

    console.log(`[Sheets Export] Export complete: ${spreadsheet.spreadsheetUrl}`);

    return NextResponse.json({
      success: true,
      message: 'PageSpeed data exported successfully',
      spreadsheet: {
        id: spreadsheet.spreadsheetId,
        url: spreadsheet.spreadsheetUrl,
        title: spreadsheet.title,
        recordCount: analyses.length,
      },
    });
  } catch (error) {
    console.error('[Sheets Export] Failed to export PageSpeed data:', error);

    return NextResponse.json(
      {
        error: 'Failed to export PageSpeed data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
