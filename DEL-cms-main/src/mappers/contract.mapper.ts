import { normalizeStatus } from '../constants/status';
import type { Contract } from '../types';

const arr = (value: unknown): any[] => Array.isArray(value) ? value : [];
const idOf = (value: any) => typeof value === 'object' && value !== null ? String(value._id ?? value.id ?? '') : String(value ?? '');

export function mapApiContractToAdmin(apiContract: any): Contract {
  const equipmentIds = arr(apiContract?.equipmentIds).map(idOf).filter(Boolean);
  return {
    id: String(apiContract?._id ?? apiContract?.id ?? ''),
    code: apiContract?.contractNumber ?? 'Non généré',
    contractNumber: apiContract?.contractNumber ?? 'Non généré',
    title: apiContract?.title ?? 'Contrat DEL',
    proposalId: idOf(apiContract?.proposalId),
    requestId: idOf(apiContract?.requestId),
    companyName: apiContract?.companyName ?? 'Entreprise à confirmer',
    ownerNames: arr(apiContract?.ownerNames),
    equipmentIds,
    engineName: apiContract?.engineName ?? equipmentIds.join(', ') ?? 'Engin à confirmer',
    startDate: apiContract?.startDate ?? '',
    endDate: apiContract?.endDate ?? '',
    dailyRate: Number(apiContract?.dailyRate ?? 0),
    totalAmount: Number(apiContract?.totalAmount ?? apiContract?.amount ?? 0),
    amount: Number(apiContract?.amount ?? 0),
    platformCommissionRate: Number(apiContract?.platformCommissionRate ?? 0),
    platformCommissionAmount: Number(apiContract?.platformCommissionAmount ?? 0),
    ownerAmount: Number(apiContract?.ownerAmount ?? 0),
    currency: apiContract?.currency ?? 'XOF',
    status: normalizeStatus(apiContract?.status),
    signedAt: apiContract?.signedAt,
    insuranceNumber: apiContract?.insuranceNumber ?? 'Non renseigné',
    paymentTerms: apiContract?.paymentTerms ?? '',
    conditions: apiContract?.conditions ?? '',
    responsibilities: apiContract?.responsibilities ?? '',
    createdAt: apiContract?.createdAt ?? '',
    updatedAt: apiContract?.updatedAt ?? '',
  };
}

export function mapApiContractListToAdmin(apiItems: any): Contract[] {
  return arr(apiItems).map(mapApiContractToAdmin);
}
