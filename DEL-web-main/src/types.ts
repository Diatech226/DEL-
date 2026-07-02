export type MachineStatus = 'available' | 'rented' | 'maintenance' | 'offline';

export interface Machine {
  id: string;
  brand: string;
  model: string;
  type: string; // e.g., Excavatrice, Chargeuse, Grue, Buldozer, Nacelle
  year: number;
  category: string; // e.g., Terrassement, Levage, Route, Manutention
  weight: number; // in tonnes
  hourCounter: number;
  location: string;
  dailyPrice: number; // in EUR
  status: MachineStatus;
  ownerId: string;
  ownerName: string;
  serialNumber: string;
  vgpCertDate: string; // Last safety inspection date
  nextMaintenanceDate: string;
  enginePower: string; // e.g., 150 ch
  bucketCapacity?: string; // e.g., 1.2 m³
  fuelType: string; // e.g., GNR (Gazole Non Routier) or Électrique
  imageUrl: string;
}

export type MaintenanceType = 'Préventif' | 'Curatif' | 'VGP Réglementaire' | 'Vidange';
export type MaintenanceStatus = 'Planifié' | 'En cours' | 'Terminé';

export interface MaintenanceLog {
  id: string;
  machineId: string;
  machineName: string;
  machineModel: string;
  type: MaintenanceType;
  date: string;
  cost: number;
  technician: string;
  description: string;
  status: MaintenanceStatus;
  remarks?: string;
  partsReplaced?: string[];
}

export type ContractStatus = 'Brouillon' | 'En attente de signature' | 'Actif' | 'Terminé';

export interface Contract {
  id: string;
  machineId: string;
  machineName: string;
  machineImage: string;
  clientName: string;
  clientCompany: string;
  ownerName: string;
  ownerCompany: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  deposit: number;
  status: ContractStatus;
  signatureDate?: string;
  insuranceOption: string;
}

export type ProposalStatus = 'En attente' | 'Accepté' | 'Refusé';

export interface Proposal {
  id: string;
  tenderId: string;
  tenderTitle: string;
  machineId: string;
  machineName: string;
  machineImage: string;
  bidderName: string;
  bidderCompany: string;
  priceOffered: number; // Daily price offered
  duration: number; // days
  startDate: string;
  description: string;
  status: ProposalStatus;
  submissionDate: string;
}

export interface Tender {
  id: string;
  title: string;
  clientCompany: string;
  machineType: string;
  minWeight: number; // tonnes
  maxBudget: number; // EUR/day
  startDate: string;
  durationMonths: number;
  location: string;
  description: string;
  status: 'Ouvert' | 'Fermé';
  proposalsCount: number;
  postDate: string;
}

export type InvoiceStatus = 'Payé' | 'En attente' | 'En retard';
export type InvoiceType = 'Location' | 'Maintenance' | 'Assurance';

export interface Invoice {
  id: string;
  type: InvoiceType;
  amount: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  clientCompany: string;
  engineName: string;
  paymentMethod: string;
}

export type DocumentCategory = 'Assurance' | 'Certificat VGP' | 'Carte Grise' | 'Contrat de Vente' | 'Rapport de Panne';

export interface DocumentFile {
  id: string;
  name: string;
  category: DocumentCategory;
  uploadDate: string;
  expiryDate?: string;
  size: string;
  status: 'Valide' | 'Expiré' | 'À renouveler' | 'En attente';
  url: string;
}

export interface Mission {
  id: string;
  contractId: string;
  machineId: string;
  machineName: string;
  machineModel: string;
  driverName: string;
  location: string;
  status: 'Transit' | 'Sur site' | 'Terminé';
  currentTask: string;
  fuelLevel: number; // percentage
  hourCounter: number;
  operatorContact: string;
  siteSupervisor: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  siret: string;
  role: 'proprietaire' | 'locataire' | 'administrateur';
  address: string;
  phone: string;
  rib: string;
  subscription: 'B2B Standard' | 'B2B Premium' | 'DEL Enterprise';
  isVip: boolean;
}
