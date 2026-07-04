import React, { useState } from 'react';
import { createEquipment } from '../services/equipment.service';
import { mapDesignEquipmentToApiPayload } from '../mappers/equipment.mapper';
import { getErrorMessage } from '../lib/http';
import { PlusCircle, ArrowRight, Layers, FileCheck2, Camera, MapPin, Wrench } from 'lucide-react';

interface DeposerEnginProps {
  onAddMachine: (newMachine: any) => void;
  onNavigate: (screen: string) => void;
}

export default function DeposerEngin({ onAddMachine, onNavigate }: DeposerEnginProps) {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('Pelle sur chenilles');
  const [category, setCategory] = useState('Terrassement');
  const [year, setYear] = useState('2023');
  const [weight, setWeight] = useState('18');
  const [hourCounter, setHourCounter] = useState('800');
  const [dailyPrice, setDailyPrice] = useState('320');
  const [location, setLocation] = useState('Dépôt Mercier - Givors');
  const [serialNumber, setSerialNumber] = useState('');
  const [vgpDate, setVgpDate] = useState('2026-03-01');
  const [nextMaint, setNextMaint] = useState('2026-09-01');
  const [enginePower, setEnginePower] = useState('120 ch');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model || !serialNumber) return;

    const newMachine = {
      id: `mch-${Date.now()}`,
      brand,
      model,
      type,
      year: Number(year),
      category,
      weight: Number(weight),
      hourCounter: Number(hourCounter),
      location,
      dailyPrice: Number(dailyPrice),
      status: 'available',
      ownerId: 'usr-4122',
      ownerName: 'Jean-Marc Mercier',
      serialNumber,
      vgpCertDate: vgpDate,
      nextMaintenanceDate: nextMaint,
      enginePower,
      fuelType: 'GNR',
      imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&auto=format&fit=crop&q=80' // default premium machine picture
    };

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await createEquipment(mapDesignEquipmentToApiPayload(newMachine));
      onAddMachine(newMachine);
      setSubmitSuccess('Votre engin a été soumis à DEL. L’équipe vérifiera les informations avant publication.');
    } catch (error) {
      setSubmitError(`${'Impossible d’envoyer l’engin à l’API DEL.'} ${getErrorMessage(error)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-deposer-engin">
      {/* Header */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-sans text-2xl font-black text-gray-950">Déposer & Enregistrer un Engin de Chantier</h1>
        <p className="text-xs text-gray-500">Ajoutez une machine à votre parc B2B. Complétez sa fiche technique et associez ses dates réglementaires VGP pour démarrer la location.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">{submitError}</div>}
            {submitSuccess && <div className="rounded-lg border border-green-100 bg-green-50 p-3 text-xs font-bold text-green-700">{submitSuccess}</div>}
            
            <div className="space-y-4">
              <h3 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-wider">Identifiants constructeur</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Marque / Constructeur</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ex : Liebherr, Caterpillar, Manitou..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Modèle précis</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Ex : R 924 Compact..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type d'engin</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Pelle sur chenilles">Pelle sur chenilles</option>
                    <option value="Pelle hydraulique">Pelle hydraulique</option>
                    <option value="Chariot télescopique">Chariot télescopique</option>
                    <option value="Tractopelle">Tractopelle</option>
                    <option value="Compacteur tandem">Compacteur tandem</option>
                    <option value="Grue à tour">Grue à tour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Catégorie logistique</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                  >
                    <option value="Terrassement">Terrassement</option>
                    <option value="Levage">Levage</option>
                    <option value="Route">Route</option>
                    <option value="Manutention">Manutention</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Numéro de série constructeur</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Ex : CAT320G..."
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-mono font-bold text-gray-800 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-wider">Données techniques & de Télémétrie</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Poids (Tonnes)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Compteur horaire (h)</label>
                  <input
                    type="number"
                    value={hourCounter}
                    onChange={(e) => setHourCounter(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Puissance (ch)</label>
                  <input
                    type="text"
                    value={enginePower}
                    onChange={(e) => setEnginePower(e.target.value)}
                    placeholder="Ex: 150 ch"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Prix de loc journalier (€)</label>
                  <input
                    type="number"
                    value={dailyPrice}
                    onChange={(e) => setDailyPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-bold text-amber-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  Localisation d'attache / Dépôt de garage actuel
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold focus:outline-none focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="font-sans text-xs font-bold text-gray-400 uppercase tracking-wider">Sécurité réglementaire (VGP obligatoire)</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <FileCheck2 className="h-4 w-4 text-gray-400" /> Date du dernier rapport VGP
                  </label>
                  <input
                    type="date"
                    value={vgpDate}
                    onChange={(e) => setVgpDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Wrench className="h-4 w-4 text-gray-400" /> Date du prochain entretien planifié
                  </label>
                  <input
                    type="date"
                    value={nextMaint}
                    onChange={(e) => setNextMaint(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 px-6 py-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
              >
                {submitting ? 'Envoi vers DEL-api…' : 'Enregistrer sur la plateforme'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 p-5 space-y-3">
            <Camera className="h-6 w-6 text-amber-600" />
            <h4 className="text-xs font-bold text-gray-950 uppercase tracking-wider">Fiche technique certifiée</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Une fois votre machine validée, notre équipe logistique DEL-web attribue automatiquement des photos de haute qualité correspondant au modèle exact et prépare le boîtier de télémétrie connecté.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
