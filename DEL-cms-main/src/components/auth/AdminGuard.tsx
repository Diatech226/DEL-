import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoginView } from './LoginView';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated, isAdmin, error } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Chargement de la session admin…</div>;
  if (!isAuthenticated) return <LoginView />;
  if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-rose-700">Accès réservé aux administrateurs DEL.</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-rose-700">{error}</div>;
  return <>{children}</>;
}
