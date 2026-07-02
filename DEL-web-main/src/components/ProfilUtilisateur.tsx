import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  CreditCard, 
  Award, 
  Check,
  ShieldCheck,
  Globe,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfilUtilisateurProps {
  user: UserProfile;
  activeRole: 'proprietaire' | 'locataire';
  onRoleChange: (role: 'proprietaire' | 'locataire') => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export default function ProfilUtilisateur({ user, activeRole, onRoleChange, onUpdateUser }: ProfilUtilisateurProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [companyName, setCompanyName] = useState(user.companyName);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [rib, setRib] = useState(user.rib);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      fullName,
      companyName,
      phone,
      address,
      rib
    });
    alert('Profil utilisateur B2B enregistré avec succès.');
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-6 space-y-6" id="screen-profil-utilisateur">
      {/* Page Title */}
      <div className="border-b border-gray-200 pb-5">
        <h1 className="font-sans text-2xl font-black text-gray-950">Profil Utilisateur & Compte B2B</h1>
        <p className="text-xs text-gray-500">Gérez vos informations de facturation, détails d'immatriculation d'entreprise, coordonnées de contact, et abonnement DEL.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: subscription status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-xl shadow-inner">
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="font-sans text-base font-bold text-gray-950">{user.fullName}</h3>
              <p className="text-xs text-gray-400 font-medium">{user.companyName}</p>
            </div>

            <div className="rounded-xl bg-gray-950 p-4 text-white space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-10 w-10 bg-amber-500/20 rounded-bl-full" />
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Abonnement Actif</span>
              </div>
              <h4 className="text-lg font-black text-white">{user.subscription}</h4>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Votre abonnement inclut l'archivage chiffré illimité de vos VGP, l'assistance logistique 24/7 de DEL-web, et la soumission d'offres prioritaires.
              </p>
              <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <Check className="h-3 w-3" /> Membre certifié DEL-web
              </div>
            </div>

            {/* Quick space switcher */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Sélecteur d'Espace Actif</p>
              
              <button
                onClick={() => onRoleChange('proprietaire')}
                className={`w-full flex items-center justify-between rounded-xl p-3 text-xs font-bold border transition-all ${
                  activeRole === 'proprietaire'
                    ? 'border-amber-500 bg-amber-500/5 text-amber-900'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sliders className="h-4 w-4" /> Espace Propriétaire
                </span>
                {activeRole === 'proprietaire' && <CheckCircle2 className="h-4 w-4 text-amber-600" />}
              </button>

              <button
                onClick={() => onRoleChange('locataire')}
                className={`w-full flex items-center justify-between rounded-xl p-3 text-xs font-bold border transition-all ${
                  activeRole === 'locataire'
                    ? 'border-blue-500 bg-blue-500/5 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Espace Locataire
                </span>
                {activeRole === 'locataire' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Edit Details Form */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-sans text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3">
              Informations d'Entreprise & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-gray-400" />
                  Représentant Légal
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  Raison Sociale / Société
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  Téléphone Portable / Standard
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                  SIRET
                </label>
                <input
                  type="text"
                  value={user.siret}
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Non modifiable pour un compte certifié</span>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  Adresse du Siège Social / Dépôt Principal
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-gray-400" />
                  Coordonnées Bancaires (RIB) pour Règlements Locataires
                </label>
                <input
                  type="text"
                  value={rib}
                  onChange={(e) => setRib(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-mono font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-all cursor-pointer shadow-md shadow-amber-500/10"
              >
                Sauvegarder les modifications
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
