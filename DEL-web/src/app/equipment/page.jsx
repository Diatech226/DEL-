'use client';
import { useEffect, useState } from 'react';
import { getEquipmentList } from '../../lib/api';
import EquipmentCard from '../../components/EquipmentCard';
export default function EquipmentPage(){const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');useEffect(()=>{getEquipmentList().then(setItems).catch(e=>setError(e.message)).finally(()=>setLoading(false));},[]);return <section className="mx-auto max-w-7xl px-6 py-12"><h1 className="text-4xl font-black">Engins disponibles</h1>{loading&&<p className="panel mt-8">Chargement des engins...</p>}{error&&<p className="alert-error mt-8">{error}</p>}{!loading&&!error&&items.length===0&&<p className="panel mt-8">Aucun engin enregistré pour le moment.</p>}<div className="mt-8 grid gap-6 md:grid-cols-3">{items.map(e=><EquipmentCard key={e._id} equipment={e}/>)}</div></section>}
