import { apiGet, apiPatch, apiPost } from '../lib/http';
import { mapApiInvoiceListToAdmin, mapApiInvoiceToAdmin } from '../mappers/invoice.mapper';

const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export type InvoiceCreatePayload = { title?: string; subtotal?: number; taxRate?: number; dueDate?: string; periodStart?: string; periodEnd?: string; notes?: string; status?: string };

export async function getInvoiceList(params?: Record<string, string>) { return mapApiInvoiceListToAdmin(await apiGet(`/api/invoices${q(params)}`)); }
export async function getInvoiceById(id: string) { return mapApiInvoiceToAdmin(await apiGet(`/api/invoices/${id}`)); }
export async function createInvoiceFromContract(contractId: string, payload: InvoiceCreatePayload) { return mapApiInvoiceToAdmin(await apiPost(`/api/contracts/${contractId}/invoices`, payload)); }
export async function updateInvoice(id: string, payload: Partial<InvoiceCreatePayload>) { return mapApiInvoiceToAdmin(await apiPatch(`/api/invoices/${id}`, payload)); }
export async function updateInvoiceStatus(id: string, status: string) { return mapApiInvoiceToAdmin(await apiPatch(`/api/invoices/${id}/status`, { status })); }
