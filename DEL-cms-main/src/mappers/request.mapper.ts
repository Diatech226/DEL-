import { ClientRequest, RequestWorkflowStep } from '../types';
import { normalizeStatus } from '../constants/status';

const statusMap: Record<string, ClientRequest['status']> = { DRAFT: 'Nouvelle', SUBMITTED: 'Nouvelle', UNDER_REVIEW: 'Qualification', MATCHING: 'Matching', PROPOSAL_SENT: 'Proposition', CONTRACTED: 'Contrat', ACTIVE: 'Active', COMPLETED: 'Terminée' };
const steps: ClientRequest['status'][] = ['Nouvelle', 'Qualification', 'Matching', 'Proposition', 'Contrat', 'Active', 'Terminée'];
const workflow = (status: ClientRequest['status']): RequestWorkflowStep[] => steps.map((name, index) => ({ name, label: name, status: steps.indexOf(status) > index ? 'completed' : status === name ? 'current' : 'upcoming' }));

export function mapApiRequestToAdmin(item: any): ClientRequest {
  const id = String(item?._id || item?.id || '');
  const status = statusMap[normalizeStatus(item?.status)] || 'Nouvelle';
  const durationMonths = Number(item?.durationMonths || 0);
  return {
    id,
    code: item?.code || item?.requestNumber || `REQ-${id.slice(-6) || 'API'}`,
    companyId: String(item?.companyUserId || item?.companyId || ''),
    companyName: item?.companyName || item?.company?.name || 'Entreprise non renseignée',
    title: item?.title || item?.needTitle || item?.equipmentCategory || 'Demande DEL',
    category: item?.equipmentCategory || item?.category || 'Engin',
    minPower: Number(item?.minPower || item?.power || item?.powerKw || 0),
    durationDays: Number(item?.durationDays || (durationMonths ? durationMonths * 30 : 0)),
    budget: Number(item?.proposedPrice || item?.budget || 0),
    status,
    startDate: item?.startDate?.slice?.(0, 10) || '',
    description: item?.description || item?.siteName || 'Données de base chargées depuis DEL-api.',
    matchingCount: Number(item?.matchingCount || item?.matchesCount || 0),
    workflow: workflow(status),
    contactName: item?.contactName || item?.contact?.name || 'Contact non renseigné',
    contactEmail: item?.contactEmail || item?.email || '',
  };
}

export const mapApiRequestListToAdmin = (items: any[] = []) => items.map(mapApiRequestToAdmin);
