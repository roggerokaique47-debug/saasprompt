import { NodeType, NodeExecutor } from '../types';
import { google } from 'googleapis';
import { getGoogleAuthClient } from '../utils/google-auth';

export const executeGoogleSheetsWrite: NodeExecutor = {
  type: NodeType.GOOGLE_SHEETS_WRITE,
  async execute(config, input, context) {
    if (!context?.organizationId) {
      throw new Error('OrganizationId is required in context for Google Sheets Write node');
    }

    const auth = await getGoogleAuthClient(context.organizationId);
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = (config.spreadsheetId as string) || '';
    const range = (config.range as string) || 'Sheet1!A1';
    const valueInputOption = (config.valueInputOption as string) || 'USER_ENTERED';
    const insertDataOption = (config.insertDataOption as string) || 'INSERT_ROWS';
    
    // Values to append. E.g. [["John", "Doe"]]
    let values: any[][] = [];
    if (config.values && Array.isArray(config.values)) {
      values = config.values as any[][];
    } else if (input && Array.isArray(input)) {
      values = input as any[][];
    } else {
      values = [[input]]; // Wrap scalar in 2D array
    }

    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID is required');
    }

    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      insertDataOption,
      requestBody: {
        values,
      },
    });

    return { updatedRange: res.data.updates?.updatedRange };
  }
};
