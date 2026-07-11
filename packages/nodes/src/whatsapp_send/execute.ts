import { NodeType, NodeExecutor } from '../types';

export const executeWhatsappSend: NodeExecutor = {
  type: NodeType.WHATSAPP_SEND,
  async execute(config, input, context) {
      if (!context?.organizationId) {
        throw new Error('OrganizationId not provided in context');
      }

      const to = (config.to as string) || '';
      const message = (config.message as string) || typeof input === 'string' ? input : '';
      
      const session = `session_${context.organizationId}`;

      try {
        const res = await fetch('http://localhost:3002/api/sendText', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            chatId: `${to}@c.us`,
            text: message,
            session,
          }),
        });

        if (!res.ok) {
          throw new Error(`WAHA HTTP ${res.status}: ${res.statusText}`);
        }
      } catch (err) {
        console.error('Erro enviando mensagem WAHA:', err);
        throw new Error('Falha ao enviar WhatsApp via WAHA');
      }

      return { sent: true, to, session, messageId: `wa_${Date.now()}` };
    }
};
