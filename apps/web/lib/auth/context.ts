import { createClient } from '../supabase/server';
import db from '@prompthub/database/src/client';
import { organizations, members } from '@prompthub/database/src/schema/organizations';
import { eq, or, and } from 'drizzle-orm';

/**
 * Retorna o ID da organização atual do usuário logado.
 * Implementa Zero Trust: Valida se o usuário tem permissão REAL
 * para acessar a organização (é dono ou membro ativo).
 */
export async function requireOrganizationContext(): Promise<{ userId: string; organizationId: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Zero Trust: Nunca confie que o usuário enviará a org correta no cookie ou header
  // sempre verifique no banco a relação do usuário com as organizações.
  
  // Por enquanto pegamos a organização default do usuário.
  // Se o frontend enviasse um X-Org-ID, validaríamos se o user.id tem permissão nela.
  
  const orgs = await db.select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.ownerId, user.id))
    .limit(1);

  if (orgs.length > 0) {
    return { userId: user.id, organizationId: orgs[0].id };
  }

  // Check if member
  const memberOrgs = await db.select({ id: members.organizationId })
    .from(members)
    .where(and(eq(members.userId, user.id), eq(members.isActive, true)))
    .limit(1);

  if (memberOrgs.length > 0) {
    return { userId: user.id, organizationId: memberOrgs[0].id };
  }

  throw new Error('User has no active organization');
}
