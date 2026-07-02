import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  Building2, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Proposal } from '../types';

interface ProposalsProps {
  proposals: Proposal[];
  activeRole: 'proprietaire' | 'locataire';
  onAcceptProposal: (id: string) => void;
  onDeclineProposal: (id: string) => void;
  onNavigate: (screen: string) => void;
}

export default function Proposals({ 
  proposals, 
  activeRole, 
  onAcceptProposal, 
  onDeclineProposal, 
  onNavigate 
}: ProposalsProps) {

  // Filter based on roles
  // If owner: show sent proposals (where Jean-Marc Mercier / Mercier Levage is bidder)
  // If renter: show received proposals (where they can approve or refuse)
  const sentProposals = proposals.filter(p => p.bidderName === 'Jean-Marc Mercier');
  const receivedProposals = proposals.filter(p => p.bidderName !== 'Jean-Marc Mercier');

  const activeProposals = activeRole === 'proprietaire' ? sentProposals : receivedProposals;

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-propositions">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-sans text-2xl font-black text-gray-950">Suivi des Propositions & Devis Commercial</h1>
        <p className="text-xs text-gray-500">
          {activeRole === 'proprietaire'
            ? "Consultez le statut des propositions commerciales que vous avez soumises en réponse aux appels d'offres publics."
            : "Consultez et validez les propositions tarifaires reçues de la part des propriétaires de matériel certifiés."
          }
        </p>
      </div>

      {activeProposals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center max-w-xl mx-auto space-y-4">
          <FileText className="h-10 w-10 text-gray-300 mx-auto" />
          <h3 className="text-sm font-bold text-gray-950">Aucune proposition active</h3>
          <p className="text-xs text-gray-400">
            {activeRole === 'proprietaire'
              ? "Vous n'avez pas encore soumis de proposition commerciale. Consultez les appels d'offres pour y répondre."
              : "Aucune proposition de propriétaire reçue pour le moment."
            }
          </p>
          <button
            onClick={() => onNavigate(activeRole === 'proprietaire' ? "Appels d'Offres - DEL-web" : "Demander des Engins - DEL-web")}
            className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-colors cursor-pointer"
          >
            {activeRole === 'proprietaire' ? "Voir les Appels d'Offres" : "Créer un Appel d'Offres"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {activeProposals.map((prop) => (
            <div key={prop.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
              {/* Header inside card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Sujet d'appel d'offres : {prop.tenderTitle}
                  </span>
                  <h3 className="font-sans text-sm font-extrabold text-gray-950 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    {prop.bidderCompany} (Proposé par {prop.bidderName})
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    prop.status === 'Accepté'
                      ? 'bg-emerald-50 text-emerald-700'
                      : prop.status === 'Refusé'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {prop.status === 'Accepté' && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {prop.status === 'Refusé' && <XCircle className="h-3.5 w-3.5" />}
                    {prop.status === 'En attente' && <Clock className="h-3.5 w-3.5 animate-spin-slow" />}
                    {prop.status}
                  </span>
                </div>
              </div>

              {/* Main content split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Engine Info */}
                <div className="lg:col-span-4 flex items-center gap-3">
                  <img 
                    src={prop.machineImage} 
                    alt={prop.machineName} 
                    className="h-16 w-20 rounded-xl object-cover bg-gray-150 shrink-0" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{prop.machineName}</h4>
                    <span className="text-[10px] font-semibold text-gray-400 mt-1 block">Réf machine : {prop.machineId}</span>
                  </div>
                </div>

                {/* Details list */}
                <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-600">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Prix d'offre proposé</p>
                    <p className="font-sans text-sm font-black text-amber-600 mt-0.5">{prop.priceOffered} € / jour</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Durée estimée</p>
                    <p className="font-sans text-sm font-black text-gray-900 mt-0.5">{prop.duration} jours</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Date de démarrage</p>
                    <p className="font-sans text-sm font-black text-gray-900 mt-0.5">{prop.startDate}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-xs text-gray-600 leading-relaxed">
                <span className="font-bold block text-[10px] text-gray-400 uppercase mb-1">Détails de la proposition technique</span>
                "{prop.description}"
              </div>

              {/* Footer Actions if received and pending */}
              {activeRole === 'locataire' && prop.status === 'En attente' && (
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => onDeclineProposal(prop.id)}
                    className="rounded-lg border border-gray-200 hover:bg-rose-50 hover:text-rose-700 px-4 py-2 text-xs font-bold text-gray-700 transition-colors"
                  >
                    Décliner l'offre
                  </button>
                  <button
                    onClick={() => onAcceptProposal(prop.id)}
                    className="rounded-lg bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-gray-950 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Accepter & Lancer le Contrat
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
