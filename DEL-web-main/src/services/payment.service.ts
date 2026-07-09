import { apiGet } from '../lib/http';

export const getMyPayments = () => apiGet('/api/me/payments');
export const getPaymentById = (id: string) => apiGet(`/api/payments/${id}`);
