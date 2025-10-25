import { NextRequest, NextResponse } from 'next/server';
import { createSheetsService } from '@/lib/google-sheets';

// POST test Google Sheets connection
export async function POST(request: NextRequest) {
  try {
    console.log('[Sheets Test] Testing Google Sheets connection...');

    const service = await createSheetsService();
    const isConnected = await service.testConnection();

    if (isConnected) {
      console.log('[Sheets Test] Connection successful');
      return NextResponse.json({
        success: true,
        message: 'Google Sheets connection is working',
      });
    } else {
      console.log('[Sheets Test] Connection failed');
      return NextResponse.json(
        {
          error: 'Connection test failed',
          message: 'Could not connect to Google Sheets API',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Sheets Test] Connection test error:', error);

    return NextResponse.json(
      {
        error: 'Connection test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
