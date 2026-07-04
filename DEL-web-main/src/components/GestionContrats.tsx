import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Download, FileCheck2, FileJson } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, unwrapData } from '../lib/http';
import { getMyContracts } from '../services/contract.service';
import { downloadContractPdf } from '../services/report.service';
import { mapApiContractListToDesign } from '../mappers/contract.mapper';
import { getStatusLabel, getStatusVariant } from '../constants/status';

interface GestionContratsProps { contracts?: any[]; onSignContract?: (id: string) => void; onNavigate: (screen: string) => void; }
const badgeClass = (status?: string) => getStatusVariant(status) === 'success' ? 'bg-emerald-50 text-emerald-700' : getStatusVariant(status) === 'danger' ? 'bg-rose-50 text-rose-700' : getStatusVariant(status) === 'warning' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600';

export default function GestionContrats({ onNavigate }: GestionContratsProps) {
  const { isAuthenticated } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [contracts, setContracts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true); setError(null);
    try { setContracts(mapApiContractListToDesign(unwrapData(await getMyContracts()))); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }, [isAuthenticated]);
  useEffect(() => { void load(); }, [load]);

  const filteredContracts = contracts.filter(c => activeFilter === 'Tous' || getStatusLabel(c.status) === activeFilter || c.status === activeFilter);
  const handleExportJSON = () => { const blob = new Blob([JSON.stringify(contracts, null, 2)], { type: 'application/json;charset=utf-8;' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `contrats_location_${new Date().toISOString().split('T')[0]}.json`; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); };
  const handlePdf = async (contract: any) => { try { setError(null); await downloadContractPdf(contract.id); } catch (e) { setError(e instanceof Error ? e.message : 'Impossible de télécharger le rapport.'); } };

  return <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-gestion-contrats">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5"><div><h1 className="font-sans text-2xl font-black text-gray-950">Gestion des Contrats de Location B2B</h1><p className="text-xs text-gray-500">Contrats utilisateur chargés depuis DEL-api. Signature électronique à venir.</p></div><button onClick={handleExportJSON} className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800"><FileJson className="h-4 w-4 text-amber-600" />Exporter JSON</button></div>
    {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
    <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl p-1.5 shadow-sm self-start max-w-md">{['Tous','Actif','En attente signature','Brouillon','Terminé'].map(status => <button key={status} onClick={() => setActiveFilter(status)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${activeFilter === status ? 'bg-amber-500 text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>{status}</button>)}</div>
    {loading ? <div className="rounded-2xl bg-white p-8 text-sm font-semibold text-gray-500">Chargement des contrats…</div> : filteredContracts.length === 0 ? <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center text-sm font-semibold text-gray-500">Aucun contrat utilisateur à afficher.</div> : <div className="space-y-4">{filteredContracts.map(contract => <div key={contract.id} className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-4 hover:border-amber-300 transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4"><div className="space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Numéro contrat : {contract.contractNumber}</span><h3 className="font-sans text-sm font-black text-gray-950 flex items-center gap-2"><FileCheck2 className="h-4.5 w-4.5 text-amber-500" />{contract.title}</h3></div><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${badgeClass(contract.status)}`}>{getStatusVariant(contract.status) === 'success' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}{getStatusLabel(contract.status)}</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"><div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-600"><div><p className="text-[10px] text-gray-400 uppercase font-bold">Entreprise</p><p className="font-sans text-xs font-black text-gray-950 mt-1">{contract.companyName}</p></div><div><p className="text-[10px] text-gray-400 uppercase font-bold">Propriétaires</p><p className="font-sans text-xs font-black text-gray-950 mt-1">{contract.ownerNames.join(', ') || '—'}</p></div><div><p className="text-[10px] text-gray-400 uppercase font-bold">Période</p><p className="font-sans text-xs font-black text-gray-950 mt-1 flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-gray-400" />{contract.startDate || '—'} au {contract.endDate || '—'}</p></div><div><p className="text-[10px] text-gray-400 uppercase font-bold">Montant</p><p className="font-sans text-sm font-black text-amber-600 mt-0.5">{contract.amount.toLocaleString('fr-FR')} {contract.currency}</p></div></div><div className="lg:col-span-3 flex flex-col gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100"><button onClick={() => setSelected(contract)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Voir détail</button><button onClick={() => handlePdf(contract)} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1"><Download className="h-4 w-4" />Télécharger PDF</button><p className="rounded-xl bg-gray-50 py-2.5 text-center text-xs font-bold text-gray-500">Signature électronique à venir.</p></div></div>
    </div>)}</div>}
    {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4"><div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4"><div className="flex justify-between gap-4"><h2 className="font-sans text-lg font-black text-gray-950">Détail contrat {selected.contractNumber}</h2><button onClick={() => setSelected(null)} className="text-xs font-bold text-gray-500">Fermer</button></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600"><p><b>Titre :</b> {selected.title}</p><p><b>Statut :</b> {getStatusLabel(selected.status)}</p><p><b>Montant :</b> {selected.amount.toLocaleString('fr-FR')} {selected.currency}</p><p><b>Dates :</b> {selected.startDate || '—'} au {selected.endDate || '—'}</p><p><b>Conditions paiement :</b> {selected.paymentTerms || '—'}</p><p><b>Conditions :</b> {selected.conditions || '—'}</p><p><b>Propriétaires :</b> {selected.ownerNames.join(', ') || '—'}</p><p><b>Engins :</b> {selected.equipmentIds.join(', ') || '—'}</p></div><button onClick={() => handlePdf(selected)} className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-gray-950"><Download className="inline h-4 w-4 mr-1" />Télécharger PDF</button></div></div>}
  </div>;
}
