import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // 1. Autenticação B2B via Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    // 2. Escudo SaaS: Validar Saldo de Créditos
    const { eq } = await import('drizzle-orm');
    const db = (await import('@prompthub/database/src/client')).default;
    const { users } = await import('@prompthub/database/src/schema/users');

    const userResult = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const dbUser = userResult.length > 0 ? userResult[0] : null;

    const hasCustomKey = dbUser?.customAiKey && dbUser.customAiKey.trim().length > 0;

    if (!hasCustomKey && (!dbUser || dbUser.credits < 2)) {
      return NextResponse.json(
        { error: 'Créditos insuficientes para gerar workflows. Adicione tokens ou configure sua própria chave (Plano Enterprise).' },
        { status: 402 } // 402 Payment Required
      );
    }

    const systemApiKey = process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    const apiKey = hasCustomKey ? dbUser!.customAiKey : systemApiKey;

    const systemPrompt = `
You are an AI that generates automation workflows. The user will give you a description of what they want to automate.
You must output ONLY a valid JSON object with the following structure, representing the workflow graph for React Flow:
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "custom",
      "position": { "x": 0, "y": 0 },
      "data": {
        "type": "webhook or http_request or openai or gmail_send or filter or schedule or slack_send or email_smtp or merge",
        "label": "Human readable name",
        "config": { /* node specific config */ }
      }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "source-node-id",
      "target": "target-node-id"
    }
  ]
}

Available node types: webhook, schedule, http_request, openai, gmail_send, gmail_read, google_sheets_read, google_sheets_write, whatsapp_send, filter, merge, code, delay, switch, slack_send, discord_send, email_smtp.

Rules:
1. Always set the node's top-level "type" to "custom" for React Flow.
2. The actual engine type goes inside "data.type".
3. Layout the nodes logically using the "position" x and y coordinates (e.g. x: 250, y: 0, y: 150, y: 300, etc.) so they flow top-to-bottom or left-to-right.
4. Output ONLY the raw JSON, no markdown formatting (\`\`\`json), no explanations.
`;

    let content = '';

    if (!apiKey) {
      console.log('No API key found. Invoking opencode CLI via child_process.exec...');
      
      try {
        const payload = `SYSTEM: ${systemPrompt} USER PROMPT: ${prompt}`.replace(/"/g, '\\"').replace(/[\r\n]+/g, ' ');
        const command = `echo y | opencode run "${payload}" --pure --auto`;
        
        // Run with a 120-second timeout
        const { stdout } = await execAsync(command, { timeout: 120000 });
        console.log('Opencode CLI finished generating!');
        
        // Extract JSON from stdout
        const match = stdout.match(/\{[\s\S]*\}/);
        if (match) {
          content = match[0].trim();
        } else {
          throw new Error('No JSON found in Opencode output');
        }
      } catch (err: any) {
        console.log('Opencode CLI exited or timed out. Attempting to extract JSON from partial output...');
        const combinedOut = (err.stdout || '') + '\n' + (err.stderr || '');
        const match = combinedOut.match(/\{[\s\S]*\}/);
        
        if (match) {
          content = match[0].trim();
          console.log('Successfully extracted JSON from partial output!');
        } else {
          console.error('Opencode CLI failed:', err);
          return NextResponse.json({ error: 'Failed to generate workflow via Opencode CLI' }, { status: 500 });
        }
      }
    } else {
      // Normal HTTP fetch to LLM provider
      let fetchUrl = process.env.AI_BASE_URL || '';
      if (fetchUrl) {
        if (!fetchUrl.endsWith('/chat/completions')) {
          fetchUrl = fetchUrl.replace(/\/$/, '') + '/chat/completions';
        }
      } else {
        if (process.env.OPENROUTER_API_KEY) {
          fetchUrl = 'https://openrouter.ai/api/v1/chat/completions';
        } else {
          fetchUrl = 'https://api.openai.com/v1/chat/completions';
        }
      }

      const aiModel = process.env.AI_MODEL || (process.env.OPENROUTER_API_KEY ? 'openai/gpt-4o-mini' : 'gpt-4o-mini');

      const response = await fetch(fetchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: aiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error:', errorText);
        return NextResponse.json({ error: 'Failed to generate workflow via AI' }, { status: 500 });
      }

      const data = await response.json();
      content = data.choices[0].message.content.trim();
    }
    
    // Strip markdown formatting if the AI ignored the rule
    if (content.startsWith('\`\`\`json')) {
      content = content.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (content.startsWith('\`\`\`')) {
      content = content.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    const parsed = JSON.parse(content);
    const { usageLogs } = await import('@prompthub/database/src/schema/usage_logs');

    if (!hasCustomKey) {
      // 3. Escudo SaaS: Cobrança Atômica (Debitar 2 tokens)
      await db.update(users)
        .set({ credits: dbUser!.credits - 2 })
        .where(eq(users.id, user.id));
    }

    // 4. Central de Distribuição: Registrar Log de Uso
    await db.insert(usageLogs).values({
      userId: user.id,
      action: 'ai_generate',
      tokensSpent: hasCustomKey ? 0 : 2,
      keyType: hasCustomKey ? 'byok' : 'system'
    });

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Failed to generate AI workflow:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
