import { normalizeStatus } from '../constants/status';
import type { Payment } from '../types';

const arr = (value: unknown): any[] => Array.isArray(value) ? value : [];
const idOf = (value: any) => typeof value === 'object' && value !== null ? String(value._id ?? value.id ?? '') : String(value ?? '');
const num = (value: unknown, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function mapApiPaymentToAdmin(apiPayment: any): Payment {
  const paymentNumber = apiPayment?.paymentNumber ?? 'Non généré';
  return {
    id: String(apiPayment?._id ?? apiPayment?.id ?? ''),
    code: paymentNumber,
    paymentNumber,
    invoiceId: idOf(apiPayment?.invoiceId),
    invoiceCode: apiPayment?.invoiceNumber ?? idOf(apiPayment?.invoiceId),
    contractId: idOf(apiPayment?.contractId),
    companyName: apiPayment?.companyName ?? 'Entreprise à confirmer',
    amount: num(apiPayment?.amount, 0),
    currency: apiPayment?.currency ?? 'XOF',
    method: apiPayment?.method ?? 'MANUAL',
    paymentDate: apiPayment?.paymentDate ?? apiPayment?.transactionDate ?? '',
    transactionDate: apiPayment?.paymentDate ?? apiPayment?.transactionDate ?? apiPayment?.createdAt ?? '',
    reference: apiPayment?.reference ?? '',
    proofUrl: apiPayment?.proofUrl ?? '',
    status: normalizeStatus(apiPayment?.status),
    notes: apiPayment?.notes ?? '',
    createdAt: apiPayment?.createdAt ?? '',
    updatedAt: apiPayment?.updatedAt ?? '',
  };
}

export function mapApiPaymentListToAdmin(apiItems: any): Payment[] {
  return arr(apiItems).map(mapApiPaymentToAdmin);
}
