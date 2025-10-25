/**
 * Google Sheets API Integration
 *
 * Provides spreadsheet creation, data export, and automated reporting capabilities.
 * Uses the Google Sheets API v4.
 */

import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';

export interface SheetsCredentials {
  clientEmail: string;
  privateKey: string;
  projectId: string;
}

export interface SpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  sheets: Array<{
    sheetId: number;
    title: string;
    gridProperties: {
      rowCount: number;
      columnCount: number;
    };
  }>;
}

export interface SheetData {
  range: string; // e.g., "Sheet1!A1:D10"
  values: any[][];
}

export class GoogleSheetsService {
  private sheetsClient: sheets_v4.Sheets;
  private auth: JWT;

  constructor(credentials: SheetsCredentials) {
    this.auth = new JWT({
      email: credentials.clientEmail,
      key: credentials.privateKey.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });

    this.sheetsClient = google.sheets({ version: 'v4', auth: this.auth });
  }

  /**
   * Create a new spreadsheet
   */
  async createSpreadsheet(
    title: string,
    sheetTitles: string[] = ['Sheet1']
  ): Promise<SpreadsheetInfo> {
    try {
      console.log(`[Sheets] Creating spreadsheet: ${title}...`);

      const response = await this.sheetsClient.spreadsheets.create({
        requestBody: {
          properties: {
            title,
          },
          sheets: sheetTitles.map((sheetTitle) => ({
            properties: {
              title: sheetTitle,
            },
          })),
        },
      });

      const spreadsheet = response.data;

      console.log(`[Sheets] Spreadsheet created: ${spreadsheet.spreadsheetId}`);

      return {
        spreadsheetId: spreadsheet.spreadsheetId!,
        spreadsheetUrl: spreadsheet.spreadsheetUrl!,
        title: spreadsheet.properties?.title || title,
        sheets:
          spreadsheet.sheets?.map((sheet) => ({
            sheetId: sheet.properties?.sheetId || 0,
            title: sheet.properties?.title || '',
            gridProperties: {
              rowCount: sheet.properties?.gridProperties?.rowCount || 1000,
              columnCount: sheet.properties?.gridProperties?.columnCount || 26,
            },
          })) || [],
      };
    } catch (error) {
      console.error('[Sheets] Failed to create spreadsheet:', error);
      throw error;
    }
  }

  /**
   * Write data to a spreadsheet
   */
  async writeData(
    spreadsheetId: string,
    range: string,
    values: any[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ): Promise<void> {
    try {
      console.log(`[Sheets] Writing data to ${spreadsheetId} (${range})...`);

      await this.sheetsClient.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption,
        requestBody: {
          values,
        },
      });

      console.log(`[Sheets] Data written successfully`);
    } catch (error) {
      console.error('[Sheets] Failed to write data:', error);
      throw error;
    }
  }

  /**
   * Append data to a spreadsheet
   */
  async appendData(
    spreadsheetId: string,
    range: string,
    values: any[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'USER_ENTERED'
  ): Promise<void> {
    try {
      console.log(`[Sheets] Appending data to ${spreadsheetId} (${range})...`);

      await this.sheetsClient.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption,
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });

      console.log(`[Sheets] Data appended successfully`);
    } catch (error) {
      console.error('[Sheets] Failed to append data:', error);
      throw error;
    }
  }

  /**
   * Read data from a spreadsheet
   */
  async readData(spreadsheetId: string, range: string): Promise<any[][]> {
    try {
      console.log(`[Sheets] Reading data from ${spreadsheetId} (${range})...`);

      const response = await this.sheetsClient.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const values = response.data.values || [];

      console.log(`[Sheets] Read ${values.length} rows`);

      return values;
    } catch (error) {
      console.error('[Sheets] Failed to read data:', error);
      throw error;
    }
  }

  /**
   * Format spreadsheet headers
   */
  async formatHeaders(
    spreadsheetId: string,
    sheetId: number = 0,
    headerRowIndex: number = 0
  ): Promise<void> {
    try {
      console.log(`[Sheets] Formatting headers...`);

      await this.sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId,
                  startRowIndex: headerRowIndex,
                  endRowIndex: headerRowIndex + 1,
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: 0.2,
                      green: 0.4,
                      blue: 0.8,
                    },
                    textFormat: {
                      foregroundColor: {
                        red: 1,
                        green: 1,
                        blue: 1,
                      },
                      fontSize: 11,
                      bold: true,
                    },
                    horizontalAlignment: 'CENTER',
                  },
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
              },
            },
            {
              updateSheetProperties: {
                properties: {
                  sheetId,
                  gridProperties: {
                    frozenRowCount: headerRowIndex + 1,
                  },
                },
                fields: 'gridProperties.frozenRowCount',
              },
            },
          ],
        },
      });

      console.log(`[Sheets] Headers formatted successfully`);
    } catch (error) {
      console.error('[Sheets] Failed to format headers:', error);
      throw error;
    }
  }

  /**
   * Auto-resize columns
   */
  async autoResizeColumns(
    spreadsheetId: string,
    sheetId: number = 0,
    startColumnIndex: number = 0,
    endColumnIndex: number = 26
  ): Promise<void> {
    try {
      console.log(`[Sheets] Auto-resizing columns...`);

      await this.sheetsClient.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              autoResizeDimensions: {
                dimensions: {
                  sheetId,
                  dimension: 'COLUMNS',
                  startIndex: startColumnIndex,
                  endIndex: endColumnIndex,
                },
              },
            },
          ],
        },
      });

      console.log(`[Sheets] Columns resized successfully`);
    } catch (error) {
      console.error('[Sheets] Failed to resize columns:', error);
      throw error;
    }
  }

  /**
   * Share spreadsheet with email
   */
  async shareSpreadsheet(
    spreadsheetId: string,
    email: string,
    role: 'reader' | 'writer' | 'owner' = 'reader'
  ): Promise<void> {
    try {
      console.log(`[Sheets] Sharing spreadsheet with ${email}...`);

      const drive = google.drive({ version: 'v3', auth: this.auth });

      await drive.permissions.create({
        fileId: spreadsheetId,
        requestBody: {
          type: 'user',
          role,
          emailAddress: email,
        },
        sendNotificationEmail: true,
      });

      console.log(`[Sheets] Spreadsheet shared successfully`);
    } catch (error) {
      console.error('[Sheets] Failed to share spreadsheet:', error);
      throw error;
    }
  }

  /**
   * Create a formatted report spreadsheet
   */
  async createFormattedReport(
    title: string,
    headers: string[],
    data: any[][],
    sheetTitle: string = 'Report'
  ): Promise<SpreadsheetInfo> {
    try {
      // Create spreadsheet
      const spreadsheet = await this.createSpreadsheet(title, [sheetTitle]);

      // Write headers and data
      const values = [headers, ...data];
      await this.writeData(
        spreadsheet.spreadsheetId,
        `${sheetTitle}!A1`,
        values
      );

      // Format headers
      await this.formatHeaders(spreadsheet.spreadsheetId, spreadsheet.sheets[0].sheetId);

      // Auto-resize columns
      await this.autoResizeColumns(
        spreadsheet.spreadsheetId,
        spreadsheet.sheets[0].sheetId,
        0,
        headers.length
      );

      return spreadsheet;
    } catch (error) {
      console.error('[Sheets] Failed to create formatted report:', error);
      throw error;
    }
  }

  /**
   * Export PageSpeed data to sheet
   */
  async exportPageSpeedData(
    analyses: Array<{
      url: string;
      strategy: string;
      performanceScore: number;
      lcp: number | null;
      fid: number | null;
      cls: number | null;
      timestamp: string;
    }>
  ): Promise<SpreadsheetInfo> {
    const headers = [
      'URL',
      'Strategy',
      'Performance Score',
      'LCP (ms)',
      'FID (ms)',
      'CLS',
      'Timestamp',
    ];

    const data = analyses.map((a) => [
      a.url,
      a.strategy,
      a.performanceScore,
      a.lcp || 'N/A',
      a.fid || 'N/A',
      a.cls || 'N/A',
      new Date(a.timestamp).toLocaleString(),
    ]);

    return this.createFormattedReport(
      'PageSpeed Insights Report',
      headers,
      data,
      'Performance Data'
    );
  }

  /**
   * Export Google Trends data to sheet
   */
  async exportTrendsData(
    queries: Array<{
      keyword: string;
      geo: string | null;
      averageInterest: number;
      peakInterest: number;
      currentInterest: number;
      queriedAt: string;
    }>
  ): Promise<SpreadsheetInfo> {
    const headers = [
      'Keyword',
      'Region',
      'Average Interest',
      'Peak Interest',
      'Current Interest',
      'Query Date',
    ];

    const data = queries.map((q) => [
      q.keyword,
      q.geo || 'Worldwide',
      q.averageInterest,
      q.peakInterest,
      q.currentInterest,
      new Date(q.queriedAt).toLocaleString(),
    ]);

    return this.createFormattedReport(
      'Google Trends Report',
      headers,
      data,
      'Keyword Data'
    );
  }

  /**
   * Export Business Profile reviews to sheet
   */
  async exportReviewsData(
    reviews: Array<{
      reviewerName: string;
      starRating: number;
      comment: string | null;
      replyComment: string | null;
      createTime: string;
    }>
  ): Promise<SpreadsheetInfo> {
    const headers = [
      'Reviewer',
      'Rating',
      'Comment',
      'Reply',
      'Date',
    ];

    const data = reviews.map((r) => [
      r.reviewerName,
      r.starRating,
      r.comment || '',
      r.replyComment || '',
      new Date(r.createTime).toLocaleString(),
    ]);

    return this.createFormattedReport(
      'Google Reviews Report',
      headers,
      data,
      'Reviews'
    );
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try to create and delete a test spreadsheet
      const test = await this.createSpreadsheet('Connection Test');

      // Delete it (via Drive API)
      const drive = google.drive({ version: 'v3', auth: this.auth });
      await drive.files.delete({ fileId: test.spreadsheetId });

      return true;
    } catch (error) {
      console.error('[Sheets] Connection test failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create Sheets service from environment
 */
export async function createSheetsService(): Promise<GoogleSheetsService> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const projectId = process.env.GOOGLE_SHEETS_PROJECT_ID;

  if (!clientEmail || !privateKey || !projectId) {
    throw new Error('Google Sheets credentials not configured in environment');
  }

  return new GoogleSheetsService({
    clientEmail,
    privateKey,
    projectId,
  });
}
