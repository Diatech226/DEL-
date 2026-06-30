const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const TOKEN_KEY='del_cms_token';
export function getToken(){ if(typeof window==='undefined') return null; return localStorage.getItem(TOKEN_KEY);}
export function setToken(token){ if(typeof window!=='undefined') localStorage.setItem(TOKEN_KEY, token);}
export function clearToken(){ if(typeof window!=='undefined') localStorage.removeItem(TOKEN_KEY);}
function authHeaders(){ const token=getToken(); return token ? { Authorization: `Bearer ${token}` } : {}; }
async function request(path, options = {}) { try { const res = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.auth ? authHeaders() : {}), ...(options.headers || {}) }, cache: 'no-store' }); const json = await res.json().catch(() => ({})); if (!res.ok || json.success === false) { const err = new Error(json.message || `Erreur API (${res.status})`); err.status = res.status; err.conflicts = json.conflicts; throw err; } if (Object.prototype.hasOwnProperty.call(json, 'unreadCount')) return json; return json.data ?? json; } catch (error) { const err=new Error((error.status===401||error.status===403)?'Session expirée ou accès refusé. Veuillez vous reconnecter.':(error.message || 'Impossible de contacter DEL-api.')); err.status=error.status; throw err; } }
export const login = (payload) => request('/api/auth/login', { method:'POST', body:JSON.stringify(payload) });
export const getMe = () => request('/api/auth/me', { auth:true });
export const logout = () => request('/api/auth/logout', { method:'POST', auth:true }).finally(clearToken);
export const getEquipmentList = () => request('/api/equipment');
export const updateEquipmentStatus = (id, status) => request(`/api/equipment/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });
export const getRequestList = () => request('/api/requests');
export const getRequestById = (id) => request(`/api/requests/${id}`);
export const getRequestMatches = (id) => request(`/api/requests/${id}/matches`);
export const createProposalFromRequest = (requestId, payload) => request(`/api/requests/${requestId}/proposals`, { method: 'POST', body: JSON.stringify(payload) });
export const updateRequestStatus = (id, status) => request(`/api/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });
export const getProposalList = () => request('/api/proposals');
export const createProposal = (payload) => request('/api/proposals', { method: 'POST', body: JSON.stringify(payload) });
export const updateProposalStatus = (id, status) => request(`/api/proposals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });
export const submitAdminCompanyDecision = (proposalId, payload) => request(`/api/proposals/${proposalId}/company-decision`, { method:'PATCH', body:JSON.stringify(payload), auth:true });
export const submitAdminOwnerDecision = (proposalId, index, payload) => request(`/api/proposals/${proposalId}/owner-decisions/${index}`, { method:'PATCH', body:JSON.stringify(payload), auth:true });

export const getContractList = () => request('/api/contracts');
export const getContractById = (id) => request(`/api/contracts/${id}`);
export const createContractFromProposal = (proposalId, payload) => request(`/api/proposals/${proposalId}/contracts`, { method: 'POST', body: JSON.stringify(payload) });
export const updateContractStatus = (id, status) => request(`/api/contracts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });
export const updateContract = (id, payload) => request(`/api/contracts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const getInvoiceList = () => request('/api/invoices');
export const getInvoiceById = (id) => request(`/api/invoices/${id}`);
export const createInvoiceFromContract = (contractId, payload) => request(`/api/contracts/${contractId}/invoices`, { method: 'POST', body: JSON.stringify(payload) });
export const updateInvoiceStatus = (id, status, force = false) => request(`/api/invoices/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, force }), auth: true });
export const updateInvoice = (id, payload) => request(`/api/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const getPaymentList = () => request('/api/payments');
export const getPaymentById = (id) => request(`/api/payments/${id}`);
export const getPaymentsByInvoice = (invoiceId) => request(`/api/payments/invoice/${invoiceId}`);
export const createPayment = (payload) => request('/api/payments', { method: 'POST', body: JSON.stringify(payload) });
export const updatePaymentStatus = (id, status) => request(`/api/payments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });

export const api = { equipment:getEquipmentList, requests:getRequestList, getRequestById, getRequestMatches, createProposalFromRequest, proposals:getProposalList, updateEquipmentStatus, updateRequestStatus, createProposal, updateProposalStatus, contracts:getContractList, getContractById, createContractFromProposal, updateContractStatus, updateContract, getInvoiceList, getInvoiceById, createInvoiceFromContract, updateInvoiceStatus, updateInvoice, getPaymentList, getPaymentById, getPaymentsByInvoice, createPayment, updatePaymentStatus };
export const getEquipmentById = (id) => request(`/api/equipment/${id}`);
export const getDocumentList = () => request('/api/documents');
export const getDocumentById = (id) => request(`/api/documents/${id}`);
export const getDocumentsByEntity = (entityType, entityId) => request(`/api/documents/entity/${entityType}/${entityId}`);
export const createDocument = (payload) => request('/api/documents', { method: 'POST', body: JSON.stringify(payload) });
export const updateDocumentStatus = (id, status, rejectionReason = '') => request(`/api/documents/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason }), auth: true });
export const deleteDocument = (id) => request(`/api/documents/${id}`, { method: 'DELETE' });
export const getMissionList = () => request('/api/missions');
export const getMaintenanceTicketList = () => request('/api/maintenance');
export const getMaintenanceTicketsByEquipment = (equipmentId) => request(`/api/maintenance/equipment/${equipmentId}`);
export const createMaintenanceTicket = (payload) => request('/api/maintenance', { method: 'POST', body: JSON.stringify(payload) });
export const getEquipmentScheduleList = () => request('/api/equipment-schedules');
export const getSchedulesByEquipment = (equipmentId) => request(`/api/equipment-schedules/equipment/${equipmentId}`);
export const getEquipmentAvailability = (equipmentId, startDate, endDate) => request(`/api/equipment-schedules/equipment/${equipmentId}/availability?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`);
export const checkEquipmentAvailability = (payload) => request('/api/equipment-schedules/check-availability', { method: 'POST', body: JSON.stringify(payload) });
export const createEquipmentSchedule = (payload) => request('/api/equipment-schedules', { method: 'POST', body: JSON.stringify(payload) });
export const updateEquipmentScheduleStatus = (id, status) => request(`/api/equipment-schedules/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });
export const deleteEquipmentSchedule = (id) => request(`/api/equipment-schedules/${id}`, { method: 'DELETE' });
export const getMissionById = (id) => request(`/api/missions/${id}`);
export const updateMissionStatus = (id, status) => request(`/api/missions/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });
export const getMissionReportsByMission = (missionId) => request(`/api/mission-reports/mission/${missionId}`);
export const createMissionReport = (payload) => request('/api/mission-reports', { method: 'POST', body: JSON.stringify(payload) });
export const updateMissionReportStatus = (id, status) => request(`/api/mission-reports/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });
export const getMaintenanceTicketById = (id) => request(`/api/maintenance/${id}`);
export const updateMaintenanceTicket = (id, payload) => request(`/api/maintenance/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
export const updateMaintenanceTicketStatus = (id, status) => request(`/api/maintenance/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }), auth: true });
export const getUserList = () => request('/api/users');
export const getUserById = (id) => request(`/api/users/${id}`);
export const updateUserStatus = (id, status, rejectionReason = '') => request(`/api/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason }), auth: true });
export const getOwnerProfileList = () => request('/api/owner-profiles');
export const getOwnerProfileById = (id) => request(`/api/owner-profiles/${id}`);
export const updateOwnerProfileStatus = (id, status, rejectionReason = '') => request(`/api/owner-profiles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason }), auth: true });
export const getCompanyProfileList = () => request('/api/company-profiles');
export const getCompanyProfileById = (id) => request(`/api/company-profiles/${id}`);
export const updateCompanyProfileStatus = (id, status, rejectionReason = '') => request(`/api/company-profiles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason }), auth: true });
export const getTechnicianProfileList = () => request('/api/technician-profiles');
export const getTechnicianProfileById = (id) => request(`/api/technician-profiles/${id}`);
export const updateTechnicianProfileStatus = (id, status, rejectionReason = '') => request(`/api/technician-profiles/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, rejectionReason }), auth: true });

export const getNotificationList = () => request('/api/notifications', { auth:true });
export const createNotificationManual = (payload) => request('/api/notifications', { method:'POST', body:JSON.stringify(payload), auth:true });
export const deleteNotification = (id) => request(`/api/notifications/${id}`, { method:'DELETE', auth:true });
