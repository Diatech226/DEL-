import React, { useState } from 'react';
import { ShieldAlert, Plus, HelpCircle, MapPin, Calendar, Coins, ArrowRight } from 'lucide-react';

interface DemanderEnginProps {
  onAddTender: (newTender: any) => void;
  onNavigate: (screen: string) => void;
}

export default function DemanderEngin({ onAddTender, onNavigate }: DemanderEnginProps) {
  const [title, setTitle] = useState('');
  const [machineType, setMachineType] = useState('Pelle Hydraulique');
  const [minWeight, setMinWeight] = useState('20');
  const [maxBudget, setMaxBudget] = useState('400');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [duration, setDuration] = useState('2');
  const [location, setLocation] = useState('Lyon (69)');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newTender = {
      id: `tnd-${Date.now()}`,
      title,
      clientCompany: 'Eiffage Construction (Démo)',
      machineType,
      minWeight: Number(minWeight),
      maxBudget: Number(maxBudget),
      startDate,
      durationMonths: Number(duration),
      location,
      description,
      status: 'Ouvert',
      proposalsCount: 0,
      postDate: new Date().toISOString().split('T')[0]
    };

    onAddTender(newTender);
    // Navigate back to tenders
    onNavigate('Appels d\'Offres - DEL-web');
    alert('Votre besoin B2B a été publié sous forme d\'Appel d\'Offres. Les propriétaires d\'engins certifiés pourront vous proposer leurs devis.');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-demander-engin">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-sans text-2xl font-black text-gray-950">Publier un Appel d'Offres (Demande d'Engin)</h1>
        <p className="text-xs text-gray-500">Formulez vos critères techniques pour un engin de chantier lourd. Recevez des propositions commerciales compétitives et conformes VGP.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form panel */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-wider">Caractéristiques de la Mission</h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Titre de l'Appel d'Offres</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Recherche Pelle Rail-Route 20 tonnes pour Lyon..."
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type d'engin recherché</label>
                  <select
                    value={machineType}
                    onChange={(e) => setMachineType(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Pelle sur chenilles">Pelle sur chenilles</option>
                    <option value="Grue Mobile">Grue Mobile</option>
                    <option value="Chariot télescopique">Chariot télescopique</option>
                    <option value="Nacelle articulée">Nacelle articulée</option>
                    <option value="Tractopelle">Tractopelle</option>
                    <option value="Compacteur">Compacteur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Poids minimum de l'engin (Tonnes)</label>
                  <input
                    type="number"
                    value={minWeight}
                    onChange={(e) => setMinWeight(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Budget maximum journalier (€ HT / jour)</label>
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Lieu du chantier (Ville / CP)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex : Givors (69)"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date de début souhaitée</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Durée estimative (Mois)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Cahier des charges & Exigences Techniques</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez précisément votre besoin : contraintes de hauteur, motorisation hybride exigée, accessoires requis (godet tranchée, BRH...)"
                  rows={4}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
              >
                Publier l'Appel d'Offres
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Info panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
            <h4 className="font-sans text-xs font-bold text-gray-900 uppercase tracking-wider">Comment ça marche ?</h4>
            <div className="space-y-3 text-xs leading-relaxed text-gray-600">
              <p><strong>1. Rédaction :</strong> Décrivez précisément les caractéristiques techniques du matériel dont vous avez besoin.</p>
              <p><strong>2. Notification :</strong> Notre algorithme notifie instantanément les propriétaires d'engins agréés de la région correspondante.</p>
              <p><strong>3. Réception de devis :</strong> Vous recevez des propositions commerciales chiffrées sous 24 heures.</p>
              <p><strong>4. Validation en ligne :</strong> Signez électroniquement le contrat de location et commencez votre chantier.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
