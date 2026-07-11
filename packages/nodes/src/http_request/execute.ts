import { NodeType, NodeExecutor } from '../types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const executeHttpRequest: NodeExecutor = {
  type: NodeType.HTTP_REQUEST,
  async execute(config, input) {
    const url = config.url as string;
    if (!url) throw new Error('URL is required for HTTP Request node');
    const method = (config.method as string) || 'GET';
    const body = config.body ? JSON.parse(config.body as string) : input;
    const headers = (config.headers as Record<string, string>) || { 'Content-Type': 'application/json' };

    const fetchWithRetry = async (retries = 3, delayMs = 2000): Promise<Response> => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url, {
            method,
            headers,
            body: method !== 'GET' ? JSON.stringify(body) : undefined,
          });
          if (res.ok) return res;
          if (i === retries - 1) return res;
          console.warn(`HTTP Request failed, retrying (${i + 1}/${retries})...`);
          await delay(delayMs);
        } catch (error) {
          if (i === retries - 1) throw error;
          console.warn(`HTTP Request error, retrying (${i + 1}/${retries})...`);
          await delay(delayMs);
        }
      }
      throw new Error('Unreachable');
    };

    const response = await fetchWithRetry();
    
    let data = null;
    try {
      data = await response.json();
    } catch (e) {
      data = await response.text();
    }

    return { status: response.status, data };
  },
};
