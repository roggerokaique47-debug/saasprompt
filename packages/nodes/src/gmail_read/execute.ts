import { NodeType, NodeExecutor } from '../types';
import { google } from 'googleapis';
import { getGoogleAuthClient } from '../utils/google-auth';

export const executeGmailRead: NodeExecutor = {
  type: NodeType.GMAIL_READ,
  async execute(config, input, context) {
    if (!context?.organizationId) {
      throw new Error('OrganizationId is required in context for Gmail Read node');
    }

    const auth = await getGoogleAuthClient(context.organizationId);
    const gmail = google.gmail({ version: 'v1', auth });

    const query = (config.query as string) || 'is:unread';
    const maxResults = (config.maxResults as number) || 10;

    const res = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });

    const messages = res.data.messages || [];
    
    const fullMessages = await Promise.all(
      messages.map(async (msg) => {
        if (!msg.id) return null;
        const msgDetail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
        });
        return {
          id: msgDetail.data.id,
          snippet: msgDetail.data.snippet,
          headers: msgDetail.data.payload?.headers,
        };
      })
    );

    return { messages: fullMessages.filter(Boolean) };
  }
};
