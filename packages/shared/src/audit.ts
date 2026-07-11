import db from '@prompthub/database/src/client';
import { auditLogs } from '@prompthub/database/src/schema/audit_logs';

interface AuditLogPayload {
  organizationId: string;
  userId?: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'BILLING' | 'SETTINGS_CHANGED';
  tableName: string;
  oldData?: any;
  newData?: any;
  ip?: string;
  userAgent?: string;
}

export async function logAudit(payload: AuditLogPayload) {
  try {
    await db.insert(auditLogs).values({
      organizationId: payload.organizationId,
      userId: payload.userId,
      action: payload.action,
      tableName: payload.tableName,
      oldData: payload.oldData ? JSON.parse(JSON.stringify(payload.oldData)) : null,
      newData: payload.newData ? JSON.parse(JSON.stringify(payload.newData)) : null,
      ip: payload.ip,
      userAgent: payload.userAgent,
    });
  } catch (error) {
    console.error('[Audit Logger] Failed to save audit log:', error);
    // Não lançamos erro para não quebrar a funcionalidade base
  }
}
