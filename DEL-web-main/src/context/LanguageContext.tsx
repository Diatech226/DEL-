import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface TranslationDictionary {
  [key: string]: {
    fr: string;
    en: string;
  };
}

const translations: TranslationDictionary = {
  // Header & Brand
  'header.tagline': {
    fr: "Disponibilité d'Engins en Ligne",
    en: "Online Heavy Equipment Availability"
  },
  'header.owner_space': {
    fr: "Espace Propriétaire",
    en: "Owner Space"
  },
  'header.renter_space': {
    fr: "Espace Locataire (Entreprise)",
    en: "Renter Space (Corporate)"
  },
  'header.alerts': {
    fr: "Centre d'alertes",
    en: "Alert Center"
  },
  'header.mark_all_read': {
    fr: "Tout marquer lu",
    en: "Mark all as read"
  },
  'header.my_profile': {
    fr: "Mon Profil B2B",
    en: "My B2B Profile"
  },
  'header.my_docs': {
    fr: "Mes Documents d'Entreprise",
    en: "My Company Documents"
  },
  'header.logout': {
    fr: "Se Déconnecter",
    en: "Log Out"
  },

  // Sidebar
  'sidebar.owner_menu_title': {
    fr: "Menu Propriétaire Fleet",
    en: "Fleet Owner Menu"
  },
  'sidebar.renter_menu_title': {
    fr: "Menu Locataire B2B",
    en: "Renter Menu (B2B)"
  },
  'sidebar.support_title': {
    fr: "Support Client DEL-web",
    en: "DEL-web Customer Support"
  },
  'sidebar.support_hours': {
    fr: "Lundi au Vendredi, 8h - 18h",
    en: "Monday to Friday, 8am - 6pm"
  },
  'sidebar.owner_personalized': {
    fr: "Dashboard Personnalisé",
    en: "Personalized Dashboard"
  },
  'sidebar.owner_general': {
    fr: "Dashboard Flotte (Général)",
    en: "Fleet Dashboard (General)"
  },
  'sidebar.owner_fleet': {
    fr: "Ma Flotte d'Engins",
    en: "My Equipment Fleet"
  },
  'sidebar.owner_maintenance': {
    fr: "Maintenance & VGP",
    en: "Maintenance & Inspections"
  },
  'sidebar.owner_calendar': {
    fr: "Calendrier de Maintenance",
    en: "Maintenance Calendar"
  },
  'sidebar.owner_contracts': {
    fr: "Contrats de Location",
    en: "Rental Contracts"
  },
  'sidebar.owner_proposals': {
    fr: "Propositions & Devis",
    en: "Offers & Estimates"
  },
  'sidebar.owner_tenders': {
    fr: "Appels d'Offres Publics",
    en: "Public Tenders"
  },
  'sidebar.owner_register': {
    fr: "Déposer / Enregistrer Engin",
    en: "Register / Add Equipment"
  },
  'sidebar.owner_safe': {
    fr: "Coffre-fort Documents",
    en: "Documents Safe"
  },
  'sidebar.owner_invoices': {
    fr: "Mes Factures",
    en: "My Invoices"
  },
  'sidebar.renter_dashboard': {
    fr: "Dashboard Entreprise",
    en: "Enterprise Dashboard"
  },
  'sidebar.renter_search': {
    fr: "Rechercher un Engin",
    en: "Search Equipment"
  },
  'sidebar.renter_publish': {
    fr: "Publier un Appel d'Offres",
    en: "Post a Tender"
  },
  'sidebar.renter_missions': {
    fr: "Suivi des Missions",
    en: "Track Live Missions"
  },
  'sidebar.renter_contracts': {
    fr: "Gestion des Contrats",
    en: "Manage Contracts"
  },
  'sidebar.renter_proposals': {
    fr: "Nos Propositions Reçues",
    en: "Received Proposals"
  },
  'sidebar.renter_safe': {
    fr: "Coffre-fort Documents",
    en: "Documents Safe"
  },
  'sidebar.renter_invoices': {
    fr: "Factures & Budgets",
    en: "Invoices & Budgets"
  },

  // ListeEngins (Equipment Catalog)
  'catalog.title': {
    fr: "Catalogue Général d'Engins de Chantier",
    en: "General Construction Fleet Catalog"
  },
  'catalog.subtitle': {
    fr: "Consultez, recherchez et réservez instantanément du matériel lourd vérifié par DEL-web.",
    en: "Browse, search, and instantly reserve heavy machinery verified by DEL-web."
  },
  'catalog.search_placeholder': {
    fr: "Rechercher par marque, modèle, type ou statut (ex: Disponible, Loué, Maintenance)...",
    en: "Search by brand, model, type or status (e.g. Available, Rented, Maintenance)..."
  },
  'catalog.category_filter': {
    fr: "Filtrer par Catégorie",
    en: "Filter by Category"
  },
  'catalog.status_filter': {
    fr: "Filtrer par Statut",
    en: "Filter by Status"
  },
  'catalog.all': {
    fr: "Tous",
    en: "All"
  },
  'catalog.available': {
    fr: "Disponible",
    en: "Available"
  },
  'catalog.rented': {
    fr: "Loué",
    en: "Rented"
  },
  'catalog.maintenance': {
    fr: "Maintenance",
    en: "Maintenance"
  },
  'catalog.empty_title': {
    fr: "Aucun engin trouvé",
    en: "No equipment found"
  },
  'catalog.empty_desc': {
    fr: "Aucun matériel ne correspond à votre recherche. Essayez de chercher \"disponible\", \"loué\" ou \"maintenance\".",
    en: "No machinery matches your search. Try searching \"available\", \"rented\", or \"maintenance\"."
  },
  'catalog.reset': {
    fr: "Réinitialiser les filtres",
    en: "Reset filters"
  },
  'catalog.price_per_day': {
    fr: "€ / j",
    en: "€ / day"
  },
  'catalog.view_tech_sheet': {
    fr: "Voir la fiche technique",
    en: "View technical specs"
  },
  'catalog.register_btn': {
    fr: "Enregistrer un Engin",
    en: "Register Equipment"
  },
  'cat.Tous': {
    fr: "Tous",
    en: "All"
  },
  'cat.Terrassement': {
    fr: "Terrassement",
    en: "Earthmoving"
  },
  'cat.Levage': {
    fr: "Levage",
    en: "Lifting"
  },
  'cat.Route': {
    fr: "Route",
    en: "Roadworks"
  },
  'cat.Manutention': {
    fr: "Manutention",
    en: "Handling"
  },

  // Owner Dashboard (DashboardProprietaire)
  'owner.title_general': {
    fr: "Suivi Général de Flotte d'Engins",
    en: "General Fleet Monitoring"
  },
  'owner.title_personalized': {
    fr: "Bonjour, {name} 👋",
    en: "Hello, {name} 👋"
  },
  'owner.subtitle_general': {
    fr: "Supervision globale du parc d'engins lourds de chantier.",
    en: "Global supervision of heavy construction fleet."
  },
  'owner.subtitle_personalized': {
    fr: "Vue d'ensemble personnalisée pour Mercier Levage.",
    en: "Personalized overview for Mercier Levage."
  },
  'owner.kpi.fleet': {
    fr: "Parc d'Engins",
    en: "Equipment Fleet"
  },
  'owner.kpi.available': {
    fr: "Disponibles",
    en: "Available"
  },
  'owner.kpi.rented': {
    fr: "En cours de loc.",
    en: "On Rent"
  },
  'owner.kpi.utilization': {
    fr: "Taux de Disponibilité",
    en: "Availability Rate"
  },
  'owner.kpi.revenue': {
    fr: "Revenu Estimé (Mensuel)",
    en: "Estimated Revenue (Monthly)"
  },
  'owner.kpi.alerts': {
    fr: "Alertes de Maintenance",
    en: "Maintenance Alerts"
  },
  'owner.sections.operational_status': {
    fr: "État Opérationnel de Vos Engins",
    en: "Operational Status of Your Fleet"
  },
  'owner.sections.live_supervision': {
    fr: "Supervision en direct de vos machines",
    en: "Live telemetry and status of your machinery"
  },
  'owner.sections.view_all': {
    fr: "Voir tout",
    en: "View all"
  },
  'owner.sections.upcoming_maintenance': {
    fr: "Échéances de Maintenance",
    en: "Maintenance Schedule"
  },
  'owner.sections.upcoming_desc': {
    fr: "Prochaines interventions requises",
    en: "Next required interventions"
  },
  'owner.sections.manage': {
    fr: "Gérer",
    en: "Manage"
  },
  'owner.sections.quick_links': {
    fr: "Accès Rapide Portails",
    en: "Quick Portal Access"
  },
  'detail.chart_title': {
    fr: "Historique d'Utilisation (Heures-moteur)",
    en: "Operating Hours History (Engine-hours)"
  },
  'detail.chart_subtitle': {
    fr: "Suivi mensuel cumulé de l'utilisation de l'engin",
    en: "Monthly cumulative tracking of equipment usage"
  },
  'detail.chart_hours': {
    fr: "Heures",
    en: "Hours"
  },
  'detail.chart_month': {
    fr: "Mois",
    en: "Month"
  },
  'owner.sim.title': {
    fr: "Simulateur de Rentabilité Annuelle",
    en: "Annual Profitability Simulator"
  },
  'owner.sim.subtitle': {
    fr: "Estimez vos revenus annuels nets et optimisez le rendement de votre parc en ajustant les variables d'exploitation.",
    en: "Estimate your net annual revenue and optimize your fleet yield by adjusting operational variables."
  },
  'owner.sim.utilization': {
    fr: "Taux d'utilisation cible",
    en: "Target utilization rate"
  },
  'owner.sim.maint_cost': {
    fr: "Coût de maintenance annuel moyen (par engin)",
    en: "Average annual maintenance cost (per machinery)"
  },
  'owner.sim.active_days': {
    fr: "Jours de location facturables par an",
    en: "Billable rental days per year"
  },
  'owner.sim.projected_gross': {
    fr: "Revenu Brut Projeté",
    en: "Projected Gross Revenue"
  },
  'owner.sim.projected_maint': {
    fr: "Coût Maintenance Projeté",
    en: "Projected Maintenance Cost"
  },
  'owner.sim.net_profit': {
    fr: "Bénéfice Net Estimé",
    en: "Estimated Net Profit"
  },
  'owner.sim.roi_label': {
    fr: "Marge de Rentabilité",
    en: "Profitability Margin"
  },
  'owner.sim.chart_title': {
    fr: "Projection Financière Trimestrielle",
    en: "Quarterly Financial Projection"
  },
  'detail.geo_title': {
    fr: "Géolocalisation & Position GPS",
    en: "Geolocation & GPS Position"
  },
  'detail.geo_subtitle': {
    fr: "Visualisation de l'emplacement et calcul de distance en temps réel",
    en: "Live location visualization and real-time distance calculation"
  },
  'detail.geo_btn_track': {
    fr: "Mesurer la distance (Ma Position)",
    en: "Measure distance (My Position)"
  },
  'detail.geo_permission_granted': {
    fr: "Géolocalisation activée",
    en: "Geolocation activated"
  },
  'detail.geo_permission_denied': {
    fr: "Géolocalisation non autorisée",
    en: "Geolocation unauthorized"
  },
  'detail.geo_distance': {
    fr: "Distance estimée jusqu'à l'engin",
    en: "Estimated distance to machinery"
  },
  'detail.geo_lat_lng': {
    fr: "Coordonnées de l'engin",
    en: "Equipment Coordinates"
  },
  'detail.geo_user_lat_lng': {
    fr: "Vos coordonnées GPS",
    en: "Your GPS Coordinates"
  },
  'detail.geo_mock_map_desc': {
    fr: "Position en direct - Secteur d'activité principal de l'engin",
    en: "Live position - Machinery primary operations sector"
  },
  'owner.security.title': {
    fr: "Score de Sécurité & Conformité",
    en: "Security & Compliance Score"
  },
  'owner.security.subtitle': {
    fr: "Analyse en temps réel de vos documents réglementaires et garanties d'assurances",
    en: "Real-time analysis of regulatory documents and contract insurance coverage"
  },
  'owner.security.score_label': {
    fr: "Score Global de Conformité",
    en: "Global Compliance Score"
  },
  'owner.security.score_desc': {
    fr: "Votre score est calculé selon la validité des VGP, l'archivage des cartes grises, et l'assurance des contrats actifs.",
    en: "Your score is computed based on VGP validity, registration cards archiving, and active contracts insurance."
  },
  'owner.security.tips_title': {
    fr: "Conseils et Actions Correctives",
    en: "Recommended Tips & Corrective Actions"
  },
  'owner.security.strengths': {
    fr: "Points Forts & Conformité",
    en: "Strengths & Compliant Areas"
  },
  'owner.security.weaknesses': {
    fr: "Risques & Anomalies Détectées",
    en: "Risks & Detected Anomalies"
  },
  'detail.print_report': {
    fr: "Imprimer le rapport",
    en: "Print Report"
  },
  'detail.print_subtitle': {
    fr: "Rapport technique et administratif d'activité",
    en: "Technical & Administrative Activity Report"
  },
  'detail.print_date': {
    fr: "Rapport généré le",
    en: "Report generated on"
  },
  'detail.print_signature': {
    fr: "Visa & Validation Technique (Cachet)",
    en: "Visa & Technical Validation (Stamp)"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string, replacements?: { [key: string]: string }): string => {
    const translation = translations[key];
    if (!translation) {
      return key;
    }
    let text = translation[language] || translation['fr'];
    if (replacements) {
      Object.keys(replacements).forEach((k) => {
        text = text.replace(`{${k}}`, replacements[k]);
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
