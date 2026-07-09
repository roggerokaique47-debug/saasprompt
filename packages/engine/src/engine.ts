import { WorkflowDefinition, ExecutionResult, WorkflowNode } from './nodes';
import { executors } from './executors';
import { initEnvProvider } from './ai-provider';

initEnvProvider();

function topologicalSort(nodes: WorkflowNode[], edges: { source: string; target: string }[]): WorkflowNode[] {
  const adjacency = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const node of nodes) {
    adjacency.set(node.id, []);
    inDegree.set(node.id, 0);
  }

  for (const edge of edges) {
    adjacency.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, degree] of inDegree) {
    if (degree === 0) queue.push(id);
  }

  const sorted: WorkflowNode[] = [];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const node = nodes.find((n) => n.id === id);
    if (node) sorted.push(node);

    for (const neighbor of adjacency.get(id) || []) {
      const newDegree = (inDegree.get(neighbor) || 1) - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) queue.push(neighbor);
    }
  }

  return sorted;
}

function getInputForNode(
  nodeId: string,
  edges: { source: string; target: string }[],
  results: Map<string, ExecutionResult>,
): unknown {
  const incomingEdges = edges.filter((e) => e.target === nodeId);
  if (incomingEdges.length === 0) return null;
  if (incomingEdges.length === 1) return results.get(incomingEdges[0].source)?.output;

  return incomingEdges.map((e) => ({
    source: e.source,
    data: results.get(e.source)?.output,
  }));
}

export async function executeWorkflow(workflow: WorkflowDefinition, context?: import('./nodes').ExecutionContext): Promise<{
  results: ExecutionResult[];
  totalDurationMs: number;
  success: boolean;
}> {
  const sortedNodes = topologicalSort(workflow.nodes, workflow.edges);
  const results = new Map<string, ExecutionResult>();
  const startTime = Date.now();

  for (const node of sortedNodes) {
    const executor = executors[node.type];
    if (!executor) {
      results.set(node.id, {
        nodeId: node.id,
        nodeType: node.type,
        status: 'error',
        output: null,
        error: `No executor found for node type: ${node.type}`,
        durationMs: 0,
        timestamp: new Date().toISOString(),
      });
      continue;
    }

    const input = getInputForNode(node.id, workflow.edges, results);
    const nodeStart = Date.now();

    try {
      const output = await executor.execute(node.config, input, context);
      results.set(node.id, {
        nodeId: node.id,
        nodeType: node.type,
        status: 'success',
        output,
        durationMs: Date.now() - nodeStart,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      results.set(node.id, {
        nodeId: node.id,
        nodeType: node.type,
        status: 'error',
        output: null,
        error: (error as Error).message,
        durationMs: Date.now() - nodeStart,
        timestamp: new Date().toISOString(),
      });
    }
  }

  const allResults = Array.from(results.values());
  return {
    results: allResults,
    totalDurationMs: Date.now() - startTime,
    success: allResults.every((r) => r.status === 'success'),
  };
}
