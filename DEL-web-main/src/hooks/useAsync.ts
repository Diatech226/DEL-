import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../lib/http';
export function useAsync<T>(fn:()=>Promise<T>, deps:unknown[]=[]){const [data,setData]=useState<T|null>(null);const [loading,setLoading]=useState(true);const [error,setError]=useState<string|null>(null);const run=useCallback(async()=>{setLoading(true);setError(null);try{setData(await fn());}catch(e){setError(getErrorMessage(e));}finally{setLoading(false);}},deps);useEffect(()=>{void run();},[run]);return{data,loading,error,refetch:run};}
