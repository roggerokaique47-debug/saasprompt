import pino from 'pino';

// Pino Logger for Structured Logging (OpenTelemetry/Grafana compatible)
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Cria um child logger herdando o Trace ID e Context para rastreabilidade cross-service.
 */
export function getTraceLogger(traceId: string, correlationId: string, contextModule: string) {
  return logger.child({
    trace_id: traceId,
    correlation_id: correlationId,
    module: contextModule,
  });
}
