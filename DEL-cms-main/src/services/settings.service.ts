import { apiGet, apiPatch, apiPost } from '../lib/http';
import { mapAdminFormToApiSettingsPayload, type AdminSettingsForm } from '../mappers/settings.mapper';

export function getAdminSettings() {
  return apiGet('/api/settings/admin');
}

export function updateAdminSettings(payload: AdminSettingsForm) {
  return apiPatch('/api/settings/admin', mapAdminFormToApiSettingsPayload(payload));
}

export function resetSettingsToDefault() {
  return apiPost('/api/settings/reset');
}
