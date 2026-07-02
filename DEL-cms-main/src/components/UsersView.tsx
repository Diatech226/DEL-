import React, { useState } from 'react';
import { Proprietor, Company, Technician } from '../types';
import { 
  Building2, 
  User, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  DollarSign, 
  Wrench, 
  Sliders, 
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface UsersViewProps {
  proprietors: Proprietor[];
  companies: Company[];
  technicians: Technician[];
  onUpdateProprietorCommission: (id: string, rate: number) => void;
  onUpdateTechnicianStatus: (id: string, status: Technician['status']) => void;
}

export const UsersView: React.FC<UsersViewProps> = ({
  proprietors,
  companies,
  technicians,
  onUpdateProprietorCommission,
  onUpdateTechnicianStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'proprietors' | 'companies' | 'technicians'>('proprietors');
  const [search, setSearch] = useState('');

  // Filtering
  const filteredProprietors = proprietors.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTechnicians = technicians.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || t.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div id="users-view" className="space-y-6">
      
      {/* Selector and Search Row */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 text-white">
        <div className="flex flex-wrap gap-2">
          <button
            id="subtab-proprietors"
            onClick={() => { setActiveSubTab('proprietors'); setSearch(''); }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'proprietors' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Propriétaires Partenaires ({proprietors.length})
          </button>
          <button
            id="subtab-companies"
            onClick={() => { setActiveSubTab('companies'); setSearch(''); }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'companies' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Entreprises Locataires ({companies.length})
          </button>
          <button
            id="subtab-technicians"
            onClick={() => { setActiveSubTab('technicians'); setSearch(''); }}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'technicians' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Techniciens de Terrain ({technicians.length})
          </button>
        </div>

        <div className="w-full md:w-64">
          <input
            id="users-search-input"
            type="text"
            placeholder="Rechercher par nom, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>
      </div>

      {/* Screen 14: Propriétaires List */}
      {activeSubTab === 'proprietors' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registre des Propriétaires de machines</h2>
            <p className="text-xs text-slate-500">Supervisez les taux de commission de plateforme appliqués aux bailleurs partenaires et suivez les décomptes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProprietors.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        {p.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{p.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{p.type === 'Entreprise' ? 'Société de gestion' : 'Particulier'}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">Taux Commission :</span>
                      <span className="text-sm font-bold text-indigo-700">{p.commissionRate} %</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                    <p className="flex items-center gap-2">
                      <Mail size={12} className="text-slate-400" />
                      {p.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-400" />
                      {p.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Engins dans le parc :</span>
                    <span className="font-bold text-slate-800">{p.enginesCount} machines</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Revenus générés reversés :</span>
                    <span className="font-bold text-slate-950 font-mono">{p.paidAmount.toLocaleString('fr-FR')} €</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      const newRate = prompt(`Modifier la commission plateforme pour ${p.name} (%) :`, p.commissionRate.toString());
                      if (newRate !== null && !isNaN(Number(newRate))) {
                        onUpdateProprietorCommission(p.id, Number(newRate));
                      }
                    }}
                    className="text-xs border border-slate-300 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-amber-950 font-bold px-3 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sliders size={12} />
                    Ajuster Commission
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen 15: Entreprises (Clients) List */}
      {activeSubTab === 'companies' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registre des Entreprises Locataires</h2>
            <p className="text-xs text-slate-500">Consultez les grands comptes partenaires du BTP, leurs dépenses totales cumulées et le volume de contrats actifs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompanies.map(c => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                      {c.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{c.name}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                      <MapPin size={12} />
                      {c.address}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5">
                    <p className="font-bold text-slate-800">Contact d'exploitation :</p>
                    <p className="text-slate-600 font-mono">Nom : {c.contactName}</p>
                    <p className="text-slate-600 font-mono">Email : {c.email}</p>
                    <p className="text-slate-600 font-mono">Tél : {c.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Contrats d'exploitation actifs :</span>
                    <span className="font-bold text-indigo-700">{c.activeContractsCount} contrats</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Volume d'affaires dépensé :</span>
                    <span className="font-bold text-slate-950 font-mono">{c.totalSpent.toLocaleString('fr-FR')} €</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screen 16: Techniciens / Opérateurs List */}
      {activeSubTab === 'technicians' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Registre des Techniciens Habilités</h2>
            <p className="text-xs text-slate-500">Pilotez la disponibilité des techniciens certificateurs habilités DEL et consultez leurs agréments.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTechnicians.map(t => (
              <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        {t.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{t.name}</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{t.specialty}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        t.status === 'Disponible' ? 'bg-emerald-100 text-emerald-800' :
                        t.status === 'En Mission' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>

                      <div className="flex items-center gap-0.5 text-amber-500">
                        <Star size={12} className="fill-amber-500" />
                        <span className="text-xs font-bold text-slate-700">{t.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50/50 p-2.5 rounded border border-indigo-100 text-xs flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-500">Code Habilitation VGP :</span>
                    <span className="font-mono font-bold text-indigo-800 flex items-center gap-1">
                      <ShieldCheck size={14} className="text-indigo-600" />
                      {t.certificationCode}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 font-mono">
                    <p className="flex items-center gap-2">
                      <Mail size={12} className="text-slate-400" />
                      {t.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone size={12} className="text-slate-400" />
                      {t.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
                  <span className="text-slate-400 self-center font-mono text-[10px]">Changer statut d'activité :</span>
                  <select
                    value={t.status}
                    onChange={(e) => onUpdateTechnicianStatus(t.id, e.target.value as Technician['status'])}
                    className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En Mission">En Mission</option>
                    <option value="En Congé">En Congé</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
