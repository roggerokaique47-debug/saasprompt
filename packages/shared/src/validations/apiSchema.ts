import { z } from 'zod';

export const IdempotencyHeaderSchema = z.object({
  'x-idempotency-key': z.string().uuid().optional(),
});

export const WorkflowExecutionInputSchema = z.object({
  workflowId: z.string().uuid(),
  version: z.number().int().positive().optional(),
  triggerData: z.record(z.string(), z.unknown()).optional(),
});

export const WebhookPayloadSchema = z.object({
  payload: z.record(z.string(), z.unknown()),
  timestamp: z.string(),
  nonce: z.string(),
});

export const ExecuteWorkflowSchema = z.object({
  workflowId: z.string().uuid(),
  trigger: z.string().optional().default('manual'),
  agentId: z.string().uuid().optional(),
});

export const AiGenerateWorkflowSchema = z.object({
  prompt: z.string().min(5),
});

export const AiCopilotSchema = z.object({
  nodes: z.array(z.record(z.string(), z.unknown())),
  edges: z.array(z.record(z.string(), z.unknown())),
});

export const ExecutionStepSchema = z.object({
  nodeId: z.string(),
  nodeLabel: z.string().optional(),
  nodeType: z.string(),
  status: z.enum(['pending', 'running', 'completed', 'failed']),
  input: z.unknown().optional(),
  output: z.unknown().optional(),
  error: z.string().optional(),
  durationMs: z.number().int().nonnegative().optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
});

export const ExecutionUpdateSchema = z.object({
  status: z.enum(['completed', 'failed', 'running']),
  results: z.record(z.string(), z.unknown()).optional(),
  durationMs: z.number().int().nonnegative().optional(),
  completedAt: z.string().optional(),
  nodeLogs: z.array(z.object({
    nodeId: z.string(),
    nodeType: z.string(),
    status: z.string(),
    output: z.unknown().optional(),
    error: z.string().optional(),
    durationMs: z.number().int().nonnegative().optional(),
  })).optional(),
});

export const FeedbacksSchema = z.object({
  message: z.string().min(2),
  type: z.enum(['bug', 'feature', 'general']).optional().default('general'),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const LeadsSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.string().optional(),
  organizationId: z.string().uuid().optional(),
});

export const IntegrationsSchema = z.object({
  provider: z.string(),
  accessToken: z.string().optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const WahaWebhookSchema = z.object({
  event: z.string().optional(),
  session: z.string().optional(),
  payload: z.object({
    from: z.string().optional(),
    body: z.string().optional(),
    fromMe: z.boolean().optional(),
  }).passthrough().optional(),
}).passthrough();
