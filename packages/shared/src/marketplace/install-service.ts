export class InstallService {
  /**
   * Remove dados sensíveis (IDs de credenciais atrelados à conta do autor original)
   * antes de instalar um template na conta de um novo usuário.
   */
  static sanitizeWorkflowJson(workflowJson: any): any {
    if (!workflowJson || typeof workflowJson !== 'object') {
      return workflowJson;
    }

    const cloned = JSON.parse(JSON.stringify(workflowJson));

    if (Array.isArray(cloned.nodes)) {
      cloned.nodes = cloned.nodes.map((node: any) => {
        // Limpa credentialId se existir na configuração do nó
        if (node.config && node.config.credentialId) {
          delete node.config.credentialId;
        }

        // Se houverem integrações que mapeiam IDs de pastas específicas ou e-mails específicos
        // (por exemplo, folder_id do Google Drive ou userId do Slack), podemos resetar aqui:
        // ex: if (node.type === 'slack_send') delete node.config.channel;

        return node;
      });
    }

    return cloned;
  }
}
