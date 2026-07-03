import type { AuditLog } from '../types';

const valueOrFallback = (value: any, fallback: string) => {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
};

export function mapApiAuditLogToAdmin(apiLog: any): AuditLog {
  return {
    id: valueOrFallback(apiLog?._id ?? apiLog?.id, `audit-${Date.now()}`),
    actorUserId: apiLog?.actorUserId ? String(apiLog.actorUserId) : undefined,
    actorName: valueOrFallback(apiLog?.actorName, 'Système DEL'),
    actorRole: valueOrFallback(apiLog?.actorRole, 'SYSTEM'),
    action: valueOrFallback(apiLog?.action, 'SYSTEM'),
    module: valueOrFallback(apiLog?.module, 'SYSTEM'),
    entityType: apiLog?.entityType ? String(apiLog.entityType) : undefined,
    entityId: apiLog?.entityId ? String(apiLog.entityId) : undefined,
    entityLabel: apiLog?.entityLabel ? String(apiLog.entityLabel) : undefined,
    oldValue: apiLog?.oldValue,
    newValue: apiLog?.newValue,
    message: valueOrFallback(apiLog?.message, 'Action enregistrée'),
    ipAddress: apiLog?.ipAddress ? String(apiLog.ipAddress) : undefined,
    userAgent: apiLog?.userAgent ? String(apiLog.userAgent) : undefined,
    severity: valueOrFallback(apiLog?.severity, 'NORMAL'),
    createdAt: valueOrFallback(apiLog?.createdAt, new Date().toISOString()),
    user: valueOrFallback(apiLog?.actorName, 'Système DEL'),
    category: 'Sécurité',
    timestamp: valueOrFallback(apiLog?.createdAt, new Date().toISOString()),
    details: valueOrFallback(apiLog?.message, 'Action enregistrée'),
  };
}

export function mapApiAuditLogListToAdmin(apiItems: any): AuditLog[] {
  const items = Array.isArray(apiItems) ? apiItems : apiItems?.data || apiItems?.items || [];
  return items.map(mapApiAuditLogToAdmin);
}
