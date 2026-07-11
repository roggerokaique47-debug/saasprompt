import { NodeType, NodeExecutor } from '../types';

export const executeSchedule: NodeExecutor = {
  type: NodeType.SCHEDULE,
  async execute(config) {
      return { triggered: true, cron: config.cron || '* * * * *', nextRun: new Date().toISOString() };
    }
};
