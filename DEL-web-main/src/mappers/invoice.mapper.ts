const asArray = (payload: any): any[] => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.invoices)) return payload.invoices;
  if (Array.isArray(payload)) return payload;
  return [];
};

const numberOrZero = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;

export interface DesignInvoice {
  id: string;
  invoiceNumber: string;
  title: string;
  contractId?: string;
  companyName: string;
  ownerNames?: string[] | string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  dueDate?: string;
  periodStart?: string;
  periodEnd?: string;
  status: string;
  paymentTerms?: string;
  notes?: string;
  createdAt?: string;
}

export const mapApiInvoiceToDesign = (apiInvoice: any): DesignInvoice => {
  const totalAmount = numberOrZero(apiInvoice?.totalAmount);
  return {
    id: String(apiInvoice?._id || apiInvoice?.id || ''),
    invoiceNumber: apiInvoice?.invoiceNumber || 'Non générée',
    title: apiInvoice?.title || 'Facture DEL',
    contractId: apiInvoice?.contractId ? String(apiInvoice.contractId) : undefined,
    companyName: apiInvoice?.companyName || 'Entreprise à confirmer',
    ownerNames: apiInvoice?.ownerNames,
    subtotal: numberOrZero(apiInvoice?.subtotal),
    taxAmount: numberOrZero(apiInvoice?.taxAmount),
    totalAmount,
    amountPaid: numberOrZero(apiInvoice?.amountPaid),
    balanceDue: apiInvoice?.balanceDue === undefined || apiInvoice?.balanceDue === null ? totalAmount : numberOrZero(apiInvoice.balanceDue),
    currency: apiInvoice?.currency || 'XOF',
    dueDate: apiInvoice?.dueDate,
    periodStart: apiInvoice?.periodStart,
    periodEnd: apiInvoice?.periodEnd,
    status: apiInvoice?.status || 'UNKNOWN',
    paymentTerms: apiInvoice?.paymentTerms,
    notes: apiInvoice?.notes,
    createdAt: apiInvoice?.createdAt,
  };
};

export const mapApiInvoiceListToDesign = (apiItems: any): DesignInvoice[] => asArray(apiItems).map(mapApiInvoiceToDesign);
