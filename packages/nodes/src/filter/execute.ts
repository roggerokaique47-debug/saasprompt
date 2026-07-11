import { NodeType, NodeExecutor } from '../types';

export const executeFilter: NodeExecutor = {
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
    }
};
