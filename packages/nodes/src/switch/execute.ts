import { NodeType, NodeExecutor } from '../types';

export const executeSwitch: NodeExecutor = {
  type: NodeType.SWITCH,
  async execute(config, input) {
      const field = config.field as string;
      const cases = (config.cases as Record<string, string>) || {};
      const data = input as Record<string, unknown>;
      const value = String(data[field] || '');
      const matchedCase = cases[value] || config.defaultCase || 'default';
      return { matchedCase, value, data: input };
    }
};
