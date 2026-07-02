import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as auth from '../services/auth.service';
import { clearToken, getErrorMessage, getToken, setToken, unwrapData } from '../lib/http';
type Ctx={user:any;token:string|null;loading:boolean;error:string|null;isAuthenticated:boolean;login:(email:string,password:string)=>Promise<void>;register:(payload:any)=>Promise<void>;logout:()=>void;refreshMe:()=>Promise<void>};
const AuthContext=createContext<Ctx|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}){const [user,setUser]=useState<any>(null);const [tokenState,setTokenState]=useState<string|null>(getToken());const [loading,setLoading]=useState(Boolean(getToken()));const [error,setError]=useState<string|null>(null);
const refreshMe=async()=>{try{setLoading(true);setError(null);const me=unwrapData(await auth.getMe());setUser((me as any)?.user||me);}catch(e){if((e as any)?.status===401){clearToken();setTokenState(null);setUser(null);}setError(getErrorMessage(e));}finally{setLoading(false);}};
useEffect(()=>{if(tokenState) void refreshMe(); else setLoading(false);},[]);
const login=async(email:string,password:string)=>{setLoading(true);setError(null);try{const res=unwrapData(await auth.login({email,password}));const token=(res as any)?.token||(res as any)?.accessToken||(res as any)?.jwt;if(token){setToken(token);setTokenState(token);} await refreshMe();}catch(e){setError(getErrorMessage(e));throw e;}finally{setLoading(false);}};
const register=async(payload:any)=>{setLoading(true);setError(null);try{const res=unwrapData(await auth.register(payload));const token=(res as any)?.token||(res as any)?.accessToken||(res as any)?.jwt;if(token){setToken(token);setTokenState(token);await refreshMe();}}catch(e){setError(getErrorMessage(e));throw e;}finally{setLoading(false);}};
const logout=()=>{auth.logout();setTokenState(null);setUser(null);};
const value=useMemo(()=>({user,token:tokenState,loading,error,isAuthenticated:Boolean(user&&tokenState),login,register,logout,refreshMe}),[user,tokenState,loading,error]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export const useAuth=()=>{const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used within AuthProvider');return ctx;};
