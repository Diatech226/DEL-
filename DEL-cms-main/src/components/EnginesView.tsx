import React, { useState } from 'react';
import { Engine, Proprietor } from '../types';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Zap, 
  Calendar, 
  Clock, 
  Euro, 
  ArrowLeft, 
  Wrench, 
  User, 
  Building2, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';

interface EnginesViewProps {
  engines: Engine[];
  proprietors: Proprietor[];
  selectedEngineId: string | null;
  onSelectEngine: (id: string | null) => void;
  onAddEngine: (engine: Omit<Engine, 'id' | 'code'>) => void;
  onUpdateEngineStatus: (id: string, status: Engine['status']) => void;
}

export const EnginesView: React.FC<EnginesViewProps> = ({
  engines,
  proprietors,
  selectedEngineId,
  onSelectEngine,
  onAddEngine,
  onUpdateEngineStatus
}) => {
  // Filters state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [minPower, setMinPower] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Groupe Électrogène',
    brand: '',
    model: '',
    power: 500,
    hourlyRate: 80,
    dailyRate: 650,
    currentHours: 1200,
    ownerId: proprietors[0]?.id || '',
    location: '',
    year: 2022,
    serialNumber: '',
    nextMaintenance: ''
  });

  const selectedEngine = engines.find(e => e.id === selectedEngineId);

  // Filter engines
  const filteredEngines = engines.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                          e.code.toLowerCase().includes(search.toLowerCase()) ||
                          e.brand.toLowerCase().includes(search.toLowerCase()) ||
                          e.model.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesPower = e.power >= minPower;

    return matchesSearch && matchesStatus && matchesCategory && matchesPower;
  });

  const uniqueCategories = Array.from(new Set(engines.map(e => e.category)));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const owner = proprietors.find(p => p.id === formData.ownerId);
    onAddEngine({
      ...formData,
      ownerName: owner ? owner.name : 'Inconnu'
    });
    setShowAddForm(false);
    // Reset form
    setFormData({
      name: '',
      category: 'Groupe Électrogène',
      brand: '',
      model: '',
      power: 500,
      hourlyRate: 80,
      dailyRate: 650,
      currentHours: 1200,
      ownerId: proprietors[0]?.id || '',
      location: '',
      year: 2022,
      serialNumber: '',
      nextMaintenance: ''
    });
  };

  return (
    <div id="engines-view" className="space-y-6">
      {/* If view is Detail View */}
      {selectedEngine ? (
        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <button 
              id="btn-back-to-engines"
              onClick={() => onSelectEngine(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm cursor-pointer"
            >
              <ArrowLeft size={16} />
              Retour à la flotte d'engins
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">Modifier le statut de l'engin :</span>
              <select
                id="select-engine-status-quick"
                value={selectedEngine.status}
                onChange={(e) => onUpdateEngineStatus(selectedEngine.id, e.target.value as Engine['status'])}
                className="bg-white border border-slate-300 rounded text-xs font-semibold px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Disponible">Disponible (Actif)</option>
                <option value="En Mission">En Mission (Engagé)</option>
                <option value="En Maintenance">En Maintenance</option>
                <option value="En Panne">En Panne (Critique)</option>
              </select>
            </div>
          </div>

          {/* Engine Detail Bento Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (2/3): Core Specifications, Photos & Stats */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card 1: Core Identity & Specs */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-slate-900 text-amber-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
                        {selectedEngine.code}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded">
                        {selectedEngine.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedEngine.name}</h2>
                    <p className="text-slate-500 text-xs font-mono mt-1">N° de série : {selectedEngine.serialNumber} • Année : {selectedEngine.year}</p>
                  </div>
                  
                  {/* Status badge with specified colors */}
                  <span className={`px-3 py-1 rounded text-xs font-bold font-mono ${
                    selectedEngine.status === 'Disponible' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                    selectedEngine.status === 'En Mission' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                    selectedEngine.status === 'En Maintenance' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {selectedEngine.status}
                  </span>
                </div>

                {/* Grid of technical metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <Zap size={14} className="text-amber-500" />
                      Puissance
                    </div>
                    <p className="text-lg font-bold text-slate-900">{selectedEngine.power} kW</p>
                    <p className="text-[10px] text-slate-400 font-mono">{(selectedEngine.power * 1.341).toFixed(0)} Chevaux (HP)</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <Clock size={14} className="text-indigo-500" />
                      Heures de service
                    </div>
                    <p className="text-lg font-bold text-slate-900">{selectedEngine.currentHours} hrs</p>
                    <p className="text-[10px] text-slate-400 font-mono">Compteur révisé</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <MapPin size={14} className="text-rose-500" />
                      Localisation
                    </div>
                    <p className="text-lg font-bold text-slate-900 truncate" title={selectedEngine.location}>{selectedEngine.location}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Dépôt d'attache</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                      <Euro size={14} className="text-emerald-500" />
                      Taux Journalier
                    </div>
                    <p className="text-lg font-bold text-slate-900">{selectedEngine.dailyRate} €/j</p>
                    <p className="text-[10px] text-slate-400 font-mono">({selectedEngine.hourlyRate} €/h)</p>
                  </div>
                </div>

                {/* Sub specifications list */}
                <div className="space-y-3.5 pt-2">
                  <h3 className="font-semibold text-slate-900 text-sm">Spécifications techniques détaillées</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Constructeur / Marque</span>
                      <span className="font-semibold text-slate-900">{selectedEngine.brand}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Modèle de moteur</span>
                      <span className="font-semibold text-slate-900">{selectedEngine.model}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Prochaine maintenance VGP</span>
                      <span className="font-semibold text-amber-700">{selectedEngine.nextMaintenance}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Type de châssis</span>
                      <span className="font-semibold text-slate-900">Insonorisé, Mobile renforcé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Maintenance & Service Log for Engine */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-sm">Registre des maintenances de l'engin</h3>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">2 interventions passées</span>
                </div>
                
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-6 text-xs">
                  {/* Item 1 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 bg-emerald-500 rounded-full w-4.5 h-4.5 flex items-center justify-center text-white border border-white">
                      <CheckCircle2 size={10} />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="font-bold text-slate-700">13 mai 2026</span>
                        <span>•</span>
                        <span className="font-mono">MNT-003</span>
                      </div>
                      <p className="font-bold text-slate-900">Vérification alternateur & Batterie de démarrage (Préventive)</p>
                      <p className="text-slate-500">Remplacement préventif du démarreur de secours et test de charge à vide sur banc de charge à Lyon. Effectué par Marc Levêque.</p>
                      <p className="text-[10px] text-slate-400 font-mono">Coût de l'intervention : 620,00 € HT</p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="relative">
                    <span className="absolute -left-[31px] top-1 bg-slate-400 rounded-full w-4.5 h-4.5 flex items-center justify-center text-white border border-white">
                      <Calendar size={10} />
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span className="font-bold text-slate-700">À venir ({selectedEngine.nextMaintenance})</span>
                        <span>•</span>
                        <span className="font-mono">MNT-SCHED</span>
                      </div>
                      <p className="font-bold text-slate-900">Maintenance réglementaire périodique 250 heures</p>
                      <p className="text-slate-500">Contrôle complet des sécurités, vidange d'huile, changement des filtres à carburant haute pression.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (1/3): Owner details & quick operation controls */}
            <div className="space-y-6">
              {/* Card 1: Proprietor Owner Profile */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-3">
                  <User size={18} className="text-indigo-500" />
                  <h3 className="font-semibold text-sm">Propriétaire Partenaire</h3>
                </div>
                
                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] font-mono">Nom du propriétaire :</p>
                    <p className="font-bold text-slate-950 text-sm mt-0.5">{selectedEngine.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-mono">Type d'acteur :</p>
                    <p className="font-semibold text-slate-800">Entreprise Matériel Associée</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-mono">Commission prélevée par la plateforme DEL :</p>
                    <p className="font-semibold text-indigo-700">10 % de commission brute</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                  <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Building2 size={14} className="text-slate-500" />
                    Atlas Matériel Industriel
                  </p>
                  <p className="text-slate-500 mt-1">Flotte active : 4 engins enregistrés</p>
                  <p className="text-slate-500">Email : contact@atlas-materiel.fr</p>
                </div>
              </div>

              {/* Card 2: Quick Operation Actions */}
              <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-amber-400 border-b border-slate-800 pb-3">
                  <Activity size={18} />
                  <h3 className="font-bold text-sm font-sans uppercase tracking-wider">Actions de Contrôle</h3>
                </div>
                
                <div className="space-y-2 text-xs">
                  <button 
                    onClick={() => {
                      alert(`Déclenchement d'un audit technique urgent sur l'engin ${selectedEngine.code}`);
                    }}
                    className="w-full text-left bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2.5 rounded border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>Lancer un Audit Technique</span>
                    <Wrench size={14} className="text-amber-500" />
                  </button>
                  
                  <button 
                    onClick={() => {
                      alert(`Envoi d'une notification de maintenance réglementaire au propriétaire ${selectedEngine.ownerName}`);
                    }}
                    className="w-full text-left bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2.5 rounded border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <span>Notifier le propriétaire</span>
                    <Calendar size={14} className="text-slate-400" />
                  </button>

                  <div className="bg-slate-950 p-3 rounded text-slate-400 text-[11px] leading-relaxed border border-slate-800">
                    <span className="text-amber-500 font-bold block mb-0.5">ℹ️ Recommandation Système</span>
                    Cet engin est actuellement en état <strong>{selectedEngine.status}</strong>. Pour l'assigner à une mission ou un contrat de location actif, assurez-vous que son statut soit positionné sur <strong>Disponible</strong>.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        // List of all engines
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Parc d'Engins Industriels ({engines.length})</h1>
              <p className="text-slate-500 text-xs">Gérez et suivez le catalogue de groupes électrogènes, excavatrices, grues et compresseurs lourds.</p>
            </div>
            
            <button 
              id="btn-add-engine-modal"
              onClick={() => setShowAddForm(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={16} />
              Ajouter un engin
            </button>
          </div>

          {/* Search, filters toggler */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <div className="flex flex-col md:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  id="search-engines-input"
                  type="text"
                  placeholder="Rechercher par code, nom, constructeur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  id="filter-category"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">Toutes catégories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>

                <select
                  id="filter-status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-2 text-slate-700 font-medium focus:outline-none"
                >
                  <option value="all">Tous statuts</option>
                  <option value="Disponible">Disponible</option>
                  <option value="En Mission">En Mission</option>
                  <option value="En Maintenance">En Maintenance</option>
                  <option value="En Panne">En Panne</option>
                </select>

                <button 
                  id="btn-toggle-advanced-filters"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <SlidersHorizontal size={14} />
                  Filtres avancés
                </button>
              </div>
            </div>

            {/* Advanced Filters Drawer */}
            {showFilters && (
              <div className="border-t border-slate-100 mt-3 pt-3 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-medium mb-1 font-mono">Puissance minimale ({minPower} kW) :</label>
                  <input 
                    id="range-power"
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={minPower}
                    onChange={(e) => setMinPower(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => {
                      setSearch('');
                      setStatusFilter('all');
                      setCategoryFilter('all');
                      setMinPower(0);
                    }}
                    className="text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer underline"
                  >
                    Réinitialiser tous les filtres
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Add Engine Modal / Form Overlay */}
          {showAddForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center text-white">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-500">Ajouter un nouvel engin industriel</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">✕</button>
                </div>
                <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Nom descriptif de l'engin *</label>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="ex: Générateur de secours Volvo Penta 600"
                        className="w-full p-2 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Catégorie *</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500"
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
                      <label className="block font-semibold text-slate-700 mb-1">Constructeur / Marque *</label>
                      <input 
                        type="text"
                        required
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        placeholder="ex: Caterpillar, Cummins"
                        className="w-full p-2 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Modèle exact *</label>
                      <input 
                        type="text"
                        required
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        placeholder="ex: QSK15-G8"
                        className="w-full p-2 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Puissance (kW) *</label>
                      <input 
                        type="number"
                        required
                        value={formData.power}
                        onChange={(e) => setFormData({...formData, power: Number(e.target.value)})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Taux journalier (€ HT) *</label>
                      <input 
                        type="number"
                        required
                        value={formData.dailyRate}
                        onChange={(e) => setFormData({...formData, dailyRate: Number(e.target.value)})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Localisation (Ville / Code Postal) *</label>
                      <input 
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="ex: Lyon (69)"
                        className="w-full p-2 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Propriétaire Partenaire *</label>
                      <select 
                        value={formData.ownerId}
                        onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900 focus:outline-none"
                      >
                        {proprietors.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Heures compteur de départ</label>
                      <input 
                        type="number"
                        value={formData.currentHours}
                        onChange={(e) => setFormData({...formData, currentHours: Number(e.target.value)})}
                        className="w-full p-2 border border-slate-200 rounded"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Numéro de Série *</label>
                      <input 
                        type="text"
                        required
                        value={formData.serialNumber}
                        onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                        placeholder="CAT-SER-8820"
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Prochaine Maintenance réglementaire</label>
                      <input 
                        type="date"
                        value={formData.nextMaintenance}
                        onChange={(e) => setFormData({...formData, nextMaintenance: e.target.value})}
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
                      Enregistrer le matériel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Engines Fleet Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 font-mono">Code</th>
                    <th className="px-5 py-3.5">Nom de l'engin / Type</th>
                    <th className="px-5 py-3.5">Constructeur</th>
                    <th className="px-5 py-3.5 text-center">Puissance</th>
                    <th className="px-5 py-3.5 text-right font-mono">Taux Jour (HT)</th>
                    <th className="px-5 py-3.5">Localisation</th>
                    <th className="px-5 py-3.5">Statut</th>
                    <th className="px-5 py-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredEngines.length > 0 ? (
                    filteredEngines.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-600">{e.code}</td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900">{e.name}</div>
                          <div className="text-[10px] text-slate-400">{e.category} • {e.currentHours}h compteur</div>
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">{e.brand} ({e.model})</td>
                        <td className="px-5 py-3.5 text-center font-semibold text-slate-800 font-mono">{e.power} kW</td>
                        <td className="px-5 py-3.5 text-right font-bold text-slate-900">{e.dailyRate} €</td>
                        <td className="px-5 py-3.5 text-slate-600 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            {e.location}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            e.status === 'Disponible' ? 'bg-emerald-100 text-emerald-800' :
                            e.status === 'En Mission' ? 'bg-indigo-100 text-indigo-800' :
                            e.status === 'En Maintenance' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800 font-semibold'
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button 
                            onClick={() => onSelectEngine(e.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Inspecter →
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                        Aucun engin ne correspond à vos critères de recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
