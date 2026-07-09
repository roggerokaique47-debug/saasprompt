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

export interface ExecutionContext {
  userId?: string;
  [key: string]: any;
}

export interface NodeExecutor<TConfig = Record<string, unknown>, TInput = unknown, TOutput = unknown> {
  type: NodeType;
  execute(config: TConfig, input: TInput, context?: ExecutionContext): Promise<TOutput>;
  validate?(config: TConfig): string | null;
}
