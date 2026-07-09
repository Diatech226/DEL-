import { apiGet } from '../lib/http';

export const getMyInvoices = () => apiGet('/api/me/invoices');
export const getInvoiceById = (id: string) => apiGet(`/api/invoices/${id}`);
