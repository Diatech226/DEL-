import React, { useEffect, useState } from 'react';
import { 
  INITIAL_USER, 
  INITIAL_MACHINES, 
  INITIAL_MAINTENANCE_LOGS, 
  INITIAL_CONTRACTS, 
  INITIAL_TENDERS, 
  INITIAL_PROPOSALS, 
  INITIAL_INVOICES, 
  INITIAL_DOCUMENTS, 
  INITIAL_MISSIONS 
} from './data';
import { 
  Machine, 
  MaintenanceLog, 
  Contract, 
  Tender, 
  Proposal, 
  Invoice, 
  DocumentFile, 
  Mission, 
  UserProfile 
} from './types';

// Importing subcomponents
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AccueilPremium from './components/AccueilPremium';
import DashboardProprietaire from './components/DashboardProprietaire';
import ListeMaintenance from './components/ListeMaintenance';
import CalendrierMaintenance from './components/CalendrierMaintenance';
import DetailEngin from './components/DetailEngin';
import Factures from './components/Factures';
import CoffreFort from './components/CoffreFort';
import ProfilUtilisateur from './components/ProfilUtilisateur';
import Proposals from './components/Propositions';
import AppelsOffres from './components/AppelsOffres';
import DashboardEntreprise from './components/DashboardEntreprise';
import DemanderEngin from './components/DemanderEngin';
import DeposerEngin from './components/DeposerEngin';
import Connexion from './components/Connexion';
import SuiviMissions from './components/SuiviMissions';
import GestionContrats from './components/GestionContrats';
import ListeEngins from './components/ListeEngins';
import { useAuth } from './context/AuthContext';
import { useEquipmentList } from './hooks/useEquipment';
import { useMyDashboardData } from './hooks/useDashboardData';
import { LoadingState, ErrorState, EmptyState } from './components/common/States';

// Lucide icons
import { 
  Monitor, 
  Menu, 
  X, 
  ChevronUp, 
  ChevronDown,
  ShieldCheck,
  Compass,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Navigation states
  const [activeScreen, setActiveScreen] = useState<string>('Accueil Premium - DEL-web');
  const [activeRole, setActiveRole] = useState<'proprietaire' | 'locataire'>('proprietaire');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDemoPanelOpen, setIsDemoPanelOpen] = useState(false);

  // App states (Durable Local Storage simulation)
  const auth = useAuth();
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [machines, setMachines] = useState<Machine[]>(INITIAL_MACHINES);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>(INITIAL_MAINTENANCE_LOGS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [tenders, setTenders] = useState<Tender[]>(INITIAL_TENDERS);
  const [requests, setRequests] = useState<any[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [documents, setDocuments] = useState<DocumentFile[]>(INITIAL_DOCUMENTS);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);

  // State for simulated email alerts
  const [simulatedEmails, setSimulatedEmails] = useState<Array<{
    id: string;
    to: string;
    subject: string;
    body: string;
    dateSent: string;
    machineId: string;
    status: 'Envoyé';
    read: boolean;
  }>>([]);

  // Selected sub-items
  const [selectedMachine, setSelectedMachine] = useState<Machine>(INITIAL_MACHINES[0]);

  // activeScreen reste temporaire jusqu'à la migration router complète.
  const equipmentList = useEquipmentList();
  const dashboardData = useMyDashboardData(auth.isAuthenticated);
  useEffect(() => { if (auth.user) setUser(prev => { const apiUser = auth.user as any; const apiRole = String(apiUser.role || '').toUpperCase(); return { ...prev, ...apiUser, fullName: apiUser.fullName || apiUser.name || prev.fullName, role: apiRole === 'COMPANY' ? 'locataire' : apiRole === 'OWNER' ? 'proprietaire' : prev.role }; }); }, [auth.user]);
  useEffect(() => { if (equipmentList.data?.length) { setMachines(equipmentList.data); setSelectedMachine(equipmentList.data[0]); } }, [equipmentList.data]);
  useEffect(() => { const d = dashboardData.data; if (!d) return; if (d.equipment?.length) setMachines(d.equipment as Machine[]); if (Array.isArray(d.requests)) setRequests(d.requests); if (Array.isArray((d as any).proposals)) setProposals((d as any).proposals as any); if (Array.isArray((d as any).contracts)) setContracts((d as any).contracts as any); }, [dashboardData.data]);

  // Trigger automatic email simulation when a critical maintenance is detected
  React.useEffect(() => {
    const today = new Date('2026-07-02');
    const ownerMachines = machines.filter(m => m.ownerId === user.id);
    const newEmails: typeof simulatedEmails = [];

    ownerMachines.forEach(m => {
      const nextMaint = new Date(m.nextMaintenanceDate);
      const diffTime = nextMaint.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Critical under 7 days or overdue
      if (diffDays <= 7) {
        const emailId = `email-maint-${m.id}-${m.nextMaintenanceDate}`;
        const isOverdue = diffDays < 0;

        newEmails.push({
          id: emailId,
          to: user.email || 'contact@del.local',
          subject: `⚠️ ALERTE CRITIQUE : Entretien obligatoire requis pour ${m.brand} ${m.model}`,
          body: `Bonjour ${user.fullName},\n\n` +
                `Le système de surveillance DEL-web a détecté une échéance de maintenance critique pour votre matériel :\n` +
                `- Engin : ${m.brand} ${m.model} (S/N: ${m.serialNumber})\n` +
                `- Date d'échéance : ${m.nextMaintenanceDate}\n` +
                `- Statut : ${isOverdue ? `EN RETARD DE ${Math.abs(diffDays)} JOUR(S)` : `Dans ${diffDays} jours (J-${diffDays})`}\n\n` +
                `Conformément aux exigences de sécurité DEL-web et à la réglementation en vigueur, une planification d'entretien est requise immédiatement.\n\n` +
                `Cet e-mail a été envoyé automatiquement à l'adresse de votre profil : ${user.email || 'contact@del.local'}.\n\n` +
                `Cordialement,\nService Automatique d'Alertes Techniques — DEL-web`,
          dateSent: '02/07/2026 à 08:54',
          machineId: m.id,
          status: 'Envoyé',
          read: false
        });
      }
    });

    // Merge or set state if there are changes
    setSimulatedEmails(prev => {
      const prevIds = prev.map(p => p.id);
      const missing = newEmails.filter(n => !prevIds.includes(n.id));
      if (missing.length > 0) {
        return [...prev, ...missing];
      }
      return prev;
    });
  }, [machines, user.id, user.email, user.fullName]);

  // Handler to mark simulated email as read
  const handleMarkEmailAsRead = (id: string) => {
    setSimulatedEmails(prev => prev.map(email => 
      email.id === id ? { ...email, read: true } : email
    ));
  };

  // Handler functions
  const handleRoleChange = (role: 'proprietaire' | 'locataire') => {
    setActiveRole(role);
    if (role === 'proprietaire') {
      setActiveScreen('Dashboard Propriétaire Personnalisé - DEL-web');
    } else {
      setActiveScreen('Dashboard Entreprise - DEL-web');
    }
  };

  const handleCompleteMaintenance = (logId: string) => {
    setMaintenanceLogs(prev => prev.map(log => 
      log.id === logId ? { ...log, status: 'Terminé' as const } : log
    ));
  };

  const handleAddMaintenance = (newLog: MaintenanceLog) => {
    setMaintenanceLogs(prev => [newLog, ...prev]);
  };

  const handleAddMachine = (newMachine: Machine) => {
    setMachines(prev => [newMachine, ...prev]);
  };

  const handleAddTender = (newTender: Tender) => {
    setTenders(prev => [newTender, ...prev]);
  };

  const handleAddProposal = (newProposal: Proposal) => {
    setProposals(prev => [newProposal, ...prev]);
  };

  const handleAddDocument = (newDoc: DocumentFile) => {
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleSignContract = (contractId: string) => {
    setContracts(prev => prev.map(c => 
      c.id === contractId ? { ...c, status: 'Actif' as const, signatureDate: new Date().toISOString().split('T')[0] } : c
    ));
  };

  const handleAcceptProposal = (proposalId: string) => {
    // Mark proposal accepted
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'Accepté' as const } : p));
    const prop = proposals.find(p => p.id === proposalId);
    if (prop) {
      // Simulate creating a contract
      const newContract: Contract = {
        id: `ctr-${Date.now().toString().slice(-3)}`,
        machineId: prop.machineId,
        machineName: prop.machineName,
        machineImage: prop.machineImage,
        clientName: user.fullName,
        clientCompany: user.companyName,
        ownerName: prop.bidderName,
        ownerCompany: prop.bidderCompany,
        startDate: prop.startDate,
        endDate: new Date(new Date(prop.startDate).getTime() + prop.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalPrice: prop.priceOffered * prop.duration,
        deposit: 4000,
        status: 'En attente de signature',
        insuranceOption: 'Garantie Bris de Machine Standard'
      };
      setContracts(prev => [newContract, ...prev]);
      setActiveScreen('Gestion des Contrats - DEL-web');
      alert('Offre acceptée ! Le contrat de location a été rédigé. Veuillez le signer électroniquement.');
    }
  };

  const handleDeclineProposal = (proposalId: string) => {
    setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'Refusé' as const } : p));
  };

  // Select machine to inspect
  const handleSelectMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    if (machine.ownerId === user.id) {
      setActiveScreen("Détail de l'Engin avec Historique d'Entretien - DEL-web");
    } else {
      setActiveScreen("Détail de l'Engin - DEL-web");
    }
  };

  // Simulation booking request
  const handleBookMachine = (machineId: string) => {
    const targetMachine = machines.find(m => m.id === machineId);
    if (!targetMachine) return;

    // Add proposal received simulation
    const newProp: Proposal = {
      id: `prop-${Date.now().toString().slice(-3)}`,
      tenderId: 'tnd-direct',
      tenderTitle: `Demande de location de ${targetMachine.brand} ${targetMachine.model}`,
      machineId: targetMachine.id,
      machineName: `${targetMachine.brand} ${targetMachine.model}`,
      machineImage: targetMachine.imageUrl,
      bidderName: targetMachine.ownerName,
      bidderCompany: targetMachine.ownerName,
      priceOffered: targetMachine.dailyPrice,
      duration: 30,
      startDate: '2026-08-01',
      description: `Nous mettons à votre disposition notre ${targetMachine.brand} ${targetMachine.model} en parfait état technique avec tous ses certificats réglementaires à jour.`,
      status: 'En attente',
      submissionDate: new Date().toISOString().split('T')[0]
    };

    setProposals(prev => [newProp, ...prev]);
    setActiveScreen('Propositions - DEL-web');
    alert(`Demande soumise ! Le propriétaire (${targetMachine.ownerName}) a formulé une proposition tarifaire en retour.`);
  };

  // Render correct Screen
  const renderScreenContent = () => {
    switch (activeScreen) {
      case 'Accueil Premium - DEL-web':
        return <AccueilPremium onNavigate={setActiveScreen} onRoleChange={setActiveRole} />;

      case 'Dashboard Propriétaire Personnalisé - DEL-web':
        if (!auth.isAuthenticated && !auth.loading) return <EmptyState message="Connectez-vous pour charger votre dashboard depuis DEL-api." />;
        if (dashboardData.loading) return <LoadingState message="Chargement du dashboard DEL-api…" />;
        if (dashboardData.error) return <ErrorState message={dashboardData.error} />;
        return (
          <DashboardProprietaire 
            user={user} 
            machines={machines} 
            maintenanceLogs={maintenanceLogs} 
            contracts={contracts} 
            documents={documents}
            isPersonalized={true} 
            onNavigate={setActiveScreen} 
            simulatedEmails={simulatedEmails}
            onMarkEmailAsRead={handleMarkEmailAsRead}
          />
        );

      case 'Dashboard Propriétaire - DEL-web':
        return (
          <DashboardProprietaire 
            user={user} 
            machines={machines} 
            maintenanceLogs={maintenanceLogs} 
            contracts={contracts} 
            documents={documents}
            isPersonalized={false} 
            onNavigate={setActiveScreen} 
            simulatedEmails={simulatedEmails}
            onMarkEmailAsRead={handleMarkEmailAsRead}
          />
        );

      case 'Liste Détaillée de Maintenance - DEL-web':
        return (
          <ListeMaintenance 
            logs={maintenanceLogs} 
            machines={machines} 
            onCompleteLog={handleCompleteMaintenance} 
            onAddLog={handleAddMaintenance} 
            onNavigate={setActiveScreen} 
          />
        );

      case 'Calendrier de Maintenance Global - DEL-web':
        return (
          <CalendrierMaintenance 
            logs={maintenanceLogs} 
            machines={machines} 
            onNavigate={setActiveScreen} 
          />
        );

      case "Détail de l'Engin avec Historique d'Entretien - DEL-web":
        return (
          <DetailEngin 
            machine={selectedMachine} 
            logs={maintenanceLogs} 
            contracts={contracts} 
            isOwnerView={true} 
            onNavigate={setActiveScreen} 
          />
        );

      case "Détail de l'Engin - DEL-web":
        return (
          <DetailEngin 
            machine={selectedMachine} 
            logs={maintenanceLogs} 
            contracts={contracts} 
            isOwnerView={false} 
            onNavigate={setActiveScreen} 
            onBookMachine={handleBookMachine}
          />
        );

      case 'Factures - DEL-web':
        return <Factures invoices={invoices} onNavigate={setActiveScreen} />;

      case 'Coffre-fort Documents - DEL-web':
        return (
          <CoffreFort 
            documents={documents} 
            onUploadDocument={handleAddDocument} 
            onDeleteDocument={handleDeleteDocument} 
            onNavigate={setActiveScreen} 
          />
        );

      case 'Profil Utilisateur - DEL-web':
        return (
          <ProfilUtilisateur 
            user={user} 
            activeRole={activeRole} 
            onRoleChange={handleRoleChange} 
            onUpdateUser={setUser} 
          />
        );

      case 'Propositions - DEL-web':
        return (
          <Proposals 
            proposals={proposals} 
            activeRole={activeRole} 
            onAcceptProposal={handleAcceptProposal} 
            onDeclineProposal={handleDeclineProposal} 
            onNavigate={setActiveScreen} 
          />
        );

      case "Appels d'Offres - DEL-web":
        return (
          <AppelsOffres 
            tenders={tenders} 
            ownerMachines={machines.filter(m => m.ownerId === user.id)} 
            onSubmitBid={handleAddProposal} 
            onNavigate={setActiveScreen} 
          />
        );

      case 'Dashboard Entreprise - DEL-web':
        if (!auth.isAuthenticated && !auth.loading) return <EmptyState message="Connectez-vous pour charger votre espace entreprise depuis DEL-api." />;
        if (dashboardData.loading) return <LoadingState message="Chargement du dashboard DEL-api…" />;
        if (dashboardData.error) return <ErrorState message={dashboardData.error} />;
        return (
          <DashboardEntreprise 
            user={user} 
            contracts={contracts} 
            missions={missions} 
            proposals={proposals} 
            requests={requests}
            onNavigate={setActiveScreen} 
          />
        );

      case 'Demander des Engins - DEL-web':
        return <DemanderEngin onAddTender={handleAddTender} onNavigate={setActiveScreen} />;

      case 'Déposer un Engin - DEL-web':
        return <DeposerEngin onAddMachine={handleAddMachine} onNavigate={setActiveScreen} />;

      case 'Connexion / Inscription - DEL-web':
        return (
          <Connexion 
            onLoginSuccess={() => auth.refreshMe()} 
            onNavigate={setActiveScreen} 
          />
        );

      case 'Suivi des Missions - DEL-web':
        return <SuiviMissions missions={missions} onNavigate={setActiveScreen} />;

      case 'Gestion des Contrats - DEL-web':
        return (
          <GestionContrats 
            contracts={contracts} 
            onSignContract={handleSignContract} 
            onNavigate={setActiveScreen} 
          />
        );

      case 'Liste des Engins - DEL-web':
        if (equipmentList.loading) return <LoadingState message="Chargement des engins DEL-api…" />;
        if (equipmentList.error) return <ErrorState message={equipmentList.error} />;
        if (!machines.length) return <EmptyState message="Aucun engin disponible." />;
        return (
          <ListeEngins 
            machines={machines} 
            onSelectMachine={handleSelectMachine} 
            onNavigate={setActiveScreen} 
          />
        );

      default:
        return <AccueilPremium onNavigate={setActiveScreen} onRoleChange={setActiveRole} />;
    }
  };

  const allDemoScreens = [
    { title: "1. Accueil Premium", screenName: "Accueil Premium - DEL-web", role: "public" },
    { title: "2. Dashboard Propriétaire Personnalisé", screenName: "Dashboard Propriétaire Personnalisé - DEL-web", role: "proprietaire" },
    { title: "3. Liste Détaillée de Maintenance", screenName: "Liste Détaillée de Maintenance - DEL-web", role: "proprietaire" },
    { title: "4. Calendrier de Maintenance Global", screenName: "Calendrier de Maintenance Global - DEL-web", role: "proprietaire" },
    { title: "5. Détail Engin (Propriétaire / Historique)", screenName: "Détail de l'Engin avec Historique d'Entretien - DEL-web", role: "proprietaire" },
    { title: "6. Factures B2B", screenName: "Factures - DEL-web", role: "shared" },
    { title: "7. Coffre-fort Documents", screenName: "Coffre-fort Documents - DEL-web", role: "shared" },
    { title: "8. Profil Utilisateur & Compte RIB", screenName: "Profil Utilisateur - DEL-web", role: "shared" },
    { title: "9. Propositions & Devis", screenName: "Propositions - DEL-web", role: "shared" },
    { title: "10. Appels d'Offres Publics", screenName: "Appels d'Offres - DEL-web", role: "proprietaire" },
    { title: "11. Dashboard Entreprise Locataire", screenName: "Dashboard Entreprise - DEL-web", role: "locataire" },
    { title: "12. Demander Engins (Nouveau Appel d'Offres)", screenName: "Demander des Engins - DEL-web", role: "locataire" },
    { title: "13. Déposer un Engin (Ajout Parc)", screenName: "Déposer un Engin - DEL-web", role: "proprietaire" },
    { title: "14. Connexion / Inscription", screenName: "Connexion / Inscription - DEL-web", role: "public" },
    { title: "15. Suivi Live des Missions (Télémétrie)", screenName: "Suivi des Missions - DEL-web", role: "locataire" },
    { title: "16. Gestion des Contrats (Signature)", screenName: "Gestion des Contrats - DEL-web", role: "shared" },
    { title: "17. Dashboard Propriétaire (Général)", screenName: "Dashboard Propriétaire - DEL-web", role: "proprietaire" },
    { title: "18. Détail de l'Engin (Locataire / Booking)", screenName: "Détail de l'Engin - DEL-web", role: "locataire" },
    { title: "19. Liste des Engins (Catalogue)", screenName: "Liste des Engins - DEL-web", role: "shared" }
  ];

  const hideFrameSidebarAndHeader = activeScreen === 'Accueil Premium - DEL-web' || activeScreen === 'Connexion / Inscription - DEL-web';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans" id="del-app-root">
      
      {/* Header (Hidden on landing page and login for clean look) */}
      {!hideFrameSidebarAndHeader && (
        <Header 
          user={user} 
          activeRole={activeRole} 
          onRoleChange={handleRoleChange} 
          onNavigate={setActiveScreen} 
        />
      )}

      {/* Main Body */}
      <div className="flex flex-1 flex-row relative">
        {/* Sidebar (Hidden on landing page & login) */}
        {!hideFrameSidebarAndHeader && (
          <Sidebar 
            activeScreen={activeScreen} 
            activeRole={activeRole} 
            onNavigate={setActiveScreen} 
          />
        )}

        {/* Dynamic Screen Container */}
        <main className="flex flex-1 flex-col overflow-hidden relative">
          {renderScreenContent()}
        </main>
      </div>

      {/* Prototype Interactive Selector Drawer - COLLAPSIBLE BAR */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="rounded-2xl border border-gray-800 bg-gray-950 p-4 shadow-2xl text-white max-w-sm w-80 space-y-3 transition-all relative">
          
          <button 
            onClick={() => setIsDemoPanelOpen(!isDemoPanelOpen)}
            className="w-full flex items-center justify-between font-sans text-xs font-black uppercase tracking-wider text-amber-500 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 animate-spin-slow" />
              Sélecteur de Prototype DEL ({allDemoScreens.length} Écrans)
            </span>
            {isDemoPanelOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>

          {isDemoPanelOpen && (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs border-t border-gray-800 pt-2">
              <p className="text-[10px] text-gray-400 font-medium">Naviguez instantanément parmi les 19 écrans de la maquette :</p>
              
              <div className="space-y-1">
                {allDemoScreens.map((demo) => {
                  const isActive = activeScreen === demo.screenName;
                  let badgeColor = "bg-amber-500/10 text-amber-400";
                  if (demo.role === "locataire") badgeColor = "bg-blue-500/10 text-blue-400";
                  if (demo.role === "shared") badgeColor = "bg-purple-500/10 text-purple-400";

                  return (
                    <button
                      key={demo.screenName}
                      onClick={() => {
                        setActiveScreen(demo.screenName);
                        if (demo.role === 'locataire') setActiveRole('locataire');
                        if (demo.role === 'proprietaire') setActiveRole('proprietaire');
                      }}
                      className={`w-full text-left p-2 rounded-lg flex items-center justify-between hover:bg-gray-900 transition-colors ${
                        isActive ? 'bg-amber-500 text-gray-950 font-black' : 'text-gray-300 font-semibold'
                      }`}
                    >
                      <span className="truncate">{demo.title}</span>
                      {!isActive && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-black ${badgeColor}`}>
                          {demo.role}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
