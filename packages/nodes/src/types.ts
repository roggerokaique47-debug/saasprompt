import { z } from 'zod';

export const NodeType = {
  WEBHOOK: 'webhook',
  SCHEDULE: 'schedule',
  HTTP_REQUEST: 'http_request',
  OPENAI: 'openai',
  GMAIL_SEND: 'gmail_send',
  GMAIL_READ: 'gmail_read',
  GOOGLE_SHEETS_READ: 'google_sheets_read',
  GOOGLE_SHEETS_WRITE: 'google_sheets_write',
  WHATSAPP_SEND: 'whatsapp_send',
  FILTER: 'filter',
  MERGE: 'merge',
  CODE: 'code',
  DELAY: 'delay',
  SWITCH: 'switch',
  SLACK_SEND: 'slack_send',
  DISCORD_SEND: 'discord_send',
  EMAIL_SMTP: 'email_smtp',
  HUBSPOT_CREATE_CONTACT: 'hubspot_create_contact',
  TYPEFORM_READ: 'typeform_read',
  NOTION_CREATE_PAGE: 'notion_create_page',
  GOOGLE_DRIVE_UPLOAD: 'google_drive_upload',
} as const;

export type NodeType = (typeof NodeType)[keyof typeof NodeType];

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
  inputs: string[];
  outputs: string[];
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface ExecutionResult {
  nodeId: string;
  nodeType: NodeType;
  status: 'success' | 'error' | 'skipped';
  output: unknown;
  error?: string;
  durationMs: number;
  timestamp: string;
}

export type StepStatus = 'pending' | 'running' | 'success' | 'error' | 'skipped';

export interface ExecutionStepUpdate {
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  status: StepStatus;
  input?: unknown;
  output?: unknown;
  error?: string;
  durationMs?: number;
  startedAt?: string;
  completedAt?: string;
}

export interface ExecutionContext {
  userId?: string;
  organizationId?: string;
  agentId?: string;
  executionId?: string;
  traceId?: string;
  correlationId?: string;
  requestId?: string;
  payload?: any;
  /** Called immediately when a node begins executing */
  onNodeStart?: (update: ExecutionStepUpdate) => Promise<void> | void;
  /** Called immediately when a node finishes (success or error) */
  onNodeComplete?: (update: ExecutionStepUpdate) => Promise<void> | void;
  [key: string]: any;
}


export interface NodeExecutor<TConfig = Record<string, unknown>, TInput = unknown, TOutput = unknown> {
  type: NodeType;
  execute(config: TConfig, input: TInput, context?: ExecutionContext): Promise<TOutput>;
  validate?(config: TConfig): string | null;
}
