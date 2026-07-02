import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Construction, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

interface ConnexionProps {
  onLoginSuccess: () => void;
  onNavigate: (screen: string) => void;
}

export default function Connexion({ onLoginSuccess, onNavigate }: ConnexionProps) {
  const [email, setEmail] = useState('diaexpressofficial@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const { login, register, loading, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register({ email, password, fullName, role: 'OWNER' });
      } else {
        await login(email, password);
      }
      onLoginSuccess();
      onNavigate('Dashboard Propriétaire Personnalisé - DEL-web');
    } catch {
      // AuthContext exposes the displayable error.
    }
  };

  return (
    <div className="flex-1 bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden" id="screen-connexion">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Logo and title */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
            <Construction className="h-7 w-7" />
          </div>
          <h2 className="font-sans text-xl font-black text-white">
            {isRegister ? "Créez votre compte B2B DEL-web" : "Connexion à l'Espace DEL-web"}
          </h2>
          <p className="text-xs text-gray-400">
            {isRegister 
              ? "Rejoignez le réseau professionnel de logistique d'engins" 
              : "Accédez à la supervision de votre flotte de chantiers"
            }
          </p>
        </div>

        {/* Predefined demo account helper */}
        {!isRegister && (
          <div className="rounded-xl bg-gray-900 border border-gray-850 p-3.5 space-y-1 text-center">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Compte de Démonstration Premium</p>
            <p className="text-xs font-semibold text-gray-300">Email : <span className="font-mono">{email}</span></p>
            <button
              onClick={async () => {
                try { await login(email, password); onLoginSuccess(); onNavigate('Dashboard Propriétaire Personnalisé - DEL-web'); } catch {}
              }}
              className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 px-3 py-1.5 text-[10px] font-bold text-gray-950 hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <UserCheck className="h-3.5 w-3.5" /> Connexion API avec ces identifiants
            </button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {isRegister && (
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nom complet</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-gray-800 bg-gray-900/80 px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-500" required />
            </div>
          )}
          {error && <div className="rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs font-bold text-red-200">{error}</div>}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email professionnel</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {!isRegister && (
            <div className="text-right">
              <a href="#" className="text-[10px] font-semibold text-gray-400 hover:text-amber-500">Mot de passe oublié ?</a>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-all cursor-pointer"
          >
            {loading ? 'Connexion…' : (isRegister ? "S'enregistrer comme membre" : "Se Connecter sécurisé")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[11px] font-semibold text-gray-400 hover:text-amber-500"
          >
            {isRegister ? "Déjà membre ? Connectez-vous" : "Nouveau sur DEL-web ? Créez un compte pro"}
          </button>
        </div>

      </div>
    </div>
  );
}
