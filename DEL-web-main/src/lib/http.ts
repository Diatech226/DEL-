const TOKEN_KEY = 'del_web_main_token';

export interface ApiError extends Error { status?: number; payload?: unknown; isNetworkError?: boolean }
export type ApiResponse<T = unknown> = { success?: boolean; data?: T; message?: string; error?: string; [key: string]: unknown };

export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
}
export function getToken() { return typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY); }
export function setToken(token: string) { if (typeof window !== 'undefined') window.localStorage.setItem(TOKEN_KEY, token); }
export function clearToken() { if (typeof window !== 'undefined') window.localStorage.removeItem(TOKEN_KEY); }

function buildUrl(path: string) { return `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`; }
export function getErrorMessage(error: unknown) {
  const e = error as ApiError;
  if (e?.isNetworkError) return 'Impossible de joindre l’API DEL.';
  if (e?.status === 401) return 'Votre session a expiré. Veuillez vous reconnecter.';
  if (e?.status === 403) return 'Vous n’êtes pas autorisé à effectuer cette action.';
  if (e?.status && e.status >= 500) return 'Une erreur serveur est survenue.';
  return e?.message || 'Une erreur est survenue.';
}
export async function apiRequest<T = unknown>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  try {
    const response = await fetch(buildUrl(path), { ...options, headers });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : {};
    if (!response.ok) {
      if (response.status === 401) clearToken();
      const err = new Error(payload?.message || payload?.error || response.statusText) as ApiError;
      err.status = response.status; err.payload = payload; throw err;
    }
    return payload;
  } catch (error) {
    if ((error as ApiError).status) throw error;
    const err = new Error('Impossible de joindre l’API DEL.') as ApiError;
    err.isNetworkError = true; err.payload = error; throw err;
  }
}
export const apiGet = <T=unknown>(path: string) => apiRequest<T>(path);
export const apiPost = <T=unknown>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
export const apiPatch = <T=unknown>(path: string, body?: unknown) => apiRequest<T>(path, { method: 'PATCH', body: body === undefined ? undefined : JSON.stringify(body) });
export const apiDelete = <T=unknown>(path: string) => apiRequest<T>(path, { method: 'DELETE' });
export function unwrapData<T>(response: ApiResponse<T>): T { return (response?.data ?? response) as T; }
