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
    if (Object.prototype.hasOwnProperty.call(json, 'unreadCount')) return json; return json.data ?? json;
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
export const getMyProposals = () => request('/api/me/proposals', { auth:true });
export const submitCompanyProposalDecision = (proposalId, payload) => request(`/api/me/proposals/${proposalId}/company-decision`, { method:'PATCH', body:JSON.stringify(payload), auth:true });
export const submitOwnerProposalDecision = (proposalId, payload) => request(`/api/me/proposals/${proposalId}/owner-decision`, { method:'PATCH', body:JSON.stringify(payload), auth:true });
export const getMyContracts = () => request('/api/me/contracts', { auth:true });
export const getMyInvoices = () => request('/api/me/invoices', { auth:true });
export const getMyPayments = () => request('/api/me/payments', { auth:true });
export const getMyMissions = () => request('/api/me/missions', { auth:true });
export const getMyFinancialSummary = () => request('/api/me/financial-summary', { auth:true });
export const getMyOperationsSummary = () => request('/api/me/operations-summary', { auth:true });
export const getMyNotifications = () => request('/api/me/notifications', { auth:true });
export const markNotificationAsRead = (id) => request(`/api/me/notifications/${id}/read`, { method:'PATCH', auth:true });
export const markAllNotificationsAsRead = () => request('/api/me/notifications/read-all', { method:'PATCH', auth:true });

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
export const createTender = (payload) => request('/api/tenders', { method: 'POST', body: JSON.stringify(payload), auth: true });
export const getMyTenders = () => request('/api/me/tenders', { auth: true });
export const getMyTenderLots = () => request('/api/me/tender-lots', { auth: true });
export const getTenderById = (id) => request(`/api/tenders/${id}`);
export const getTenderLotsByTender = (id) => request(`/api/tenders/${id}/lots`);

export async function downloadReport(path, filename = 'DEL-rapport.pdf') {
  const res = await fetch(`${API_URL}${path}`, { headers: authHeaders(), cache: 'no-store' });
  if (!res.ok) {
    const err = new Error(res.status === 401 ? 'Veuillez vous reconnecter pour télécharger ce document.' : res.status === 403 ? 'Vous n’êtes pas autorisé à télécharger ce document.' : 'Impossible de télécharger le PDF.');
    err.status = res.status;
    throw err;
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
}
