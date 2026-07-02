import { apiGet, apiPost } from '../lib/http';
export const createEquipmentRequest=(payload:unknown)=>apiPost('/api/requests',payload);
export const getMyRequests=()=>apiGet('/api/me/requests');
