'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { WorkflowNode, WorkflowEdge, WorkflowDefinition } from '@prompthub/engine';
import { saveWorkflow, runWorkflow } from '@/features/workflows/workflow-actions';

const nodeTypes = [
  { type: 'webhook', label: 'Webhook', icon: '📥', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { type: 'schedule', label: 'Schedule', icon: '⏰', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { type: 'http_request', label: 'HTTP Request', icon: '🌐', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { type: 'openai', label: 'OpenAI', icon: '🤖', color: 'bg-green-100 text-green-700 border-green-200' },
  { type: 'gmail_send', label: 'Gmail', icon: '📧', color: 'bg-red-100 text-red-700 border-red-200' },
  { type: 'google_sheets_write', label: 'Google Sheets', icon: '📊', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { type: 'whatsapp_send', label: 'WhatsApp', icon: '💬', color: 'bg-green-100 text-green-700 border-green-200' },
  { type: 'filter', label: 'Filter', icon: '🔍', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { type: 'code', label: 'Code', icon: '💻', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { type: 'delay', label: 'Delay', icon: '⏱️', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { type: 'slack_send', label: 'Slack', icon: '💬', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  { type: 'email_smtp', label: 'SMTP Email', icon: '✉️', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
];

export type NodeType = 'webhook' | 'schedule' | 'http_request' | 'openai' | 'gmail_send' | 'gmail_read' | 'google_sheets_read' | 'google_sheets_write' | 'whatsapp_send' | 'filter' | 'merge' | 'code' | 'delay' | 'switch' | 'slack_send' | 'discord_send' | 'email_smtp' | 'hubspot_create_contact' | 'typeform_read' | 'notion_create_page' | 'google_drive_upload';

type CanvasNode = WorkflowNode & { x: number; y: number; type: NodeType };

export function WorkflowEditor({ initialWorkflow }: { initialWorkflow?: WorkflowDefinition }) {
  const router = useRouter();
  const [savedId, setSavedId] = useState<string | null>(initialWorkflow?.id || null);
  const [nodes, setNodes] = useState<CanvasNode[]>(() => {
    if (initialWorkflow?.nodes) return initialWorkflow.nodes.map((n, i) => ({
      ...n, x: 100 + (i % 3) * 250, y: 100 + Math.floor(i / 3) * 180,
    }));
    return [];
  });
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialWorkflow?.edges || []);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [workflowName, setWorkflowName] = useState(initialWorkflow?.name || 'Novo Workflow');
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; totalDurationMs?: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null;

  const addNode = useCallback((type: string) => {
    const nodeType = nodeTypes.find((nt) => nt.type === type);
    if (!nodeType) return;

    const id = `node_${Date.now()}`;
    const newNode: CanvasNode = {
      id,
      type: type as NodeType,
      label: nodeType.label,
      position: { x: 0, y: 0 },
      config: {},
      inputs: [],
      outputs: [],
      x: 150 + (nodes.length % 3) * 220,
      y: 150 + Math.floor(nodes.length / 3) * 180,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(id);
  }, [nodes.length]);

  const updateNodeConfig = useCallback((nodeId: string, key: string, value: unknown) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, config: { ...n.config, [key]: value } } : n
      )
    );
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode((prev) => (prev === nodeId ? null : prev));
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas-area')) {
      setSelectedNode(null);
      setConnectingFrom(null);
    }
  }, []);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (connectingFrom) {
      if (connectingFrom !== nodeId) {
        const edgeId = `edge_${connectingFrom}_${nodeId}`;
        setEdges((prev) => {
          const exists = prev.some((ed) => ed.source === connectingFrom && ed.target === nodeId);
          if (exists) return prev;
          return [...prev, { id: edgeId, source: connectingFrom, target: nodeId }];
        });
      }
      setConnectingFrom(null);
      return;
    }
    setDragging(nodeId);
    setSelectedNode(nodeId);
    const rect = (e.target as HTMLElement).closest('[data-node-id]')?.getBoundingClientRect();
    if (rect) {
      dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  }, [connectingFrom]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.current.x;
    const y = e.clientY - rect.top - dragOffset.current.y;
    setNodes((prev) => prev.map((n) => (n.id === dragging ? { ...n, x, y } : n)));
  }, [dragging]);

  const handleCanvasMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const type = e.dataTransfer.getData('node-type');
    if (!type) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const nodeType = nodeTypes.find((nt) => nt.type === type);
    if (!nodeType) return;

    const id = `node_${Date.now()}`;
    const newNode: CanvasNode = {
      id,
      type: type as NodeType,
      label: nodeType.label,
      position: { x: 0, y: 0 },
      config: {},
      inputs: [],
      outputs: [],
      x: e.clientX - rect.left - 75,
      y: e.clientY - rect.top - 25,
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(id);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const workflowJson: WorkflowDefinition = {
      id: savedId || `wf_${Date.now()}`,
      name: workflowName,
      nodes: nodes.map(({ x, y, ...n }) => n),
      edges,
      createdAt: initialWorkflow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const saveResult = await saveWorkflow({
      id: savedId || undefined,
      title: workflowName,
      workflowJson,
    });
    setSaving(false);
    if ('id' in saveResult && saveResult.id) {
      setSavedId(saveResult.id as string);
      if (!savedId) {
        router.replace(`/workflows/${saveResult.id as string}`);
      }
    }
    return saveResult;
  };

  const handleRun = async () => {
    let wfId = savedId;
    if (!wfId) {
      const saveResult = await handleSave();
      if (!saveResult || 'error' in saveResult) return;
      wfId = saveResult.id;
    }

    setRunning(true);
    const res = await runWorkflow(wfId);
    setRunning(false);
    if ('executionId' in res) {
      setResult({ success: Boolean(res.success) });
    } else if ('error' in res) {
      setResult({ success: false });
    }
  };

  const getNodeStyle = (node: CanvasNode) => {
    const nt = nodeTypes.find((n) => n.type === node.type);
    return nt?.color || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-muted/10">
      <div className="flex items-center justify-between border-b border-border bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-lg font-semibold outline-none focus:border-primary"
          />
        </div>
        <div className="flex items-center gap-3">
          {result && (
            <span className={`text-sm font-medium ${result.success ? 'text-success' : 'text-error'}`}>
              {result.success ? 'Executado com sucesso' : 'Falha na execucao'} ({result.totalDurationMs}ms)
            </span>
          )}
          <button
            onClick={handleRun}
            disabled={running || nodes.length === 0}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {running ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              </svg>
            )}
            Executar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold transition hover:bg-muted"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 overflow-y-auto border-r border-border bg-white p-4">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nodes</h3>
          <div className="space-y-2">
            {nodeTypes.map((nt) => (
              <div
                key={nt.type}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('node-type', nt.type);
                }}
                className={`flex cursor-grab items-center gap-3 rounded-lg border p-3 text-sm font-medium transition hover:shadow-md ${nt.color}`}
              >
                <span className="text-lg">{nt.icon}</span>
                {nt.label}
              </div>
            ))}
          </div>

          {selectedNodeData && (
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Configuracao
              </h3>
              <div className="space-y-3">
                {renderNodeConfig(selectedNodeData, updateNodeConfig)}
                <button
                  onClick={() => deleteNode(selectedNodeData.id)}
                  className="w-full rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-xs font-medium text-error transition hover:bg-error/10"
                >
                  Remover Node
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          ref={canvasRef}
          className={`canvas-area relative flex-1 overflow-auto bg-[radial-gradient(ellipse_at_center,_#6C5CE7_0%,_transparent_70%)] opacity-[0.03] ${dragOver ? 'bg-primary/5' : ''}`}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full">
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;
              return (
                <line
                  key={edge.id}
                  x1={sourceNode.x + 100}
                  y1={sourceNode.y + 24}
                  x2={targetNode.x + 100}
                  y2={targetNode.y + 24}
                  stroke={connectingFrom === edge.source ? '#6C5CE7' : '#B2BEC3'}
                  strokeWidth={connectingFrom === edge.source ? 3 : 2}
                  strokeDasharray={connectingFrom === edge.source ? '5,5' : undefined}
                />
              );
            })}
          </svg>

          {connectingFrom && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                Clique em um node para conectar
              </span>
            </div>
          )}

          {nodes.map((node) => (
            <div
              key={node.id}
              data-node-id={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              className={`absolute flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md ${
                selectedNode === node.id ? 'ring-2 ring-primary shadow-lg' : ''
              } ${connectingFrom === node.id ? 'ring-2 ring-secondary' : ''}`}
              style={{ left: node.x, top: node.y, width: 200 }}
            >
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm ${getNodeStyle(node)}`}>
                {nodeTypes.find((nt) => nt.type === node.type)?.icon || '\u{1F4E6}'}
              </span>
              <div className="flex-1 truncate text-sm font-medium">{node.label}</div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); setConnectingFrom(connectingFrom === node.id ? null : node.id); }}
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-xs transition ${
                    connectingFrom === node.id ? 'bg-secondary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/20'
                  }`}
                  title="Conectar"
                >
                  {'\u27A1'}
                </button>
              </div>
            </div>
          ))}

          {nodes.length === 0 && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 text-6xl">{'\u{1F3E0}'}</div>
                <h3 className="mb-2 text-lg font-semibold text-muted-foreground">
                  Arraste nodes da paleta para começar
                </h3>
                <p className="text-sm text-muted-foreground">
                  Conecte os nodes para criar seu workflow
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function renderNodeConfig(
  node: CanvasNode,
  updateConfig: (id: string, key: string, value: unknown) => void
) {
  const configs: Record<string, { key: string; label: string; type: string; placeholder?: string }[]> = {
    ['webhook']: [{ key: 'method', label: 'Method', type: 'select' }],
    ['openai']: [
      { key: 'prompt', label: 'Prompt', type: 'textarea', placeholder: 'Digite o prompt...' },
      { key: 'model', label: 'Model', type: 'select' },
    ],
    ['http_request']: [
      { key: 'url', label: 'URL', type: 'text', placeholder: 'https://...' },
      { key: 'method', label: 'Method', type: 'select' },
    ],
    ['gmail_send']: [
      { key: 'to', label: 'Para', type: 'text', placeholder: 'email@exemplo.com' },
      { key: 'subject', label: 'Assunto', type: 'text', placeholder: 'Assunto do email' },
      { key: 'body', label: 'Corpo', type: 'textarea', placeholder: 'Conteudo do email...' },
    ],
    ['google_sheets_write']: [
      { key: 'spreadsheetId', label: 'Planilha ID', type: 'text', placeholder: 'ID da planilha' },
      { key: 'range', label: 'Intervalo', type: 'text', placeholder: 'A1:Z100' },
    ],
    ['whatsapp_send']: [
      { key: 'to', label: 'Telefone', type: 'text', placeholder: '+5511999999999' },
      { key: 'message', label: 'Mensagem', type: 'textarea', placeholder: 'Texto da mensagem...' },
    ],
    ['filter']: [
      { key: 'field', label: 'Campo', type: 'text', placeholder: 'campo' },
      { key: 'condition', label: 'Condicao', type: 'select' },
      { key: 'value', label: 'Valor', type: 'text', placeholder: 'Valor para comparar' },
    ],
    ['code']: [
      { key: 'code', label: 'Codigo', type: 'textarea', placeholder: 'return { result: input.data }' },
    ],
    ['delay']: [
      { key: 'durationMs', label: 'Duracao (ms)', type: 'number' },
    ],
    ['slack_send']: [
      { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'https://hooks.slack.com/...' },
      { key: 'channel', label: 'Canal', type: 'text', placeholder: '#geral' },
    ],
    ['email_smtp']: [
      { key: 'to', label: 'Para', type: 'text', placeholder: 'email@exemplo.com' },
      { key: 'subject', label: 'Assunto', type: 'text', placeholder: 'Assunto' },
      { key: 'body', label: 'Corpo', type: 'textarea', placeholder: 'Conteudo do email...' },
    ],
  };

  const fields = configs[node.type] || [];
  const selectOptions: Record<string, string[]> = {
    method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    model: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    condition: ['equals', 'contains', 'greater_than', 'less_than', 'exists'],
  };

  return (
    <>
      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              value={(node.config[field.key] as string) || ''}
              onChange={(e) => updateConfig(node.id, field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-border bg-muted/30 p-2 text-xs outline-none focus:border-primary"
              rows={3}
            />
          ) : field.type === 'select' ? (
            <select
              value={(node.config[field.key] as string) || ''}
              onChange={(e) => updateConfig(node.id, field.key, e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 p-2 text-xs outline-none focus:border-primary"
            >
              <option value="">Selecione...</option>
              {(selectOptions[field.key] || []).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              value={(node.config[field.key] as string) || ''}
              onChange={(e) => updateConfig(node.id, field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-border bg-muted/30 p-2 text-xs outline-none focus:border-primary"
            />
          )}
        </div>
      ))}
    </>
  );
}
