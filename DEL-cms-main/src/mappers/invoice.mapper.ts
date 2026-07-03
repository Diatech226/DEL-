import { normalizeStatus } from '../constants/status';
import type { Invoice } from '../types';

const arr = (value: unknown): any[] => Array.isArray(value) ? value : [];
const idOf = (value: any) => typeof value === 'object' && value !== null ? String(value._id ?? value.id ?? '') : String(value ?? '');
const num = (value: unknown, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function mapApiInvoiceToAdmin(apiInvoice: any): Invoice {
  const totalAmount = num(apiInvoice?.totalAmount ?? apiInvoice?.amount, 0);
  const balanceDue = num(apiInvoice?.balanceDue, totalAmount);
  const invoiceNumber = apiInvoice?.invoiceNumber ?? 'Non générée';
  return {
    id: String(apiInvoice?._id ?? apiInvoice?.id ?? ''),
    code: invoiceNumber,
    invoiceNumber,
    title: apiInvoice?.title ?? 'Facture DEL',
    contractId: idOf(apiInvoice?.contractId),
    proposalId: idOf(apiInvoice?.proposalId),
    requestId: idOf(apiInvoice?.requestId),
    companyName: apiInvoice?.companyName ?? 'Entreprise à confirmer',
    ownerNames: arr(apiInvoice?.ownerNames),
    equipmentIds: arr(apiInvoice?.equipmentIds).map(idOf).filter(Boolean),
    amountExclTax: num(apiInvoice?.subtotal ?? apiInvoice?.amountExclTax, 0),
    subtotal: num(apiInvoice?.subtotal ?? apiInvoice?.amountExclTax, 0),
    taxRate: num(apiInvoice?.taxRate, 0),
    taxAmount: num(apiInvoice?.taxAmount, 0),
    totalAmount,
    platformCommissionRate: num(apiInvoice?.platformCommissionRate, 0),
    platformCommissionAmount: num(apiInvoice?.platformCommissionAmount, 0),
    ownerAmount: num(apiInvoice?.ownerAmount, 0),
    amountPaid: num(apiInvoice?.amountPaid, 0),
    balanceDue,
    currency: apiInvoice?.currency ?? 'XOF',
    dueDate: apiInvoice?.dueDate ?? '',
    periodStart: apiInvoice?.periodStart ?? '',
    periodEnd: apiInvoice?.periodEnd ?? '',
    status: normalizeStatus(apiInvoice?.status),
    paymentTerms: apiInvoice?.paymentTerms ?? '',
    notes: apiInvoice?.notes ?? '',
    issuedAt: apiInvoice?.issuedAt ?? apiInvoice?.createdAt ?? '',
    createdAt: apiInvoice?.createdAt ?? '',
    updatedAt: apiInvoice?.updatedAt ?? '',
  };
}

export function mapApiInvoiceListToAdmin(apiItems: any): Invoice[] {
  return arr(apiItems).map(mapApiInvoiceToAdmin);
}
