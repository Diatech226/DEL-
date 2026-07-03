import { Proposal } from '../types';

const arr = (value: any) => Array.isArray(value) ? value : value ? [value] : [];
const idOf = (value: any) => String(value?._id || value?.id || value || '');

export function mapApiProposalToAdmin(apiProposal: any): Proposal {
  const id = idOf(apiProposal);
  const ownerDecisions = arr(apiProposal?.ownerDecisions);
  const ownerNames = arr(apiProposal?.ownerNames?.length ? apiProposal.ownerNames : ownerDecisions.map((decision: any) => decision?.ownerName)).filter(Boolean);
  const equipmentIds = arr(apiProposal?.equipmentIds).map(idOf).filter(Boolean);
  const title = apiProposal?.title || 'Proposition DEL';
  const finalPrice = Number(apiProposal?.finalPrice ?? apiProposal?.priceOffered ?? apiProposal?.totalEstimated ?? 0);
  const currency = apiProposal?.currency || 'XOF';

  return {
    id,
    code: apiProposal?.code || apiProposal?.proposalNumber || `PRO-${id.slice(-6) || 'API'}`,
    requestId: idOf(apiProposal?.requestId),
    requestTitle: title,
    engineId: equipmentIds[0] || '',
    engineName: equipmentIds.length ? equipmentIds.join(', ') : 'Engins à confirmer',
    companyName: apiProposal?.companyName || apiProposal?.company?.name || 'Entreprise à confirmer',
    dailyRate: finalPrice,
    transportCost: Number(apiProposal?.transportCost || 0),
    otherCosts: Number(apiProposal?.otherCosts || 0),
    totalEstimated: finalPrice,
    status: apiProposal?.status || 'UNKNOWN',
    validUntil: apiProposal?.validUntil?.slice?.(0, 10) || '',
    createdAt: apiProposal?.createdAt?.slice?.(0, 10) || '',
    title,
    tenderId: idOf(apiProposal?.tenderId),
    tenderLotId: idOf(apiProposal?.tenderLotId),
    companyUserId: idOf(apiProposal?.companyUserId),
    equipmentIds,
    ownerNames,
    ownerUserIds: arr(apiProposal?.ownerUserIds).map(idOf).filter(Boolean),
    finalPrice,
    currency,
    durationMonths: Number(apiProposal?.durationMonths || 0),
    workflowStatus: apiProposal?.workflowStatus || 'UNKNOWN',
    companyDecision: apiProposal?.companyDecision || { status: 'UNKNOWN' },
    ownerDecisions,
    updatedAt: apiProposal?.updatedAt || '',
  };
}

export const mapApiProposalListToAdmin = (apiItems: any[] = []) => apiItems.map(mapApiProposalToAdmin);
