import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { leads } from '@prompthub/database/src/schema/leads';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email) {
      return NextResponse.json({ error: 'E-mail é obrigatório.' }, { status: 400 });
    }

    // Insere o lead. O banco gerencia o unique email, se der erro capturamos.
    try {
      await db.insert(leads).values({
        email,
        source: source || 'landing_page',
      });
    } catch (e: any) {
      // Postgres error code para unique_violation é 23505
      if (e.code === '23505') {
        return NextResponse.json({ error: 'Este e-mail já está cadastrado.' }, { status: 409 });
      }
      throw e;
    }

    return NextResponse.json({ success: true, message: 'Cadastrado com sucesso!' });

  } catch (error) {
    console.error('Leads error:', error);
    return NextResponse.json(
      { error: 'Falha ao cadastrar lead', details: (error as Error).message },
      { status: 500 }
    );
  }
}
