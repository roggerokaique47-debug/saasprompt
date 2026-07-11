import http from 'k6/http';
import { check, sleep } from 'k6';

// Teste de Carga e Resiliência (Engine) - 100 VUs simulando 1000 workflows
export const options = {
  stages: [
    { duration: '30s', target: 50 }, // Ramp-up para 50 usuários
    { duration: '1m', target: 100 }, // Sustenta 100 usuários
    { duration: '30s', target: 0 },  // Ramp-down para 0
  ],
  thresholds: {
    // API P95 < 300ms conforme requisitos de Performance
    http_req_duration: ['p(95)<300'],
    // 99.9% de disponibilidade
    http_req_failed: ['rate<0.001'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
// Um token de teste que seria provisionado antes do teste rodar
const TEST_API_KEY = __ENV.TEST_API_KEY || 'sk_test_123456';
const WORKFLOW_ID = __ENV.WORKFLOW_ID || 'test-workflow-id';

export default function () {
  // Simulando requisições de execução do Workflow
  const payload = JSON.stringify({
    inputs: { userPrompt: "Testando concorrência e falhas" },
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TEST_API_KEY}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/workflows/${WORKFLOW_ID}/execute`, payload, params);

  check(res, {
    'status é 200 (Enfileirado ou Finalizado)': (r) => r.status === 200,
    'retorna um executionId': (r) => r.json('executionId') !== undefined,
  });

  // Opcional: tentar buscar o status
  if (res.status === 200) {
    const execId = res.json('executionId');
    const statusRes = http.get(`${BASE_URL}/api/executions/${execId}/status`, params);
    check(statusRes, {
      'status 200 no GET de status': (r) => r.status === 200,
    });
  }

  // Simular usuário pensando entre requisições (0.5s a 2s)
  sleep(Math.random() * 1.5 + 0.5);
}
