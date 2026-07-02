import React, { useState } from 'react';
import { Mission, Maintenance, Engine, Technician } from '../types';
import { 
  Plus, 
  Search, 
  Wrench, 
  Activity, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Percent, 
  PlusCircle, 
  Flame 
} from 'lucide-react';

interface OperationsViewProps {
  missions: Mission[];
  maintenances: Maintenance[];
  engines: Engine[];
  technicians: Technician[];
  onAddMission: (mission: Omit<Mission, 'id' | 'code' | 'progress'>) => void;
  onUpdateMissionProgress: (id: string, progress: number) => void;
  onAddMaintenance: (maintenance: Omit<Maintenance, 'id' | 'code'>) => void;
  onCompleteMaintenance: (id: string) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  missions,
  maintenances,
  engines,
  technicians,
  onAddMission,
  onUpdateMissionProgress,
  onAddMaintenance,
  onCompleteMaintenance
}) => {
  const [activeTab, setActiveTab] = useState<'missions' | 'maintenance'>('missions');
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [missionForm, setMissionForm] = useState({
    contractId: 'ctr-401',
    contractCode: 'CTR-401',
    technicianId: 'tech-1',
    engineId: 'eng-1',
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [maintForm, setMaintForm] = useState({
    engineId: 'eng-1',
    technicianId: 'tech-1',
    type: 'Préventive' as Maintenance['type'],
    title: '',
    description: '',
    scheduledDate: '',
    cost: 450
  });

  const handleMissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tech = technicians.find(t => t.id === missionForm.technicianId);
    const eng = engines.find(eg => eg.id === missionForm.engineId);
    onAddMission({
      contractId: missionForm.contractId,
      contractCode: missionForm.contractCode,
      technicianId: missionForm.technicianId,
      technicianName: tech ? tech.name : 'Non assigné',
      engineId: missionForm.engineId,
      engineName: eng ? eng.name : 'Inconnu',
      title: missionForm.title,
      description: missionForm.description,
      status: 'Planifiée',
      startDate: missionForm.startDate,
      endDate: missionForm.endDate
    });
    setShowAddForm(false);
  };

  const handleMaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tech = technicians.find(t => t.id === maintForm.technicianId);
    const eng = engines.find(eg => eg.id === maintForm.engineId);
    onAddMaintenance({
      engineId: maintForm.engineId,
      engineName: eng ? eng.name : 'Inconnu',
      technicianId: maintForm.technicianId,
      technicianName: tech ? tech.name : 'Non assigné',
      type: maintForm.type,
      title: maintForm.title,
      description: maintForm.description,
      status: 'Planifiée',
      scheduledDate: maintForm.scheduledDate,
      cost: maintForm.cost
    });
    setShowAddForm(false);
  };

  // Filter logic
  const filteredMissions = missions.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.engineName.toLowerCase().includes(search.toLowerCase()) ||
    (m.technicianName && m.technicianName.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredMaintenances = maintenances.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.engineName.toLowerCase().includes(search.toLowerCase()) ||
    m.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="operations-view" className="space-y-6">
      
      {/* Tab select & search header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
        <div className="flex gap-2">
          <button
            id="tab-missions"
            onClick={() => { setActiveTab('missions'); setSearch(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'missions' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Missions Opérateurs ({missions.length})
          </button>
          <button
            id="tab-maintenance"
            onClick={() => { setActiveTab('maintenance'); setSearch(''); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'maintenance' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Registre de Maintenance ({maintenances.length})
          </button>
        </div>

        <div className="w-full sm:w-72">
          <input
            id="operations-search-input"
            type="text"
            placeholder={activeTab === 'missions' ? "Rechercher une mission..." : "Rechercher une maintenance..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Main Operations Views */}
      {activeTab === 'missions' ? (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Suivi des missions terrain</h2>
              <p className="text-xs text-slate-500">Supervisez l'installation technique, les formations d'opérateurs et la restitution du matériel.</p>
            </div>
            
            <button
              id="btn-add-mission"
              onClick={() => setShowAddForm(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-sm flex items-center gap-1"
            >
              <Plus size={14} />
              Planifier une mission opérateur
            </button>
          </div>

          {/* Add Mission Form Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full overflow-hidden shadow-lg animate-in zoom-in-95 duration-150">
                <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center text-white">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-500">Planifier une mission</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">✕</button>
                </div>
                <form onSubmit={handleMissionSubmit} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 font-mono">Dossier de contrat associé</label>
                    <input
                      type="text"
                      required
                      value={missionForm.contractCode}
                      onChange={(e) => setMissionForm({...missionForm, contractCode: e.target.value})}
                      placeholder="ex: CTR-401"
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Technicien opérateur désigné</label>
                    <select
                      value={missionForm.technicianId}
                      onChange={(e) => setMissionForm({...missionForm, technicianId: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    >
                      {technicians.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Engin concerné</label>
                    <select
                      value={missionForm.engineId}
                      onChange={(e) => setMissionForm({...missionForm, engineId: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    >
                      {engines.map(eg => (
                        <option key={eg.id} value={eg.id}>{eg.code} - {eg.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Titre de l'intervention</label>
                    <input
                      type="text"
                      required
                      value={missionForm.title}
                      onChange={(e) => setMissionForm({...missionForm, title: e.target.value})}
                      placeholder="ex: Test alternateur ou Remplacement batterie"
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Instructions détaillées</label>
                    <textarea
                      rows={2}
                      value={missionForm.description}
                      onChange={(e) => setMissionForm({...missionForm, description: e.target.value})}
                      placeholder="Veuillez détailler les tâches techniques obligatoires..."
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date début</label>
                      <input
                        type="date"
                        required
                        value={missionForm.startDate}
                        onChange={(e) => setMissionForm({...missionForm, startDate: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Date fin</label>
                      <input
                        type="date"
                        required
                        value={missionForm.endDate}
                        onChange={(e) => setMissionForm({...missionForm, endDate: e.target.value})}
                        className="w-full p-2 border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button type="button" onClick={() => setShowAddForm(false)} className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md font-bold cursor-pointer">Annuler</button>
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-md font-bold cursor-pointer">Planifier</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Missions List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMissions.map(mis => (
              <div key={mis.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="bg-slate-950 text-amber-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                      {mis.code}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      mis.status === 'Planifiée' ? 'bg-slate-100 text-slate-600' :
                      mis.status === 'En Cours' ? 'bg-amber-100 text-amber-800' :
                      mis.status === 'Terminée' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {mis.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{mis.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2">{mis.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                    <div className="text-slate-600">
                      <span className="text-slate-400 block text-[9px] font-mono">Opérateur désigné :</span>
                      <span className="font-semibold flex items-center gap-1 mt-0.5 text-slate-800">
                        <User size={12} className="text-indigo-500" />
                        {mis.technicianName || 'Non désigné'}
                      </span>
                    </div>

                    <div className="text-slate-600 font-mono">
                      <span className="text-slate-400 block text-[9px]">Période de mission :</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{mis.startDate} au {mis.endDate}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar controller */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Avancement terrain :</span>
                    <span className="font-bold text-indigo-950">{mis.progress}%</span>
                  </div>
                  
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all" style={{ width: `${mis.progress}%` }} />
                  </div>

                  {mis.status !== 'Terminée' && (
                    <div className="flex justify-end gap-1 pt-1.5">
                      <button
                        onClick={() => onUpdateMissionProgress(mis.id, Math.min(mis.progress + 20, 100))}
                        className="text-[10px] font-bold border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-amber-950 px-2.5 py-1 rounded cursor-pointer"
                      >
                        Incrémenter +20%
                      </button>
                      {mis.progress === 100 && (
                        <button
                          onClick={() => {
                            onUpdateMissionProgress(mis.id, 100);
                            alert(`La mission ${mis.code} est clôturée avec succès.`);
                          }}
                          className="text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2.5 py-1 rounded cursor-pointer"
                        >
                          Clôturer ✓
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Screen 12: Maintenance log layout
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registre des travaux de maintenance</h2>
              <p className="text-xs text-slate-500">Ordonnancez les révisions périodiques d'engins, gérez les flexible hydrauliques ou alternateurs défectueux.</p>
            </div>
            
            <button
              id="btn-add-maintenance"
              onClick={() => setShowAddForm(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-2 rounded text-xs cursor-pointer shadow-sm flex items-center gap-1"
            >
              <PlusCircle size={14} />
              Déclarer un bon de maintenance
            </button>
          </div>

          {/* Add Maintenance form modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full overflow-hidden shadow-lg animate-in zoom-in-95 duration-150">
                <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex justify-between items-center text-white">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-amber-500">Nouveau Bon de maintenance</h3>
                  <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white font-bold cursor-pointer text-sm">✕</button>
                </div>
                <form onSubmit={handleMaintSubmit} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Matériel d'exploitation concerné *</label>
                    <select
                      value={maintForm.engineId}
                      onChange={(e) => setMaintForm({...maintForm, engineId: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900 font-mono"
                    >
                      {engines.map(e => (
                        <option key={e.id} value={e.id}>{e.code} - {e.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Technicien inspecteur désigné *</label>
                    <select
                      value={maintForm.technicianId}
                      onChange={(e) => setMaintForm({...maintForm, technicianId: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    >
                      {technicians.map(t => (
                        <option key={t.id} value={t.id}>{t.name} ({t.specialty})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gravité / Type *</label>
                    <select
                      value={maintForm.type}
                      onChange={(e) => setMaintForm({...maintForm, type: e.target.value as Maintenance['type']})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    >
                      <option value="Préventive">Préventive (Vérifications périodiques)</option>
                      <option value="Corrective">Corrective (Réparation mineure)</option>
                      <option value="Urgente">Urgente (Panne critique / Immobilisation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Intitulé du problème / de l'intervention *</label>
                    <input
                      type="text"
                      required
                      value={maintForm.title}
                      onChange={(e) => setMaintForm({...maintForm, title: e.target.value})}
                      placeholder="ex: Diagnostic de fuite ou Changement de courroie"
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date planifiée *</label>
                    <input
                      type="date"
                      required
                      value={maintForm.scheduledDate}
                      onChange={(e) => setMaintForm({...maintForm, scheduledDate: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Coût estimatif des fournitures (€ HT)</label>
                    <input
                      type="number"
                      value={maintForm.cost}
                      onChange={(e) => setMaintForm({...maintForm, cost: Number(e.target.value)})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Description technique</label>
                    <textarea
                      rows={2}
                      value={maintForm.description}
                      onChange={(e) => setMaintForm({...maintForm, description: e.target.value})}
                      className="w-full p-2 border border-slate-200 rounded text-slate-900"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button type="button" onClick={() => setShowAddForm(false)} className="border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-md font-bold cursor-pointer">Annuler</button>
                    <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-4 py-2 rounded-md font-bold cursor-pointer">Déclarer</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Maintenance Table log */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3.5 font-mono">Code Intervention</th>
                    <th className="px-5 py-3.5">Engin d'exploitation</th>
                    <th className="px-5 py-3.5">Type de panne / Niveau</th>
                    <th className="px-5 py-3.5">Intitulé des travaux</th>
                    <th className="px-5 py-3.5">Technicien inspecteur</th>
                    <th className="px-5 py-3.5 font-mono">Date programmée</th>
                    <th className="px-5 py-3.5 text-right font-mono">Coût (€ HT)</th>
                    <th className="px-5 py-3.5">État</th>
                    <th className="px-5 py-3.5 text-center">Contrôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredMaintenances.map(maint => (
                    <tr key={maint.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-600">{maint.code}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900 font-sans">{maint.engineName}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono inline-flex items-center gap-1 ${
                          maint.type === 'Préventive' ? 'bg-sky-100 text-sky-800' :
                          maint.type === 'Corrective' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800 font-semibold'
                        }`}>
                          {maint.type === 'Urgente' && <Flame size={10} className="text-rose-600" />}
                          {maint.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-800">{maint.title}</div>
                        {maint.description && <div className="text-[10px] text-slate-400 font-sans">{maint.description}</div>}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{maint.technicianName}</td>
                      <td className="px-5 py-3.5 text-slate-600 font-mono">{maint.scheduledDate}</td>
                      <td className="px-5 py-3.5 text-right font-bold text-slate-900 font-mono">{maint.cost.toLocaleString('fr-FR')} €</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          maint.status === 'Planifiée' ? 'bg-slate-100 text-slate-600' :
                          maint.status === 'En Cours' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {maint.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-center font-sans">
                        {maint.status !== 'Terminée' ? (
                          <button
                            onClick={() => {
                              onCompleteMaintenance(maint.id);
                              alert(`Le bon d'intervention ${maint.code} a été marqué comme TERMINÉ. L'engin associé a été réactivé en statut "Disponible".`);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-1.5 rounded text-[10px] cursor-pointer"
                          >
                            Clôturer bon ✓
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px] font-medium font-mono">Fermé le {maint.completedDate || '02/07/2026'}</span>
                        )}
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
