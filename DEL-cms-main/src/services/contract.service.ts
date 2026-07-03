import { apiGet, apiPatch, apiPost } from '../lib/http';
import { mapApiContractListToAdmin, mapApiContractToAdmin } from '../mappers/contract.mapper';

const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export type ContractCreatePayload = { title?: string; startDate?: string; endDate?: string; amount?: number; currency?: string; paymentTerms?: string; conditions?: string; responsibilities?: string };

export async function getContractList(params?: Record<string, string>) { return mapApiContractListToAdmin(await apiGet(`/api/contracts${q(params)}`)); }
export async function getContractById(id: string) { return mapApiContractToAdmin(await apiGet(`/api/contracts/${id}`)); }
export async function createContractFromProposal(proposalId: string, payload: ContractCreatePayload) { return mapApiContractToAdmin(await apiPost(`/api/proposals/${proposalId}/contracts`, payload)); }
export async function updateContractStatus(id: string, status: string) { return mapApiContractToAdmin(await apiPatch(`/api/contracts/${id}/status`, { status })); }
export async function updateContract(id: string, payload: Partial<ContractCreatePayload>) { return mapApiContractToAdmin(await apiPatch(`/api/contracts/${id}`, payload)); }
