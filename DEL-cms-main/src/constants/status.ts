const LABELS: Record<string, string> = {
  DRAFT: 'Brouillon', PENDING_REVIEW: 'En validation', AVAILABLE: 'Disponible', RESERVED: 'Réservé', PLACED: 'Placé', UNDER_MAINTENANCE: 'En maintenance', SOLD: 'Vendu', REJECTED: 'Rejeté', ARCHIVED: 'Archivé',
  SUBMITTED: 'Soumis', UNDER_REVIEW: 'En revue', MATCHING: 'Matching', PROPOSAL_SENT: 'Proposition envoyée', ACCEPTED: 'Accepté', CONTRACTED: 'Contractualisé', ACTIVE: 'Actif', COMPLETED: 'Terminé', CANCELLED: 'Annulé',
  SENT: 'Envoyé', READY_FOR_CONTRACT: 'Prêt pour contrat', PENDING_COMPANY: 'En attente entreprise', PENDING_OWNERS: 'En attente propriétaires', CONTRACT_CREATED: 'Contrat créé', UNKNOWN: 'Inconnu',
};

export function normalizeStatus(status?: string | null) {
  return (status || 'UNKNOWN').toString().trim().toUpperCase().replace(/[\s-]+/g, '_') || 'UNKNOWN';
}

export function getStatusLabel(status?: string | null) {
  return LABELS[normalizeStatus(status)] || status || LABELS.UNKNOWN;
}

export function getStatusVariant(status?: string | null) {
  const normalized = normalizeStatus(status);
  if (['AVAILABLE', 'ACTIVE', 'COMPLETED', 'ACCEPTED', 'READY_FOR_CONTRACT'].includes(normalized)) return 'success';
  if (['PENDING_REVIEW', 'UNDER_REVIEW', 'MATCHING', 'PROPOSAL_SENT', 'SENT', 'PENDING_COMPANY', 'PENDING_OWNERS'].includes(normalized)) return 'warning';
  if (['REJECTED', 'CANCELLED'].includes(normalized)) return 'danger';
  if (['RESERVED', 'PLACED', 'CONTRACTED', 'CONTRACT_CREATED'].includes(normalized)) return 'info';
  return 'neutral';
}
