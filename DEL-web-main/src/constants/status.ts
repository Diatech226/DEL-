export const EQUIPMENT_STATUS = ['DRAFT','PENDING_REVIEW','AVAILABLE','RESERVED','PLACED','UNDER_MAINTENANCE','SOLD','REJECTED','ARCHIVED','UNKNOWN'] as const;
export const REQUEST_STATUS = ['SUBMITTED','UNDER_REVIEW','MATCHING','PROPOSAL_SENT','ACCEPTED','CONTRACTED','ACTIVE','COMPLETED','CANCELLED','REJECTED'] as const;
export const PROPOSAL_STATUS = ['SENT','ACCEPTED','REJECTED','CANCELLED','EXPIRED','PENDING_COMPANY','PENDING_OWNERS','READY_FOR_CONTRACT','REJECTED_BY_COMPANY','REJECTED_BY_OWNER','CONTRACT_CREATED','UNKNOWN'] as const;
export const CONTRACT_STATUS = ['DRAFT','PENDING_SIGNATURE','ACTIVE','COMPLETED','CANCELLED','UNKNOWN'] as const;
export const INVOICE_STATUS = ['DRAFT','SENT','PARTIALLY_PAID','PAID','OVERDUE','CANCELLED','UNKNOWN'] as const;
export const MISSION_STATUS = ['PLANNED','IN_TRANSIT','ON_SITE','PAUSED','COMPLETED','CANCELLED'] as const;
export const PAYMENT_STATUS = ['PENDING','CONFIRMED','REJECTED','CANCELLED','UNKNOWN'] as const;

const labels: Record<string,string> = {
  UNKNOWN:'Inconnu', DRAFT:'Brouillon', PENDING_REVIEW:'En revue', AVAILABLE:'Disponible', RESERVED:'Réservé', PLACED:'Loué', UNDER_MAINTENANCE:'Maintenance', SOLD:'Vendu', REJECTED:'Rejetée', ARCHIVED:'Archivé', SUBMITTED:'Soumise', UNDER_REVIEW:'En étude', MATCHING:'Matching', PROPOSAL_SENT:'Proposition envoyée', ACCEPTED:'Acceptée', CONTRACTED:'Contractualisé', ACTIVE:'Actif', COMPLETED:'Terminé', CANCELLED:'Annulé', SENT:'Envoyée', EXPIRED:'Expirée', PENDING_SIGNATURE:'En attente signature', READY_FOR_CONTRACT:'Prête pour contrat', PENDING_COMPANY:'En attente entreprise', PENDING_OWNERS:'En attente propriétaires', REJECTED_BY_COMPANY:'Refusée par entreprise', REJECTED_BY_OWNER:'Refusée par propriétaire', CONTRACT_CREATED:'Contrat créé', PARTIALLY_PAID:'Partiellement payée', PAID:'Payée', OVERDUE:'En retard', PLANNED:'Planifié', IN_TRANSIT:'Transit', ON_SITE:'Sur site', PAUSED:'En pause', PENDING:'En attente', CONFIRMED:'Confirmé'
};
export function normalizeStatus(status?: string | null) { return String(status || 'UNKNOWN').trim().toUpperCase().replace(/[\s-]+/g, '_'); }
export function getStatusLabel(status?: string | null) { return labels[normalizeStatus(status)] || labels.UNKNOWN; }
export function getStatusVariant(status?: string | null) {
  const s=normalizeStatus(status);
  if(['ACCEPTED','READY_FOR_CONTRACT','ACTIVE','COMPLETED','AVAILABLE','PAID','CONFIRMED','ON_SITE'].includes(s)) return 'success';
  if(['SENT','PARTIALLY_PAID','PENDING','PENDING_COMPANY','PENDING_OWNERS','PENDING_SIGNATURE','DRAFT','PENDING_REVIEW','UNDER_REVIEW','UNDER_MAINTENANCE'].includes(s)) return 'warning';
  if(['REJECTED','REJECTED_BY_COMPANY','REJECTED_BY_OWNER','CANCELLED','OVERDUE','FAILED'].includes(s)) return 'danger';
  return 'neutral';
}
