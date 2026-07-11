import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { organizationInvites } from '@prompthub/database/src/schema/organization_invites';
import { members } from '@prompthub/database/src/schema/organizations';
import { users } from '@prompthub/database/src/schema/users';
import { eq, and, isNull, gte } from 'drizzle-orm';

/**
 * POST /api/organizations/invites/[token]/accept
 * O usuário logado aceita o convite referenciado pelo token.
 */
export async function POST(
  _request: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Você precisa estar logado para aceitar um convite.' },
        { status: 401 }
      );
    }


    const now = new Date();

    // Buscar o convite (deve estar pendente e não expirado)
    const [invite] = await db
      .select()
      .from(organizationInvites)
      .where(
        and(
          eq(organizationInvites.token, token),
          isNull(organizationInvites.acceptedAt),
          gte(organizationInvites.expiresAt, now),
        )
      )
      .limit(1);

    if (!invite) {
      return NextResponse.json(
        { error: 'Convite inválido, já aceito ou expirado.' },
        { status: 404 }
      );
    }

    // Verificar se o email do convite bate com o usuário logado
    const [dbUser] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser || dbUser.email.toLowerCase() !== invite.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Este convite foi enviado para outro email.' },
        { status: 403 }
      );
    }

    // Verificar se já não é membro
    const [existingMember] = await db
      .select({ id: members.id })
      .from(members)
      .where(
        and(
          eq(members.organizationId, invite.organizationId),
          eq(members.userId, user.id),
          eq(members.isActive, true),
        )
      )
      .limit(1);

    if (existingMember) {
      return NextResponse.json(
        { error: 'Você já é membro desta organização.' },
        { status: 409 }
      );
    }

    // Transação: criar membro + marcar convite como aceito
    await db.transaction(async (tx) => {
      await tx.insert(members).values({
        organizationId: invite.organizationId,
        userId: user.id,
        role: invite.role,
        joinedAt: now,
      });

      await tx
        .update(organizationInvites)
        .set({ acceptedAt: now })
        .where(eq(organizationInvites.id, invite.id));

      // Atualizar o organizationId principal do usuário
      await tx
        .update(users)
        .set({ organizationId: invite.organizationId })
        .where(eq(users.id, user.id));
    });

    return NextResponse.json({
      success: true,
      message: 'Convite aceito com sucesso! Bem-vindo à organização.',
      data: {
        organizationId: invite.organizationId,
        role: invite.role,
      },
    });
  } catch (error) {
    console.error('[POST /api/organizations/invites/[token]/accept] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
