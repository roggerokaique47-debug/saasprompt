import { inngest } from './client';
import { executeWorkflow } from '@prompthub/engine';
import type { WorkflowDefinition, ExecutionStepUpdate } from '@prompthub/engine';

const NEXT_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const INTERNAL_KEY = process.env.INTERNAL_API_KEY || 'dev-key';

async function updateExecution(executionId: string, data: Record<string, unknown>) {
  await fetch(`${NEXT_URL}/api/executions/${executionId}/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-key': INTERNAL_KEY },
    body: JSON.stringify(data),
  });
}

async function upsertStep(executionId: string, step: ExecutionStepUpdate) {
  await fetch(`${NEXT_URL}/api/executions/${executionId}/steps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-key': INTERNAL_KEY },
    body: JSON.stringify(step),
  });
}

export const executeWorkflowFn = inngest.createFunction(
  {
    id: 'execute-workflow',
    name: 'Executar Workflow',
    retries: 3,
    timeouts: { finish: '15m' },
  },
  { event: 'workflow/execute' },
  async ({ event, step, logger }) => {
    const { workflowId, userId, executionId, workflowJson } = event.data;

    logger.info(`[Worker] Iniciando execução ${executionId} do workflow ${workflowId}`);

    // STEP 1 — Marcar execução como 'running'
    await step.run('mark-running', () =>
      updateExecution(executionId, {
        status: 'running',
        totalSteps: (workflowJson as any)?.nodes?.length ?? 0,
      })
    );

    // STEP 2 — Executar o workflow com callbacks de step em tempo real
    const result = await step.run('run-engine', async () => {
      const definition = workflowJson as unknown as WorkflowDefinition;
      let completedSteps = 0;

      return executeWorkflow(definition, {
        userId,
        executionId,
        // 🔥 Persist step start (non-blocking fire-and-forget within the step)
        onNodeStart: async (update: ExecutionStepUpdate) => {
          try {
            await upsertStep(executionId, { ...update, status: 'running' });
          } catch (e) {
            logger.warn(`[Worker] Falha ao salvar step start: ${(e as Error).message}`);
          }
        },
        // 🔥 Persist step completion + update progress counter
        onNodeComplete: async (update: ExecutionStepUpdate) => {
          try {
            completedSteps++;
            await Promise.all([
              upsertStep(executionId, update),
              updateExecution(executionId, { completedSteps }),
            ]);
          } catch (e) {
            logger.warn(`[Worker] Falha ao salvar step complete: ${(e as Error).message}`);
          }
        },
      });
    });

    // STEP 3 — Salvar resultado final
    await step.run('save-result', () =>
      updateExecution(executionId, {
        status: result.success ? 'completed' : 'failed',
        results: result.results,
        durationMs: result.totalDurationMs,
        completedAt: new Date().toISOString(),
        completedSteps: result.results.length,
      })
    );

    logger.info(`[Worker] Execução ${executionId} finalizada. Sucesso: ${result.success}`);

    return {
      executionId,
      success: result.success,
      durationMs: result.totalDurationMs,
      nodeCount: result.results.length,
    };
  }
);
