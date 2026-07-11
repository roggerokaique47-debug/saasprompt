import { NodeType, NodeExecutor } from '../types';
import { google } from 'googleapis';
import { getGoogleAuthClient } from '../utils/google-auth';
import { Readable } from 'stream';

export const executeGoogleDriveUpload: NodeExecutor = {
  type: NodeType.GOOGLE_DRIVE_UPLOAD,
  async execute(config, input, context) {
    if (!context?.userId) {
      throw new Error('UserId is required in context for Google Drive Upload node');
    }

    const auth = await getGoogleAuthClient(context.userId);
    const drive = google.drive({ version: 'v3', auth });

    const fileName = (config.fileName as string) || `upload_${Date.now()}.txt`;
    const mimeType = (config.mimeType as string) || 'text/plain';
    const folderId = (config.folderId as string);

    let fileContent = '';
    if (typeof input === 'string') {
      fileContent = input;
    } else {
      fileContent = JSON.stringify(input);
    }

    // Convert string to a readable stream for the upload
    const stream = new Readable();
    stream.push(fileContent);
    stream.push(null);

    const fileMetadata: any = {
      name: fileName,
    };

    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    const media = {
      mimeType,
      body: stream,
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, webContentLink',
    });

    return { 
      fileId: res.data.id, 
      webViewLink: res.data.webViewLink,
      webContentLink: res.data.webContentLink
    };
  }
};
