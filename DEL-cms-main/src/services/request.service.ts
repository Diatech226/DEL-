import { apiGet, apiPatch } from '../lib/http';
import { mapApiRequestListToAdmin, mapApiRequestToAdmin } from '../mappers/request.mapper';
const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export async function getRequestList(params?: Record<string, string>) { return mapApiRequestListToAdmin(await apiGet(`/api/requests${q(params)}`)); }
export async function getRequestById(id: string) { return mapApiRequestToAdmin(await apiGet(`/api/requests/${id}`)); }
export function updateRequestStatus(id: string, status: string) { return apiPatch(`/api/requests/${id}/status`, { status }); }
