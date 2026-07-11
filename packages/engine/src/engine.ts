import { WorkflowDefinition, ExecutionResult, WorkflowNode, ExecutionContext, ExecutionStepUpdate, nodeRegistry, initEnvProvider } from '@prompthub/nodes';
import { getTraceLogger } from '@prompthub/shared';
import { runInSpan } from '@prompthub/shared/src/observability/otel';

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

export async function executeWorkflow(workflow: WorkflowDefinition, context?: ExecutionContext): Promise<{
  results: ExecutionResult[];
  totalDurationMs: number;
  success: boolean;
}> {
  const sortedNodes = topologicalSort(workflow.nodes, workflow.edges);
  const results = new Map<string, ExecutionResult>();
  const startTime = Date.now();
  
  const traceId = context?.traceId || 'unknown-trace';
  const correlationId = context?.correlationId || 'unknown-correlation';
  const executionId = context?.executionId || 'unknown-execution';
  const orgId = context?.organizationId || 'unknown-org';

  const logger = getTraceLogger(traceId, correlationId, 'Engine');
  logger.info({ executionId, orgId, nodesCount: sortedNodes.length }, 'Starting workflow execution');

  for (const node of sortedNodes) {
    const executor = nodeRegistry[node.type];
    if (!executor) {
      const stepUpdate: ExecutionStepUpdate = {
        nodeId: node.id,
        nodeLabel: node.label,
        nodeType: node.type,
        status: 'error',
        error: `No executor found for node type: ${node.type}`,
        completedAt: new Date().toISOString(),
      };
      await context?.onNodeComplete?.(stepUpdate);
      logger.error({ nodeId: node.id, nodeType: node.type }, 'No executor found');

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
    const startedAt = new Date().toISOString();

    logger.info({ nodeId: node.id, nodeType: node.type }, 'Node starting');

    // 🔔 Notify: node is starting
    await context?.onNodeStart?.({
      nodeId: node.id,
      nodeLabel: node.label,
      nodeType: node.type,
      status: 'running',
      input,
      startedAt,
    });

    try {
      const output = await runInSpan(`node-${node.type}`, async (span) => {
        span.setAttribute('node.id', node.id);
        span.setAttribute('node.type', node.type);
        span.setAttribute('execution.id', executionId);
        return await executor.execute(node.config, input, context);
      });
      const durationMs = Date.now() - nodeStart;
      const completedAt = new Date().toISOString();

      logger.info({ nodeId: node.id, durationMs }, 'Node completed successfully');

      // 🔔 Notify: node completed successfully
      await context?.onNodeComplete?.({
        nodeId: node.id,
        nodeLabel: node.label,
        nodeType: node.type,
        status: 'success',
        input,
        output,
        durationMs,
        startedAt,
        completedAt,
      });

      results.set(node.id, {
        nodeId: node.id,
        nodeType: node.type,
        status: 'success',
        output,
        durationMs,
        timestamp: completedAt,
      });
    } catch (error) {
      const durationMs = Date.now() - nodeStart;
      const completedAt = new Date().toISOString();
      const errorMsg = (error as Error).message;

      logger.error({ nodeId: node.id, durationMs, error: errorMsg }, 'Node failed');

      // 🔔 Notify: node failed
      await context?.onNodeComplete?.({
        nodeId: node.id,
        nodeLabel: node.label,
        nodeType: node.type,
        status: 'error',
        input,
        error: errorMsg,
        durationMs,
        startedAt,
        completedAt,
      });

      results.set(node.id, {
        nodeId: node.id,
        nodeType: node.type,
        status: 'error',
        output: null,
        error: errorMsg,
        durationMs,
        timestamp: completedAt,
      });
    }
  }

  const allResults = Array.from(results.values());
  const success = allResults.every((r) => r.status === 'success');
  const totalDurationMs = Date.now() - startTime;
  
  logger.info({ executionId, success, totalDurationMs }, 'Workflow execution finished');

  return {
    results: allResults,
    totalDurationMs,
    success,
  };
}
