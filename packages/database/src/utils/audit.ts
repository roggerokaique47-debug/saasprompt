import db from '../client';
import { auditLogs } from '../schema/audit_logs';

export type AuditContext = {
  organizationId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
};

/**
 * Cria um registro de auditoria.
 * DEVE ser chamado dentro de uma transaction ao alterar dados críticos.
 */
export async function createAuditLog(
  tx: any, 
  context: AuditContext, 
  action: 'INSERT' | 'UPDATE' | 'DELETE', 
  tableName: string, 
  oldData: any = null, 
  newData: any = null
) {
  const dbOrTx = tx || db;
  await dbOrTx.insert(auditLogs).values({
    organizationId: context.organizationId,
    userId: context.userId,
    action,
    tableName,
    oldData,
    newData,
    ip: context.ip,
    userAgent: context.userAgent,
  });
}
