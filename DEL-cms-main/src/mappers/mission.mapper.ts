import { normalizeStatus } from '../constants/status';
import type { Mission } from '../types';

const arr = (value: unknown): any[] => Array.isArray(value) ? value : [];
const idOf = (value: any) => typeof value === 'object' && value !== null ? String(value._id ?? value.id ?? '') : String(value ?? '');

export function mapApiMissionToAdmin(apiMission: any): Mission {
  const equipmentIds = arr(apiMission?.equipmentIds ?? apiMission?.equipmentId ? apiMission?.equipmentIds ?? [apiMission?.equipmentId] : []).map(idOf).filter(Boolean);
  return {
    id: String(apiMission?._id ?? apiMission?.id ?? ''),
    code: apiMission?.missionNumber ?? 'Non générée',
    missionNumber: apiMission?.missionNumber ?? 'Non générée',
    title: apiMission?.title ?? 'Mission DEL',
    contractId: idOf(apiMission?.contractId),
    contractCode: apiMission?.contractNumber ?? idOf(apiMission?.contractId),
    requestId: idOf(apiMission?.requestId),
    proposalId: idOf(apiMission?.proposalId),
    equipmentIds,
    companyName: apiMission?.companyName ?? 'Entreprise à confirmer',
    ownerNames: arr(apiMission?.ownerNames),
    missionType: apiMission?.missionType ?? 'GENERAL',
    country: apiMission?.country ?? 'Burkina Faso',
    city: apiMission?.city ?? '',
    siteName: apiMission?.siteName ?? '',
    siteLocationText: apiMission?.siteLocationText ?? '',
    plannedStartDate: apiMission?.plannedStartDate ?? apiMission?.startDate ?? '',
    plannedEndDate: apiMission?.plannedEndDate ?? apiMission?.endDate ?? '',
    actualStartDate: apiMission?.actualStartDate ?? '',
    actualEndDate: apiMission?.actualEndDate ?? '',
    totalDistanceKm: Number(apiMission?.totalDistanceKm ?? 0),
    totalEngineHours: Number(apiMission?.totalEngineHours ?? 0),
    totalFuelLiters: Number(apiMission?.totalFuelLiters ?? 0),
    status: normalizeStatus(apiMission?.status),
    notes: apiMission?.notes ?? '',
    createdAt: apiMission?.createdAt ?? '',
    updatedAt: apiMission?.updatedAt ?? '',
    engineId: equipmentIds[0] ?? '',
    engineName: apiMission?.engineName ?? equipmentIds[0] ?? 'Engin à confirmer',
    description: apiMission?.notes ?? '',
    startDate: apiMission?.plannedStartDate ?? apiMission?.startDate ?? '',
    endDate: apiMission?.plannedEndDate ?? apiMission?.endDate ?? '',
    progress: apiMission?.status === 'COMPLETED' ? 100 : 0,
  };
}

export function mapApiMissionListToAdmin(apiItems: any): Mission[] { return arr(apiItems).map(mapApiMissionToAdmin); }
