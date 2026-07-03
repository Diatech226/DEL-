import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function LoginView() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setLocalError(null); const ok = await login(email, password); if (!ok) setLocalError('Ce compte n’a pas accès au CMS DEL.'); };
  return <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6"><form onSubmit={submit} className="w-full max-w-md bg-white rounded-2xl p-8 space-y-5 shadow-xl"><div><span className="bg-amber-500 text-slate-950 font-black px-2 py-1 rounded text-xs">DEL</span><h1 className="text-2xl font-bold mt-4">Connexion admin DEL CMS</h1><p className="text-sm text-slate-500">Authentification réelle via DEL-api.</p></div><label className="block text-sm font-semibold">Email<input className="mt-1 w-full border rounded-lg p-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label className="block text-sm font-semibold">Mot de passe<input className="mt-1 w-full border rounded-lg p-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>{(error || localError) && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">{error || localError}</p>}<button disabled={loading} className="w-full bg-amber-500 text-slate-950 font-bold py-3 rounded-lg disabled:opacity-60">{loading ? 'Connexion…' : 'Se connecter'}</button></form></main>;
}
