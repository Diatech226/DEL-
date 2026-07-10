import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth as useClerkAuth, useClerk, useUser } from '@clerk/react';
import { apiGet, apiPost, getErrorMessage, unwrapData } from '../lib/http';

type Ctx={clerkUser:any;delUser:any;user:any;isLoaded:boolean;isSignedIn:boolean;role:string|null;loading:boolean;error:string|null;isAuthenticated:boolean;getDelToken:()=>Promise<string|null>;refreshDelUser:()=>Promise<void>;refreshMe:()=>Promise<void>;logout:()=>Promise<void>;login:(email:string,password:string)=>Promise<void>;register:(payload:any)=>Promise<void>};
const AuthContext=createContext<Ctx|null>(null);
export function AuthProvider({children}:{children:React.ReactNode}){const { isLoaded, isSignedIn, getToken }=useClerkAuth();const { user: clerkUser }=useUser();const clerk=useClerk();const [delUser,setDelUser]=useState<any>(null);const [loading,setLoading]=useState(false);const [error,setError]=useState<string|null>(null);
const getDelToken=useCallback(async()=> isSignedIn ? await getToken() : null,[getToken,isSignedIn]);
const refreshDelUser=useCallback(async()=>{if(!isLoaded||!isSignedIn){setDelUser(null);return;}setLoading(true);setError(null);try{const token=await getToken();const res=unwrapData(await apiPost('/api/auth/clerk/sync', undefined, { token: token || undefined }));setDelUser((res as any)?.user||res);}catch(e){setError(getErrorMessage(e));setDelUser(null);}finally{setLoading(false);}},[getToken,isLoaded,isSignedIn]);
useEffect(()=>{void refreshDelUser();},[refreshDelUser]);
const logout=useCallback(async()=>{await clerk.signOut();setDelUser(null);},[clerk]);
const unsupported=async()=>{throw new Error('DEL-web-main utilise Clerk pour la connexion. Utilisez les composants SignIn/SignUp Clerk.');};
const value=useMemo(()=>({clerkUser,delUser,user:delUser,isLoaded,isSignedIn:Boolean(isSignedIn),role:delUser?.role||null,loading,error,isAuthenticated:Boolean(isSignedIn&&delUser),getDelToken,refreshDelUser,refreshMe:refreshDelUser,logout,login:unsupported,register:unsupported}),[clerkUser,delUser,isLoaded,isSignedIn,loading,error,getDelToken,refreshDelUser,logout]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export const useAuth=()=>{const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used within AuthProvider');return ctx;};
