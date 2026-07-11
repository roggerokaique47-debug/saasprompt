import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { trace, context, Span } from '@opentelemetry/api';

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT 
    ? `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces` 
    : 'http://localhost:4318/v1/traces',
});

export const otelSdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: 'novaflow-engine',
  }),
  traceExporter,
});

let isInitialized = false;
export function initTelemetry() {
  if (isInitialized) return;
  if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
    try {
      otelSdk.start();
      isInitialized = true;
      console.log('OpenTelemetry SDK started successfully.');
    } catch (error) {
      console.error('Error starting OpenTelemetry SDK:', error);
    }
  }
}

// Lidando com o encerramento gracioso
process.on('SIGTERM', () => {
  if (isInitialized) {
    otelSdk.shutdown()
      .then(() => console.log('OpenTelemetry SDK terminated'))
      .catch((error) => console.log('Error terminating OpenTelemetry SDK', error))
      .finally(() => process.exit(0));
  }
});

// Exporta ferramentas utilitárias
export const tracer = trace.getTracer('novaflow-tracer', '0.1.0');

export function runInSpan<T>(name: string, fn: (span: Span) => Promise<T>, parentContext?: any): Promise<T> {
  const ctx = parentContext || context.active();
  return tracer.startActiveSpan(name, {}, ctx, async (span) => {
    try {
      const result = await fn(span);
      span.setStatus({ code: 1 }); // OK
      return result;
    } catch (err: any) {
      span.setStatus({ code: 2, message: err.message }); // ERROR
      span.recordException(err);
      throw err;
    } finally {
      span.end();
    }
  });
}
