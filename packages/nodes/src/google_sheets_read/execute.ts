import { NodeType, NodeExecutor } from '../types';
import { google } from 'googleapis';
import { getGoogleAuthClient } from '../utils/google-auth';

export const executeGoogleSheetsRead: NodeExecutor = {
  type: NodeType.GOOGLE_SHEETS_READ,
  async execute(config, input, context) {
    if (!context?.organizationId) {
      throw new Error('OrganizationId is required in context for Google Sheets Read node');
    }

    const auth = await getGoogleAuthClient(context.organizationId);
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = (config.spreadsheetId as string) || '';
    const range = (config.range as string) || 'Sheet1!A1:Z1000';

    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID is required');
    }

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return { rows: res.data.values || [] };
  }
};
