import { NodeType, NodeExecutor } from '../types';
import db from '@prompthub/database/src/client';
import { credentials } from '@prompthub/database/src/schema/credentials';
import { eq, and } from 'drizzle-orm';
import { decryptText } from '@prompthub/shared';

export const executeSlackSend: NodeExecutor = {
  type: NodeType.SLACK_SEND,
  async execute(config, input, context) {
      if (!context?.organizationId) {
        throw new Error('OrganizationId not provided in context');
      }

      const channel = config.channel as string;
      const message = (config.message as string) || typeof input === 'string' ? input : 'Notification from NovaFlow';

      if (!channel) {
        throw new Error('Slack channel is missing');
      }

      // Buscar credencial do Slack no banco
      const existing = await db
        .select()
        .from(credentials)
        .where(and(eq(credentials.organizationId, context.organizationId), eq(credentials.provider, 'slack')))
        .limit(1);

      if (existing.length === 0 || !existing[0].accessToken) {
        throw new Error('Slack integration not found or disconnected');
      }

      const accessToken = decryptText(existing[0].accessToken);
      
      if (!accessToken) {
        throw new Error('Access token missing in Slack credentials');
      }

      const res = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
          channel: channel,
          text: message 
        }),
      });

      const responseData = await res.json();
      
      if (!responseData.ok) {
        throw new Error(`Slack API error: ${responseData.error}`);
      }

      return { sent: true, channel, message, ts: responseData.ts };
    }
};

