import React, { useState } from 'react';
import { 
  FileCheck2, 
  Download, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Lock, 
  PenTool,
  ArrowUpRight,
  FileJson
} from 'lucide-react';
import { Contract } from '../types';

interface GestionContratsProps {
  contracts: Contract[];
  onSignContract: (id: string) => void;
  onNavigate: (screen: string) => void;
}

export default function GestionContrats({ contracts, onSignContract, onNavigate }: GestionContratsProps) {
  const [activeFilter, setActiveFilter] = useState('Tous');

  const filteredContracts = contracts.filter(c => {
    if (activeFilter === 'Tous') return true;
    return c.status === activeFilter;
  });

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(contracts, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `contrats_location_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-gestion-contrats">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-black text-gray-950">Gestion des Contrats de Location B2B</h1>
          <p className="text-xs text-gray-500">Signez numériquement vos contrats de location d'engins, gérez les garanties bris de machine, et pilotez la facturation récurrente.</p>
        </div>
        <div className="flex items-center shrink-0">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-800 shadow-sm hover:bg-amber-100 hover:text-amber-900 transition-all cursor-pointer"
            title="Exporter l'ensemble des contrats au format JSON"
            id="btn-export-contracts-json"
          >
            <FileJson className="h-4 w-4 text-amber-600" />
            Exporter JSON
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-xl p-1.5 shadow-sm self-start max-w-md">
        {['Tous', 'Actif', 'En attente de signature'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilter === status ? 'bg-amber-500 text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Contract list */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => {
          return (
            <div key={contract.id} className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm space-y-4 hover:border-amber-300 transition-all">
              {/* Header section inside card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Identifiant Contrat : {contract.id}</span>
                  <h3 className="font-sans text-sm font-black text-gray-950 flex items-center gap-2">
                    <FileCheck2 className="h-4.5 w-4.5 text-amber-500" />
                    {contract.machineName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                    contract.status === 'Actif'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {contract.status === 'Actif' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                    {contract.status}
                  </span>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                
                {/* Visual image */}
                <div className="lg:col-span-3">
                  <img 
                    src={contract.machineImage} 
                    alt={contract.machineName} 
                    className="h-28 w-full rounded-xl object-cover bg-gray-100 border border-gray-200" 
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details list */}
                <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-gray-600">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Entreprise Locataire</p>
                    <p className="font-sans text-xs font-black text-gray-950 mt-1">{contract.clientCompany}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Rep : {contract.clientName}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Période d'Engagement</p>
                    <p className="font-sans text-xs font-black text-gray-950 mt-1 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" /> {contract.startDate} au {contract.endDate}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-0.5">
                      <Lock className="h-3 w-3 text-emerald-500" /> Caution de Garantie
                    </p>
                    <p className="font-sans text-xs font-black text-emerald-700 mt-1">{contract.deposit.toLocaleString('fr-FR')} €</p>
                    <span className="text-[9px] text-gray-400 block mt-0.5">Séquestré via DEL-web</span>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Couverture d'Assurance</p>
                    <p className="font-sans text-xs font-bold text-gray-800 mt-1 truncate max-w-[150px]">{contract.insuranceOption}</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Facturation Globale</p>
                    <p className="font-sans text-sm font-black text-amber-600 mt-0.5">{contract.totalPrice.toLocaleString('fr-FR')} € HT</p>
                  </div>
                </div>

                {/* Signing Actions */}
                <div className="lg:col-span-3 flex flex-col gap-2 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100">
                  {contract.status === 'En attente de signature' ? (
                    <button
                      onClick={() => {
                        onSignContract(contract.id);
                        alert('Signature électronique sécurisée validée. Le contrat est désormais actif.');
                      }}
                      className="w-full rounded-xl bg-amber-500 hover:bg-amber-400 py-3 text-xs font-bold text-gray-950 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      <PenTool className="h-4 w-4" /> Signer numériquement
                    </button>
                  ) : (
                    <button
                      onClick={() => alert('Téléchargement du contrat PDF signé.')}
                      className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Download className="h-4 w-4" /> Télécharger PDF
                    </button>
                  )}

                  <button 
                    onClick={() => onNavigate('Factures - DEL-web')}
                    className="w-full rounded-xl bg-gray-50 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors text-center"
                  >
                    Consulter les Échéances
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
