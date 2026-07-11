import { NodeType, NodeExecutor } from '../types';

export const executeMerge: NodeExecutor = {
  type: NodeType.MERGE,
  async execute(_config, input) {
      return { merged: true, data: input };
    }
};
