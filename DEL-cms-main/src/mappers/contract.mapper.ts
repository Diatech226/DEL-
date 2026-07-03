import { Contract } from '../types';

const arr = (value: any) => Array.isArray(value) ? value : value ? [value] : [];
const idOf = (value: any) => String(value?._id || value?.id || value || '');

export function mapApiContractToAdmin(apiContract: any): Contract {
  const id = idOf(apiContract);
  const equipmentIds = arr(apiContract?.equipmentIds).map(idOf).filter(Boolean);
  const amount = Number(apiContract?.amount ?? apiContract?.totalPrice ?? apiContract?.totalAmount ?? 0);
  const currency = apiContract?.currency || 'XOF';
  return {
    id,
    code: apiContract?.contractNumber || apiContract?.code || `CTR-${id.slice(-6) || 'API'}`,
    proposalId: idOf(apiContract?.proposalId),
    companyName: apiContract?.companyName || apiContract?.client?.companyName || 'Entreprise à confirmer',
    engineName: equipmentIds.length ? equipmentIds.join(', ') : 'Engins à confirmer',
    startDate: apiContract?.startDate?.slice?.(0, 10) || '',
    endDate: apiContract?.endDate?.slice?.(0, 10) || '',
    dailyRate: Number(apiContract?.dailyRate || amount),
    totalAmount: amount,
    status: apiContract?.status || 'UNKNOWN',
    signedAt: apiContract?.signedAt?.slice?.(0, 10),
    insuranceNumber: apiContract?.insuranceNumber || 'Non renseigné',
    contractNumber: apiContract?.contractNumber || 'Non généré',
    title: apiContract?.title || 'Contrat DEL',
    requestId: idOf(apiContract?.requestId),
    ownerNames: arr(apiContract?.ownerNames).filter(Boolean),
    equipmentIds,
    amount,
    platformCommissionRate: Number(apiContract?.platformCommissionRate || 0),
    platformCommissionAmount: Number(apiContract?.platformCommissionAmount || 0),
    ownerAmount: Number(apiContract?.ownerAmount || 0),
    currency,
    paymentTerms: apiContract?.paymentTerms || '',
    conditions: apiContract?.conditions || '',
    responsibilities: apiContract?.responsibilities || '',
    createdAt: apiContract?.createdAt || '',
    updatedAt: apiContract?.updatedAt || '',
  };
}

export const mapApiContractListToAdmin = (apiItems: any[] = []) => apiItems.map(mapApiContractToAdmin);
