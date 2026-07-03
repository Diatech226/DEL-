import {
  Engine,
  ClientRequest,
  Proposal,
  Contract,
  Invoice,
  Payment,
  Mission,
  Maintenance,
  Document,
  Proprietor,
  Company,
  Technician,
  AuditLog,
  ExportJob,
  PdfReport,
  GlobalParams
} from './types';

export const initialProprietors: Proprietor[] = [
  {
    id: 'prop-1',
    code: 'PRP-001',
    name: 'Atlas Matériel Industriel',
    type: 'Entreprise',
    phone: '+33 1 45 78 90 12',
    email: 'contact@atlas-materiel.fr',
    enginesCount: 4,
    paidAmount: 84320,
    commissionRate: 10
  },
  {
    id: 'prop-2',
    code: 'PRP-002',
    name: 'Jean-Marc Durand',
    type: 'Particulier',
    phone: '+33 6 12 34 56 78',
    email: 'jm.durand@gmail.com',
    enginesCount: 1,
    paidAmount: 12400,
    commissionRate: 12
  },
  {
    id: 'prop-3',
    code: 'PRP-003',
    name: 'SOMACO Location S.A.',
    type: 'Entreprise',
    phone: '+33 4 91 22 33 44',
    email: 'fleet@somaco-rent.com',
    enginesCount: 3,
    paidAmount: 45600,
    commissionRate: 8
  },
  {
    id: 'prop-4',
    code: 'PRP-004',
    name: 'Giraud Levage & Énergie',
    type: 'Entreprise',
    phone: '+33 3 80 40 50 60',
    email: 'contact@giraud-energie.fr',
    enginesCount: 2,
    paidAmount: 109200,
    commissionRate: 9
  }
];

export const initialCompanies: Company[] = [
  {
    id: 'comp-1',
    code: 'ETP-101',
    name: 'Vinci Construction France',
    address: '61 Avenue Jules Quentin, 92000 Nanterre',
    contactName: 'Thomas Martin',
    phone: '+33 1 47 16 30 00',
    email: 't.martin@vinci-construction.fr',
    activeContractsCount: 2,
    totalSpent: 145000
  },
  {
    id: 'comp-2',
    code: 'ETP-102',
    name: 'Bouygues Travaux Publics',
    address: '1 Avenue Eugène Freyssinet, 78280 Guyancourt',
    contactName: 'Sophie Bernard',
    phone: '+33 1 30 60 20 00',
    email: 's.bernard@bouygues-tp.com',
    activeContractsCount: 1,
    totalSpent: 89000
  },
  {
    id: 'comp-3',
    code: 'ETP-103',
    name: 'Eiffage Route Ouest',
    address: 'Rue de la Giraudière, 35510 Cesson-Sévigné',
    contactName: 'Laurent Petit',
    phone: '+33 2 99 83 90 20',
    email: 'laurent.petit@eiffage.com',
    activeContractsCount: 0,
    totalSpent: 34000
  },
  {
    id: 'comp-4',
    code: 'ETP-104',
    name: 'Colas Île-de-France',
    address: '4 Rue René Clair, 75018 Paris',
    contactName: 'Isabelle Moreau',
    phone: '+33 1 44 85 80 00',
    email: 'i.moreau@colas-idf.fr',
    activeContractsCount: 1,
    totalSpent: 112500
  }
];

export const initialTechnicians: Technician[] = [
  {
    id: 'tech-1',
    code: 'TEC-01',
    name: 'Marc Levêque',
    specialty: 'Moteurs Diesel & Groupes Électrogènes',
    phone: '+33 6 88 11 22 33',
    email: 'm.leveque@del-technique.fr',
    status: 'Disponible',
    rating: 4.8,
    certificationCode: 'CERT-DIE-2024-88'
  },
  {
    id: 'tech-2',
    code: 'TEC-02',
    name: 'Alexandre Simon',
    specialty: 'Hydraulique Lourde & Engins de Terrassement',
    phone: '+33 6 77 22 33 44',
    email: 'a.simon@del-technique.fr',
    status: 'En Mission',
    rating: 4.9,
    certificationCode: 'CERT-HYD-2023-14'
  },
  {
    id: 'tech-3',
    code: 'TEC-03',
    name: 'Nathalie Rocher',
    specialty: 'Systèmes Électriques & Électronique Industrielle',
    phone: '+33 6 55 44 33 22',
    email: 'n.rocher@del-technique.fr',
    status: 'Disponible',
    rating: 4.7,
    certificationCode: 'CERT-ELE-2025-09'
  },
  {
    id: 'tech-4',
    code: 'TEC-04',
    name: 'Stéphane Brun',
    specialty: 'Compresseurs & Turbo-Machines',
    phone: '+33 6 44 88 99 00',
    email: 's.brun@del-technique.fr',
    status: 'En Congé',
    rating: 4.5,
    certificationCode: 'CERT-CMP-2022-45'
  }
];

export const initialEngines: Engine[] = [
  {
    id: 'eng-1',
    code: 'ENG-101',
    name: 'Générateur Caterpillar 3516B',
    category: 'Groupe Électrogène',
    brand: 'Caterpillar',
    model: '3516B-TA',
    power: 1600, // kW
    status: 'Disponible',
    hourlyRate: 120,
    dailyRate: 950,
    currentHours: 4250,
    ownerId: 'prop-1',
    ownerName: 'Atlas Matériel Industriel',
    location: 'Lyon (69)',
    year: 2021,
    serialNumber: 'CAT3516B-TY98214',
    nextMaintenance: '2026-08-15'
  },
  {
    id: 'eng-2',
    code: 'ENG-102',
    name: 'Excavatrice de Carrière Komatsu PC800',
    category: 'Excavatrice',
    brand: 'Komatsu',
    model: 'PC800LC-11',
    power: 370, // kW
    status: 'En Mission',
    hourlyRate: 180,
    dailyRate: 1450,
    currentHours: 1850,
    ownerId: 'prop-3',
    ownerName: 'SOMACO Location S.A.',
    location: 'Marseille (13)',
    year: 2022,
    serialNumber: 'KOM800LC-661022',
    nextMaintenance: '2026-07-28'
  },
  {
    id: 'eng-3',
    code: 'ENG-103',
    name: 'Groupe Électrogène Cummins QSK60',
    category: 'Groupe Électrogène',
    brand: 'Cummins',
    model: 'QSK60-G4',
    power: 2000, // kW
    status: 'Disponible',
    hourlyRate: 150,
    dailyRate: 1200,
    currentHours: 3100,
    ownerId: 'prop-4',
    ownerName: 'Giraud Levage & Énergie',
    location: 'Paris Nord (95)',
    year: 2020,
    serialNumber: 'CUM60G4-771239',
    nextMaintenance: '2026-09-02'
  },
  {
    id: 'eng-4',
    code: 'ENG-104',
    name: 'Compresseur de Chantier Atlas Copco XRVS 1550',
    category: 'Compresseur',
    brand: 'Atlas Copco',
    model: 'XRVS 1550 CD7',
    power: 429, // kW
    status: 'En Maintenance',
    hourlyRate: 90,
    dailyRate: 720,
    currentHours: 5600,
    ownerId: 'prop-1',
    ownerName: 'Atlas Matériel Industriel',
    location: 'Bordeaux (33)',
    year: 2019,
    serialNumber: 'ATC1550-994412',
    nextMaintenance: '2026-07-10'
  },
  {
    id: 'eng-5',
    code: 'ENG-105',
    name: 'Grue Mobile Liebherr LTM 1050',
    category: 'Grue Mobile',
    brand: 'Liebherr',
    model: 'LTM 1050-3.1',
    power: 270, // kW
    status: 'En Mission',
    hourlyRate: 210,
    dailyRate: 1680,
    currentHours: 2450,
    ownerId: 'prop-4',
    ownerName: 'Giraud Levage & Énergie',
    location: 'Nantes (44)',
    year: 2023,
    serialNumber: 'LTM1050-310928',
    nextMaintenance: '2026-10-12'
  },
  {
    id: 'eng-6',
    code: 'ENG-106',
    name: 'Pompe Industrielle Sulzer de Grand Débit',
    category: 'Pompe Haute Capacité',
    brand: 'Sulzer',
    model: 'MBN50',
    power: 315, // kW
    status: 'Disponible',
    hourlyRate: 75,
    dailyRate: 580,
    currentHours: 920,
    ownerId: 'prop-2',
    ownerName: 'Jean-Marc Durand',
    location: 'Lille (59)',
    year: 2024,
    serialNumber: 'SLZ-MBN50-0199',
    nextMaintenance: '2026-11-20'
  },
  {
    id: 'eng-7',
    code: 'ENG-107',
    name: 'Chargeur sur Pneus Volvo L350H',
    category: 'Chargeur',
    brand: 'Volvo',
    model: 'L350H-Tier4f',
    power: 397, // kW
    status: 'En Panne',
    hourlyRate: 160,
    dailyRate: 1300,
    currentHours: 6800,
    ownerId: 'prop-1',
    ownerName: 'Atlas Matériel Industriel',
    location: 'Paris Sud (91)',
    year: 2018,
    serialNumber: 'VOL350H-882201',
    nextMaintenance: '2026-07-05'
  },
  {
    id: 'eng-8',
    code: 'ENG-108',
    name: 'Générateur Caterpillar 3512B',
    category: 'Groupe Électrogène',
    brand: 'Caterpillar',
    model: '3512B-M',
    power: 1200, // kW
    status: 'Disponible',
    hourlyRate: 110,
    dailyRate: 850,
    currentHours: 3900,
    ownerId: 'prop-1',
    ownerName: 'Atlas Matériel Industriel',
    location: 'Lyon (69)',
    year: 2020,
    serialNumber: 'CAT3512B-TY91002',
    nextMaintenance: '2026-08-01'
  }
];

export const initialRequests: ClientRequest[] = [
  {
    id: 'req-1',
    code: 'REQ-201',
    companyId: 'comp-1',
    companyName: 'Vinci Construction France',
    title: 'Alimentation de secours Chantier TBM-GrandParis',
    category: 'Groupe Électrogène',
    minPower: 1500, // kW
    durationDays: 45,
    budget: 50000,
    status: 'Matching',
    startDate: '2026-07-20',
    description: 'Besoin urgent d\'un groupe électrogène de secours de minimum 1500 kW pour alimenter le tunnelier principal du Lot B-4 sur le Grand Paris Express. Fonctionnement h24 requis avec système de secours automatique.',
    matchingCount: 2,
    contactName: 'Thomas Martin',
    contactEmail: 't.martin@vinci-construction.fr',
    workflow: [
      { name: 'Nouvelle', label: 'Création de la demande', status: 'completed', date: '2026-06-28', updatedBy: 'Admin' },
      { name: 'Qualification', label: 'Validation technique', status: 'completed', date: '2026-06-30', updatedBy: 'Alexandre Simon (Tech)' },
      { name: 'Matching', label: 'Recherche d\'engins compatibles', status: 'current', date: '2026-07-02', updatedBy: 'Système' },
      { name: 'Proposition', label: 'Émission de l\'offre commerciale', status: 'upcoming' },
      { name: 'Contrat', label: 'Signature contractuelle', status: 'upcoming' },
      { name: 'Active', label: 'Mise en service', status: 'upcoming' },
      { name: 'Terminée', label: 'Restitution & Facturation', status: 'upcoming' }
    ]
  },
  {
    id: 'req-2',
    code: 'REQ-202',
    companyId: 'comp-2',
    companyName: 'Bouygues Travaux Publics',
    title: 'Excavation de grande envergure - Extension Port de Marseille',
    category: 'Excavatrice',
    minPower: 350,
    durationDays: 60,
    budget: 90000,
    status: 'Active',
    startDate: '2026-06-15',
    description: 'Location d\'une excavatrice de carrière lourde (>350 kW) pour les travaux de remblaiement et de creusement sous-marins au Port Autonome de Marseille.',
    matchingCount: 1,
    contactName: 'Sophie Bernard',
    contactEmail: 's.bernard@bouygues-tp.com',
    workflow: [
      { name: 'Nouvelle', label: 'Création de la demande', status: 'completed', date: '2026-05-10', updatedBy: 'Client Portal' },
      { name: 'Qualification', label: 'Validation technique', status: 'completed', date: '2026-05-12', updatedBy: 'Admin' },
      { name: 'Matching', label: 'Recherche d\'engins compatibles', status: 'completed', date: '2026-05-15', updatedBy: 'Système' },
      { name: 'Proposition', label: 'Offre envoyée', status: 'completed', date: '2026-05-18', updatedBy: 'Admin' },
      { name: 'Contrat', label: 'Contrat signé', status: 'completed', date: '2026-06-01', updatedBy: 'Thomas Martin' },
      { name: 'Active', label: 'Mise en service de l\'engin', status: 'current', date: '2026-06-15', updatedBy: 'Marc Levêque (Tech)' },
      { name: 'Terminée', label: 'Restitution & Facturation', status: 'upcoming' }
    ]
  },
  {
    id: 'req-3',
    code: 'REQ-203',
    companyId: 'comp-4',
    companyName: 'Colas Île-de-France',
    title: 'Grue Lourde pour Levage Préfabriqués - Chantier Rungis',
    category: 'Grue Mobile',
    minPower: 250,
    durationDays: 30,
    budget: 55000,
    status: 'Proposition',
    startDate: '2026-07-15',
    description: 'Mise à disposition d\'une grue mobile de 50 tonnes minimum avec opérateur qualifié pour le levage d\'éléments préfabriqués en béton sur le chantier d\'agrandissement du MIN de Rungis.',
    matchingCount: 1,
    contactName: 'Isabelle Moreau',
    contactEmail: 'i.moreau@colas-idf.fr',
    workflow: [
      { name: 'Nouvelle', label: 'Création de la demande', status: 'completed', date: '2026-06-25', updatedBy: 'Client Portal' },
      { name: 'Qualification', label: 'Validation technique', status: 'completed', date: '2026-06-26', updatedBy: 'Admin' },
      { name: 'Matching', label: 'Recherche d\'engins compatibles', status: 'completed', date: '2026-06-27', updatedBy: 'Système' },
      { name: 'Proposition', label: 'Offre envoyée (Offre #PRO-301)', status: 'current', date: '2026-06-29', updatedBy: 'Admin' },
      { name: 'Contrat', label: 'Signature contractuelle', status: 'upcoming' },
      { name: 'Active', label: 'Mise en service', status: 'upcoming' },
      { name: 'Terminée', label: 'Restitution & Facturation', status: 'upcoming' }
    ]
  },
  {
    id: 'req-4',
    code: 'REQ-204',
    companyId: 'comp-1',
    companyName: 'Vinci Construction France',
    title: 'Pompage de Crue Urgente - Chantier Saint-Denis',
    category: 'Pompe Haute Capacité',
    minPower: 250,
    durationDays: 10,
    budget: 8000,
    status: 'Nouvelle',
    startDate: '2026-07-05',
    description: 'Demande urgente de pompage suite à des infiltrations d\'eau majeures dans la fouille archéologique du chantier de la gare de Saint-Denis.',
    matchingCount: 1,
    contactName: 'Thomas Martin',
    contactEmail: 't.martin@vinci-construction.fr',
    workflow: [
      { name: 'Nouvelle', label: 'Création de la demande', status: 'current', date: '2026-07-02', updatedBy: 'Admin' },
      { name: 'Qualification', label: 'Validation technique', status: 'upcoming' },
      { name: 'Matching', label: 'Recherche d\'engins compatibles', status: 'upcoming' },
      { name: 'Proposition', label: 'Émission de l\'offre commerciale', status: 'upcoming' },
      { name: 'Contrat', label: 'Signature contractuelle', status: 'upcoming' },
      { name: 'Active', label: 'Mise en service', status: 'upcoming' },
      { name: 'Terminée', label: 'Restitution & Facturation', status: 'upcoming' }
    ]
  }
];

export const initialProposals: Proposal[] = [
  {
    id: 'prop-301',
    code: 'PRO-301',
    requestId: 'req-3',
    requestTitle: 'Grue Lourde pour Levage Préfabriqués - Chantier Rungis',
    engineId: 'eng-5',
    engineName: 'Grue Mobile Liebherr LTM 1050',
    companyName: 'Colas Île-de-France',
    dailyRate: 1680,
    transportCost: 1200,
    otherCosts: 450,
    totalEstimated: 52050, // (1680 * 30) + 1200 + 450
    status: 'Envoyée',
    validUntil: '2026-07-10',
    createdAt: '2026-06-29'
  },
  {
    id: 'prop-302',
    code: 'PRO-302',
    requestId: 'req-2',
    requestTitle: 'Excavation de grande envergure - Extension Port de Marseille',
    engineId: 'eng-2',
    engineName: 'Excavatrice de Carrière Komatsu PC800',
    companyName: 'Bouygues Travaux Publics',
    dailyRate: 1450,
    transportCost: 2000,
    otherCosts: 0,
    totalEstimated: 89000, // (1450 * 60) + 2000
    status: 'Acceptée',
    validUntil: '2026-06-10',
    createdAt: '2026-05-18'
  }
];

export const initialContracts: Contract[] = [
  {
    id: 'ctr-401',
    code: 'CTR-401',
    proposalId: 'prop-302',
    companyName: 'Bouygues Travaux Publics',
    engineName: 'Excavatrice de Carrière Komatsu PC800',
    startDate: '2026-06-15',
    endDate: '2026-08-14',
    dailyRate: 1450,
    totalAmount: 89000,
    status: 'Actif',
    signedAt: '2026-06-01',
    insuranceNumber: 'AXA-IND-9982410-X'
  },
  {
    id: 'ctr-402',
    code: 'CTR-402',
    proposalId: 'prop-301',
    companyName: 'Colas Île-de-France',
    engineName: 'Grue Mobile Liebherr LTM 1050',
    startDate: '2026-07-15',
    endDate: '2026-08-14',
    dailyRate: 1680,
    totalAmount: 52050,
    status: 'En Signature',
    insuranceNumber: 'ALL-BAT-7741029-A'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-501',
    code: 'FAC-2026-001',
    contractId: 'ctr-401',
    companyName: 'Bouygues Travaux Publics',
    amountExclTax: 44500, // Partial or full
    taxAmount: 8900, // 20%
    totalAmount: 53400,
    status: 'Payée',
    issuedAt: '2026-06-15',
    dueDate: '2026-07-15',
    paidAt: '2026-06-20'
  },
  {
    id: 'inv-502',
    code: 'FAC-2026-002',
    contractId: 'ctr-401',
    companyName: 'Bouygues Travaux Publics',
    amountExclTax: 44500,
    taxAmount: 8900,
    totalAmount: 53400,
    status: 'Envoyée',
    issuedAt: '2026-07-01',
    dueDate: '2026-07-31'
  },
  {
    id: 'inv-503',
    code: 'FAC-2026-003',
    contractId: 'ctr-402',
    companyName: 'Colas Île-de-France',
    amountExclTax: 52050,
    taxAmount: 10410,
    totalAmount: 62460,
    status: 'Brouillon',
    issuedAt: '2026-07-02',
    dueDate: '2026-08-01'
  },
  {
    id: 'inv-504',
    code: 'FAC-2026-004',
    contractId: 'ctr-401',
    companyName: 'Eiffage Route Ouest',
    amountExclTax: 28333,
    taxAmount: 5666,
    totalAmount: 34000,
    status: 'En Retard',
    issuedAt: '2026-05-01',
    dueDate: '2026-05-31'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 'pay-601',
    code: 'PAY-001',
    invoiceId: 'inv-501',
    invoiceCode: 'FAC-2026-001',
    companyName: 'Bouygues Travaux Publics',
    amount: 53400,
    method: 'Virement bancaire',
    status: 'Réussi',
    transactionDate: '2026-06-20',
    reference: 'VR-BOY-882109'
  },
  {
    id: 'pay-602',
    code: 'PAY-002',
    invoiceId: 'inv-502',
    invoiceCode: 'FAC-2026-002',
    companyName: 'Bouygues Travaux Publics',
    amount: 53400,
    method: 'Prélèvement SEPA',
    status: 'En Cours',
    transactionDate: '2026-07-01',
    reference: 'SP-BOY-771120'
  },
  {
    id: 'pay-603',
    code: 'PAY-003',
    invoiceId: 'inv-504',
    invoiceCode: 'FAC-2026-004',
    companyName: 'Eiffage Route Ouest',
    amount: 34000,
    method: 'Virement bancaire',
    status: 'Échoué',
    transactionDate: '2026-06-05',
    reference: 'VR-EIF-991122'
  }
];

export const initialMissions: Mission[] = [
  {
    id: 'mis-701',
    code: 'MIS-001',
    contractId: 'ctr-401',
    contractCode: 'CTR-401',
    technicianId: 'tech-2',
    technicianName: 'Alexandre Simon',
    engineId: 'eng-2',
    engineName: 'Excavatrice de Carrière Komatsu PC800',
    title: 'Installation et Tests Initiaux - Marseille Port',
    description: 'Mise en route de l\'excavatrice sur site, vérification des circuits hydrauliques haute pression et formation rapide du conducteur local Bouygues.',
    status: 'Terminée',
    startDate: '2026-06-15',
    endDate: '2026-06-16',
    progress: 100
  },
  {
    id: 'mis-702',
    code: 'MIS-002',
    contractId: 'ctr-401',
    contractCode: 'CTR-401',
    technicianId: 'tech-1',
    technicianName: 'Marc Levêque',
    engineId: 'eng-2',
    engineName: 'Excavatrice de Carrière Komatsu PC800',
    title: 'Suivi de chantier mensuel & Vidange',
    description: 'Inspection technique périodique de l\'excavatrice après 150 heures de service continu sous forte charge saline.',
    status: 'En Cours',
    startDate: '2026-07-01',
    endDate: '2026-07-03',
    progress: 60
  },
  {
    id: 'mis-703',
    code: 'MIS-003',
    contractId: 'ctr-402',
    contractCode: 'CTR-402',
    technicianId: 'tech-3',
    technicianName: 'Nathalie Rocher',
    engineId: 'eng-5',
    engineName: 'Grue Mobile Liebherr LTM 1050',
    title: 'Contrôle réglementaire VGP - Rungis',
    description: 'Présence technique obligatoire lors du passage du bureau de contrôle de sécurité pour l\'homologation levage sur le chantier MIN.',
    status: 'Planifiée',
    startDate: '2026-07-16',
    endDate: '2026-07-16',
    progress: 0
  }
];

export const initialMaintenances: Maintenance[] = [
  {
    id: 'maint-801',
    code: 'MNT-001',
    engineId: 'eng-4',
    engineName: 'Compresseur de Chantier Atlas Copco XRVS 1550',
    technicianId: 'tech-4',
    technicianName: 'Stéphane Brun',
    type: 'Préventive',
    title: 'Révision annuelle complète 5000h',
    description: 'Changement des filtres à air, huile de compression et contrôle d\'étanchéité de l\'étage de compression haute pression.',
    status: 'En Cours',
    scheduledDate: '2026-07-01',
    cost: 1450
  },
  {
    id: 'maint-802',
    code: 'MNT-002',
    engineId: 'eng-7',
    engineName: 'Chargeur sur Pneus Volvo L350H',
    technicianId: 'tech-2',
    technicianName: 'Alexandre Simon',
    type: 'Urgente',
    title: 'Rupture flexible hydraulique principal',
    description: 'Fuite hydraulique massive signalée lors des opérations. Remplacement urgent sur le site de Paris Sud requis.',
    status: 'Planifiée',
    scheduledDate: '2026-07-05',
    cost: 850
  },
  {
    id: 'maint-803',
    code: 'MNT-003',
    engineId: 'eng-1',
    engineName: 'Générateur Caterpillar 3516B',
    technicianId: 'tech-1',
    technicianName: 'Marc Levêque',
    type: 'Préventive',
    title: 'Vérification alternateur & Batterie de démarrage',
    description: 'Remplacement préventif du démarreur de secours et test de charge à vide sur banc.',
    status: 'Terminée',
    scheduledDate: '2026-05-12',
    completedDate: '2026-05-13',
    cost: 620
  }
];

export const initialDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Attestation_Assurance_CAT3516B.pdf',
    type: 'Assurance',
    size: '1.2 MB',
    uploadedAt: '2026-01-15',
    uploadedBy: 'Atlas Matériel Industriel',
    relatedTo: 'Générateur Caterpillar 3516B',
    status: 'Valide'
  },
  {
    id: 'doc-2',
    name: 'Certificat_CE_Komatsu_PC800.pdf',
    type: 'Certificat conformité',
    size: '850 KB',
    uploadedAt: '2026-02-10',
    uploadedBy: 'SOMACO Location S.A.',
    relatedTo: 'Excavatrice de Carrière Komatsu PC800',
    status: 'Valide'
  },
  {
    id: 'doc-3',
    name: 'Contrat_Bail_Signe_CTR401.pdf',
    type: 'Contrat de bail',
    size: '3.4 MB',
    uploadedAt: '2026-06-01',
    uploadedBy: 'Thomas Martin (Admin)',
    relatedTo: 'CTR-401 - Bouygues TP',
    status: 'Valide'
  },
  {
    id: 'doc-4',
    name: 'Permis_PoidsLourd_CACES_Leveque.pdf',
    type: 'Permis opérateur',
    size: '450 KB',
    uploadedAt: '2025-11-05',
    uploadedBy: 'Marc Levêque',
    relatedTo: 'Technicien Marc Levêque',
    status: 'Valide'
  },
  {
    id: 'doc-5',
    name: 'Rapport_VGP_Liebherr_LTM1050.pdf',
    type: 'Rapport technique',
    size: '2.1 MB',
    uploadedAt: '2026-06-30',
    uploadedBy: 'Apave Contrôle',
    relatedTo: 'Grue Mobile Liebherr LTM 1050',
    status: 'En Validation'
  },
  {
    id: 'doc-6',
    name: 'Habilitation_Electrique_Nathalie.pdf',
    type: 'Permis opérateur',
    size: '620 KB',
    uploadedAt: '2025-05-12',
    uploadedBy: 'Nathalie Rocher',
    relatedTo: 'Technicien Nathalie Rocher',
    status: 'Valide'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    user: 'Jean-Pierre (Admin)',
    action: 'Validation technique demande REQ-201',
    category: 'Demande',
    timestamp: '2026-06-30 14:23:10',
    details: 'Demande qualifiée techniquement avec puissance minimale de 1500 kW.',
    ipAddress: '192.168.1.110'
  },
  {
    id: 'log-2',
    user: 'Système DEL-cms',
    action: 'Génération automatique de matching',
    category: 'Système',
    timestamp: '2026-06-30 14:24:00',
    details: '2 engins identifiés comme compatibles pour la demande REQ-201.',
    ipAddress: 'localhost'
  },
  {
    id: 'log-3',
    user: 'Jean-Pierre (Admin)',
    action: 'Création facture FAC-2026-003',
    category: 'Facturation',
    timestamp: '2026-07-02 09:12:45',
    details: 'Création du brouillon de facture d\'acompte pour Colas Île-de-France d\'un montant de 62 460 € TTC.',
    ipAddress: '192.168.1.110'
  },
  {
    id: 'log-4',
    user: 'Marc Levêque',
    action: 'Mise à jour statut mission MIS-002',
    category: 'Système',
    timestamp: '2026-07-01 18:30:12',
    details: 'Progression passée à 60% : démontage carter effectué, vidange en cours.',
    ipAddress: '80.12.14.92'
  },
  {
    id: 'log-5',
    user: 'Sophie Bernard (Client)',
    action: 'Téléchargement de document d\'assurance',
    category: 'Sécurité',
    timestamp: '2026-06-15 10:05:00',
    details: 'Téléchargement réussi du fichier Attestation_Assurance_CAT3516B.pdf.',
    ipAddress: '195.154.2.14'
  },
  {
    id: 'log-6',
    user: 'Thomas Martin (Admin)',
    action: 'Modification coefficient de plateforme',
    category: 'Système',
    timestamp: '2026-06-10 11:45:00',
    details: 'Mise à jour de la commission par défaut : 10% -> 9% pour PRP-004.',
    ipAddress: '192.168.1.12'
  }
];

export const initialExports: ExportJob[] = [
  {
    id: 'exp-1',
    name: 'Export_Engins_Disponibles_Juillet2026',
    format: 'Excel',
    status: 'Terminé',
    timestamp: '2026-07-01 10:15:00',
    size: '42 KB',
    recordsCount: 8
  },
  {
    id: 'exp-2',
    name: 'Export_Factures_Impayees_Q2_2026',
    format: 'CSV',
    status: 'Terminé',
    timestamp: '2026-06-30 18:00:00',
    size: '12 KB',
    recordsCount: 3
  },
  {
    id: 'exp-3',
    name: 'Export_Logs_Securite_Complet',
    format: 'JSON',
    status: 'En Cours',
    timestamp: '2026-07-02 09:30:00',
    size: '1.2 MB',
    recordsCount: 1450
  },
  {
    id: 'exp-4',
    name: 'Historique_Techniciens_Missions_2025',
    format: 'Excel',
    status: 'Échoué',
    timestamp: '2026-05-15 14:00:00',
    size: '0 KB',
    recordsCount: 0
  }
];

export const initialPdfReports: PdfReport[] = [
  {
    id: 'rep-1',
    title: 'Rapport d\'Activité Mensuel - Juin 2026',
    type: 'Mensuel',
    period: 'Juin 2026',
    status: 'Prêt',
    generatedAt: '2026-07-01 00:05:12',
    downloadCount: 14
  },
  {
    id: 'rep-2',
    title: 'Rapport Financier Semestriel S1 2026',
    type: 'Financier',
    period: 'Janvier - Juin 2026',
    status: 'Prêt',
    generatedAt: '2026-07-01 01:22:45',
    downloadCount: 35
  },
  {
    id: 'rep-3',
    title: 'Analyse Performance Parc d\'Engins 2025',
    type: 'Performance',
    period: 'Année 2025',
    status: 'Prêt',
    generatedAt: '2026-01-10 18:45:00',
    downloadCount: 89
  },
  {
    id: 'rep-4',
    title: 'Rapport d\'Activité Mensuel - Juillet 2026',
    type: 'Mensuel',
    period: 'Juillet 2026',
    status: 'En cours de génération',
    generatedAt: 'En cours...',
    downloadCount: 0
  }
];

export const defaultParams: GlobalParams = {
  platformFeeRate: 10, // 10%
  taxRate: 20, // 20% VAT
  defaultPaymentTermDays: 30,
  autoMatchingMinScore: 75, // min score to alert admin
  enableSmsAlerts: true,
  maintenanceAlertThresholdHours: 50, // notify when within 50 hrs
  platformName: 'DEL',
  legalName: 'DEL',
  defaultCurrency: 'XOF',
  enabledCurrencies: ['XOF', 'USD', 'EUR'],
  defaultPlatformCommissionRate: 10,
  defaultTaxRate: 0,
  enablePdfReports: true,
  enableNotifications: false,
  enableScoring: false,
  enableTenderModule: false
};
