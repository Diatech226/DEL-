const asArray = (value: any) => Array.isArray(value) ? value : [];
const pickItems = (items: any) => Array.isArray(items?.data) ? items.data : Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : [];

export const mapApiProposalToDesign = (item: any) => ({
  ...item,
  id: String(item?._id || item?.id || ''),
  title: item?.title || 'Proposition DEL',
  requestId: item?.requestId,
  tenderId: item?.tenderId,
  tenderLotId: item?.tenderLotId,
  companyName: item?.companyName || 'Entreprise à confirmer',
  equipmentIds: asArray(item?.equipmentIds),
  ownerNames: asArray(item?.ownerNames),
  finalPrice: Number(item?.finalPrice ?? 0),
  currency: item?.currency || 'XOF',
  durationMonths: item?.durationMonths,
  conditions: item?.conditions,
  status: item?.status || 'UNKNOWN',
  workflowStatus: item?.workflowStatus || 'UNKNOWN',
  companyDecision: item?.companyDecision,
  ownerDecisions: asArray(item?.ownerDecisions),
  createdAt: item?.createdAt,
});

export const mapApiProposalListToDesign = (items: any) => pickItems(items).map(mapApiProposalToDesign);
