import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/react';
import { UserProfile } from '../types';
import { 
  Bell, 
  Shield, 
  User, 
  Sliders, 
  Check, 
  Construction, 
  Globe, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  user: UserProfile;
  activeRole: 'proprietaire' | 'locataire';
  onRoleChange: (role: 'proprietaire' | 'locataire') => void;
  onNavigate: (screen: string) => void;
}

export default function Header({ user, activeRole, onRoleChange, onNavigate }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { logout } = useAuth();

  const notifications = [
    { id: 1, text: "Rapport VGP expiré pour Komatsu PC210", type: "alert", time: "Il y a 2h" },
    { id: 2, text: "Nouvelle proposition reçue pour l'Appel d'Offres 'Besoin Pelle Rail-Route'", type: "success", time: "Il y a 3h" },
    { id: 3, text: "Changement de statut : Liebherr R 924 sur site Lyon Part-Dieu", type: "info", time: "Il y a 5h" },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/90 px-6 backdrop-blur-md" id="del-header">
      {/* Brand Logo & Tag */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('Accueil Premium - DEL-web')}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white shadow-md shadow-amber-500/20">
          <Construction className="h-6 w-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-sans text-xl font-extrabold tracking-tight text-gray-900">
              DEL<span className="text-amber-500 font-medium">.web</span>
            </span>
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              PRO
            </span>
          </div>
          <p className="text-[10px] font-medium text-gray-400">{t('header.tagline')}</p>
        </div>
      </div>

      {/* Center Navigation Actions & Quick Role Switcher */}
      <div className="flex items-center gap-4">
        {/* Role Switcher */}
        <div className="flex items-center rounded-xl bg-gray-100 p-1 border border-gray-200">
          <button
            onClick={() => onRoleChange('proprietaire')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              activeRole === 'proprietaire'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            id="btn-switch-owner"
          >
            <Sliders className="h-3.5 w-3.5 text-amber-500" />
            {t('header.owner_space')}
          </button>
          <button
            onClick={() => onRoleChange('locataire')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
              activeRole === 'locataire'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
            id="btn-switch-renter"
          >
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            {t('header.renter_space')}
          </button>
        </div>
      </div>

      {/* Right side utility icons */}
      <div className="flex items-center gap-3">
        {/* Support Alert badge */}
        <span className="hidden items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 md:flex">
          <Shield className="h-3.5 w-3.5" />
          {user.subscription}
        </span>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            id="btn-language-selector"
          >
            <span className="text-base">{language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
            <span className="hidden sm:inline">{language === 'fr' ? 'FR' : 'EN'}</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
          
          <AnimatePresence>
            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 mt-1.5 z-50 w-32 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg space-y-0.5"
                >
                  <button
                    onClick={() => {
                      setLanguage('fr');
                      setShowLangMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors ${
                      language === 'fr' ? 'text-amber-600 bg-amber-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>🇫🇷</span>
                      <span>Français</span>
                    </span>
                    {language === 'fr' && <Check className="h-3 w-3 animate-fade-in" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setShowLangMenu(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold hover:bg-amber-50 hover:text-amber-900 transition-colors ${
                      language === 'en' ? 'text-amber-600 bg-amber-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>🇬🇧</span>
                      <span>English</span>
                    </span>
                    {language === 'en' && <Check className="h-3 w-3 animate-fade-in" />}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors"
            id="btn-notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
            </span>
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 z-50 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 text-sm">{t('header.alerts')}</h4>
                    <span className="text-[11px] font-medium text-amber-600 hover:underline cursor-pointer">{t('header.mark_all_read')}</span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="rounded-xl bg-gray-50 p-3 hover:bg-gray-100 transition-colors cursor-pointer text-xs">
                        <p className="font-medium text-gray-800">{notif.text}</p>
                        <span className="text-[10px] text-gray-400 block mt-1">{notif.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <SignedOut>
          <SignInButton mode="modal"><button className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50">Connexion</button></SignInButton>
          <SignUpButton mode="modal"><button className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-gray-950 hover:bg-amber-400">Inscription</button></SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>

        {/* User Profile Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl p-1 pr-3 border border-gray-200 hover:bg-gray-50 transition-colors"
            id="btn-profile-dropdown"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 font-bold text-sm">
              {user.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-gray-900">{user.fullName}</p>
              <p className="text-[9px] font-medium text-gray-400 truncate max-w-[120px]">{user.companyName}</p>
            </div>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 z-50 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900">{user.fullName}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button 
                      onClick={() => { onNavigate('Profil Utilisateur - DEL-web'); setShowProfileMenu(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      {t('header.my_profile')}
                    </button>
                    <button 
                      onClick={() => { onNavigate('Coffre-fort Documents - DEL-web'); setShowProfileMenu(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-gray-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      {t('header.my_docs')}
                    </button>
                  </div>
                  <div className="border-t border-gray-100 pt-1 mt-1">
                    <button 
                      onClick={() => { void logout(); setShowProfileMenu(false); }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      {t('header.logout')}
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

