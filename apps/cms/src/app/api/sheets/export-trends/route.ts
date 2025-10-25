import { NextRequest, NextResponse } from 'next/server';
import { createSheetsService } from '@/lib/google-sheets';
import { prisma } from '@/lib/prisma';

// POST export Google Trends data to Google Sheets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { days = 30, shareEmail } = body;

    console.log(`[Sheets Export] Exporting Trends data from last ${days} days...`);

    // Get Trends queries from database
    const queries = await prisma.trendsQuery.findMany({
      where: {
        queriedAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: {
        queriedAt: 'desc',
      },
      select: {
        keyword: true,
        geo: true,
        averageInterest: true,
        peakInterest: true,
        currentInterest: true,
        queriedAt: true,
      },
    });

    if (queries.length === 0) {
      return NextResponse.json(
        { error: 'No Trends data available for the specified period' },
        { status: 404 }
      );
    }

    console.log(`[Sheets Export] Found ${queries.length} queries to export`);

    // Create Sheets service
    const service = await createSheetsService();

    // Export to Google Sheets
    const spreadsheet = await service.exportTrendsData(
      queries.map((q) => ({
        keyword: q.keyword,
        geo: q.geo,
        averageInterest: q.averageInterest,
        peakInterest: q.peakInterest,
        currentInterest: q.currentInterest,
        queriedAt: q.queriedAt.toISOString(),
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
        exportType: 'trends',
        spreadsheetId: spreadsheet.spreadsheetId,
        spreadsheetUrl: spreadsheet.spreadsheetUrl,
        rowCount: queries.length,
        sheetNames: spreadsheet.sheets.map((s) => s.title),
        sharedWith: shareEmail ? [shareEmail] : [],
      },
    });

    console.log(`[Sheets Export] Export complete: ${spreadsheet.spreadsheetUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Trends data exported successfully',
      spreadsheet: {
        id: spreadsheet.spreadsheetId,
        url: spreadsheet.spreadsheetUrl,
        title: spreadsheet.title,
        recordCount: queries.length,
      },
    });
  } catch (error) {
    console.error('[Sheets Export] Failed to export Trends data:', error);

    return NextResponse.json(
      {
        error: 'Failed to export Trends data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
