import db from '@prompthub/database/src/client';
import { organizations } from '@prompthub/database/src/schema/organizations';
import { eq, sql } from 'drizzle-orm';

export class CreditManager {
  /**
   * Verifica se a organização tem saldo suficiente.
   */
  static async hasEnoughCredits(organizationId: string, cost: number = 1): Promise<boolean> {
    const orgs = await db
      .select({ credits: organizations.credits })
      .from(organizations)
      .where(eq(organizations.id, organizationId))
      .limit(1);

    if (orgs.length === 0) return false;

    return orgs[0].credits >= cost;
  }

  /**
   * Abate créditos de uma organização de forma atômica.
   * Lança exceção se não houver saldo.
   */
  static async deductCredits(organizationId: string, cost: number = 1): Promise<void> {
    const result = await db
      .update(organizations)
      .set({
        credits: sql`${organizations.credits} - ${cost}`,
      })
      .where(
        sql`${organizations.id} = ${organizationId} AND ${organizations.credits} >= ${cost}`
      )
      .returning({ id: organizations.id });

    if (result.length === 0) {
      throw new Error('Insufficient credits or organization not found.');
    }
  }

  /**
   * Adiciona créditos a uma organização.
   */
  static async addCredits(organizationId: string, amount: number): Promise<void> {
    await db
      .update(organizations)
      .set({
        credits: sql`${organizations.credits} + ${amount}`,
      })
      .where(eq(organizations.id, organizationId));
  }
}
