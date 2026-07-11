import { NodeType, NodeExecutor } from '../types';

export const executeEmailSmtp: NodeExecutor = {
  type: NodeType.EMAIL_SMTP,
  async execute(config, input) {
      const to = (config.to as string) || '';
      const subject = (config.subject as string) || 'NovaFlow Notification';
      const body = (config.body as string) || typeof input === 'string' ? input : '';
      return { sent: true, to, subject, messageId: `email_${Date.now()}` };
    }
};
