import { apiGet, apiPatch, apiPost } from '../lib/http';
import { mapApiMissionListToAdmin, mapApiMissionToAdmin } from '../mappers/mission.mapper';

const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export type MissionCreatePayload = { title?: string; missionType?: string; country?: string; city?: string; siteName?: string; siteLocationText?: string; plannedStartDate?: string; plannedEndDate?: string; notes?: string };

export async function getMissionList(params?: Record<string, string>) { return mapApiMissionListToAdmin(await apiGet(`/api/missions${q(params)}`)); }
export async function getMissionById(id: string) { return mapApiMissionToAdmin(await apiGet(`/api/missions/${id}`)); }
export async function createMissionFromContract(contractId: string, payload: MissionCreatePayload) { return mapApiMissionToAdmin(await apiPost(`/api/contracts/${contractId}/missions`, payload)); }
export async function updateMission(id: string, payload: Partial<MissionCreatePayload>) { return mapApiMissionToAdmin(await apiPatch(`/api/missions/${id}`, payload)); }
export async function updateMissionStatus(id: string, status: string) { return mapApiMissionToAdmin(await apiPatch(`/api/missions/${id}/status`, { status })); }
