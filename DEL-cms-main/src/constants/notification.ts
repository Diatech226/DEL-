import { normalizeStatus } from './status';

const TYPE_LABELS: Record<string, string> = {
  PROPOSAL_CREATED: 'Proposition créée', PROPOSAL_ACCEPTED: 'Proposition acceptée', PROPOSAL_REJECTED: 'Proposition rejetée', CONTRACT_CREATED: 'Contrat créé', INVOICE_CREATED: 'Facture créée', PAYMENT_CREATED: 'Paiement créé', DOCUMENT_VERIFIED: 'Document vérifié', DOCUMENT_REJECTED: 'Document rejeté', MISSION_CREATED: 'Mission créée', MAINTENANCE_CREATED: 'Maintenance créée', PROFILE_VERIFIED: 'Profil vérifié', PROFILE_REJECTED: 'Profil rejeté', EQUIPMENT_STATUS_UPDATED: 'Statut engin mis à jour', REQUEST_STATUS_UPDATED: 'Statut demande mis à jour', SYSTEM: 'Système'
};
const PRIORITY_LABELS: Record<string, string> = { LOW: 'Faible', NORMAL: 'Normale', HIGH: 'Haute', CRITICAL: 'Critique' };
const PRIORITY_VARIANTS: Record<string, string> = { LOW: 'neutral', NORMAL: 'info', HIGH: 'warning', CRITICAL: 'danger' };

export function getNotificationTypeLabel(type?: string | null) { return TYPE_LABELS[normalizeStatus(type)] || type || 'Système'; }
export function getNotificationPriorityLabel(priority?: string | null) { return PRIORITY_LABELS[normalizeStatus(priority)] || priority || 'Normale'; }
export function getNotificationPriorityVariant(priority?: string | null) { return PRIORITY_VARIANTS[normalizeStatus(priority)] || 'info'; }
