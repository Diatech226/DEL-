import React, { useState } from 'react';
import { 
  Wrench, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  User,
  Activity,
  UserCheck,
  FileSpreadsheet
} from 'lucide-react';
import { MaintenanceLog, Machine } from '../types';

interface ListeMaintenanceProps {
  logs: MaintenanceLog[];
  machines: Machine[];
  onCompleteLog: (id: string) => void;
  onAddLog: (newLog: any) => void;
  onNavigate: (screen: string) => void;
}

export default function ListeMaintenance({ logs, machines, onCompleteLog, onAddLog, onNavigate }: ListeMaintenanceProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('Tous');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new maintenance
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [maintType, setMaintType] = useState('Préventif');
  const [maintDate, setMaintDate] = useState('2026-07-05');
  const [maintCost, setMaintCost] = useState('350');
  const [maintTech, setMaintTech] = useState('');
  const [maintDesc, setMaintDesc] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.machineName.toLowerCase().includes(search.toLowerCase()) || 
                          log.machineModel.toLowerCase().includes(search.toLowerCase()) ||
                          log.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'Tous' || log.type === filterType;
    const matchesStatus = filterStatus === 'Tous' || log.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const machine = machines.find(m => m.id === selectedMachineId);
    if (!machine) return;

    const newLog: MaintenanceLog = {
      id: `maint-${Date.now()}`,
      machineId: machine.id,
      machineName: machine.brand,
      machineModel: machine.model,
      type: maintType as any,
      date: maintDate,
      cost: Number(maintCost),
      technician: maintTech || 'Atelier Mercier',
      description: maintDesc,
      status: 'Planifié'
    };

    onAddLog(newLog);
    setShowAddModal(false);
    // Reset form
    setMaintTech('');
    setMaintDesc('');
  };

  const handleExportCSV = () => {
    // Generate CSV columns headers
    const headers = ["ID", "Machine", "Modèle", "Type d'intervention", "Date", "Coût (€)", "Technicien / Organisme", "Description", "Statut"];
    
    // Format rows
    const rows = logs.map(log => [
      log.id,
      log.machineName,
      log.machineModel,
      log.type,
      log.date,
      log.cost.toString(),
      log.technician,
      log.description,
      log.status
    ]);

    // Construct CSV content safely escaping quotes and using standard double quotes around fields
    const csvRows = [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(val => `"${val.replace(/"/g, '""')}"`).join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `historique_maintenance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-liste-maintenance">
      {/* Upper header with stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-black text-gray-950">Liste Détaillée de Maintenance</h1>
          <p className="text-xs text-gray-500">Planifiez, affectez et validez les opérations d'entretien régulières et de sécurité obligatoire (VGP).</p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-100 hover:text-emerald-900 transition-all cursor-pointer"
            title="Exporter l'historique complet au format CSV"
            id="btn-export-maintenance-csv"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Exporter CSV
          </button>
          <button
            onClick={() => onNavigate('Calendrier de Maintenance Global - DEL-web')}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
          >
            <Calendar className="h-4 w-4 text-amber-500" />
            Calendar View
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-gray-950 shadow-md hover:bg-amber-400 transition-all cursor-pointer"
            id="btn-trigger-add-maintenance"
          >
            <Plus className="h-4 w-4" />
            Nouvelle Opération
          </button>
        </div>
      </div>

      {/* Statistics board */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="rounded-xl bg-rose-50 p-2.5 text-rose-600 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase">En attente / En cours</h4>
            <p className="font-sans text-lg font-extrabold text-gray-950">
              {logs.filter(l => l.status !== 'Terminé').length} tâches
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 shrink-0">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase">VGP Prochaines</h4>
            <p className="font-sans text-lg font-extrabold text-gray-950">
              {logs.filter(l => l.type === 'VGP Réglementaire' && l.status !== 'Terminé').length} inspections
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase">Opérations Clôturées</h4>
            <p className="font-sans text-lg font-extrabold text-gray-950">
              {logs.filter(l => l.status === 'Terminé').length} validées
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par machine, marque ou description..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Type Selector */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 px-2 uppercase">Type:</span>
            {['Tous', 'Préventif', 'Curatif', 'VGP Réglementaire'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all ${
                  filterType === t ? 'bg-amber-500 text-gray-950' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Status Selector */}
          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <span className="text-[10px] font-bold text-gray-400 px-2 uppercase">Statut:</span>
            {['Tous', 'Planifié', 'En cours', 'Terminé'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition-all ${
                  filterStatus === s ? 'bg-amber-500 text-gray-950' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table & List Cards */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredLogs.map((log) => {
            return (
              <div key={log.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      log.type === 'VGP Réglementaire'
                        ? 'bg-indigo-50 text-indigo-700'
                        : log.type === 'Curatif'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {log.machineName} {log.machineModel}
                    </span>
                    <span className="text-gray-300 text-xs">|</span>
                    <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {log.date}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                    {log.description}
                  </p>

                  {log.partsReplaced && log.partsReplaced.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[9px] font-bold text-gray-400 uppercase">Pièces :</span>
                      {log.partsReplaced.map((part, idx) => (
                        <span key={idx} className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-600">
                          {part}
                        </span>
                      ))}
                    </div>
                  )}

                  {log.remarks && (
                    <p className="text-[11px] text-amber-700 italic bg-amber-50/40 p-2 rounded-lg border border-amber-500/10 max-w-3xl">
                      Note : {log.remarks}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold text-gray-900">{log.cost.toLocaleString('fr-FR')} €</p>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                      <User className="h-3 w-3 shrink-0 text-gray-400" />
                      {log.technician}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                      log.status === 'Terminé'
                        ? 'bg-emerald-50 text-emerald-700'
                        : log.status === 'En cours'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {log.status === 'Terminé' && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                      {log.status === 'En cours' && <Clock className="h-3 w-3 text-amber-500" />}
                      {log.status}
                    </span>

                    {/* Quick validation button if pending */}
                    {log.status !== 'Terminé' && (
                      <button
                        onClick={() => onCompleteLog(log.id)}
                        className="rounded-lg bg-amber-100 p-2 text-amber-800 hover:bg-amber-500 hover:text-gray-950 transition-colors cursor-pointer"
                        title="Marquer comme validée / terminée"
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Maintenance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-sans text-base font-extrabold text-gray-900 border-b border-gray-100 pb-3 mb-4">
              Planifier une nouvelle intervention
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Sélectionner l'engin de chantier</label>
                <select
                  value={selectedMachineId}
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                >
                  <option value="">-- Choisissez une machine --</option>
                  {machines.filter(m => m.ownerId === 'usr-4122').map(m => (
                    <option key={m.id} value={m.id}>{m.brand} {m.model} ({m.type})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type d'intervention</label>
                  <select
                    value={maintType}
                    onChange={(e) => setMaintType(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Préventif">Préventif / Vidange</option>
                    <option value="Curatif">Curatif / Réparation</option>
                    <option value="VGP Réglementaire">VGP Règlementaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date planifiée</label>
                  <input
                    type="date"
                    value={maintDate}
                    onChange={(e) => setMaintDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Coût estimatif (€)</label>
                  <input
                    type="number"
                    value={maintCost}
                    onChange={(e) => setMaintCost(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Organisme ou Technicien</label>
                  <input
                    type="text"
                    value={maintTech}
                    onChange={(e) => setMaintTech(e.target.value)}
                    placeholder="Apave, Socotec, Franck..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description détaillée de l'opération</label>
                <textarea
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  placeholder="Quelles sont les vérifications ou réparations prévues ?"
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-gray-950 hover:bg-amber-400 cursor-pointer"
                >
                  Enregistrer l'opération
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
