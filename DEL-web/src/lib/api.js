const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'del_token';
export function getToken(){ if (typeof window === 'undefined') return null; return localStorage.getItem(TOKEN_KEY); }
export function setToken(token){ if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token); }
export function clearToken(){ if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY); }
function authHeaders(){ const token=getToken(); return token ? { Authorization: `Bearer ${token}` } : {}; }
async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.auth ? authHeaders() : {}), ...(options.headers || {}) }, cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.success === false) { const err = new Error((res.status===401) ? 'Veuillez vous connecter pour accéder à cet espace.' : (json.message || `Erreur API (${res.status})`)); err.status=res.status; throw err; }
    return json.data ?? json;
  } catch (error) { throw new Error(error.message || 'Impossible de contacter DEL-api.'); }
}
export const register = (payload) => request('/api/auth/register', { method:'POST', body:JSON.stringify(payload) });
export const login = (payload) => request('/api/auth/login', { method:'POST', body:JSON.stringify(payload) });
export const getMe = () => request('/api/auth/me', { auth:true });
export const updateMe = (payload) => request('/api/auth/me', { method:'PATCH', body:JSON.stringify(payload), auth:true });
export const logout = () => request('/api/auth/logout', { method:'POST', auth:true }).finally(clearToken);
export const getMySummary = () => request('/api/me/summary', { auth:true });
export const getMyEquipment = () => request('/api/me/equipment', { auth:true });
export const getMyRequests = () => request('/api/me/requests', { auth:true });
export const getMyDocuments = () => request('/api/me/documents', { auth:true });
export const getEquipmentList = () => request('/api/equipment');
export const getEquipmentById = (id) => request(`/api/equipment/${id}`);
export const createEquipment = (payload) => request('/api/equipment', { method: 'POST', body: JSON.stringify(payload), auth: true });
export const getRequestList = () => request('/api/requests');
export const createEquipmentRequest = (payload) => request('/api/requests', { method: 'POST', body: JSON.stringify(payload), auth: true });
export const createDocument = (payload) => request('/api/documents', { method: 'POST', body: JSON.stringify(payload), auth: true });
export const getDocumentsByEntity = (entityType, entityId) => request(`/api/documents/entity/${entityType}/${entityId}`);
export const createUser = (payload) => request('/api/users', { method: 'POST', body: JSON.stringify(payload) });
export const getUserById = (id) => request(`/api/users/${id}`);
export const createOwnerProfile = (payload) => request('/api/owner-profiles', { method: 'POST', body: JSON.stringify(payload) });
export const getOwnerProfileById = (id) => request(`/api/owner-profiles/${id}`);
export const createCompanyProfile = (payload) => request('/api/company-profiles', { method: 'POST', body: JSON.stringify(payload) });
export const getCompanyProfileById = (id) => request(`/api/company-profiles/${id}`);
export const createTechnicianProfile = (payload) => request('/api/technician-profiles', { method: 'POST', body: JSON.stringify(payload) });
export const api = { getEquipment: getEquipmentList, getEquipmentById, createEquipment, getRequests: getRequestList, createRequest: createEquipmentRequest, createDocument, getDocumentsByEntity };
