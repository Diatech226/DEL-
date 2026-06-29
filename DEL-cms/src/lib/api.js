const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
async function request(path, options = {}) { try { const res = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, cache: 'no-store' }); const json = await res.json().catch(() => ({})); if (!res.ok || json.success === false) throw new Error(json.message || `Erreur API (${res.status})`); return json.data ?? json; } catch (error) { throw new Error(error.message || 'Impossible de contacter DEL-api.'); } }
export const getEquipmentList = () => request('/api/equipment');
export const updateEquipmentStatus = (id, status) => request(`/api/equipment/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const getRequestList = () => request('/api/requests');
export const getRequestById = (id) => request(`/api/requests/${id}`);
export const getRequestMatches = (id) => request(`/api/requests/${id}/matches`);
export const createProposalFromRequest = (requestId, payload) => request(`/api/requests/${requestId}/proposals`, { method: 'POST', body: JSON.stringify(payload) });
export const updateRequestStatus = (id, status) => request(`/api/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const getProposalList = () => request('/api/proposals');
export const createProposal = (payload) => request('/api/proposals', { method: 'POST', body: JSON.stringify(payload) });
export const updateProposalStatus = (id, status) => request(`/api/proposals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

export const getContractList = () => request('/api/contracts');
export const getContractById = (id) => request(`/api/contracts/${id}`);
export const createContractFromProposal = (proposalId, payload) => request(`/api/proposals/${proposalId}/contracts`, { method: 'POST', body: JSON.stringify(payload) });
export const updateContractStatus = (id, status) => request(`/api/contracts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const updateContract = (id, payload) => request(`/api/contracts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const api = { equipment:getEquipmentList, requests:getRequestList, getRequestById, getRequestMatches, createProposalFromRequest, proposals:getProposalList, updateEquipmentStatus, updateRequestStatus, createProposal, updateProposalStatus, contracts:getContractList, getContractById, createContractFromProposal, updateContractStatus, updateContract };
export const getEquipmentById = (id) => request(`/api/equipment/${id}`);
export const getDocumentList = () => request('/api/documents');
export const getDocumentById = (id) => request(`/api/documents/${id}`);
export const getDocumentsByEntity = (entityType, entityId) => request(`/api/documents/entity/${entityType}/${entityId}`);
export const createDocument = (payload) => request('/api/documents', { method: 'POST', body: JSON.stringify(payload) });
export const updateDocumentStatus = (id, status, rejectionReason = '') => request(`/api/documents/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason }) });
export const deleteDocument = (id) => request(`/api/documents/${id}`, { method: 'DELETE' });
