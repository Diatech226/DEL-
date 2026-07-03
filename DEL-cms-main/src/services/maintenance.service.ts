import { apiGet, apiPatch, apiPost } from '../lib/http';
import { mapApiMaintenanceListToAdmin, mapApiMaintenanceToAdmin } from '../mappers/maintenance.mapper';

const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export type MaintenanceCreatePayload = { equipmentId?: string; missionId?: string; contractId?: string; title?: string; issueType?: string; severity?: string; description?: string; diagnostic?: string; estimatedCost?: number; currency?: string; workshop?: string; technicianName?: string; notes?: string };

export async function getMaintenanceList(params?: Record<string, string>) { return mapApiMaintenanceListToAdmin(await apiGet(`/api/maintenance${q(params)}`)); }
export async function getMaintenanceById(id: string) { return mapApiMaintenanceToAdmin(await apiGet(`/api/maintenance/${id}`)); }
export async function getMaintenanceByEquipment(equipmentId: string) { return mapApiMaintenanceListToAdmin(await apiGet(`/api/maintenance/equipment/${equipmentId}`)); }
export async function getMaintenanceByMission(missionId: string) { return mapApiMaintenanceListToAdmin(await apiGet(`/api/maintenance/mission/${missionId}`)); }
export async function createMaintenanceTicket(payload: MaintenanceCreatePayload) { return mapApiMaintenanceToAdmin(await apiPost('/api/maintenance', payload)); }
export async function updateMaintenanceTicket(id: string, payload: Partial<MaintenanceCreatePayload>) { return mapApiMaintenanceToAdmin(await apiPatch(`/api/maintenance/${id}`, payload)); }
export async function updateMaintenanceStatus(id: string, status: string) { return mapApiMaintenanceToAdmin(await apiPatch(`/api/maintenance/${id}/status`, { status })); }
