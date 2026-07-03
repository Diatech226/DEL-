import { normalizeStatus } from '../constants/status';
import type { Proposal } from '../types';

const arr = (value: unknown): any[] => Array.isArray(value) ? value : [];
const idOf = (value: any) => typeof value === 'object' && value !== null ? String(value._id ?? value.id ?? '') : String(value ?? '');

export function mapApiProposalToAdmin(apiProposal: any): Proposal {
  const equipmentIds = arr(apiProposal?.equipmentIds).map(idOf).filter(Boolean);
  return {
    id: String(apiProposal?._id ?? apiProposal?.id ?? ''),
    code: String(apiProposal?.code ?? apiProposal?._id ?? apiProposal?.id ?? 'PRO-API'),
    title: apiProposal?.title ?? 'Proposition DEL',
    requestId: idOf(apiProposal?.requestId),
    requestTitle: apiProposal?.requestTitle ?? apiProposal?.request?.title ?? 'Demande liée',
    tenderId: idOf(apiProposal?.tenderId),
    tenderLotId: idOf(apiProposal?.tenderLotId),
    engineId: equipmentIds[0] ?? '',
    engineName: apiProposal?.engineName ?? apiProposal?.equipment?.title ?? equipmentIds.join(', ') ?? 'Engin à confirmer',
    equipmentIds,
    companyName: apiProposal?.companyName ?? 'Entreprise à confirmer',
    companyUserId: idOf(apiProposal?.companyUserId),
    ownerNames: arr(apiProposal?.ownerNames),
    ownerUserIds: arr(apiProposal?.ownerUserIds).map(idOf).filter(Boolean),
    dailyRate: Number(apiProposal?.dailyRate ?? apiProposal?.finalPrice ?? 0),
    transportCost: Number(apiProposal?.transportCost ?? 0),
    otherCosts: Number(apiProposal?.otherCosts ?? 0),
    totalEstimated: Number(apiProposal?.totalEstimated ?? apiProposal?.finalPrice ?? 0),
    finalPrice: Number(apiProposal?.finalPrice ?? 0),
    currency: apiProposal?.currency ?? 'XOF',
    durationMonths: Number(apiProposal?.durationMonths ?? 0),
    status: normalizeStatus(apiProposal?.status),
    workflowStatus: normalizeStatus(apiProposal?.workflowStatus),
    companyDecision: apiProposal?.companyDecision ?? { status: 'PENDING' },
    ownerDecisions: arr(apiProposal?.ownerDecisions),
    validUntil: apiProposal?.validUntil ?? '',
    createdAt: apiProposal?.createdAt ?? '',
    updatedAt: apiProposal?.updatedAt ?? '',
  };
}

export function mapApiProposalListToAdmin(apiItems: any): Proposal[] {
  return arr(apiItems).map(mapApiProposalToAdmin);
}
