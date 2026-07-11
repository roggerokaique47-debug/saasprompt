import { NodeType, NodeExecutor } from '../types';
import { google } from 'googleapis';
import { getGoogleAuthClient } from '../utils/google-auth';

export const executeGmailSend: NodeExecutor = {
  type: NodeType.GMAIL_SEND,
  async execute(config, input, context) {
    if (!context?.organizationId) {
      throw new Error('OrganizationId is required in context for Gmail Send node');
    }

    const auth = await getGoogleAuthClient(context.organizationId);
    const gmail = google.gmail({ version: 'v1', auth });

    const to = (config.to as string) || '';
    const subject = (config.subject as string) || '';
    const bodyText = (config.body as string) || (typeof input === 'string' ? input : JSON.stringify(input));

    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      bodyText
    ];
    
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return { sent: true, messageId: res.data.id };
  }
};
