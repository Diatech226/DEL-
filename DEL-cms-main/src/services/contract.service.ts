import { apiGet, apiPatch, apiPost } from '../lib/http';
import { mapApiContractListToAdmin, mapApiContractToAdmin } from '../mappers/contract.mapper';
const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export async function getContractList(params?: Record<string, string>) { return mapApiContractListToAdmin(await apiGet(`/api/contracts${q(params)}`)); }
export async function getContractById(id: string) { return mapApiContractToAdmin(await apiGet(`/api/contracts/${id}`)); }
export async function createContractFromProposal(proposalId: string, payload: unknown) { return mapApiContractToAdmin(await apiPost(`/api/proposals/${proposalId}/contracts`, payload)); }
export function updateContractStatus(id: string, status: string) { return apiPatch(`/api/contracts/${id}/status`, { status }); }
export function updateContract(id: string, payload: unknown) { return apiPatch(`/api/contracts/${id}`, payload); }
