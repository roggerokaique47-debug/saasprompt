import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'novaflow-ai',
  name: 'NovaFlow AI',
  eventKey: process.env.INNGEST_EVENT_KEY,
});

export type NovaFlowEvents = {
  'workflow/execute': {
    data: {
      workflowId: string;
      userId: string;
      executionId: string;
      trigger: string;
      workflowJson: Record<string, unknown>;
    };
  };
};
