import React from 'react';
import { 
  Construction, 
  ShieldCheck, 
  Clock, 
  Coins, 
  ChevronRight, 
  Users, 
  Wrench, 
  Layers, 
  ArrowRight,
  TrendingUp,
  FileCheck2,
  CalendarCheck2
} from 'lucide-react';
import { motion } from 'motion/react';

interface AccueilPremiumProps {
  onNavigate: (screen: string) => void;
  onRoleChange: (role: 'proprietaire' | 'locataire') => void;
}

export default function AccueilPremium({ onNavigate, onRoleChange }: AccueilPremiumProps) {
  const stats = [
    { value: '4,500+', label: 'Engins de Chantier Référencés' },
    { value: '250,000+', label: 'Heures de Location Enregistrées' },
    { value: '98.9%', label: 'Disponibilité Opérationnelle Garantie' },
    { value: '1.2M €', label: 'Économies sur la maintenance / an' },
  ];

  const features = [
    {
      icon: Wrench,
      title: 'Maintenance Proactive Assistée',
      description: 'Soyez alerté avant la panne. DEL-web anticipe vos échéances de vidanges, filtres, et inspections à partir des données de télémesure.'
    },
    {
      icon: ShieldCheck,
      title: 'Conformité VGP Automatisée',
      description: 'Ne risquez plus d\'amendes sur vos chantiers. Le coffre-fort DEL-web stocke vos rapports de Visite Générale Périodique et vous prévient 30 jours avant expiration.'
    },
    {
      icon: Coins,
      title: 'Appels d\'Offres & Rentabilité',
      description: 'Accédez en direct aux demandes d\'entreprises partenaires (Bouygues, Eiffage, Vinci...) et soumettez vos offres de location au meilleur prix.'
    },
    {
      icon: Layers,
      title: 'Suivi Télémétrique en Temps Réel',
      description: 'Suivez le compteur d\'heures, le niveau de carburant, et la localisation exacte de vos pelles, grues, et nacelles en mission.'
    }
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-950 text-white overflow-y-auto" id="screen-accueil-premium">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:px-24 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(245,158,11,0.15),transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="mx-auto max-w-6xl relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
              <Construction className="h-3.5 w-3.5" />
              RÉVOLUTION B2B MATÉRIEL DE CHANTIER
            </div>
            <h1 className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Gérez, louez et <br />
              <span className="text-amber-500">maintenez votre flotte</span> d'engins de chantier.
            </h1>
            <p className="text-base text-gray-300 max-w-xl leading-relaxed">
              DEL-web connecte les propriétaires d'engins lourds de construction et les grandes entreprises du BTP. Une suite logicielle complète intégrant alertes de sécurité VGP, maintenance proactive, et coffre-fort documentaire.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => {
                  onRoleChange('proprietaire');
                  onNavigate('Dashboard Propriétaire Personnalisé - DEL-web');
                }}
                className="group flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-bold text-gray-950 transition-all hover:bg-amber-400 hover:scale-[1.02] shadow-lg shadow-amber-500/20 cursor-pointer"
                id="hero-btn-owner"
              >
                Accéder à l'Espace Propriétaire
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => {
                  onRoleChange('locataire');
                  onNavigate('Dashboard Entreprise - DEL-web');
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-900/80 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-gray-800 hover:border-gray-600 cursor-pointer"
                id="hero-btn-renter"
              >
                Espace Locataire (BTP)
              </button>
            </div>

            <div className="flex items-center gap-6 pt-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4 text-emerald-500" /> VGP 100% Conforme
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarCheck2 className="h-4 w-4 text-emerald-500" /> Télémétrie Intégrée
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-emerald-500" /> Réseau B2B Agréé
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-md shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <span className="text-[11px] font-mono text-amber-500 font-bold">LIVE TELEMETRY DEMO</span>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-gray-950 p-4 border border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-300">Liebherr R 924 Compact</span>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase">
                      Actif
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 text-[10px]">Heures Moteur</p>
                      <p className="font-mono text-sm font-semibold text-white">1 450 h</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[10px]">Réservoir GNR</p>
                      <p className="font-mono text-sm font-semibold text-amber-500">68 %</p>
                    </div>
                    <div className="col-span-2 mt-1">
                      <p className="text-gray-500 text-[10px]">Localisation active</p>
                      <p className="font-sans font-medium text-white truncate text-[11px]">Chantier Lyon Part-Dieu</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-950 p-4 border border-gray-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-300">Statut Maintenance Générale</span>
                    <span className="text-amber-500 text-[10px] font-bold">VGP Valide</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-emerald-500 to-amber-500" />
                  </div>
                  <p className="text-[10px] text-gray-400">Prochaine visite préventive planifiée le 15 Sep 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section className="bg-gray-950 border-y border-gray-900 py-12 px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <p className="font-sans text-3xl font-extrabold text-amber-500 md:text-4xl">{stat.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            La solution ultime de pilotage de flotte d'engins
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Pour les PME de terrassement comme pour les grands loueurs nationaux, DEL-web centralise l'intégralité du cycle de vie du matériel B2B.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="flex gap-4 rounded-2xl border border-gray-800 bg-gray-900/40 p-6 hover:border-gray-700 transition-colors">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-sans text-base font-bold text-white">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Path Selection Cards */}
      <section className="bg-gray-900/60 border-t border-gray-800 py-16 px-6">
        <div className="mx-auto max-w-5xl space-y-8">
          <h3 className="text-center text-xl font-extrabold text-white">Prêt à démarrer ? Sélectionnez votre profil</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-amber-500/20 bg-gray-950 p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">PROPRIÉTAIRE</span>
                <h4 className="text-xl font-bold">Je possède des engins lourds</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Vous souhaitez sécuriser le suivi de maintenance de vos machines (pelles, bulldozers, chargeurs), assurer la validité de vos VGP, et rentabiliser votre parc en le proposant à la location auprès de locataires certifiés.
                </p>
              </div>
              <button
                onClick={() => {
                  onRoleChange('proprietaire');
                  onNavigate('Dashboard Propriétaire Personnalisé - DEL-web');
                }}
                className="w-full rounded-xl bg-amber-500 py-3 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Accéder à l'Espace Propriétaire
              </button>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-gray-950 p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">ENTREPRISE LOCATAIRE</span>
                <h4 className="text-xl font-bold">Je recherche du matériel pour mes chantiers</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Vous gérez des projets de construction et souhaitez louer du matériel de terrassement ou de levage de haute qualité auprès de propriétaires certifiés, avec rapports VGP à jour et télémétrie de suivi d'activité intégrée.
                </p>
              </div>
              <button
                onClick={() => {
                  onRoleChange('locataire');
                  onNavigate('Dashboard Entreprise - DEL-web');
                }}
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                Accéder à l'Espace Locataire
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950 py-8 text-center text-xs text-gray-500">
        <p>© 2026 DEL-web. Plateforme de Logistique Intelligente pour le Bâtiment et les Travaux Publics.</p>
        <p className="mt-1 text-gray-600">Certifié conforme par l'Association Française des Loueurs de Matériel de Construction.</p>
      </footer>
    </div>
  );
}
