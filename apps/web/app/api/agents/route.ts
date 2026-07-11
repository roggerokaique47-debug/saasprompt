import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { agents } from '@prompthub/database/src/schema/agents';
import { users } from '@prompthub/database/src/schema/users';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const CreateAgentSchema = z.object({
  title: z.string().min(3, 'Título muito curto').max(100),
  description: z.string().max(500).optional(),
  color: z.string().optional(),
});

/**
 * GET /api/agents — Lista os agentes da organização do usuário logado
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [dbUser] = await db
      .select({ organizationId: users.organizationId })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }

    const orgAgents = await db
      .select()
      .from(agents)
      .where(eq(agents.organizationId, dbUser.organizationId))
      .orderBy(agents.createdAt);

    return NextResponse.json({ success: true, data: orgAgents });
  } catch (error) {
    console.error('[GET /api/agents] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/agents — Cria um novo agente na organização
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [dbUser] = await db
      .select({ organizationId: users.organizationId })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser?.organizationId) {
      return NextResponse.json({ error: 'Usuário não vinculado a uma organização.' }, { status: 403 });
    }

    const body = await request.json();
    const parsed = CreateAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, color } = parsed.data;

    // Gerar slug a partir do título
    const slug = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      + '-' + Date.now();

    const [newAgent] = await db
      .insert(agents)
      .values({
        title,
        description: description ?? null,
        slug,
        content: `Agente: ${title}`,
        authorId: user.id,
        organizationId: dbUser.organizationId,
        color: color ?? null,
      })
      .returning();

    return NextResponse.json({ success: true, data: newAgent }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/agents] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
