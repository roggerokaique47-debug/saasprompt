import { NodeType, NodeExecutor } from '../types';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const executeDelay: NodeExecutor = {
  type: NodeType.DELAY,
  async execute(config) {
      const ms = (config.durationMs as number) || 1000;
      await delay(ms);
      return { delayed: true, durationMs: ms };
    }
};
