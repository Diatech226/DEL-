import { apiGet, apiPost } from '../lib/http';
import { mapApiMatchListToAdmin } from '../mappers/matching.mapper';
export async function getRequestMatches(requestId: string) { return mapApiMatchListToAdmin(await apiGet(`/api/requests/${requestId}/matches`)); }
export function createProposalFromRequest(requestId: string, payload: unknown) { return apiPost(`/api/requests/${requestId}/proposals`, payload); }
