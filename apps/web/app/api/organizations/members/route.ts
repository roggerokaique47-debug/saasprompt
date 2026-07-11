import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { members, organizations } from '@prompthub/database/src/schema/organizations';
import { organizationInvites } from '@prompthub/database/src/schema/organization_invites';
import { users } from '@prompthub/database/src/schema/users';
import { getUserPrimaryOrgId, requireOrgRole } from '@prompthub/shared/src/rbac/guard';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const InviteSchema = z.object({
  email: z.string().email('Email inválido'),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
});

/**
 * GET /api/organizations/members
 * Lista todos os membros ativos da organização do usuário logado.
 * Exige: qualquer membro (viewer+)
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const organizationId = await getUserPrimaryOrgId(user.id);
    if (!organizationId) {
      return NextResponse.json({ error: 'Organização não encontrada.' }, { status: 404 });
    }

    await requireOrgRole(user.id, organizationId, 'viewer');

    // Buscar membros ativos com dados do usuário
    const orgMembers = await db
      .select({
        memberId: members.id,
        role: members.role,
        joinedAt: members.joinedAt,
        invitedAt: members.invitedAt,
        userId: members.userId,
        email: users.email,
        name: users.name,
        avatarUrl: users.avatarUrl,
      })
      .from(members)
      .innerJoin(users, eq(members.userId, users.id))
      .where(
        and(
          eq(members.organizationId, organizationId),
          eq(members.isActive, true),
        )
      );

    // Buscar convites pendentes
    const pendingInvites = await db
      .select({
        id: organizationInvites.id,
        email: organizationInvites.email,
        role: organizationInvites.role,
        expiresAt: organizationInvites.expiresAt,
        createdAt: organizationInvites.createdAt,
      })
      .from(organizationInvites)
      .where(
        and(
          eq(organizationInvites.organizationId, organizationId),
          // Apenas convites não aceitos
        )
      );

    return NextResponse.json({
      success: true,
      data: {
        members: orgMembers,
        pendingInvites,
      },
    });
  } catch (error: any) {
    if (error.message === 'NOT_MEMBER') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }
    console.error('[GET /api/organizations/members] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/organizations/members
 * Convida um novo membro para a organização.
 * Exige: admin ou owner
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const organizationId = await getUserPrimaryOrgId(user.id);
    if (!organizationId) {
      return NextResponse.json({ error: 'Organização não encontrada.' }, { status: 404 });
    }

    // Exige admin ou owner para convidar
    await requireOrgRole(user.id, organizationId, 'admin');

    const body = await request.json();
    const parsed = InviteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, role } = parsed.data;

    // Verificar se o email já é membro ativo
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      const [existingMember] = await db
        .select({ id: members.id })
        .from(members)
        .where(
          and(
            eq(members.organizationId, organizationId),
            eq(members.userId, existingUser.id),
            eq(members.isActive, true),
          )
        )
        .limit(1);

      if (existingMember) {
        return NextResponse.json(
          { error: 'Este usuário já é membro da organização.' },
          { status: 409 }
        );
      }
    }

    // Criar convite com token único e expiração de 7 dias
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const [invite] = await db
      .insert(organizationInvites)
      .values({
        organizationId,
        email,
        role,
        token,
        invitedById: user.id,
        expiresAt,
      })
      .returning();

    // TODO: Enviar email com link de convite:
    // `${process.env.NEXT_PUBLIC_APP_URL}/convite/${token}`
    // Por ora, retornamos o token na resposta para testes

    return NextResponse.json({
      success: true,
      data: {
        inviteId: invite.id,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
        // Em produção este token seria enviado apenas por email, não exposto na API
        inviteUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/convite/${token}`,
      },
      message: `Convite enviado para ${email}.`,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message?.startsWith('INSUFFICIENT_ROLE')) {
      return NextResponse.json({ error: 'Apenas admins podem convidar membros.' }, { status: 403 });
    }
    if (error.message === 'NOT_MEMBER') {
      return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 });
    }
    console.error('[POST /api/organizations/members] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
