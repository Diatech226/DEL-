import { ApiError, getApiBaseUrl, getToken } from '../lib/http';

export type ExportResource = 'equipment' | 'requests' | 'tenders' | 'proposals' | 'contracts' | 'invoices' | 'payments' | 'missions' | 'maintenance' | 'documents' | 'users' | 'audit-logs' | 'full-backup';
export type ExportFormat = 'csv' | 'json';
export interface ExportFilters { dateFrom?: string; dateTo?: string; status?: string; limit?: string | number; }

const labels: Record<ExportResource, string> = {
  equipment: 'engins', requests: 'demandes', tenders: 'appels-offres', proposals: 'propositions', contracts: 'contrats', invoices: 'factures', payments: 'paiements', missions: 'missions', maintenance: 'maintenance', documents: 'documents', users: 'utilisateurs', 'audit-logs': 'audit-logs', 'full-backup': 'full-backup'
};

function buildExportUrl(resource: ExportResource, format: ExportFormat, filters: ExportFilters) {
  const params = new URLSearchParams();
  if (resource !== 'full-backup') params.set('format', format);
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') params.set(key, String(value).trim());
  });
  const query = params.toString();
  return `${getApiBaseUrl()}/api/exports/${resource}${query ? `?${query}` : ''}`;
}

function filenameFromDisposition(disposition: string | null, resource: ExportResource, format: ExportFormat) {
  const match = disposition?.match(/filename="?([^";]+)"?/i);
  return match?.[1] || `DEL-${labels[resource]}-${new Date().toISOString().slice(0, 10)}.${resource === 'full-backup' ? 'json' : format}`;
}

export async function downloadExport(resource: ExportResource, format: ExportFormat = 'csv', filters: ExportFilters = {}) {
  const finalFormat: ExportFormat = resource === 'full-backup' ? 'json' : format;
  const token = getToken();
  const response = await fetch(buildExportUrl(resource, finalFormat, filters), { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!response.ok) {
    let message = response.status === 401 ? 'Session expirée. Veuillez vous reconnecter.' : response.status === 403 ? 'Accès réservé aux administrateurs DEL.' : response.status >= 500 ? 'Erreur serveur DEL-api pendant l’export.' : 'Export DEL-api impossible.';
    try { const payload = await response.json(); message = payload?.message || message; } catch {}
    throw new ApiError(message, response.status);
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filenameFromDisposition(response.headers.get('Content-Disposition'), resource, finalFormat);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
