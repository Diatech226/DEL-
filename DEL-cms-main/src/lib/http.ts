const TOKEN_KEY = 'del_cms_admin_token';

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function getApiBaseUrl() {
  return (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
}

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export function getToken() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (isBrowser()) window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (isBrowser()) window.localStorage.removeItem(TOKEN_KEY);
}

function errorMessage(status: number) {
  if (status === 401) return 'Session expirée. Veuillez vous reconnecter.';
  if (status === 403) return 'Accès réservé aux administrateurs DEL.';
  if (status >= 500) return 'Erreur serveur DEL-api.';
  return 'Erreur API DEL.';
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  try {
    const response = await fetch(`${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`, {
      ...options,
      headers,
    });
    const text = await response.text();
    const payload = text ? JSON.parse(text) : null;
    if (!response.ok) throw new ApiError(payload?.message || errorMessage(response.status), response.status, payload);
    return payload?.data ?? payload?.items ?? payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('Impossible de joindre l’API DEL.', undefined, error);
  }
}

export const apiGet = (path: string) => apiRequest(path);
export const apiPost = (path: string, body?: unknown) => apiRequest(path, { method: 'POST', body: JSON.stringify(body ?? {}) });
export const apiPatch = (path: string, body?: unknown) => apiRequest(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) });
export const apiDelete = (path: string) => apiRequest(path, { method: 'DELETE' });
