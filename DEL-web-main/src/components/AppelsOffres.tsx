import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  MapPin, 
  Calendar, 
  Coins, 
  ChevronRight, 
  ArrowUpRight,
  Sparkles,
  Filter,
  Plus
} from 'lucide-react';
import { Tender, Machine } from '../types';

interface AppelsOffresProps {
  tenders: Tender[];
  ownerMachines: Machine[];
  onSubmitBid: (newBid: any) => void;
  onNavigate: (screen: string) => void;
}

export default function AppelsOffres({ tenders, ownerMachines, onSubmitBid, onNavigate }: AppelsOffresProps) {
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Tous');
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  // Form states for bidding
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [bidPrice, setBidPrice] = useState('');
  const [bidDesc, setBidDesc] = useState('');

  const filteredTenders = tenders.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.machineType.toLowerCase().includes(search.toLowerCase()) ||
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesLoc = selectedLocation === 'Tous' || t.location.includes(selectedLocation);
    return matchesSearch && matchesLoc;
  });

  const handleOpenBid = (tender: Tender) => {
    setSelectedTender(tender);
    setBidPrice(String(tender.maxBudget - 50)); // default bid slightly lower than max budget
    setShowBidModal(true);
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTender || !selectedMachineId) return;

    const machine = ownerMachines.find(m => m.id === selectedMachineId);
    if (!machine) return;

    const newBid = {
      id: `prop-${Date.now()}`,
      tenderId: selectedTender.id,
      tenderTitle: selectedTender.title,
      machineId: machine.id,
      machineName: `${machine.brand} ${machine.model}`,
      machineImage: machine.imageUrl,
      bidderName: 'Jean-Marc Mercier',
      bidderCompany: 'Mercier Levage',
      priceOffered: Number(bidPrice),
      duration: selectedTender.durationMonths * 30,
      startDate: selectedTender.startDate,
      description: bidDesc || `Nous proposons notre ${machine.brand} ${machine.model} parfaitement révisé avec VGP valide pour ce chantier.`,
      status: 'En attente',
      submissionDate: new Date().toISOString().split('T')[0]
    };

    onSubmitBid(newBid);
    setShowBidModal(false);
    alert('Votre proposition commerciale B2B a été envoyée au maître d\'œuvre. Vous serez averti en cas d\'acceptation.');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-appels-offres">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="font-sans text-2xl font-black text-gray-950">Appels d'Offres de Location B2B</h1>
          <p className="text-xs text-gray-500">Consultez les besoins urgents en matériel lourd émis par les grands groupes du bâtiment et proposez votre flotte disponible.</p>
        </div>

        <button
          onClick={() => onNavigate('Demander des Engins - DEL-web')}
          className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Publier un besoin
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par type d'engin, marque ou entreprise requérante..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1 border border-gray-200 self-start">
          <Filter className="h-4.5 w-4.5 text-gray-400 mx-2" />
          {['Tous', 'Lyon', 'Bron', 'Givors'].map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                selectedLocation === loc ? 'bg-amber-500 text-gray-950' : 'text-gray-500 hover:text-gray-950'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Tenders Grid list */}
      <div className="space-y-4">
        {filteredTenders.map((tender) => {
          return (
            <div key={tender.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:border-amber-300 transition-all flex flex-col md:flex-row gap-6 justify-between items-start">
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase tracking-wide">
                    {tender.machineType}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Publié le {tender.postDate}
                  </span>
                </div>

                <h3 className="font-sans text-base font-extrabold text-gray-950 leading-snug">{tender.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">{tender.description}</p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-gray-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" /> Lieu : {tender.location}
                  </span>
                  <span>•</span>
                  <span>Durée de mission : {tender.durationMonths} mois</span>
                  <span>•</span>
                  <span>Tonnage minimum : {tender.minWeight} Tonnes</span>
                  <span>•</span>
                  <span className="text-amber-600 font-extrabold">Max : {tender.maxBudget} € / jour</span>
                </div>
              </div>

              <div className="flex flex-col items-stretch md:items-end gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Émetteur</p>
                  <p className="text-xs font-black text-gray-950 mt-0.5">{tender.clientCompany}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">{tender.proposalsCount} offre(s) déjà déposée(s)</p>
                </div>

                <button
                  onClick={() => handleOpenBid(tender)}
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2.5 text-xs font-bold text-gray-950 flex items-center justify-center gap-1 cursor-pointer"
                >
                  Soumettre une offre
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bidding Modal */}
      {showBidModal && selectedTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="font-sans text-sm font-extrabold text-gray-900 border-b border-gray-100 pb-3">
              Déposer votre offre commerciale
            </h3>
            <p className="text-xs text-gray-500 bg-amber-50 p-3 rounded-lg">
              Sujet : <strong>{selectedTender.title}</strong> émis par {selectedTender.clientCompany}. Budget max : {selectedTender.maxBudget}€/jour.
            </p>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Sélectionner votre engin disponible</label>
                <select
                  value={selectedMachineId}
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                >
                  <option value="">-- Sélectionnez une machine disponible --</option>
                  {ownerMachines.filter(m => m.status === 'available').map(m => (
                    <option key={m.id} value={m.id}>{m.brand} {m.model} ({m.type} - {m.weight}T)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Prix proposé (€ HT / jour)</label>
                <input
                  type="number"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Argumentaire de l'offre (Points forts)</label>
                <textarea
                  value={bidDesc}
                  onChange={(e) => setBidDesc(e.target.value)}
                  placeholder="Pourquoi votre machine est-elle idéale pour ce chantier (VGP récente, chauffeur qualifié...) ?"
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowBidModal(false)}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-gray-950 hover:bg-amber-400 cursor-pointer"
                >
                  Déposer mon offre B2B
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
