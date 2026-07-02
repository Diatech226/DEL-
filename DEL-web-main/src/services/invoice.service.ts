import { apiGet } from '../lib/http';
export const getMyInvoices=()=>apiGet('/api/me/invoices');
