import { NextResponse } from 'next/server';
import client from '@prompthub/database/src/client';
import { workflows } from '@prompthub/database/src/schema/workflows';
import { agents } from '@prompthub/database/src/schema/agents';
import { desc, sql, eq } from 'drizzle-orm';

import { WahaWebhookSchema } from '@prompthub/shared/src/validations/apiSchema';

// O webhook que o WAHA vai chamar
export async function POST(req: Request) {
  try {
    let bodyRaw;
    try {
      bodyRaw = await req.json();
    } catch (e) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 }); // WAHA keeps trying if not 200
    }

    const parsed = WahaWebhookSchema.safeParse(bodyRaw);
    if (!parsed.success) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const body = parsed.data;

    // Validar se é uma mensagem recebida
    if (body.event !== 'message' || !body.payload) {
      return NextResponse.json({ status: 'ignored' }, { status: 200 });
    }

    const wahaSession = body.session || 'default';
    const { from, body: messageText, fromMe } = body.payload;

    // Não responder as próprias mensagens para não dar loop infinito
    if (fromMe) {
      return NextResponse.json({ status: 'ignored', reason: 'fromMe' }, { status: 200 });
    }

    if (!messageText) {
      return NextResponse.json({ status: 'ignored', reason: 'empty message' }, { status: 200 });
    }

    console.log(`[WAHA WEBHOOK] Mensagem recebida de ${from}: ${messageText}`);

    // --- FASE 0: GATILHO DE WORKFLOWS (COMANDO /run) ---
    if (messageText.toLowerCase().startsWith('/run ')) {
      const slugToRun = messageText.substring(5).trim();
      console.log(`[WAHA TRIGGER] Tentando rodar workflow via WhatsApp: ${slugToRun}`);
      
      try {
        const { eq } = await import('drizzle-orm');
        const [workflow] = await client.select()
          .from(workflows)
          .where(eq(workflows.slug, slugToRun))
          .limit(1);

        if (workflow) {
          const { executeWorkflow } = await import('@prompthub/engine');
          const definition = workflow.workflowJson as any;
          
          const result = await executeWorkflow(definition);
          const reply = result.success 
            ? `✅ *Workflow Executado!*\nNome: ${workflow.title}\nTempo: ${result.totalDurationMs}ms` 
            : `❌ *Falha no Workflow!*\nNome: ${workflow.title}`;
          
          await fetch('http://127.0.0.1:3002/api/sendText', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Api-Key': '123' },
            body: JSON.stringify({ chatId: from, text: reply, session: wahaSession })
          });

          return NextResponse.json({ status: 'workflow_executed', result }, { status: 200 });
        }
      } catch (err) {
        console.error('[WAHA TRIGGER ERROR]', err);
      }
    }

    // --- FASE 1: IDENTIFICAR USUÁRIO DA SESSÃO ---
    let userId = null;
    if (wahaSession.startsWith('session_')) {
      userId = wahaSession.replace('session_', '');
    }

    // Buscar Agente contratado pelo usuário para atuar como cérebro
    let agentPrompt = '';
    if (userId) {
      try {
        const [activeAgent] = await client.select()
          .from(agents)
          .where(sql`${agents.authorId} = ${userId} AND ${agents.title} LIKE '%(Ativo)%'`)
          .limit(1);
        
        if (activeAgent) {
          console.log(`[WAHA] Agente customizado encontrado para o user ${userId}: ${activeAgent.title}`);
          agentPrompt = activeAgent.content;
        }
      } catch (err) {
        console.error('[WAHA AGENT ERROR]', err);
      }
    }
    const textLower = messageText.toLowerCase();
    let dbContext = '';

    // Se o usuário mencionar algo relacionado a workflows ou automações, consultamos o banco
    if (textLower.includes('workflow') || textLower.includes('automação') || textLower.includes('template')) {
      try {
        console.log('[RAG] Buscando workflows populares no banco de dados...');
        const popularWorkflows = await client.select({
          title: workflows.title,
          description: workflows.description,
          price: workflows.priceCents
        })
        .from(workflows)
        .where(sql`${workflows.isActive} = true`)
        .orderBy(desc(workflows.downloads))
        .limit(3);

        if (popularWorkflows.length > 0) {
          dbContext = 'INFORMAÇÃO DO BANCO DE DADOS: O sistema possui os seguintes workflows ativos no momento: \n';
          popularWorkflows.forEach((wf, index) => {
            const preco = wf.price > 0 ? `(R$ ${(wf.price / 100).toFixed(2)})` : '(Gratuito)';
            dbContext += `${index + 1}. ${wf.title} ${preco} - ${wf.description || 'Sem descrição'}\n`;
          });
        } else {
          dbContext = 'INFORMAÇÃO DO BANCO DE DADOS: Nenhum workflow ativo no momento.';
        }
      } catch (dbError) {
        console.error('[RAG ERROR] Falha ao consultar o banco:', dbError);
      }
    }

    // --- FASE 2: AÇÃO (INJEÇÃO DE CONTEXTO E CHAMADA AO LLM) ---
    const openaiApiBase = process.env.OPENAI_API_BASE || 'http://127.0.0.1:1234/v1';
    let generatedText = "Desculpe, meu cérebro (LM Studio) parece estar desligado no momento.";

    let basePrompt = `Você é um assistente virtual atencioso, curto e direto. Seu nome é NovaFlow AI. Você está ajudando a testar a integração do WhatsApp.`;
    if (agentPrompt) {
      basePrompt = agentPrompt;
    }

    const systemPrompt = `${basePrompt}
${dbContext ? `\nIMPORTANTE: Responda a dúvida do usuário baseado nesta informação real do sistema:\n${dbContext}` : ''}`;

    try {
      const llmResponse = await fetch(`${openaiApiBase}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY || 'lm-studio'}`,
        },
        body: JSON.stringify({
          model: 'liquid-1.2b', // ou qualquer um no LM studio
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: messageText }
          ],
          temperature: 0.7,
        })
      });

      if (llmResponse.ok) {
        const data = await llmResponse.json();
        generatedText = data.choices[0].message.content;
      } else {
        console.error('[LLM ERROR]', llmResponse.statusText);
      }
    } catch (llmError) {
      console.error('[LLM FETCH ERROR]', llmError);
    }

    // Retornar a mensagem para o WAHA
    const WAHA_URL = 'http://127.0.0.1:3002/api/sendText';
    console.log(`[WAHA] Enviando resposta para ${from}...`);

    await fetch(WAHA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Api-Key': '123'
      },
      body: JSON.stringify({
        chatId: from,
        text: generatedText,
        session: wahaSession
      })
    });

    return NextResponse.json({ status: 'success', sent: generatedText }, { status: 200 });

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
