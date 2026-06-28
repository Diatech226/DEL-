import Link from 'next/link';

const sectors = ['Mines', 'BTP', 'Logistique', 'Grands chantiers'];

export default function HomePage() {
  return <div><section className="bg-charcoal text-white"><div className="mx-auto max-w-6xl px-6 py-20"><p className="font-semibold text-gold">DEL Dia Equipement et Logistique</p><h1 className="mt-4 max-w-3xl text-5xl font-bold">Placez, louez, vendez et trouvez des engins industriels fiables.</h1><p className="mt-6 max-w-2xl text-lg text-slate-300">Une marketplace SaaS pour connecter propriétaires d'engins, mines, entreprises BTP et opérateurs logistiques.</p><div className="mt-8 flex gap-4"><Link className="btn" href="/equipment">Voir les engins</Link><Link className="rounded-xl border border-white px-5 py-3 font-semibold" href="/requests/new">Publier une demande</Link></div></div></section><section className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-4">{sectors.map((sector) => <div className="card" key={sector}><h2 className="text-xl font-bold">{sector}</h2><p className="mt-2 text-slate-600">Matching d'actifs, demandes qualifiées et propositions validées par l'administration.</p></div>)}</section></div>;
}
