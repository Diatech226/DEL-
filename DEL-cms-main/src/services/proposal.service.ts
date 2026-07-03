import { apiGet, apiPatch } from '../lib/http';
import { mapApiProposalListToAdmin, mapApiProposalToAdmin } from '../mappers/proposal.mapper';
const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export async function getProposalList(params?: Record<string, string>) { return mapApiProposalListToAdmin(await apiGet(`/api/proposals${q(params)}`)); }
export async function getProposalById(id: string) { return mapApiProposalToAdmin(await apiGet(`/api/proposals/${id}`)); }
export function updateProposalStatus(id: string, status: string) { return apiPatch(`/api/proposals/${id}/status`, { status }); }
export function updateCompanyDecisionAsAdmin(id: string, payload: { status: 'ACCEPTED' | 'REJECTED'; notes?: string; rejectionReason?: string }) { return apiPatch(`/api/proposals/${id}/company-decision`, payload); }
export function updateOwnerDecisionAsAdmin(id: string, ownerDecisionIndex: number, payload: { status: 'ACCEPTED' | 'REJECTED'; notes?: string; rejectionReason?: string }) { return apiPatch(`/api/proposals/${id}/owner-decisions/${ownerDecisionIndex}`, payload); }
