'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type StepStatus = 'pending' | 'running' | 'success' | 'error' | 'skipped';

interface ExecutionStep {
  id: string;
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
  createdAt: string;
}

const STATUS_CONFIG: Record<StepStatus, { icon: string; color: string; bg: string; label: string }> = {
  pending:  { icon: '⏳', color: 'text-gray-400',   bg: 'bg-gray-800/40',   label: 'Aguardando' },
  running:  { icon: '⚡', color: 'text-yellow-400', bg: 'bg-yellow-900/30', label: 'Executando' },
  success:  { icon: '✓',  color: 'text-green-400',  bg: 'bg-green-900/30',  label: 'Concluído' },
  error:    { icon: '✕',  color: 'text-red-400',    bg: 'bg-red-900/30',    label: 'Erro' },
  skipped:  { icon: '⊘',  color: 'text-gray-500',   bg: 'bg-gray-800/20',   label: 'Ignorado' },
};

const NODE_TYPE_ICONS: Record<string, string> = {
  openai: '🤖',
  http_request: '🌐',
  webhook: '🔗',
  gmail_send: '📧',
  gmail_read: '📬',
  whatsapp_send: '💬',
  slack_send: '🎯',
  discord_send: '🎮',
  google_sheets_read: '📊',
  google_sheets_write: '📊',
  filter: '🔍',
  code: '💻',
  delay: '⏱',
  switch: '🔀',
  merge: '⛙',
  schedule: '📅',
  email_smtp: '📨',
  hubspot_create_contact: '🏢',
  typeform_read: '📋',
  notion_create_page: '📝',
};

export function ExecutionStepsPanel({ executionId }: { executionId: string }) {
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<ExecutionStep | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Load initial steps
    const loadSteps = async () => {
      const { data } = await supabase
        .from('execution_steps')
        .select('*')
        .eq('execution_id', executionId)
        .order('created_at', { ascending: true });
      if (data) setSteps(data as ExecutionStep[]);
    };

    loadSteps();

    // 🔥 Subscribe to real-time changes via Supabase Realtime
    const channel = supabase
      .channel(`execution-steps-${executionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'execution_steps',
          filter: `execution_id=eq.${executionId}`,
        },
        (payload) => {
          const updatedStep = payload.new as ExecutionStep;
          setSteps((prev) => {
            const idx = prev.findIndex((s) => s.nodeId === updatedStep.nodeId);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = updatedStep;
              return next;
            }
            return [...prev, updatedStep];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [executionId, supabase]);

  return (
    <div className="flex gap-4 h-full">
      {/* Steps list */}
      <div className="flex-1 space-y-2">
        {steps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-sm">Aguardando início da execução...</p>
          </div>
        ) : (
          steps.map((step, idx) => {
            const cfg = STATUS_CONFIG[step.status] ?? STATUS_CONFIG.pending;
            const icon = NODE_TYPE_ICONS[step.nodeType] ?? '🔧';
            return (
              <button
                key={step.id ?? step.nodeId}
                onClick={() => setSelectedStep(selectedStep?.nodeId === step.nodeId ? null : step)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border transition-all
                  ${cfg.bg} border-white/5 hover:border-white/15
                  ${selectedStep?.nodeId === step.nodeId ? 'border-purple-500/50 ring-1 ring-purple-500/30' : ''}
                `}
              >
                {/* Step number */}
                <span className="w-6 h-6 rounded-full bg-white/10 text-white/40 text-xs flex items-center justify-center font-mono flex-shrink-0">
                  {idx + 1}
                </span>

                {/* Node type icon */}
                <span className="text-lg flex-shrink-0">{icon}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{step.nodeLabel}</p>
                  <p className="text-xs text-gray-500">{step.nodeType}</p>
                </div>

                {/* Duration */}
                {step.durationMs !== undefined && step.durationMs !== null && (
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {step.durationMs < 1000 ? `${step.durationMs}ms` : `${(step.durationMs / 1000).toFixed(1)}s`}
                  </span>
                )}

                {/* Status badge */}
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${cfg.color}`}>
                  <span className={step.status === 'running' ? 'animate-pulse' : ''}>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Step detail panel */}
      {selectedStep && (
        <div className="w-80 border border-white/10 rounded-xl p-4 bg-gray-900/60 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">{selectedStep.nodeLabel}</h3>
            <button
              onClick={() => setSelectedStep(null)}
              className="text-gray-500 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          {selectedStep.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-500/30">
              <p className="text-xs text-red-400 font-mono break-all">{selectedStep.error}</p>
            </div>
          )}

          {selectedStep.input !== undefined && selectedStep.input !== null && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Input</p>
              <pre className="text-xs text-gray-300 bg-black/30 rounded-lg p-2 overflow-x-auto max-h-32">
                {JSON.stringify(selectedStep.input, null, 2)}
              </pre>
            </div>
          )}

          {selectedStep.output !== undefined && selectedStep.output !== null && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Output</p>
              <pre className="text-xs text-gray-300 bg-black/30 rounded-lg p-2 overflow-x-auto max-h-48">
                {JSON.stringify(selectedStep.output, null, 2)}
              </pre>
            </div>
          )}

          <div className="space-y-1 mt-4 border-t border-white/5 pt-3">
            {selectedStep.startedAt && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Iniciado</span>
                <span className="text-gray-300">{new Date(selectedStep.startedAt).toLocaleTimeString('pt-BR')}</span>
              </div>
            )}
            {selectedStep.completedAt && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Concluído</span>
                <span className="text-gray-300">{new Date(selectedStep.completedAt).toLocaleTimeString('pt-BR')}</span>
              </div>
            )}
            {selectedStep.durationMs !== undefined && selectedStep.durationMs !== null && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Duração</span>
                <span className="text-gray-300">{selectedStep.durationMs}ms</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
