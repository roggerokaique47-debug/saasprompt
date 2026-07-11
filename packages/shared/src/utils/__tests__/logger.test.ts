import { describe, it, expect } from 'vitest';
import { logger, getTraceLogger } from '../logger';

describe('logger', () => {
  it('deve exportar a instância principal do pino', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });

  it('deve criar um trace logger mantendo os dados de rastreabilidade (Trace ID e Correlation ID)', () => {
    const traceId = 'trace-123';
    const correlationId = 'corr-456';
    const moduleName = 'TestModule';
    
    const traceLogger = getTraceLogger(traceId, correlationId, moduleName);
    
    // O child logger herda o objeto bindings (contexto do log)
    const bindings = traceLogger.bindings();
    expect(bindings).toMatchObject({
      trace_id: traceId,
      correlation_id: correlationId,
      module: moduleName,
    });
  });
});
