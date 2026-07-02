export default function ComingSoon({ title = 'Module à venir', details }) {
  return (
    <section className="rounded-2xl border border-dashed border-gold bg-amber-50 p-6 text-slate-800 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wide text-gold">Roadmap DEL</p>
      <h1 className="mt-2 text-3xl font-black text-coal">{title}</h1>
      <p className="mt-3 text-slate-700">Ce module est prévu dans la roadmap DEL. Il sera activé après stabilisation du workflow principal.</p>
      {details && <p className="mt-3 text-sm text-slate-600">{details}</p>}
    </section>
  );
}
