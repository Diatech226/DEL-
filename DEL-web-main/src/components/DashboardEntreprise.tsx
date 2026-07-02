import React from 'react';
import { 
  Building2, 
  Search, 
  PlusCircle, 
  Truck, 
  FileCheck, 
  FileText, 
  DollarSign, 
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { Contract, Mission, Proposal } from '../types';

interface DashboardEntrepriseProps {
  user: any;
  contracts: Contract[];
  missions: Mission[];
  proposals: Proposal[];
  onNavigate: (screen: string) => void;
}

export default function DashboardEntreprise({ 
  user, 
  contracts, 
  missions, 
  proposals, 
  onNavigate 
}: DashboardEntrepriseProps) {

  // Locataire metrics
  const activeContracts = contracts.filter(c => c.status === 'Actif');
  const activeMissions = missions.filter(m => m.status !== 'Terminé');
  const pendingQuotesCount = proposals.filter(p => p.bidderName !== 'Jean-Marc Mercier' && p.status === 'En attente').length;
  
  const totalBudgetSpent = contracts.reduce((sum, c) => sum + c.totalPrice, 0);

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-dashboard-entreprise">
      {/* Welcome Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              Compte Locataire Certifié
            </span>
            <span className="text-xs text-gray-400">• B2B Pro</span>
          </div>
          <h1 className="font-sans text-2xl font-black text-gray-950 mt-1">Espace Entreprise Locataire</h1>
          <p className="text-xs text-gray-500">Supervisez vos locations actives, créez des appels d'offres de matériel lourd, et pilotez vos missions de chantier.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('Liste des Engins - DEL-web')}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
          >
            <Search className="h-4 w-4 text-blue-500" />
            Rechercher un Engin
          </button>
          <button
            onClick={() => onNavigate('Demander des Engins - DEL-web')}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/15 hover:bg-blue-500 transition-all cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            Publier un Besoin
          </button>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Engins en location</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="font-sans text-2xl font-black text-gray-950">{activeContracts.length} Machines</h3>
            <p className="text-[10px] text-gray-400 mt-1">Opérationnelles sur vos chantiers</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Budget engagé</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="font-sans text-2xl font-black text-gray-950">{totalBudgetSpent.toLocaleString('fr-FR')} €</h3>
            <p className="text-[10px] text-gray-400 mt-1">Montant total des contrats B2B</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Devis en attente</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="font-sans text-2xl font-black text-gray-950">{pendingQuotesCount} Offres</h3>
            <p className="text-[10px] text-gray-400 mt-1">À étudier pour vos appels d'offres</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase">Suivi opérationnel</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <Truck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h3 className="font-sans text-2xl font-black text-gray-950">{activeMissions.length} Missions</h3>
            <p className="text-[10px] text-indigo-600 font-bold mt-1">Télémétrie en temps réel connectée</p>
          </div>
        </div>
      </div>

      {/* Renter Specific Section: Shortcuts & Quick List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Locations list */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="font-sans text-sm font-bold text-gray-900">Vos Engins Actifs en Mission</h3>
              <p className="text-[11px] text-gray-500">Mise à jour télémétrique en direct</p>
            </div>
            <button
              onClick={() => onNavigate('Suivi des Missions - DEL-web')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              Suivi Cartographique <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-800 uppercase">
                      {mission.status}
                    </span>
                    <h4 className="text-xs font-bold text-gray-900">{mission.machineName} {mission.machineModel}</h4>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold">Chauffeur: {mission.driverName.split(' ')[0]}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-500">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Tâche en cours</span>
                    <span className="font-semibold text-gray-800">{mission.currentTask}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Localisation</span>
                    <span className="font-semibold text-gray-800">{mission.location.split(' (')[0]}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Niveau Réservoir</span>
                    <span className="font-bold text-amber-600">{mission.fuelLevel}% GNR</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick action grid */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
            <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-wider">Liens Portails Rapides</h4>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate('Liste des Engins - DEL-web')}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center hover:bg-blue-50 transition-colors"
              >
                <Search className="h-5 w-5 text-blue-600 mx-auto mb-1.5" />
                <span className="text-[10px] font-bold text-gray-700">Catalog Engins</span>
              </button>
              
              <button
                onClick={() => onNavigate('Demander des Engins - DEL-web')}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center hover:bg-blue-50 transition-colors"
              >
                <PlusCircle className="h-5 w-5 text-blue-600 mx-auto mb-1.5" />
                <span className="text-[10px] font-bold text-gray-700">Créer un besoin</span>
              </button>

              <button
                onClick={() => onNavigate('Suivi des Missions - DEL-web')}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center hover:bg-blue-50 transition-colors"
              >
                <Truck className="h-5 w-5 text-blue-600 mx-auto mb-1.5" />
                <span className="text-[10px] font-bold text-gray-700">Suivi Live</span>
              </button>

              <button
                onClick={() => onNavigate('Gestion des Contrats - DEL-web')}
                className="rounded-xl border border-gray-100 bg-gray-50 p-3 text-center hover:bg-blue-50 transition-colors"
              >
                <FileCheck className="h-5 w-5 text-blue-600 mx-auto mb-1.5" />
                <span className="text-[10px] font-bold text-gray-700">Contrats</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-gray-950 p-6 text-white text-center space-y-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400 mx-auto" />
            <h5 className="font-sans text-xs font-bold">Sécurité & Certifications Garanties</h5>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Toutes les machines louées sur DEL-web possèdent un rapport VGP valide de moins de 6 mois chiffré dans le coffre-fort.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
