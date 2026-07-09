const asArray = (payload: any): any[] => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.payments)) return payload.payments;
  if (Array.isArray(payload)) return payload;
  return [];
};

const numberOrZero = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;

export interface DesignPayment {
  id: string;
  paymentNumber: string;
  invoiceId?: string;
  contractId?: string;
  companyName: string;
  amount: number;
  currency: string;
  method: string;
  paymentDate?: string;
  reference?: string;
  proofUrl?: string;
  status: string;
  notes?: string;
  createdAt?: string;
}

export const mapApiPaymentToDesign = (apiPayment: any): DesignPayment => ({
  id: String(apiPayment?._id || apiPayment?.id || ''),
  paymentNumber: apiPayment?.paymentNumber || 'Non généré',
  invoiceId: apiPayment?.invoiceId ? String(apiPayment.invoiceId) : undefined,
  contractId: apiPayment?.contractId ? String(apiPayment.contractId) : undefined,
  companyName: apiPayment?.companyName || 'Entreprise à confirmer',
  amount: numberOrZero(apiPayment?.amount),
  currency: apiPayment?.currency || 'XOF',
  method: apiPayment?.method || 'MANUAL',
  paymentDate: apiPayment?.paymentDate,
  reference: apiPayment?.reference,
  proofUrl: apiPayment?.proofUrl,
  status: apiPayment?.status || 'UNKNOWN',
  notes: apiPayment?.notes,
  createdAt: apiPayment?.createdAt,
});

export const mapApiPaymentListToDesign = (apiItems: any): DesignPayment[] => asArray(apiItems).map(mapApiPaymentToDesign);
