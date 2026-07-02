import { apiGet, apiPost } from '../lib/http';
export const getTenders=()=>apiGet('/api/tenders');
export const createTender=(payload:unknown)=>apiPost('/api/tenders',payload);
