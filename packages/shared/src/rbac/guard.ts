import db from '@prompthub/database/src/client';
import { members, organizations } from '@prompthub/database/src/schema/organizations';
import { users } from '@prompthub/database/src/schema/users';
import { eq, and } from 'drizzle-orm';

export type OrgRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface OrgContext {
  organizationId: string;
  userId: string;
  role: OrgRole;
  isOwner: boolean;
}

/**
 * Busca o contexto RBAC do usuário dentro de uma organização.
 * Retorna null se o usuário não for membro.
 */
export async function getOrgContext(userId: string, organizationId: string): Promise<OrgContext | null> {
  // Verificar se é o Owner da organização
  const [org] = await db
    .select({ ownerId: organizations.ownerId })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  if (!org) return null;

  if (org.ownerId === userId) {
    return { organizationId, userId, role: 'owner', isOwner: true };
  }

  // Verificar se é membro
  const [member] = await db
    .select({ role: members.role, isActive: members.isActive })
    .from(members)
    .where(
      and(
        eq(members.organizationId, organizationId),
        eq(members.userId, userId),
        eq(members.isActive, true),
      )
    )
    .limit(1);

  if (!member) return null;

  return {
    organizationId,
    userId,
    role: member.role as OrgRole,
    isOwner: false,
  };
}

/**
 * Verifica se o usuário logado tem a permissão mínima exigida.
 * Hierarquia: owner > admin > editor > viewer
 */
const ROLE_HIERARCHY: Record<OrgRole, number> = {
  owner: 100,
  admin: 80,
  editor: 50,
  viewer: 10,
};

export function hasPermission(userRole: OrgRole, requiredRole: OrgRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Guard completo: busca o contexto e verifica se o usuário tem permissão mínima.
 * Retorna o contexto se autorizado, null se não for membro, e lança erro se nível insuficiente.
 */
export async function requireOrgRole(
  userId: string,
  organizationId: string,
  minRole: OrgRole = 'viewer',
): Promise<OrgContext> {
  const ctx = await getOrgContext(userId, organizationId);

  if (!ctx) {
    throw new Error('NOT_MEMBER');
  }

  if (!hasPermission(ctx.role, minRole)) {
    throw new Error(`INSUFFICIENT_ROLE: requires ${minRole}, has ${ctx.role}`);
  }

  return ctx;
}

/**
 * Busca a organização primária do usuário (o `organizationId` salvo no perfil do usuário).
 */
export async function getUserPrimaryOrgId(userId: string): Promise<string | null> {
  const [dbUser] = await db
    .select({ organizationId: users.organizationId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return dbUser?.organizationId ?? null;
}
