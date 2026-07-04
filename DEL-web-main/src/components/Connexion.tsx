import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Construction, Lock, Mail, ArrowRight, Phone, User } from 'lucide-react';

interface ConnexionProps { onLoginSuccess: () => void; onNavigate: (screen: string) => void; }

export default function Connexion({ onLoginSuccess, onNavigate }: ConnexionProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'OWNER' | 'COMPANY'>('OWNER');
  const [success, setSuccess] = useState<string | null>(null);
  const { login, register, loading, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    try {
      if (isRegister) {
        await register({ fullName, name: fullName, email, phone, password, role });
        setSuccess('Compte créé et session DEL-api ouverte.');
      } else {
        await login(email, password);
        setSuccess('Connexion DEL-api réussie.');
      }
      onLoginSuccess();
      onNavigate(role === 'COMPANY' ? 'Dashboard Entreprise - DEL-web' : 'Dashboard Propriétaire Personnalisé - DEL-web');
    } catch {
      // AuthContext exposes the displayable error.
    }
  };

  return (
    <div className="flex-1 bg-gray-900 flex items-center justify-center p-6 relative overflow-hidden" id="screen-connexion">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.1),transparent_50%)]" />
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-950 p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/20"><Construction className="h-7 w-7" /></div>
          <h2 className="font-sans text-xl font-black text-white">{isRegister ? 'Créez votre compte B2B DEL-web' : "Connexion à l'Espace DEL-web"}</h2>
          <p className="text-xs text-gray-400">{isRegister ? "Rejoignez le réseau professionnel de logistique d'engins" : 'Connectez-vous avec votre compte DEL-api'}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {isRegister && <>
            <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Nom complet</label><div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-500" required /></div></div>
            <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Téléphone</label><div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-500" required /></div></div>
            <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rôle</label><select value={role} onChange={(e) => setRole(e.target.value as 'OWNER' | 'COMPANY')} className="w-full rounded-lg border border-gray-800 bg-gray-900/80 px-4 py-2.5 text-xs font-semibold text-white"><option value="OWNER">OWNER — Propriétaire</option><option value="COMPANY">COMPANY — Entreprise</option></select></div>
          </>}
          {error && <div className="rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs font-bold text-red-200">{error}</div>}
          {success && <div className="rounded-lg border border-green-900/50 bg-green-950/40 p-3 text-xs font-bold text-green-200">{success}</div>}
          <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email professionnel</label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-500" required /></div></div>
          <div><label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Mot de passe</label><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-800 bg-gray-900/80 pl-10 pr-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-amber-500" required /></div></div>
          <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-gray-950 hover:bg-amber-400 transition-all cursor-pointer disabled:opacity-60">{loading ? 'Envoi vers DEL-api…' : (isRegister ? "S'enregistrer" : 'Se connecter')}<ArrowRight className="h-4 w-4" /></button>
        </form>
        <div className="text-center"><button onClick={() => { setIsRegister(!isRegister); setSuccess(null); }} className="text-[11px] font-semibold text-gray-400 hover:text-amber-500">{isRegister ? 'Déjà membre ? Connectez-vous' : 'Nouveau sur DEL-web ? Créez un compte pro'}</button></div>
      </div>
    </div>
  );
}
