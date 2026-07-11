import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { WorkflowGenerator } from '@prompthub/shared/src/ai/workflow-generator';
import { CreditManager } from '@prompthub/payments/src/credit-manager';
import { checkRateLimit } from '@prompthub/shared/src/rate-limit';
import db from '@prompthub/database/src/client';
import { users } from '@prompthub/database/src/schema/users';
import { eq } from 'drizzle-orm';

import { AiGenerateWorkflowSchema } from '@prompthub/shared/src/validations/apiSchema';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = AiGenerateWorkflowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Descreva o que o workflow deve fazer.' }, { status: 400 });
    }

    const { prompt } = parsed.data;

    // Rate Limit
    const rateLimitResult = await checkRateLimit(`ai_gen_${user.id}`, 20, '1 m');
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 });
    }

    // Buscar a organização do usuário logado para débito de créditos corporativos (B2B)
    const [dbUser] = await db.select({ organizationId: users.organizationId }).from(users).where(eq(users.id, user.id)).limit(1);
    
    if (!dbUser?.organizationId) {
       return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }

    // Tentar deduzir o crédito da Organização (custa 1 crédito a geração via IA Generativa)
    try {
      await CreditManager.deductCredits(dbUser.organizationId, 1);
    } catch (paymentError: any) {
      return NextResponse.json({ error: paymentError.message || 'Saldo corporativo insuficiente.' }, { status: 402 });
    }

    // Utilizando o gerador robusto (com Vercel AI SDK e tipagem Zod estrita)
    const generatedWorkflow = await WorkflowGenerator.generateFromText(prompt);

    return NextResponse.json(generatedWorkflow);
  } catch (error) {
    console.error('[AI Generate Workflow] Error:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar workflow com IA.', details: (error as Error).message },
      { status: 500 }
    );
  }
}

