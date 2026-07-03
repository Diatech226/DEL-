export interface Engine {
  id: string;
  code: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  power: number; // in kW or HP
  status: 'Disponible' | 'En Mission' | 'En Maintenance' | 'En Panne';
  hourlyRate: number;
  dailyRate: number;
  currentHours: number;
  ownerId: string;
  ownerName: string;
  location: string;
  year: number;
  serialNumber: string;
  nextMaintenance: string;
}

export interface RequestWorkflowStep {
  name: string;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  date?: string;
  updatedBy?: string;
}

export interface ClientRequest {
  id: string;
  code: string;
  companyId: string;
  companyName: string;
  title: string;
  category: string;
  minPower: number;
  durationDays: number;
  budget: number;
  status: 'Nouvelle' | 'Qualification' | 'Matching' | 'Proposition' | 'Contrat' | 'Active' | 'Terminée';
  startDate: string;
  description: string;
  matchingCount: number;
  workflow: RequestWorkflowStep[];
  contactName: string;
  contactEmail: string;
}

export interface MatchingResult {
  engineId: string;
  engineCode: string;
  engineName: string;
  score: number; // 0 - 100
  powerMatch: boolean;
  locationMatch: boolean;
  availabilityMatch: boolean;
  distanceKm: number;
  estimatedTransportCost: number;
}

export interface Proposal {
  id: string;
  code: string;
  requestId: string;
  requestTitle: string;
  engineId: string;
  engineName: string;
  companyName: string;
  dailyRate: number;
  transportCost: number;
  otherCosts: number;
  totalEstimated: number;
  status: 'Brouillon' | 'Envoyée' | 'Acceptée' | 'Refusée' | string;
  validUntil: string;
  createdAt: string;
  title?: string;
  tenderId?: string;
  tenderLotId?: string;
  companyUserId?: string;
  equipmentIds?: string[];
  ownerNames?: string[];
  ownerUserIds?: string[];
  finalPrice?: number;
  currency?: string;
  durationMonths?: number;
  workflowStatus?: string;
  companyDecision?: any;
  ownerDecisions?: any[];
  updatedAt?: string;
}

export interface Contract {
  id: string;
  code: string;
  proposalId: string;
  companyName: string;
  engineName: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalAmount: number;
  status: 'Brouillon' | 'En Signature' | 'Signé' | 'Actif' | 'Terminé' | 'Résilié' | string;
  signedAt?: string;
  insuranceNumber: string;
  contractNumber?: string;
  title?: string;
  requestId?: string;
  ownerNames?: string[];
  equipmentIds?: string[];
  amount?: number;
  platformCommissionRate?: number;
  platformCommissionAmount?: number;
  ownerAmount?: number;
  currency?: string;
  paymentTerms?: string;
  conditions?: string;
  responsibilities?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  code: string;
  contractId: string;
  companyName: string;
  amountExclTax: number;
  taxAmount: number;
  totalAmount: number;
  status: 'Brouillon' | 'Envoyée' | 'Payée' | 'En Retard' | 'Annulée';
  issuedAt: string;
  dueDate: string;
  paidAt?: string;
}

export interface Payment {
  id: string;
  code: string;
  invoiceId: string;
  invoiceCode: string;
  companyName: string;
  amount: number;
  method: 'Virement bancaire' | 'Carte bancaire' | 'Prélèvement SEPA';
  status: 'Réussi' | 'En Cours' | 'Échoué';
  transactionDate: string;
  reference: string;
}

export interface Mission {
  id: string;
  code: string;
  contractId: string;
  contractCode: string;
  technicianId?: string;
  technicianName?: string;
  engineId: string;
  engineName: string;
  title: string;
  description: string;
  status: 'Planifiée' | 'En Cours' | 'Terminée' | 'Suspendue';
  startDate: string;
  endDate: string;
  progress: number;
}

export interface Maintenance {
  id: string;
  code: string;
  engineId: string;
  engineName: string;
  technicianId: string;
  technicianName: string;
  type: 'Préventive' | 'Corrective' | 'Urgente';
  title: string;
  description: string;
  status: 'Planifiée' | 'En Cours' | 'Terminée';
  scheduledDate: string;
  completedDate?: string;
  cost: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'Assurance' | 'Certificat conformité' | 'Permis opérateur' | 'Contrat de bail' | 'Rapport technique';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  relatedTo: string; // e.g. "Engin ENG-202" or "Entreprise ETP-401"
  status: 'Valide' | 'Expiré' | 'En Validation';
}

export interface Proprietor {
  id: string;
  code: string;
  name: string;
  type: 'Particulier' | 'Entreprise';
  phone: string;
  email: string;
  enginesCount: number;
  paidAmount: number;
  commissionRate: number; // e.g., 12 for 12%
}

export interface Company {
  id: string;
  code: string;
  name: string;
  address: string;
  contactName: string;
  phone: string;
  email: string;
  activeContractsCount: number;
  totalSpent: number;
}

export interface Technician {
  id: string;
  code: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  status: 'Disponible' | 'En Mission' | 'En Congé';
  rating: number; // 1-5
  certificationCode: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  category: 'Engin' | 'Demande' | 'Contrat' | 'Facturation' | 'Sécurité' | 'Système';
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface ExportJob {
  id: string;
  name: string;
  format: 'CSV' | 'Excel' | 'JSON';
  status: 'Terminé' | 'En Cours' | 'Échoué';
  timestamp: string;
  size: string;
  recordsCount: number;
}

export interface PdfReport {
  id: string;
  title: string;
  type: 'Mensuel' | 'Annuel' | 'Performance' | 'Financier';
  period: string;
  status: 'Prêt' | 'En cours de génération';
  generatedAt: string;
  downloadCount: number;
}

export interface GlobalParams {
  platformFeeRate: number;
  taxRate: number;
  defaultPaymentTermDays: number;
  autoMatchingMinScore: number;
  enableSmsAlerts: boolean;
  maintenanceAlertThresholdHours: number;
}
