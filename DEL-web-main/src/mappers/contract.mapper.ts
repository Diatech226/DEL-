const asArray = (value: any) => Array.isArray(value) ? value : [];
const pickItems = (items: any) => Array.isArray(items?.data) ? items.data : Array.isArray(items) ? items : Array.isArray(items?.items) ? items.items : [];

export const mapApiContractToDesign = (item: any) => ({
  ...item,
  id: String(item?._id || item?.id || ''),
  contractNumber: item?.contractNumber || 'Non généré',
  title: item?.title || 'Contrat DEL',
  proposalId: item?.proposalId,
  requestId: item?.requestId,
  companyName: item?.companyName || 'Entreprise à confirmer',
  ownerNames: asArray(item?.ownerNames),
  equipmentIds: asArray(item?.equipmentIds),
  amount: Number(item?.amount ?? 0),
  currency: item?.currency || 'XOF',
  startDate: item?.startDate,
  endDate: item?.endDate,
  status: item?.status || 'UNKNOWN',
  paymentTerms: item?.paymentTerms,
  conditions: item?.conditions,
  createdAt: item?.createdAt,
});

export const mapApiContractListToDesign = (items: any) => pickItems(items).map(mapApiContractToDesign);
