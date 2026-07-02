import { apiGet } from '../lib/http';
export const getMyContracts=()=>apiGet('/api/me/contracts');
