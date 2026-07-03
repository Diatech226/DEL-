import { apiDelete, apiGet } from '../lib/http';
import { mapApiAuditLogListToAdmin, mapApiAuditLogToAdmin } from '../mappers/audit.mapper';

export interface AuditFilters {
  module?: string;
  action?: string;
  actorRole?: string;
  entityType?: string;
  entityId?: string;
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: string | number;
}

function toQuery(filters: AuditFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') params.set(key, String(value).trim());
  });
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function getAuditLogs(filters: AuditFilters = {}) {
  const payload = await apiGet(`/api/audit-logs${toQuery(filters)}`);
  return mapApiAuditLogListToAdmin(payload);
}

export async function getAuditLogById(id: string) {
  const payload = await apiGet(`/api/audit-logs/${encodeURIComponent(id)}`);
  return mapApiAuditLogToAdmin(payload);
}

export async function getAuditLogsByEntity(entityType: string, entityId: string, filters: Pick<AuditFilters, 'limit'> = {}) {
  const payload = await apiGet(`/api/audit-logs/entity/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}${toQuery(filters)}`);
  return mapApiAuditLogListToAdmin(payload);
}

export async function deleteAuditLog(id: string) {
  const payload = await apiDelete(`/api/audit-logs/${encodeURIComponent(id)}`);
  return mapApiAuditLogToAdmin(payload);
}
