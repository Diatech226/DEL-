import { apiGet } from '../lib/http';
export const getMyPayments=()=>apiGet('/api/me/payments');
