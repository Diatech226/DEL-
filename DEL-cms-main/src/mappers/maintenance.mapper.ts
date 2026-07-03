import { normalizeStatus } from '../constants/status';
import type { Maintenance } from '../types';

const arr = (value: unknown): any[] => Array.isArray(value) ? value : [];
const idOf = (value: any) => typeof value === 'object' && value !== null ? String(value._id ?? value.id ?? '') : String(value ?? '');

export function mapApiMaintenanceToAdmin(apiMaintenance: any): Maintenance {
  return {
    id: String(apiMaintenance?._id ?? apiMaintenance?.id ?? ''),
    code: apiMaintenance?.ticketNumber ?? 'Non généré',
    ticketNumber: apiMaintenance?.ticketNumber ?? 'Non généré',
    title: apiMaintenance?.title ?? 'Ticket maintenance DEL',
    equipmentId: idOf(apiMaintenance?.equipmentId),
    equipmentTitle: apiMaintenance?.equipmentTitle ?? apiMaintenance?.engineName ?? 'Engin à confirmer',
    engineId: idOf(apiMaintenance?.equipmentId),
    engineName: apiMaintenance?.equipmentTitle ?? apiMaintenance?.engineName ?? 'Engin à confirmer',
    missionId: idOf(apiMaintenance?.missionId),
    contractId: idOf(apiMaintenance?.contractId),
    ownerName: apiMaintenance?.ownerName ?? 'Propriétaire à confirmer',
    companyName: apiMaintenance?.companyName ?? 'Entreprise à confirmer',
    issueType: apiMaintenance?.issueType ?? apiMaintenance?.type ?? 'BREAKDOWN',
    severity: normalizeStatus(apiMaintenance?.severity ?? 'MEDIUM'),
    description: apiMaintenance?.description ?? '',
    diagnostic: apiMaintenance?.diagnostic ?? apiMaintenance?.diagnosis ?? '',
    estimatedCost: Number(apiMaintenance?.estimatedCost ?? apiMaintenance?.cost ?? 0),
    finalCost: Number(apiMaintenance?.finalCost ?? 0),
    currency: apiMaintenance?.currency ?? 'XOF',
    workshop: apiMaintenance?.workshop ?? apiMaintenance?.workshopName ?? '',
    technicianName: apiMaintenance?.technicianName ?? '',
    technicianId: idOf(apiMaintenance?.technicianId),
    actualDowntimeHours: Number(apiMaintenance?.actualDowntimeHours ?? 0),
    status: normalizeStatus(apiMaintenance?.status),
    notes: apiMaintenance?.notes ?? '',
    createdAt: apiMaintenance?.createdAt ?? '',
    updatedAt: apiMaintenance?.updatedAt ?? '',
    type: apiMaintenance?.issueType ?? 'BREAKDOWN',
    scheduledDate: apiMaintenance?.scheduledDate ?? apiMaintenance?.createdAt ?? '',
    completedDate: apiMaintenance?.completedDate,
    cost: Number(apiMaintenance?.estimatedCost ?? apiMaintenance?.cost ?? 0),
  };
}

export function mapApiMaintenanceListToAdmin(apiItems: any): Maintenance[] { return arr(apiItems).map(mapApiMaintenanceToAdmin); }
