import { apiGet, apiPatch } from '../lib/http';
import { mapApiEquipmentListToAdmin, mapApiEquipmentToAdmin } from '../mappers/equipment.mapper';
const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export async function getEquipmentList(params?: Record<string, string>) { return mapApiEquipmentListToAdmin(await apiGet(`/api/equipment${q(params)}`)); }
export async function getEquipmentById(id: string) { return mapApiEquipmentToAdmin(await apiGet(`/api/equipment/${id}`)); }
export function updateEquipmentStatus(id: string, status: string) { return apiPatch(`/api/equipment/${id}/status`, { status }); }
