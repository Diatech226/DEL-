import { apiGet, apiPost, clearToken, setToken } from '../lib/http';

export async function login(payload: { email: string; password: string }) {
  const data = await apiPost('/api/auth/login', payload);
  const token = data?.token || data?.accessToken;
  if (token) setToken(token);
  return data;
}

export const getMe = () => apiGet('/api/auth/me');
export function logout() { clearToken(); }
