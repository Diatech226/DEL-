import { normalizeStatus } from './status';

const STATUS_LABELS: Record<string, string> = { OPEN: 'Ouverte', PENDING_ADMIN: 'En attente admin', PENDING_USER: 'En attente utilisateur', RESOLVED: 'Résolue', CLOSED: 'Fermée' };
const STATUS_VARIANTS: Record<string, string> = { OPEN: 'info', PENDING_ADMIN: 'warning', PENDING_USER: 'info', RESOLVED: 'success', CLOSED: 'neutral' };
const PRIORITY_LABELS: Record<string, string> = { LOW: 'Faible', NORMAL: 'Normale', HIGH: 'Haute', CRITICAL: 'Critique' };
const PRIORITY_VARIANTS: Record<string, string> = { LOW: 'neutral', NORMAL: 'info', HIGH: 'warning', CRITICAL: 'danger' };

export function getConversationStatusLabel(status?: string | null) { return STATUS_LABELS[normalizeStatus(status)] || status || 'Ouverte'; }
export function getConversationStatusVariant(status?: string | null) { return STATUS_VARIANTS[normalizeStatus(status)] || 'info'; }
export function getConversationPriorityLabel(priority?: string | null) { return PRIORITY_LABELS[normalizeStatus(priority)] || priority || 'Normale'; }
export function getConversationPriorityVariant(priority?: string | null) { return PRIORITY_VARIANTS[normalizeStatus(priority)] || 'info'; }
