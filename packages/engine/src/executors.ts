import { NodeType, NodeExecutor } from './nodes';
import { callChatCompletion } from './ai-provider';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const executors: Record<NodeType, NodeExecutor> = {
  [NodeType.WEBHOOK]: {
    type: NodeType.WEBHOOK,
    async execute(config) {
      return { received: true, method: config.method || 'POST', data: config.body || {} };
    },
  },

  [NodeType.SCHEDULE]: {
    type: NodeType.SCHEDULE,
    async execute(config) {
      return { triggered: true, cron: config.cron || '* * * * *', nextRun: new Date().toISOString() };
    },
  },

  [NodeType.HTTP_REQUEST]: {
    type: NodeType.HTTP_REQUEST,
    async execute(config, input) {
      const url = config.url as string;
      if (!url) throw new Error('URL is required for HTTP Request node');
      const method = (config.method as string) || 'GET';
      const body = config.body ? JSON.parse(config.body as string) : input;
      const headers = (config.headers as Record<string, string>) || { 'Content-Type': 'application/json' };

      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' ? JSON.stringify(body) : undefined,
      });

      return { status: response.status, data: await response.json() };
    },
  },

  [NodeType.OPENAI]: {
    type: NodeType.OPENAI,
    async execute(config, input) {
      const prompt = (config.prompt as string) || (typeof input === 'string' ? input : JSON.stringify(input)) || '';
      const model = config.model as string;

      const result = await callChatCompletion(
        [{ role: 'user', content: prompt }],
        model ? { model } : undefined,
      );

      return {
        model: result.model,
        provider: result.provider,
        prompt,
        response: result.content,
        usage: result.usage,
      };
    },
  },

  [NodeType.GMAIL_SEND]: {
    type: NodeType.GMAIL_SEND,
    async execute(config, input) {
      const to = (config.to as string) || '';
      const subject = (config.subject as string) || '';
      const body = (config.body as string) || typeof input === 'string' ? input : '';
      return { sent: true, to, subject, messageId: `msg_${Date.now()}` };
    },
  },

  [NodeType.GMAIL_READ]: {
    type: NodeType.GMAIL_READ,
    async execute(config) {
      const maxResults = (config.maxResults as number) || 10;
      return { messages: [], total: 0, maxResults };
    },
  },

  [NodeType.GOOGLE_SHEETS_READ]: {
    type: NodeType.GOOGLE_SHEETS_READ,
    async execute(config) {
      const spreadsheetId = config.spreadsheetId as string;
      const range = (config.range as string) || 'A1:Z100';
      return { spreadsheetId, range, rows: [], totalRows: 0 };
    },
  },

  [NodeType.GOOGLE_SHEETS_WRITE]: {
    type: NodeType.GOOGLE_SHEETS_WRITE,
    async execute(config, input) {
      const spreadsheetId = config.spreadsheetId as string;
      const range = (config.range as string) || 'A1';
      return { spreadsheetId, range, updated: true, data: input };
    },
  },

  [NodeType.WHATSAPP_SEND]: {
    type: NodeType.WHATSAPP_SEND,
    async execute(config, input, context) {
      const to = (config.to as string) || '';
      const message = (config.message as string) || typeof input === 'string' ? input : '';
      
      const session = context?.userId ? `session_${context.userId}` : 'default';

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
    },
  },

  [NodeType.FILTER]: {
    type: NodeType.FILTER,
    async execute(config, input) {
      const condition = config.condition as string;
      const field = config.field as string;
      const value = config.value as string;
      const data = input as Record<string, unknown>;

      if (!condition || !field) return { passed: true, data: input };

      const actualValue = data[field];
      let passed = false;

      switch (condition) {
        case 'equals': passed = actualValue === value; break;
        case 'contains': passed = String(actualValue).includes(value || ''); break;
        case 'greater_than': passed = Number(actualValue) > Number(value); break;
        case 'less_than': passed = Number(actualValue) < Number(value); break;
        case 'exists': passed = actualValue !== undefined && actualValue !== null; break;
        default: passed = true;
      }

      return { passed, data: passed ? input : null };
    },
  },

  [NodeType.MERGE]: {
    type: NodeType.MERGE,
    async execute(_config, input) {
      return { merged: true, data: input };
    },
  },

  [NodeType.CODE]: {
    type: NodeType.CODE,
    async execute(config, input) {
      const code = config.code as string;
      if (!code) return { result: input };

      try {
        const fn = new Function('input', code);
        const result = await fn(input);
        return { result };
      } catch (error) {
        throw new Error(`Code execution error: ${(error as Error).message}`);
      }
    },
  },

  [NodeType.DELAY]: {
    type: NodeType.DELAY,
    async execute(config) {
      const ms = (config.durationMs as number) || 1000;
      await delay(ms);
      return { delayed: true, durationMs: ms };
    },
  },

  [NodeType.SWITCH]: {
    type: NodeType.SWITCH,
    async execute(config, input) {
      const field = config.field as string;
      const cases = (config.cases as Record<string, string>) || {};
      const data = input as Record<string, unknown>;
      const value = String(data[field] || '');
      const matchedCase = cases[value] || config.defaultCase || 'default';
      return { matchedCase, value, data: input };
    },
  },

  [NodeType.SLACK_SEND]: {
    type: NodeType.SLACK_SEND,
    async execute(config, input) {
      const webhookUrl = config.webhookUrl as string;
      const message = (config.message as string) || typeof input === 'string' ? input : 'Notification from NovaFlow';
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: message }),
        });
      }
      return { sent: true, channel: config.channel || 'general', message };
    },
  },

  [NodeType.DISCORD_SEND]: {
    type: NodeType.DISCORD_SEND,
    async execute(config, input) {
      const webhookUrl = config.webhookUrl as string;
      const message = (config.message as string) || typeof input === 'string' ? input : 'Notification from NovaFlow';
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: message }),
        });
      }
      return { sent: true, message };
    },
  },

  [NodeType.EMAIL_SMTP]: {
    type: NodeType.EMAIL_SMTP,
    async execute(config, input) {
      const to = (config.to as string) || '';
      const subject = (config.subject as string) || 'NovaFlow Notification';
      const body = (config.body as string) || typeof input === 'string' ? input : '';
      return { sent: true, to, subject, messageId: `email_${Date.now()}` };
    },
  },
};
