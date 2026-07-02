import {
  Machine,
  MaintenanceLog,
  Contract,
  Proposal,
  Tender,
  Invoice,
  DocumentFile,
  Mission,
  UserProfile
} from './types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-4122',
  email: 'diaexpressofficial@gmail.com',
  fullName: 'Jean-Marc Mercier',
  companyName: 'DEL-web SAS & Mercier Levage',
  siret: '849 203 112 00045',
  role: 'proprietaire', // Default mode, can toggle to 'locataire'
  address: '42 Avenue de la République, 69002 Lyon, France',
  phone: '+33 4 72 40 20 20',
  rib: 'FR76 3000 6000 0123 4567 8901 123',
  subscription: 'B2B Premium',
  isVip: true
};

export const INITIAL_MACHINES: Machine[] = [
  {
    id: 'mch-101',
    brand: 'Liebherr',
    model: 'R 924 Compact',
    type: 'Pelle sur chenilles',
    year: 2023,
    category: 'Terrassement',
    weight: 24.5,
    hourCounter: 1450,
    location: 'Chantier Lyon Part-Dieu',
    dailyPrice: 420,
    status: 'rented',
    ownerId: 'usr-4122',
    ownerName: 'Jean-Marc Mercier',
    serialNumber: 'LBH924C202300459',
    vgpCertDate: '2026-03-15',
    nextMaintenanceDate: '2026-09-15',
    enginePower: '163 ch',
    bucketCapacity: '1.45 m³',
    fuelType: 'GNR (Hybride)',
    imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mch-102',
    brand: 'Caterpillar',
    model: '320 GC',
    type: 'Pelle hydraulique',
    year: 2022,
    category: 'Terrassement',
    weight: 20.5,
    hourCounter: 2120,
    location: 'Dépôt Mercier - Villeurbanne',
    dailyPrice: 380,
    status: 'available',
    ownerId: 'usr-4122',
    ownerName: 'Jean-Marc Mercier',
    serialNumber: 'CAT320GC20220912A',
    vgpCertDate: '2026-01-10',
    nextMaintenanceDate: '2026-07-10',
    enginePower: '145 ch',
    bucketCapacity: '1.20 m³',
    fuelType: 'GNR',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mch-103',
    brand: 'Manitou',
    model: 'MT 1840 Easy',
    type: 'Chariot télescopique',
    year: 2024,
    category: 'Manutention',
    weight: 11.8,
    hourCounter: 420,
    location: 'Chantier Saint-Priest',
    dailyPrice: 260,
    status: 'rented',
    ownerId: 'usr-4122',
    ownerName: 'Jean-Marc Mercier',
    serialNumber: 'MNT1840E20241103B',
    vgpCertDate: '2026-05-18',
    nextMaintenanceDate: '2026-11-18',
    enginePower: '74 ch',
    bucketCapacity: '0.90 m³',
    fuelType: 'GNR',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mch-104',
    brand: 'Komatsu',
    model: 'PC210LC-11',
    type: 'Pelle sur chenilles',
    year: 2021,
    category: 'Terrassement',
    weight: 22.0,
    hourCounter: 3410,
    location: 'Dépôt Mercier - Villeurbanne',
    dailyPrice: 395,
    status: 'maintenance',
    ownerId: 'usr-4122',
    ownerName: 'Jean-Marc Mercier',
    serialNumber: 'KOM210LC1103491C',
    vgpCertDate: '2025-11-05',
    nextMaintenanceDate: '2026-07-03', // Tomorrow!
    enginePower: '165 ch',
    bucketCapacity: '1.30 m³',
    fuelType: 'GNR',
    imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mch-105',
    brand: 'Mecalac',
    model: '15MC',
    type: 'Pelle sur chenilles polyvalente',
    year: 2023,
    category: 'Terrassement',
    weight: 15.0,
    hourCounter: 980,
    location: 'Chantier Lyon Croix-Rousse',
    dailyPrice: 340,
    status: 'rented',
    ownerId: 'usr-4122',
    ownerName: 'Jean-Marc Mercier',
    serialNumber: 'MEC15MC202300891',
    vgpCertDate: '2026-04-12',
    nextMaintenanceDate: '2026-10-12',
    enginePower: '136 ch',
    bucketCapacity: '1.00 m³',
    fuelType: 'Électrique / Hybride',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mch-106',
    brand: 'JCB',
    model: '3CX Eco',
    type: 'Chargeuse-pelleteuse (Tractopelle)',
    year: 2022,
    category: 'Terrassement',
    weight: 8.1,
    hourCounter: 1820,
    location: 'Dépôt Mercier - Givors',
    dailyPrice: 220,
    status: 'available',
    ownerId: 'usr-4122',
    ownerName: 'Jean-Marc Mercier',
    serialNumber: 'JCB3CXE202201889',
    vgpCertDate: '2025-12-20',
    nextMaintenanceDate: '2026-06-20',
    enginePower: '92 ch',
    bucketCapacity: '1.00 m³',
    fuelType: 'GNR',
    imageUrl: 'https://images.unsplash.com/photo-1513061381006-037e40409395?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mch-107',
    brand: 'Bomag',
    model: 'BW 120 AD-5',
    type: 'Compacteur tandem',
    year: 2023,
    category: 'Route',
    weight: 2.7,
    hourCounter: 310,
    location: 'Dépôt Mercier - Givors',
    dailyPrice: 150,
    status: 'available',
    ownerId: 'usr-4122',
    ownerName: 'Jean-Marc Mercier',
    serialNumber: 'BMG120AD520230301',
    vgpCertDate: '2026-02-14',
    nextMaintenanceDate: '2026-08-14',
    enginePower: '33 ch',
    fuelType: 'GNR',
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&auto=format&fit=crop&q=80'
  },
  // Some global machines owned by other users that are searchable on the platform
  {
    id: 'mch-201',
    brand: 'Potain',
    model: 'Igo T 85 A',
    type: 'Grue à tour à montage rapide',
    year: 2022,
    category: 'Levage',
    weight: 18.0,
    hourCounter: 1200,
    location: 'Chantier Marseille Port',
    dailyPrice: 650,
    status: 'rented',
    ownerId: 'usr-9001',
    ownerName: 'Sud Levage SARL',
    serialNumber: 'PTNIGO85202209A',
    vgpCertDate: '2026-01-20',
    nextMaintenanceDate: '2026-07-20',
    enginePower: 'Electric 45kW',
    fuelType: 'Électrique',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'mch-202',
    brand: 'Haulotte',
    model: 'HA26 RTJ PRO',
    type: 'Nacelle articulée diesel',
    year: 2024,
    category: 'Levage',
    weight: 15.5,
    hourCounter: 110,
    location: 'Marseille Centre',
    dailyPrice: 320,
    status: 'available',
    ownerId: 'usr-9001',
    ownerName: 'Sud Levage SARL',
    serialNumber: 'HAU26RTJ20240101',
    vgpCertDate: '2026-05-10',
    nextMaintenanceDate: '2026-11-10',
    enginePower: '49 ch',
    fuelType: 'GNR',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: 'maint-201',
    machineId: 'mch-104',
    machineName: 'Komatsu',
    machineModel: 'PC210LC-11',
    type: 'VGP Réglementaire',
    date: '2026-07-03', // Scheduled for tomorrow
    cost: 350,
    technician: 'Socotec Lyon',
    description: 'Contrôle semestriel de sécurité réglementaire des appareils de levage et terrassement.',
    status: 'Planifié',
    remarks: 'Prendre rendez-vous sur le chantier ou au dépôt de Villeurbanne.'
  },
  {
    id: 'maint-202',
    machineId: 'mch-104',
    machineName: 'Komatsu',
    machineModel: 'PC210LC-11',
    type: 'Curatif',
    date: '2026-06-28',
    cost: 1450,
    technician: 'Atelier Mercier - Franck',
    description: 'Changement des flexibles hydrauliques du bras principal suite à un suintement constaté.',
    status: 'En cours',
    remarks: 'Flexibles de rechange reçus de Komatsu France ce matin. Montage en cours.',
    partsReplaced: ['Flexible Hydraulique HP DN12', 'Joints toriques Viton', 'Huile hydraulique HV46']
  },
  {
    id: 'maint-203',
    machineId: 'mch-101',
    machineName: 'Liebherr',
    machineModel: 'R 924 Compact',
    type: 'Vidange',
    date: '2026-05-12',
    cost: 620,
    technician: 'Atelier Mercier - Pierre',
    description: 'Vidange moteur des 1500 heures réglementaires, changement des filtres et contrôles des niveaux.',
    status: 'Terminé',
    remarks: 'Rien à signaler. L\'analyse d\'huile ne montre aucun résidu métallique anormal.',
    partsReplaced: ['Filtre à huile', 'Filtre à carburant principal', 'Filtre habitacle charbon', 'Huile moteur 10W40 GNR']
  },
  {
    id: 'maint-204',
    machineId: 'mch-103',
    machineName: 'Manitou',
    machineModel: 'MT 1840 Easy',
    type: 'Préventif',
    date: '2026-05-20',
    cost: 280,
    technician: 'Atelier Mercier - Pierre',
    description: 'Graissage complet des axes de la flèche télescopique, contrôle de l\'alignement des roues.',
    status: 'Terminé',
    remarks: 'Alignement corrigé de 2mm sur le train arrière. Bon état général.',
    partsReplaced: ['Graisse Haute Performance']
  },
  {
    id: 'maint-205',
    machineId: 'mch-102',
    machineName: 'Caterpillar',
    machineModel: '320 GC',
    type: 'VGP Réglementaire',
    date: '2026-01-10',
    cost: 320,
    technician: 'Apave Inspection',
    description: 'Visite générale périodique obligatoire semestrielle.',
    status: 'Terminé',
    remarks: 'Appareil conforme à la réglementation en vigueur. Aucun défaut majeur.'
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'ctr-501',
    machineId: 'mch-101',
    machineName: 'Liebherr R 924 Compact',
    machineImage: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop&q=80',
    clientName: 'Arthur Dubois',
    clientCompany: 'Eiffage Construction Sud-Est',
    ownerName: 'Jean-Marc Mercier',
    ownerCompany: 'Mercier Levage',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    totalPrice: 38640, // 92 days * 420 EUR
    deposit: 5000,
    status: 'Actif',
    signatureDate: '2026-05-28',
    insuranceOption: 'Garantie Bris de Machine Plus'
  },
  {
    id: 'ctr-502',
    machineId: 'mch-103',
    machineName: 'Manitou MT 1840 Easy',
    machineImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    clientName: 'Sarah Belkacem',
    clientCompany: 'Bouygues Bâtiment Sud-Est',
    ownerName: 'Jean-Marc Mercier',
    ownerCompany: 'Mercier Levage',
    startDate: '2026-06-15',
    endDate: '2026-07-15',
    totalPrice: 7800, // 30 days * 260 EUR
    deposit: 3000,
    status: 'Actif',
    signatureDate: '2026-06-12',
    insuranceOption: 'Garantie Responsabilité Civile Chantier'
  },
  {
    id: 'ctr-503',
    machineId: 'mch-105',
    machineName: 'Mecalac 15MC',
    machineImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    clientName: 'Nabil Ghorra',
    clientCompany: 'Vinci Construction France',
    ownerName: 'Jean-Marc Mercier',
    ownerCompany: 'Mercier Levage',
    startDate: '2026-07-10',
    endDate: '2026-09-10',
    totalPrice: 20400, // 60 days * 340 EUR
    deposit: 4500,
    status: 'En attente de signature',
    insuranceOption: 'Garantie Bris de Machine Standard'
  }
];

export const INITIAL_TENDERS: Tender[] = [
  {
    id: 'tnd-301',
    title: 'Besoin Pelle Rail-Route 15-20 Tonnes',
    clientCompany: 'SNCF Réseau Lyon-St-Étienne',
    machineType: 'Pelle Rail-Route',
    minWeight: 16,
    maxBudget: 600,
    startDate: '2026-08-01',
    durationMonths: 2,
    location: 'Givors (69)',
    description: 'Recherche pelle rail-route de forte capacité homologuée réseau ferré national pour travaux de nuit de remplacement de traverses et ballast sur la ligne Lyon - St-Étienne. Chauffeur fourni par SNCF.',
    status: 'Ouvert',
    proposalsCount: 2,
    postDate: '2026-06-25'
  },
  {
    id: 'tnd-302',
    title: 'Location Grue Mobile 100 Tonnes',
    clientCompany: 'Eiffage Métal Rhône-Alpes',
    machineType: 'Grue Mobile télescopique',
    minWeight: 80,
    maxBudget: 1500,
    startDate: '2026-07-20',
    durationMonths: 1,
    location: 'Bron (69)',
    description: 'Pour le levage de poutres métalliques d\'un pont piétonnier. Nécessite grue d\'au moins 100T avec certificat VGP de moins d\'un mois. Prestation souhaitée avec opérateur agréé.',
    status: 'Ouvert',
    proposalsCount: 1,
    postDate: '2026-06-29'
  },
  {
    id: 'tnd-303',
    title: 'Recherche 3 Nacelles à Flèche Télescopique 20m',
    clientCompany: 'Aéroports de Lyon (Saint-Exupéry)',
    machineType: 'Nacelle télescopique',
    minWeight: 5,
    maxBudget: 220,
    startDate: '2026-09-01',
    durationMonths: 3,
    location: 'Colombier-Saugnieu (69)',
    description: 'Pour travaux de rénovation de la toiture du Terminal 1. Motorisation électrique ou hybride obligatoire pour travaux en intérieur/semi-ouvert. Machines livrées sur site.',
    status: 'Ouvert',
    proposalsCount: 0,
    postDate: '2026-07-01'
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-401',
    tenderId: 'tnd-301',
    tenderTitle: 'Besoin Pelle Rail-Route 15-20 Tonnes',
    machineId: 'mch-105',
    machineName: 'Mecalac 15MC (Adaptation Rail-Route)',
    machineImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    bidderName: 'Jean-Marc Mercier',
    bidderCompany: 'Mercier Levage',
    priceOffered: 550,
    duration: 60,
    startDate: '2026-08-01',
    description: 'Nous proposons notre Mecalac 15MC hybride équipée d\'un kit ferroviaire homologué par la SNCF. La machine dispose d\'une télémesure en temps réel et de la dernière VGP valide. Parfaitement adaptée aux interventions en tunnel de nuit.',
    status: 'En attente',
    submissionDate: '2026-06-28'
  },
  {
    id: 'prop-402',
    tenderId: 'tnd-302',
    tenderTitle: 'Location Grue Mobile 100 Tonnes',
    machineId: 'mch-201',
    machineName: 'Potain Igo T 85 A (Grue Chantier)',
    machineImage: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&auto=format&fit=crop&q=80',
    bidderName: 'Sud Levage SARL',
    bidderCompany: 'Sud Levage',
    priceOffered: 1350,
    duration: 30,
    startDate: '2026-07-20',
    description: 'Proposition alternative : grue Potain à montage rapide T85A installable en 4 heures sur site. Plus économique qu\'une grue mobile de 100 tonnes et offre une portée similaire avec commande à distance moderne.',
    status: 'En attente',
    submissionDate: '2026-06-30'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2026-1022',
    type: 'Location',
    amount: 12600,
    date: '2026-06-30',
    dueDate: '2026-07-30',
    status: 'En attente',
    clientCompany: 'Eiffage Construction Sud-Est',
    engineName: 'Liebherr R 924 Compact',
    paymentMethod: 'Virement bancaire 30 jours'
  },
  {
    id: 'INV-2026-1021',
    type: 'Location',
    amount: 7800,
    date: '2026-06-25',
    dueDate: '2026-07-25',
    status: 'Payé',
    clientCompany: 'Bouygues Bâtiment Sud-Est',
    engineName: 'Manitou MT 1840 Easy',
    paymentMethod: 'Prélèvement automatique SEPA'
  },
  {
    id: 'INV-2026-1020',
    type: 'Maintenance',
    amount: 1450,
    date: '2026-06-28',
    dueDate: '2026-07-28',
    status: 'En attente',
    clientCompany: 'Mercier Levage (Facture Atelier)',
    engineName: 'Komatsu PC210LC-11',
    paymentMethod: 'Virement bancaire'
  },
  {
    id: 'INV-2026-1019',
    type: 'Assurance',
    amount: 450,
    date: '2026-06-01',
    dueDate: '2026-06-15',
    status: 'Payé',
    clientCompany: 'SMABTP Assurances BTP',
    engineName: 'Flotte Complète Mercier',
    paymentMethod: 'Prélèvement automatique'
  }
];

export const INITIAL_DOCUMENTS: DocumentFile[] = [
  {
    id: 'doc-001',
    name: 'Rapport VGP Semestriel - Liebherr R 924.pdf',
    category: 'Certificat VGP',
    uploadDate: '2026-03-15',
    expiryDate: '2026-09-15',
    size: '1.4 MB',
    status: 'Valide',
    url: '#'
  },
  {
    id: 'doc-002',
    name: 'Attestation Assurance Flotte Mercier 2026.pdf',
    category: 'Assurance',
    uploadDate: '2026-01-01',
    expiryDate: '2026-12-31',
    size: '2.1 MB',
    status: 'Valide',
    url: '#'
  },
  {
    id: 'doc-003',
    name: 'Carte Grise Officielle - Caterpillar 320 GC.pdf',
    category: 'Carte Grise',
    uploadDate: '2022-09-15',
    size: '850 KB',
    status: 'Valide',
    url: '#'
  },
  {
    id: 'doc-004',
    name: 'Rapport VGP Expiré - Komatsu PC210.pdf',
    category: 'Certificat VGP',
    uploadDate: '2025-05-05',
    expiryDate: '2025-11-05',
    size: '1.2 MB',
    status: 'Expiré',
    url: '#'
  },
  {
    id: 'doc-005',
    name: 'Contrat de Vente Original - Bomag BW 120.pdf',
    category: 'Contrat de Vente',
    uploadDate: '2023-03-10',
    size: '4.5 MB',
    status: 'Valide',
    url: '#'
  }
];

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mis-701',
    contractId: 'ctr-501',
    machineId: 'mch-101',
    machineName: 'Liebherr',
    machineModel: 'R 924 Compact',
    driverName: 'Stéphane Paille (Eiffage)',
    location: 'Chantier Gare Lyon Part-Dieu (Secteur Nord)',
    status: 'Sur site',
    currentTask: 'Terrassement de la plateforme principale d\'accès bus.',
    fuelLevel: 68,
    hourCounter: 1450,
    operatorContact: '+33 6 12 34 56 78',
    siteSupervisor: 'Michel Giraud (Eiffage - 06 98 76 54 32)'
  },
  {
    id: 'mis-702',
    contractId: 'ctr-502',
    machineId: 'mch-103',
    machineName: 'Manitou',
    machineModel: 'MT 1840 Easy',
    driverName: 'Sébastien Violeau (Bouygues)',
    location: 'Chantier ZAC des Gratte-Ciel, Villeurbanne',
    status: 'Sur site',
    currentTask: 'Acheminement des palettes de briques et parpaings au R+3.',
    fuelLevel: 42,
    hourCounter: 420,
    operatorContact: '+33 6 87 65 43 21',
    siteSupervisor: 'Sylvie Dumont (Bouygues - 06 11 22 33 44)'
  }
];
