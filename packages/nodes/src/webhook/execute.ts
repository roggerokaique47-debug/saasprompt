import { NodeType, NodeExecutor } from '../types';

export const executeWebhook: NodeExecutor = {
  type: NodeType.WEBHOOK,
  async execute(config, input, context) {
      const data = context?.payload || config.body || {};
      return { received: true, method: config.method || 'POST', data };
    }
};
