import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { feedbacks } from '@prompthub/database/src/schema/feedbacks';
import { users } from '@prompthub/database/src/schema/users';

import { FeedbacksSchema } from '@prompthub/shared/src/validations/apiSchema';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = FeedbacksSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Tipo e mensagem são obrigatórios.' }, { status: 400 });
    }

    const { type, message } = parsed.data;

    // Autenticação Real B2B via Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const userId = user.id;

    // Buscar organizationId
    const { eq } = await import('drizzle-orm');
    const [dbUser] = await db.select({ organizationId: users.organizationId }).from(users).where(eq(users.id, userId)).limit(1);
    
    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }

    await db.insert(feedbacks).values({
      userId,
      organizationId: dbUser.organizationId,
      type,
      message,
    });

    return NextResponse.json({ success: true, message: 'Feedback enviado com sucesso!' });

  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: 'Falha ao enviar feedback', details: (error as Error).message },
      { status: 500 }
    );
  }
}
