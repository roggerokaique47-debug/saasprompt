import { NextResponse } from 'next/server';
import db from '@prompthub/database/src/client';
import { leads } from '@prompthub/database/src/schema/leads';

import { LeadsSchema } from '@prompthub/shared/src/validations/apiSchema';

export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const parsed = LeadsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'E-mail é obrigatório e deve ser válido.' }, { status: 400 });
    }

    const { email, source, organizationId: bodyOrgId } = parsed.data;

    // Insere o lead. O banco gerencia o unique email, se der erro capturamos.
    try {
      const organizationId = req.headers.get('x-organization-id') || bodyOrgId;
      if (!organizationId) {
        return NextResponse.json({ error: 'organizationId é obrigatório' }, { status: 400 });
      }

      await db.insert(leads).values({
        organizationId,
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
