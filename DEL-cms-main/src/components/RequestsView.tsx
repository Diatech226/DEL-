import React, { useState } from 'react';
import { ClientRequest, Engine, MatchingResult } from '../types';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  Zap, 
  Clock, 
  Calendar, 
  Euro, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  Send 
} from 'lucide-react';

interface RequestsViewProps {
  requests: ClientRequest[];
  engines: Engine[];
  selectedRequestId: string | null;
  onSelectRequest: (id: string | null) => void;
  onAddRequest: (request: Omit<ClientRequest, 'id' | 'code' | 'workflow' | 'matchingCount'>) => void;
  onAdvanceWorkflow: (id: string, nextStatus: ClientRequest['status']) => void;
  onProposeEngine: (requestId: string, engineId: string, dailyRate: number) => void;
}

export const RequestsView: React.FC<RequestsViewProps> = ({
  requests,
  engines,
  selectedRequestId,
  onSelectRequest,
  onAddRequest,
  onAdvanceWorkflow,
  onProposeEngine
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form fields
  const [newRequest, setNewRequest] = useState({
    companyId: 'comp-1',
    companyName: 'Vinci Construction France',
    title: '',
    category: 'Groupe Électrogène',
    minPower: 800,
    durationDays: 30,
    budget: 40000,
    startDate: '',
    description: '',
    contactName: 'Thomas Martin',
    contactEmail: 't.martin@vinci-construction.fr'
  });

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.companyName.toLowerCase().includes(search.toLowerCase()) ||
                          r.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate matching scores for current request
  const getMatchingResults = (req: ClientRequest): MatchingResult[] => {
    return engines.map(eng => {
      let score = 100;
      let powerMatch = eng.power >= req.minPower;
      let locationMatch = eng.location.split(' ')[0] === req.companyName.includes('Marseille') ? 'Marseille' : 'Lyon'; // basic mock location heuristics
      let availabilityMatch = eng.status === 'Disponible';

      // Score deduction heuristics
      if (eng.category !== req.category) {
        score -= 50;
      }
      if (!powerMatch) {
        score -= 25;
      }
      if (!availabilityMatch) {
        score -= 20; // deduction if not immediately available
      }
      
      const distance = eng.location.includes('Lyon') ? 45 : eng.location.includes('Paris') ? 320 : 120;
      const transportCost = Math.round(distance * 4.5) + 300;

      return {
        engineId: eng.id,
        engineCode: eng.code,
        engineName: eng.name,
        score: Math.max(score, 10),
        powerMatch,
        locationMatch: true, // simplified
        availabilityMatch,
        distanceKm: distance,
        estimatedTransportCost: transportCost
      };
    })
    .filter(res => engines.find(e => e.id === res.engineId)?.category === req.category) // keep same category
    .sort((a, b) => b.score - a.score);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRequest({
      ...newRequest,
      companyName: newRequest.companyId === 'comp-1' ? 'Vinci Construction France' :
                   newRequest.companyId === 'comp-2' ? 'Bouygues Travaux Publics' :
                   newRequest.companyId === 'comp-3' ? 'Eiffage Route Ouest' : 'Colas Île-de-France'
    });
    setShowAddForm(false);
    setNewRequest({
      companyId: 'comp-1',
      companyName: 'Vinci Construction France',
      title: '',
      category: 'Groupe Électrogène',
      minPower: 800,
      durationDays: 30,
      budget: 40000,
      startDate: '',
      description: '',
      contactName: 'Thomas Martin',
      contactEmail: 't.martin@vinci-construction.fr'
    });
  };

  const stepsList: ClientRequest['status'][] = [
    'Nouvelle',
    'Qualification',
    'Matching',
    'Proposition',
    'Contrat',
    'Active',
    'Terminée'
  ];

  return (
    <div id="requests-view" className="space-y-6">
      {selectedRequest ? (
        <div className="space-y-6">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button 
              id="btn-back-to-requests"
              onClick={() => onSelectRequest(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm cursor-pointer"
            >
              <ArrowLeft size={16} />
              Retour au registre des demandes
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Workflow d'exploitation :</span>
              <button
                id="btn-advance-workflow"
                onClick={() => {
                  const currIdx = stepsList.indexOf(selectedRequest.status);
                  if (currIdx < stepsList.length - 1) {
                    onAdvanceWorkflow(selectedRequest.id, stepsList[currIdx + 1]);
                  } else {
                    alert('La demande est déjà à l\'état final de son cycle d\'exploitation.');
                  }
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-3 py-1.5 rounded cursor-pointer transition-all flex items-center gap-1"
              >
                Passer à l'étape suivante →
              </button>
            </div>
          </div>

          {/* Screen 5: Detail demande avec Workflow */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
            
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-slate-950 text-amber-400 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded">
                    {selectedRequest.code}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded">
                    {selectedRequest.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedRequest.title}</h2>
                <p className="text-slate-500 text-xs mt-1">Émise par <strong>{selectedRequest.companyName}</strong> pour un début au {selectedRequest.startDate}</p>
              </div>

              <div className="text-right">
                <span className={`px-3 py-1.5 rounded text-xs font-bold font-mono inline-block ${
                  selectedRequest.status === 'Nouvelle' ? 'bg-amber-100 text-amber-800' :
                  selectedRequest.status === 'Qualification' ? 'bg-sky-100 text-sky-800' :
                  selectedRequest.status === 'Matching' ? 'bg-purple-100 text-purple-800' :
                  selectedRequest.status === 'Proposition' ? 'bg-amber-500/20 text-amber-950' :
                  selectedRequest.status === 'Contrat' ? 'bg-teal-100 text-teal-800' :
                  selectedRequest.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  Statut : {selectedRequest.status}
                </span>
                <p className="text-slate-400 text-[10px] font-mono mt-1">Budget prévisionnel : {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(selectedRequest.budget)}</p>
              </div>
            </div>

            {/* Workflow Progress Stepper (SaaS visual component) */}
            <div className="space-y-4">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider font-mono">Suivi d'avancement réglementaire</h3>
              
              <div className="relative">
                {/* Horizontal progress bar background */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                
                {/* Active progress bar color */}
                <div 
                  className="absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-300" 
                  style={{ width: `${(stepsList.indexOf(selectedRequest.status) / (stepsList.length - 1)) * 100}%` }}
                />

                <div className="relative z-10 flex justify-between items-center text-center">
                  {stepsList.map((step, idx) => {
                    const isCompleted = stepsList.indexOf(selectedRequest.status) > idx;
                    const isCurrent = selectedRequest.status === step;
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                          isCompleted ? 'bg-emerald-500 text-white shadow-xs' :
                          isCurrent ? 'bg-amber-500 text-slate-900 ring-4 ring-amber-100 font-black' :
                          'bg-white border-2 border-slate-200 text-slate-400'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[10px] mt-2 font-semibold hidden md:block ${isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Split specifications layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              {/* Technical expectations */}
              <div className="md:col-span-2 space-y-3">
                <h4 className="font-semibold text-slate-900 text-sm">Cahier des charges technique</h4>
                <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 font-mono">
                  {selectedRequest.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Puissance minimale requise :</span>
                    <span className="text-slate-900 font-bold">{selectedRequest.minPower} kW</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-400 block mb-0.5">Durée contractuelle prévue :</span>
                    <span className="text-slate-900 font-bold">{selectedRequest.durationDays} jours</span>
                  </div>
                </div>
              </div>

              {/* Client specifications */}
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Contact de l'entreprise</h4>
                
                <div className="space-y-3 font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Client de la plateforme :</span>
                    <span className="font-semibold text-slate-800">{selectedRequest.companyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Chef de projet / Contact :</span>
                    <span className="font-semibold text-slate-800">{selectedRequest.contactName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email de correspondance :</span>
                    <span className="font-semibold text-indigo-700 truncate block">{selectedRequest.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Screen 6: Matching Recommendations Engine */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-slate-950 text-sm uppercase tracking-wider font-sans">
                  Algorithme de Matching DEL-Matching®
                </h3>
              </div>
              <span className="bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold px-2.5 py-1 rounded border border-emerald-200">
                Puissance cible : &ge; {selectedRequest.minPower} kW • Catégorie : {selectedRequest.category}
              </span>
            </div>

            <p className="text-slate-500 text-xs">
              Voici la liste des engins compatibles disponibles dans votre catalogue, classés par pertinence géographique, technique et de coût opérationnel.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-2.5 font-mono">Score Match</th>
                    <th className="px-4 py-2.5">Matériel recommandé</th>
                    <th className="px-4 py-2.5 text-center">Puissance</th>
                    <th className="px-4 py-2.5">Localisation</th>
                    <th className="px-4 py-2.5 text-right font-mono">Taux Jour (HT)</th>
                    <th className="px-4 py-2.5">Transport estimé</th>
                    <th className="px-4 py-2.5 text-center">Statut</th>
                    <th className="px-4 py-2.5 text-center">Action administrative</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {getMatchingResults(selectedRequest).map(res => {
                    const engineObj = engines.find(e => e.id === res.engineId);
                    if (!engineObj) return null;

                    return (
                      <tr key={res.engineId} className="hover:bg-slate-50 transition-colors">
                        {/* Score percent */}
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 font-mono font-bold px-2.5 py-1 rounded text-xs ${
                            res.score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                            res.score >= 60 ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {res.score}%
                          </span>
                        </td>

                        {/* Name and serial */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{res.engineName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{res.engineCode} • {engineObj.brand}</div>
                        </td>

                        {/* Power comparison */}
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold font-mono ${res.powerMatch ? 'text-emerald-700' : 'text-rose-600 font-bold'}`}>
                            {engineObj.power} kW 
                          </span>
                          <span className="text-[10px] text-slate-400 block">requis: {selectedRequest.minPower} kW</span>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3 font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-rose-500" />
                            {engineObj.location}
                          </span>
                          <span className="text-[10px] text-slate-400 block">Distance approx : {res.distanceKm} km</span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3 text-right font-bold text-slate-900">
                          {engineObj.dailyRate} €/j
                        </td>

                        {/* Transport cost */}
                        <td className="px-4 py-3 font-mono text-slate-600">
                          {res.estimatedTransportCost} € HT
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            res.availabilityMatch ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {engineObj.status}
                          </span>
                        </td>

                        {/* Trigger button */}
                        <td className="px-4 py-3 text-center">
                          <button
                            disabled={selectedRequest.status === 'Proposition' || selectedRequest.status === 'Contrat' || selectedRequest.status === 'Active'}
                            onClick={() => {
                              onProposeEngine(selectedRequest.id, engineObj.id, engineObj.dailyRate);
                              alert(`L'engin ${engineObj.code} a été sélectionné ! Une proposition commerciale de location (Offre PRO-303) d'un montant journalier de ${engineObj.dailyRate} €/j a été générée automatiquement et envoyée en brouillon.`);
                            }}
                            className={`px-3 py-1.5 rounded text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1.5 mx-auto ${
                              selectedRequest.status === 'Proposition' || selectedRequest.status === 'Contrat' || selectedRequest.status === 'Active'
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-xs'
                            }`}
                          >
                            <Send size={12} />
                            Sélectionner & Proposer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // Request Registry list
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Registre des Demandes Clients ({requests.length})</h1>
              <p className="text-slate-500 text-xs">Suivez les besoins exprimés par les clients, qualifiez techniquement les dossiers et gérez les matchings machines.</p>
            </div>

            <button 
              id="btn-add-request-modal"
              onClick={() => setShowAddForm(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              Nouvelle demande
            </button>
          </div>

          {/* Search, filters */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  id="search-requests-input"
                  type="text"
                  placeholder="Rechercher par code, client, intitulé de projet..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                id="filter-request-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">Tous les statuts d'exploitation</option>
                <option value="Nouvelle">Nouvelle</option>
                <option value="Qualification">Qualification</option>
                <option value="Matching">Matching</option>
                <option value="Proposition">Proposition</option>
                <option value="Contrat">Contrat</option>
                <option value="Active">Active</option>
                <option value="Terminée">Terminée</option>
              </select>
            </div>
          </div>

          {/* Add Request Modal Form Overlay */}
          {showAddForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center text-white">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-500">Créer un nouveau dossier de demande</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">✕</button>
                </div>
                <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Intitulé du projet de location *</label>
                      <input 
                        type="text"
                        required
                        value={newRequest.title}
                        onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                        placeholder="ex: Générateur secours tunnels A86"
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Client Locataire *</label>
                      <select 
                        value={newRequest.companyId}
                        onChange={(e) => setNewRequest({...newRequest, companyId: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      >
                        <option value="comp-1">Vinci Construction France</option>
                        <option value="comp-2">Bouygues Travaux Publics</option>
                        <option value="comp-3">Eiffage Route Ouest</option>
                        <option value="comp-4">Colas Île-de-France</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Catégorie de matériel requis *</label>
                      <select 
                        value={newRequest.category}
                        onChange={(e) => setNewRequest({...newRequest, category: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      >
                        <option value="Groupe Électrogène">Groupe Électrogène</option>
                        <option value="Excavatrice">Excavatrice</option>
                        <option value="Compresseur">Compresseur</option>
                        <option value="Grue Mobile">Grue Mobile</option>
                        <option value="Pompe Haute Capacité">Pompe Haute Capacité</option>
                        <option value="Chargeur">Chargeur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Puissance minimum requise (kW) *</label>
                      <input 
                        type="number"
                        required
                        value={newRequest.minPower}
                        onChange={(e) => setNewRequest({...newRequest, minPower: Number(e.target.value)})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Durée estimée (jours) *</label>
                      <input 
                        type="number"
                        required
                        value={newRequest.durationDays}
                        onChange={(e) => setNewRequest({...newRequest, durationDays: Number(e.target.value)})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Budget cible prévisionnel (€ HT) *</label>
                      <input 
                        type="number"
                        required
                        value={newRequest.budget}
                        onChange={(e) => setNewRequest({...newRequest, budget: Number(e.target.value)})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date cible d'exploitation *</label>
                      <input 
                        type="date"
                        required
                        value={newRequest.startDate}
                        onChange={(e) => setNewRequest({...newRequest, startDate: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Description détaillée du besoin technique *</label>
                      <textarea 
                        required
                        rows={3}
                        value={newRequest.description}
                        onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                        placeholder="Veuillez spécifier l'usage d'exploitation, les contraintes d'insonorisation et d'installation sur le chantier..."
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-md font-bold cursor-pointer"
                    >
                      Enregistrer la demande
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Table list */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 font-mono">Code</th>
                    <th className="px-5 py-3.5">Projet de location</th>
                    <th className="px-5 py-3.5">Locataire client</th>
                    <th className="px-5 py-3.5 text-center">Spécifications</th>
                    <th className="px-5 py-3.5 text-right">Durée</th>
                    <th className="px-5 py-3.5 text-right font-mono">Budget (HT)</th>
                    <th className="px-5 py-3.5">Statut d'exploitation</th>
                    <th className="px-5 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredRequests.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-600">{r.code}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900">{r.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Début estimé : {r.startDate}</div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700">{r.companyName}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className="font-semibold text-slate-800">{r.category}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">&ge; {r.minPower} kW</span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-slate-700 font-mono">
                        {r.durationDays} j
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-900 font-mono">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(r.budget)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          r.status === 'Nouvelle' ? 'bg-amber-100 text-amber-800 font-semibold' :
                          r.status === 'Qualification' ? 'bg-sky-100 text-sky-800' :
                          r.status === 'Matching' ? 'bg-purple-100 text-purple-800' :
                          r.status === 'Proposition' ? 'bg-amber-500/20 text-amber-950 font-bold' :
                          r.status === 'Contrat' ? 'bg-teal-100 text-teal-800' :
                          r.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button 
                          onClick={() => onSelectRequest(r.id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded text-xs transition-all cursor-pointer"
                        >
                          Exploiter & Matcher
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
