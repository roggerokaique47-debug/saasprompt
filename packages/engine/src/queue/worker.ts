import { Worker, Job } from 'bullmq';
import { connection } from './connection';
import { executeWorkflow } from '../engine';

const QUEUE_NAME = 'workflow-executions';

export interface WorkflowJobData {
  executionId: string;
  organizationId: string;
  userId?: string;
  workflowId: string;
  version: number;
  triggerData: unknown;
  traceId: string;
  correlationId: string;
  requestId: string;
  workflow: any; // O JSON completo do workflow a ser executado
}

// Inicializa o Worker do BullMQ
export const workflowWorker = new Worker<WorkflowJobData, any, string>(
  QUEUE_NAME,
  async (job: Job<WorkflowJobData>) => {
    const { data } = job;
    
    console.log(`[Worker] Started Execution: ${data.executionId} (Trace: ${data.traceId})`);

    // Atualiza progresso do heartbeat (útil para tracking de timeout/stalled jobs)
    await job.updateProgress(10);

    const context = {
      traceId: data.traceId,
      correlationId: data.correlationId,
      requestId: data.requestId,
      executionId: data.executionId,
      organizationId: data.organizationId,
      userId: data.userId,
      onNodeStart: async (update: any) => {
        // Envia progresso via BullMQ
        await job.log(`[NodeStart] ${update.nodeId}`);
      },
      onNodeComplete: async (update: any) => {
        await job.log(`[NodeComplete] ${update.nodeId} - status: ${update.status}`);
      }
    };

    // Executa o workflow
    // Aqui injetamos o context recém-criado
    const result = await executeWorkflow(data.workflow, context);

    await job.updateProgress(100);
    
    if (!result.success) {
      throw new Error(`Workflow execution failed for ${data.executionId}`);
    }
    
    return result;
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    }
  }
);

workflowWorker.on('completed', (job) => {
  console.log(`[Worker] Job Completed: ${job.id}`);
});

workflowWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job Failed: ${job?.id} with error ${err.message}`);
});

workflowWorker.on('error', (err) => {
  console.error(`[Worker] Error:`, err);
});
