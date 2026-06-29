const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
async function request(path, options = {}) { try { const res = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, cache: 'no-store' }); const json = await res.json().catch(() => ({})); if (!res.ok || json.success === false) throw new Error(json.message || `Erreur API (${res.status})`); return json.data ?? json; } catch (error) { throw new Error(error.message || 'Impossible de contacter DEL-api.'); } }
export const getEquipmentList = () => request('/api/equipment');
export const updateEquipmentStatus = (id, status) => request(`/api/equipment/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const getRequestList = () => request('/api/requests');
export const updateRequestStatus = (id, status) => request(`/api/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const getProposalList = () => request('/api/proposals');
export const createProposal = (payload) => request('/api/proposals', { method: 'POST', body: JSON.stringify(payload) });
export const updateProposalStatus = (id, status) => request(`/api/proposals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const api = { equipment:getEquipmentList, requests:getRequestList, proposals:getProposalList, updateEquipmentStatus, updateRequestStatus, createProposal, updateProposalStatus };
