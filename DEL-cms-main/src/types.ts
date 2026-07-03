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
  title?: string;
  requestId: string;
  requestTitle: string;
  tenderId?: string;
  tenderLotId?: string;
  engineId: string;
  engineName: string;
  equipmentIds?: string[];
  companyName: string;
  companyUserId?: string;
  ownerNames?: string[];
  ownerUserIds?: string[];
  dailyRate: number;
  transportCost: number;
  otherCosts: number;
  totalEstimated: number;
  finalPrice?: number;
  currency?: string;
  durationMonths?: number;
  status: string;
  workflowStatus?: string;
  companyDecision?: any;
  ownerDecisions?: any[];
  validUntil: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Contract {
  id: string;
  code: string;
  contractNumber?: string;
  title?: string;
  proposalId: string;
  requestId?: string;
  companyName: string;
  ownerNames?: string[];
  equipmentIds?: string[];
  engineName: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalAmount: number;
  amount?: number;
  platformCommissionRate?: number;
  platformCommissionAmount?: number;
  ownerAmount?: number;
  currency?: string;
  status: string;
  signedAt?: string;
  insuranceNumber: string;
  paymentTerms?: string;
  conditions?: string;
  responsibilities?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  code: string;
  invoiceNumber?: string;
  title?: string;
  contractId: string;
  proposalId?: string;
  requestId?: string;
  companyName: string;
  ownerNames?: string[];
  equipmentIds?: string[];
  amountExclTax: number;
  subtotal?: number;
  taxRate?: number;
  taxAmount: number;
  totalAmount: number;
  platformCommissionRate?: number;
  platformCommissionAmount?: number;
  ownerAmount?: number;
  amountPaid?: number;
  balanceDue?: number;
  currency?: string;
  status: string;
  issuedAt: string;
  dueDate: string;
  periodStart?: string;
  periodEnd?: string;
  paymentTerms?: string;
  notes?: string;
  paidAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  code: string;
  paymentNumber?: string;
  invoiceId: string;
  invoiceCode: string;
  contractId?: string;
  companyName: string;
  amount: number;
  currency?: string;
  method: string;
  paymentDate?: string;
  proofUrl?: string;
  status: string;
  transactionDate: string;
  reference: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  missionNumber?: string;
  requestId?: string;
  proposalId?: string;
  equipmentIds?: string[];
  companyName?: string;
  ownerNames?: string[];
  missionType?: string;
  country?: string;
  city?: string;
  siteName?: string;
  siteLocationText?: string;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  totalDistanceKm?: number;
  totalEngineHours?: number;
  totalFuelLiters?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Maintenance {
  id: string;
  code: string;
  engineId: string;
  engineName: string;
  technicianId: string;
  technicianName: string;
  type: string;
  title: string;
  description: string;
  status: string;
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  ticketNumber?: string;
  equipmentId?: string;
  equipmentTitle?: string;
  missionId?: string;
  contractId?: string;
  ownerName?: string;
  companyName?: string;
  issueType?: string;
  severity?: string;
  diagnostic?: string;
  estimatedCost?: number;
  finalCost?: number;
  currency?: string;
  workshop?: string;
  actualDowntimeHours?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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
  actorUserId?: string;
  actorName?: string;
  actorRole?: string;
  action: string;
  module?: string;
  entityType?: string;
  entityId?: string;
  entityLabel?: string;
  oldValue?: unknown;
  newValue?: unknown;
  message?: string;
  ipAddress?: string;
  userAgent?: string;
  severity?: string;
  createdAt?: string;
  user: string;
  category: 'Engin' | 'Demande' | 'Contrat' | 'Facturation' | 'Sécurité' | 'Système';
  timestamp: string;
  details: string;
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
  platformName?: string;
  legalName?: string;
  defaultCurrency?: string;
  enabledCurrencies?: string[];
  defaultPlatformCommissionRate?: number;
  defaultTaxRate?: number;
  enablePdfReports?: boolean;
  enableNotifications?: boolean;
  enableScoring?: boolean;
  enableTenderModule?: boolean;
}
