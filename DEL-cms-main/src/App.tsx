import React, { useState } from 'react';
import { 
  initialEngines, 
  initialRequests, 
  initialProposals, 
  initialContracts, 
  initialInvoices, 
  initialPayments, 
  initialMissions, 
  initialMaintenances, 
  initialDocuments, 
  initialProprietors, 
  initialCompanies, 
  initialTechnicians, 
  initialAuditLogs, 
  initialExports, 
  initialPdfReports, 
  defaultParams 
} from './data';
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

// Importing views
import { DashboardView } from './components/DashboardView';
import { EnginesView } from './components/EnginesView';
import { RequestsView } from './components/RequestsView';
import { CommercialView } from './components/CommercialView';
import { FinanceView } from './components/FinanceView';
import { OperationsView } from './components/OperationsView';
import { DocumentsView } from './components/DocumentsView';
import { UsersView } from './components/UsersView';
import { AdminView } from './components/AdminView';

// Icons
import { 
  LayoutDashboard, 
  Truck, 
  ClipboardList, 
  TrendingUp, 
  FileCheck, 
  Receipt, 
  CreditCard, 
  HardHat, 
  Hammer, 
  FolderOpen, 
  Contact, 
  Building2, 
  BadgeCheck, 
  Sliders, 
  ShieldAlert, 
  Download, 
  FileText,
  UserCheck2,
  Menu,
  X
} from 'lucide-react';

export default function App() {
  // Main States
  const [currentView, setCurrentView] = useState<string>('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core collections
  const [engines, setEngines] = useState<Engine[]>(initialEngines);
  const [requests, setRequests] = useState<ClientRequest[]>(initialRequests);
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [maintenances, setMaintenances] = useState<Maintenance[]>(initialMaintenances);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [proprietors, setProprietors] = useState<Proprietor[]>(initialProprietors);
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [exports, setExports] = useState<ExportJob[]>(initialExports);
  const [pdfReports, setPdfReports] = useState<PdfReport[]>(initialPdfReports);
  const [params, setParams] = useState<GlobalParams>(defaultParams);

  // Selection references for detail view routing
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  // Logging utility helper
  const logAction = (action: string, category: AuditLog['category'], details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      user: 'Super-Admin',
      action,
      category,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details,
      ipAddress: '192.168.1.110'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // State manipulation triggers

  // Engines modifiers
  const handleAddEngine = (engineData: Omit<Engine, 'id' | 'code'>) => {
    const newEngine: Engine = {
      ...engineData,
      id: `eng-${Date.now()}`,
      code: `ENG-${engines.length + 101}`
    };
    setEngines(prev => [...prev, newEngine]);
    logAction(`Création engin ${newEngine.code}`, 'Engin', `L'engin ${newEngine.name} (${newEngine.power} kW) a été ajouté à la flotte.`);
  };

  const handleUpdateEngineStatus = (id: string, status: Engine['status']) => {
    setEngines(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    const target = engines.find(e => e.id === id);
    if (target) {
      logAction(`Ajustement statut ${target.code}`, 'Engin', `Le statut de l'engin est désormais "${status}".`);
    }
  };

  // Requests modifiers
  const handleAddRequest = (requestData: Omit<ClientRequest, 'id' | 'code' | 'workflow' | 'matchingCount'>) => {
    const newReq: ClientRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      code: `REQ-${requests.length + 201}`,
      matchingCount: 2,
      workflow: [
        { name: 'Nouvelle', label: 'Création de la demande', status: 'current', date: new Date().toISOString().split('T')[0], updatedBy: 'Admin' },
        { name: 'Qualification', label: 'Validation technique', status: 'upcoming' },
        { name: 'Matching', label: 'Recherche d\'engins compatibles', status: 'upcoming' },
        { name: 'Proposition', label: 'Émission de l\'offre commerciale', status: 'upcoming' },
        { name: 'Contrat', label: 'Signature contractuelle', status: 'upcoming' },
        { name: 'Active', label: 'Mise en service', status: 'upcoming' },
        { name: 'Terminée', label: 'Restitution & Facturation', status: 'upcoming' }
      ]
    };
    setRequests(prev => [...prev, newReq]);
    logAction(`Création demande ${newReq.code}`, 'Demande', `Nouvelle demande client : "${newReq.title}" par ${newReq.companyName}.`);
  };

  const handleAdvanceWorkflow = (id: string, nextStatus: ClientRequest['status']) => {
    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        const updatedWorkflow = r.workflow.map(w => {
          if (w.name === nextStatus) {
            return { ...w, status: 'current' as const, date: new Date().toISOString().split('T')[0], updatedBy: 'Super-Admin' };
          }
          if (r.workflow.findIndex(step => step.name === w.name) < r.workflow.findIndex(step => step.name === nextStatus)) {
            return { ...w, status: 'completed' as const };
          }
          return w;
        });
        return { ...r, status: nextStatus, workflow: updatedWorkflow };
      }
      return r;
    }));
    const target = requests.find(r => r.id === id);
    if (target) {
      logAction(`Évolution workflow ${target.code}`, 'Demande', `La demande est passée au statut "${nextStatus}".`);
    }
  };

  const handleProposeEngine = (requestId: string, engineId: string, dailyRate: number) => {
    // Advanced request workflow to Proposition
    handleAdvanceWorkflow(requestId, 'Proposition');
    
    // Create Proposal
    const req = requests.find(r => r.id === requestId);
    const eng = engines.find(e => e.id === engineId);
    
    if (req && eng) {
      const newProp: Proposal = {
        id: `prop-${Date.now()}`,
        code: `PRO-${proposals.length + 301}`,
        requestId,
        requestTitle: req.title,
        engineId,
        engineName: eng.name,
        companyName: req.companyName,
        dailyRate,
        transportCost: 800,
        otherCosts: 250,
        totalEstimated: (dailyRate * req.durationDays) + 1050,
        status: 'Envoyée',
        validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setProposals(prev => [newProp, ...prev]);
      logAction(`Émission proposition ${newProp.code}`, 'Contrat', `Proposition commerciale de ${newProp.totalEstimated} € TTC envoyée à ${newProp.companyName}.`);
      setCurrentView('Propositions');
    }
  };

  // Proposals modifiers
  const handleAcceptProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'Acceptée' } : p));
    const target = proposals.find(p => p.id === id);
    if (target) {
      logAction(`Acceptation proposition ${target.code}`, 'Contrat', `L'entreprise cliente a officiellement validé l'offre commerciale.`);
    }
  };

  const handleRejectProposal = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'Refusée' } : p));
    const target = proposals.find(p => p.id === id);
    if (target) {
      logAction(`Rejet proposition ${target.code}`, 'Contrat', `L'offre commerciale a été marquée comme refusée.`);
    }
  };

  const handleGenerateContract = (proposalId: string) => {
    const prop = proposals.find(p => p.id === proposalId);
    if (prop) {
      const newCtr: Contract = {
        id: `ctr-${Date.now()}`,
        code: `CTR-${contracts.length + 401}`,
        proposalId,
        companyName: prop.companyName,
        engineName: prop.engineName,
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dailyRate: prop.dailyRate,
        totalAmount: prop.totalEstimated,
        status: 'En Signature',
        insuranceNumber: 'AXA-PRO-77821'
      };

      setContracts(prev => [newCtr, ...prev]);
      // Update proposal state
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'Acceptée' } : p));
      
      // Advance target client request workflow to Contract state
      const targetReq = requests.find(r => r.id === prop.requestId);
      if (targetReq) {
        handleAdvanceWorkflow(targetReq.id, 'Contrat');
      }

      logAction(`Génération contrat ${newCtr.code}`, 'Contrat', `Le contrat de bail réglementaire a été rédigé et envoyé pour signature.`);
      setCurrentView('Contrats');
    }
  };

  const handleSignContract = (id: string) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'Signé', signedAt: new Date().toISOString().split('T')[0] } : c));
    const target = contracts.find(c => c.id === id);
    if (target) {
      logAction(`Signature contrat ${target.code}`, 'Contrat', `Le bail de location a été signé électroniquement par l'ensemble des parties.`);
    }
  };

  const handleActivateContract = (id: string) => {
    setContracts(prev => prev.map(c => c.id === id ? { ...c, status: 'Actif' } : c));
    
    // Find engine associated and lock status to En Mission
    const targetCtr = contracts.find(c => c.id === id);
    if (targetCtr) {
      const matchedEngine = engines.find(e => e.name === targetCtr.engineName);
      if (matchedEngine) {
        handleUpdateEngineStatus(matchedEngine.id, 'En Mission');
      }
      
      // Find request and advance to Active
      const matchedProposal = proposals.find(p => p.engineName === targetCtr.engineName);
      if (matchedProposal) {
        handleAdvanceWorkflow(matchedProposal.requestId, 'Active');
      }

      logAction(`Mise en service contrat ${targetCtr.code}`, 'Contrat', `Début d'exploitation. Matériel livré sur site.`);
    }
  };

  // Finance modifiers
  const handleAddInvoice = (invData: Omit<Invoice, 'id' | 'code'>) => {
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      code: `FAC-2026-00${invoices.length + 1}`
    };
    setInvoices(prev => [newInv, ...prev]);
    logAction(`Création facture ${newInv.code}`, 'Facturation', `Brouillon de facture de ${newInv.totalAmount} € émis pour ${newInv.companyName}.`);
  };

  const handlePayInvoice = (id: string, method: Payment['method']) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'Payée', paidAt: new Date().toISOString().split('T')[0] } : i));
    
    const inv = invoices.find(i => i.id === id);
    if (inv) {
      // Create corresponding payment log
      const newPay: Payment = {
        id: `pay-${Date.now()}`,
        code: `PAY-${payments.length + 101}`,
        invoiceId: id,
        invoiceCode: inv.code,
        companyName: inv.companyName,
        amount: inv.totalAmount,
        method,
        status: 'Réussi',
        transactionDate: new Date().toISOString().split('T')[0],
        reference: `VR-${inv.companyName.substring(0,3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
      };

      setPayments(prev => [newPay, ...prev]);
      logAction(`Encaissement facture ${inv.code}`, 'Facturation', `Règlement de ${inv.totalAmount} € reçu avec succès.`);
    }
  };

  // Operations modifiers
  const handleAddMission = (misData: Omit<Mission, 'id' | 'code' | 'progress'>) => {
    const newMis: Mission = {
      ...misData,
      id: `mis-${Date.now()}`,
      code: `MIS-00${missions.length + 1}`,
      progress: 0
    };
    setMissions(prev => [newMis, ...prev]);
    logAction(`Planification mission ${newMis.code}`, 'Système', `Mission d'intervention terrain planifiée pour ${newMis.technicianName}.`);
  };

  const handleUpdateMissionProgress = (id: string, progress: number) => {
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        const status = progress === 100 ? 'Terminée' : 'En Cours';
        return { ...m, progress, status };
      }
      return m;
    }));
  };

  const handleAddMaintenance = (maintData: Omit<Maintenance, 'id' | 'code'>) => {
    const newMaint: Maintenance = {
      ...maintData,
      id: `maint-${Date.now()}`,
      code: `MNT-${maintenances.length + 101}`
    };
    setMaintenances(prev => [newMaint, ...prev]);
    
    // Switch target engine to maintenance status
    handleUpdateEngineStatus(maintData.engineId, 'En Maintenance');
    logAction(`Création bon maintenance ${newMaint.code}`, 'Système', `Engin ${maintData.engineName} immobilisé pour maintenance.`);
  };

  const handleCompleteMaintenance = (id: string) => {
    setMaintenances(prev => prev.map(m => m.id === id ? { ...m, status: 'Terminée', completedDate: new Date().toISOString().split('T')[0] } : m));
    
    const maint = maintenances.find(m => m.id === id);
    if (maint) {
      // Release engine back to Available status
      handleUpdateEngineStatus(maint.engineId, 'Disponible');
      logAction(`Clôture maintenance ${maint.code}`, 'Système', `Maintenance terminée sur ${maint.engineName}.`);
    }
  };

  // Documents center
  const handleAddDocument = (docData: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDoc: Document = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleUpdateDocumentStatus = (id: string, status: Document['status']) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    const target = documents.find(d => d.id === id);
    if (target) {
      logAction(`Audit document "${target.name}"`, 'Sécurité', `Le document d'exploitation a été marqué comme "${status}".`);
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // Proprietor and Tech settings
  const handleUpdateProprietorCommission = (id: string, rate: number) => {
    setProprietors(prev => prev.map(p => p.id === id ? { ...p, commissionRate: rate } : p));
    const target = proprietors.find(p => p.id === id);
    if (target) {
      logAction(`Ajustement commission ${target.code}`, 'Système', `Taux de commission plateforme ajusté à ${rate}% pour ${target.name}.`);
    }
  };

  const handleUpdateTechnicianStatus = (id: string, status: Technician['status']) => {
    setTechnicians(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  // Admin panels modifiers
  const handleUpdateParams = (newParams: GlobalParams) => {
    setParams(newParams);
    logAction("Sauvegarde paramètres", "Système", "Les coefficients par défaut de la plateforme ont été modifiés.");
  };

  const handleAddExportJob = (jobData: Omit<ExportJob, 'id' | 'timestamp' | 'status' | 'size'>) => {
    const newJob: ExportJob = {
      ...jobData,
      id: `exp-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Terminé',
      size: `${Math.floor(15 + Math.random() * 80)} KB`
    };
    setExports(prev => [newJob, ...prev]);
    logAction(`Extraction ${newJob.name}`, 'Sécurité', `Génération d'un export au format ${newJob.format} contenant ${newJob.recordsCount} lignes.`);
  };

  const handleGeneratePdfReport = (repData: Omit<PdfReport, 'id' | 'generatedAt' | 'status' | 'downloadCount'>) => {
    const newRep: PdfReport = {
      ...repData,
      id: `rep-${Date.now()}`,
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Prêt',
      downloadCount: 0
    };
    setPdfReports(prev => [newRep, ...prev]);
    logAction(`Compilation PDF "${newRep.title}"`, 'Sécurité', `Un nouveau rapport d'activité mensuel officiel a été compilé.`);
  };

  const handleDownloadPdfReport = (id: string) => {
    setPdfReports(prev => prev.map(r => {
      if (r.id === id) {
        logAction(`Téléchargement rapport "${r.title}"`, 'Système', `Le rapport PDF d'activité "${r.title}" a été téléchargé depuis l'application.`);
        return { ...r, downloadCount: r.downloadCount + 1 };
      }
      return r;
    }));
  };

  // Navigation router
  const handleNavigate = (view: string, targetId?: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (view === 'Engins') {
      setSelectedEngineId(targetId || null);
    } else if (view === 'Demandes') {
      setSelectedRequestId(targetId || null);
    }
  };

  // Render the matching child views based on the selected currentView state
  const renderViewContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return (
          <DashboardView 
            engines={engines} 
            requests={requests} 
            contracts={contracts} 
            invoices={invoices} 
            maintenances={maintenances}
            onNavigate={handleNavigate}
          />
        );
      case 'Engins':
        return (
          <EnginesView 
            engines={engines} 
            proprietors={proprietors}
            selectedEngineId={selectedEngineId}
            onSelectEngine={setSelectedEngineId}
            onAddEngine={handleAddEngine}
            onUpdateEngineStatus={handleUpdateEngineStatus}
          />
        );
      case 'Demandes':
        return (
          <RequestsView 
            requests={requests}
            engines={engines}
            selectedRequestId={selectedRequestId}
            onSelectRequest={setSelectedRequestId}
            onAddRequest={handleAddRequest}
            onAdvanceWorkflow={handleAdvanceWorkflow}
            onProposeEngine={handleProposeEngine}
          />
        );
      case 'Propositions':
      case 'Contrats':
        return (
          <CommercialView 
            proposals={proposals}
            contracts={contracts}
            pdfReports={pdfReports}
            onDownloadReport={handleDownloadPdfReport}
            onAcceptProposal={handleAcceptProposal}
            onRejectProposal={handleRejectProposal}
            onGenerateContract={handleGenerateContract}
            onSignContract={handleSignContract}
            onActivateContract={handleActivateContract}
          />
        );
      case 'Factures':
      case 'Paiements':
        return (
          <FinanceView 
            invoices={invoices}
            payments={payments}
            pdfReports={pdfReports}
            onDownloadReport={handleDownloadPdfReport}
            onAddInvoice={handleAddInvoice}
            onPayInvoice={handlePayInvoice}
          />
        );
      case 'Missions':
      case 'Maintenance':
        return (
          <OperationsView 
            missions={missions}
            maintenances={maintenances}
            engines={engines}
            technicians={technicians}
            onAddMission={handleAddMission}
            onUpdateMissionProgress={handleUpdateMissionProgress}
            onAddMaintenance={handleAddMaintenance}
            onCompleteMaintenance={handleCompleteMaintenance}
          />
        );
      case 'Documents':
        return (
          <DocumentsView 
            documents={documents}
            onAddDocument={handleAddDocument}
            onUpdateDocumentStatus={handleUpdateDocumentStatus}
            onDeleteDocument={handleDeleteDocument}
          />
        );
      case 'Propriétaires':
      case 'Entreprises':
      case 'Techniciens':
        return (
          <UsersView 
            proprietors={proprietors}
            companies={companies}
            technicians={technicians}
            onUpdateProprietorCommission={handleUpdateProprietorCommission}
            onUpdateTechnicianStatus={handleUpdateTechnicianStatus}
          />
        );
      case 'Paramètres':
      case 'Audit':
      case 'Exports':
      case 'Rapports PDF':
        return (
          <AdminView 
            params={params}
            auditLogs={auditLogs}
            exports={exports}
            pdfReports={pdfReports}
            onUpdateParams={handleUpdateParams}
            onAddExportJob={handleAddExportJob}
            onGeneratePdfReport={handleGeneratePdfReport}
          />
        );
      default:
        return <div className="text-slate-500 text-xs">Vue en cours d'intégration...</div>;
    }
  };

  // Nav categories for sidebar layout
  const navigationConfig = [
    {
      group: "Vue d'ensemble",
      items: [
        { name: "Dashboard", label: "Tableau de bord", icon: LayoutDashboard }
      ]
    },
    {
      group: "Opérations",
      items: [
        { name: "Engins", label: "Flotte d'Engins", icon: Truck },
        { name: "Demandes", label: "Demandes clients", icon: ClipboardList },
        { name: "Missions", label: "Missions Opérateurs", icon: HardHat },
        { name: "Maintenance", label: "Interventions", icon: Hammer }
      ]
    },
    {
      group: "Commercial",
      items: [
        { name: "Propositions", label: "Offres & Devis", icon: TrendingUp },
        { name: "Contrats", label: "Baux & Engagements", icon: FileCheck }
      ]
    },
    {
      group: "Finance",
      items: [
        { name: "Factures", label: "Factures", icon: Receipt },
        { name: "Paiements", label: "Flux Bancaires", icon: CreditCard }
      ]
    },
    {
      group: "Ressources",
      items: [
        { name: "Documents", label: "Coffre-fort Doc", icon: FolderOpen },
        { name: "Propriétaires", label: "Propriétaires", icon: Contact },
        { name: "Entreprises", label: "Entreprises BTP", icon: Building2 },
        { name: "Techniciens", label: "Techniciens", icon: BadgeCheck }
      ]
    },
    {
      group: "Administration",
      items: [
        { name: "Paramètres", label: "Coefficients", icon: Sliders },
        { name: "Audit", label: "Registre d'Audit", icon: ShieldAlert },
        { name: "Exports", label: "Données CSV/XLS", icon: Download },
        { name: "Rapports PDF", label: "Rapports d'Activité", icon: FileText }
      ]
    }
  ];

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Upper header */}
      <header className="bg-slate-950 text-white h-16 border-b border-slate-800 flex items-center justify-between px-5 shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-3">
          <button 
            id="mobile-sidebar-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 hover:bg-slate-900 rounded cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black p-1.5 rounded text-xs tracking-wider">
              DEL
            </span>
            <span className="font-bold text-sm tracking-widest font-sans uppercase">DEL-cms</span>
          </div>
        </div>

        {/* Global stats bar or profile indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4 font-mono text-[10px] text-slate-400 border-r border-slate-800 pr-4">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Flotte: {engines.filter(e => e.status === 'Disponible').length} Libres</span>
            </div>
            <div>
              <span>Contrats: {contracts.filter(c => c.status === 'Actif').length} En cours</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-200">Jean-Pierre L.</p>
              <p className="text-[10px] text-amber-500 font-mono">Superviseur Principal</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-slate-200">
              JP
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 relative">
        {/* Left Sidebar Layout */}
        <aside 
          id="admin-sidebar"
          className={`bg-slate-950 border-r border-slate-800 w-64 p-4 flex flex-col justify-between overflow-y-auto shrink-0 z-30 transition-all duration-200 absolute md:static top-0 bottom-0 left-0 h-[calc(100vh-64px)] ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            {navigationConfig.map(grp => (
              <div key={grp.group} className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans block pl-2.5">
                  {grp.group}
                </span>
                
                <nav className="space-y-0.5">
                  {grp.items.map(item => {
                    // Check if current item matches currentView
                    const isSelected = currentView === item.name || 
                                       (item.name === 'Propositions' && currentView === 'Contrats') ||
                                       (item.name === 'Factures' && currentView === 'Paiements') ||
                                       (item.name === 'Missions' && currentView === 'Maintenance') ||
                                       (item.name === 'Propriétaires' && (currentView === 'Entreprises' || currentView === 'Techniciens')) ||
                                       (item.name === 'Paramètres' && (currentView === 'Audit' || currentView === 'Exports' || currentView === 'Rapports PDF'));
                    
                    const IconComponent = item.icon;

                    return (
                      <button
                        key={item.name}
                        id={`nav-${item.name.toLowerCase()}`}
                        onClick={() => handleNavigate(item.name)}
                        className={`w-full text-left py-2 px-3 rounded text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-amber-500 text-slate-950 font-black shadow-sm' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                      >
                        <IconComponent size={15} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-900 pt-4 mt-6 text-[10px] text-slate-500 font-mono space-y-1 text-center">
            <p>DEL-CMS Administration</p>
            <p className="text-[9px]">SaaS d'exploitation v2.5.0</p>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main 
          id="main-content-pane" 
          className="flex-1 bg-slate-50 p-6 overflow-y-auto h-[calc(100vh-64px)]"
          onClick={() => setMobileMenuOpen(false)}
        >
          {renderViewContent()}
        </main>
      </div>

    </div>
  );
}
