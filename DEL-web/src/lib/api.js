const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) throw new Error(json.message || `Erreur API (${res.status})`);
    return json.data ?? json;
  } catch (error) {
    throw new Error(error.message || 'Impossible de contacter DEL-api.');
  }
}
export const getEquipmentList = () => request('/api/equipment');
export const getEquipmentById = (id) => request(`/api/equipment/${id}`);
export const createEquipment = (payload) => request('/api/equipment', { method: 'POST', body: JSON.stringify(payload) });
export const getRequestList = () => request('/api/requests');
export const createEquipmentRequest = (payload) => request('/api/requests', { method: 'POST', body: JSON.stringify(payload) });
export const createDocument = (payload) => request('/api/documents', { method: 'POST', body: JSON.stringify(payload) });
export const getDocumentsByEntity = (entityType, entityId) => request(`/api/documents/entity/${entityType}/${entityId}`);
export const api = { getEquipment: getEquipmentList, getEquipmentById, createEquipment, getRequests: getRequestList, createRequest: createEquipmentRequest, createDocument, getDocumentsByEntity };
export const createUser = (payload) => request('/api/users', { method: 'POST', body: JSON.stringify(payload) });
export const getUserById = (id) => request(`/api/users/${id}`);
export const createOwnerProfile = (payload) => request('/api/owner-profiles', { method: 'POST', body: JSON.stringify(payload) });
export const getOwnerProfileById = (id) => request(`/api/owner-profiles/${id}`);
export const createCompanyProfile = (payload) => request('/api/company-profiles', { method: 'POST', body: JSON.stringify(payload) });
export const getCompanyProfileById = (id) => request(`/api/company-profiles/${id}`);
export const createTechnicianProfile = (payload) => request('/api/technician-profiles', { method: 'POST', body: JSON.stringify(payload) });
