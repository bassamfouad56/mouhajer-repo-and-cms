import { NextRequest, NextResponse } from 'next/server';
import { createSheetsService } from '@/lib/google-sheets';
import { prisma } from '@/lib/prisma';

// POST export Google Business Profile reviews to Google Sheets
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, days = 30, shareEmail } = body;

    console.log(`[Sheets Export] Exporting reviews from last ${days} days...`);

    // Build where clause
    const where: any = {
      createTime: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      },
    };

    if (accountId) {
      where.accountId = accountId;
    }

    // Get reviews from database
    const reviews = await prisma.gBPReview.findMany({
      where,
      orderBy: {
        createTime: 'desc',
      },
      select: {
        reviewerName: true,
        starRating: true,
        comment: true,
        replyComment: true,
        createTime: true,
      },
    });

    if (reviews.length === 0) {
      return NextResponse.json(
        { error: 'No reviews available for the specified period' },
        { status: 404 }
      );
    }

    console.log(`[Sheets Export] Found ${reviews.length} reviews to export`);

    // Create Sheets service
    const service = await createSheetsService();

    // Export to Google Sheets
    const spreadsheet = await service.exportReviewsData(
      reviews.map((r) => ({
        reviewerName: r.reviewerName,
        starRating: r.starRating,
        comment: r.comment,
        replyComment: r.replyComment,
        createTime: r.createTime.toISOString(),
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
        exportType: 'reviews',
        spreadsheetId: spreadsheet.spreadsheetId,
        spreadsheetUrl: spreadsheet.spreadsheetUrl,
        rowCount: reviews.length,
        sheetNames: spreadsheet.sheets.map((s) => s.title),
        sharedWith: shareEmail ? [shareEmail] : [],
      },
    });

    console.log(`[Sheets Export] Export complete: ${spreadsheet.spreadsheetUrl}`);

    return NextResponse.json({
      success: true,
      message: 'Reviews exported successfully',
      spreadsheet: {
        id: spreadsheet.spreadsheetId,
        url: spreadsheet.spreadsheetUrl,
        title: spreadsheet.title,
        recordCount: reviews.length,
      },
    });
  } catch (error) {
    console.error('[Sheets Export] Failed to export reviews:', error);

    return NextResponse.json(
      {
        error: 'Failed to export reviews',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
