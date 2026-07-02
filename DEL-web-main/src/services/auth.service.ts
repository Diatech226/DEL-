import { apiGet, apiPatch, apiPost, clearToken, setToken, unwrapData } from '../lib/http';
export type LoginPayload={email:string;password:string};
export function login(payload:LoginPayload){return apiPost('/api/auth/login',{ identifier: payload.email, password: payload.password }).then(r=>{const d:any=unwrapData(r); const token=d?.token||d?.accessToken||d?.jwt; if(token) setToken(token); return r;});}
export const register=(payload:unknown)=>apiPost('/api/auth/register',payload);
export const getMe=()=>apiGet('/api/auth/me');
export const updateMe=(payload:unknown)=>apiPatch('/api/auth/me',payload);
export function logout(){clearToken();}
