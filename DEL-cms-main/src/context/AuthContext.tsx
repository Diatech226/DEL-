import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError, clearToken, getToken } from '../lib/http';
import * as authService from '../services/auth.service';

type AuthContextValue = {
  admin: any; token: string | null; loading: boolean; error: string | null; isAuthenticated: boolean; isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>; logout: () => void; refreshMe: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<any>(null);
  const [token, setLocalToken] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(Boolean(getToken()));
  const [error, setError] = useState<string | null>(null);
  const isAdmin = admin?.role === 'ADMIN';

  const refreshMe = async () => {
    try {
      setLoading(true); setError(null);
      const me = await authService.getMe();
      const user = me?.user || me;
      if (user?.role !== 'ADMIN') throw new ApiError('Ce compte n’a pas accès au CMS DEL.', 403);
      setAdmin(user);
    } catch (err: any) {
      clearToken(); setLocalToken(null); setAdmin(null); setError(err?.message || 'Session invalide.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (token) void refreshMe(); else setLoading(false); }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true); setError(null);
      const data = await authService.login({ email, password });
      const nextToken = data?.token || data?.accessToken;
      const user = data?.user || data?.admin;
      if (user?.role && user.role !== 'ADMIN') throw new ApiError('Ce compte n’a pas accès au CMS DEL.', 403);
      setLocalToken(nextToken || getToken());
      await refreshMe();
      return true;
    } catch (err: any) {
      clearToken(); setLocalToken(null); setAdmin(null); setError(err?.message || 'Connexion impossible.'); return false;
    } finally { setLoading(false); }
  };

  const logout = () => { authService.logout(); setLocalToken(null); setAdmin(null); };
  const value = useMemo(() => ({ admin, token, loading, error, isAuthenticated: Boolean(token && admin), isAdmin, login, logout, refreshMe }), [admin, token, loading, error, isAdmin]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
