import React, { useCallback, useEffect, useState } from 'react';
import { Building2, CheckCircle2, Clock, FileText, Layers, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, unwrapData } from '../lib/http';
import { acceptCompanyProposal, acceptOwnerProposal, getMyProposals, rejectCompanyProposal, rejectOwnerProposal } from '../services/proposal.service';
import { mapApiProposalListToDesign } from '../mappers/proposal.mapper';
import { getStatusLabel, getStatusVariant } from '../constants/status';

interface ProposalsProps { onNavigate: (screen: string) => void; proposals?: any[]; activeRole?: 'proprietaire' | 'locataire'; onAcceptProposal?: (id: string) => void; onDeclineProposal?: (id: string) => void; }

const badgeClass = (status?: string) => {
  const variant = getStatusVariant(status);
  if (variant === 'success') return 'bg-emerald-50 text-emerald-700';
  if (variant === 'danger') return 'bg-rose-50 text-rose-700';
  if (variant === 'warning') return 'bg-amber-50 text-amber-700';
  return 'bg-gray-100 text-gray-600';
};
const isPending = (decision: any) => String(decision?.status || decision || '').toUpperCase() === 'PENDING';

export default function Proposals({ onNavigate }: ProposalsProps) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true); setError(null);
    try { setItems(mapApiProposalListToDesign(unwrapData(await getMyProposals()))); }
    catch (e) { setError(getErrorMessage(e)); }
    finally { setLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { void load(); }, [load]);

  const currentOwnerDecision = (proposal: any) => {
    const uid = String(user?._id || user?.id || '');
    return proposal.ownerDecisions?.find((d: any) => [d?.ownerId, d?.userId, d?._id, d?.id].map(String).includes(uid)) || proposal.ownerDecisions?.find(isPending);
  };

  const decide = async (proposal: any, accepted: boolean) => {
    const role = String(user?.role || '').toUpperCase();
    const reason = accepted ? undefined : window.prompt('Motif du refus de la proposition :');
    if (!accepted && !reason) return;
    setActingId(proposal.id); setError(null); setSuccess(null);
    try {
      if (role === 'COMPANY') accepted ? await acceptCompanyProposal(proposal.id) : await rejectCompanyProposal(proposal.id, reason || 'Refusé');
      else if (role === 'OWNER') accepted ? await acceptOwnerProposal(proposal.id) : await rejectOwnerProposal(proposal.id, reason || 'Refusé');
      setSuccess(accepted ? 'Proposition acceptée.' : 'Proposition refusée.');
      await load();
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setActingId(null); }
  };

  const role = String(user?.role || '').toUpperCase();

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-propositions">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-sans text-2xl font-black text-gray-950">Suivi des Propositions & Devis Commercial</h1>
        <p className="text-xs text-gray-500">Propositions utilisateur chargées depuis DEL-api, avec décisions entreprise/propriétaire.</p>
      </div>
      {success && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{success}</div>}
      {error && <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>}
      {loading ? <div className="rounded-2xl bg-white p-8 text-sm font-semibold text-gray-500">Chargement des propositions…</div> : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center max-w-xl mx-auto space-y-4">
          <FileText className="h-10 w-10 text-gray-300 mx-auto" /><h3 className="text-sm font-bold text-gray-950">Aucune proposition active</h3>
          <p className="text-xs text-gray-400">Aucune proposition liée à votre compte pour le moment.</p>
          <button onClick={() => onNavigate(role === 'OWNER' ? "Appels d'Offres - DEL-web" : 'Demander des Engins - DEL-web')} className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-gray-950 hover:bg-amber-400">Retour aux demandes</button>
        </div>
      ) : <div className="space-y-4">{items.map((prop) => {
        const ownerDecision = currentOwnerDecision(prop);
        const canCompanyDecide = role === 'COMPANY' && isPending(prop.companyDecision);
        const canOwnerDecide = role === 'OWNER' && isPending(ownerDecision);
        return <div key={prop.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div className="space-y-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Réf. demande : {prop.requestId || prop.tenderId || '—'}</span><h3 className="font-sans text-sm font-extrabold text-gray-950 flex items-center gap-2"><Building2 className="h-4 w-4 text-gray-400" />{prop.title} — {prop.companyName}</h3></div>
            <div className="flex flex-wrap items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${badgeClass(prop.status)}`}><CheckCircle2 className="h-3.5 w-3.5" />{getStatusLabel(prop.status)}</span><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${badgeClass(prop.workflowStatus)}`}><Clock className="h-3.5 w-3.5" />{getStatusLabel(prop.workflowStatus)}</span></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"><div className="lg:col-span-4 flex items-center gap-3"><Layers className="h-10 w-10 text-amber-500" /><div><h4 className="text-xs font-bold text-gray-900">Engins : {prop.equipmentIds.join(', ') || '—'}</h4><span className="text-[10px] font-semibold text-gray-400 mt-1 block">Propriétaires : {prop.ownerNames.join(', ') || '—'}</span></div></div><div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-600"><div><p className="text-[10px] text-gray-400 uppercase font-bold">Prix final</p><p className="font-sans text-sm font-black text-amber-600 mt-0.5">{prop.finalPrice.toLocaleString('fr-FR')} {prop.currency}</p></div><div><p className="text-[10px] text-gray-400 uppercase font-bold">Durée</p><p className="font-sans text-sm font-black text-gray-900 mt-0.5">{prop.durationMonths || '—'} mois</p></div><div><p className="text-[10px] text-gray-400 uppercase font-bold">Créée le</p><p className="font-sans text-sm font-black text-gray-900 mt-0.5">{prop.createdAt ? new Date(prop.createdAt).toLocaleDateString('fr-FR') : '—'}</p></div></div></div>
          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-xs text-gray-600 leading-relaxed"><span className="font-bold block text-[10px] text-gray-400 uppercase mb-1">Conditions</span>{prop.conditions || 'Aucune condition renseignée.'}<div className="mt-3 grid gap-1"><span>Décision entreprise : {getStatusLabel(prop.companyDecision?.status || prop.companyDecision)}</span><span>Décisions propriétaires : {prop.ownerDecisions?.length ? prop.ownerDecisions.map((d:any) => `${d.ownerName || d.ownerId || 'Propriétaire'} (${getStatusLabel(d.status)})`).join(', ') : '—'}</span></div></div>
          {(canCompanyDecide || canOwnerDecide) && <div className="flex justify-end gap-3 pt-3 border-t border-gray-100"><button disabled={actingId === prop.id} onClick={() => decide(prop, false)} className="rounded-lg border border-gray-200 hover:bg-rose-50 hover:text-rose-700 px-4 py-2 text-xs font-bold text-gray-700"><XCircle className="inline h-4 w-4 mr-1" />Refuser</button><button disabled={actingId === prop.id} onClick={() => decide(prop, true)} className="rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-gray-950"><CheckCircle2 className="inline h-4 w-4 mr-1" />Accepter</button></div>}
        </div>})}</div>}
    </div>
  );
}
