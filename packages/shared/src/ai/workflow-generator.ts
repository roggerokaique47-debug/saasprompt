import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Define o Schema rígido que o LLM deve cuspir (compatível com o React Flow / Engine JSON)
const NodeSchema = z.object({
  id: z.string(),
  type: z.enum([
    'webhook', 
    'http', 
    'gmail_send', 
    'gmail_read', 
    'google_sheets_read', 
    'google_sheets_write',
    'slack_send', 
    'openai_generate'
  ]),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  config: z.record(z.string(), z.unknown()),
});

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

const WorkflowJsonSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

export class WorkflowGenerator {
  /**
   * Converte linguagem natural em um WorkflowJSON formatado
   */
  static async generateFromText(prompt: string) {
    const systemPrompt = `
      Você é um especialista em arquitetura de automações corporativas (iPaas).
      O usuário fornecerá um caso de uso em linguagem natural, e o seu trabalho é gerar a estrutura JSON equivalente.
      
      Regras estritas:
      1. Os nós disponíveis são estritamente: webhook, http, gmail_send, gmail_read, google_sheets_read, google_sheets_write, slack_send, openai_generate.
      2. Tente sempre colocar posições (x, y) de forma que o fluxo faça sentido visualmente (da esquerda pra direita, ou cima para baixo. ex: y=0, y=150, y=300).
      3. Extraia o máximo de informações do prompt do usuário e popule as chaves iniciais dentro de "config".
    `;

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: WorkflowJsonSchema,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    });

    return object;
  }
}
