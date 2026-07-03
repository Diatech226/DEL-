import { apiDelete, apiGet, apiPatch, apiPost } from '../lib/http';
import { mapApiConversationListToAdmin, mapApiConversationToAdmin } from '../mappers/conversation.mapper';

export type ConversationFilters = Record<string, string | number | boolean | undefined | null>;
function toQuery(params: ConversationFilters = {}) { const q = new URLSearchParams(); Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== null && String(v).trim() !== '') q.set(k, String(v)); }); return q.toString() ? `?${q}` : ''; }
export async function getConversationList(params: ConversationFilters = {}) { return mapApiConversationListToAdmin(await apiGet(`/api/conversations${toQuery(params)}`)); }
export async function getConversationById(id: string) { return mapApiConversationToAdmin(await apiGet(`/api/conversations/${encodeURIComponent(id)}`)); }
export async function sendAdminConversationMessage(conversationId: string, payload: unknown) { return mapApiConversationToAdmin(await apiPost(`/api/conversations/${encodeURIComponent(conversationId)}/messages`, payload)); }
export async function updateConversationStatus(id: string, status: string) { return mapApiConversationToAdmin(await apiPatch(`/api/conversations/${encodeURIComponent(id)}/status`, { status })); }
export async function deleteConversation(id: string) { return apiDelete(`/api/conversations/${encodeURIComponent(id)}`); }
export async function deleteMessage(id: string) { return apiDelete(`/api/messages/${encodeURIComponent(id)}`); }
