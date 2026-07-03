import React from 'react';
import { Engine, ClientRequest, Contract, Invoice, Maintenance, GlobalParams } from '../types';
import { 
  Wrench, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Building2, 
  Users, 
  Activity, 
  ArrowRight, 
  DollarSign, 
  ShieldAlert,
  Play
} from 'lucide-react';

interface DashboardViewProps {
  engines: Engine[];
  requests: ClientRequest[];
  contracts: Contract[];
  invoices: Invoice[];
  maintenances: Maintenance[];
  params: GlobalParams;
  onNavigate: (view: string, targetId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  engines,
  requests,
  contracts,
  invoices,
  maintenances,
  params,
  onNavigate
}) => {
  // Stats calculations
  const totalEngines = engines.length;
  const activeEngines = engines.filter(e => e.status === 'En Mission').length;
  const maintenanceEngines = engines.filter(e => e.status === 'En Maintenance').length;
  const utilizationRate = Math.round((activeEngines / totalEngines) * 100) || 0;

  const activeContracts = contracts.filter(c => c.status === 'Actif').length;
  const activeContractsAmount = contracts
    .filter(c => c.status === 'Actif')
    .reduce((sum, c) => sum + c.totalAmount, 0);

  const pendingRequestsCount = requests.filter(r => r.status === 'Nouvelle' || r.status === 'Qualification' || r.status === 'Matching').length;

  const lateInvoicesCount = invoices.filter(i => i.status === 'En Retard').length;
  const lateInvoicesAmount = invoices
    .filter(i => i.status === 'En Retard')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  // Critical items
  const activeMaintenancesCount = maintenances.filter(m => m.status !== 'Terminée').length;
  const downEngines = engines.filter(e => e.status === 'En Panne');

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 pointer-events-none">
          <Activity size={300} className="text-amber-500" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Mode Super-Admin
            </span>
            <span className="text-slate-400 text-xs">• Port d'exploitation DEL</span>
          </div>
          <h1 className="text-2xl font-bold font-sans text-white">Console d'Exploitation DEL-cms</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl">
            Pilotez l'ensemble de la flotte d'engins, gérez les demandes clients, supervisez les matching opérationnels et suivez la facturation globale.
          </p>
        </div>
        <div className="flex gap-3 relative z-10 shrink-0">
          <button 
            id="btn-quick-new-request"
            onClick={() => onNavigate('Demandes')} 
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2.5 rounded-md text-sm transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Activity size={16} />
            Nouvelle Demande
          </button>
          <button 
            id="btn-quick-param"
            onClick={() => onNavigate('Paramètres')} 
            className="border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-md text-sm transition-all cursor-pointer"
          >
            Réglages Plateforme
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div id="kpi-utilization" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Taux d'utilisation</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{utilizationRate}%</span>
              <span className="text-emerald-600 text-xs font-bold flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                <TrendingUp size={12} />
                +4%
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {activeEngines} actifs / {totalEngines} machines
            </p>
          </div>
          <div className="p-3 bg-slate-100 text-slate-700 rounded-lg">
            <Activity size={20} />
          </div>
        </div>

        {/* KPI 2 */}
        <div id="kpi-contracts" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Encours contrats</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: params.defaultCurrency || 'EUR', maximumFractionDigits: 0 }).format(activeContractsAmount)}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {activeContracts} contrats actifs engagés
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <FileText size={20} />
          </div>
        </div>

        {/* KPI 3 */}
        <div id="kpi-requests" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Demandes en cours</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">{pendingRequestsCount}</span>
              <span className="text-slate-400 text-xs font-mono">en attente</span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Action requise : matching
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
            <Wrench size={20} />
          </div>
        </div>

        {/* KPI 4 */}
        <div id="kpi-late" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex justify-between items-start">
          <div className="space-y-2">
            <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Retards Paiement</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${lateInvoicesCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: params.defaultCurrency || 'EUR', maximumFractionDigits: 0 }).format(lateInvoicesAmount)}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              {lateInvoicesCount} factures en retard de paiement
            </p>
          </div>
          <div className={`p-3 rounded-lg ${lateInvoicesCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
            <DollarSign size={20} />
          </div>
        </div>
      </div>


      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Paramètres plateforme</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">{params.platformName || 'DEL'}</h2>
          <p className="text-xs text-slate-500 mt-1">Devise {params.defaultCurrency || 'XOF'} · Commission {params.defaultPlatformCommissionRate ?? params.platformFeeRate}%</p>
          <p className="text-[11px] text-slate-400 mt-2">Modules actifs : PDF {params.enablePdfReports ? '✓' : '—'} · Notifications {params.enableNotifications ? '✓' : '—'} · Scoring {params.enableScoring ? '✓' : '—'} · Tenders {params.enableTenderModule ? '✓' : '—'}</p>
        </div>
        <button onClick={() => onNavigate('Paramètres')} className="border border-amber-300 bg-amber-50 text-amber-800 font-bold px-4 py-2 rounded-md text-xs">Modifier les paramètres</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Audit & Exports</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">Traçabilité DEL-api et sauvegardes administratives</h2>
          <p className="text-xs text-slate-500 mt-1">Accès rapide au journal d’audit, aux exports CSV/JSON et au full backup JSON administratif.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate('Audit')} className="border border-slate-300 bg-white text-slate-800 font-bold px-4 py-2 rounded-md text-xs">Voir l’audit</button>
          <button onClick={() => onNavigate('Exports')} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-md text-xs">Exports</button>
        </div>
      </div>

      {/* Main Grid: Alerts / Operations & Fleet Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (2/3): Alerts and Actions & Recent Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Urgent Security & Operations Center */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2 text-white">
                <ShieldAlert className="text-amber-500" size={18} />
                <h2 className="font-semibold text-sm uppercase tracking-wider">Centre d'Alertes Opérationnelles</h2>
              </div>
              <span className="bg-rose-500/10 text-rose-400 text-xs font-mono px-2 py-0.5 rounded border border-rose-500/20">
                {downEngines.length + lateInvoicesCount + pendingRequestsCount} Actions urgentes
              </span>
            </div>
            <div className="p-4 divide-y divide-slate-100">
              {/* Alert 1: Down Engine */}
              {downEngines.map(e => (
                <div key={e.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 first:pt-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">Panne Critique</span>
                      <span className="text-xs font-semibold font-mono text-slate-700">{e.code}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                    <p className="text-xs text-slate-500 font-mono">Propriétaire : {e.ownerName} • {e.location}</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('Maintenance')} 
                    className="bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Wrench size={12} />
                    Créer maintenance
                  </button>
                </div>
              ))}

              {/* Alert 2: Request without engine matched (New / Nouvelle request) */}
              {requests.filter(r => r.status === 'Nouvelle' || r.status === 'Matching').slice(0, 2).map(r => (
                <div key={r.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">Attente Matching</span>
                      <span className="text-xs font-semibold font-mono text-slate-700">{r.code}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                    <p className="text-xs text-slate-500 font-mono">Client : {r.companyName} • Puissance min: {r.minPower} kW</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('Demandes', r.id)} 
                    className="border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-amber-950 text-xs font-bold px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Play size={12} className="text-amber-500 fill-amber-500" />
                    Lancer Matching
                  </button>
                </div>
              ))}

              {/* Alert 3: Late Invoices */}
              {invoices.filter(i => i.status === 'En Retard').map(i => (
                <div key={i.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">Défaut de Paiement</span>
                      <span className="text-xs font-semibold font-mono text-slate-700">{i.code}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">Retard de paiement • {i.companyName}</p>
                    <p className="text-xs text-slate-500 font-mono">Montant : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: params.defaultCurrency || 'EUR' }).format(i.totalAmount)} • Échéance : {i.dueDate}</p>
                  </div>
                  <button 
                    onClick={() => onNavigate('Paiements')} 
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer shrink-0"
                  >
                    Relancer Client
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Client Requests */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-semibold text-slate-900 text-sm">Dernières Demandes Clients reçues</h2>
              <button 
                onClick={() => onNavigate('Demandes')} 
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
              >
                Tout voir
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3 font-mono">Code</th>
                    <th className="px-5 py-3">Entreprise</th>
                    <th className="px-5 py-3">Projet / Engin</th>
                    <th className="px-5 py-3 text-right">Budget</th>
                    <th className="px-5 py-3">Statut</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {requests.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3 font-mono font-medium text-slate-600">{r.code}</td>
                      <td className="px-5 py-3 font-medium text-slate-900">{r.companyName}</td>
                      <td className="px-5 py-3">
                        <div className="font-medium text-slate-800">{r.title}</div>
                        <div className="text-[10px] text-slate-400">{r.category} ({r.minPower} kW min)</div>
                      </td>
                      <td className="px-5 py-3 text-right font-semibold text-slate-900">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: params.defaultCurrency || 'EUR', maximumFractionDigits: 0 }).format(r.budget)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          r.status === 'Nouvelle' ? 'bg-amber-100 text-amber-800' :
                          r.status === 'Qualification' ? 'bg-sky-100 text-sky-800' :
                          r.status === 'Matching' ? 'bg-purple-100 text-purple-800' :
                          r.status === 'Proposition' ? 'bg-amber-500/20 text-amber-950' :
                          r.status === 'Contrat' ? 'bg-teal-100 text-teal-800' :
                          r.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <button 
                          onClick={() => onNavigate('Demandes', r.id)}
                          className="text-slate-600 hover:text-slate-900 font-bold hover:underline cursor-pointer font-mono"
                        >
                          Détails →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column (1/3): Fleet Distribution, Tech Availability & Operations Summary */}
        <div className="space-y-6">
          {/* Fleet Distribution chart block */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="font-semibold text-slate-900 text-sm mb-4">État d'activité du Parc</h2>
            
            {/* Visual SVG Chart bar */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>Distribution des {totalEngines} machines</span>
                <span>En mission: {utilizationRate}%</span>
              </div>
              
              <div className="h-6 w-full rounded-full overflow-hidden flex bg-slate-100">
                <div 
                  className="bg-emerald-500 h-full transition-all" 
                  style={{ width: `${(engines.filter(e => e.status === 'En Mission').length / totalEngines) * 100}%` }}
                  title={`En Mission (${engines.filter(e => e.status === 'En Mission').length})`}
                />
                <div 
                  className="bg-sky-500 h-full transition-all" 
                  style={{ width: `${(engines.filter(e => e.status === 'Disponible').length / totalEngines) * 100}%` }}
                  title={`Disponibles (${engines.filter(e => e.status === 'Disponible').length})`}
                />
                <div 
                  className="bg-amber-500 h-full transition-all" 
                  style={{ width: `${(engines.filter(e => e.status === 'En Maintenance').length / totalEngines) * 100}%` }}
                  title={`En Maintenance (${engines.filter(e => e.status === 'En Maintenance').length})`}
                />
                <div 
                  className="bg-rose-500 h-full transition-all" 
                  style={{ width: `${(engines.filter(e => e.status === 'En Panne').length / totalEngines) * 100}%` }}
                  title={`En Panne (${engines.filter(e => e.status === 'En Panne').length})`}
                />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-600">En Mission ({engines.filter(e => e.status === 'En Mission').length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                  <span className="text-slate-600">Disponibles ({engines.filter(e => e.status === 'Disponible').length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-600">En Maintenance ({engines.filter(e => e.status === 'En Maintenance').length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-slate-600">En Panne ({engines.filter(e => e.status === 'En Panne').length})</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 mt-5 pt-4">
              <button 
                onClick={() => onNavigate('Engins')} 
                className="w-full text-center text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:border-slate-300 py-2 rounded-md transition-all cursor-pointer block"
              >
                Gérer le parc d'engins
              </button>
            </div>
          </div>

          {/* Platform Performance Summary */}
          <div className="bg-slate-950 text-slate-100 border border-slate-900 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-sm uppercase tracking-wider text-amber-500 font-sans">
              Performances Plateforme
            </h2>
            
            <div className="space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-xs">Commission moyenne</span>
                <span className="text-sm font-semibold text-slate-200">9.75 %</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-xs">Temps moyen qualification</span>
                <span className="text-sm font-semibold text-emerald-400">1.8 jours</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400 text-xs">NPS Locataires</span>
                <span className="text-sm font-semibold text-slate-200">4.8 / 5</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-slate-400 text-xs">Taux d'incident machine</span>
                <span className="text-sm font-semibold text-rose-400">2.1 %</span>
              </div>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 font-bold mb-1 text-slate-200">
                <AlertTriangle size={14} className="text-amber-500" />
                Vérification VGP Requise
              </div>
              Le rapport de conformité technique de l'engin <strong>ENG-105</strong> expire dans 10 jours.
            </div>
          </div>

          {/* Quick Stats Panel (Owner vs Companies) */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="font-semibold text-slate-900 text-sm">Acteurs de la Plateforme</h2>
            <div className="space-y-3.5 text-xs">
              <div onClick={() => onNavigate('Propriétaires')} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-100 text-slate-600 rounded">
                    <Building2 size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Propriétaires partenaires</p>
                    <p className="text-[10px] text-slate-400">Mise à disposition du matériel</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">4 partenaires</span>
              </div>

              <div onClick={() => onNavigate('Entreprises')} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-100 text-slate-600 rounded">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Entreprises Locataires</p>
                    <p className="text-[10px] text-slate-400">Grands comptes & PME BTP</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">4 clients actifs</span>
              </div>

              <div onClick={() => onNavigate('Techniciens')} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-100 text-slate-600 rounded">
                    <Wrench size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Techniciens DEL</p>
                    <p className="text-[10px] text-slate-400">Supervision technique d'engins</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">4 techniciens</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
