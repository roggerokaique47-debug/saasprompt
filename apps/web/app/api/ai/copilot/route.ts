import { NextResponse } from 'next/server';
import { NodeType } from '@prompthub/engine';

import { AiCopilotSchema } from '@prompthub/shared/src/validations/apiSchema';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = AiCopilotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.format() }, { status: 400 });
    }

    const { nodes, edges } = parsed.data;

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
    const { organizations } = await import('@prompthub/database/src/schema/organizations');

    const userResult = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const dbUser = userResult.length > 0 ? userResult[0] : null;
    const organizationId = dbUser?.organizationId;

    if (!organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }

    const orgResult = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
    const dbOrg = orgResult.length > 0 ? orgResult[0] : null;

    const hasCustomKey = dbUser?.customAiKey && dbUser.customAiKey.trim().length > 0;

    if (!hasCustomKey && (!dbOrg || dbOrg.credits < 1)) {
      return NextResponse.json(
        { error: 'Créditos insuficientes para usar o Copilot. Adicione tokens na organização ou configure sua própria chave (Plano Enterprise).' },
        { status: 402 } // 402 Payment Required
      );
    }

    const systemApiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    const apiKey = hasCustomKey ? dbUser!.customAiKey : systemApiKey;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
    }

    const systemPrompt = `
You are a Workflow Copilot. The user is building a workflow automation. They will provide the current state of their workflow (the nodes and connections they have so far).
Your job is to analyze their workflow and suggest the ONE best NEXT node type to add to the flow, and briefly explain why.

Available node types: webhook, schedule, http_request, openai, gmail_send, gmail_read, google_sheets_read, google_sheets_write, whatsapp_send, filter, merge, code, delay, switch, slack_send, discord_send, email_smtp.

Return ONLY a valid JSON object with exactly these fields, and nothing else (no markdown formatting, no text before or after):
{
  "suggestedType": "<one of the valid types>",
  "reason": "Brief explanation of why this is a good next step"
}
`;

    const fetchUrl = process.env.OPENROUTER_API_KEY 
      ? 'https://openrouter.ai/api/v1/chat/completions' 
      : 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_API_KEY ? 'openai/gpt-4o-mini' : 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: JSON.stringify({ nodes, edges }) }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      return NextResponse.json({ error: 'Failed to generate copilot suggestion' }, { status: 500 });
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    if (content.startsWith('\`\`\`json')) {
      content = content.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    } else if (content.startsWith('\`\`\`')) {
      content = content.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '').trim();
    }

    const llmParsed = JSON.parse(content);

    if (!hasCustomKey) {
      // 3. Escudo SaaS: Cobrança Atômica (Debitar 1 token da organizacao)
      await db.update(organizations)
        .set({ credits: dbOrg!.credits - 1 })
        .where(eq(organizations.id, organizationId));
    }

    // 4. Central de Distribuição: Registrar Log de Uso
    const { usageLogs } = await import('@prompthub/database/src/schema/usage_logs');
    if (organizationId) {
      await db.insert(usageLogs).values({
        organizationId: organizationId,
        action: 'ai_copilot',
        creditsSpent: hasCustomKey ? 0 : 1,
        keyType: hasCustomKey ? 'byok' : 'system'
      });
    }

    return NextResponse.json(llmParsed);
  } catch (error) {
    console.error('Failed to generate Copilot suggestion:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}
