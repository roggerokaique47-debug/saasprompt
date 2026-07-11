import { NodeType, NodeExecutor } from '../types';

export const executeDiscordSend: NodeExecutor = {
  type: NodeType.DISCORD_SEND,
  async execute(config, input, context) {
    if (!context?.organizationId) {
      throw new Error('OrganizationId not provided in context');
    }

    const webhookUrl = config.webhookUrl as string;

    if (!webhookUrl) {
      throw new Error('Discord Webhook URL is missing');
    }

    // Message can come from config or from pipeline input
    const message = (config.message as string) || (typeof input === 'string' ? input : JSON.stringify(input)) || 'Notification from NovaFlow';

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });

    if (!res.ok) {
      throw new Error(`Discord Webhook error: ${res.status} ${res.statusText}`);
    }

    return { sent: true, message };
  }
};

