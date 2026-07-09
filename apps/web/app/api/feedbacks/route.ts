import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { feedbacks } from '@prompthub/database/src/schema/feedbacks';
import { users } from '@prompthub/database/src/schema/users';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, message } = body;

    if (!type || !message) {
      return NextResponse.json({ error: 'Tipo e mensagem são obrigatórios.' }, { status: 400 });
    }

    // Autenticação Real B2B via Supabase
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const userId = user.id;

    await db.insert(feedbacks).values({
      userId,
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
