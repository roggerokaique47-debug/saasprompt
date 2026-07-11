import 'dotenv/config';
import express from 'express';
import { serve } from 'inngest/express';
import { inngest } from './inngest/client';
import { executeWorkflowFn } from './inngest/functions';
import { initTelemetry } from '@prompthub/shared/src/observability/otel';

initTelemetry();

const app = express();
const port = process.env.PORT || 8289;

app.use(express.json());

// Inngest route
app.use('/api/inngest', serve({ client: inngest, functions: [executeWorkflowFn] }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Workers app running on http://localhost:${port}`);
  console.log(`Inngest handler at http://localhost:${port}/api/inngest`);
});
