export type ValidatorError = {
  nodeId: string;
  message: string;
  severity: 'error' | 'warning';
};

export class WorkflowValidator {
  /**
   * Analisa estaticamente um workflow em JSON e busca problemas de lógica.
   */
  static validate(workflowJson: any): ValidatorError[] {
    const errors: ValidatorError[] = [];

    if (!workflowJson || !Array.isArray(workflowJson.nodes) || !Array.isArray(workflowJson.edges)) {
      return [{ nodeId: 'global', message: 'Formato de Workflow inválido.', severity: 'error' }];
    }

    const { nodes, edges } = workflowJson;
    const nodeIds = new Set(nodes.map((n: any) => n.id));

    // 1. Validar referências quebradas nas Edges
    for (const edge of edges) {
      if (!nodeIds.has(edge.source)) {
        errors.push({ nodeId: 'edge', message: `Conexão parte de um nó inexistente: ${edge.source}`, severity: 'error' });
      }
      if (!nodeIds.has(edge.target)) {
        errors.push({ nodeId: 'edge', message: `Conexão aponta para um nó inexistente: ${edge.target}`, severity: 'error' });
      }
    }

    // 2. Validar Configuração Mínima por Nó
    for (const node of nodes) {
      // Nós que requerem autenticação (credentialId)
      const authRequiredNodes = ['gmail_send', 'gmail_read', 'google_sheets_read', 'google_sheets_write', 'slack_send'];
      
      if (authRequiredNodes.includes(node.type)) {
        if (!node.config || !node.config.credentialId) {
          errors.push({
            nodeId: node.id,
            message: `O nó "${node.type}" necessita de uma conta conectada (Credencial).`,
            severity: 'error',
          });
        }
      }

      if (node.type === 'http') {
        if (!node.config || !node.config.url) {
          errors.push({
            nodeId: node.id,
            message: `O nó HTTP precisa de uma URL configurada.`,
            severity: 'error',
          });
        }
      }
    }

    // 3. Detecção de Ciclos (grafos cíclicos causam loops infinitos)
    if (this.detectCycle(nodes, edges)) {
      errors.push({
        nodeId: 'global',
        message: 'Foi detectado um loop infinito (ciclo) nas suas conexões. A engine não permite execuções cíclicas.',
        severity: 'error',
      });
    }

    return errors;
  }

  /**
   * Algoritmo DFS (Depth-First Search) para achar ciclos no grafo direcionado.
   */
  private static detectCycle(nodes: any[], edges: any[]): boolean {
    const adjacencyList: Record<string, string[]> = {};
    for (const node of nodes) {
      adjacencyList[node.id] = [];
    }
    for (const edge of edges) {
      if (adjacencyList[edge.source]) {
        adjacencyList[edge.source].push(edge.target);
      }
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      if (!visited.has(nodeId)) {
        visited.add(nodeId);
        recStack.add(nodeId);

        const neighbors = adjacencyList[nodeId] || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor) && dfs(neighbor)) {
            return true;
          } else if (recStack.has(neighbor)) {
            return true; // Encontrou back-edge
          }
        }
      }
      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (dfs(node.id)) {
        return true;
      }
    }

    return false;
  }
}
