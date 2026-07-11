'use client';

import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import { CustomNode } from './nodes/custom-node';
import { ConfigPanel } from './config-panel';
import { AIGeneratorModal } from './ai-generator-modal';
import { CostEstimator } from './cost-estimator';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Save, Play } from 'lucide-react';
import { saveWorkflow } from '../../workflow-actions';
import { useRouter } from 'next/navigation';

const nodeTypes = {
  custom: CustomNode,
};

interface WorkflowEditorProps {
  workflowId: string;
  initialTitle?: string;
  initialDescription?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export function WorkflowEditor({ workflowId, initialTitle = 'Novo Workflow', initialDescription = '', initialNodes = [], initialEdges = [] }: WorkflowEditorProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [isSaving, setIsSaving] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (workflowId === 'novo' && typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_generated_workflow');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.nodes) setNodes(parsed.nodes);
          if (parsed.edges) setEdges(parsed.edges);
          // Limpa após carregar
          localStorage.removeItem('ai_generated_workflow');
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [workflowId, setNodes, setEdges]);

  React.useEffect(() => {
    const handleAddNode = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, label } = customEvent.detail;
      
      // Calculate a center-ish position or below the last node
      let maxY = 0;
      let lastNodeId = '';
      setNodes((currentNodes) => {
        currentNodes.forEach(n => {
          if (n.position.y > maxY) {
            maxY = n.position.y;
            lastNodeId = n.id;
          }
        });

        const newNodeId = uuidv4();
        const newNode: Node = {
          id: newNodeId,
          type: 'custom',
          position: { x: 250, y: maxY > 0 ? maxY + 150 : 100 },
          data: { label, type, config: {} },
        };
        
        // Auto connect if there's a previous node and the new node is not a trigger
        const isTrigger = type === 'webhook' || type === 'schedule';
        if (lastNodeId && !isTrigger) {
          setEdges((eds) => addEdge({ source: lastNodeId, target: newNodeId, id: uuidv4() }, eds));
        }

        return currentNodes.concat(newNode);
      });
    };

    window.addEventListener('add-workflow-node', handleAddNode);
    return () => window.removeEventListener('add-workflow-node', handleAddNode);
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNodeId = uuidv4();
      const newNode: Node = {
        id: newNodeId,
        type: 'custom',
        position,
        data: { label, type, config: {} },
      };

      setNodes((nds) => {
        // Lógica de Auto-connect: conectar ao nó mais próximo acima dele
        const isTrigger = type === 'webhook' || type === 'schedule';
        let closestNodeId = '';
        let minDistance = Infinity;

        if (!isTrigger) {
          nds.forEach(n => {
            const distY = position.y - n.position.y;
            const distX = Math.abs(position.x - n.position.x);
            // O nó anterior deve estar acima (distY > 0) e razoavelmente perto
            if (distY > 0 && distY < 400 && distX < 300) {
              const dist = Math.sqrt(distX * distX + distY * distY);
              if (dist < minDistance) {
                minDistance = dist;
                closestNodeId = n.id;
              }
            }
          });
        }

        if (closestNodeId) {
          setEdges((eds) => addEdge({ source: closestNodeId, target: newNodeId, id: uuidv4() }, eds));
        }

        return nds.concat(newNode);
      });
    },
    [reactFlowInstance, setNodes, setEdges],
  );

  const handleUpdateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          node.data = data;
          setSelectedNode(node); // Update local state for the panel
        }
        return node;
      })
    );
  }, [setNodes]);

  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    if (nodes.length === 1) {
      setSelectedNode(nodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveWorkflow({
        id: workflowId !== 'novo' ? workflowId : undefined,
        title,
        description,
        workflowJson: { nodes, edges } as any,
      });

      if (result.error) {
        alert(result.error);
      } else {
        if (workflowId === 'novo' && result.id) {
          router.push(`/dashboard/workflows/${result.id}/edit`);
        } else {
          // just show a small success indication or trust the fast optimistic UI
          alert('Workflow salvo com sucesso!');
        }
      }
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar workflow');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopilotSuggest = async () => {
    if (nodes.length === 0) {
      alert('Adicione pelo menos um nó inicial (ex: Webhook) para que o Copilot sugira o próximo!');
      return;
    }
    
    setIsCopilotLoading(true);
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      // Encontrar a última posição de Y
      let maxY = 0;
      let lastNodeId = '';
      nodes.forEach(n => {
        if (n.position.y > maxY) {
          maxY = n.position.y;
          lastNodeId = n.id;
        }
      });

      const newNodeId = uuidv4();
      const newNode: Node = {
        id: newNodeId,
        type: 'custom',
        position: { x: 250, y: maxY + 150 }, // Abaixo do último nó
        data: { label: data.suggestedType.toUpperCase(), type: data.suggestedType, config: {} },
      };

      setNodes((nds) => nds.concat(newNode));

      if (lastNodeId) {
        setEdges((eds) => addEdge({ source: lastNodeId, target: newNodeId, id: uuidv4() }, eds));
      }

      alert(`Sugestão do Copilot: ${data.reason}`);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar Copilot');
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleSimulate = async () => {
    if (workflowId === 'novo') {
      alert('Salve o workflow antes de executar.');
      return;
    }
    setIsSimulating(true);
    try {
      const res = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      });
      const data = await res.json();

      if (res.status === 202) {
        // Job enfileirado com sucesso — redirecionar para o painel de execuções
        alert(`✅ Workflow enfileirado!\nJob ID: ${data.executionId}\n\nAcompanhe o progresso em: Dashboard > Execuções`);
        router.push('/dashboard/execucoes');
      } else {
        alert(`Erro: ${data.error || 'Falha ao enfileirar o workflow'}`);
      }
    } catch (e) {
      console.error(e);
      alert('Erro de conexão ao enfileirar o workflow.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-50">
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <div className="absolute top-4 left-4 z-10 flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <input 
            value={title} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} 
            placeholder="Nome do Workflow"
            className="w-64 border-none shadow-none font-semibold text-slate-800 focus-visible:ring-0 px-2 h-8 outline-none"
          />
        </div>
        
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button onClick={() => setIsAIGeneratorOpen(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow font-medium border-none">
            <Sparkles className="w-4 h-4 mr-2" />
            Gerar com IA
          </Button>
          <Button variant="outline" onClick={handleCopilotSuggest} disabled={isCopilotLoading} className="font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200">
            {isCopilotLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Copilot
          </Button>
          <Button variant="outline" onClick={handleSimulate} disabled={isSimulating} className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200">
            {isSimulating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Simular
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Salvar
          </Button>
        </div>

        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-50"
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            <Controls />
          </ReactFlow>
          <CostEstimator nodes={nodes} />
        </ReactFlowProvider>
      </div>

      <ConfigPanel selectedNode={selectedNode} onUpdateNode={handleUpdateNode} />

      <AIGeneratorModal 
        isOpen={isAIGeneratorOpen} 
        onOpenChange={setIsAIGeneratorOpen} 
        onGenerate={(newNodes, newEdges) => {
          setNodes(newNodes);
          setEdges(newEdges);
          if (reactFlowInstance) {
            setTimeout(() => reactFlowInstance.fitView(), 100);
          }
        }} 
      />
    </div>
  );
}
