import { apiGet, apiPatch, apiPost } from '../lib/http';
import { mapApiPaymentListToAdmin, mapApiPaymentToAdmin } from '../mappers/payment.mapper';

const q = (params?: Record<string, string>) => params ? `?${new URLSearchParams(params)}` : '';
export type PaymentCreatePayload = { invoiceId: string; contractId?: string; companyName?: string; amount?: number; currency?: string; method?: string; paymentDate?: string; reference?: string; proofUrl?: string; notes?: string };

export async function getPaymentList(params?: Record<string, string>) { return mapApiPaymentListToAdmin(await apiGet(`/api/payments${q(params)}`)); }
export async function getPaymentById(id: string) { return mapApiPaymentToAdmin(await apiGet(`/api/payments/${id}`)); }
export async function getPaymentsByInvoice(invoiceId: string) { return mapApiPaymentListToAdmin(await apiGet(`/api/payments/invoice/${invoiceId}`)); }
export async function createPayment(payload: PaymentCreatePayload) { return mapApiPaymentToAdmin(await apiPost('/api/payments', payload)); }
export async function updatePaymentStatus(id: string, status: string, payload: Record<string, unknown> = {}) { return mapApiPaymentToAdmin(await apiPatch(`/api/payments/${id}/status`, { ...payload, status })); }
export async function updatePayment(id: string, payload: Partial<PaymentCreatePayload>) { return mapApiPaymentToAdmin(await apiPatch(`/api/payments/${id}`, payload)); }
