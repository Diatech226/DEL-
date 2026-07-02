import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import SectionTitle from '../components/ui/SectionTitle';
import { getPublicSettings } from '../lib/api';

const fallback = {
  platformName: 'DEL',
  slogan: 'MVP de mise en relation et gestion d’engins industriels.',
  description: 'DEL connecte propriétaires d’engins et entreprises pour qualifier les besoins, créer des propositions, contrats, factures, documents et missions simples.',
};

const mvpCapabilities = ['Déposer un engin', 'Demander des engins', 'Appels d’offres', 'Suivi DEL', 'Contrats / factures / documents', 'Missions et maintenance simples'];
const steps = ['Dépôt ou demande', 'Qualification DEL', 'Matching admin', 'Proposition', 'Acceptations', 'Contrat, facture et mission'];
const future = ['Paiement réel', 'GPS réel', 'Vidéo', 'Investissement fractionné', 'IA avancée', 'Messagerie temps réel'];

export default async function Home() {
  let settings = fallback;
  try { settings = { ...fallback, ...(await getPublicSettings()) }; } catch {}
  return <div>
    <section className="industrial-grid bg-coal text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <div>
          <p className="font-black uppercase tracking-wide text-gold">{settings.platformName} · MVP</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight md:text-6xl">Gérez le placement d’engins industriels sans surpromesse.</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">{settings.description}</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button href="/deposer-un-engin">Déposer un engin</Button><Button href="/demander-des-engins" variant="outline">Demander des engins</Button><Button href="/appels-offres" variant="ghost" className="text-white hover:bg-white/10">Appels d’offres</Button></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-4"><StatCard label="Workflow" value="MVP" hint="stable"/><StatCard label="Matching" value="Admin"/><StatCard label="Documents" value="Suivis"/><StatCard label="PDF" value="Essentiels"/></div>
        </div>
        <div className="rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur"><div className="rounded-2xl bg-slate-950 p-5"><div className="flex justify-between text-sm text-slate-300"><span>Parcours DEL</span><span className="text-emerald-300">● Démo prête</span></div><div className="mt-6 grid gap-3">{steps.slice(0,5).map((x,i)=><div className="rounded-xl border border-white/10 bg-white/5 p-4" key={x}><b>0{i+1} · {x}</b><div className="mt-3 h-2 rounded bg-slate-800"><div className="h-2 rounded bg-gold" style={{width:[95,82,70,58,44][i]+'%'}}/></div></div>)}</div></div></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16"><SectionTitle kicker="MVP" title="Ce que DEL permet maintenant" description="Un socle professionnel pour démontrer le workflow principal : engins, demandes, matching, propositions, acceptations, contrat, facture, mission et documents."/><div className="mt-10 grid gap-5 md:grid-cols-3">{mvpCapabilities.map(x=><Card key={x}><div className="text-2xl text-gold">◆</div><h3 className="mt-3 text-xl font-black">{x}</h3><p className="mt-2 text-slate-600">Fonctionnalité prioritaire du MVP, pensée pour une démonstration claire et exploitable.</p></Card>)}</div></section>
    <section className="bg-white px-6 py-16"><SectionTitle kicker="Méthode" title="Workflow de démonstration"/><div className="mx-auto mt-10 grid max-w-7xl gap-4 md:grid-cols-6">{steps.map((x,i)=><Card key={x}><b className="text-gold">0{i+1}</b><p className="mt-3 font-bold">{x}</p></Card>)}</div></section>
    <section className="mx-auto grid max-w-7xl gap-6 px-6 py-16 md:grid-cols-2"><Card className="bg-coal text-white"><h2 className="text-3xl font-black">Pour les propriétaires</h2><ul className="mt-5 grid gap-3 text-slate-200"><li>Déposer des engins disponibles.</li><li>Recevoir des propositions qualifiées.</li><li>Suivre contrats, factures, documents et missions.</li></ul></Card><Card><h2 className="text-3xl font-black">Pour les entreprises</h2><ul className="mt-5 grid gap-3 text-slate-600"><li>Créer une demande claire.</li><li>Recevoir une proposition DEL.</li><li>Centraliser le suivi administratif et opérationnel.</li></ul></Card></section>
    <section className="bg-slate-100 px-6 py-16"><div className="mx-auto max-w-7xl"><SectionTitle kicker="Prochaines évolutions" title="Ce qui n’est pas promis dans le MVP" description="Ces modules sont prévus après stabilisation du workflow principal."/><div className="mt-8 flex flex-wrap gap-3">{future.map(x=><span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm" key={x}>{x}</span>)}</div></div></section>
    <section className="bg-forest px-6 py-16 text-center text-white"><h2 className="text-4xl font-black">Démarrer le parcours DEL</h2><p className="mx-auto mt-3 max-w-2xl text-emerald-50">Un MVP lisible pour vendre, démontrer et améliorer avec les premiers utilisateurs.</p><Button href="/onboarding" className="mt-6">Commencer avec DEL</Button></section>
  </div>;
}
