import { getApiBaseUrl, getToken } from '../lib/http';

const reportErrorMessage = (status: number) => {
  if (status === 401) return 'Votre session a expiré. Veuillez vous reconnecter.';
  if (status === 403) return 'Vous n’êtes pas autorisé à accéder à cette ressource.';
  if (status === 404) return 'Le rapport demandé est introuvable.';
  if (status >= 500) return 'Une erreur serveur est survenue.';
  return 'Impossible de télécharger le rapport.';
};

export async function downloadReport(path: string, filename: string) {
  try {
    const headers = new Headers();
    const token = getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`, { headers });
    if (!response.ok) throw new Error(reportErrorMessage(response.status));
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Impossible de joindre l’API DEL.');
  }
}

export const downloadContractPdf = (id: string) => downloadReport(`/api/reports/contracts/${id}/pdf`, `contrat-${id}.pdf`);

export const downloadInvoicePdf = (id: string) => downloadReport(`/api/reports/invoices/${id}/pdf`, `facture-${id}.pdf`);
